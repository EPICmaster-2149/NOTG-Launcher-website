import React, { useState, useEffect, useRef } from "react";

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  enabled?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  className = "",
  onComplete,
  enabled = true,
  speed = 14,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const textRef = useRef(text);

  // Keep refs in sync
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // Reset when disabled
  useEffect(() => {
    if (!enabled) {
      setDisplayedText("");
      setIsTyping(false);
      indexRef.current = 0;
      hasCompletedRef.current = false;
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [enabled]);

  // Main typing logic
  useEffect(() => {
    if (!enabled || hasCompletedRef.current) return;

    // Longer delay before starting for better anticipation
    const startDelay = setTimeout(() => {
      setIsTyping(true);
      indexRef.current = 0;
      setDisplayedText("");

      const typeChar = () => {
        if (indexRef.current >= textRef.current.length) {
          hasCompletedRef.current = true;
          setIsTyping(false);
          setDisplayedText(textRef.current);
          onCompleteRef.current?.();
          return;
        }

        indexRef.current++;
        setDisplayedText(textRef.current.substring(0, indexRef.current));
        timerRef.current = setTimeout(typeChar, speed);
      };

      timerRef.current = setTimeout(typeChar, speed);
    }, 300);

    return () => {
      clearTimeout(startDelay);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, speed]);

  return (
    <span className={className}>
      {displayedText}
      {isTyping && (
        <span
          className="inline-block w-[3px] h-[1.1em] ml-1 bg-gradient-to-b from-indigo-300 to-indigo-500 rounded-sm align-middle"
          style={{
            animation: "blink-cursor 0.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            boxShadow: "0 0 8px rgba(99,102,241,0.6), 0 0 20px rgba(99,102,241,0.2)",
          }}
        />
      )}
    </span>
  );
};
