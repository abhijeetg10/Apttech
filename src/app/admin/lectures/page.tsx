"use client";

import { useState, useEffect } from "react";
import styles from "./Lectures.module.css";

interface Batch {
  id: string;
  name: string;
}

interface Lecture {
  id: string;
  title: string;
  subject: string;
  faculty: string;
  date: string;
  duration: number | null;
  meetLink: string | null;
  driveVideoId: string | null;
  status: string;
  batchId: string;
  batch: Batch;
}

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  
  const [formData, setFormData] = useState({ 
    title: "", 
    subject: "", 
    faculty: "", 
    date: "", 
    duration: "", 
    status: "Scheduled", 
    driveVideoId: "", 
    meetLink: "", 
    batchId: "" 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lecturesRes, batchesRes] = await Promise.all([
        fetch("/api/admin/lectures"),
        fetch("/api/admin/batches")
      ]);
      
      if (lecturesRes.ok && batchesRes.ok) {
        setLectures(await lecturesRes.json());
        setBatches(await batchesRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (lecture?: Lecture) => {
    if (lecture) {
      setEditingLecture(lecture);
      setFormData({
        title: lecture.title,
        subject: lecture.subject,
        faculty: lecture.faculty,
        date: new Date(lecture.date).toISOString().split('T')[0],
        duration: lecture.duration ? lecture.duration.toString() : "",
        status: lecture.status,
        driveVideoId: lecture.driveVideoId || "",
        meetLink: lecture.meetLink || "",
        batchId: lecture.batchId,
      });
    } else {
      setEditingLecture(null);
      setFormData({ 
        title: "", subject: "", faculty: "", date: "", duration: "", 
        status: "Scheduled", driveVideoId: "", meetLink: "", batchId: batches.length > 0 ? batches[0].id : "" 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingLecture ? `/api/admin/lectures/${editingLecture.id}` : "/api/admin/lectures";
    const method = editingLecture ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save lecture");
      }
    } catch (error) {
      console.error("Error saving lecture");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return;
    
    try {
      const res = await fetch(`/api/admin/lectures/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete lecture");
      }
    } catch (error) {
      console.error("Error deleting lecture");
    }
  };

  const getStatusClass = (status: string) => {
    if (status === "Scheduled") return styles.scheduled;
    if (status === "Recording Available") return styles.available;
    return styles.review;
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading lectures...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Lectures</h1>
          <p>Manually manage lecture details and schedules</p>
        </div>
        <button className={`primary-button ${styles.addBtn}`} onClick={() => openModal()}>
          ➕ New Lecture
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title & Subject</th>
                <th>Batch</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map(lecture => (
                <tr key={lecture.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lecture.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{lecture.subject} • {lecture.faculty}</div>
                  </td>
                  <td>{lecture.batch?.name}</td>
                  <td>
                    <div style={{ whiteSpace: "nowrap" }}>{new Date(lecture.date).toLocaleDateString()}</div>
                    {lecture.duration && <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{lecture.duration} mins</div>}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(lecture.status)}`}>
                      {lecture.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => openModal(lecture)} title="Edit">✏️</button>
                      <button className={styles.actionBtn} onClick={() => handleDelete(lecture.id)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {lectures.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>No lectures found.</td>
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
              <h2>{editingLecture ? "Edit Lecture" : "Add New Lecture"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={`form-group ${styles.fullWidth}`}>
                  <label className="form-label">Lecture Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Intro to Java"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Faculty</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={formData.faculty}
                    onChange={e => setFormData({...formData, faculty: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (mins)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g. 90"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Assign to Batch</label>
                  <select 
                    className="form-input" 
                    required
                    value={formData.batchId}
                    onChange={e => setFormData({...formData, batchId: e.target.value})}
                  >
                    <option value="" disabled>Select Batch</option>
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.id}>{batch.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input" 
                    required
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Recording Available">Recording Available</option>
                    <option value="Needs Review">Needs Review</option>
                  </select>
                </div>

                <div className={`form-group ${styles.fullWidth}`}>
                  <label className="form-label">Google Drive Video ID (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.driveVideoId}
                    onChange={e => setFormData({...formData, driveVideoId: e.target.value})}
                    placeholder="e.g. 1A2b3C..."
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Providing this will enable the embedded video player for students.
                  </p>
                </div>
                
                <div className={`form-group ${styles.fullWidth}`}>
                  <label className="form-label">Live Meet Link (Optional)</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    value={formData.meetLink}
                    onChange={e => setFormData({...formData, meetLink: e.target.value})}
                    placeholder="e.g. https://meet.google.com/..."
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button">{editingLecture ? "Save Changes" : "Create Lecture"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
