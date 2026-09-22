"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className={styles.main}>
      <div className={styles.loginContainer}>
        {/* Left Side - Brand & Info */}
        <div className={styles.brandSection}>
          <div className={styles.brandHeader}>
            <img src="/images/logo.png" alt="APTTECH Logo" style={{ width: "180px", objectFit: "contain" }} />
          </div>
          
          <div className={styles.portalInfo}>
            <h2 className="heading-1" style={{ color: "var(--color-white)" }}>Recorded Lectures Portal</h2>
            <p className={styles.tagline}>Learn • Revisit • Practice • Grow</p>
          </div>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
              <div>
                <h4>Learn Anytime</h4>
                <p>Study at your own pace</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              <div>
                <h4>Batch-wise Content</h4>
                <p>Only your batch lectures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.formSection}>
          <div className={`glass-card ${styles.loginCard}`}>
            <h2 className="heading-2">Welcome Back</h2>
            <p className={styles.loginSub}>Please login to your account to continue</p>
            
            <div className={styles.form}>
              <button 
                className={`primary-button ${styles.submitBtn}`} 
                onClick={() => {
                  setLoading(true);
                  signIn("google", { callbackUrl: "/redirect" });
                }}
                disabled={loading}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "10px",
                  background: "#fff",
                  color: "#333",
                  border: "1px solid #ccc",
                  marginTop: "2rem"
                }}
              >
                {loading ? "Redirecting..." : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>

              {error && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "1rem", textAlign: "center" }}>{error}</p>}
            </div>
            
            <div style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", textAlign: "center" }}>
              Only students enrolled by the administrator can access this portal.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
