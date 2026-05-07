import React from "react";

const SERIF = {
	fontFamily: 'gt-super, Georgia, Cambria, "Times New Roman", Times, serif',
	fontFeatureSettings: '"pnum", "lnum"',
} as const;

export default function BookerHero() {
	return (
		<section className="relative bg-papyrus font-sans py-24 sm:py-32 lg:py-40 px-6 sm:px-10 lg:px-16">
			<div className="max-w-[1200px] mx-auto">
				<h1
					className="m-0 font-normal text-ink leading-[1.04] tracking-[-0.025em] text-[48px] sm:text-[72px] lg:text-[100px] xl:text-[112px]"
					style={SERIF}
				>
					Booker turns readers
					<br />
					into <span className="italic">formidable thinkers</span>
					<sup className="text-[0.32em] font-normal align-super ml-0.5 tracking-tight">
						[1]
					</sup>
				</h1>

				<figure className="mt-14 sm:mt-20 lg:mt-24 ml-[12%] sm:ml-[28%] max-w-[520px]">
					<blockquote
						className="m-0 italic text-ink/80 leading-[1.55] text-[16px] sm:text-[18px] lg:text-[20px]"
						style={SERIF}
					>
						<span className="not-italic mr-1">[1]</span>
						“Some books are to be tasted, others to be swallowed, and some few
						to be chewed and digested.”
					</blockquote>
					<figcaption
						className="text-right mt-4 italic text-ink/70 text-[15px] sm:text-[16px] lg:text-[18px]"
						style={SERIF}
					>
						— Francis Bacon
					</figcaption>
				</figure>
			</div>
		</section>
	);
}
