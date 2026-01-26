/*
  
 * Verwendung:
 *   node generate-password-hash.js <dein-passwort>
 
 * Beispiel:
 *   node generate-password-hash.js meinPasswort123
 */

import crypto from "crypto";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// process wird nur in der Node-CLI verwendet
// eslint-disable-next-line no-undef
const password = process.argv[2];

if (!password) {
  console.error("❌ Fehler: Kein Passwort angegeben");
  console.log("\nVerwendung:");
  console.log("  node generate-password-hash.js <dein-passwort>");
  console.log("\nBeispiel:");
  console.log("  node generate-password-hash.js meinPasswort123");
  // eslint-disable-next-line no-undef
  process.exit(1);
}

const hash = hashPassword(password);
console.log("\n✅ Passwort-Hash generiert:");
console.log(hash);
console.log("\n📝 Füge diese Zeile in deine .env Datei ein:");
console.log(`VITE_ARTIST_PASSWORD_HASH=${hash}\n`);
