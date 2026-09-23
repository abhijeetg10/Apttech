"use client";

import React, { useState, useEffect } from "react";
import styles from "./Students.module.css";

interface Batch {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber?: string | null;
  collegeName?: string | null;
  batchId: string | null;
  batch?: Batch;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", batchId: "" });

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const pdfInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, batchesRes] = await Promise.all([
        fetch("/api/admin/students"),
        fetch("/api/admin/batches")
      ]);
      
      if (studentsRes.ok && batchesRes.ok) {
        setStudents(await studentsRes.json());
        setBatches(await batchesRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "csv" | "pdf") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (type === "pdf") {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetch("/api/admin/students/bulk-pdf", {
          method: "POST",
          body: formData
        });
        
        const data = await res.json();
        if (res.ok) {
          alert(data.message + (data.errors?.length ? `\nErrors:\n${data.errors.join("\n")}` : ""));
          fetchData();
        } else {
          alert("Failed to upload: " + (data.error || data.details || "Unknown error"));
        }
      } else {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");
        if (lines.length < 2) throw new Error("CSV is empty or missing data rows");

        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const studentsToUpload = [];

        for (let i = 1; i < lines.length; i++) {
          let cols = [];
          let cur = '';
          let inQuotes = false;
          for (let char of lines[i]) {
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
              cols.push(cur.trim());
              cur = '';
            } else {
              cur += char;
            }
          }
          cols.push(cur.trim());

          const obj: any = {};
          headers.forEach((header, index) => {
            const val = cols[index] || "";
            if (header.includes("name") && !header.includes("college")) obj.name = val;
            else if (header.includes("email")) obj.email = val;
            else if (header.includes("batch")) obj.batch = val;
            else if (header.includes("roll")) obj.rollNumber = val;
            else if (header.includes("college")) obj.collegeName = val;
          });
          
          if (obj.name || obj.email) {
            studentsToUpload.push(obj);
          }
        }

        const res = await fetch("/api/admin/students/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ students: studentsToUpload })
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message + (data.errors?.length ? `\nErrors:\n${data.errors.join("\n")}` : ""));
          fetchData();
        } else {
          alert("Failed to upload: " + (data.error || data.details || "Unknown error"));
        }
      }
    } catch (err: any) {
      alert(`Error parsing ${type.toUpperCase()}: ` + err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  const openModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        batchId: student.batchId || "",
      });
    } else {
      setEditingStudent(null);
      setFormData({ name: "", email: "", batchId: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingStudent ? `/api/admin/students/${editingStudent.id}` : "/api/admin/students";
    const method = editingStudent ? "PUT" : "POST";

    const payload = { ...formData };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save student");
      }
    } catch (error) {
      console.error("Error saving student");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading students...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Students</h1>
          <p>Manage student accounts and batch enrollments</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: "none" }} 
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e, "csv")}
          />
          <input 
            type="file" 
            accept=".pdf" 
            style={{ display: "none" }} 
            ref={pdfInputRef}
            onChange={(e) => handleFileUpload(e, "pdf")}
          />
          <button 
            className={`secondary-button ${styles.addBtn}`} 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "📄 CSV"}
          </button>
          <button 
            className={`secondary-button ${styles.addBtn}`} 
            onClick={() => pdfInputRef.current?.click()}
            disabled={isUploading}
            style={{ marginLeft: "-4px" }}
          >
            {isUploading ? "Uploading..." : "📑 PDF"}
          </button>
          <button className={`primary-button ${styles.addBtn}`} onClick={() => openModal()}>
            ➕ New Student
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>College</th>
                <th>Email</th>
                <th>Batch</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td style={{ fontWeight: 600 }}>{student.name}</td>
                  <td>{student.rollNumber || "-"}</td>
                  <td>{student.collegeName || "-"}</td>
                  <td style={{ color: "var(--color-text-muted)" }}>{student.email}</td>
                  <td>
                    {student.batch ? (
                      <span className={styles.batchBadge}>{student.batch.name}</span>
                    ) : (
                      <span className={`${styles.batchBadge} ${styles.unassigned}`}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => openModal(student)} title="Edit">✏️</button>
                      <button className={styles.actionBtn} onClick={() => handleDelete(student.id)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>No students found.</td>
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
              <h2>{editingStudent ? "Edit Student" : "Add New Student"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g. john@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign to Batch</label>
                <select 
                  className="form-input" 
                  value={formData.batchId}
                  onChange={e => setFormData({...formData, batchId: e.target.value})}
                >
                  <option value="">Unassigned</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.id}>{batch.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button">{editingStudent ? "Save Changes" : "Create Student"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
