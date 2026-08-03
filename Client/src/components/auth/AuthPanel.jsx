import Icon from "../ui/Icon";
import { Banner } from "../ui/Feedback";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "employee", label: "Employee" },
  { value: "teacher", label: "Teacher" },
  { value: "hr", label: "HR" },
  { value: "student", label: "Student" },
  { value: "admin", label: "Admin" },
];

const EMPLOYEE_ROLES = ["employee", "teacher", "hr"];

const DEPARTMENT_OPTIONS = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Cyber Security",
  "Data Science",
];

const CLASS_OPTIONS = [
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Masters",
  "PhD",
];

const HIGHLIGHTS = [
  {
    icon: "calendarCheck",
    title: "Daily attendance",
    body: "Mark present or absent in one tap and keep a running history.",
  },
  {
    icon: "calendarPlus",
    title: "Leave requests",
    body: "Submit, track, and cancel leave without chasing anyone.",
  },
  {
    icon: "chart",
    title: "Live reporting",
    body: "Admins get today's roster and monthly trends at a glance.",
  },
];

function AuthPanel({
  isLogin,
  form,
  loading,
  message,
  theme,
  onToggleTheme,
  updateField,
  switchMode,
  submitAuth,
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — hidden on small screens, where it would only push the
          form below the fold. */}
      <aside className="relative hidden overflow-hidden bg-brand-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand-400/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-brand-900/50 blur-3xl"
        />

        <div className="relative flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <Icon name="clipboard" className="size-5" />
          </span>
          <p className="text-sm font-bold tracking-tight">
            Attendance Management System
          </p>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Run your staff and student workflows in one place.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-100">
            Attendance, leave, and reporting for your whole organisation —
            without the spreadsheets.
          </p>

          <ul className="mt-9 flex flex-col gap-5">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex gap-3.5">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-white/12 ring-1 ring-white/20">
                  <Icon name={item.icon} className="size-[1.15rem]" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-sm text-brand-100">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-brand-200">
          Secured with encrypted sessions and role-based access.
        </p>
      </aside>

      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-start justify-between gap-3">
            <div>
              <span className="mb-4 inline-grid size-10 place-items-center rounded-xl bg-brand-600 text-white shadow-soft lg:hidden">
                <Icon name="clipboard" className="size-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-1.5 text-sm text-ink-muted">
                {isLogin
                  ? "Sign in to reach your dashboard."
                  : "Register to start tracking attendance and leave."}
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className="btn-secondary btn-sm"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              <Icon
                name={theme === "dark" ? "sun" : "moon"}
                className="size-4"
              />
            </button>
          </div>

          {/* Segmented sign-in / register switch */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface-sunken p-1">
            {[
              { mode: "login", label: "Sign in", active: isLogin },
              { mode: "register", label: "Register", active: !isLogin },
            ].map((tab) => (
              <button
                key={tab.mode}
                type="button"
                aria-pressed={tab.active}
                onClick={() => switchMode(tab.mode)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  tab.active
                    ? "bg-surface text-ink shadow-soft"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={submitAuth} className="flex flex-col gap-4">
            {!isLogin && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="field-label">
                    First name
                    <input
                      className="field-input"
                      name="firstname"
                      value={form.firstname}
                      onChange={updateField}
                      placeholder="Ada"
                      autoComplete="given-name"
                      required
                    />
                  </label>
                  <label className="field-label">
                    Last name
                    <input
                      className="field-input"
                      name="lastname"
                      value={form.lastname}
                      onChange={updateField}
                      placeholder="Lovelace"
                      autoComplete="family-name"
                      required
                    />
                  </label>
                </div>

                <label className="field-label">
                  Phone
                  <input
                    className="field-input"
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="+254 700 000 000"
                    autoComplete="tel"
                    required
                  />
                </label>

                <label className="field-label">
                  Role
                  <select
                    className="field-input"
                    name="role"
                    value={form.role}
                    onChange={updateField}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Employees pick the department they belong to. */}
                {EMPLOYEE_ROLES.includes(form.role) && (
                  <label className="field-label">
                    Department
                    <select
                      className="field-input"
                      name="department"
                      value={form.department}
                      onChange={updateField}
                      required
                    >
                      <option value="" disabled>
                        Select a department
                      </option>
                      {DEPARTMENT_OPTIONS.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {/* Students supply their enrolment details. */}
                {form.role === "student" && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="field-label">
                        Admission number
                        <input
                          className="field-input"
                          name="admissionNumber"
                          value={form.admissionNumber}
                          onChange={updateField}
                          placeholder="ADM-00123"
                          required
                        />
                      </label>
                      <label className="field-label">
                        Class
                        <select
                          className="field-input"
                          name="class"
                          value={form.class}
                          onChange={updateField}
                          required
                        >
                          <option value="" disabled>
                            Select a class
                          </option>
                          {CLASS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="field-label">
                      Department
                      <select
                        className="field-input"
                        name="department"
                        value={form.department}
                        onChange={updateField}
                        required
                      >
                        <option value="" disabled>
                          Select a department
                        </option>
                        {DEPARTMENT_OPTIONS.map((department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="field-label">
                      Guardian name
                      <input
                        className="field-input"
                        name="guardian"
                        value={form.guardian}
                        onChange={updateField}
                        placeholder="Parent or guardian full name"
                        required
                      />
                    </label>
                  </>
                )}
              </>
            )}

            <label className="field-label">
              Email
              <input
                className="field-input"
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="field-label">
              Password
              <input
                className="field-input"
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
            </label>

            <button
              type="submit"
              className="btn-primary mt-1 w-full"
              disabled={loading}
            >
              {loading ? "Working…" : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          {message && (
            <div className="mt-5">
              <Banner>{message}</Banner>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-ink-muted">
            {isLogin ? "New here? " : "Already registered? "}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? "register" : "login")}
              className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              {isLogin ? "Create an account" : "Sign in instead"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default AuthPanel;
