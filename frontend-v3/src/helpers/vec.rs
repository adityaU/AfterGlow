use std::collections::HashSet;

pub trait Uniqueable {
    fn unique(&self) -> Self;
}

impl<V> Uniqueable for Vec<V>
where
    V: Clone + Eq + std::hash::Hash,
{
    fn unique(&self) -> Self {
        let set: HashSet<_> = self.iter().cloned().collect();
        set.into_iter().collect()
    }
}
