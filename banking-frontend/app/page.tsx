"use client";

import { useState, type FormEvent } from "react";
import {
  createAccount,
  deposit,
  withdraw,
  getBalance,
  type Account,
} from "@/lib/api";

type Status = { kind: "success" | "error"; message: string } | null;

export default function Home() {
  const [createForm, setCreateForm] = useState({
    accountNumber: "",
    customerName: "",
    balance: "",
  });
  const [depositForm, setDepositForm] = useState({
    accountNumber: "",
    amount: "",
  });
  const [withdrawForm, setWithdrawForm] = useState({
    accountNumber: "",
    amount: "",
  });
  const [lookupId, setLookupId] = useState("");
  const [lastAccount, setLastAccount] = useState<Account | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);

  const parseNumber = (value: string) => Number(value.trim());

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const account = await createAccount({
        accountNumber: parseNumber(createForm.accountNumber),
        customerName: createForm.customerName.trim(),
        balance: parseNumber(createForm.balance),
      });
      setLastAccount(account);
      setStatus({ kind: "success", message: "Account created." });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const account = await deposit(
        parseNumber(depositForm.accountNumber),
        parseNumber(depositForm.amount)
      );
      setLastAccount(account);
      setStatus({ kind: "success", message: "Deposit successful." });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const account = await withdraw(
        parseNumber(withdrawForm.accountNumber),
        parseNumber(withdrawForm.amount)
      );
      setLastAccount(account);
      setStatus({ kind: "success", message: "Withdrawal successful." });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  async function handleLookup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const account = await getBalance(parseNumber(lookupId));
      setLastAccount(account);
      setStatus({ kind: "success", message: "Account fetched." });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <header>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
            Banking
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Manage accounts
          </h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Create accounts, deposit, withdraw, and check balances against the
            backend API at <code className="text-slate-100">:8080/api</code>.
          </p>
        </header>

        {status && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              status.kind === "success"
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                : "border-rose-400/40 bg-rose-500/10 text-rose-100"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Create account" description="Open a new account.">
            <form className="space-y-3" onSubmit={handleCreate}>
              <Input
                label="Account number"
                type="number"
                value={createForm.accountNumber}
                onChange={(v) =>
                  setCreateForm((f) => ({ ...f, accountNumber: v }))
                }
                required
              />
              <Input
                label="Customer name"
                value={createForm.customerName}
                onChange={(v) =>
                  setCreateForm((f) => ({ ...f, customerName: v }))
                }
                required
              />
              <Input
                label="Initial balance"
                type="number"
                value={createForm.balance}
                onChange={(v) => setCreateForm((f) => ({ ...f, balance: v }))}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Working..." : "Create"}
              </Button>
            </form>
          </Card>

          <Card title="Deposit" description="Add funds to an account.">
            <form className="space-y-3" onSubmit={handleDeposit}>
              <Input
                label="Account number"
                type="number"
                value={depositForm.accountNumber}
                onChange={(v) =>
                  setDepositForm((f) => ({ ...f, accountNumber: v }))
                }
                required
              />
              <Input
                label="Amount"
                type="number"
                value={depositForm.amount}
                onChange={(v) => setDepositForm((f) => ({ ...f, amount: v }))}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Working..." : "Deposit"}
              </Button>
            </form>
          </Card>

          <Card title="Withdraw" description="Remove funds from an account.">
            <form className="space-y-3" onSubmit={handleWithdraw}>
              <Input
                label="Account number"
                type="number"
                value={withdrawForm.accountNumber}
                onChange={(v) =>
                  setWithdrawForm((f) => ({ ...f, accountNumber: v }))
                }
                required
              />
              <Input
                label="Amount"
                type="number"
                value={withdrawForm.amount}
                onChange={(v) => setWithdrawForm((f) => ({ ...f, amount: v }))}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Working..." : "Withdraw"}
              </Button>
            </form>
          </Card>

          <Card title="View balance" description="Fetch account details.">
            <form className="space-y-3" onSubmit={handleLookup}>
              <Input
                label="Account number"
                type="number"
                value={lookupId}
                onChange={setLookupId}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Working..." : "View"}
              </Button>
            </form>
          </Card>
        </div>

        {lastAccount && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-100">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Last result
            </div>
            <div className="mt-2 font-mono text-base">
              #{lastAccount.accountNumber} · {lastAccount.customerName ?? "—"} ·$
              {lastAccount.balance.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)]">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-slate-200">
      <span className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-2 ring-transparent transition focus:border-slate-500 focus:ring-slate-600"
      />
    </label>
  );
}

function Button({
  children,
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
    >
      {children}
    </button>
  );
}
