// Mirrors the field validators in github.com/LycheeOrg/Wizard's
// internal/wizard/forms.go. Returns an error message, or null if valid.

// Number() also accepts scientific notation ("1e2"), hexadecimal ("0x50"),
// and leading +/whitespace, all of which pass Number.isInteger() too — and
// since it's the raw typed string (not the parsed number) that ends up
// embedded in the generated .env/docker-compose.yaml output, something like
// "0x50" would validate as port 80 but leave the literal text "0x50" behind
// instead. Require plain decimal digits before parsing.
const PLAIN_DIGITS = /^\d+$/;

export function validatePort(s: string): string | null {
  if (!PLAIN_DIGITS.test(s.trim())) {
    return 'Must be a valid port number (1-65535).';
  }
  const n = Number(s);
  if (!Number.isInteger(n) || n <= 0 || n > 65535) {
    return 'Must be a valid port number (1-65535).';
  }
  return null;
}

// validateOptionalPort is validatePort, except a blank value is valid — used
// for the external-database port field, which falls back to the engine's
// default port when left empty.
export function validateOptionalPort(s: string): string | null {
  if (s.trim() === '') return null;
  return validatePort(s);
}

export function validateUint(s: string): string | null {
  if (!PLAIN_DIGITS.test(s.trim())) {
    return 'Must be a non-negative integer.';
  }
  const n = Number(s);
  if (!Number.isInteger(n) || n < 0) {
    return 'Must be a non-negative integer.';
  }
  return null;
}

export function validatePositiveInt(s: string): string | null {
  if (!PLAIN_DIGITS.test(s.trim())) {
    return 'Must be a positive integer (1 or more).';
  }
  const n = Number(s);
  if (!Number.isInteger(n) || n < 1) {
    return 'Must be a positive integer (1 or more).';
  }
  return null;
}

// Same rationale as PLAIN_DIGITS above, extended to allow one optional
// decimal point — still rejects scientific notation and hex.
const PLAIN_DECIMAL = /^\d+(\.\d+)?$/;

export function validateNonNegativeFloat(s: string): string | null {
  if (!PLAIN_DECIMAL.test(s.trim())) {
    return 'Must be a non-negative number.';
  }
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) {
    return 'Must be a non-negative number.';
  }
  return null;
}

// validatePath is deliberately loose — it only rules out a blank value
// (which would produce an invalid, empty bind-mount source in
// docker-compose.yaml) rather than trying to fully validate filesystem path
// syntax across host OSes.
export function validatePath(s: string): string | null {
  if (s.trim() === '') return 'Must not be empty.';
  return null;
}
