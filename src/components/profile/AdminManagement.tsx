"use client";

import { useState, useEffect } from "react";
import styles from "./AdminSettings.module.css";

interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/admins");
      if (res.ok) {
        setAdmins(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        setName("");
        setEmail("");
        fetchAdmins();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add admin");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, adminEmail: string) => {
    if (adminEmail === 'apttechtest.in@gmail.com') {
      alert("You cannot delete the master administrator.");
      return;
    }
    
    if (!confirm(`Are you sure you want to remove ${adminEmail} as an administrator?`)) return;

    try {
      const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAdmins();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete admin");
      }
    } catch (err) {
      alert("Error deleting admin");
    }
  };

  if (loading) return <div>Loading administrators...</div>;

  return (
    <div className={styles.adminManagement}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Add Administrator</h2>
          <p>Invite a new administrator by entering their details.</p>
        </div>
        
        {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}

        <form onSubmit={handleAddAdmin} className={styles.form} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div className={styles.formGroup} style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              required
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
            />
          </div>
          <button type="submit" className="primary-button" disabled={adding} style={{ height: "42px" }}>
            {adding ? "Adding..." : "➕ Add Admin"}
          </button>
        </form>
      </div>

      <div className={styles.card} style={{ marginTop: "2rem" }}>
        <div className={styles.cardHeader}>
          <h2>Current Administrators</h2>
        </div>
        
        <table className={styles.table} style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>Name</th>
              <th style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>Email</th>
              <th style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>Status</th>
              <th style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "16px", fontWeight: 500 }}>{admin.name}</td>
                <td style={{ padding: "16px", color: "var(--color-text-muted)" }}>{admin.email}</td>
                <td style={{ padding: "16px" }}>
                  <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>
                    Active
                  </span>
                </td>
                <td style={{ padding: "16px" }}>
                  {admin.email !== 'apttechtest.in@gmail.com' && (
                    <button 
                      onClick={() => handleDelete(admin.id, admin.email)}
                      style={{ background: "transparent", border: "none", color: "#c62828", cursor: "pointer", fontWeight: 600 }}
                    >
                      Remove
                    </button>
                  )}
                  {admin.email === 'apttechtest.in@gmail.com' && (
                    <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>Master</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
