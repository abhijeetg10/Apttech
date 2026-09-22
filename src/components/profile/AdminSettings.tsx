"use client";

import { useState } from "react";
import styles from "./AdminSettings.module.css";
import { useSession } from "next-auth/react";

interface AdminSettingsProps {
  initialName: string;
  email: string;
}

export default function AdminSettings({ initialName, email }: AdminSettingsProps) {
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: data.message });
        if (name !== initialName) {
           await update({ name });
        }
      } else {
        setStatus({ type: 'error', message: data.error || "Failed to update profile" });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Platform Settings</h1>
        <p>Manage your administrator profile and system preferences.</p>
      </div>

      <div className={styles.layout}>
        {/* Sidebar Navigation */}
        <div className={styles.sidebar}>
          <div className={`${styles.navItem} ${styles.active}`}>
            General Profile
          </div>
          <div className={styles.navItem}>
            Security & Authentication
          </div>
          <div className={styles.navItem}>
            Notifications
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Profile Information</h2>
              <p>Update your admin display name.</p>
            </div>

            {status && (
              <div className={`${styles.message} ${styles[status.type]}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className="form-label">Administrator Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className="form-label">Primary Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email}
                  disabled
                />
                <p className={styles.helpText}>
                  Your email is locked. It is tied directly to your Google OAuth authentication.
                </p>
              </div>

              <div className={styles.actions}>
                <button 
                  type="submit" 
                  className={`primary-button ${styles.submitBtn}`}
                  disabled={loading || name === initialName}
                >
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Authentication & Security</h2>
            </div>
            <div className={styles.securityBox}>
              <div className={styles.securityIcon}>🔒</div>
              <div>
                <h4 style={{ marginBottom: "4px" }}>Google OAuth Enabled</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                  Password management is completely handled by Google. Your account is secured via OAuth 2.0.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
