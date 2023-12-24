extern crate proc_macro;

use proc_macro::TokenStream;
use syn::Meta;
use syn::{parse_macro_input, Ident};
use syn::{Data, DeriveInput, Fields};

use std::collections::HashSet;

use proc_macro2::{Literal, TokenTree};
use quote::{quote, quote_spanned, ToTokens};
use rstml::{
    node::{Node, NodeAttribute, NodeName},
    Parser, ParserConfig,
};
use syn::spanned::Spanned;

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

        #[derive(AsChangeset, Insertable, Debug, Serialize, Deserialize, Clone,Default)]
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
        #[derive(Debug, Serialize, Deserialize, Clone, Default)]
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

#[derive(Default)]
struct WalkNodesOutput<'a> {
    static_format: String,
    // Use proc_macro2::TokenStream instead of syn::Expr
    // to provide more errors to the end user.
    values: Vec<proc_macro2::TokenStream>,
    // Additional diagnostic messages.
    diagnostics: Vec<proc_macro2::TokenStream>,
    // Collect elements to provide semantic highlight based on element tag.
    // No differences between open tag and closed tag.
    // Also multiple tags with same name can be present,
    // because we need to mark each of them.
    collected_elements: Vec<&'a NodeName>,
}
impl<'a> WalkNodesOutput<'a> {
    fn extend(&mut self, other: WalkNodesOutput<'a>) {
        self.static_format.push_str(&other.static_format);
        self.values.extend(other.values);
        self.diagnostics.extend(other.diagnostics);
        self.collected_elements.extend(other.collected_elements);
    }
}

fn walk_nodes<'a>(empty_elements: &HashSet<&str>, nodes: &'a Vec<Node>) -> WalkNodesOutput<'a> {
    let mut out = WalkNodesOutput::default();

    for node in nodes {
        match node {
            Node::Doctype(doctype) => {
                let value = &doctype.value.to_token_stream_string();
                out.static_format.push_str(&format!("<!DOCTYPE {}>", value));
            }
            Node::Element(element) => {
                let name = element.name().to_string();
                out.static_format.push_str(&format!("<{}", name));
                out.collected_elements.push(&element.open_tag.name);
                if let Some(e) = &element.close_tag {
                    out.collected_elements.push(&e.name)
                }

                // attributes
                for attribute in element.attributes() {
                    match attribute {
                        NodeAttribute::Block(block) => {
                            // If the nodes parent is an attribute we prefix with whitespace
                            out.static_format.push(' ');
                            out.static_format.push_str("{}");
                            out.values.push(block.to_token_stream());
                        }
                        NodeAttribute::Attribute(attribute) => {
                            out.static_format.push_str(&format!(" {}", attribute.key));
                            if let Some(value) = attribute.value() {
                                out.static_format.push_str(r#"="{}""#);
                                out.values.push(value.to_token_stream());
                            }
                        }
                    }
                }
                // Ignore childs of special Empty elements
                if empty_elements.contains(element.open_tag.name.to_string().as_str()) {
                    out.static_format
                        .push_str(&format!("/</{}>", element.open_tag.name));
                    if !element.children.is_empty() {
                        let warning = proc_macro2_diagnostics::Diagnostic::spanned(
                            element.open_tag.name.span(),
                            proc_macro2_diagnostics::Level::Warning,
                            "Element is processed as empty, and cannot have any child",
                        );
                        out.diagnostics.push(warning.emit_as_expr_tokens())
                    }

                    continue;
                }
                out.static_format.push('>');

                // children
                let other_output = walk_nodes(empty_elements, &element.children);
                out.extend(other_output);
                out.static_format.push_str(&format!("</{}>", name));
            }
            Node::Text(text) => {
                out.static_format.push_str(&text.value_string());
            }
            Node::RawText(text) => {
                out.static_format.push_str("{}");
                let tokens = text.to_string_best();
                let literal = Literal::string(&tokens);

                out.values.push(TokenTree::from(literal).into());
            }
            Node::Fragment(fragment) => {
                let other_output = walk_nodes(empty_elements, &fragment.children);
                out.extend(other_output)
            }
            Node::Comment(comment) => {
                out.static_format.push_str("<!-- {} -->");
                out.values.push(comment.value.to_token_stream());
            }
            Node::Block(block) => {
                out.static_format.push_str("{}");
                out.values.push(block.to_token_stream());
            }
        }
    }

    out
}

/// Converts HTML to `String`.
///
/// Values returned from braced blocks `{}` are expected to return something
/// that implements `Display`.
///
/// See [rstml docs](https://docs.rs/rstml/) for supported tags and syntax.
///
/// # Example
///
/// ```
/// use rstml_to_string_macro::html;
/// // using this macro, one should write docs module on top level of crate.
/// // Macro will link html tags to them.
/// pub mod docs {
///     /// Element has open and close tags, content and attributes.
///     pub fn element() {}
/// }
/// # fn main (){
///
/// let world = "planet";
/// assert_eq!(html!(<div>"hello "{world}</div>), "<div>hello planet</div>");
/// # }
/// ```
#[proc_macro]
pub fn html(tokens: TokenStream) -> TokenStream {
    html_inner(tokens, false)
}

/// Same as html but also emit IDE helper statements.
/// Open tests.rs in ide to see semantic highlight/goto def and docs.
#[proc_macro]
pub fn html_ide(tokens: TokenStream) -> TokenStream {
    html_inner(tokens, true)
}

fn html_inner(tokens: TokenStream, ide_helper: bool) -> TokenStream {
    // https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
    let empty_elements: HashSet<_> = [
        "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param",
        "source", "track", "wbr",
    ]
    .into_iter()
    .collect();
    let config = ParserConfig::new()
        .recover_block(true)
        .always_self_closed_elements(empty_elements.clone())
        .raw_text_elements(["script", "style"].into_iter().collect());

    let parser = Parser::new(config);
    let (nodes, errors) = parser.parse_recoverable(tokens).split_vec();

    let WalkNodesOutput {
        static_format: html_string,
        values,
        collected_elements: elements,
        diagnostics,
    } = walk_nodes(&empty_elements, &nodes);
    let docs = if ide_helper {
        generate_tags_docs(elements)
    } else {
        vec![]
    };
    let errors = errors
        .into_iter()
        .map(|e| e.emit_as_expr_tokens())
        .chain(diagnostics);
    quote! {
        {
            // Make sure that "compile_error!(..);"  can be used in this context.
            #(#errors;)*
            // Make sure that "enum x{};" and "let _x = crate::element;"  can be used in this context
            #(#docs;)*
            format!(#html_string, #(#values),*)
        }
    }
    .into()
}

fn generate_tags_docs(elements: Vec<&NodeName>) -> Vec<proc_macro2::TokenStream> {
    // Mark some of elements as type,
    // and other as elements as fn in crate::docs,
    // to give an example how to link tag with docs.
    let elements_as_type: HashSet<&'static str> = vec!["html", "head", "meta", "link", "body"]
        .into_iter()
        .collect();

    elements
        .into_iter()
        .map(|e| {
            if elements_as_type.contains(&*e.to_string()) {
                let element = quote_spanned!(e.span() => enum);
                quote!({#element X{}})
            } else {
                // let _ = crate::docs::element;
                let element = quote_spanned!(e.span() => element);
                quote!(let _ = crate::docs::#element)
            }
        })
        .collect()
}
