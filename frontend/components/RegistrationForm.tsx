"use client";

import { useState, useRef, useEffect } from "react";
import { registerForWorkshop, getRegistrationStatus } from "@/lib/api";

// Online payment is disabled — every registration is a cash reservation
// collected at the registration desk on event day (Razorpay Live onboarding
// was declined for an individual running event registration). To re-enable
// online payment, restore the payment-method radio below, the Razorpay
// checkout script loader, and the RAZORPAY branch in handleSubmit — see git
// history for this file, plus HANDOFF.md 2026-08-30.
interface FormState {
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  gender: string;
  foodPreference: string;
  paymentMethod: "CASH";
}

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: string;
  gender?: string;
  foodPreference?: string;
}

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "Final Year"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const FOOD_OPTIONS = ["Vegetarian", "Non-Vegetarian"];

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""));
}

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
    year: "",
    gender: "",
    foodPreference: "",
    paymentMethod: "CASH",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  // null = not checked yet (render the form; the backend is still the real
  // gate). false = registration manually closed → show the closed panel.
  const [regOpen, setRegOpen] = useState<boolean | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getRegistrationStatus().then((s) => setRegOpen(s.open));
  }, []);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!validateEmail(form.email)) e.email = "Please enter a valid email address.";
    if (!validatePhone(form.phone)) e.phone = "Please enter a valid 10-digit phone number.";
    if (!form.college.trim() || form.college.trim().length < 2) e.college = "Please enter your college name.";
    if (!form.department.trim() || form.department.trim().length < 2) e.department = "Please enter your department.";
    if (!form.year) e.year = "Please select your year of study.";
    if (!form.gender) e.gender = "Please select your gender.";
    if (!form.foodPreference) e.foodPreference = "Please select your food preference.";
    return e;
  }

  function set(field: keyof FieldErrors, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // scroll to first error
      const firstErrField = formRef.current?.querySelector(".form-row.invalid");
      if (firstErrField) {
        firstErrField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    try {
      const result = await registerForWorkshop({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/\s+/g, ""),
        college: form.college.trim(),
        department: form.department.trim(),
        year: form.year,
        gender: form.gender,
        foodPreference: form.foodPreference,
        paymentMethod: form.paymentMethod,
      });

      // No payment gateway involved — the seat is reserved and cash is
      // collected at the check-in desk on event day.
      window.location.href = `/success?method=cash&order_id=wr_${result.registrationId}`;
    } catch (err: any) {
      const msg: string = err?.message || "Something went wrong. Please try again.";
      // Backend returns 403 "Online registration is closed…" — swap to the
      // closed panel instead of leaving the filled-in form on screen.
      if (/registration is closed/i.test(msg)) {
        setRegOpen(false);
        return;
      }
      setApiError(msg);
      setLoading(false);
    }
  }

  function fieldClass(field: keyof FieldErrors) {
    return `form-row${errors[field] ? " invalid" : ""}`;
  }

  // Registration manually closed (backend REGISTRATION_OPEN=false). The check
  // fails open, so we only swap in this panel on an explicit `false`.
  if (regOpen === false) {
    return (
      <div
        className="reg-form reveal"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 12,
          padding: "40px 28px",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--surface-2)",
            border: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
          aria-hidden="true"
        >
          ✓
        </div>
        <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "var(--ink)" }}>
          Online registration is closed
        </h3>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.6, maxWidth: 380 }}>
          Thank you for your interest. If you already reserved a seat, your confirmation
          email still stands — just bring your Reference ID, a valid college ID, and the
          ₹200 fee in cash to the registration desk on event day.
        </p>
        <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-4)", lineHeight: 1.6 }}>
          Questions? Help desk:{" "}
          <a href="tel:+916383483749" style={{ color: "var(--accent)" }}>
            +91&nbsp;63834&nbsp;83749
          </a>
        </p>
      </div>
    );
  }

  return (
    <form
      id="reg-form"
      ref={formRef}
      className="reg-form reveal"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Registration window notice */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          marginBottom: 18,
          borderRadius: "var(--r-md, 12px)",
          background: "var(--accent-light)",
          border: "1px solid var(--accent-line)",
          fontSize: 12.5,
          lineHeight: 1.5,
          color: "var(--ink-2)",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent)",
            flexShrink: 0,
          }}
        />
        <span>
          Online registration closes <strong>September 7, 2026, 12:00 AM</strong> — two
          days before the event on September 9.
        </span>
      </div>

      {/* Full Name */}
      <div className={fieldClass("name")}>
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="Enter your full name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <span className="error-msg" id="err-fullName">
          {errors.name || "Please enter your full name."}
        </span>
      </div>

      {/* Email + Phone */}
      <div className="form-pair">
        <div className={fieldClass("email")}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <span className="error-msg" id="err-email">
            {errors.email || "Please enter a valid email address."}
          </span>
        </div>

        <div className={fieldClass("phone")}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="10-digit mobile number"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          <span className="error-msg" id="err-phone">
            {errors.phone || "Please enter a valid 10-digit phone number."}
          </span>
        </div>
      </div>

      {/* College + Department */}
      <div className="form-pair">
        <div className={fieldClass("college")}>
          <label htmlFor="collegeName">College Name</label>
          <input
            type="text"
            id="collegeName"
            name="collegeName"
            placeholder="Enter your college name"
            autoComplete="organization"
            value={form.college}
            onChange={(e) => set("college", e.target.value)}
          />
          <span className="error-msg" id="err-collegeName">
            {errors.college || "Please enter your college name."}
          </span>
        </div>

        <div className={fieldClass("department")}>
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            placeholder="Enter your department"
            value={form.department}
            onChange={(e) => set("department", e.target.value)}
          />
          <span className="error-msg" id="err-department">
            {errors.department || "Please enter your department."}
          </span>
        </div>
      </div>

      {/* Year of Study */}
      <div className={fieldClass("year")}>
        <label htmlFor="year">Year of Study</label>
        <select
          id="year"
          name="year"
          value={form.year}
          onChange={(e) => set("year", e.target.value)}
        >
          <option value="" disabled>
            Select year of study
          </option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span className="error-msg" id="err-year">
          {errors.year || "Please select your year of study."}
        </span>
      </div>

      {/* Gender */}
      <div className={`form-row radio-row${errors.gender ? " invalid" : ""}`}>
        <fieldset className="radio-fieldset">
          <legend>Gender</legend>
          <div className="radio-group">
            {GENDER_OPTIONS.map((g) => (
              <label key={g} className="radio-pill">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={() => set("gender", g)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <span className="error-msg" id="err-gender">
          {errors.gender || "Please select your gender."}
        </span>
      </div>

      {/* Food Preference */}
      <div className={`form-row radio-row${errors.foodPreference ? " invalid" : ""}`}>
        <fieldset className="radio-fieldset">
          <legend>Food Preference</legend>
          <div className="radio-group">
            {FOOD_OPTIONS.map((f) => (
              <label key={f} className="radio-pill">
                <input
                  type="radio"
                  name="food"
                  value={f}
                  checked={form.foodPreference === f}
                  onChange={() => set("foodPreference", f)}
                />
                <span>{f}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <span className="error-msg" id="err-food">
          {errors.foodPreference || "Please select your food preference."}
        </span>
      </div>

      {/* Payment — cash collected at the registration desk on event day */}
      <div className="form-row">
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "var(--r-md, 12px)",
            background: "var(--surface-2)",
            border: "1px solid var(--line)",
          }}
        >
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>
            Pay ₹200 cash at the registration desk
          </p>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12.5,
              color: "var(--ink-3)",
              lineHeight: 1.5,
            }}
          >
            Submitting this form reserves your seat. Bring <strong>₹200 in cash</strong> and a
            valid student/college ID to the registration desk on event day to complete your
            registration.
          </p>
        </div>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="alert-error" role="alert">
          <i className="fa-solid fa-circle-exclamation" />
          {apiError}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-full"
        id="submit-btn"
        disabled={loading}
        style={{ opacity: loading ? 0.75 : 1 }}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin" />
            <span>Reserving your seat…</span>
          </>
        ) : (
          <>
            <span>Reserve My Seat</span>
            <i className="fa-solid fa-arrow-right" />
          </>
        )}
      </button>
    </form>
  );
}
