use serde::Serialize;

use crate::repository::visualization::QuestionVisulization;

#[derive(Debug, Serialize)]
pub struct SearchVisualizationsView {
    cannonical_name: String,
    id: i64,
}

impl SearchVisualizationsView {
    pub fn from_model(qv: &QuestionVisulization) -> Self {
        Self {
            cannonical_name: format!(
                "{} - {}",
                qv.question_title.clone().unwrap_or_default(),
                qv.visualization_name.clone().unwrap_or_default()
            ),
            id: qv.visualization_id,
        }
    }
}
