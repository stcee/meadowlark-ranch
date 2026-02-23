import { useState, useEffect, useCallback } from 'react';

interface LightboxProps {
  /** CSS selector for images that trigger the lightbox */
  triggerSelector?: string;
}

export default function Lightbox({ triggerSelector = '.lightbox-trigger, .story__image img, .story-section__thumb img' }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const open = useCallback((src: string, alt: string) => {
    setImageSrc(src);
    setImageAlt(alt);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (target.matches(triggerSelector)) {
        open(target.src, target.alt || '');
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [triggerSelector, isOpen, open, close]);

  return (
    <div className={`lightbox ${isOpen ? 'active' : ''}`}>
      <div className="lightbox__overlay" onClick={close} />
      <div className="lightbox__content">
        <button className="lightbox__close" aria-label="Close lightbox" onClick={close}>
          &times;
        </button>
        {imageSrc && <img className="lightbox__image" src={imageSrc} alt={imageAlt} />}
      </div>
    </div>
  );
}
