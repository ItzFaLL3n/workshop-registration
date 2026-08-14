"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

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
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");

  async function loadData() {
    setError(null);
    setLoading(true);
    try {
      const url = filterStatus !== "ALL"
        ? `${API_URL}/admin/registrations?status=${filterStatus}`
        : `${API_URL}/admin/registrations`;
      const res = await fetch(url, { headers: { "x-admin-token": token } });
      if (!res.ok) { setError("Wrong password or server error."); setLoading(false); return; }
      setData(await res.json());
    } catch {
      setError("Could not connect to server.");
    }
    setLoading(false);
  }

  async function downloadCsv() {
    const res = await fetch(`${API_URL}/admin/registrations.csv`, {
      headers: { "x-admin-token": token },
    });
    if (!res.ok) { setError("Wrong password or server error."); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const statusColor: Record<string, string> = {
    PAID: "#146c43",
    PENDING: "#b07d00",
    FAILED: "#c0392b",
    EXPIRED: "#7c9488",
  };

  return (
    <>
      <header className="site-header" style={{ position: "sticky", top: 0 }}>
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-logos">
              <div className="logo-box">
                <Image src="/college-logo.png" alt="Sacred Heart College" width={128} height={128} style={{ objectFit: "cover" }} />
              </div>
            </div>
            <div className="brand-text">
              <span className="brand-college">Sacred Heart College</span>
              <span className="brand-dept">Admin Panel</span>
            </div>
          </div>
          <nav className="main-nav" aria-label="Primary">
            <ul>
              <li><Link href="/" className="nav-link">← Back to Site</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main style={{ background: "#f5faf7", minHeight: "calc(100vh - 92px)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 32px" }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <span className="eyebrow" style={{ marginBottom: 16, display: "inline-flex" }}>
              <i className="fa-solid fa-shield-halved" /> Admin Only
            </span>
            <h1
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "2rem",
                fontWeight: 650,
                color: "#08211a",
                margin: "12px 0 0",
              }}
            >
              Registration Dashboard
            </h1>
          </div>

          {/* Auth + controls */}
          <div className="admin-toolbar" style={{ marginBottom: 28 }}>
            <div className="form-row">
              <label htmlFor="admin-pw">Admin Password</label>
              <input
                id="admin-pw"
                type="password"
                placeholder="Enter admin password"
                autoComplete="current-password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadData()}
              />
            </div>
            <div className="form-row field-narrow">
              <label htmlFor="admin-filter">Filter</label>
              <select
                id="admin-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
            <button
              onClick={loadData}
              disabled={loading || !token}
              className="btn btn-primary"
              style={{ opacity: loading || !token ? 0.7 : 1 }}
            >
              {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Loading…</> : <><i className="fa-solid fa-rotate" /> Load Data</>}
            </button>
            <button
              onClick={downloadCsv}
              disabled={!token}
              className="btn btn-ghost"
              style={{ opacity: !token ? 0.5 : 1 }}
            >
              <i className="fa-solid fa-download" /> Export CSV
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="alert-error" role="alert" style={{ marginBottom: 20 }}>
              <i className="fa-solid fa-circle-exclamation" />
              {error}
            </div>
          )}

          {/* Counts */}
          {data && (
            <>
              <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
                {data.counts.map((c) => (
                  <div
                    key={c.status}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dcece2",
                      borderRadius: 12,
                      padding: "14px 22px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      boxShadow: "0 2px 10px rgba(13,54,38,0.06)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Fraunces, serif",
                        fontSize: "1.6rem",
                        fontWeight: 650,
                        color: statusColor[c.status] ?? "#3f5c4d",
                        lineHeight: 1,
                      }}
                    >
                      {c._count}
                    </span>
                    <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: ".72rem", color: "#7c9488", letterSpacing: ".06em", textTransform: "uppercase" }}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #dcece2",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 2px 10px rgba(13,54,38,0.06)",
                }}
              >
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".88rem" }}>
                    <thead>
                      <tr style={{ background: "#f5faf7", borderBottom: "2px solid #dcece2" }}>
                        {["Name", "Email", "Phone", "College", "Dept.", "Year", "Gender", "Food", "Status", "Date"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "14px 16px",
                              textAlign: "left",
                              fontFamily: "IBM Plex Mono, monospace",
                              fontSize: ".72rem",
                              letterSpacing: ".06em",
                              textTransform: "uppercase",
                              color: "#7c9488",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.registrations.map((r, i) => (
                        <tr
                          key={r.id}
                          style={{
                            borderBottom: "1px solid #eaf3ee",
                            background: i % 2 === 0 ? "#ffffff" : "#f5faf7",
                          }}
                        >
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: "#08211a" }}>{r.name}</td>
                          <td style={{ padding: "12px 16px", color: "#3f5c4d" }}>{r.email}</td>
                          <td style={{ padding: "12px 16px", fontFamily: "IBM Plex Mono, monospace", color: "#3f5c4d" }}>{r.phone}</td>
                          <td style={{ padding: "12px 16px", color: "#3f5c4d" }}>{r.college ?? "—"}</td>
                          <td style={{ padding: "12px 16px", color: "#3f5c4d" }}>{r.department ?? "—"}</td>
                          <td style={{ padding: "12px 16px", color: "#3f5c4d" }}>{r.year ?? "—"}</td>
                          <td style={{ padding: "12px 16px", color: "#3f5c4d" }}>{r.gender ?? "—"}</td>
                          <td style={{ padding: "12px 16px", color: "#3f5c4d" }}>{r.foodPreference ?? "—"}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span
                              style={{
                                fontFamily: "IBM Plex Mono, monospace",
                                fontSize: ".72rem",
                                letterSpacing: ".04em",
                                fontWeight: 600,
                                color: statusColor[r.status] ?? "#3f5c4d",
                                background: r.status === "PAID" ? "#eaf7ef" : r.status === "FAILED" ? "#fdf2f2" : "#fffbea",
                                padding: "4px 10px",
                                borderRadius: 100,
                              }}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", fontFamily: "IBM Plex Mono, monospace", fontSize: ".72rem", color: "#7c9488" }}>
                            {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                          </td>
                        </tr>
                      ))}
                      {data.registrations.length === 0 && (
                        <tr>
                          <td
                            colSpan={10}
                            style={{ padding: "40px", textAlign: "center", color: "#7c9488", fontStyle: "italic" }}
                          >
                            No registrations found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
