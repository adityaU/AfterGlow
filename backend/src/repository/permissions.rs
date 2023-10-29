use super::models::Permission;
use super::schema::permissions::dsl::*;

use diesel::result::Error;
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl Permission {
    pub fn create(conn: &mut PgConnection, model: &Self) -> Result<Self, Error> {
        diesel::insert_into(permissions)
            .values(model)
            .get_result(conn)
    }

    pub fn index(conn: &mut PgConnection) -> Result<Vec<Self>, Error> {
        permissions.load::<Self>(conn)
    }

    pub fn read(conn: &mut PgConnection, pk: i64) -> Result<Self, Error> {
        permissions.find(pk).first(conn)
    }

    pub fn update(conn: &mut PgConnection, pk: i64, updated_model: &Self) -> Result<Self, Error> {
        diesel::update(permissions.find(pk))
            .set(updated_model)
            .get_result(conn)
    }

    pub fn delete(conn: &mut PgConnection, pk: i64) -> Result<(), Error> {
        diesel::delete(permissions.find(pk)).execute(conn)?;
        Ok(())
    }
}
