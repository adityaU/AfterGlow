use std::fmt::format;
use std::io;

use chrono::Utc;
use diesel::prelude::Insertable;
use diesel::prelude::*;
use diesel::query_builder::AsChangeset;
use diesel::PgConnection;
use diesel::RunQueryDsl;
use rand::Rng;
use ring::aead::Nonce;
use ring::aead::NonceSequence;
use ring::aead::NONCE_LEN;
use ring::error::Unspecified;
use ring::{
    aead::{self, Aad, BoundKey},
    rand::{SecureRandom, SystemRandom},
};
use serde::Deserialize;
use serde::Serialize;

use super::{
    models::SystemVariable,
    schema::system_variables::{self},
};
#[derive(AsChangeset, Insertable, Debug, Serialize, Deserialize, Clone, Default)]
#[table_name = "system_variables"]
pub struct SystemVariableChangeset {
    pub name: String,
    pub value: Vec<u8>,
    pub additional_data: Vec<u8>,
    pub inserted_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

struct CounterNonceSequence(u32);

impl NonceSequence for CounterNonceSequence {
    // called once for each seal operation
    fn advance(&mut self) -> Result<Nonce, Unspecified> {
        let mut nonce_bytes = vec![0; NONCE_LEN];

        let bytes = self.0.to_be_bytes();
        nonce_bytes[8..].copy_from_slice(&bytes);

        self.0 += 1; // advance the counter
        Nonce::try_assume_unique_for_key(&nonce_bytes)
    }
}

impl SystemVariable {
    fn encrypt(value: String) -> Result<(Vec<u8>, Vec<u8>), io::Error> {
        // Retrieve the encryption key from the environment variable or use a default one
        let key = std::env::var("AG_ENCRYPTION_KEY")
            .unwrap_or_else(|_| "37467a23239fcb518aa1f040aa42f3b8".to_string());
        let key_bytes = key.as_bytes();

        // Ensure the key length is appropriate for AES-256-GCM
        if key_bytes.len() != 32 {
            return Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                "Key must be 32 bytes long",
            ));
        }

        let unbound_key = aead::UnboundKey::new(&aead::AES_256_GCM, key_bytes).map_err(|err| {
            io::Error::new(
                io::ErrorKind::Other,
                format!("Could not create unbound key: {}", err),
            )
        })?;
        let sealing_key = aead::LessSafeKey::new(unbound_key);

        // Create a nonce
        let mut nonce = [0u8; 12]; // 96-bit nonce for AES-GCM
        SystemRandom::new().fill(&mut nonce).map_err(|err| {
            io::Error::new(
                io::ErrorKind::Other,
                format!("Could not generate nonce: {}", err),
            )
        })?;

        // Convert value to a mutable vector
        let mut in_out = value.into_bytes();

        println!("into bytes: {:?}", in_out);

        // Encrypt the data
        let tag = sealing_key
            .seal_in_place_separate_tag(
                aead::Nonce::assume_unique_for_key(nonce),
                aead::Aad::empty(),
                &mut in_out,
            )
            .map_err(|err| {
                io::Error::new(
                    io::ErrorKind::Other,
                    format!("Could not encrypt value: {}", err),
                )
            })?;

        println!("in out {:?}", in_out);

        // Append the tag to the ciphertext
        in_out.extend_from_slice(tag.as_ref());

