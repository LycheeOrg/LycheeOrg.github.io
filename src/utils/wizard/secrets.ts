// Mirrors github.com/LycheeOrg/Wizard's internal/generator/secrets.go, using
// the browser's Web Crypto API in place of Go's crypto/rand.

function randomBytes(numBytes: number): Uint8Array {
  const buf = new Uint8Array(numBytes);
  crypto.getRandomValues(buf);
  return buf;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

// Matches Go's base64.RawURLEncoding: URL-safe alphabet, no padding.
function toBase64Url(bytes: Uint8Array): string {
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// generateAppKey returns a Laravel-format application key: "base64:" followed
// by the base64 encoding of 32 random bytes.
export function generateAppKey(): string {
  return 'base64:' + toBase64(randomBytes(32));
}

// generateSecret returns a random URL-safe secret of the given byte length,
// suitable for passwords and API keys.
export function generateSecret(numBytes: number): string {
  return toBase64Url(randomBytes(numBytes));
}
