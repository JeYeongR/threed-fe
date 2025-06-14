// "use client";

import CardBox from "@components/_utiles/card/CardBox.component";
import Pagination from "@components/_utiles/pagination/pagination.component";
import Image from "next/image";
import { useState } from "react";
import usePageData from '../hooks/usePosts';
import styles from "./AllCard.module.scss";
interface PostListProps {
    type: 'bookmark' | 'mypage';
    itemsPerPage?: number;
}

export default function AllCardcomponent({ type, itemsPerPage = 20,
}: PostListProps) {
    const { posts } = usePageData(type);
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = Array.isArray(posts)
        ? posts.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    const totalItems = Array.isArray(posts) ? posts.length : 0;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className={styles.bookmark_card_container}>
                <ul className={styles.card_list}>
                    {currentItems && currentItems.length > 0 ? (
                        currentItems.map((item) => (
                            <CardBox
                                key={item.id}
                                url={
                                    item.isCompany === true
                                        ? `/post/view/${item.id}?type=company`
                                        : item.isCompany === false
                                            ? `/post/view/${item.id}?type=member`
                                            : `/post/view/${item.id}`
                                }
                                imageSrc={item.thumbnailImageUrl ?? 'https://cdn.threed.site/thumbnails/threed.png'}
                                isNew={item.isNew}
                                isHot={item.isHot}
                                title={item.title}
                                languages={item?.skills?.length ? item.skills : item.field}
                                writer={item.author?.name}
                                writerImg={item.author?.imageUrl}
                                views={item.viewCount}
                                date={new Date(item.createdAt).toLocaleDateString("ko-KR")}

                            />
                        ))
                    ) : (
                        <div className={styles.card_no_Data}>
                            <Image
                                src={'/images/ico_warning.png'}
                                width={50}
                                height={50}
                                alt="warning"
                            />
                            <p className={styles.warning_text}>데이터가 없습니다</p>
                        </div>

                    )}
                </ul>
            </div>
            {totalItems > itemsPerPage && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalItems / itemsPerPage)}
                    onPageChange={paginate}
                />
            )}

        </>
    );
}
