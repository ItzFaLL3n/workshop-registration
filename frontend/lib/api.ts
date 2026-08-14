export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Copy .env.local.example to .env.local and fill it in."
    );
  }
  return url;
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
  return data as { registrationId: string; paymentSessionId: string };
}

export async function getRegistrationCount(): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/register/count`, {
      next: { revalidate: 60 }, // Next.js cache — refresh every 60s
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.count ?? 0;
  } catch {
    return 0;
  }
}
