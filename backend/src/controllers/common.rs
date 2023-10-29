use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
pub struct ResponseData<T> {
    pub data: T,
}

#[derive(Serialize, Deserialize)]
pub struct ResponseError<T> {
    pub error: T,
}

#[derive(Serialize, Deserialize)]
pub struct OpResult {
    pub success: bool,
}

pub const OP_SUCCESS: OpResult = OpResult { success: true };
