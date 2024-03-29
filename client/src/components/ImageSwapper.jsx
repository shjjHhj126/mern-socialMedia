import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function ImageSwapper({ images }) {
  SwiperCore.use([Navigation]);
  return (
    <Swiper
      navigation
      style={{ "--swiper-navigation-color": "rgb(209 213 219)" }}
      className="bg-blue-300 h-full w-full">
      {images.map((image, index) => (
        <SwiperSlide key={image}>
          <div
            className="h-full w-full"
            style={{
              background: `url(${image}) center no-repeat`,
              backgroundSize: "cover",
            }}></div>
        </SwiperSlide>
      ))}
      <p>hkkk</p>
    </Swiper>
  );
}
