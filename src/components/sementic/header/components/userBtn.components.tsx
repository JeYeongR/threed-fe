'use client'

import { useAuth } from '@hooks/useAuth';
import Link from "next/link";
import styles from "./userBtn.module.scss";

export default function UserBtnComponent() {
  const { isAuthenticated } = useAuth();

  // 로그인 상태가 아직 확인되지 않았으면 아무것도 렌더링하지 않음
  if (isAuthenticated === null) {
    return <div className={styles.nav_icons} />;
  }

  return (
    <div className={styles.nav_icons}>
      <Link
        href="/post/write"
        className={isAuthenticated ? styles.on : styles.off}
        style={{ display: isAuthenticated ? 'flex' : 'none' }}
      >
        <div className={`${styles.icon} ${styles.write_icon}`}></div>
      </Link>
      <Link
        href="/login"
        className={styles.on}
        style={{ display: isAuthenticated ? 'none' : 'flex' }}
      >
        <div className={`${styles.icon} ${styles.login_icon}`}></div>
      </Link>
    </div>
  );
}
