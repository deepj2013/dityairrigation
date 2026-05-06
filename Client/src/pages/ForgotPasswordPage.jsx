import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

function ForgotPasswordPage() {
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/auth/forgot-password", { mobile, newPassword });
    setMessage(data.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-black text-slate-900">Reset Password</h1>
        <input className="mt-4 w-full rounded-xl border p-3" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        <input className="mt-3 w-full rounded-xl border p-3" placeholder="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button className="mt-4 w-full rounded-xl bg-emerald-600 p-3 font-bold text-white">Update Password</button>
        {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
        <Link to="/login" className="mt-3 block text-sm text-slate-600">Back to Login</Link>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
