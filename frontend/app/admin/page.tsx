"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import {
  ShieldCheck,
  Search,
  Download,
  RotateCw,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Building2,
  Phone,
  Mail,
  GraduationCap,
  Utensils,
  ArrowLeft,
  Filter,
  Wallet,
  UserPlus,
  UserCheck,
  Banknote,
  Undo2,
  X,
} from "lucide-react";

const API_URL = getApiUrl();

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string | null;
  department: string | null;
  year: string | null;
  gender: string | null;
  foodPreference: string | null;
  status: string;
  paymentMethod: "RAZORPAY" | "CASH";
  attended: boolean;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
}

const STATUS_OPTIONS = ["PENDING", "PAID", "FAILED", "EXPIRED"] as const;

// Kept in sync with the public registration form (components/RegistrationForm.tsx)
// so walk-ins and edits store the same canonical values.
const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "Final Year"] as const;
const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;
const FOOD_OPTIONS = ["Vegetarian", "Non-Vegetarian"] as const;
const SELECT_OPTIONS: Partial<Record<keyof WalkInForm, readonly string[]>> = {
  year: YEAR_OPTIONS,
  gender: GENDER_OPTIONS,
  foodPreference: FOOD_OPTIONS,
};
const EDIT_FIELDS: { key: keyof WalkInForm; label: string; type: string }[] = [
  { key: "name", label: "Full name", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "college", label: "College", type: "text" },
  { key: "department", label: "Department", type: "text" },
  { key: "year", label: "Year", type: "text" },
  { key: "gender", label: "Gender", type: "text" },
  { key: "foodPreference", label: "Food preference", type: "text" },
];

interface AdminData {
  registrations: Registration[];
  counts: { status: string; _count: number }[];
  role: "admin" | "team";
}

interface WalkInForm {
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  gender: string;
  foodPreference: string;
}

