extern crate proc_macro;

use syn::Token;

use proc_macro::TokenStream;
use quote::quote;
use syn::Meta;
use syn::{
    parse::{Parse, ParseStream},
    parse_macro_input, Ident, ItemStruct, LitStr, Result,
};
use syn::{Data, DeriveInput, Fields, Lit, NestedMeta};

#[proc_macro_derive(Changeset, attributes(skip_in_changeset, table_name, id_data_type))]
pub fn derive_changeset(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);

    let name = ast.ident;
    let mut changeset_fields = vec![];
    let mut table_name = pluralized_snakecase(name.to_string());
    let mut id_data_type = "i32".to_string();

    // Extract table_name attribute if it exists
    for attr in &ast.attrs {
        if attr.path.is_ident("table_name") {
            if let Meta::NameValue(name_value) = attr.parse_meta().unwrap() {
                if let syn::Lit::Str(lit_str) = name_value.lit {
                    table_name = lit_str.value();
                }
            }
        }
        if attr.path.is_ident("id_data_type") {
            if let Meta::NameValue(name_value) = attr.parse_meta().unwrap() {
                if let syn::Lit::Str(lit_str) = name_value.lit {
                    id_data_type = lit_str.value();
                }
            }
        }
    }

    if let Data::Struct(data_struct) = ast.data {
        if let Fields::Named(fields_named) = data_struct.fields {
            for field in fields_named.named {
                let ident = field.ident.unwrap();
                let ty = field.ty;
                let serde_attrs: Vec<Meta> = field
                    .attrs
                    .iter()
                    .filter(|attr| {
                        attr.path
                            .segments
                            .iter()
                            .any(|segment| segment.ident == "serde")
                    })
                    .map(|attr| attr.parse_meta().unwrap())
                    .collect();

                // Skip fields with the #[skip] attribute
                if field
                    .attrs
                    .iter()
                    .any(|attr| attr.path.is_ident("skip_in_changeset"))
                {
                    continue;
                }

                let serde_quote = if serde_attrs.len() > 0 {
                    quote! {

                    #[#(#serde_attrs)*]
                    }
                } else {
                    quote! {}
                };

                changeset_fields.push(quote! {
                    #serde_quote
                    pub #ident: #ty,
                });
            }
        }
    }

    let changeset_name = Ident::new(&format!("{}Changeset", name), name.span());

    let table_name_ident = syn::Ident::new(table_name.as_str(), proc_macro2::Span::call_site());
    let id_data_type_ident = syn::Ident::new(id_data_type.as_str(), proc_macro2::Span::call_site());
    let table_name_tokens = quote! { diesel(table_name = #table_name_ident) };

    let expanded = quote! {

        // use chrono::Utc;

        // use diesel::AsChangeset;
        // use diesel::Insertable;
        // use serde::Serialize;
        // use use serde::Deserialize;

        #[derive(AsChangeset, Insertable, Debug, Serialize, Deserialize, Clone,)]
        #[#table_name_tokens]
        pub struct #changeset_name {
            #(#changeset_fields)*
        }

        impl #name {
            pub fn create(conn: &mut PgConnection, model: #changeset_name) -> Result<Self, Error> {
                let new_record = #changeset_name {
                    inserted_at: Utc::now().naive_utc(),
                    updated_at: Utc::now().naive_utc(),
                    ..model.clone()
                };
                diesel::insert_into(#table_name_ident::table)
                    .values(model)
                    .get_result(conn)
            }

            pub fn index(conn: &mut PgConnection) -> Result<Vec<Self>, Error> {
                #table_name_ident::table.load::<Self>(conn)
            }

            pub fn find(conn: &mut PgConnection, pk: #id_data_type_ident) -> Result<Self, Error> {
                #table_name_ident::table.find(pk).first(conn)
            }

            pub fn update(
                conn: &mut PgConnection,
                pk: #id_data_type_ident,
                updated_model: #changeset_name,
            ) -> Result<Self, Error> {
                let updated_record = #changeset_name {
                    updated_at: Utc::now().naive_utc(),
                    ..updated_model
                };
                diesel::update(#table_name_ident::table.find(pk))
                    .set(updated_record)
                    .get_result(conn)
            }

            pub fn delete(conn: &mut PgConnection, pk: #id_data_type_ident) -> Result<(), Error> {
                diesel::delete(#table_name_ident::table.find(pk)).execute(conn)?;
                Ok(())
            }
        }

    };

    // let ts = TokenStream::from(expanded);
    // println!("==============================={}", ts);
    // ts
    TokenStream::from(expanded)
}

