// Mirrors the field validators in github.com/LycheeOrg/Wizard's
// internal/wizard/forms.go. Returns an error message, or null if valid.

export function validatePort(s: string): string | null {
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
  const n = Number(s);
  if (!Number.isInteger(n) || n < 0) {
    return 'Must be a non-negative integer.';
  }
  return null;
}

export function validatePositiveInt(s: string): string | null {
  const n = Number(s);
  if (!Number.isInteger(n) || n < 1) {
    return 'Must be a positive integer (1 or more).';
  }
  return null;
}
