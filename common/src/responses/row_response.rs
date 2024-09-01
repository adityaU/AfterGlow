use serde::{Deserialize, Serialize};

use crate::models::row::RowElement;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Default)]
pub struct SingleRowResponse {
    pub row: Vec<RowElement>,
    pub columns: Vec<String>,
}
