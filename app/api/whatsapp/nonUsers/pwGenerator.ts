import { randomBytes } from "crypto";

export {generatePassword }

/** Generate a secure, URL‑safe base64 string of exactly `length` chars */
function generatePassword(length = 12): string {
    return randomBytes(Math.ceil((length * 3) / 4))
      .toString('base64')
      .slice(0, length)
      .replace(/\+/g, '0')
      .replace(/\//g, '0');
}