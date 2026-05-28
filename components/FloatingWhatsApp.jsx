"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function FloatingWhatsApp() {
  const [offset, setOffset] = useState(0);
  const [ageVerified, setAgeVerified] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const nextOffset = Math.sin(window.scrollY / 140) * 14;
      setOffset(nextOffset);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onAge = () => {
      try { setAgeVerified(!!sessionStorage.getItem('age_verified')); } catch (e) { setAgeVerified(false); }
    };
    onAge();
    window.addEventListener('age:updated', onAge);
    return () => window.removeEventListener('age:updated', onAge);
  }, []);

  if (!ageVerified || pathname === '/login') return null;

  return (
    <a
      href="https://wa.me/541157084665"
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp"
      style={{ '--wa-offset': `${offset}px` }}
      aria-label="WhatsApp"
      title="WhatsApp"
    >
      <svg viewBox="0 0 24 24" role="presentation" focusable="false" aria-hidden="true">
        <path fill="currentColor" d="M19.4 4.6A9.8 9.8 0 0 0 12 2.1C6.5 2.1 2 6.5 2 12c0 1.8.5 3.5 1.4 4.9L2 22l5.3-1.4A9.9 9.9 0 0 0 12 22c5.5 0 10-4.5 10-10 0-2.6-1-5.1-2.6-7.4Z"/>
        <path fill="#fff" d="M16.7 13.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.7 1-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.3-.9-.8-1.6-1.8-1.8-2.1-.2-.3 0-.4.1-.5l.4-.5c.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4.1-.1 0-.3 0-.4s-.6-1.4-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.8 2.8 4.3 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z"/>
      </svg>
    </a>
  );
}
