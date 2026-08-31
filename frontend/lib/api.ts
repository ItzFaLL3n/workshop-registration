export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
}

const API_URL = getApiUrl();

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  college?: string;
  department?: string;
  year?: string;
  gender?: string;
  foodPreference?: string;
  paymentMethod: "RAZORPAY" | "CASH";
}

export type RegisterResponse =
  | {
      registrationId: string;
      paymentMethod: "CASH";
    }
  | {
      registrationId: string;
      paymentMethod: "RAZORPAY";
      razorpayOrderId: string;
      razorpayKeyId: string;
      amount: number;
      currency: string;
      name: string;
      email: string;
      phone: string;
    };

/**
 * Whether public online registration is currently open. Controlled by the
 * backend `REGISTRATION_OPEN` env var (a manual switch — no fixed cutoff).
 * Fails OPEN: a network/parse error returns `{ open: true }` so a transient
 * backend blip never hides the form. The backend still enforces the real gate
 * on POST /register (403 when closed).
 */
export async function getRegistrationStatus(): Promise<{ open: boolean }> {
  try {
    const res = await fetch(`${API_URL}/register/status`, { cache: "no-store" });
    if (!res.ok) return { open: true };
    const data = await res.json();
    return { open: data?.open !== false };
  } catch {
    return { open: true };
  }
}

export async function registerForWorkshop(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data as RegisterResponse;
}
