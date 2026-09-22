"use client";

import { useState } from "react";
import styles from "./AdminDashboard.module.css";

export default function DriveSyncButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const [syncStatus, setSyncStatus] = useState("idle");

  const handleSync = async () => {
    setSyncStatus("syncing");
    try {
      const res = await fetch("/api/cron/sync-drive");
      const data = await res.json();
      if (data.errors && data.errors.length > 0) {
        alert(data.message + "\nErrors:\n" + data.errors.join("\n"));
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Sync failed.");
    } finally {
      setSyncStatus("done");
    }
  };

  if (fullWidth) {
    return (
      <button className="primary-button" style={{ width: "100%", padding: "12px", background: "var(--color-primary)", color: "white" }} onClick={handleSync} disabled={syncStatus === 'syncing'}>
        {syncStatus === 'syncing' ? 'Syncing...' : '⬇ Sync Now'}
      </button>
    );
  }

  return (
    <button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleSync} disabled={syncStatus === 'syncing'}>
      ☁️ {syncStatus === 'syncing' ? 'Syncing...' : 'Google Drive Sync'}
    </button>
  );
}
