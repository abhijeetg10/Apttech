"use client";

import { useState, useEffect } from "react";
import styles from "./Batches.module.css";

interface Batch {
  id: string;
  name: string;
  faculty?: string | null;
  driveFolderId: string | null;
  status: string;
  startDate: string | null;
  _count?: { students: number; lectures: number };
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({ name: "", faculty: "", driveFolderId: "", status: "Active", startDate: "" });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/admin/batches");
      if (res.ok) {
        const data = await res.json();
        setBatches(data);
      }
    } catch (error) {
      console.error("Failed to fetch batches");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        name: batch.name,
        faculty: batch.faculty || "",
        driveFolderId: batch.driveFolderId || "",
        status: batch.status,
        startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : "",
      });
    } else {
      setEditingBatch(null);
      setFormData({ name: "", faculty: "", driveFolderId: "", status: "Active", startDate: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingBatch ? `/api/admin/batches/${editingBatch.id}` : "/api/admin/batches";
    const method = editingBatch ? "PUT" : "POST";

    let folderId = formData.driveFolderId;
    // Extract ID from full URL if provided
    if (folderId.includes("drive.google.com")) {
      const match = folderId.match(/folders\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        folderId = match[1];
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, driveFolderId: folderId }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBatches();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save batch");
      }
    } catch (error) {
      console.error("Error saving batch");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;
    
    try {
      const res = await fetch(`/api/admin/batches/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBatches();
      } else {
        alert("Failed to delete batch");
      }
    } catch (error) {
      console.error("Error deleting batch");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading batches...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Batches</h1>
          <p>Manage learning batches and their Drive folders</p>
        </div>
        <button className={`primary-button ${styles.addBtn}`} onClick={() => openModal()}>
          ➕ New Batch
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Drive Folder ID</th>
                <th>Students</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(batch => (
                <tr key={batch.id}>
                  <td style={{ fontWeight: 600 }}>{batch.name}</td>
                  <td style={{ fontFamily: "monospace", color: "var(--color-text-muted)" }}>
                    {batch.driveFolderId || "Not linked"}
                  </td>
                  <td>{batch._count?.students || 0}</td>
                  <td>{batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${batch.status === 'Active' ? styles.active : styles.completed}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => openModal(batch)} title="Edit">✏️</button>
                      <button className={styles.actionBtn} onClick={() => handleDelete(batch.id)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>No batches found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingBatch ? "Edit Batch" : "Create New Batch"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Batch Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. JDBC-06"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Faculty Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.faculty}
                  onChange={e => setFormData({...formData, faculty: e.target.value})}
                  placeholder="e.g. Sagar Sir"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Google Drive Folder Link (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.driveFolderId}
                  onChange={e => setFormData({...formData, driveFolderId: e.target.value})}
                  placeholder="e.g. https://drive.google.com/drive/folders/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Start Date (Optional)</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-input" 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button">{editingBatch ? "Save Changes" : "Create Batch"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
