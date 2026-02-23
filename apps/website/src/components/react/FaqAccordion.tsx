import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  title?: string;
  label?: string;
}

export default function FaqAccordion({
  faqs,
  title = 'Frequently Asked Questions',
  label = 'FAQ',
}: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq__content">
      <div className="faq__header">
        <p className="label faq__label">{label}</p>
        <h2 className="faq__title">{title}</h2>
      </div>
      <div className="faq__list">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
            <button
              className="faq-item__question"
              onClick={() => toggle(index)}
              aria-expanded={activeIndex === index}
            >
              {faq.question}
              <svg
                className="faq-item__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <div className="faq-item__answer">
              <div className="faq-item__answer-inner">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
