import Link from "next/link";
import styles from "./StudentDashboard.module.css";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = 'force-dynamic';

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
      batch: { include: { lectures: { orderBy: { date: 'desc' } } } },
      lectureProgress: true
    }
  });

  const batch = user?.batch;
  const lectures = batch?.lectures || [];
  const progressRecords = user?.lectureProgress || [];
  
  const latestLectures = lectures.filter(l => l.status === "Recording Available").slice(0, 4);
  const scheduledLectures = lectures.filter(l => l.status === "Scheduled");
  const allAvailableLectures = lectures.filter(l => l.status === "Recording Available");
  
  const completedIds = new Set(progressRecords.filter(p => p.completed).map(p => p.lectureId));
  
  const completedAvailable = allAvailableLectures.filter(l => completedIds.has(l.id)).length;
  const totalAvailable = allAvailableLectures.length;
  const progressPercentage = totalAvailable === 0 ? 0 : Math.floor((completedAvailable / totalAvailable) * 100);
  
  const todaySchedule = scheduledLectures.length > 0 ? scheduledLectures[0] : null;
  const nextUpToWatch = allAvailableLectures.find(l => !completedIds.has(l.id));

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeText}>
          <h1>Welcome back, {user?.name.split(" ")[0]} 👋</h1>
          <p>{batch?.name || "No Batch Assigned"} | Keep going, great things take time!</p>
        </div>
        <div className={styles.quote}>
          "Consistency today creates success tomorrow."
        </div>
      </div>

      <div className={styles.gridTop}>
        <div>
          <div className={styles.sectionHeader}>
            <h3>Continue Watching</h3>
            {nextUpToWatch && <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Up next for you</span>}
          </div>
          
          {nextUpToWatch ? (
            <div className={styles.continueCard}>
              <div 
                className={styles.thumbnail}
                style={{ 
                  width: '320px',
                  minWidth: '320px',
                  height: '180px',
                  backgroundImage: 'url(/images/thumbnail.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRight: '1px solid var(--color-border)',
                  flexShrink: 0
                }}
              >
                <div className={styles.playBtn}>▶</div>
                <div className={styles.timePill}>{nextUpToWatch.duration ? `${nextUpToWatch.duration}m` : '1:12:35'}</div>
              </div>
              <div className={styles.continueInfo}>
                <h2 className="heading-3">{nextUpToWatch.title}</h2>
                
                <div className={styles.badges}>
                  <span className={styles.badge}>{nextUpToWatch.subject}</span>
                  <span className={styles.badge}>{batch?.name || "Batch"}</span>
                </div>
                
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
                  By <strong>{nextUpToWatch.faculty}</strong>
                </p>
                
                <div className={styles.progressContainer}>
                  <div className={styles.progressHeader}>
                    <span></span>
                    <span>0% complete</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: "0%" }}></div>
                  </div>
                </div>
                
                <Link href={`/student/lectures/${nextUpToWatch.id}`} style={{ textDecoration: 'none' }}>
                  <button className="primary-button" style={{ width: "fit-content", padding: "8px 16px", fontSize: "0.9rem", cursor: "pointer" }}>
                    Start Watching ➔
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ padding: "2rem", border: "1px dashed var(--color-border)", borderRadius: "8px", textAlign: "center", color: "var(--color-text-muted)", background: "var(--color-surface)" }}>
              You are all caught up! No unwatched recordings available.
            </div>
          )}
        </div>

        <div className={styles.sideCards}>
          <div className={styles.card}>
            <div className={styles.sectionHeader} style={{ marginBottom: "1.5rem" }}>
              <h3>My Progress</h3>
              <span style={{ color: "var(--color-text-muted)" }}>⋮</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ position: "relative", width: "90px", height: "90px" }}>
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                  <circle 
                    cx="45" cy="45" r="38" 
                    fill="none" 
                    stroke="var(--color-accent)" 
                    strokeWidth="8" 
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - progressPercentage / 100)}`}
                    strokeLinecap="round"
                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1s ease-in-out" }}
                  />
                </svg>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "1.2rem", color: "var(--color-text)" }}>
                  {progressPercentage}%
                </div>
              </div>
              <div style={{ flex: 1, fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--color-accent)", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-accent)" }}></span> Completed
                  </span>
                  <span style={{ fontWeight: "700" }}>{completedAvailable}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--color-text-muted)", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-border)" }}></span> Pending
                  </span>
                  <span style={{ fontWeight: "700" }}>{totalAvailable - completedAvailable}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.sectionHeader}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>📅 Today's Schedule</h3>
              <Link href="/student/lectures" className={styles.viewAll}>View All ➔</Link>
            </div>
            
            {todaySchedule ? (
              <div className={styles.scheduleItem}>
                <div className={styles.scheduleIcon}>📄</div>
                <div className={styles.scheduleInfo}>
                  <h4>{todaySchedule.title}</h4>
                  <p>Available now</p>
                </div>
                <div className={styles.playBtn} style={{ position: "relative", width: "36px", height: "36px", marginLeft: "auto", fontSize: "16px", background: "var(--color-secondary)" }}>
                  ▶
                </div>
              </div>
            ) : (
              <div style={{ padding: "1rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                No lectures scheduled for today.
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className={styles.sectionHeader} style={{ marginTop: "1rem" }}>
          <h3>Latest Recorded Lectures</h3>
          <Link href="/student/lectures" className={styles.viewAll}>View All ➔</Link>
        </div>
        
        <div className={styles.latestGrid}>
          {latestLectures.length > 0 ? latestLectures.map((lecture, i) => {
            const colors = ["#003366", "#1A237E", "#0D47A1", "#01579B"];
            return (
              <Link href={`/student/lectures/${lecture.id}`} key={lecture.id}>
                <div className={styles.lectureCard}>
                  <div 
                    className={styles.lectureThumb} 
                    style={{ 
                      backgroundImage: 'url(/images/thumbnail.jpeg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div className={styles.timePill}>{lecture.duration ? `${lecture.duration}m` : '1:20:10'}</div>
                  </div>
                  <div className={styles.lectureInfo}>
                    <h4>{lecture.title}</h4>
                    <div className={styles.meta}>
                      <span>{lecture.faculty}</span>
                      <span>{new Date(lecture.date).toLocaleDateString()}</span>
                    </div>
                    <span className={styles.badge} style={{ display: "inline-block", marginTop: "12px" }}>{lecture.subject}</span>
                  </div>
                </div>
              </Link>
            )
          }) : (
            <div style={{ gridColumn: "1 / -1", padding: "2rem", textAlign: "center", color: "var(--color-text-muted)", border: "1px dashed var(--color-border)", borderRadius: "8px" }}>
              No recordings available yet. They will appear here once your admin syncs them!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
