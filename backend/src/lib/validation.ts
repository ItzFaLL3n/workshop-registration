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

export function validateRegistrationInput(
  body: Record<string, unknown>
): { error: string } | { data: ValidatedRegistrationInput } {
  const { name, email, phone, college, department, year, gender, foodPreference } = body;

  if (!name || !email || !phone) {
    return { error: "Name, email, and phone are required." };
  }

  if (typeof email !== "string" || !emailRx.test(email)) {
    return { error: "Please provide a valid email address." };
  }

  const phoneNorm = String(phone).replace(/\s+/g, "");
  if (!/^[6-9]\d{9}$/.test(phoneNorm)) {
    return { error: "Please provide a valid 10-digit Indian mobile number." };
  }

  const tooLong = [name, college, department].some(
    (v) => typeof v === "string" && v.length > MAX_FIELD_LENGTH
  );
  if (tooLong) {
    return { error: `Name, college, and department must be under ${MAX_FIELD_LENGTH} characters.` };
  }

  return {
    data: {
      name: String(name),
      email,
      phone: phoneNorm,
      college: college ? String(college) : undefined,
      department: department ? String(department) : undefined,
      year: year ? String(year) : undefined,
      gender: gender ? String(gender) : undefined,
      foodPreference: foodPreference ? String(foodPreference) : undefined,
    },
  };
}
