"use client";
import { useEffect, useState } from 'react';

const heroSlides = ['/images/banners/banner-1.jpg', '/images/banners/banner-2.jpg'];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const previousSlide = () => setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setActiveSlide((current) => (current + 1) % heroSlides.length);

  return (
    <section className="hero-section" aria-label="Portada principal">
      <div className="hero-banner">
        <img className="hero-banner-image" src={heroSlides[activeSlide]} alt="Baum portada" />
        <button type="button" className="hero-arrow hero-arrow-left" onClick={previousSlide} aria-label="Imagen anterior">‹</button>
        <button type="button" className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Imagen siguiente">›</button>
        <div className="hero-dots" aria-label="Selector de portada">
          {heroSlides.map((slide, index) => (
            <button
              key={slide}
              type="button"
              className={index === activeSlide ? 'hero-dot active' : 'hero-dot'}
              onClick={() => setActiveSlide(index)}
              aria-label={`Ver portada ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
