pub fn hex_to_rgb(hex: &str) -> Result<(u8, u8, u8), &'static str> {
    let hex = hex.trim_start_matches('#');

    if hex.len() == 6 {
        let r = u8::from_str_radix(&hex[0..2], 16).map_err(|_| "Invalid hex value")?;
        let g = u8::from_str_radix(&hex[2..4], 16).map_err(|_| "Invalid hex value")?;
        let b = u8::from_str_radix(&hex[4..6], 16).map_err(|_| "Invalid hex value")?;
        Ok((r, g, b))
    } else {
        Err("Invalid hex length")
    }
}
pub fn add_white(r: u8, g: u8, b: u8, percent: f32) -> (u8, u8, u8) {
    let new_r = (r as f32 + percent * (255.0 - r as f32)).round() as u8;
    let new_g = (g as f32 + percent * (255.0 - g as f32)).round() as u8;
    let new_b = (b as f32 + percent * (255.0 - b as f32)).round() as u8;
    (new_r, new_g, new_b)
}
pub fn is_light_color(r: u8, g: u8, b: u8) -> bool {
    // Calculate the relative luminance
    let luminance =
        0.2126 * (r as f64 / 255.0) + 0.7152 * (g as f64 / 255.0) + 0.0722 * (b as f64 / 255.0);
    // A threshold of 0.5 is typically used to determine if a color is light or dark
    luminance > 0.5
}
