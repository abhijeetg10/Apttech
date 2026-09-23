"use client";

import styles from "./Navbar.module.css";

interface NavbarProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  toggleSidebar?: () => void;
}

export default function Navbar({ user, toggleSidebar }: NavbarProps) {
  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        {toggleSidebar && (
          <button className={styles.hamburgerButton} onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input type="text" placeholder="Search lectures, subjects or topics..." />
        </div>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.notification}>
          🔔
        </div>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </div>
          <span className={styles.userName}>{user.name} ⌄</span>
        </div>
      </div>
    </header>
  );
}
