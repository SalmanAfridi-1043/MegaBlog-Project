import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Container } from "../components";

function uidColor(uid = "") {
  const hues = [262, 221, 142, 38, 328, 190, 0];
  let hash = 0;
  for (let i = 0; i < uid.length; i++) hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  return hues[Math.abs(hash) % hues.length];
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-800/50 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-slate-400">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</span>
        <span className="text-sm text-slate-200 font-medium mt-0.5 truncate">{value || "—"}</span>
      </div>
    </div>
  );
}

export default function Profile() {
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  if (!userData) {
    navigate("/login");
    return null;
  }

  const hue = uidColor(userData.$id);
  const initials = getInitials(userData.name || userData.email || "U");

  const joinedDate = userData.$createdAt
    ? new Date(userData.$createdAt).toLocaleDateString("en-GB", {
        day: "2-digit", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="w-full py-10">
      <Container>
        <div className="max-w-lg mx-auto">

          {/* Card */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-3xl overflow-hidden">

            {/* Banner */}
            <div
              className="h-24 w-full"
              style={{
                background: `linear-gradient(135deg, hsl(${hue},55%,25%) 0%, hsl(${(hue + 40) % 360},55%,20%) 100%)`,
              }}
            />

            {/* Avatar + name */}
            <div className="px-8 pb-6">
              <div className="flex items-end justify-between -mt-10 mb-5">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white ring-4 ring-slate-800 shadow-xl"
                  style={{ backgroundColor: `hsl(${hue}, 60%, 42%)` }}
                >
                  {initials}
                </div>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/40 transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Edit Profile
                </Link>
              </div>

              <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">
                {userData.name || "No name set"}
              </h1>
              <p className="text-slate-400 text-sm mt-1">{userData.email}</p>
            </div>

            {/* Divider */}
            <div className="mx-8 border-t border-slate-700/40" />

            {/* Info rows */}
            <div className="px-8 py-2">
              <InfoRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                label="Full Name"
                value={userData.name}
              />
              <InfoRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                label="Email"
                value={userData.email}
              />
              {joinedDate && (
                <InfoRow
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  label="Member Since"
                  value={joinedDate}
                />
              )}
              <InfoRow
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                label="Account Status"
                value="Active"
              />
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
