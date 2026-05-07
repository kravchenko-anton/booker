import React from "react";

export default function CTA() {
	return (
		<div
			className="flex flex-col items-center rounded-t-xl text-center gap-10 px-8 py-20 bg-terracotta border-t border-ink/30 font-sans"
		>
			<h2
				className="m-0 font-normal text-parchment text-[85px] leading-[88px] tracking-[-0.055em]"
				style={{
					fontFamily: 'gt-super, Georgia, Cambria, "Times New Roman", Times, serif',
					fontFeatureSettings: '"pnum", "lnum"',
				}}
			>
				It's a perfect day to <span className="text-amber-warm italic">find a great book.</span>
			</h2>
			<a
			href="/library"
			className="inline-block text-center no-underline text-parchment bg-ink border border-ink rounded-lg text-base leading-6 font-normal px-5 py-2 hover:bg-flame hover:border-flame transition-colors font-sans"
			>
			Start reading
		</a>
</div>
);
}