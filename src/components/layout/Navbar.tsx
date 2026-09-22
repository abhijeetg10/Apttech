"use client";

import styles from "./Navbar.module.css";

interface NavbarProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className={styles.navbar}>
      <div className={styles.searchBox}>
        <span>🔍</span>
        <input type="text" placeholder="Search lectures, subjects or topics..." />
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
