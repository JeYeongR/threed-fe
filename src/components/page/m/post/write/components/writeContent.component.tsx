'use client';

import style from './writeContent.module.scss';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

interface ToastEditorProps {
    editorRef: React.RefObject<any>;
    initialContent?: string;
    postId: number;
    uploadImage: (postId: number, image: File) => Promise<string | null>;
}

export default function ToastEditor({
    editorRef,
    initialContent = '',
    postId,
    uploadImage,
}: ToastEditorProps) {
    const onUploadImage = async (blob: File, callback: (url: string, altText: string) => void) => {
        if (!postId || postId === 0) {
            alert('게시글이 생성되지 않아 이미지를 업로드할 수 없습니다.');
            return;
        }

        const imageUrl = await uploadImage(postId, blob);
        if (imageUrl) {
            callback(imageUrl, 'image');
        } else {
            // 에러 알림은 uploadImage 함수 내부에서 처리하므로 여기서는 생략 가능
        }
    };

    return (
        <div className={style.content}>
            <Editor
                ref={editorRef}
                initialValue={initialContent}
                previewStyle="tab"
                height="500px"
                initialEditType="markdown"
                hideModeSwitch={true}
                useCommandShortcut={true}
                plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
                hooks={{
                    addImageBlobHook: onUploadImage,
                }}
            />
        </div>
    );
}
