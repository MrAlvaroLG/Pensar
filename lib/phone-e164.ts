/** E.164: leading +, country code 1–9, up to 15 digits total after +. */
export const E164_PHONE_REGEX = /^\+[1-9]\d{1,14}$/

export const E164_PHONE_INVALID_MESSAGE =
    "El numero telefonico debe usar formato E.164 (ej: +5355555555)"

export const E164_PHONE_REQUIRED_MESSAGE = "El numero telefonico es obligatorio"
