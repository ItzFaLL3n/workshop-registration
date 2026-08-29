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
