import { api } from "../api/api";

let accessToken: string | null = null;

export interface TokenResponse {
    accessToken: string;
}

export enum SocialProvider {
    Google = 'google',
    Github = 'github',
    Kakao = 'kakao'
}

export function getAccessToken(): string | null {
    return accessToken;
}

export function setAccessToken(token: string | null): void {
    accessToken = token;
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sessionChanged'));
    }
}

export async function getToken(provider: SocialProvider, code: string): Promise<TokenResponse> {
    const data = await api.get<TokenResponse>(`/api/v1/auth/${provider}/callback?code=${code}`);

    if (data.accessToken) {
        setAccessToken(data.accessToken);
    }

    return {
        accessToken: data.accessToken,
    };
}

export function clearAccessToken(): void {
    setAccessToken(null);
}