        println!("Encrypted message: {:?}", in_out);
        Ok((in_out, nonce.to_vec()))
    }

    // fn encrypt(value: String) -> Result<(Vec<u8>, Vec<u8>), io::Error> {
    //     //encrypt value using a 2 way hash function
    //     let key = std::env::var("AG_ENCRYPTION_KEY").unwrap_or_else(|_| "random".to_string());
    //     let key = aead::UnboundKey::new(&aead::AES_256_GCM, &key.as_bytes()).unwrap();
    //     let mut in_out = value.clone();
    //     let associated_data = Aad::empty();
    //     let nonce_counter = rand::thread_rng().gen_range(0..1000000000);
    //     let nonce = CounterNonceSequence(nonce_counter);
    //     let mut sealing_key = aead::SealingKey::new(key, nonce);
    //     let tag = sealing_key
    //         .seal_in_place_separate_tag(associated_data.into(), in_out.as_bytes_mut())
    //         .map_err(|err| {
    //             io::Error::new(
    //                 io::ErrorKind::Other,
    //                 format!("Could not encrypt value: {}", err),
    //             )
    //         })?;

    //     println!("Encrypted message: {:?}", in_out);
    //     Ok((in_out.into(), nonce_counter.to_be_bytes().to_vec()))
    // }
    //
    // fn decrypt(value: Vec<u8>, additional_data: Vec<u8>) -> Result<String, io::Error> {
    //     // Retrieve the encryption key from the environment variable or use a default one
    //     let key = std::env::var("AG_ENCRYPTION_KEY")
    //         .unwrap_or_else(|_| "37467a23239fcb518aa1f040aa42f3b8".to_string());
    //     let key_bytes = key.as_bytes();

    //     // Ensure the key length is appropriate for AES-256-GCM
    //     if key_bytes.len() != 32 {
    //         return Err(io::Error::new(
    //             io::ErrorKind::InvalidInput,
    //             "Key must be 32 bytes long",
    //         ));
    //     }

    //     let unbound_key = aead::UnboundKey::new(&aead::AES_256_GCM, key_bytes).map_err(|err| {
    //         io::Error::new(
    //             io::ErrorKind::Other,
    //             format!("Could not create unbound key: {}", err),
    //         )
    //     })?;
    //     let opening_key = aead::LessSafeKey::new(unbound_key);

    //     // Split the value into the ciphertext and the tag
    //     let (ciphertext, tag) = value.split_at(value.len() - 16);

    //     // Decrypt the data
    //     let mut in_out = ciphertext.to_vec();
    //     let nonce_array: [u8; 12] = additional_data.as_slice().try_into().map_err(|_| {
    //         io::Error::new(
    //             io::ErrorKind::InvalidInput,
    //             "Nonce must be exactly 12 bytes",
    //         )
    //     })?;
    //     opening_key
    //         .open_in_place(
    //             aead::Nonce::assume_unique_for_key(nonce_array),
    //             aead::Aad::empty(),
    //             &mut in_out,
    //         )
    //         .map_err(|err| {
    //             io::Error::new(
    //                 io::ErrorKind::Other,
    //                 format!("Could not decrypt value: {}", err),
    //             )
    //         })?;

    //     // Convert the decrypted data to a string
    //     let decrypted = String::from_utf8(in_out).map_err(|err| {
    //         io::Error::new(
    //             io::ErrorKind::InvalidData,
    //             format!("Could not convert decrypted data to string: {}", err),
    //         )
    //     })?;

    //     println!("Decrypted message: {:?}", decrypted);
    //     Ok(decrypted)
    // }
    fn decrypt(value: Vec<u8>, nonce: Vec<u8>) -> Result<String, io::Error> {
        // Retrieve the encryption key from the environment variable or use a default one
        let key = std::env::var("AG_ENCRYPTION_KEY")
            .unwrap_or_else(|_| "37467a23239fcb518aa1f040aa42f3b8".to_string());
        let key_bytes = key.into_bytes();

        // Ensure the key length is appropriate for AES-256-GCM
        if key_bytes.len() != 32 {
            return Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                "Key must be 32 bytes long",
            ));
        }

        let unbound_key = aead::UnboundKey::new(&aead::AES_256_GCM, &key_bytes).map_err(|err| {
            io::Error::new(
                io::ErrorKind::Other,
                format!("Could not create unbound key: {}", err),
            )
        })?;
        let opening_key = aead::LessSafeKey::new(unbound_key);

        // Split the value into the ciphertext and the tag
        if value.len() < 16 {
            return Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                "Ciphertext too short",
            ));
        }
        let (ciphertext, tag) = value.split_at(value.len() - 16);

        // Combine ciphertext and tag for in-place decryption
        let mut in_out = ciphertext.to_vec();
        in_out.extend_from_slice(tag);

        // Ensure the nonce length is 12 bytes
        let nonce_array: [u8; 12] = nonce.as_slice().try_into().map_err(|_| {
            io::Error::new(
                io::ErrorKind::InvalidInput,
                "Nonce must be exactly 12 bytes",
            )
        })?;

        // Decrypt the data
        let decrypted_data = opening_key
            .open_in_place(
                aead::Nonce::assume_unique_for_key(nonce_array),
                aead::Aad::empty(),
                &mut in_out,
            )
            .map_err(|err| {
                io::Error::new(
                    io::ErrorKind::Other,
                    format!("Could not decrypt value: {}", err),
                )
            })?;

        // Convert the decrypted data to a string
        let decrypted = String::from_utf8(decrypted_data.to_vec()).map_err(|err| {
            io::Error::new(
                io::ErrorKind::InvalidData,
                format!("Could not convert decrypted data to string: {}", err),
            )
        })?;

        println!("Decrypted message: {:?}", decrypted);
        Ok(decrypted)
    }

    pub fn index(conn: &mut PgConnection) -> Result<Vec<Self>, String> {
        let sys_vars = system_variables::table
            .order(system_variables::name.asc())
            .load::<SystemVariable>(conn)
            .map_err(|_| "Error loading system variables".to_string())?;
        let mut results = vec![];
        for sys_var in sys_vars {
            let sys_var_clone = sys_var.clone();
            let res = Self::decrypt(sys_var.value, sys_var.additional_data);
            match res {
                Ok(value) => {
                    let mut sys_var = sys_var_clone;
                    sys_var.value = value.into();
                    results.push(sys_var);
                }
                Err(e) => return Err(format!("error decrypting data {:?}", e)),
            }
        }
        Ok(results)
    }

    pub fn update(
        conn: &mut PgConnection,
        id: i64,
        name: String,
        value: String,
    ) -> Result<Self, String> {
        let system_variable = system_variables::table
            .find(id)
            .get_result::<SystemVariable>(conn)
            .map_err(|err| format!("Error fetching system variable: {:?}", err))?;
        let res = Self::encrypt(value);
        match res {
            Ok((value, additional_data)) => {
                let new_system_variable = SystemVariableChangeset {
                    name,
                    value,
                    additional_data,
                    updated_at: Utc::now().naive_utc(),
                    inserted_at: system_variable.inserted_at,
                };
                diesel::update(system_variables::table.find(id))
                    .set(&new_system_variable)
                    .get_result(conn)
                    .map_err(|err| format!("Error updating system variable: {:?}", err))
            }
            Err(e) => Err(format!("Error updating System variable {:?}", e)),
        }
    }
    pub fn create(conn: &mut PgConnection, name: String, value: String) -> Result<Self, String> {
        let res = Self::encrypt(value);
        match res {
            Ok((value, additional_data)) => {
                let new_system_variable = SystemVariableChangeset {
                    name,
                    value,
                    additional_data,
                    inserted_at: Utc::now().naive_utc(),
                    updated_at: Utc::now().naive_utc(),
                };
                diesel::insert_into(system_variables::table)
                    .values(&new_system_variable)
                    .get_result(conn)
                    .map_err(|err| format!("Error creating system variable: {:?}", err))
            }
            Err(e) => Err(format!("Error creating System variable {:?}", e)),
        }
    }
    pub fn delete(conn: &mut PgConnection, id: i64) -> Result<bool, String> {
        diesel::delete(system_variables::table.find(id))
            .execute(conn)
            .map(|_| true)
            .map_err(|err| format!("Error deleting system variable: {:?}", err))
    }
}
