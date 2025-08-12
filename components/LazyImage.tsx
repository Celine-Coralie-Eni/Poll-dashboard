"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  width?: number;
  height?: number;
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  fallback = "/placeholder.png",
  width,
  height 
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn(
        "transition-opacity duration-300",
        isLoading ? "opacity-0" : "opacity-100",
        className
      )}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
