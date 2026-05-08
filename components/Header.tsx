import React from "react";

export default function BestlibHeader() {
  return (
    <div className="flex items-center justify-between p-6 border-b border-ink/20 bg-parchment font-sans">
      <a
        aria-label="Homepage"
        href="/"
        className="no-underline text-inherit cursor-pointer text-3xl leading-none tracking-tight text-ink"
      >
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600 }}>Best</span>
        <span style={{ fontFamily: 'var(--font-dm-serif), serif', fontStyle: 'italic' }}>lib</span>
      </a>

      <a
        href="/library"
        className="inline-block text-center no-underline text-parchment bg-coffee rounded-lg text-sm leading-6 font-medium px-5 py-2 hover:bg-flame hover:border-flame transition-colors"
      >
        Start reading
      </a>
    </div>
  );
}
