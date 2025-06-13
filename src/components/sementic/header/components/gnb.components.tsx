'use client';

import { isSession } from '@lib/session/useAuthCheck';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './gnb.module.scss';

export default function GnbComponent() {
  const [session, setSession] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateSessionStatus = () => {
      const hasSession = isSession();
      setSession(hasSession);
    };

    updateSessionStatus(); // 초기 상태 설정
    setMounted(true);

    window.addEventListener('sessionChanged', updateSessionStatus);

    return () => {
      window.removeEventListener('sessionChanged', updateSessionStatus);
    };
  }, []);


  if (!mounted) return null; // SSR 중 렌더 방지

  return (
    <div className={styles.nav_menu}>
      <Link href="/company">디스커버리</Link>
      <Link href="/blog">기술블로그</Link>
      <Link
        href="/bookmark"
        className={session ? styles.on : styles.off}
      >
        MY북마크
      </Link>
    </div>
  );
}
