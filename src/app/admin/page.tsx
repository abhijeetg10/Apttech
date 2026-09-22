import styles from "./AdminDashboard.module.css";
import { prisma } from "@/lib/prisma";
import DriveSyncButton from "./DriveSyncButton";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalStudents, totalBatches, totalLectures, batches] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.batch.count(),
    prisma.lecture.count(),
    prisma.batch.findMany({
      include: { _count: { select: { students: true } } },
      orderBy: { startDate: 'desc' },
      take: 5
    })
  ]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Admin Dashboard</h1>
          <p>Manage your batches, students and lecture content</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#e8f5e9", color: "#2e7d32" }}>👥</div>
          <div className={styles.statInfo}>
            <h3>{totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#e3f2fd", color: "#1565c0" }}>📂</div>
          <div className={styles.statInfo}>
            <h3>{totalBatches}</h3>
            <p>Active Batches</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#fff3e0", color: "#ef6c00" }}>▶️</div>
          <div className={styles.statInfo}>
            <h3>{totalLectures}</h3>
            <p>Total Lectures</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "#ffebee", color: "#c62828" }}>☁️</div>
          <div className={styles.statInfo}>
            <h3>Auto</h3>
            <p>Drive Sync Status</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="heading-3">Quick Actions</h3>
        <div className={styles.quickActions}>
          <Link href="/admin/lectures" className={styles.actionBtn} style={{ textDecoration: 'none' }}>
            ➕ Add Lecture
          </Link>
          <Link href="/admin/batches" className={styles.actionBtn} style={{ textDecoration: 'none' }}>
            👥 Create Batch
          </Link>
          <Link href="/admin/students" className={styles.actionBtn} style={{ textDecoration: 'none' }}>
            👤 Assign Student
          </Link>
          <DriveSyncButton />
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Recent Batches</h3>
            <Link href="/admin/batches" className={styles.viewAll}>View All</Link>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Batch Name</th>
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
                  <td>{batch._count.students}</td>
                  <td>{batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'N/A'}</td>
                  <td><span className={`${styles.statusBadge} ${batch.status === 'Active' ? styles.active : styles.completed}`}>{batch.status}</span></td>
                  <td>...</td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>No batches found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Google Drive Integration</h3>
          </div>
          <div className={styles.integrationCard}>
            <div className={styles.driveIcon}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" width="48" />
            </div>
            <div>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
                Sync your lecture videos directly from Google Drive.
              </p>
              <div style={{ marginTop: "1rem", color: "#2e7d32", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <span style={{ display: "inline-block", width: "8px", height: "8px", background: "#2e7d32", borderRadius: "50%" }}></span>
                Connected
              </div>
            </div>
            <DriveSyncButton fullWidth={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
