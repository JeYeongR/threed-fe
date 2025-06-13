import { useCallback } from "react";
import { api } from "@lib/api/api";
import axios from "axios";

interface WriteFormData {
    title: string;
    content: string;
    field: string;
    skills: string[];
}

export function useWrite() {
    const createTempPost = useCallback(async (): Promise<number | null> => {
        try {
            const response = await api.post<{ postId: number }>("/api/v1/member-posts", {});
            return response.postId;
        } catch (err) {
            console.error("❌ 임시 게시물 생성 중 에러:", err);
            alert("❌ 게시글 생성 중 오류가 발생했습니다.");
            return null;
        }
    }, []);

    const uploadImage = useCallback(async (postId: number, image: File): Promise<string | null> => {
        if (!postId) {
            console.error("❌ Post ID is not available for image upload.");
            alert("❌ 이미지 업로드 중 오류가 발생했습니다. Post ID가 없습니다.");
            return null;
        }
        try {
            const uploadInfo = await api.post<{ presignedUrl: string; fileUrl: string }>(
                `/api/v1/member-posts/${postId}/images`
            );
            await axios.put(uploadInfo.presignedUrl, image, {
                headers: { "Content-Type": image.type },
            });
            return uploadInfo.fileUrl;
        } catch (err) {
            console.error("❌ 이미지 업로드 중 에러:", err);
            alert("❌ 이미지 업로드 중 오류가 발생했습니다.");
            return null;
        }
    }, []);

    const submit = useCallback(
        async (postId: number, data: WriteFormData): Promise<number | null> => {
            try {
                const isEmpty = (text: string) => !text || text.trim() === "";

                if (isEmpty(data.title)) {
                    alert("제목을 입력해주세요.");
                    return null;
                }
                if (data.title.length > 100) {
                    alert("제목의 텍스트가 너무 많습니다. (최대 100자)");
                    return null;
                }
                if (isEmpty(data.content)) {
                    alert("본문을 입력해주세요.");
                    return null;
                }
                if (data.content.length > 10000) {
                    alert("본문의 텍스트가 너무 많습니다. (최대 10,000자)");
                    return null;
                }

                if (!postId) {
                    alert("❌ 저장 중 오류 발생: Post ID가 없습니다.");
                    return null;
                }

                const payload = {
                    title: data.title,
                    content: data.content,
                    field: data.field,
                    skills: data.skills,
                };

                await api.patch(`/api/v1/member-posts/${postId}`, payload);

                alert("✅ 게시물이 저장되었습니다.");
                return postId;
            } catch (err) {
                console.error("❌ 게시물 저장 중 에러:", err);
                alert("❌ 저장 중 오류 발생");
                return null;
            }
        },
        []
    );

    return { submit, createTempPost, uploadImage };
}
