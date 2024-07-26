use diesel::PgConnection;
use rand::rngs::OsRng;
use rcgen::{Certificate, CertificateParams, KeyPair};
use rsa::{
    pkcs8::{EncodePrivateKey, LineEnding},
    RsaPrivateKey,
};

use crate::{repository::models::Setting, response_text::SAML_CONFIG_FETCH_ERROR};

#[derive(Debug, Default)]
pub struct SAMLConfig {
    pub entiry_id: String,
    pub public_key: String,
    pub private_key: String,
    pub idp_metadata_xml: String,
    pub acs_url: String,
    pub slo_url: String,
}
const SAML_CONFIG_NAMES: [&str; 4] = [
    "SAML_ENTITY_ID",
    "SAML_PUBLIC_KEY",
    "SAML_PRIVATE_KEY",
    "SAML_IDP_METADATA_XML",
];

pub fn get(conn: &mut PgConnection) -> Result<SAMLConfig, String> {
    let settings = Setting::find_by_names(
        conn,
        SAML_CONFIG_NAMES.iter().map(|s| s.to_string()).collect(),
    )
    .map_err(|_| SAML_CONFIG_FETCH_ERROR.to_string())?;

    let mut config = SAMLConfig::default();
    config.acs_url = std::env::var("AG_APP_ROOT").unwrap_or_default() + "api/v2/saml/acs";
    config.slo_url = std::env::var("AG_APP_ROOT").unwrap_or_default() + "api/v2/saml/slo";
    for setting in settings {
        if let Some(value) = setting.value {
            match setting.name.as_str() {
                "SAML_ENTITY_ID" => config.entiry_id = value,
                "SAML_PUBLIC_KEY" => config.public_key = value,
                "SAML_PRIVATE_KEY" => config.private_key = value,
                "SAML_IDP_METADATA_XML" => config.idp_metadata_xml = value,
                _ => (),
            }
        }
    }

    Ok(config)
}

pub fn generate_saml_keys() -> Result<(String, String), String> {
    let mut rng = OsRng;
    let bits = 2048; // Key size
    let private_key = RsaPrivateKey::new(&mut rng, bits)
        .map_err(|err| format!("failed to initiate private key: {}", err))?;
    let private_key_pem = private_key
        .to_pkcs8_pem(LineEnding::LF)
        .map_err(|err| format!("failed to initiate private key: {}", err))?;

    // Convert RSA Private Key to a format rcgen can use
    let key_pair = KeyPair::from_pem(private_key_pem.as_ref())
        .map_err(|err| format!("failed to create private key: {}", err))?;

    // Set up certificate parameters
    let mut params = CertificateParams::new(vec!["*".to_string()]);
    params.key_pair = Some(key_pair);
    let signature_algorithm = &rcgen::PKCS_RSA_SHA256;
    params.alg = signature_algorithm;

    // Generate the certificate
    let cert = Certificate::from_params(params)
        .map_err(|err| format!("failed to create certificate key: {}", err))?;
    // Output the generated private key and certificate
    let cert_pem = cert
        .serialize_pem()
        .map_err(|err| format!("failed to serialize certificate key: {}", err))?;

    Ok((private_key_pem.to_string(), cert_pem))
}
