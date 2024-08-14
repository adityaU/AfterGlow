pub enum RowElement {
    Text(String),
    Number(IntOrFloat),
    Boolean(bool),
    Date(String),
    Time(String),
    DateTime(String),
    Array(Vec<String>),
}

pub enum IntOrFloat {
    Int(i64),
    Float(f64),
}
