'use client';

import { useEffect, useState } from 'react';
import { paymentsApi } from '@/lib/api/payments';
import { toast } from '@/components/ui/use-toast';

export function SubscriptionWidget() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await paymentsApi.status();
        setStatus(res.data.data);
      } catch (e: any) {
        // ignore
      }
    };
    load();
  }, []);

  const openPortal = async () => {
    setLoading(true);
    try {
      const res = await paymentsApi.portal();
      const url = res.data.data.portalUrl;
      if (url && typeof window !== 'undefined') window.location.href = url;
    } catch (e: any) {
      toast({ title: 'Portal error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Current Plan</div>
          <div className="text-lg font-semibold">{status?.plan || 'Free'}</div>
          <div className="text-xs mt-1">Status: {status?.status || 'inactive'}</div>
        </div>
        <button className="bg-black text-white px-3 py-2 rounded" onClick={openPortal} disabled={loading}>
          {loading ? 'Opening…' : 'Manage Billing'}
        </button>
      </div>
    </div>
  );
}
