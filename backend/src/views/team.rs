use std::collections::HashMap;

use chrono::NaiveDateTime;
use diesel::{result::Error, PgConnection};

use crate::repository::models::{Team};
use serde::{Deserialize, Serialize};



#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct PreloadedTeamView {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub accessible_databases_count: i64,
    pub users_count: i64,
}

impl PreloadedTeamView {
    pub fn from_model_list(conn: &mut PgConnection, teams: Vec<Team>) -> Result<Vec<Self>, Error> {
        let team_ids = teams.iter().map(|team| team.id).collect::<Vec<i32>>();
        let accessible_databases = Team::find_accessible_databases_count(conn, &team_ids)?;
        let users = Team::find_users_count(conn, &team_ids)?;
        let mut accessible_databases_map: HashMap<i32, i64> = HashMap::new();

        for db in accessible_databases {
            accessible_databases_map.insert(db.team_id.unwrap(), db.count);
        }

        let mut users_map: HashMap<i32, i64> = HashMap::new();

        for u in users {
            users_map.insert(u.team_id.unwrap(), u.count);
        }
        let mut result = Vec::new();
        for team in teams {
            result.push(Self::from_team_database_view(
                team,
                &accessible_databases_map,
                &users_map,
            ));
        }
        Ok(result)
    }
    fn from_team_database_view(
        team: Team,
        accessible_databases: &HashMap<i32, i64>,
        users_map: &HashMap<i32, i64>,
    ) -> Self {
        let dbs = accessible_databases.get(&team.id).unwrap_or(&0i64);
        let users = users_map.get(&team.id).unwrap_or(&0i64);

        Self {
            id: team.id,
            name: team.name,
            description: team.description,
            inserted_at: team.inserted_at,
            updated_at: team.updated_at,
            accessible_databases_count: dbs.clone(),
            users_count: users.clone(),
        }
    }
}
