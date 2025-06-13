'use client';

import { useAuth } from '@hooks/useAuth';
import Link from 'next/link';
import styles from './userBtn.module.scss';

export default function UserBtnComponent() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    const providerType = await logout();

    if (providerType === 'KAKAO') {
      const clientId = process.env.NEXT_PUBLIC_KAKAO_API!;
      const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=https://www.threed.site`;
      window.location.href = kakaoLogoutUrl;
      return;
    }

    window.location.href = '/';
  };

  return (
    <div className={styles.nav_icons}>
      <Link href="/post/write" className={isAuthenticated ? styles.on : styles.off}>
        <div className={`${styles.icon} ${styles.write_icon}`}></div>
      </Link>
      <Link href="/login" className={!isAuthenticated ? styles.on : styles.off}>
        <div className={`${styles.icon} ${styles.login_icon}`}></div>
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className={isAuthenticated ? styles.on : styles.off}
      >
        <div className={`${styles.icon} ${styles.ico_logout}`}></div>
      </button>
      <Link href="/userpage" className={isAuthenticated ? styles.on : styles.off}>
        <div className={`${styles.icon} ${styles.ico_mypage}`}></div>
      </Link>
    </div>
  );
}
