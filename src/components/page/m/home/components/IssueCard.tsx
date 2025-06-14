import CardBox from "@components/_utiles/m/card/CardBox.component";
import usePageData from '@components/page/home/hooks/usePosts';
import Image from "next/image";
import 'swiper/css';
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./IssueCard.module.scss";

interface HomeProps {
  type: 'company' | 'member';
  condition?: 'WEEK' | 'MONTH';
}

export default function IssuCardComponent({ type, condition }: HomeProps) {
  const { posts } = usePageData(type, condition ?? "WEEK");

  return (
    <ul className={`${styles.card_container} ${styles.issue_card_container}`}>
      {posts && posts.length > 0 ? (
        <div className={styles.card_list}>
          <Swiper spaceBetween={25} slidesPerView={2.4}>
            {posts.slice(0, 5).map(item => (
              <SwiperSlide key={item.id}>
                <CardBox
                  key={item.id}
                  url={
                    type === 'company'
                      ? `/post/view/${item.id}?type=company`
                      : `/post/view/${item.id}?type=member`
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className={styles.card_no_Data}>
          <Image src={'/images/ico_warning.png'} width={50} height={50} alt="warning" />
          <p className={styles.warning_text}>데이터가 없습니다</p>
        </div>
      )
      }
    </ul >
  );
}
