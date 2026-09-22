"use client";

import { useState } from "react";

interface Props {
  lectureId: string;
  initialCompleted: boolean;
}

export default function MarkCompleteButton({ lectureId, initialCompleted }: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  const toggleProgress = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/student/progress/${lectureId}`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setCompleted(data.completed);
      }
    } catch (error) {
      console.error("Failed to update progress");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleProgress} 
      disabled={loading}
      className="primary-button" 
      style={completed ? { background: '#2e7d32', borderColor: '#2e7d32' } : {}}
    >
      {loading ? "..." : completed ? "✅ Completed" : "✓ Mark as Complete"}
    </button>
  );
}
