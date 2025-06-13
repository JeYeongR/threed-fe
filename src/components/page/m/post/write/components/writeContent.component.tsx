'use client';

import style from './writeContent.module.scss';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';



interface WriteContentProps {
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
}: WriteContentProps) {
    const onUploadImage = async (blob: File, callback: (url: string, altText: string) => void) => {
        const imageUrl = await uploadImage(postId, blob);
        if (imageUrl) {
            callback(imageUrl, 'image');
        } else {
            alert('이미지 업로드에 실패했습니다.');
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
                hideModeSwitch="readOnly"
                useCommandShortcut={true}
                plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
                hooks={{
                    addImageBlobHook: onUploadImage,
                }}
            />
        </div>
    );
}
