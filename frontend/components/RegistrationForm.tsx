"use client";

import { useState, useRef } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { registerForWorkshop } from "@/lib/api";

interface FormState {
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  gender: string;
  foodPreference: string;
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
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  function set(field: keyof FormState, value: string) {
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
      const { paymentSessionId } = await registerForWorkshop({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/\s+/g, ""),
        college: form.college.trim(),
        department: form.department.trim(),
        year: form.year,
        gender: form.gender,
        foodPreference: form.foodPreference,
      });

      const cashfree = await load({
        mode:
          process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
            ? "production"
            : "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err: any) {
      setApiError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function fieldClass(field: keyof FieldErrors) {
    return `form-row${errors[field] ? " invalid" : ""}`;
  }

  return (
    <form
      id="reg-form"
      ref={formRef}
      className="reg-form reveal"
      onSubmit={handleSubmit}
      noValidate
    >
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
            <span>Redirecting to payment…</span>
          </>
        ) : (
          <>
            <span>Register &amp; Pay</span>
            <i className="fa-solid fa-arrow-right" />
          </>
        )}
      </button>
    </form>
  );
}
