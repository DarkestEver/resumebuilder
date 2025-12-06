'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { authStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function ATSScoreWidget({ resumeId }:{ resumeId:string }) {
  const [score, setScore] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = authStore.getState().accessToken;
        const res = await axios.post(`${API_BASE_URL}/ai/score-ats`, { resumeId }, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setScore(res.data.data);
      } catch {}
    };
    load();
  }, [resumeId]);

  if (!score) return null;
  return (
    <div className="border rounded p-4">
      <div className="text-sm">ATS Score</div>
      <div className="text-2xl font-bold">{score.score || 0}%</div>
      <div className="mt-2 text-xs">Keywords matched: {score.keywordsMatched?.length || 0}</div>
    </div>
  );
}
