'use client';
import { useState } from 'react';
import axios from 'axios';
import { authStore } from '@/stores/authStore';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function TailorToJobModal({ resumeId, onClose, onApplied }:{ resumeId:string; onClose:()=>void; onApplied:(data:any)=>void }) {
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!jd.trim()) { toast({ title: 'Paste a job description' }); return; }
    setLoading(true);
    try {
      const token = authStore.getState().accessToken;
      const res = await axios.post(`${API_BASE_URL}/ai/tailor-job`, { resumeId, jobDescription: jd }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      onApplied(res.data.data);
      toast({ title: 'Resume tailored to job' });
      onClose();
    } catch (e:any) {
      toast({ title: 'AI tailoring failed', description: e.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tailor Resume to Job</h2>
          <button onClick={onClose} className="text-sm">Close</button>
        </div>
        <textarea
          className="w-full border rounded p-2 mt-4 h-44"
          placeholder="Paste job description here"
          value={jd}
          onChange={(e)=>setJd(e.target.value)}
        />
        <button onClick={submit} className="mt-4 bg-black text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Tailoring…' : 'Tailor Now'}
        </button>
      </div>
    </div>
  );
}
