import { useState, useRef, useEffect } from 'react';
import { medicalTerms } from '../data';

interface TooltipState {
  term: string;
  x: number;
  y: number;
}

interface Props {
  text: string;
}

export default function MedicalText({ text }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.med-term')) setTooltip(null);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const sortedTerms = Object.keys(medicalTerms).sort((a, b) => b.length - a.length);

  const buildParts = () => {
    let remaining = text;
    const parts: { type: 'text' | 'term'; content: string; term?: string }[] = [];

    while (remaining.length > 0) {
      let found = false;
      for (const term of sortedTerms) {
        const idx = remaining.toLowerCase().indexOf(term.toLowerCase());
        if (idx === 0) {
          parts.push({ type: 'term', content: remaining.slice(0, term.length), term });
          remaining = remaining.slice(term.length);
          found = true;
          break;
        } else if (idx > 0) {
          parts.push({ type: 'text', content: remaining.slice(0, idx) });
          parts.push({ type: 'term', content: remaining.slice(idx, idx + term.length), term });
          remaining = remaining.slice(idx + term.length);
          found = true;
          break;
        }
      }
      if (!found) {
        parts.push({ type: 'text', content: remaining });
        remaining = '';
      }
    }
    return parts;
  };

  const handleTermClick = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip(tooltip?.term === term ? null : { term, x: rect.left, y: rect.top });
  };

  const parts = buildParts();

  return (
    <span ref={containerRef} className="relative">
      {parts.map((p, i) =>
        p.type === 'term' ? (
          <span
            key={i}
            className="med-term border-b border-dotted border-blue-500 cursor-pointer text-inherit hover:text-blue-600 transition-colors relative"
            onClick={(e) => handleTermClick(e, p.term!)}
          >
            {p.content}
            {tooltip?.term === p.term && (
              <div
                className="fixed z-50 bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm"
                style={{ left: Math.min(tooltip.x, window.innerWidth - 340), top: tooltip.y - 10, transform: 'translateY(-100%)', minWidth: 220, maxWidth: 320 }}
              >
                <div className="font-semibold text-blue-600 mb-1">
                  {p.term!.charAt(0).toUpperCase() + p.term!.slice(1)}
                </div>
                <div className="text-gray-700 leading-relaxed">{medicalTerms[p.term!.toLowerCase()]}</div>
              </div>
            )}
          </span>
        ) : (
          <span key={i}>{p.content}</span>
        )
      )}
    </span>
  );
}
