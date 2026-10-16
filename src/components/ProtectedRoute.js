import React from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { getToken } from '../services/auth';

/** Must be logged in. Wraps the whole admin layout. */
const ProtectedRoute = ({ children }) => {
  const { ready } = useAuth();

  if (!getToken()) return <Navigate to="/login" replace />;
  if (!ready) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;
  return children;
};

/** Page-level check: shows "Access denied" if the user's role lacks the permission. */
export const RequirePermission = ({ perm, children }) => {
  const { can, canAny } = useAuth();
  const perms = Array.isArray(perm) ? perm : [perm];
  const allowed = perms.length === 1 ? can(perms[0]) : canAny(...perms);

  if (allowed) return children;
  return (
    <div style={{ maxWidth: 520, margin: '80px auto', textAlign: 'center', padding: 24 }}>
      <ShieldAlert size={56} color="#F58634" />
      <h2 style={{ margin: '16px 0 8px', color: '#0b2447' }}>Access denied</h2>
      <p style={{ color: '#4b5563', lineHeight: 1.6 }}>
        Your role does not include access to this page. If you think this is a mistake, please contact the Super Admin.
      </p>
    </div>
  );
};

export default ProtectedRoute;
