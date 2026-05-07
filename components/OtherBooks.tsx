'use client'
import React, { useMemo, useState } from "react";

type Tag = "Focus" | "Habits" | "Strategy" | "Time" | "Craft" | "Stoicism";

type Book = {
	title: string;
	author: string;
	description: string;
	year: number;
	pages: number;
	tag: Tag;
	isbn?: string;
};

const BOOKS: Book[] = [
	{ title: "Deep Work", author: "Cal Newport", description: "Why focused work is the superpower of the distraction era — and how to train it like a muscle.", year: 2016, pages: 304, tag: "Focus", isbn: "9781455586691" },
	{ title: "Atomic Habits", author: "James Clear", description: "Small changes compound into outsized results — the four-laws system for behaviour design.", year: 2018, pages: 320, tag: "Habits", isbn: "9780735211292" },
	{ title: "The Power of Habit", author: "Charles Duhigg", description: "Cue, routine, reward — the anatomy of the loops that quietly run our lives.", year: 2012, pages: 416, tag: "Habits", isbn: "9780812981605" },
	{ title: "Make Time", author: "Jake Knapp", description: "A simple toolkit to reclaim time daily for the things that actually matter to you.", year: 2018, pages: 304, tag: "Time", isbn: "9780525572428" },
	{ title: "Indistractable", author: "Nir Eyal", description: "How to make focus governable and close the leaks where attention disappears.", year: 2019, pages: 304, tag: "Focus", isbn: "9781948836531" },
	{ title: "Digital Minimalism", author: "Cal Newport", description: "A manifesto against the screen sprawl, plus a protocol to rebuild the relationship.", year: 2019, pages: 304, tag: "Focus", isbn: "9780525542872" },
	{ title: "The 4-Hour Workweek", author: "Tim Ferriss", description: "Delegate, automate, and compress the workweek into precise high-leverage moves.", year: 2007, pages: 416, tag: "Strategy", isbn: "9780307465351" },
	{ title: "Essentialism", author: "Greg McKeown", description: "The discipline of less but better — saying no to everything that isn't decisive.", year: 2014, pages: 272, tag: "Strategy", isbn: "9780804137386" },
	{ title: "Getting Things Done", author: "David Allen", description: "The classic system: empty the mind, capture everything, move into action.", year: 2001, pages: 352, tag: "Time", isbn: "9780143126560" },
	{ title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", description: "Seven principles that turn scattered effort into a coherent long game.", year: 1989, pages: 432, tag: "Strategy", isbn: "9780743269513" },
	{ title: "So Good They Can't Ignore You", author: "Cal Newport", description: "Why career capital beats follow-your-passion — mastery as a path to autonomy.", year: 2012, pages: 304, tag: "Strategy", isbn: "9781455509126" },
	{ title: "Hyperfocus", author: "Chris Bailey", description: "The two faces of attention — deep and scattered — and how to switch deliberately.", year: 2018, pages: 240, tag: "Focus", isbn: "9780525540244" },
	{ title: "The Productivity Project", author: "Chris Bailey", description: "A year of self-experiments distilled into practical, ego-light insights.", year: 2016, pages: 304, tag: "Time", isbn: "9781101904046" },
	{ title: "Eat That Frog!", author: "Brian Tracy", description: "Twenty-one rules to stop procrastinating by attacking the worst task first.", year: 2001, pages: 144, tag: "Time", isbn: "9781626569416" },
	{ title: "The One Thing", author: "Gary Keller", description: "The narrowing question: what's the one thing that makes everything else easier or unnecessary?", year: 2013, pages: 240, tag: "Strategy", isbn: "9781885167774" },
	{ title: "The Now Habit", author: "Neil Fiore", description: "A practical approach to procrastination — through anxiety, not discipline.", year: 1988, pages: 224, tag: "Habits", isbn: "9781585425525" },
	{ title: "Flow", author: "Mihaly Csikszentmihalyi", description: "The psychology of optimal experience and how it can become a daily possibility.", year: 1990, pages: 336, tag: "Focus", isbn: "9780061339202" },
	{ title: "Peak", author: "Anders Ericsson", description: "Deliberate practice as the engine of mastery — what separates expertise from experience.", year: 2016, pages: 336, tag: "Strategy", isbn: "9780544456235" },
	{ title: "Mastery", author: "Robert Greene", description: "A map from apprenticeship to mastery, told through people who gave a life to one craft.", year: 2012, pages: 352, tag: "Strategy", isbn: "9780143124177" },
	{ title: "The War of Art", author: "Steven Pressfield", description: "On Resistance — the inner force that blocks important work, and how to outflank it.", year: 2002, pages: 192, tag: "Craft", isbn: "9781936891023" },
	{ title: "Do the Work", author: "Steven Pressfield", description: "A short, brutal manifesto for anyone stuck at the start. No theory.", year: 2011, pages: 96, tag: "Craft", isbn: "9781936891375" },
	{ title: "The Practice", author: "Seth Godin", description: "Creativity as a craft built on daily reps, not lightning-strike inspiration.", year: 2020, pages: 272, tag: "Craft", isbn: "9780593328972" },
	{ title: "Linchpin", author: "Seth Godin", description: "Who becomes indispensable in any system, and how to stop being merely competent.", year: 2010, pages: 256, tag: "Strategy", isbn: "9781591844099" },
	{ title: "The Dip", author: "Seth Godin", description: "When to quit and when to push — knowing exactly which game you're really playing.", year: 2007, pages: 96, tag: "Strategy", isbn: "9781591841661" },
	{ title: "Drive", author: "Daniel Pink", description: "What actually moves us: autonomy, mastery, purpose. Why carrots and sticks fail.", year: 2009, pages: 288, tag: "Habits", isbn: "9781594484803" },
	{ title: "When", author: "Daniel Pink", description: "The science of time — why when matters more than how, and how to ride daily rhythms.", year: 2018, pages: 272, tag: "Time", isbn: "9780735210622" },
	{ title: "A Whole New Mind", author: "Daniel Pink", description: "Six right-brain abilities that decide outcomes in an automated economy.", year: 2005, pages: 288, tag: "Craft", isbn: "9781594481710" },
	{ title: "Mindset", author: "Carol Dweck", description: "Growth vs fixed — the simple frame that changes how you relate to effort.", year: 2006, pages: 288, tag: "Habits", isbn: "9780345472328" },
	{ title: "Grit", author: "Angela Duckworth", description: "Passion plus perseverance — and why it outpaces talent in the long run.", year: 2016, pages: 352, tag: "Habits", isbn: "9781501111112" },
	{ title: "The Talent Code", author: "Daniel Coyle", description: "How skill is built physically — myelin, deep practice, ignition.", year: 2009, pages: 256, tag: "Strategy", isbn: "9780553384697" },
	{ title: "The Compound Effect", author: "Darren Hardy", description: "Small, repeated actions outperform any one-shot heroic push.", year: 2010, pages: 176, tag: "Habits", isbn: "9781593157243" },
	{ title: "The Slight Edge", author: "Jeff Olson", description: "The principle of small advantage — the unseen daily margin that decides outcomes.", year: 2005, pages: 280, tag: "Habits", isbn: "9781626340466" },
	{ title: "Mini Habits", author: "Stephen Guise", description: "Habits so small they're impossible to skip.", year: 2013, pages: 130, tag: "Habits", isbn: "9781494882273" },
	{ title: "Tiny Habits", author: "BJ Fogg", description: "Stanford behaviour model: anchoring new habits to ones you already keep.", year: 2019, pages: 320, tag: "Habits", isbn: "9780358003328" },
	{ title: "The Miracle Morning", author: "Hal Elrod", description: "A morning routine as the day's anchor — six practices that stack starting energy.", year: 2012, pages: 200, tag: "Habits", isbn: "9781609943950" },
	{ title: "Daily Rituals", author: "Mason Currey", description: "The daily routines of great writers and artists — a panorama, not a prescription.", year: 2013, pages: 304, tag: "Craft", isbn: "9780307273604" },
	{ title: "Bird by Bird", author: "Anne Lamott", description: "On writing and on living — generous, honest, deeply releasing.", year: 1994, pages: 256, tag: "Craft", isbn: "9780385480017" },
	{ title: "Thinking, Fast and Slow", author: "Daniel Kahneman", description: "Two systems of thought — and why our fast judgments mislead even when they feel right.", year: 2011, pages: 512, tag: "Strategy", isbn: "9780374533557" },
	{ title: "Stillness Is the Key", author: "Ryan Holiday", description: "Stillness as a strategic edge, told through philosophers and history's calmer minds.", year: 2019, pages: 288, tag: "Stoicism", isbn: "9780525538585" },
	{ title: "Discipline Is Destiny", author: "Ryan Holiday", description: "Discipline in the Stoic sense — a form of freedom, not self-punishment.", year: 2022, pages: 304, tag: "Stoicism", isbn: "9780593191699" },
	{ title: "Ego Is the Enemy", author: "Ryan Holiday", description: "The ego trap on the way up, at the top, and after the fall — and how to dodge it.", year: 2016, pages: 240, tag: "Stoicism", isbn: "9781591847816" },
	{ title: "The Obstacle Is the Way", author: "Ryan Holiday", description: "The Stoic art of turning obstacle into path, in modern language.", year: 2014, pages: 224, tag: "Stoicism", isbn: "9781591846352" },
	{ title: "Range", author: "David Epstein", description: "Why generalists win in complex, ambiguous fields where specialists falter.", year: 2019, pages: 352, tag: "Strategy", isbn: "9780735214484" },
	{ title: "The Alter Ego Effect", author: "Todd Herman", description: "Alter ego as a performance tool — borrowed from sport and stage for daily life.", year: 2019, pages: 320, tag: "Craft", isbn: "9780062838643" },
	{ title: "The 5 AM Club", author: "Robin Sharma", description: "The quiet hour as an invisible advantage, told as fable.", year: 2018, pages: 336, tag: "Habits", isbn: "9781443456623" },
	{ title: "The Monk Who Sold His Ferrari", author: "Robin Sharma", description: "A parable of trading status for meaning — simple but memorable.", year: 1997, pages: 208, tag: "Stoicism", isbn: "9780062515674" },
	{ title: "Ikigai", author: "Héctor García", description: "The Japanese idea of meaning at the intersection of love, need, and craft.", year: 2016, pages: 208, tag: "Stoicism", isbn: "9780143130727" },
	{ title: "Wabi Sabi", author: "Beth Kempton", description: "An aesthetic of imperfection — permission to live and work without strain.", year: 2018, pages: 240, tag: "Craft", isbn: "9780062905154" },
	{ title: "Four Thousand Weeks", author: "Oliver Burkeman", description: "Life as four thousand weeks — an anti-productivity book about facing finitude.", year: 2021, pages: 288, tag: "Time", isbn: "9780374159122" },
	{ title: "Slow Productivity", author: "Cal Newport", description: "Fewer tasks, longer horizons, higher quality — a manifesto for slow craft.", year: 2024, pages: 256, tag: "Time", isbn: "9780593544858" },
];

const FALLBACK_PALETTE = [
	{ bg: "#2C2218", text: "#FAF6F0", rule: "#D4A853" },
	{ bg: "#C4513D", text: "#FAF6F0", rule: "#F2C87A" },
	{ bg: "#8B6B4A", text: "#FAF6F0", rule: "#F2C87A" },
	{ bg: "#D4A853", text: "#2C2218", rule: "#2C2218" },
	{ bg: "#EDE6DA", text: "#2C2218", rule: "#E07A2F" },
	{ bg: "#E07A2F", text: "#FAF6F0", rule: "#F2C87A" },
	{ bg: "#F2C87A", text: "#2C2218", rule: "#C4513D" },
];

function Cover({ book, idx }: { book: Book; idx: number }) {
	const [failed, setFailed] = useState(false);
	const c = FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];
	const useImage = book.isbn && !failed;

	return (
		<div className="relative flex-none w-[80px] h-[120px] sm:w-[92px] sm:h-[138px] lg:w-[112px] lg:h-[168px] rounded-[3px] overflow-hidden shadow-[0_10px_28px_rgba(44,34,24,0.18)] bg-papyrus">
			{useImage && (
				<img
					src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg?default=false`}
					alt={`${book.title} cover`}
					className="absolute inset-0 w-full h-full object-cover"
					onError={() => setFailed(true)}
					loading="lazy"
				/>
			)}
			{!useImage && (
				<div
					className="absolute inset-0 flex flex-col justify-between p-2.5 lg:p-3"
					style={{ background: c.bg, color: c.text }}
				>
					<span className="text-[7px] lg:text-[8px] uppercase tracking-[0.18em] opacity-70 leading-tight">
						{book.author.split(" ").slice(-1)[0]}
					</span>
					<div className="flex flex-col items-center justify-center text-center flex-1 px-0.5">
						<span
							className="text-[10px] lg:text-[12px] leading-[1.15] line-clamp-5"
							style={{ fontFamily: "var(--font-fraunces), serif" }}
						>
							{book.title}
						</span>
						<div className="w-5 h-px mt-2" style={{ background: c.rule }} />
					</div>
					<span className="text-[7px] lg:text-[8px] opacity-60 text-right">
						{book.year}
					</span>
				</div>
			)}
			<div className="absolute inset-y-0 left-0 w-px bg-black/25" />
			<div className="absolute inset-y-0 right-0 w-px bg-white/10" />
		</div>
	);
}

export default function OtherBooks() {
	const tags = useMemo(() => {
		const set = new Set(BOOKS.map((b) => b.tag));
		return ["All", ...Array.from(set)] as const;
	}, []);

	const [activeTag, setActiveTag] = useState<string>("All");
	const filtered = activeTag === "All" ? BOOKS : BOOKS.filter((b) => b.tag === activeTag);

	return (
		<section className="bg-parchment text-ink py-20 sm:py-24 lg:py-[140px] px-5 sm:px-8 lg:px-[115px]">
			<div className="max-w-[1100px] mx-auto">
				{/* Heading */}
				<div className="mb-12 lg:mb-20">
					<p className="text-coffee text-xs sm:text-sm uppercase tracking-[0.22em] mb-5">
						Reading list · {BOOKS.length} books
					</p>
					<h2
						className="font-normal leading-[1.04] text-ink text-[40px] sm:text-[56px] lg:text-[80px] max-w-[920px]"
						style={{ fontFamily: "var(--font-fraunces), serif" }}
					>
						All other books that solve{" "}
						<span
							className="text-flame"
							style={{ fontFamily: "var(--font-dm-serif), serif", fontStyle: "italic" }}
						>
							one specific
						</span>{" "}
						task.
					</h2>
					<p className="mt-6 lg:mt-8 text-coffee text-base lg:text-lg max-w-[560px] leading-relaxed">
						A personal map of literature on focus, habits and self-work — no fluff, no repeats, in one list.
					</p>
				</div>

				{/* Filter */}
				<div className="sticky top-0 z-10 flex flex-wrap gap-2 mb-12 lg:mb-16 bg-parchment/85 backdrop-blur-sm py-3 -my-3">
					{tags.map((tag) => (
						<button
							key={tag}
							onClick={() => setActiveTag(tag)}
							className={`px-4 py-2 rounded-full text-sm transition-colors cursor-pointer ${
								activeTag === tag
									? "bg-ink text-parchment"
									: "bg-papyrus text-coffee hover:bg-amber-warm hover:text-ink"
							}`}
						>
							{tag}
						</button>
					))}
				</div>

				{/* List */}
				<ul className="border-t border-coffee/15">
					{filtered.map((book, idx) => (
						<li
							key={book.title}
							className="group border-b border-coffee/15 py-7 lg:py-9 cursor-pointer"
						>
							<div className="flex gap-5 lg:gap-10 items-start">
								<span
									className="hidden sm:block flex-none w-12 text-coffee text-xl lg:text-2xl pt-1 tabular-nums"
									style={{ fontFamily: "var(--font-fraunces), serif" }}
								>
									{String(idx + 1).padStart(2, "0")}
								</span>

								<Cover book={book} idx={idx} />

								<div className="flex-1 min-w-0 pt-1">
									<h3
										className="text-[22px] sm:text-[26px] lg:text-[30px] leading-[1.15] text-ink mb-2 group-hover:text-flame transition-colors"
										style={{ fontFamily: "var(--font-fraunces), serif" }}
									>
										{book.title}
									</h3>
									<p className="text-coffee italic mb-4 text-[15px] lg:text-base">
										{book.author}
									</p>
									<p className="text-ink/80 text-[15px] lg:text-[16px] leading-[1.6] mb-4 max-w-[640px]">
										{book.description}
									</p>
									<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] lg:text-xs uppercase tracking-[0.18em] text-coffee">
										<span>{book.tag}</span>
										<span className="text-coffee/40">·</span>
										<span>{book.year}</span>
										<span className="text-coffee/40">·</span>
										<span>{book.pages} pp</span>
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>

				{filtered.length === 0 && (
					<p className="text-coffee text-center py-20 italic">No books in this category yet.</p>
				)}
			</div>
		</section>
	);
}
