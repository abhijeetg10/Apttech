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
  return (
    <div className={styles.appContainer}>
      <Sidebar role={role} />
      
      <div className={styles.mainContent}>
        <Navbar user={user} />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