const EMPTY_WALK_IN: WalkInForm = {
  name: "",
  email: "",
  phone: "",
  college: "",
  department: "",
  year: "",
  gender: "",
  foodPreference: "",
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterMethod, setFilterMethod] = useState("ALL");
  const [filterAttendance, setFilterAttendance] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [walkInForm, setWalkInForm] = useState<WalkInForm>(EMPTY_WALK_IN);
  const [walkInError, setWalkInError] = useState<string | null>(null);
  const [walkInSubmitting, setWalkInSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusSavingId, setStatusSavingId] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<Registration | null>(null);
  const [editForm, setEditForm] = useState<WalkInForm>(EMPTY_WALK_IN);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  async function loadData() {
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      const url =
        filterStatus !== "ALL"
          ? `${API_URL}/admin/registrations?status=${filterStatus}`
          : `${API_URL}/admin/registrations`;
      const res = await fetch(url, { headers: { "x-admin-token": token } });
      if (!res.ok) {
        setError(
          res.status === 429
            ? "Too many attempts — wait a minute, then try again."
            : res.status === 401
            ? "Wrong password. Use the admin or registration-desk password."
            : "Couldn't load the dashboard (server error). Try again."
        );
        setLoading(false);
        return;
      }
      setData(await res.json());
    } catch {
      setError("Could not connect to the workshop registration backend.");
    }
    setLoading(false);
  }

  async function downloadCsv() {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/admin/registrations.csv`, {
        headers: { "x-admin-token": token },
      });
      if (!res.ok) {
        setError("Export failed: check admin password or server status.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vortex-neovia-registrations-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download registrations CSV.");
    }
  }

  // Registration desk confirms a "pay at event" reservation was actually
  // paid in cash at check-in. Backend rejects this for any Razorpay row,
  // regardless of who's asking — the webhook is the only thing allowed to
  // mark those PAID.
  async function markCashPaid(id: string) {
    if (!token) return;
    setMarkingId(id);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/registrations/${id}/mark-cash-paid`, {
        method: "PATCH",
        headers: { "x-admin-token": token },
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Could not mark this registration as paid.");
        setMarkingId(null);
        return;
      }
      await loadData();
    } catch {
      setError("Could not connect to the workshop registration backend.");
    }
    setMarkingId(null);
  }

  // Reverse a mistaken "Mark Paid" — flips a CASH row PAID → PENDING. Both
  // roles, same as markCashPaid (a wrong click at the desk shouldn't need an
  // admin to undo). Backend still refuses this for RAZORPAY rows.
  async function unmarkCashPaid(id: string) {
    if (!token) return;
    setMarkingId(id);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/registrations/${id}/unmark-cash-paid`, {
        method: "PATCH",
        headers: { "x-admin-token": token },
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Could not undo this payment.");
        setMarkingId(null);
        return;
      }
      await loadData();
    } catch {
      setError("Could not connect to the workshop registration backend.");
    }
    setMarkingId(null);
  }

  function setWalkInField(field: keyof WalkInForm, value: string) {
    setWalkInForm((prev) => ({ ...prev, [field]: value }));
  }

  // Toggle check-in attendance. Allowed for both roles on any row (it's not
  // a payment action). Optimistic — reverts on failure.
  async function toggleAttendance(r: Registration) {
    if (!token || togglingId) return;
    setTogglingId(r.id);
    setError(null);
    const next = !r.attended;
    setData((d) =>
      d ? { ...d, registrations: d.registrations.map((x) => (x.id === r.id ? { ...x, attended: next } : x)) } : d
    );
    try {
      const res = await fetch(`${API_URL}/admin/registrations/${r.id}/attendance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ attended: next }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Could not update attendance.");
        setData((d) =>
          d
            ? { ...d, registrations: d.registrations.map((x) => (x.id === r.id ? { ...x, attended: r.attended } : x)) }
            : d
        );
      }
    } catch {
      setError("Could not connect to the workshop registration backend.");
      setData((d) =>
        d
          ? { ...d, registrations: d.registrations.map((x) => (x.id === r.id ? { ...x, attended: r.attended } : x)) }
          : d
      );
    }
    setTogglingId(null);
  }

  // Admin-only: correct a CASH row's status. The backend rejects this for
  // RAZORPAY rows regardless of role.
  async function changeStatus(r: Registration, status: string) {
    if (!token || status === r.status) return;
    setStatusSavingId(r.id);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/registrations/${r.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ status }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || "Could not change status.");
      } else {
        await loadData();
      }
    } catch {
      setError("Could not connect to the workshop registration backend.");
    }
    setStatusSavingId(null);
  }

  // Admin-only: hard delete (spam / test rows).
  async function deleteRow(r: Registration) {
    if (!token || deletingId) return;
    if (!window.confirm(`Delete ${r.name}'s registration permanently? This can't be undone.`)) return;
    setDeletingId(r.id);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/registrations/${r.id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      // 204 = deleted; 404 = already gone (someone else deleted it) — both are
      // "the row is no longer there", so just refresh without an error.
      if (res.ok || res.status === 204 || res.status === 404) {
        await loadData();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Could not delete this registration.");
      }
    } catch {
      setError("Could not connect to the workshop registration backend.");
    }
    setDeletingId(null);
  }

  function openEdit(r: Registration) {
    setEditingRow(r);
    setEditError(null);
    setEditForm({
      name: r.name ?? "",
      email: r.email ?? "",
      phone: r.phone ?? "",
      college: r.college ?? "",
      department: r.department ?? "",
      year: r.year ?? "",
      gender: r.gender ?? "",
      foodPreference: r.foodPreference ?? "",
    });
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !editingRow) return;
    setEditSubmitting(true);
    setEditError(null);
    try {
      const res = await fetch(`${API_URL}/admin/registrations/${editingRow.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(editForm),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEditError(body.error || "Could not save changes.");
        setEditSubmitting(false);
        return;
      }
      setEditingRow(null);
      await loadData();
    } catch {
      setEditError("Could not connect to the workshop registration backend.");
    }
    setEditSubmitting(false);
  }

  // Registration desk adds someone who never registered online. Cash is
  // collected on the spot, so this is created already PAID server-side.
  async function submitWalkIn(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setWalkInSubmitting(true);
    setWalkInError(null);
    try {
      const res = await fetch(`${API_URL}/admin/registrations/walk-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(walkInForm),
      });
      const body = await res.json();
      if (!res.ok) {
        setWalkInError(body.error || "Could not add this registration.");
        setWalkInSubmitting(false);
        return;
      }
      setWalkInForm(EMPTY_WALK_IN);
      setShowWalkIn(false);
      await loadData();
    } catch {
      setWalkInError("Could not connect to the workshop registration backend.");
    }
    setWalkInSubmitting(false);
  }

  // Filtered registrations based on client-side search query + payment method
  const filteredRegistrations = useMemo(() => {
    if (!data?.registrations) return [];
    let rows = data.registrations;

    if (filterMethod !== "ALL") {
      rows = rows.filter((r) => r.paymentMethod === filterMethod);
    }

    if (filterAttendance !== "ALL") {
      const want = filterAttendance === "PRESENT";
      rows = rows.filter((r) => r.attended === want);
    }

    const rawQ = searchQuery.toLowerCase().trim();
    // Staff may paste a Reference ID straight from a confirmation email:
    // "wr_<id>" (cash / walk-in) or "order_..." (Razorpay). Strip the wr_
    // prefix so it matches the row id.
    const q = rawQ.startsWith("wr_") ? rawQ.slice(3) : rawQ;
    if (q) {
      rows = rows.filter((r) =>
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.college?.toLowerCase().includes(q) ||
        r.department?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q) ||
        r.razorpayOrderId?.toLowerCase().includes(q) ||
        r.razorpayPaymentId?.toLowerCase().includes(q)
      );
    }

    return rows;
  }, [data?.registrations, searchQuery, filterMethod, filterAttendance]);

  // Aggregate metric stats
  const totalCount = data?.registrations.length || 0;
  const paidCount = data?.counts.find((c) => c.status === "PAID")?._count || 0;
  const pendingCount = data?.counts.find((c) => c.status === "PENDING")?._count || 0;
  const failedCount = data?.counts.find((c) => c.status === "FAILED")?._count || 0;
  const cashPendingCount =
    data?.registrations.filter((r) => r.paymentMethod === "CASH" && r.status === "PENDING").length || 0;
  const isAdmin = data?.role === "admin";

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
      style={{ background: "var(--canvas)", color: "var(--ink)" }}
    >
      {/* Top Header / Navigation Bar */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-200"
        style={{
          background: "var(--header-bg)",
          borderColor: "var(--line)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all"
              style={{
                background: "var(--surface-1)",
                borderColor: "var(--line)",
                color: "var(--ink-3)",
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Site</span>
            </Link>

            <div className="h-4 w-px bg-zinc-700/50 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center p-0.5 border" style={{ borderColor: "var(--line)", background: "var(--surface-2)" }}>
                <Image src="/college-logo.png" alt="Sacred Heart College" width={28} height={28} className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-tight" style={{ color: "var(--ink)" }}>
                  VORTEX NEOVIA &apos;27
                </span>
                <span className="text-[10px] font-mono" style={{ color: "var(--ink-4)" }}>
                  Admin Operations Portal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Eyebrow & Headline */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium mb-3"
            style={{
              background: "rgba(22, 163, 107, 0.08)",
              borderColor: "rgba(22, 163, 107, 0.25)",
              color: "var(--accent)",
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AUTHENTICATED ACCESS ONLY</span>
          </div>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Registration Dashboard &amp; Analytics
          </h1>
          <p className="mt-2 text-sm sm:text-base leading-relaxed" style={{ color: "var(--ink-3)" }}>
            Monitor participant registrations, filter verification statuses, and export live data.
            Works with either the admin password or the registration desk password.
          </p>
        </div>

        {/* Authentication & Query Toolbar */}
        <div
          className="p-5 sm:p-6 rounded-2xl border shadow-sm mb-8 transition-all"
          style={{
            background: "var(--surface-1)",
            borderColor: "var(--line)",
          }}
        >
          <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Access Key Input (admin or registration-team password) */}
            <div className="md:col-span-3 space-y-1.5">
              <label
                htmlFor="admin-pw"
                className="block text-xs font-mono uppercase tracking-wider font-semibold"
                style={{ color: "var(--ink-3)" }}
              >
                Access Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4" style={{ color: "var(--ink-4)" }} />
                </div>
                <input
                  id="admin-pw"
                  type={showPassword ? "text" : "password"}
                  placeholder="Admin or registration desk password"
                  autoComplete="current-password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadData()}
                  className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all font-mono"
                  style={{
                    background: "var(--surface-2)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  style={{ color: "var(--ink-4)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3 space-y-1.5">
              <label
                htmlFor="admin-filter"
                className="block text-xs font-mono uppercase tracking-wider font-semibold"
                style={{ color: "var(--ink-3)" }}
              >
                Status
              </label>
              <div className="relative">
                <select
                  id="admin-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all font-mono appearance-none cursor-pointer"
                  style={{
                    background: "var(--surface-2)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PAID">PAID (Verified)</option>
                  <option value="PENDING">PENDING</option>
                  <option value="FAILED">FAILED / Expired</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Filter className="w-3.5 h-3.5" style={{ color: "var(--ink-4)" }} />
                </div>
              </div>
            </div>

            {/* Payment Method Filter */}
            <div className="md:col-span-3 space-y-1.5">
              <label
                htmlFor="admin-method-filter"
                className="block text-xs font-mono uppercase tracking-wider font-semibold"
                style={{ color: "var(--ink-3)" }}
              >
                Method
              </label>
              <div className="relative">
                <select
                  id="admin-method-filter"
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all font-mono appearance-none cursor-pointer"
                  style={{
                    background: "var(--surface-2)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                >
                  <option value="ALL">All Methods</option>
                  <option value="RAZORPAY">Razorpay</option>
                  <option value="CASH">Cash</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Wallet className="w-3.5 h-3.5" style={{ color: "var(--ink-4)" }} />
                </div>
              </div>
            </div>

            {/* Attendance Filter */}
            <div className="md:col-span-3 space-y-1.5">
              <label
                htmlFor="admin-attendance-filter"
                className="block text-xs font-mono uppercase tracking-wider font-semibold"
                style={{ color: "var(--ink-3)" }}
              >
                Attendance
              </label>
              <div className="relative">
                <select
                  id="admin-attendance-filter"
                  value={filterAttendance}
                  onChange={(e) => setFilterAttendance(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all font-mono appearance-none cursor-pointer"
                  style={{
                    background: "var(--surface-2)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                >
                  <option value="ALL">All</option>
                  <option value="PRESENT">Checked in</option>
                  <option value="ABSENT">Not checked in</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <UserCheck className="w-3.5 h-3.5" style={{ color: "var(--ink-4)" }} />
                </div>
              </div>
            </div>

          </div>

          {/* Action row — divider keeps it visually distinct from the filters */}
          <div
            className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 pt-4 border-t"
            style={{ borderColor: "var(--line)" }}
          >
            <button
              onClick={loadData}
              disabled={loading || !token}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
              style={{ background: "var(--accent)" }}
            >
              <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Fetching Data…" : "Load Dashboard"}</span>
            </button>

            <button
              onClick={() => setShowWalkIn((v) => !v)}
              disabled={!token || !data}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border shadow-sm transition-all disabled:opacity-40 cursor-pointer"
              style={{
                background: "var(--surface-2)",
                borderColor: "var(--line)",
                color: "var(--ink-2)",
              }}
              title="Add a walk-in cash registration"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Walk-in</span>
            </button>

            {isAdmin && (
              <button
                onClick={downloadCsv}
                disabled={!token || !data}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border shadow-sm transition-all disabled:opacity-40 cursor-pointer sm:ml-auto"
                style={{
                  background: "var(--surface-2)",
                  borderColor: "var(--line)",
                  color: "var(--ink-2)",
                }}
                title="Download CSV Spreadsheet"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
          </div>

          {/* Walk-in Registration Form */}
          {showWalkIn && (
            <div
              className="mt-5 p-4 sm:p-5 rounded-xl border"
              style={{ background: "var(--surface-2)", borderColor: "var(--line)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                    Add Walk-in Registration (Cash — marked PAID immediately)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWalkIn(false)}
                  style={{ color: "var(--ink-4)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={submitWalkIn} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { field: "name" as const, placeholder: "Full name", type: "text", autoComplete: "name" },
                  { field: "email" as const, placeholder: "Email address", type: "email", autoComplete: "email" },
                  { field: "phone" as const, placeholder: "10-digit phone", type: "tel", autoComplete: "tel" },
                  { field: "college" as const, placeholder: "College", type: "text", autoComplete: "organization" },
                  { field: "department" as const, placeholder: "Department", type: "text" },
                  { field: "year" as const, placeholder: "Select year", type: "text" },
                  { field: "gender" as const, placeholder: "Select gender", type: "text" },
                  { field: "foodPreference" as const, placeholder: "Select food preference", type: "text" },
                ].map(({ field, placeholder, type, autoComplete }) => {
                  const options = SELECT_OPTIONS[field];
                  const controlClass =
                    "px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all";
                  const controlStyle = {
                    background: "var(--surface-1)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  } as const;
                  if (options) {
                    return (
                      <select
                        key={field}
                        value={walkInForm[field]}
                        onChange={(e) => setWalkInField(field, e.target.value)}
                        className={`${controlClass} appearance-none cursor-pointer`}
                        style={controlStyle}
                      >
                        <option value="">{placeholder}</option>
                        {options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    );
                  }
                  return (
                    <input
                      key={field}
                      type={type}
                      placeholder={placeholder}
                      autoComplete={autoComplete}
                      value={walkInForm[field]}
                      onChange={(e) => setWalkInField(field, e.target.value)}
                      required={field === "name" || field === "email" || field === "phone"}
                      className={controlClass}
                      style={controlStyle}
                    />
                  );
                })}

                <button
                  type="submit"
                  disabled={walkInSubmitting}
                  className="sm:col-span-2 lg:col-span-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  style={{ background: "var(--accent)" }}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{walkInSubmitting ? "Adding…" : "Add & Mark Paid"}</span>
                </button>
              </form>

              {walkInError && (
                <div
                  className="mt-3 p-3 rounded-xl border text-xs font-mono flex items-center gap-2.5"
                  style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                  }}
                >
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{walkInError}</span>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="mt-4 p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
              }}
            >
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Loaded Data View */}
        {data && (
          <div className="space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {/* Total Card */}
              <div
                className="p-4 sm:p-5 rounded-2xl border shadow-sm flex items-center gap-4"
                style={{ background: "var(--surface-1)", borderColor: "var(--line)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "var(--surface-2)", color: "var(--ink)" }}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "var(--ink)" }}>
                    {totalCount}
                  </span>
                  <span className="block text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                    Total Registrations
                  </span>
                </div>
              </div>

              {/* Paid Card */}
              <div
                className="p-4 sm:p-5 rounded-2xl border shadow-sm flex items-center gap-4"
                style={{ background: "var(--surface-1)", borderColor: "var(--line)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-500">
                    {paidCount}
                  </span>
                  <span className="block text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                    Paid &amp; Verified
                  </span>
                </div>
              </div>

              {/* Pending Card */}
              <div
                className="p-4 sm:p-5 rounded-2xl border shadow-sm flex items-center gap-4"
                style={{ background: "var(--surface-1)", borderColor: "var(--line)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-500">
                    {pendingCount}
                  </span>
                  <span className="block text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                    Pending Orders
                  </span>
                </div>
              </div>

              {/* Failed Card */}
              <div
                className="p-4 sm:p-5 rounded-2xl border shadow-sm flex items-center gap-4"
                style={{ background: "var(--surface-1)", borderColor: "var(--line)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-500">
                    {failedCount}
                  </span>
                  <span className="block text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                    Failed / Dropped
                  </span>
                </div>
              </div>

              {/* Cash Pending Card */}
              <div
                className="p-4 sm:p-5 rounded-2xl border shadow-sm flex items-center gap-4"
                style={{ background: "var(--surface-1)", borderColor: "var(--line)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-sky-500/10 text-sky-500">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-sky-500">
                    {cashPendingCount}
                  </span>
                  <span className="block text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                    Cash — Awaiting Check-in
                  </span>
                </div>
              </div>
            </div>

            {/* Search and Table Container */}
            <div
              className="rounded-2xl border shadow-sm overflow-hidden"
              style={{ background: "var(--surface-1)", borderColor: "var(--line)" }}
            >
              {/* Table Top Controls */}
              <div
                className="p-4 sm:p-5 border-b flex flex-col sm:flex-row items-center justify-between gap-3.5"
                style={{ borderColor: "var(--line)" }}
              >
                <div className="relative w-full sm:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4" style={{ color: "var(--ink-4)" }} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search name, email, phone, college, or reference ID…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-1 transition-all font-mono"
                    style={{
                      background: "var(--surface-2)",
                      borderColor: "var(--line)",
                      color: "var(--ink)",
                    }}
                  />
                </div>

                <div className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>
                  Showing <span className="font-semibold" style={{ color: "var(--ink)" }}>{filteredRegistrations.length}</span> of {data.registrations.length} records
                </div>
              </div>

              {/* Registration cards — responsive, no horizontal scroll.
                  2-up on large screens so more records are visible at once. */}
              <div className="p-4 sm:p-5">
                {filteredRegistrations.length === 0 ? (
                  <div className="py-12 text-center text-xs font-mono" style={{ color: "var(--ink-4)" }}>
                    {searchQuery
                      ? `No registrations found matching "${searchQuery}".`
                      : "No registrations yet."}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                    {filteredRegistrations.map((r) => {
                      const canEdit = !(data?.role === "team" && r.paymentMethod === "RAZORPAY");
                      const busy = markingId === r.id;
                      return (
                        <div
                          key={r.id}
                          className="rounded-xl border p-4 flex flex-col gap-3"
                          style={{ background: "var(--surface-2)", borderColor: "var(--line)" }}
                        >
                          {/* Header: name + badges */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate" style={{ color: "var(--ink)" }} title={r.name}>
                                {r.name}
                              </p>
                              <p className="text-[10px] font-mono" style={{ color: "var(--ink-4)" }}>
                                ID: {r.id.slice(0, 10)}…
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-1.5 flex-shrink-0">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase border ${
                                  r.paymentMethod === "CASH"
                                    ? "bg-sky-500/10 text-sky-500 border-sky-500/25"
                                    : "bg-violet-500/10 text-violet-500 border-violet-500/25"
                                }`}
                              >
                                {r.paymentMethod === "CASH" ? <Wallet className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                {r.paymentMethod === "CASH" ? "Cash" : "Razorpay"}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase border ${
                                  r.status === "PAID"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                                    : r.status === "PENDING"
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                                    : "bg-rose-500/10 text-rose-500 border-rose-500/25"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    r.status === "PAID" ? "bg-emerald-500" : r.status === "PENDING" ? "bg-amber-500" : "bg-rose-500"
                                  }`}
                                />
                                {r.status}
                              </span>
                            </div>
                          </div>

                          {/* Details */}
                          <div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs"
                            style={{ color: "var(--ink-3)" }}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Mail className="w-3 h-3 flex-shrink-0 text-zinc-500" />
                              <span className="truncate font-mono" title={r.email}>{r.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 flex-shrink-0 text-zinc-500" />
                              <span className="font-mono">{r.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Building2 className="w-3 h-3 flex-shrink-0 text-zinc-500" />
                              <span className="truncate" title={`${r.college ?? ""}${r.department ? " · " + r.department : ""}`}>
                                {r.college ?? "—"}{r.department ? ` · ${r.department}` : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <GraduationCap className="w-3 h-3 flex-shrink-0 text-zinc-500" />
                              <span>{r.year ?? "—"} · {r.gender ?? "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Utensils className="w-3 h-3 flex-shrink-0 text-zinc-500" />
                              <span>{r.foodPreference ?? "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5" style={{ color: "var(--ink-4)" }}>
                              <Clock className="w-3 h-3 flex-shrink-0 text-zinc-500" />
                              <span>
                                Registered{" "}
                                {new Date(r.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div
                            className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t"
                            style={{ borderColor: "var(--line)" }}
                          >
                            <button
                              onClick={() => toggleAttendance(r)}
                              disabled={togglingId === r.id}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase border transition-all disabled:opacity-50 cursor-pointer ${
                                r.attended
                                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                                  : "bg-zinc-500/10 text-zinc-400 border-zinc-500/25"
                              }`}
                              title={r.attended ? "Checked in — click to undo" : "Mark as checked in"}
                            >
                              {r.attended ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {r.attended ? "Present" : "Absent"}
                            </button>

                            {r.paymentMethod === "CASH" && r.status === "PENDING" && (
                              <button
                                onClick={() => markCashPaid(r.id)}
                                disabled={busy}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                                style={{ background: "var(--accent-light)", borderColor: "var(--accent-line)", color: "var(--accent)" }}
                                title="Confirm cash was collected at check-in"
                              >
                                <Banknote className="w-3.5 h-3.5" />
                                {busy ? "Marking…" : "Mark Paid"}
                              </button>
                            )}

                            {r.paymentMethod === "CASH" && r.status === "PAID" && (
                              <button
                                onClick={() => unmarkCashPaid(r.id)}
                                disabled={busy}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all disabled:opacity-50 cursor-pointer"
                                style={{ background: "var(--surface-1)", borderColor: "var(--line)", color: "var(--ink-3)" }}
                                title="Undo — flip this cash registration back to PENDING (wrong click, refund given, etc.)"
                              >
                                <Undo2 className="w-3.5 h-3.5" />
                                {busy ? "Undoing…" : "Undo Paid"}
                              </button>
                            )}

                            {isAdmin && r.paymentMethod === "CASH" && (
                              <select
                                value={r.status}
                                onChange={(e) => changeStatus(r, e.target.value)}
                                disabled={statusSavingId === r.id}
                                className="px-2 py-1 text-[11px] rounded-lg border font-mono cursor-pointer disabled:opacity-50"
                                style={{ background: "var(--surface-1)", borderColor: "var(--line)", color: "var(--ink-2)" }}
                                title="Change status (cash rows only)"
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            )}

                            <span className="grow" />

                            {canEdit && (
                              <button
                                onClick={() => openEdit(r)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer"
                                style={{ background: "var(--surface-1)", borderColor: "var(--line)", color: "var(--ink-3)" }}
                                title="Edit registrant details"
                              >
                                Edit
                              </button>
                            )}

                            {isAdmin && (
                              <button
                                onClick={() => deleteRow(r)}
                                disabled={deletingId === r.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all disabled:opacity-50 cursor-pointer"
                                style={{ background: "rgba(239, 68, 68, 0.08)", borderColor: "rgba(239, 68, 68, 0.3)", color: "#ef4444" }}
                                title="Delete permanently"
                              >
                                {deletingId === r.id ? "…" : "Delete"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Registration Modal */}
        {editingRow && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => !editSubmitting && setEditingRow(null)}
          >
            <div
              className="w-full max-w-lg rounded-2xl border shadow-xl p-5 sm:p-6"
              style={{ background: "var(--surface-1)", borderColor: "var(--line)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                  Edit registration — {editingRow.name}
                </h3>
                <button
                  type="button"
                  onClick={() => !editSubmitting && setEditingRow(null)}
                  style={{ color: "var(--ink-4)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] font-mono mb-3" style={{ color: "var(--ink-4)" }}>
                {editingRow.paymentMethod} · {editingRow.status} — payment status &amp; method aren&apos;t editable here.
              </p>

              <form onSubmit={submitEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EDIT_FIELDS.map(({ key, label, type }) => {
                  const options = SELECT_OPTIONS[key];
                  return (
                    <label key={key} className="flex flex-col gap-1 text-[11px] font-mono" style={{ color: "var(--ink-3)" }}>
                      {label}
                      {options ? (
                        <select
                          value={editForm[key]}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer"
                          style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--ink)" }}
                        >
                          <option value="">—</option>
                          {options.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type}
                          value={editForm[key]}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, [key]: e.target.value }))}
                          required={key === "name" || key === "email" || key === "phone"}
                          className="px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all"
                          style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--ink)" }}
                        />
                      )}
                    </label>
                  );
                })}

                {editError && (
                  <div
                    className="sm:col-span-2 p-3 rounded-xl border text-xs font-mono flex items-center gap-2.5"
                    style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}
                  >
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                <div className="sm:col-span-2 flex items-center justify-end gap-2.5 mt-1">
                  <button
                    type="button"
                    onClick={() => setEditingRow(null)}
                    disabled={editSubmitting}
                    className="px-4 py-2 rounded-xl text-sm font-medium border disabled:opacity-50 cursor-pointer"
                    style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--ink-2)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-md disabled:opacity-50 cursor-pointer"
                    style={{ background: "var(--accent)" }}
                  >
                    {editSubmitting ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
