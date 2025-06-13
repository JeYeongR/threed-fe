import { api } from '@lib/api/api';
import { useEffect } from 'react';

export function useImageUpload(
    editorRef: React.RefObject<any>,
    postId: number,
    setPostId: (id: number) => void,
    setIsUploading?: (uploading: boolean) => void // 외부에서 업로드 상태 전달용 (옵션)
) {
    useEffect(() => {
        const editorInstance = editorRef.current?.getInstance();
        if (!editorInstance) return;

        editorInstance.removeHook('addImageBlobHook');

        editorInstance.addHook('addImageBlobHook', async (blob: Blob) => {
            try {
                setIsUploading?.(true); // 업로드 시작

                let currentPostId = postId;

                // ✅ postId가 0이면 임시 게시물 생성
                if (currentPostId === 0) {
                    const res = await api.post<{ postId: number }>('/api/v1/member-posts');
                    currentPostId = res.postId;
                    setPostId(currentPostId);
                }

                const blobUrl = URL.createObjectURL(blob);
                const ext = blob.type.split('/')[1] || 'png';
                const fileName = `image-${Date.now()}.${ext}`;

                const altText = '업로드중...';
                const tempMarkdown = `![${altText}](${blobUrl})\n`;
                editorInstance.insertText(tempMarkdown);

                const { presignedUrl, fileUrl } = await api.post<{
                    presignedUrl: string;
                    fileUrl: string;
                }>(`/api/v1/member-posts/${currentPostId}/images`, {
                    fileName,
                });

                await fetch(presignedUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': blob.type,
                    },
                    body: blob,
                });

                const markdown = editorInstance.getMarkdown();
                const escapedBlobUrl = blobUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const updatedMarkdown = markdown.replace(
                    new RegExp(`!\\[${altText}\\]\\(${escapedBlobUrl}\\)`, 'g'), // altText로 교체
                    `![](${fileUrl})`
                );

                editorInstance.setMarkdown(updatedMarkdown);
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                alert('이미지 업로드 중 오류가 발생했습니다.');
            } finally {
                setIsUploading?.(false); // 업로드 종료
            }
        });
    }, [editorRef, postId, setPostId, setIsUploading]);
}
