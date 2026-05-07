'use client'
import React, { useEffect, useRef, useState } from "react";

export type Book = {
	image: string;
	title: string;
	author: string;
	rating: number;
	ratings_count: number;
};

export const DEFAULT_BOOKS: Book[] = [
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1635827409i/20342617.jpg",
		title: "Just Mercy",
		author: "Bryan Stevenson",
		rating: 4.62,
		ratings_count: 266921,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1433168047i/5546.jpg",
		title: "The Feynman Lectures on Physics",
		author: "Richard P. Feynman",
		rating: 4.61,
		ratings_count: 8135,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1403194611i/1111.jpg",
		title: "The Power Broker",
		author: "Robert A. Caro",
		rating: 4.53,
		ratings_count: 30211,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1408324949i/20696006.jpg",
		title: "Being Mortal",
		author: "Atul Gawande",
		rating: 4.49,
		ratings_count: 222024,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1391032527i/43713.jpg",
		title: "Structure and Interpretation of Computer Programs",
		author: "Harold Abelson",
		rating: 4.47,
		ratings_count: 4869,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1652105350i/59575939.jpg",
		title: "An Immense World",
		author: "Ed Yong",
		rating: 4.46,
		ratings_count: 37271,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1457284880i/27220736.jpg",
		title: "Shoe Dog",
		author: "Phil Knight",
		rating: 4.45,
		ratings_count: 378577,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1522685770i/38799469.jpg",
		title: "Bad Blood",
		author: "John Carreyrou",
		rating: 4.4,
		ratings_count: 285046,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1387744370i/944652.jpg",
		title: "Poor Charlie's Almanack",
		author: "Charles T. Munger",
		rating: 4.39,
		ratings_count: 18557,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1535419394i/4069.jpg",
		title: "Man's Search for Meaning",
		author: "Viktor E. Frankl",
		rating: 4.37,
		ratings_count: 905799,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1517732866i/31170723.jpg",
		title: "Behave",
		author: "Robert M. Sapolsky",
		rating: 4.37,
		ratings_count: 33012,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1386925124i/71730.jpg",
		title: "Nonviolent Communication",
		author: "Marshall B. Rosenberg",
		rating: 4.33,
		ratings_count: 50603,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1283195046i/210404.jpg",
		title: "A Sand County Almanac",
		author: "Aldo Leopold",
		rating: 4.31,
		ratings_count: 37025,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553691804i/17349.jpg",
		title: "The Demon-Haunted World",
		author: "Carl Sagan",
		rating: 4.29,
		ratings_count: 81620,
	},
	{
		image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1391026083i/28815.jpg",
		title: "Influence",
		author: "Robert B. Cialdini",
		rating: 4.21,
		ratings_count: 180389,
	},
];

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
	return n.toLocaleString("en-US");
}

function BookCard({ book }: { book: Book }) {
	return (
		<article className="group flex-none w-[150px] sm:w-[150px] lg:w-[150px] xl:w-[150px] cursor-pointer">
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
				<p className="text-[14px] sm:text-[15px] text-coffee leading-[1.3] mb-2">
					{book.author}
				</p>
				<div className="flex items-center gap-1.5">
					<StarIcon />
					<span className="text-[14px] sm:text-[15px] font-medium text-ink">
						{book.rating.toFixed(2)}
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
	books = DEFAULT_BOOKS,
	title = "The hottest book in every category, this week.",
	subtitle = "A weekly cut of what the world's sharpest readers are picking up right now — one essential title per domain, refreshed every Sunday.",
}: SliderProps = {}) {
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
		<section className="bg-parchment min-h-screen flex items-center py-20 sm:py-24 lg:py-28 border-y border-ink/10">
			<div className="w-full lg:w-[80%] xl:w-[80%] 2xl:w-[80%] max-w-[1600px] mx-auto px-6 sm:px-8">
				<div className="flex justify-between items-end gap-6 mb-12 lg:mb-16">
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

					<div className="flex items-center gap-2 lg:gap-3 flex-none">
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
					className="flex gap-5 sm:gap-6 lg:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
				>
					{books.map((book) => (
						<div key={book.title} className="snap-start">
							<BookCard book={book} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
