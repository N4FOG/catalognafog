import React from 'react';

export function highlightSearch(text: string, term: string): React.ReactNode {
  if (!text) return '';
  if (!term || !term.trim()) return text;

  const cleanTerm = term.trim();
  // Escape regex special chars
  const escaped = cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="search-highlight">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
