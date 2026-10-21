import { useState, type ReactNode } from "react";

/** Case study photo on a navy base. If the file isn't there yet it simply stays navy. */
export default function CaseStudyPhoto({
  src,
  alt,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`relative overflow-hidden bg-secondary-500 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(520px 320px at 85% 0%, rgba(83,58,253,0.45), transparent 65%), radial-gradient(420px 260px at 0% 100%, rgba(255,118,0,0.22), transparent 65%)",
      }}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      {children}
    </div>
  );
}
