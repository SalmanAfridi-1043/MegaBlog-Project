import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import { login, logout } from "../store/authSlice";
import { Container } from "../components";
import appwriteService from "../appwrite/config";

function StatusMsg({ msg }) {
  if (!msg) return null;
  const isError = msg.type === "error";
  return (
    <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border mt-3
      ${isError
        ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>
      <span>{isError ? "⚠" : "✓"}</span>
      <span>{msg.text}</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/40 flex items-center gap-2.5">
        <div className="text-violet-400">{icon}</div>
        <h2 className="text-sm font-semibold text-slate-300 tracking-wide">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-slate-400 font-medium pl-1">
        {label}
        {hint && <span className="text-slate-600 font-normal ml-1.5">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "px-4 py-2.5 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all duration-200 placeholder:text-slate-600 text-sm w-full";

export default function Settings() {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [nameMsg, setNameMsg] = useState(null);
  const [savingName, setSavingName] = useState(false);

  const [email, setEmail] = useState(userData?.email || "");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMsg, setEmailMsg] = useState(null);
  const [savingEmail, setSavingEmail] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState(null);
  const [savingPass, setSavingPass] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [deleting, setDeleting] = useState(false);

  if (!userData) { navigate("/login"); return null; }

  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setNameMsg({ type: "error", text: "Name cannot be empty." });
    setSavingName(true); setNameMsg(null);
    try {
      const updated = await authService.updateName(name.trim());
      dispatch(login({ ...userData, name: updated.name }));
      setNameMsg({ type: "success", text: "Name updated." });
    } catch (err) {
      setNameMsg({ type: "error", text: err.message || "Failed to update name." });
    } finally { setSavingName(false); }
  };

  const handleEmailSave = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setEmailMsg({ type: "error", text: "Email cannot be empty." });
    if (!emailPassword) return setEmailMsg({ type: "error", text: "Current password required." });
    setSavingEmail(true); setEmailMsg(null);
    try {
      const updated = await authService.updateEmail(email.trim(), emailPassword);
      dispatch(login({ ...userData, email: updated.email }));
      setEmailMsg({ type: "success", text: "Email updated." });
      setEmailPassword("");
    } catch (err) {
      setEmailMsg({ type: "error", text: err.message || "Failed to update email." });
    } finally { setSavingEmail(false); }
  };

  const handlePassSave = async (e) => {    e.preventDefault();
    if (!oldPass) return setPassMsg({ type: "error", text: "Current password required." });
    if (newPass.length < 8) return setPassMsg({ type: "error", text: "Min. 8 characters required." });
    if (newPass !== confirmPass) return setPassMsg({ type: "error", text: "Passwords do not match." });
    setSavingPass(true); setPassMsg(null);
    try {
      await authService.updatePassword(newPass, oldPass);
      setPassMsg({ type: "success", text: "Password updated." });
      setOldPass(""); setNewPass(""); setConfirmPass("");
    } catch (err) {
      setPassMsg({ type: "error", text: err.message || "Failed to update password." });
    } finally { setSavingPass(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      return setDeleteMsg({ type: "error", text: 'Type DELETE (all caps) to confirm.' });
    }
    setDeleting(true);
    setDeleteMsg(null);
    try {
      // 1. Delete all posts and their images belonging to this user
      await appwriteService.deleteUserPosts(userData.$id);
      // 2. Sign out all sessions
      await authService.deleteAllSessions();
      // 3. Clear Redux state and redirect
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      setDeleteMsg({ type: "error", text: err.message || "Failed. Please try again." });
      setDeleting(false);
    }
  };

  return (
    <div className="w-full py-10">
      <Container>
        <div className="max-w-xl mx-auto">

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Settings</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your account details</p>
          </div>

          <div className="flex flex-col gap-5">

            {/* Name */}
            <SectionCard
              title="Display Name"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            >
              <form onSubmit={handleNameSave} className="flex flex-col gap-3">
                <Field label="Full name">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name" className={inputCls} />
                </Field>
                <StatusMsg msg={nameMsg} />
                <button type="submit" disabled={savingName}
                  className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {savingName && <Spinner />}{savingName ? "Saving…" : "Save Name"}
                </button>
              </form>
            </SectionCard>

            {/* Email */}
            <SectionCard
              title="Email Address"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            >
              <form onSubmit={handleEmailSave} className="flex flex-col gap-3">
                <Field label="New email">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" className={inputCls} />
                </Field>
                <Field label="Current password" hint="(required to change email)">
                  <input type="password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder="••••••••" className={inputCls} />
                </Field>
                <StatusMsg msg={emailMsg} />
                <button type="submit" disabled={savingEmail}
                  className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {savingEmail && <Spinner />}{savingEmail ? "Saving…" : "Save Email"}
                </button>
              </form>
            </SectionCard>

            {/* Password */}
            <SectionCard
              title="Change Password"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            >
              <form onSubmit={handlePassSave} className="flex flex-col gap-3">
                <Field label="Current password">
                  <input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)}
                    placeholder="••••••••" className={inputCls} />
                </Field>
                <Field label="New password">
                  <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min. 8 characters" className={inputCls} />
                </Field>
                <Field label="Confirm new password">
                  <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••" className={inputCls} />
                </Field>
                <StatusMsg msg={passMsg} />
                <button type="submit" disabled={savingPass}
                  className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {savingPass && <Spinner />}{savingPass ? "Saving…" : "Update Password"}
                </button>
              </form>
            </SectionCard>

            {/* Danger Zone */}
            <div className="bg-rose-500/5 border border-rose-500/25 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-rose-500/20 flex items-center gap-2.5">
                <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <h2 className="text-sm font-semibold text-rose-400 tracking-wide">Danger Zone</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <p className="text-sm text-slate-400 leading-relaxed">
                  Deleting your account will sign you out of all devices. This action
                  <span className="text-rose-400 font-semibold"> cannot be undone</span>.
                  Type <span className="font-mono font-bold text-slate-200">DELETE</span> below to confirm.
                </p>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="px-4 py-2.5 rounded-xl bg-slate-950 text-slate-100 border border-rose-500/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all duration-200 placeholder:text-slate-600 text-sm w-full"
                />
                <StatusMsg msg={deleteMsg} />
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirm !== "DELETE"}
                  className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deleting
                    ? <><Spinner /> Deleting…</>
                    : <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Account
                      </>
                  }
                </button>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
