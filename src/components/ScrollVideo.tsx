"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Video file under /videos — drop-in ready for Higgsfield/Seedance clips. */
  src?: string;
  /** Poster image under /images — cinematic fallback with Ken-Burns motion. */
  poster: string;
  className?: string;
  alt?: string;
  /** Ken-Burns on the fallback image */
  kenBurns?: boolean;
};

/**
 * Apple-style scroll video: plays automatically while in the viewport,
 * pauses outside. If the video file does not exist (yet), it gracefully
 * falls back to the poster image with a slow Ken-Burns drift.
 */
export default function ScrollVideo({
  src,
  poster,
  className = "",
  alt = "",
  kenBurns = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOk, setVideoOk] = useState(false);

  // Probe whether the video file exists before rendering the <video>.
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (!cancelled && r.ok && type.startsWith("video")) setVideoOk(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Play/pause based on viewport visibility.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoOk) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [videoOk]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {videoOk && src ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={poster}
          alt={alt}
          data-food
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover ${
            kenBurns ? "ken-burns" : ""
          }`}
        />
      )}
    </div>
  );
}
