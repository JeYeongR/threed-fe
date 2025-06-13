'use client'

import { useAuth } from '@hooks/useAuth';
import { api } from '@lib/api/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from "./userBtn.module.scss";

export default function UserBtnComponent() {
  const { isAuthenticated } = useAuth();
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

  // 로그인 상태가 아직 확인되지 않았으면 아무것도 렌더링하지 않음
  if (isAuthenticated === null) {
    return <div className={styles.nav_icons} />;
  }

  return (
    <div className={styles.nav_icons}>
      <Link
        href="/post/write"
        onClick={handleWriteClick}
        className={isAuthenticated ? styles.on : styles.off}
        style={{
          display: isAuthenticated ? 'flex' : 'none',
          cursor: isCreating ? 'wait' : 'pointer',
        }}
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
