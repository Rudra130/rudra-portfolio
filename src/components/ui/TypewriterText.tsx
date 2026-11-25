import React, { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypewriterTextProps {
  words: string[];
  className?: string;
  cursorClassName?: string;
}

/**
 * Splits a string into user-perceived grapheme clusters so scripts like
 * Hindi Devanagari never break mid-conjunct or leave dotted combining marks.
 */
export function splitGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const SegmenterCtor = (
      Intl as unknown as {
        Segmenter: new (
          locale: string,
          opts: { granularity: 'grapheme' }
        ) => { segment: (input: string) => Iterable<{ segment: string }> };
      }
    ).Segmenter;
    const segmenter = new SegmenterCtor('hi', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/**
 * Dynamic bilingual typewriter component cycling cleanly across words
 * with grapheme-safe deletion and prefers-reduced-motion support.
 */
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  words,
  className,
  cursorClassName,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const wordsKey = words.join('\u0000');
  const graphemeWords = useMemo(
    () => words.filter(Boolean).map((w) => splitGraphemes(w)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wordsKey]
  );

  const [wordIndex, setWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(() => graphemeWords[0]?.length ?? 0);
  const [phase, setPhase] = useState<'holding' | 'deleting' | 'typing'>('holding');

  useEffect(() => {
    if (prefersReducedMotion || graphemeWords.length <= 1) return;

    const currentClusters = graphemeWords[wordIndex] ?? [];
    const isDevanagari = /[\u0900-\u097F]/.test(currentClusters.join(''));
    const typeMs = isDevanagari ? 150 : 95;
    const deleteMs = isDevanagari ? 90 : 55;

    let delayMs = typeMs;
    if (phase === 'holding') delayMs = 2200;
    else if (phase === 'deleting') delayMs = charCount === 0 ? 320 : deleteMs;
    else if (phase === 'typing' && charCount >= currentClusters.length) delayMs = 2200;

    const timer = window.setTimeout(() => {
      if (phase === 'holding') {
        setPhase('deleting');
        return;
      }

      if (phase === 'deleting') {
        if (charCount > 0) {
          setCharCount((c) => c - 1);
        } else {
          setWordIndex((idx) => (idx + 1) % graphemeWords.length);
          setPhase('typing');
        }
        return;
      }

      if (charCount < currentClusters.length) {
        setCharCount((c) => c + 1);
      } else {
        setPhase('holding');
      }
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, graphemeWords, wordIndex, charCount, phase]);

  const activeClusters = graphemeWords[wordIndex] ?? [];
  const visibleText = prefersReducedMotion
    ? words[0] ?? ''
    : activeClusters.slice(0, charCount).join('');

  return (
    <span className={className}>
      <span className="sr-only">{words[0]}</span>
      <span aria-hidden="true" className="inline-flex items-center justify-center">
        <span>{visibleText}</span>
        {!prefersReducedMotion && (
          <span
            className={
              cursorClassName ||
              'inline-block w-[3px] sm:w-[4px] h-[0.88em] ml-1.5 sm:ml-2.5 bg-amber-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.8)]'
            }
          />
        )}
      </span>
    </span>
  );
};
