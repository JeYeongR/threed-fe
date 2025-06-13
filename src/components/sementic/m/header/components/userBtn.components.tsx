'use client';

import { useAuth } from '@hooks/useAuth';
import { api } from '@lib/api/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './userBtn.module.scss';

export default function UserBtnComponent() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleWriteClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isCreating) return;

    setIsCreating(true);
    try {
      const response = await api.post<{ postId: number }>('/api/v1/member-posts', {});
      const postId = response.postId;
      if (postId) {
        router.push(`/post/write/${postId}`);
      } else {
        throw new Error('Post ID not received');
      }
    } catch (err) {
      console.error('❌ 임시 게시물 생성 중 에러:', err);
      alert('❌ 게시글 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsCreating(false);
    }
  };

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
      <Link
        href="/post/write"
        onClick={handleWriteClick}
        className={isAuthenticated ? styles.on : styles.off}
        style={{ cursor: isCreating ? 'wait' : 'pointer' }}
      >
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
