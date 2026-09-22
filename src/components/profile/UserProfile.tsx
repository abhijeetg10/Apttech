"use client";

import { useState } from "react";
import styles from "./UserProfile.module.css";
import { useSession } from "next-auth/react";

interface UserProfileProps {
  initialName: string;
  email: string;
  batchName?: string;
  role: string;
  rollNumber?: string | null;
  collegeName?: string | null;
}

export default function UserProfile({ initialName, email, batchName, role, rollNumber, collegeName }: UserProfileProps) {
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

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
      {status && (
        <div className={`${styles.message} ${styles[status.type]}`}>
          {status.message}
        </div>
      )}

      <div className={styles.idCard}>
        <div className={styles.idHeader}>
          <div className={styles.avatar}>
            {getInitials(name || initialName)}
          </div>
          <div className={styles.idRole}>
            {role === "ADMIN" ? "Administrator" : "Student"}
          </div>
        </div>
        
        <div className={styles.idBody}>
          <h2 className={styles.idName}>{name || initialName}</h2>
          <p className={styles.idEmail}>{email}</p>
          
          <div className={styles.idDetails}>
            {role === "STUDENT" && (
              <>
                <div className={styles.detailGroup}>
                  <span className={styles.detailLabel}>Batch</span>
                  <span className={styles.detailValue}>{batchName || "Unassigned"}</span>
                </div>
                <div className={styles.detailGroup}>
                  <span className={styles.detailLabel}>Roll No.</span>
                  <span className={styles.detailValue}>{rollNumber || "-"}</span>
                </div>
                <div className={styles.detailGroup} style={{ gridColumn: "1 / -1" }}>
                  <span className={styles.detailLabel}>College / Institution</span>
                  <span className={styles.detailValue}>{collegeName || "-"}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.editSection}>
        <h3 className={styles.sectionTitle}>Update Information</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <p className={styles.helpText}>
            Note: Email, Batch, Roll No, and College can only be updated by the Administrator. 
            Passwords are managed via your Google Account.
          </p>

          <button 
            type="submit" 
            className={`primary-button ${styles.submitBtn}`}
            disabled={loading || name === initialName}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
