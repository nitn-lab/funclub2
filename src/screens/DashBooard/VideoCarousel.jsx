import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const VideoCarousel = ({ videos, onSlideChange }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    beforeChange: (oldIndex, newIndex) => {setCurrentSlide(newIndex);onSlideChange(newIndex)},
    appendDots: dots => (
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          
        }}
      >
        <ul style={{ margin: 0, padding: 0, display: 'flex', listStyleType: 'none', justifyContent: "center" }}>
          {dots.map((dot, index) => (
            <li key={index} style={{ margin: '0 1px', listStyleType: 'none' }}>
              <button
                style={{
                  backgroundColor: index === currentSlide ? 'black' : "white",
                  borderRadius: '50%',
                  width: '10px',
                  height: '10px',
                  border: 'none',
                }}
                onClick={() => sliderRef.current.slickGoTo(index)}
              />
            </li>
          ))}
        </ul>
      </div>
    ),
  };

  useEffect(() => {
    const startAutoplay = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        sliderRef.current.slickNext();
      }, 5000); 
    };

    startAutoplay();

    return () => clearInterval(intervalRef.current); 
  }, []);

  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  return (
    <div className="video-carousel relative flex justify-center items-center mx-auto transition-all">
      <Slider ref={sliderRef} {...settings} className="w-full h-full transition-all">
        {videos && videos.length > 0 && videos.map((video, index) => (
          <div key={index} className="relative w-full h-full transition-all">
            <video
              src={video.src}
              controls
              autoPlay
              muted
              loop
              className="w-full h-[calc(95vh-184px)]  object-cover rounded-sm md:rounded-none transition-all"
            />
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="pulse-button relative">
                <button className="relative z-10 bg-main-gradient text-white rounded-full w-24 h-24 text-lg">Join Now</button>
                <span className="absolute inset-0 rounded-full bg-main-gradient opacity-75 animate-pulse"></span>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full shadow-md z-10 hover:scale-125"
        onClick={handlePrev}
      >
        <ArrowBackIosNewIcon />
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full shadow-md  hover:scale-125"
        onClick={handleNext}
      >
        <ArrowForwardIosIcon />
      </button>
    </div>
  );
};

export default VideoCarousel;