"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
  role: "STUDENT" | "ADMIN";
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function Layout({ children, role, user }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.appContainer}>
      <Sidebar role={role} isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}

      <div className={styles.mainContent}>
        <Navbar user={user} toggleSidebar={toggleSidebar} />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
