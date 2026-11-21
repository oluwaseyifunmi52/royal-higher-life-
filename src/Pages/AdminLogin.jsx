import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const ADMIN_ROLES = ["admin", "superAdmin", "contentAdmin", "mediaAdmin", "ministryAdmin"];

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await api.post("/api/auth/admin-login", { email: form.email.trim(), password: form.password, adminOnly: true });
      const data = response.data?.data ?? response.data; const user = data.user ?? data.profile;
      if (!data.token || !ADMIN_ROLES.includes(user?.role)) throw new Error("This account does not have administrator access.");
      loginUser(data.token, user); sessionStorage.setItem("adminRole", user.role);
      const requestedPath = location.state?.from?.pathname;
      const mayReturnToAdminRegistration = requestedPath === "/register/admin" || requestedPath === "/admin/register";
      navigate(requestedPath?.startsWith("/admin") || mayReturnToAdminRegistration ? requestedPath : "/admin/dashboard", { replace: true });
    } catch (err) { setError(err.response?.data?.message || err.message || "Unable to sign in. Check your details and try again."); }
    finally { setLoading(false); }
  };
  return <main className="admin-auth-page"><section className="admin-auth-card" aria-labelledby="admin-login-title">
    <div className="admin-auth-brand"><span className="admin-auth-mark">RH</span><p>ROYAL HIGHERLIFE</p><span>SECURE ADMINISTRATION</span></div>
    <h1 id="admin-login-title">Admin sign in</h1><p className="admin-auth-intro">Sign in with your administrator account.</p>
    {location.state?.reason === "admin-required" && <p className="admin-auth-error" role="alert">Administrator access is required. Sign in with an administrator account to continue.</p>}
    {location.state?.reason === "super-admin-required" && <p className="admin-auth-error" role="alert">Administrator account creation is protected. Sign in with an active Super Admin account; after sign-in, you’ll return to the account creation form.</p>}
    <form onSubmit={submit} className="admin-auth-form">
      <label>Email address<div className="admin-auth-input"><Mail size={18}/><input type="email" autoComplete="username" required maxLength={254} value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="name@example.com" /></div></label>
      <label>Password<div className="admin-auth-input"><LockKeyhole size={18}/><input type={showPassword ? "text" : "password"} autoComplete="current-password" required maxLength={128} value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="Your password"/><button type="button" className="admin-auth-eye" aria-label={showPassword ? "Hide password" : "Show password"} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
      <div className="admin-auth-options"><span>Secure administrator session · expires after 8 hours</span><Link to="/admin/forgot-password">Forgot password?</Link></div>
      {error && <p className="admin-auth-error" role="alert">{error}</p>}
      <button className="admin-auth-submit" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
    </form><p className="admin-auth-foot">Need to create an administrator account? <Link to="/register/admin">Continue to Admin Management</Link>. Sign in as Super Admin first; you’ll return to the protected form automatically.</p><Link className="admin-auth-home" to="/">← Return to website</Link>
  </section></main>;
}
