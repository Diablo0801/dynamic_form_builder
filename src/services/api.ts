import type { FormResponse } from "../types/formTypes";

export async function createUser(
  rollNumber: number,
  name: string
): Promise<{ message: string }> {
  const res = await fetch(
    "https://dynamic-form-generator-9rl7.onrender.com/create-user",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNumber, name }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`create-user failed: ${res.status} — ${text}`);
  }
  return res.json();
}

export async function getForm(rollNumber: number): Promise<FormResponse> {
  const res = await fetch(
    `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`get-form failed: ${res.status} — ${text}`);
  }
  return res.json();
}
