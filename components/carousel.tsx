'use client'
import React, { useEffect, useRef, useState, useMemo } from "react";
import myData from '@/public/allbooks.json';

export type Book = {
	image: string;
	title: string;
	author: string;
	rating: number;
	ratings_count: number;
	goodreads_url?: string;
	categories?: string[];
};

const StarIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="#D4A853" aria-hidden="true">
		<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
	</svg>
);

const ChevronLeft = ({ size = 18 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const ChevronRight = ({ size = 18 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

function formatCount(n: number) {
	return n ? n.toLocaleString("en-US") : "0";
}

export function BookCard({ book }: { book: Book }) {
	return (
		<article 
			onClick={() => book.goodreads_url && window.open(book.goodreads_url, '_blank')}
			className="group flex-none w-[150px] sm:w-[150px] lg:w-[150px] xl:w-[150px] cursor-pointer"
		>
			<div className="overflow-hidden rounded-[5px] shadow-[0_2px_6px_rgba(44,34,24,0.18),0_1px_3px_rgba(44,34,24,0.10)] bg-papyrus">
				<img
					src={book.image}
					alt={book.title}
					loading="lazy"
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
				/>
			</div>
			<div className="pt-4">
				<h3 className="text-[16px] sm:text-[17px] lg:text-[18px] leading-[1.3] font-semibold text-ink line-clamp-2 mb-1 group-hover:text-flame transition-colors">
					{book.title}
				</h3>
				<p className="text-[14px] sm:text-[15px] text-coffee leading-[1.3] mb-2 truncate">
					{book.author}
				</p>
				<div className="flex items-center gap-1.5">
					<StarIcon />
					<span className="text-[14px] sm:text-[15px] font-medium text-ink">
						{book.rating ? book.rating.toFixed(2) : "N/A"}
					</span>
					<span className="text-[13px] sm:text-[14px] text-coffee">
						({formatCount(book.ratings_count)})
					</span>
				</div>
			</div>
		</article>
	);
}

type SliderProps = {
	books?: Book[];
	title?: string;
	subtitle?: string;
};

export default function EssentialReads({
	books,
	title = "The hottest book in every category, this week.",
	subtitle = "A weekly cut of what the world's sharpest readers are picking up right now — one essential title per domain, refreshed every Sunday.",
}: SliderProps = {}) {
	const displayBooks = useMemo(() => {
		if (books && books.length > 0) return books;
		
		const groups: Record<string, Book[]> = {};
		(myData as Book[]).forEach(p => {
			const cat = p.categories?.[0] || 'other';
			if (!groups[cat]) groups[cat] = [];
			groups[cat].push(p);
		});
		
		const topBooks: Book[] = [];
		for (const cat in groups) {
			const catBooks = groups[cat];
			// Find the most popular book in this category based on ratings_count
			const topBook = catBooks.reduce((prev, current) => 
				(prev.ratings_count > current.ratings_count) ? prev : current
			);
			topBooks.push(topBook);
		}
		
		// Sort the top books by overall ratings_count descending
		return topBooks.sort((a, b) => b.ratings_count - a.ratings_count);
	}, [books]);

	const trackRef = useRef<HTMLDivElement>(null);
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(true);

	const updateArrows = () => {
		const el = trackRef.current;
		if (!el) return;
		setCanPrev(el.scrollLeft > 4);
		setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
	};

	useEffect(() => {
		updateArrows();
		const el = trackRef.current;
		if (!el) return;
		el.addEventListener("scroll", updateArrows, { passive: true });
		window.addEventListener("resize", updateArrows);
		return () => {
			el.removeEventListener("scroll", updateArrows);
			window.removeEventListener("resize", updateArrows);
		};
	}, []);

	const scrollByPage = (dir: 1 | -1) => {
		const el = trackRef.current;
		if (!el) return;
		el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
	};

	return (
		<section className="bg-parchment min-h-screen flex items-center py-20 sm:py-24 lg:py-28 border-y border-ink/10 overflow-hidden">
			<div className="w-full max-w-[1600px] mx-auto">
				<div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-12 lg:mb-16 px-6 sm:px-8 lg:px-12 xl:px-16">
					<div className="max-w-[820px]">
						<h2
							className="text-[36px] sm:text-[48px] lg:text-[60px] xl:text-[68px] leading-[1.05] font-normal text-ink m-0 tracking-[-0.02em]"
							style={{ fontFamily: "var(--font-fraunces), serif" }}
						>
							{title}
						</h2>
						<p className="text-[16px] sm:text-[18px] lg:text-[20px] text-coffee mt-5 max-w-[640px] leading-relaxed">
							{subtitle}
						</p>
					</div>

					<div className="flex items-center gap-2 lg:gap-3 flex-none hidden lg:flex">
						<button
							onClick={() => scrollByPage(-1)}
							disabled={!canPrev}
							aria-label="Previous"
							className="flex justify-center items-center w-11 h-11 lg:w-14 lg:h-14 rounded-2xl bg-papyrus text-ink shadow-[0_2px_8px_rgba(44,34,24,0.10)] hover:bg-amber-warm disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
						>
							<ChevronLeft size={22} />
						</button>
						<button
							onClick={() => scrollByPage(1)}
							disabled={!canNext}
							aria-label="Next"
							className="flex justify-center items-center w-11 h-11 lg:w-14 lg:h-14 rounded-2xl bg-papyrus text-ink shadow-[0_2px_8px_rgba(44,34,24,0.10)] hover:bg-amber-warm disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
						>
							<ChevronRight size={22} />
						</button>
					</div>
				</div>

				<div
					ref={trackRef}
					className="flex gap-5 sm:gap-6 lg:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-6 sm:px-8 lg:px-12 xl:px-16"
				>
					{displayBooks.map((book) => (
						<div key={book.title} className="snap-start shrink-0">
							<BookCard book={book} />
						</div>
					))}
					<div className="shrink-0 w-1 lg:hidden"></div>
				</div>
			</div>
		</section>
	);
}
