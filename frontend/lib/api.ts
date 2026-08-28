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
}

export async function registerForWorkshop(payload: RegisterPayload) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data as {
    registrationId: string;
    razorpayOrderId: string;
    razorpayKeyId: string;
    amount: number;
    currency: string;
    name: string;
    email: string;
    phone: string;
  };
}

export async function getRegistrationCount(): Promise<number> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_URL}/register/count`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return 0;
    const data = await res.json();
    return data.count ?? 0;
  } catch {
    return 0;
  }
}
