import React, { useState, useEffect } from "react";

interface SafeFeatureImageProps {
  src: string;
  alt: string;
  fallbackUI: React.ReactNode;
  className?: string;
}

export const SafeFeatureImage: React.FC<SafeFeatureImageProps> = ({ src, alt, fallbackUI, className = "" }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return <div className={className}>{fallbackUI}</div>;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      className={className}
    />
  );
};
