import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-black text-slate-900">DITYA IRRIGATION Login</h1>
        <input className="mt-4 w-full rounded-xl border p-3" placeholder="Mobile Number" value={form.mobile} onChange={(e) => setForm((prev) => ({ ...prev, mobile: e.target.value }))} />
        <input className="mt-3 w-full rounded-xl border p-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        <button className="mt-4 w-full rounded-xl bg-emerald-600 p-3 font-bold text-white">Login</button>
        <div className="mt-3 flex justify-between text-sm">
          <Link to="/forgot-password" className="text-emerald-700">Forgot Password?</Link>
          <Link to="/" className="text-slate-600">Public Site</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
