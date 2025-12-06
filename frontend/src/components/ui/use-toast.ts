type ToastInput = { title?: string; description?: string } | string;

export function toast(input: ToastInput) {
  if (typeof window === 'undefined') return;
  if (typeof input === 'string') {
    // fallback simple toast
    console.log(`[toast] ${input}`);
    try { alert(input); } catch {}
    return;
  }
  const message = [input.title, input.description].filter(Boolean).join(' - ');
  console.log(`[toast] ${message}`);
  try { alert(message || ''); } catch {}
}
