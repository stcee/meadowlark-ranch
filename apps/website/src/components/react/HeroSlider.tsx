import { useState, useEffect, useRef, useCallback } from 'react';

interface SlideImage {
  src: string;
  alt: string;
}

interface HeroSliderProps {
  slides: SlideImage[];
  heroLabel?: string;
  heroTitle: string;
  heroSubtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function HeroSlider({
  slides,
  heroLabel = 'Welcome to',
  heroTitle = 'Meadowlark Ranch',
  heroSubtitle = 'Boulder County, CO',
  ctaText = 'Event Services',
  ctaHref = '/planning-services',
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  const changeSlide = useCallback((index: number) => {
    if (bgRef.current) {
      bgRef.current.style.transition = 'opacity 0.5s ease';
      bgRef.current.style.opacity = '0';
      setTimeout(() => {
        if (bgRef.current && slides[index]) {
          bgRef.current.src = slides[index].src;
          bgRef.current.style.opacity = '1';
        }
      }, 500);
    }
    setCurrentIndex(index);
  }, [slides]);

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % slides.length;
        changeSlide(next);
        return next;
      });
    }, 6000);
  }, [slides.length, changeSlide]);

  // Entrance animation sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setIsLoaded(true), 100));
    timers.push(setTimeout(() => setAnimatedElements((s) => new Set(s).add('label')), 400));
    timers.push(setTimeout(() => setAnimatedElements((s) => new Set(s).add('title')), 600));
    timers.push(setTimeout(() => setAnimatedElements((s) => new Set(s).add('subtitle')), 800));
    timers.push(setTimeout(() => setAnimatedElements((s) => new Set(s).add('gallery')), 1000));
    timers.push(setTimeout(() => setAnimatedElements((s) => new Set(s).add('btn')), 1200));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-slide
  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  const handleThumbClick = (index: number) => {
    changeSlide(index);
    startAutoSlide();
  };

  return (
    <section className={`hero ${isLoaded ? 'hero--loaded' : 'hero--loading'}`}>
      <img
        ref={bgRef}
        src={slides[0]?.src || ''}
        alt="Meadowlark Ranch landscape"
        className={`hero__bg ${isLoaded ? 'hero__bg--animate' : ''}`}
      />
      <div className="hero__overlay" />
      <div className="hero__content">
        <p className={`hero__label ${animatedElements.has('label') ? 'animate-in' : ''}`}>
          {heroLabel}
        </p>
        <h1 className={`hero__title ${animatedElements.has('title') ? 'animate-in' : ''}`}>
          {heroTitle}
        </h1>
        <p className={`hero__subtitle ${animatedElements.has('subtitle') ? 'animate-in' : ''}`}>
          {heroSubtitle}
        </p>

        <div className={`hero__gallery ${animatedElements.has('gallery') ? 'animate-in' : ''}`}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero__gallery-item ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleThumbClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleThumbClick(index)}
            >
              <img src={slide.src} alt={slide.alt} loading="lazy" />
            </div>
          ))}
        </div>

        <a
          href={ctaHref}
          className={`btn btn--primary ${animatedElements.has('btn') ? 'animate-in' : ''}`}
        >
          {ctaText}
          <svg className="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
