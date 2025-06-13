// api/posts.ts
import { api } from '@lib/api/api';

interface Post {
    id: number;
    title: string;
    thumbnailImageUrl: string;
    field: string;
    viewCount: number;
    author: {
        name: string;
        imageUrl: string;
    };
    createdAt: string;
    isNew: boolean;
    isHot: boolean;
}

interface PostResponse {
    elements: Post[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPage: number;
}

interface FilterOptions {
    skills?: string[];
    fields?: string[];
    companies?: string[];
    keyword?: string;
}

// 필터 옵션을 기반으로 포스트를 가져오는 함수
export async function fetchPosts(
    type: 'company' | 'member',
    filters: FilterOptions = {}
): Promise<Post[]> {
    try {

        const queryString = new URLSearchParams();
        const params: Record<string, string> = {};

        if (filters.fields?.length) {
            filters.fields.forEach(field => queryString.append("fields", field));
        }

        if (filters.skills?.length) {
            filters.skills.forEach(skill => queryString.append("skills", skill));
        }

        if (filters.companies?.length && type === 'company') {
            filters.companies.forEach(company => queryString.append("companies", company));
        }

        if (filters.keyword?.length) {
            queryString.append("keyword", filters.keyword);
        }

        // URL 파라미터 생성
        Object.entries(params).forEach(([key, value]) => {
            queryString.append(key, value);
        });

        // API 요청 수행
        const response = await api.get<PostResponse>(
            `/api/v1/${type}-posts/search?${queryString.toString()}&page=1&size=999999`
        );
        return response.elements || [];

    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        return [];
    }
}