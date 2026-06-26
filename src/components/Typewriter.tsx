import React, { useState, useEffect, useRef } from "react";

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  enabled?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, className = "", onComplete, enabled = true }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const hasCompletedRef = useRef(false);
  const maxRevealedRef = useRef(0);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText("");
      setStarted(false);
      hasCompletedRef.current = false;
      maxRevealedRef.current = 0;
      return;
    }

    if (hasCompletedRef.current) return;

    const handleScroll = () => {
      if (!elementRef.current || hasCompletedRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Start revealing characters when the element enters from the bottom of the viewport (100% height)
      // Reach 100% typing completion when the element scrolls to around 55% of the viewport height (approx middle screen)
      const startTrigger = viewportHeight;
      const endTrigger = viewportHeight * 0.55;

      let progress = 0;
      if (rect.top < startTrigger) {
        progress = (startTrigger - rect.top) / (startTrigger - endTrigger);
      }
      progress = Math.max(0, Math.min(1, progress));

      if (progress > 0 && !started) {
        setStarted(true);
      }

      const targetLen = Math.floor(progress * text.length);
      if (targetLen > maxRevealedRef.current) {
        maxRevealedRef.current = targetLen;
        setDisplayedText(text.substring(0, targetLen));
      }

      if (maxRevealedRef.current >= text.length) {
        hasCompletedRef.current = true;
        setDisplayedText(text);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    };

    // Run initial scroll check on mount and resize
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [enabled, text]);

  return (
    <span ref={elementRef} className={className}>
      {displayedText}
      {started && displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-4 ml-0.5 bg-indigo-400 animate-pulse align-middle" />
      )}
    </span>
  );
};
