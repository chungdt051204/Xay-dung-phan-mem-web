import { useState, useEffect } from "react";
import "../style/Carousel.css";

const bannerSlides = [
  {
    id: 1,
    image:
      "https://www.shutterstock.com/image-vector/summer-collection-promotional-banner-summertime-260nw-1445935322.jpg",
    title: "Summer Collection",
    description: "Exclusive deals on summer products",
  },
  {
    id: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMaEbI4cepvUEJSCZyHw745B6zCHimjYx3yA&s",
    title: "New Arrivals",
    description: "Check out our latest products",
  },
  {
    id: 3,
    image:
      "https://img.freepik.com/premium-vector/special-offer-typography-tag-logo-banner-design-artwork_1188421-3343.jpg",
    title: "Special Offer",
    description: "Get up to 50% off on selected items",
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000); // Change slide every 5 seconds

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
