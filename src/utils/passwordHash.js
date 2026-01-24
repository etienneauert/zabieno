/**
 * Hash-Funktion für Passwort-Vergleich
 * Verwendet SHA-256 für sichere Passwort-Hashes
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Vergleicht ein eingegebenes Passwort mit einem gespeicherten Hash
 */
export async function verifyPassword(password, storedHash) {
  if (!password || !storedHash) {
    return false;
  }
  const passwordHash = await hashPassword(password);
  return passwordHash === storedHash;
}