#[proc_macro_derive(View, attributes(view_skip_fields, view_name))]
pub fn derive_view(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;

    // Default view name is <StructName>View
    let mut view_name = Ident::new(&format!("{}View", name), name.span());

    let mut view_fields = vec![];
    let mut view_field_names = vec![];
    let mut skip_fields = vec![];

    // Read the list of fields to skip and custom view name from the attributes

    for attr in &ast.attrs {
        if attr.path.is_ident("view_skip_fields") {
            if let Ok(syn::Meta::NameValue(name_value)) = attr.parse_meta() {
                if let syn::Lit::Str(lit_str) = name_value.lit {
                    let fields = lit_str.value();
                    for field in fields.split(",") {
                        skip_fields.push(field.trim().to_string())
                    }
                }
            }
        }
        if attr.path.is_ident("view_name") {
            if let Ok(syn::Meta::NameValue(name_value)) = attr.parse_meta() {
                if let syn::Lit::Str(lit_str) = name_value.lit {
                    view_name = Ident::new(&lit_str.value(), name.span());
                }
            }
        }
    }
    if let Data::Struct(data_struct) = ast.data {
        if let Fields::Named(fields_named) = data_struct.fields {
            for field in fields_named.named {
                let field_name = field.ident.clone().unwrap(); // Clone the Ident
                if skip_fields.contains(&field_name.to_string()) {
                    continue;
                }
                let filtered_attrs: Vec<_> = field
                    .attrs
                    .iter()
                    .filter(|attr| !attr.path.is_ident("skip_in_changeset"))
                    .cloned()
                    .collect();

                let modified_field = syn::Field {
                    attrs: filtered_attrs,
                    ..field.clone()
                };

                view_field_names.push(field_name);
                view_fields.push(modified_field);
            }
        }
    }

    let expanded = quote! {
        #[derive(Debug, Serialize, Deserialize, Clone)]
        pub struct #view_name {
            #(#view_fields),*
        }

        impl #view_name {
            pub fn from_model(model: &#name) -> Self {
                Self {
                    #(
                        #view_field_names: model.#view_field_names.clone(),
                    )*
                }
            }
        }
    };

    // let ts = TokenStream::from(expanded);
    // println!("==============================={}", ts);
    // ts
    TokenStream::from(expanded)
}

#[proc_macro_derive(DatabaseEnum, attributes(diesel))]
pub fn derive_database_enum(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;

    let variants = if let Data::Enum(e) = input.data {
        e.variants
    } else {
        panic!("DatabaseEnum can only be used with enums");
    };

    let variant_names: Vec<_> = variants.iter().map(|v| &v.ident).collect();
    let variant_values: Vec<_> = variants
        .iter()
        .filter_map(|v| {
            if let Fields::Unit = v.fields {
                if let Some((_, expr)) = &v.discriminant {
                    match expr {
                        syn::Expr::Lit(expr_lit) => {
                            if let syn::Lit::Int(lit_int) = &expr_lit.lit {
                                Some(lit_int.base10_parse::<i32>().unwrap())
                            } else {
                                None
                            }
                        }
                        _ => None,
                    }
                } else {
                    None
                }
            } else {
                None
            }
        })
        .collect();

    let expanded = quote! {
        impl ToSql<Int4, Pg> for #name {
            fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
                let value: i32 = match *self {
                    #(#name::#variant_names => #variant_values,)*
                };
                let mut new_out = out.reborrow();
                ToSql::<Int4, Pg>::to_sql(&value, &mut new_out)
            }
        }

        impl FromSql<Int4, Pg> for #name {
            fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
                match i32::from_sql(bytes)? {
                    #(#variant_values => Ok(#name::#variant_names),)*
                    _ => Err("Unrecognized enum value".into()),
                }
            }
        }

    };

    // let ts = TokenStream::from(expanded);
    // println!("==============================={}", ts);
    // ts
    TokenStream::from(expanded)
}

extern crate inflector;

use inflector::cases::snakecase::to_snake_case;
use inflector::string::pluralize::to_plural;

fn pluralized_snakecase(input: String) -> String {
    to_plural(&to_snake_case(input.as_str()))
}
