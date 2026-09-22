"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/app/student/lectures/LecturesLibrary.module.css";
import { Lecture } from "@prisma/client";

interface LectureListProps {
  lectures: Lecture[];
}

export default function LectureList({ lectures }: LectureListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [facultyFilter, setFacultyFilter] = useState("All Faculty");
  const [sortOrder, setSortOrder] = useState("Latest First");

  // Get unique lists for filters
  const subjects = Array.from(new Set(lectures.map(l => l.subject)));
  const faculties = Array.from(new Set(lectures.map(l => l.faculty)));

  // Filter and Sort logic
  const filteredLectures = lectures
    .filter(l => {
      const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            l.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === "All Subjects" || l.subject === subjectFilter;
      const matchesFaculty = facultyFilter === "All Faculty" || l.faculty === facultyFilter;
      return matchesSearch && matchesSubject && matchesFaculty;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "Latest First" ? dateB - dateA : dateA - dateB;
    });

  const colors = ["#003366", "#1A237E", "#0D47A1", "#01579B"];

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="Search lectures..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className={styles.select} 
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        >
          <option>All Subjects</option>
          {subjects.map(subject => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
        <select 
          className={styles.select}
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
        >
          <option>All Faculty</option>
          {faculties.map(faculty => (
            <option key={faculty}>{faculty}</option>
          ))}
        </select>
        <select 
          className={styles.select}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option>Latest First</option>
          <option>Oldest First</option>
        </select>
      </div>

      <div className={styles.tags}>
        <div 
          className={`${styles.tag} ${subjectFilter === "All Subjects" ? styles.active : ""}`}
          onClick={() => setSubjectFilter("All Subjects")}
        >
          All
        </div>
        {subjects.map(subject => (
          <div 
            key={subject} 
            className={`${styles.tag} ${subjectFilter === subject ? styles.active : ""}`}
            onClick={() => setSubjectFilter(subject)}
          >
            {subject}
          </div>
        ))}
      </div>

      {filteredLectures.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--color-text-muted)" }}>
          <h3>No lectures found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredLectures.map((lecture, i) => (
            <Link href={`/student/lectures/${lecture.id}`} key={lecture.id}>
              <div className={styles.lectureCard}>
                <div 
                  className={styles.lectureThumb} 
                  style={{ 
                    backgroundImage: 'url(/images/thumbnail.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid var(--border-color)'
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
                  <span className={styles.badge}>{lecture.subject}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
