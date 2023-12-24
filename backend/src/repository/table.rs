use crate::app::results::adapters::{ForeignKey, PrimaryKey};

use super::models::{FkType, ForeignKeyChangeset, Table};
use super::schema::{columns_, foreign_keys, tables};
use chrono::Utc;
use diesel::dsl::not;
use diesel::result::Error;

use diesel::prelude::*;

use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl Table {
    pub fn search(conn: &mut PgConnection, dbid: &i32, q: String) -> Result<Vec<Self>, Error> {
        tables::table
            .filter(
                tables::database_id
                    .eq(dbid)
                    .and(tables::name.ilike(format!("%{}%", q))),
            )
            .order(tables::name.asc())
            .select(tables::all_columns)
            .load::<Self>(conn)
    }

    pub fn find_matching_by_database_id(
        conn: &mut PgConnection,
        database_id: i32,
        prefix: &str,
    ) -> Result<Vec<Self>, Error> {
        tables::table
            .filter(
                tables::database_id
                    .eq(database_id)
                    .and(tables::name.ilike(format!("{}%", prefix))),
            )
            .order(tables::name.asc())
            .select(tables::all_columns)
            .load::<Self>(conn)
    }
    pub fn find_by_name_and_database_id(
        conn: &mut PgConnection,
        name: String,
        database_id: i32,
    ) -> Result<Self, Error> {
        tables::table
            .filter(
                tables::name
                    .eq(name)
                    .and(tables::database_id.eq(database_id)),
            )
            .select(tables::all_columns)
            .first::<Self>(conn)
    }

    pub fn delete_old_tables(
        conn: &mut PgConnection,
        table_names: &Vec<String>,
        database_id: i32,
    ) -> Result<(), Error> {
        conn.transaction::<_, Error, _>(|conn| {
            let table_ids = tables::table
                .filter(
                    not(tables::name.eq_any(table_names)).and(tables::database_id.eq(database_id)),
                )
                .select(tables::id)
                .load::<i32>(conn)?;

            diesel::delete(columns_::table.filter(columns_::table_id.eq_any(&table_ids)))
                .execute(conn)?;
            diesel::delete(tables::table.filter(tables::id.eq_any(&table_ids))).execute(conn)?;
            Ok(())
        })?;

        Ok(())
    }

    pub fn delete_old_primary_keys(conn: &mut PgConnection, database_id: i32) -> Result<(), Error> {
        conn.transaction::<_, Error, _>(|conn| {
            let subquery = tables::table
                .filter(tables::database_id.eq(database_id))
                .select(tables::id.nullable());

            let target = columns_::table.filter(columns_::table_id.eq_any(subquery));

            diesel::update(target)
                .set(columns_::primary_key.eq(false))
                .execute(conn)?;
            Ok(())
        })?;
        Ok(())
    }

    pub fn update_primary_keys(
        conn: &mut PgConnection,
        database_id: i32,
        primary_keys: Vec<PrimaryKey>,
    ) -> Result<(), Error> {
        conn.transaction::<_, Error, _>(|conn| {
            for primary_key in primary_keys {
                let subquery = tables::table
                    .filter(tables::database_id.eq(database_id))
                    .filter(tables::name.eq(primary_key.table_name))
                    .select(tables::id.nullable());

                let target = columns_::table.filter(
                    columns_::table_id
                        .eq_any(subquery)
                        .and(columns_::name.eq(primary_key.column_name)),
                );
                diesel::update(target)
                    .set(columns_::primary_key.eq(true))
                    .execute(conn)?;
            }
            Ok(())
        })?;
        Ok(())
    }

    pub fn delete_old_foreign_keys(conn: &mut PgConnection, dbid: i32) -> Result<(), Error> {
        conn.transaction::<_, Error, _>(|conn| {
            let target_ids = foreign_keys::table
                .inner_join(columns_::table.on(columns_::id.nullable().eq(foreign_keys::column_id)))
                .inner_join(tables::table.on(columns_::table_id.eq(tables::id.nullable())))
                .filter(tables::database_id.eq(dbid))
                .select(foreign_keys::id)
                .load::<i32>(conn)?;

            diesel::delete(foreign_keys::table.filter(foreign_keys::id.eq_any(target_ids)))
                .execute(conn)?;
            // diesel::delete(tables::table.filter(tables::id.eq(id))).execute(conn)?;
            Ok(())
        })?;
        Ok(())
    }
    pub fn update_foreign_keys(
        conn: &mut PgConnection,
        dbid: i32,
        foreign_keys: Vec<ForeignKey>,
    ) -> Result<(), Error> {
        conn.transaction::<_, Error, _>(|conn| {
            for fkey in foreign_keys {
                let column_id = columns_::table
                    .inner_join(tables::table.on(tables::id.nullable().eq(columns_::table_id)))
                    .filter(tables::database_id.eq(dbid))
                    .filter(tables::name.eq(fkey.table_name))
                    .filter(columns_::name.eq(fkey.column_name))
                    .select(columns_::id)
                    .first::<i32>(conn)?;
                let foreign_column_id = columns_::table
                    .inner_join(tables::table.on(tables::id.nullable().eq(columns_::table_id)))
                    .filter(tables::database_id.eq(dbid))
                    .filter(tables::name.eq(fkey.foreign_table_name))
                    .filter(columns_::name.eq(fkey.foreign_column_name))
                    .select(columns_::id)
                    .first::<i32>(conn)?;
                let fkey_changeset = ForeignKeyChangeset {
                    name: Some(fkey.relation_name),
                    fk_type: Some(FkType::Fk),
                    column_id: Some(column_id),
                    foreign_column_id: Some(foreign_column_id),
                    inserted_at: Utc::now().naive_utc(),
                    updated_at: Utc::now().naive_utc(),
                };

                diesel::insert_into(foreign_keys::table)
                    .values(fkey_changeset)
                    .execute(conn)?;
            }

            Ok(())
        })?;
        Ok(())
    }
}
