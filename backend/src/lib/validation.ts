// Shared validation for anything that creates a Registration row — the
// public /register endpoint and the admin/registration-desk walk-in
// endpoint both need the exact same rules, so this lives in one place
// instead of drifting apart across two route files.
export const MAX_FIELD_LENGTH = 150;

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidatedRegistrationInput {
  name: string;
  email: string;
  phone: string;
  college?: string;
  department?: string;
  year?: string;
  gender?: string;
  foodPreference?: string;
}

// Coerce to string and trim — so "  " never counts as a filled-in field and
// stored values don't carry leading/trailing whitespace.
const clean = (v: unknown) => (v == null ? "" : String(v)).trim();

export function validateRegistrationInput(
  body: Record<string, unknown>
): { error: string } | { data: ValidatedRegistrationInput } {
  const name = clean(body.name);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const college = clean(body.college);
  const department = clean(body.department);
  const year = clean(body.year);
  const gender = clean(body.gender);
  const foodPreference = clean(body.foodPreference);

  if (!name || !email || !phone) {
    return { error: "Name, email, and phone are required." };
  }

  if (!emailRx.test(email)) {
    return { error: "Please provide a valid email address." };
  }

  const phoneNorm = phone.replace(/\s+/g, "");
  if (!/^[6-9]\d{9}$/.test(phoneNorm)) {
    return { error: "Please provide a valid 10-digit Indian mobile number." };
  }

  const tooLong = [name, college, department, year, gender, foodPreference].some(
    (v) => v.length > MAX_FIELD_LENGTH
  );
  if (tooLong) {
    return { error: `Each field must be under ${MAX_FIELD_LENGTH} characters.` };
  }

  return {
    data: {
      name,
      email,
      phone: phoneNorm,
      college: college || undefined,
      department: department || undefined,
      year: year || undefined,
      gender: gender || undefined,
      foodPreference: foodPreference || undefined,
    },
  };
}
