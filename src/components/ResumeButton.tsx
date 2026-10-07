import { person } from '../content';
import './resume.css';

/* Kept from the old site: on hover a miniature résumé slides up out of the button. */
export default function ResumeButton({ label = 'Résumé' }: { label?: string }) {
  return (
    <div className="resume-btn-wrap">
      <div className="peek-window" aria-hidden>
        <div className="resume-preview">
          <div className="name" />
          <div className="title" />
          <div className="line w90" />
          <div className="line w75" />
          <div className="line w95" />
          <div className="line w90" />
        </div>
      </div>
      <a href={person.resume} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-resume">
        <span>{label}</span>
        <span className="icon-circle" aria-hidden>
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 2v9M4 7.5 8 11.5l4-4M3 14h10" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
        </span>
        <span className="sr-only">(PDF, opens in a new tab)</span>
      </a>
    </div>
  );
}
