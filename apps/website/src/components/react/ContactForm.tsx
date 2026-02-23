import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  subjects?: string[];
}

export default function ContactForm({
  subjects = [
    'General Inquiry',
    'Wedding Inquiry',
    'Corporate Event',
    'Private Event',
    'Carriage Services',
    'Horse Boarding',
    'Horse Transport',
    'Sponsorship',
    'Partnership',
    'Other',
  ],
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // For now, just show success. Later this will POST to Cloudflare Workers
    console.log('Form data:', data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="contact-form">
        <div className="form-success" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2d5a3f"
            strokeWidth="2"
            style={{ margin: '0 auto 1.5rem' }}
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 style={{ marginBottom: '1rem', color: '#1a3c2a' }}>Thank You!</h3>
          <p style={{ color: '#666' }}>
            We've received your message and will get back to you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="firstName">
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            placeholder="Your first name"
            {...register('firstName')}
          />
          {errors.firstName && (
            <span className="form-error">{errors.firstName.message}</span>
          )}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="lastName">
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            placeholder="Your last name"
            {...register('lastName')}
          />
          {errors.lastName && (
            <span className="form-error">{errors.lastName.message}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="your@email.com"
            {...register('email')}
          />
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className="form-input"
            placeholder="(303) 555-0000"
            {...register('phone')}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="subject">
          Subject *
        </label>
        <select
          id="subject"
          className={`form-select ${errors.subject ? 'error' : ''}`}
          {...register('subject')}
        >
          <option value="">Select a subject...</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.subject && <span className="form-error">{errors.subject.message}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="message">
          Message *
        </label>
        <textarea
          id="message"
          className={`form-textarea ${errors.message ? 'error' : ''}`}
          placeholder="Tell us about your inquiry..."
          rows={6}
          {...register('message')}
        />
        {errors.message && <span className="form-error">{errors.message.message}</span>}
      </div>

      <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
        <svg className="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
}
