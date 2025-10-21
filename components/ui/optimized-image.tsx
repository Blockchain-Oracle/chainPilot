'use client';

/**
 * Optimized Image Component
 *
 * Handles both Next.js Image optimization and base64/data URLs
 * Provides fallback for failed images
 */

import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: React.ReactNode;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallback,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle missing src
  if (!src || error) {
    return <>{fallback}</>;
  }

  // Check if it's a base64 or data URL
  const isDataUrl = src.startsWith('data:');
  const isBase64 = src.startsWith('data:image/') || /^data:.*;base64,/.test(src);

  // For base64 images, use regular img tag
  if (isDataUrl || isBase64) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          width: fill ? '100%' : width ? `${width}px` : undefined,
          height: fill ? '100%' : height ? `${height}px` : undefined,
          objectFit: fill ? 'cover' : undefined,
        }}
        onError={() => setError(true)}
        onLoad={() => setIsLoading(false)}
      />
    );
  }

  // Use Next.js Image for remote URLs
  return (
    <>
      {isLoading && (
        <div
          className={`${className} animate-pulse bg-muted`}
          style={{
            width: fill ? '100%' : width ? `${width}px` : undefined,
            height: fill ? '100%' : height ? `${height}px` : undefined,
          }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => setError(true)}
        onLoad={() => setIsLoading(false)}
        unoptimized={src.includes('ipfs://') || src.includes('.svg')}
      />
    </>
  );
}

/**
 * NFT Image Component
 * Specialized for NFT images with better fallback handling
 */
export function NFTImage({
  image,
  alt,
  className = '',
  fallback,
  priority = false,
}: {
  image?: {
    cachedUrl?: string;
    thumbnailUrl?: string;
    pngUrl?: string;
    originalUrl?: string;
  };
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  priority?: boolean;
}) {
  // Try URLs in order of preference
  const imageUrl =
    image?.cachedUrl ||
    image?.thumbnailUrl ||
    image?.pngUrl ||
    image?.originalUrl;

  return (
    <OptimizedImage
      src={imageUrl}
      alt={alt}
      className={className}
      fallback={fallback}
      priority={priority}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

/**
 * Token Logo Component
 * Specialized for token logos with circular styling
 */
export function TokenLogo({
  src,
  alt,
  size = 48,
  className = '',
  fallback,
}: {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`${className} rounded-full`}
      fallback={fallback}
      quality={90}
    />
  );
}
