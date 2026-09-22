import Link from "next/link";
import styles from "./VideoPlayer.module.css";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MarkCompleteButton from "./MarkCompleteButton";

export default async function VideoPlayer({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return null;
  
  const { id } = await params;

  const lecture = await prisma.lecture.findUnique({
    where: { id },
    include: { 
      batch: { include: { lectures: true } },
      lectureProgress: { where: { userId: user.id } }
    }
  });

  if (!lecture) {
    return <div style={{ padding: "2rem" }}>Lecture not found.</div>;
  }

  const batchLectures = lecture.batch.lectures.filter(l => l.id !== lecture.id).slice(0, 3);

  return (
    <div className={styles.playerContainer}>
      <div className={styles.mainCol}>
        <Link href="/student/lectures" className={styles.backLink}>
          <span>←</span> Back to Library
        </Link>
        
        {lecture.driveVideoId ? (
          <div className={styles.iframeContainer}>
            <iframe 
              src={`https://drive.google.com/file/d/${lecture.driveVideoId}/preview`} 
              className={styles.iframeElement}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
            ></iframe>
          </div>
        ) : (
          <div className={styles.videoWrapper}>
            <div className={styles.videoTitle}>
              <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>☕</span>
              <h2>{lecture.subject}</h2>
              <p>{lecture.title}</p>
            </div>
            
            <div className={styles.videoControls}>
              <div className={styles.playPause}>⏸</div>
              <span style={{ fontSize: "0.85rem" }}>0:00 / {lecture.duration || "1:20:10"}</span>
              <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
              </div>
              <span style={{ fontSize: "1.2rem" }}>⚙️</span>
              <span style={{ fontSize: "1.2rem" }}>⛶</span>
            </div>
          </div>
        )}

        <div className={styles.videoDetails}>
          <h1>{lecture.title}</h1>
          
          <div className={styles.badges}>
            <span className={styles.badge}>{lecture.subject}</span>
            <span className={styles.badge}>{lecture.batch.name}</span>
          </div>
          
          <div className={styles.meta}>
            By <strong>{lecture.faculty}</strong> | {new Date(lecture.date).toLocaleDateString()} | ⏱ {lecture.duration ? `${lecture.duration}m` : '1h 05m'}
          </div>
          
          <div className={styles.description}>
            This is a recorded lecture for {lecture.title} from the {lecture.batch.name} batch. 
            Download the resources below to practice.
          </div>
          
          <div className={styles.actions}>
            <button className="secondary-button" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              ⬇ Download Notes
            </button>
            <MarkCompleteButton 
              lectureId={lecture.id} 
              initialCompleted={lecture.lectureProgress?.[0]?.completed || false} 
            />
          </div>
        </div>
      </div>

      <div className={styles.sideCol}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Up Next</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
              Autoplay <span style={{ width: "32px", height: "18px", background: "var(--color-secondary)", borderRadius: "10px", display: "inline-block", position: "relative" }}>
                <span style={{ position: "absolute", right: "2px", top: "2px", width: "14px", height: "14px", background: "white", borderRadius: "50%" }}></span>
              </span>
            </div>
          </div>
          
          {batchLectures.map((l, i) => {
             const colors = ["#003366", "#1A237E", "#0D47A1"];
             return (
               <Link href={`/student/lectures/${l.id}`} key={l.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className={styles.playlistItem}>
                    <div 
                      className={styles.playlistThumb} 
                      style={{ 
                        backgroundImage: 'url(/images/thumbnail.jpeg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <span className={styles.playlistTime}>{l.duration ? `${l.duration}m` : '45:00'}</span>
                    </div>
                    <div className={styles.playlistInfo}>
                      <h4>{l.title.length > 25 ? l.title.substring(0, 25) + '...' : l.title}</h4>
                      <p>in {l.subject}</p>
                    </div>
                  </div>
               </Link>
             )
          })}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Resources</h3>
          </div>
          
          <div className={styles.resourceItem}>
            <span className={styles.resourceIcon}>📄</span>
            <div className={styles.resourceName}>
              Lecture Notes <span>(PDF)</span>
            </div>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceIcon}>💾</span>
            <div className={styles.resourceName}>
              Code Examples <span>(ZIP)</span>
            </div>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceIcon}>📝</span>
            <div className={styles.resourceName}>
              Important Questions <span>(PDF)</span>
            </div>
          </div>
          <div className={styles.resourceItem}>
            <span className={styles.resourceIcon}>📊</span>
            <div className={styles.resourceName}>
              Presentation Slides <span>(PPT)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
