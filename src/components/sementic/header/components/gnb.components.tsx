'use client';

import { isSession } from '@lib/session/useAuthCheck';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './gnb.module.scss';

export default function GnbComponent() {
  const [session, setSession] = useState(false);

  useEffect(() => {
    const hasSession = isSession();
    setSession(hasSession);
  }, []);

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
