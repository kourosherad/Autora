"use client";

export function ConfirmSubmit({ label, message, className = "btn btn-danger btn-sm" }: { label: string; message: string; className?: string }) {
  return <button type="submit" className={className} onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>{label}</button>;
}

