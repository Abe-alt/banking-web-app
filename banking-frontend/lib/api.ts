const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Account = {
  accountNumber: number;
  customerName: string;
  balance: number;
};

export type CreateAccountPayload = {
  accountNumber: number;
  customerName: string;
  balance: number;
};

async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.text();
  try {
    const data = JSON.parse(body);
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;
  } catch {
    // ignore parse errors
  }
  if (body) return body;
  return `${fallback} (HTTP ${res.status})`;
}

export async function createAccount(payload: CreateAccountPayload): Promise<Account> {
  const res = await fetch(`${API_BASE}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create account: ${res.status} ${text}`);
  }

  return res.json();
}

export async function deposit(accountNumber: number, amount: number): Promise<Account> {
  const res = await fetch(`${API_BASE}/accounts/${accountNumber}/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("Deposit failed");
  return res.json();
}

export async function withdraw(accountNumber: number, amount: number): Promise<Account> {
  const res = await fetch(`${API_BASE}/accounts/${accountNumber}/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("Withdrawal failed");
  return res.json();
}

export async function getBalance(accountNumber: number): Promise<Account> {
  const res = await fetch(`${API_BASE}/accounts/${accountNumber}`);
  if (!res.ok) {
    throw new Error(await readError(res, "Account not found"));
  }
  return res.json();
}
