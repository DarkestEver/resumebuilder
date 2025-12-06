'use client';
import axios from 'axios';
import { authStore } from '@/stores/authStore';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function GenerateBulletsButton({ context, onGenerated }:{ context:string; onGenerated:(bullets:string[])=>void }) {
  const run = async () => {
    try {
      const token = authStore.getState().accessToken;
      const res = await axios.post(`${API_BASE_URL}/ai/generate-bullets`, { context }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      onGenerated(res.data.data.bullets || []);
      toast({ title: 'Bullets generated' });
    } catch (e:any) {
      toast({ title: 'AI failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <button className="text-xs px-2 py-1 border rounded" onClick={run}>Generate Bullets</button>
  );
}
