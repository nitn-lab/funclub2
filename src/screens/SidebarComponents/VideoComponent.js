import React, { useState, useEffect, useRef } from 'react';

const VideoComponent = ({ src, poster }) => {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.75 } // Video will play when 75% in view
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Play video if in view, otherwise pause
      if (isInView) {
        video.play().catch(() => {
          
          video.play();
        });
      } else {
        video.pause();
      }
    }
  }, [isInView]);

  return (
    
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        controls
        loop
        className="h-full w-full  cursor-pointer object-cover sm:object-contain"
      />
    
  );
};

export default VideoComponent;