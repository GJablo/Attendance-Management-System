function AuthPanel({
  isLogin,
  form,
  loading,
  message,
  user,
  profile,
  updateField,
  switchMode,
  submitAuth,
  logout,
}) {
  return (
    <>
      <section className="panel panel-hero">
        <h2>Run your staff and student workflows</h2>
      </section>

      <section className="panel">
        <div className="toggle-row">
          <button
            type="button"
            className={isLogin ? "toggle active" : "toggle"}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? "toggle active" : "toggle"}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={submitAuth} className="auth-form">
          {!isLogin && (
            <>
              <div className="field-row">
                <label>
                  First name
                  <input
                    name="firstname"
                    value={form.firstname}
                    onChange={updateField}
                    required
                  />
                </label>
                <label>
                  Last name
                  <input
                    name="lastname"
                    value={form.lastname}
                    onChange={updateField}
                    required
                  />
                </label>
              </div>

              <label>
                Phone
                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  required
                />
              </label>

              <label>
                Role
                <select name="role" value={form.role} onChange={updateField}>
                  <option value="user">User</option>
                  <option value="employee">Employee</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </>
          )}

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={updateField}
              required
            />
          </label>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Working…" : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        {user && (
          <div className="user-card">
            <div>
              <p className="eyebrow">Signed in</p>
              <h3>
                {user.firstname} {user.lastname}
              </h3>
              <p>{user.email}</p>
            </div>
            <button type="button" className="secondary-btn" onClick={logout}>
              Log out
            </button>
          </div>
        )}

        {profile && (
          <div className="profile-card">
            <h3>Profile details</h3>
            <p>Role: {profile.role}</p>
            <p>Phone: {profile.phone}</p>
            <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </section>
    </>
  );
}

export default AuthPanel;
