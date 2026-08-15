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
  createdAt: string;
}

interface AdminData {
  registrations: Registration[];
  counts: { status: string; _count: number }[];
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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
        setError("Invalid admin password or server error. Please verify credentials.");
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

  // Filtered registrations based on client-side search query
  const filteredRegistrations = useMemo(() => {
    if (!data?.registrations) return [];
    if (!searchQuery.trim()) return data.registrations;

    const q = searchQuery.toLowerCase().trim();
    return data.registrations.filter((r) =>
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.toLowerCase().includes(q) ||
      r.college?.toLowerCase().includes(q) ||
      r.department?.toLowerCase().includes(q) ||
      r.id?.toLowerCase().includes(q)
    );
  }, [data?.registrations, searchQuery]);

  // Aggregate metric stats
  const totalCount = data?.registrations.length || 0;
  const paidCount = data?.counts.find((c) => c.status === "PAID")?._count || 0;
  const pendingCount = data?.counts.find((c) => c.status === "PENDING")?._count || 0;
  const failedCount = data?.counts.find((c) => c.status === "FAILED")?._count || 0;

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
      style={{ background: "var(--canvas)", color: "var(--ink)" }}
    >
      {/* Top Header / Navigation Bar */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-200"
        style={{
          background: "rgba(18, 18, 22, 0.75)",
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Admin Password Input */}
            <div className="md:col-span-4 space-y-1.5">
              <label
                htmlFor="admin-pw"
                className="block text-xs font-mono uppercase tracking-wider font-semibold"
                style={{ color: "var(--ink-3)" }}
              >
                Admin Secret Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4" style={{ color: "var(--ink-4)" }} />
                </div>
                <input
                  id="admin-pw"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter administrator password"
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
                Status Filter
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
                  <option value="ALL">All Statuses (Combined)</option>
                  <option value="PAID">PAID (Verified)</option>
                  <option value="PENDING">PENDING (Awaiting confirmation)</option>
                  <option value="FAILED">FAILED / Expired</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Filter className="w-3.5 h-3.5" style={{ color: "var(--ink-4)" }} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-5 flex items-center gap-2.5">
              <button
                onClick={loadData}
                disabled={loading || !token}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
                style={{
                  background: "var(--accent)",
                }}
              >
                <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>{loading ? "Fetching Data…" : "Load Dashboard"}</span>
              </button>

              <button
                onClick={downloadCsv}
                disabled={!token || !data}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border shadow-sm transition-all disabled:opacity-40 cursor-pointer"
                style={{
                  background: "var(--surface-2)",
                  borderColor: "var(--line)",
                  color: "var(--ink-2)",
                }}
                title="Download CSV Spreadsheet"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
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
                    placeholder="Search name, email, college, phone…"
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

              {/* Data Table */}
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr
                      className="border-b text-[11px] font-mono uppercase tracking-wider"
                      style={{
                        background: "var(--surface-2)",
                        borderColor: "var(--line)",
                        color: "var(--ink-4)",
                      }}
                    >
                      <th className="py-3 px-4 font-semibold">Participant</th>
                      <th className="py-3 px-4 font-semibold">Contact Info</th>
                      <th className="py-3 px-4 font-semibold">College &amp; Dept</th>
                      <th className="py-3 px-4 font-semibold">Year / Gender</th>
                      <th className="py-3 px-4 font-semibold">Food</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "var(--line)" }}>
                    {filteredRegistrations.map((r) => (
                      <tr
                        key={r.id}
                        className="transition-colors hover:bg-zinc-500/5"
                      >
                        {/* Participant Name */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold block" style={{ color: "var(--ink)" }}>
                            {r.name}
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: "var(--ink-4)" }}>
                            ID: {r.id.slice(0, 8)}…
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "var(--ink-2)" }}>
                            <Mail className="w-3 h-3 text-zinc-500" />
                            <span>{r.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "var(--ink-3)" }}>
                            <Phone className="w-3 h-3 text-zinc-500" />
                            <span>{r.phone}</span>
                          </div>
                        </td>

                        {/* College & Department */}
                        <td className="py-3.5 px-4 space-y-0.5 max-w-[200px]">
                          <div className="flex items-center gap-1.5 text-xs truncate" style={{ color: "var(--ink-2)" }}>
                            <Building2 className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                            <span className="truncate" title={r.college ?? ""}>{r.college ?? "—"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs truncate" style={{ color: "var(--ink-4)" }}>
                            <GraduationCap className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                            <span className="truncate" title={r.department ?? ""}>{r.department ?? "—"}</span>
                          </div>
                        </td>

                        {/* Year / Gender */}
                        <td className="py-3.5 px-4 text-xs font-mono" style={{ color: "var(--ink-3)" }}>
                          <span>{r.year ? `${r.year} Yr` : "—"}</span>
                          <span className="mx-1 text-zinc-600">/</span>
                          <span>{r.gender ?? "—"}</span>
                        </td>

                        {/* Food */}
                        <td className="py-3.5 px-4 text-xs font-mono" style={{ color: "var(--ink-3)" }}>
                          <span className="inline-flex items-center gap-1">
                            <Utensils className="w-3 h-3 text-zinc-500" />
                            {r.foodPreference ?? "Standard"}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wide uppercase border ${
                              r.status === "PAID"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                                : r.status === "PENDING"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/25"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              r.status === "PAID" ? "bg-emerald-500" : r.status === "PENDING" ? "bg-amber-500" : "bg-rose-500"
                            }`} />
                            {r.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-xs font-mono whitespace-nowrap" style={{ color: "var(--ink-4)" }}>
                          {new Date(r.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}

                    {filteredRegistrations.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-xs font-mono"
                          style={{ color: "var(--ink-4)" }}
                        >
                          No registrations found matching &quot;{searchQuery}&quot;.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
