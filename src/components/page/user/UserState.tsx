'use client';

import { useAuth } from '@hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './UserState.module.scss';

export default function UserStateComponent() {
    const { isAuthenticated, logout } = useAuth();
    const pathname = usePathname();

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

    if (isAuthenticated === null || pathname === '/login') return null;

    if (!isAuthenticated) {
        return (
            <div className={styles.user_state}>
                <div className={styles.state_login}>
                    <Link href="/login">
                        <i className={styles.ico_login}></i>
                        <span>로그인</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.user_state}>
            <div className={styles.state_logout}>
                <button type="button" onClick={handleLogout}>
                    <i className={styles.ico_logout}></i>
                    <span>로그아웃</span>
                </button>
            </div>
            <div className={styles.state_mypage}>
                <Link href="/userpage">
                    <i className={styles.ico_mypage}></i>
                    <span>마이페이지</span>
                </Link>
            </div>
        </div>
    );
}