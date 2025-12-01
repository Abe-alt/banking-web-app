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
  // Auth + onboarding state
  const [createForm, setCreateForm] = useState({
    accountNumber: "",
    customerName: "",
    balance: "",
  });
  const [loginId, setLoginId] = useState("");
  const [view, setView] = useState<"login" | "create" | "dashboard">("login");

  // Active account + money movement
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  // UX state
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
      setActiveAccount(account);
      setView("dashboard");
      setDepositAmount("");
      setWithdrawAmount("");
      setStatus({ kind: "success", message: "Account created." });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposit(e: FormEvent) {
    e.preventDefault();
    if (!activeAccount) {
      setStatus({ kind: "error", message: "Login to an account first." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const account = await deposit(
        activeAccount.accountNumber,
        parseNumber(depositAmount)
      );
      setActiveAccount(account);
      setDepositAmount("");
      setStatus({ kind: "success", message: "Deposit successful." });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdraw(e: FormEvent) {
    e.preventDefault();
    if (!activeAccount) {
      setStatus({ kind: "error", message: "Login to an account first." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const account = await withdraw(
        activeAccount.accountNumber,
        parseNumber(withdrawAmount)
      );
      setActiveAccount(account);
      setWithdrawAmount("");
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
      const account = await getBalance(parseNumber(loginId));
      setActiveAccount(account);
      setView("dashboard");
      setDepositAmount("");
      setWithdrawAmount("");
      setStatus({ kind: "success", message: "Logged in." });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    if (!activeAccount) {
      setStatus({ kind: "error", message: "No account selected to refresh." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const account = await getBalance(activeAccount.accountNumber);
      setActiveAccount(account);
      setStatus({ kind: "success", message: "Balance refreshed." });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setActiveAccount(null);
    setView("login");
    setStatus(null);
    setLoginId("");
    setDepositAmount("");
    setWithdrawAmount("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <header>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
            Banking
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Access your account
          </h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Log in with an account number or open a new account, then manage
            deposits and withdrawals with the menu.
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

        {view !== "dashboard" && (
          <div className="grid gap-6 md:grid-cols-2">
            {view === "login" && (
              <Card title="Login" description="Enter your account number to continue.">
                <form className="space-y-4" onSubmit={handleLookup}>
                  <Input
                    label="Account number"
                    type="number"
                    value={loginId}
                    onChange={setLoginId}
                    required
                  />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Working..." : "Login"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setView("create");
                        setStatus(null);
                      }}
                    >
                      Create account
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {view === "create" && (
              <Card title="Create account" description="Open a new account to start banking.">
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Working..." : "Create and continue"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setView("login");
                        setStatus(null);
                      }}
                    >
                      Back to login
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        )}

        {view === "dashboard" && activeAccount && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card
                title="Account details"
                description="You are signed in. Refresh or switch accounts anytime."
              >
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100">
                  <div className="font-mono text-base">
                    #{activeAccount.accountNumber}
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {activeAccount.customerName || "—"}
                  </div>
                  <div className="mt-2 text-emerald-400">
                    ${activeAccount.balance.toFixed(2)}
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button type="button" onClick={handleRefresh} disabled={loading}>
                    {loading ? "Refreshing..." : "Refresh balance"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleLogout}>
                    Switch account
                  </Button>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
              <Card title="Deposit" description="Add funds to this account.">
                <form className="space-y-3" onSubmit={handleDeposit}>
                  <Input
                    label="Amount"
                    type="number"
                    value={depositAmount}
                    onChange={setDepositAmount}
                    required
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Working..." : "Deposit"}
                  </Button>
                </form>
              </Card>

              <Card title="Withdraw" description="Remove funds from this account.">
                <form className="space-y-3" onSubmit={handleWithdraw}>
                  <Input
                    label="Amount"
                    type="number"
                    value={withdrawAmount}
                    onChange={setWithdrawAmount}
                    required
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Working..." : "Withdraw"}
                  </Button>
                </form>
              </Card>
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
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "ghost";
}) {
  const styles =
    variant === "ghost"
      ? "border border-slate-700 bg-transparent text-white hover:border-slate-500"
      : "bg-emerald-500 text-black hover:bg-emerald-400";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-700 disabled:text-slate-300 ${styles}`}
    >
      {children}
    </button>
  );
}
