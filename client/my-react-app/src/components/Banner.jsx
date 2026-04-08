import { useState, useEffect } from "react";
import "../style/Carousel.css";

const bannerSlides = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/drbezo9mp/image/upload/v1774179846/banner2_pwquid.png",
    title: "Summer Collection",
    description: "Exclusive deals on summer products",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/drbezo9mp/image/upload/v1774179846/banner3_kot6ec.png",
    title: "New Arrivals",
    description: "Check out our latest products",
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/drbezo9mp/image/upload/v1774179846/banner4_lxqjoh.png",
    title: "Special Offer",
    description: "Get up to 50% off on selected items",
  },
  {
    id: 4,
    image:
      "https://res.cloudinary.com/drbezo9mp/image/upload/v1774179845/banner1_ej26ga.png",
    title: "Online Shopping",
    description: "Shop now and enjoy fast delivery",
  },
  {
  id: 5,
  image:
    "https://res.cloudinary.com/drbezo9mp/image/upload/v1774181305/banner5_lyjmmu.png",
  title: "Big Sale",
  description: "Discount up to 70% - Limited time",
}
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? bannerSlides.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${
              index === currentSlide ? "active" : ""
            }`}
          >
            <img src={slide.image} alt={slide.title} className="slide-image" />
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button className="carousel-btn prev-btn" onClick={goToPrevious}>
        &#10094;
      </button>
      <button className="carousel-btn next-btn" onClick={goToNext}>
        &#10095;
      </button>

      {/* Dot Indicators */}
      <div className="carousel-dots">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}