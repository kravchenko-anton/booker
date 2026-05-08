'use client'
import React, { useEffect, useRef, useState, memo, useMemo } from 'react'
import myData from '@/public/allbooks.json';
import { BookCard, type Book } from '@/components/carousel';

export type Project = {
	image: string
	title: string
	author: string
	year: number
	categories: string[]
	goodreads_url: string
}

const CELL_W = 300
const CELL_H = 300
const GRID_GAP = 20
const MACRO_GAP = 3500

const LERP = 0.5
const INERTIA_DECAY = 0.92
const ZOOM_LERP = 0.5

const MIN_ZOOM = 0.05
const MAX_ZOOM = 1.2
const LOD_THRESHOLD = 0.2
const GALAXY_STYLES: Record<string, { badge: string; border: string; glow: string; hexBg: string }> = {
	psychology: {
		badge: "bg-violet-600 text-white",
		border: "border-violet-500",
		glow: "shadow-[0_0_250px_rgba(139,92,246,0.8)]",
		hexBg: "bg-violet-200"
	},
	neuroscience: {
		badge: "bg-fuchsia-600 text-white",
		border: "border-fuchsia-500",
		glow: "shadow-[0_0_250px_rgba(217,70,239,0.8)]",
		hexBg: "bg-fuchsia-200"
	},
	"human-behavior": {
		badge: "bg-indigo-600 text-white",
		border: "border-indigo-500",
		glow: "shadow-[0_0_250px_rgba(79,70,229,0.8)]",
		hexBg: "bg-indigo-200"
	},
	
	// --- Сине-голубой спектр (Логика и Технологии) ---
	philosophy: {
		badge: "bg-blue-600 text-white",
		border: "border-blue-500",
		glow: "shadow-[0_0_250px_rgba(37,99,235,0.8)]",
		hexBg: "bg-blue-200"
	},
	"math-physics": {
		badge: "bg-cyan-600 text-white",
		border: "border-cyan-500",
		glow: "shadow-[0_0_250px_rgba(8,145,178,0.8)]",
		hexBg: "bg-cyan-200"
	},
	technology: {
		badge: "bg-sky-500 text-white",
		border: "border-sky-400",
		glow: "shadow-[0_0_250px_rgba(14,165,233,0.8)]",
		hexBg: "bg-sky-200"
	},
	
	// --- Зелено-изумрудный спектр (Жизнь) ---
	biology: {
		badge: "bg-emerald-600 text-white",
		border: "border-emerald-500",
		glow: "shadow-[0_0_250px_rgba(5,150,105,0.8)]",
		hexBg: "bg-emerald-200"
	},
	health: {
		badge: "bg-green-500 text-white",
		border: "border-green-400",
		glow: "shadow-[0_0_250px_rgba(34,197,94,0.8)]",
		hexBg: "bg-green-200"
	},
	
	// --- Желто-оранжевый спектр (История и Развитие) ---
	history: {
		badge: "bg-amber-500 text-ink",
		border: "border-amber-400",
		glow: "shadow-[0_0_250px_rgba(245,158,11,0.8)]",
		hexBg: "bg-amber-200"
	},
	evolution: {
		badge: "bg-orange-500 text-white",
		border: "border-orange-400",
		glow: "shadow-[0_0_250px_rgba(249,115,22,0.8)]",
		hexBg: "bg-orange-200"
	},
	biography: {
		badge: "bg-yellow-400 text-ink",
		border: "border-yellow-300",
		glow: "shadow-[0_0_250px_rgba(250,204,21,0.8)]",
		hexBg: "bg-yellow-100"
	},
	
	// --- Красно-розовый спектр (Социум и Политика) ---
	politics: {
		badge: "bg-red-600 text-white",
		border: "border-red-500",
		glow: "shadow-[0_0_250px_rgba(220,38,38,0.8)]",
		hexBg: "bg-red-200"
	},
	productivity: {
		badge: "bg-rose-500 text-white",
		border: "border-rose-400",
		glow: "shadow-[0_0_250px_rgba(244,63,94,0.8)]",
		hexBg: "bg-rose-200"
	},
	sociology: {
		badge: "bg-slate-600 text-white",
		border: "border-slate-500",
		glow: "shadow-[0_0_200px_rgba(71,85,105,0.6)]",
		hexBg: "bg-slate-200"
	},
	
	// --- Яркие акценты (Бизнес) ---
	economy: {
		badge: "bg-lime-600 text-white",
		border: "border-lime-500",
		glow: "shadow-[0_0_250px_rgba(101,163,13,0.8)]",
		hexBg: "bg-lime-200"
	},
	finances: {
		badge: "bg-teal-600 text-white",
		border: "border-teal-500",
		glow: "shadow-[0_0_250px_rgba(13,148,136,0.8)]",
		hexBg: "bg-teal-200"
	},
	business: {
		badge: "bg-pink-600 text-white",
		border: "border-pink-500",
		glow: "shadow-[0_0_250px_rgba(219,39,119,0.8)]",
		hexBg: "bg-pink-200"
	},
	marketing: {
		badge: "bg-purple-600 text-white",
		border: "border-purple-500",
		glow: "shadow-[0_0_250px_rgba(147,51,234,0.8)]",
		hexBg: "bg-purple-200"
	},
	default: {
		badge: "bg-gray-400 text-white",
		border: "border-gray-300",
		glow: "shadow-[0_0_150px_rgba(156,163,175,0.4)]",
		hexBg: "bg-gray-200"
	}
}

type PlacedProject = { id: string; x: number; y: number; project: Project; mainCategory: string; }
type PlacedCategory = { id: string; x: number; y: number; name: string; count: number; }

function clamp(v: number, lo: number, hi: number) {
	return Math.max(lo, Math.min(hi, v))
}

function seededRandom(seed: number) {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

function InfiniteCanvas() {
	const projects = myData as Project[]
	
	const { booksMap, categoriesMap, worldBounds } = useMemo(() => {
		const placedBooks: PlacedProject[] = [];
		const placedCategories: PlacedCategory[] = [];
		
		const clusters: Record<string, Project[]> = {};
		projects.forEach(p => {
			const cat = p.categories?.[0] || 'other';
			if (!clusters[cat]) clusters[cat] = [];
			clusters[cat].push(p);
		});
		
		const categoryNames = Object.keys(clusters);
		
		let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
		const GOLDEN_ANGLE = 2.39996;
		
		categoryNames.forEach((cat, catIdx) => {
			const noiseAngle = seededRandom(catIdx * 10) * 0.5 - 0.25;
			const noiseRadius = seededRandom(catIdx * 20) * 1500;
			const radius = Math.sqrt(catIdx) * MACRO_GAP + noiseRadius;
			const angle = catIdx * GOLDEN_ANGLE + noiseAngle;
			
			const clusterCX = Math.cos(angle) * radius;
			const clusterCY = Math.sin(angle) * radius;
			
			const books = clusters[cat];
			placedCategories.push({ id: cat, x: clusterCX, y: clusterCY, name: cat, count: books.length });
			
			const cols = Math.ceil(Math.sqrt(books.length));
			const rows = Math.ceil(books.length / cols);
			const startX = clusterCX - ((cols - 1) * (CELL_W + GRID_GAP)) / 2;
			const startY = clusterCY - ((rows - 1) * (CELL_H + GRID_GAP)) / 2;
			
			books.forEach((proj, projIdx) => {
				const r = Math.floor(projIdx / cols);
				const c = projIdx % cols;
				const bx = startX + c * (CELL_W + GRID_GAP);
				const by = startY + r * (CELL_H + GRID_GAP);
				
				placedBooks.push({
					id: `${cat}-${projIdx}`,
					x: bx,
					y: by,
					project: proj,
					mainCategory: cat
				});
				
				minX = Math.min(minX, bx);
				maxX = Math.max(maxX, bx);
				minY = Math.min(minY, by);
				maxY = Math.max(maxY, by);
			});
		});
		
		const padding = 3000;
		return {
			booksMap: placedBooks,
			categoriesMap: placedCategories,
			worldBounds: { minX: minX - padding, maxX: maxX + padding, minY: minY - padding, maxY: maxY + padding }
		};
	}, [projects]);
	
	const hostRef = useRef<HTMLDivElement>(null)
	const layerRef = useRef<HTMLDivElement>(null)
	
	const [isZoomedOut, setIsZoomedOut] = useState(true)
	const isZoomedOutRef = useRef(true)
	
	const target = useRef({ x: 0, y: 0, scale: MIN_ZOOM })
	const display = useRef({ x: 0, y: 0, scale: MIN_ZOOM })
	const velocity = useRef({ x: 0, y: 0 })
	const dragging = useRef(false)
	const initialized = useRef(false)
	
	const isAutoZooming = useRef(false)
	const ensureRef = useRef<() => void>(() => {})
	const isDraggingThresholdMet = useRef(false)
	const pointerDownPos = useRef({ x: 0, y: 0 })
	
	const [visibleCells, setVisibleCells] = useState<PlacedProject[]>([])
	
	const zoomToCategory = (cx: number, cy: number) => {
		if (!hostRef.current) return;
		const w = hostRef.current.clientWidth / 2;
		const h = hostRef.current.clientHeight / 2;
		const targetScale = 0.8;
		
		target.current = {
			x: w - cx * targetScale,
			y: h - cy * targetScale,
			scale: targetScale
		};
		isAutoZooming.current = true;
		ensureRef.current();
	}
	
	const zoomOut = () => {
		if (!hostRef.current) return;
		const w = hostRef.current.clientWidth / 2;
		const h = hostRef.current.clientHeight / 2;
		target.current = { x: w, y: h, scale: MIN_ZOOM };
		isAutoZooming.current = true;
		ensureRef.current();
	}
	
	useEffect(() => {
		const host = hostRef.current!
		const layer = layerRef.current!
		let raf = 0
		let lastPx = 0, lastPy = 0, lastPt = 0
		
		if (!initialized.current) {
			const w = host.clientWidth / 2;
			const h = host.clientHeight / 2;
			target.current = { x: w, y: h, scale: MIN_ZOOM };
			display.current = { x: w, y: h, scale: MIN_ZOOM };
			initialized.current = true;
		}
		
		const computeVisible = () => {
			if (isZoomedOutRef.current) {
				if (visibleCells.length > 0) setVisibleCells([]);
				return;
			}
			
			const w = host.clientWidth
			const h = host.clientHeight
			const { x, y, scale } = display.current
			
			const screenMinX = (-x - w) / scale;
			const screenMaxX = (-x + w * 2) / scale;
			const screenMinY = (-y - h) / scale;
			const screenMaxY = (-y + h * 2) / scale;
			
			const cells = booksMap.filter(p =>
				p.x >= screenMinX && p.x <= screenMaxX &&
				p.y >= screenMinY && p.y <= screenMaxY
			);
			setVisibleCells(cells)
		}
		
		const applyTransform = () => {
			const dx0 = display.current.x
			const dy0 = display.current.y
			const scl = display.current.scale
			
			layer.style.transform = `translate3d(${dx0}px, ${dy0}px, 0) scale(${scl})`
			
			const zoomedOut = scl < LOD_THRESHOLD;
			if (zoomedOut !== isZoomedOutRef.current) {
				isZoomedOutRef.current = zoomedOut;
				setIsZoomedOut(zoomedOut);
			}
			
			const children = layer.children
			for (let i = 0; i < children.length; i++) {
				const cell = children[i] as HTMLElement
				if (!cell.dataset.x) continue;
				
				const cx = +cell.dataset.x!
				const cy = +cell.dataset.y!
				cell.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
				cell.style.opacity = '1'
			}
		}
		
		const constrainTarget = () => {
			const w = host.clientWidth / 2;
			const h = host.clientHeight / 2;
			const s = target.current.scale;
			
			const limitMinX = w - worldBounds.maxX * s;
			const limitMaxX = w - worldBounds.minX * s;
			const limitMinY = h - worldBounds.maxY * s;
			const limitMaxY = h - worldBounds.minY * s;
			
			target.current.x = clamp(target.current.x, limitMinX, limitMaxX);
			target.current.y = clamp(target.current.y, limitMinY, limitMaxY);
		}
		
		const ensure = () => { if (!raf) raf = requestAnimationFrame(tick) }
		ensureRef.current = ensure;
		
		const tick = () => {
			raf = 0
			if (!dragging.current) {
				target.current.x += velocity.current.x
				target.current.y += velocity.current.y
				velocity.current.x *= INERTIA_DECAY
				velocity.current.y *= INERTIA_DECAY
			}
			
			const ldx = target.current.x - display.current.x
			const ldy = target.current.y - display.current.y
			const lds = target.current.scale - display.current.scale
			
			let currentLerp = LERP;
			let currentZoomLerp = ZOOM_LERP;
			if (isAutoZooming.current) {
				currentLerp = 0.03;
				currentZoomLerp = 0.03;
				if (Math.abs(ldx) < 5 && Math.abs(ldy) < 5 && Math.abs(lds) < 0.005) {
					isAutoZooming.current = false;
				}
			}
			
			display.current.x += ldx * currentLerp
			display.current.y += ldy * currentLerp
			display.current.scale += lds * currentZoomLerp
			
			if (Math.abs(ldx) < 0.05) display.current.x = target.current.x
			if (Math.abs(ldy) < 0.05) display.current.y = target.current.y
			if (Math.abs(lds) < 0.001) display.current.scale = target.current.scale
			
			const moving =
				dragging.current ||
				Math.abs(velocity.current.x) > 0.05 ||
				Math.abs(velocity.current.y) > 0.05 ||
				Math.abs(ldx) > 0.5 || Math.abs(ldy) > 0.5 || Math.abs(lds) > 0.005
			
			if (!moving && !dragging.current) {
				velocity.current.x = 0; velocity.current.y = 0
			}
			
			applyTransform()
			computeVisible()
			if (moving) ensure()
		}
		
		const onPointerDown = (e: PointerEvent) => {
			dragging.current = true
			isAutoZooming.current = false
			isDraggingThresholdMet.current = false
			pointerDownPos.current = { x: e.clientX, y: e.clientY }
			lastPx = e.clientX
			lastPy = e.clientY
			lastPt = performance.now()
			velocity.current = { x: 0, y: 0 }
			ensure()
		}
		
		const onPointerMove = (e: PointerEvent) => {
			if (!dragging.current) return
			
			if (!isDraggingThresholdMet.current) {
				const dist = Math.hypot(e.clientX - pointerDownPos.current.x, e.clientY - pointerDownPos.current.y);
				if (dist > 5) {
					isDraggingThresholdMet.current = true;
					try { host.setPointerCapture(e.pointerId); } catch(e) {}
				} else {
					return; // wait until threshold met
				}
			}
			
			const now = performance.now()
			const dx = e.clientX - lastPx
			const dy = e.clientY - lastPy
			const dt = Math.max(1, now - lastPt)
			
			target.current.x += dx
			target.current.y += dy
			
			const instX = (dx / dt) * 16
			const instY = (dy / dt) * 16
			velocity.current.x = velocity.current.x * 0.6 + instX * 0.4
			velocity.current.y = velocity.current.y * 0.6 + instY * 0.4
			
			lastPx = e.clientX
			lastPy = e.clientY
			lastPt = now
			
			constrainTarget();
			ensure()
		}
		
		const onPointerUp = (e: PointerEvent) => {
			if (!dragging.current) return
			dragging.current = false
			if (host.hasPointerCapture(e.pointerId)) {
				try { host.releasePointerCapture(e.pointerId); } catch(e) {}
			}
			constrainTarget();
			ensure()
		}
		
		const onClickCapture = (e: MouseEvent) => {
			if (isDraggingThresholdMet.current) {
				e.stopPropagation();
				e.preventDefault();
			}
		}
		
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			isAutoZooming.current = false;
			const zoomSensitivity = 0.002;
			const delta = -e.deltaY * zoomSensitivity;
			
			let newScale = target.current.scale * Math.exp(delta);
			newScale = clamp(newScale, MIN_ZOOM, MAX_ZOOM);
			
			const w = host.clientWidth / 2;
			const h = host.clientHeight / 2;
			
			const scaleRatio = newScale / target.current.scale;
			target.current.x = w - (w - target.current.x) * scaleRatio;
			target.current.y = h - (h - target.current.y) * scaleRatio;
			
			target.current.scale = newScale;
			
			constrainTarget();
			ensure();
		}
		
		const onResize = () => { constrainTarget(); ensure(); }
		
		host.addEventListener('pointerdown', onPointerDown)
		host.addEventListener('pointermove', onPointerMove)
		host.addEventListener('pointerup', onPointerUp)
		host.addEventListener('pointercancel', onPointerUp)
		host.addEventListener('click', onClickCapture, { capture: true })
		host.addEventListener('wheel', onWheel, { passive: false })
		window.addEventListener('resize', onResize)
		
		computeVisible()
		applyTransform()
		ensure()
		
		return () => {
			if (raf) cancelAnimationFrame(raf)
			host.removeEventListener('pointerdown', onPointerDown)
			host.removeEventListener('pointermove', onPointerMove)
			host.removeEventListener('pointerup', onPointerUp)
			host.removeEventListener('pointercancel', onPointerUp)
			host.removeEventListener('click', onClickCapture, { capture: true })
			host.removeEventListener('wheel', onWheel)
			window.removeEventListener('resize', onResize)
		}
	}, [booksMap, categoriesMap, worldBounds])
	
	return (
		<div
			className='bg-parchment'
			ref={hostRef}
			style={{
				position: 'fixed', inset: 0, overflow: 'hidden', cursor: 'grab',
				touchAction: 'none', userSelect: 'none', overscrollBehavior: 'none',
			}}
		>
			<div
				onClick={e => {
					e.preventDefault()
					window.location.href = '/';
				}}
				style={{
					zIndex: 10000
				}}

				className="no-underline bg-papyrus p-4 top-5 left-5 rounded-lg absolute text-inherit cursor-pointer text-3xl leading-none tracking-tight text-ink"
			>
				<span style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600 }}>Best</span>
				<span style={{ fontFamily: 'var(--font-dm-serif), serif', fontStyle: 'italic' }}>lib</span>
			</div>
			<div
				ref={layerRef}
				style={{ position: 'absolute', inset: 0, willChange: 'transform', transformOrigin: '0 0' }}
			>
				{isZoomedOut ? (
					<>
						{categoriesMap.map((cat) => (
							<CategoryHexagon key={cat.id} category={cat} onClick={() => zoomToCategory(cat.x, cat.y)} />
						))}
					</>
				) : (
					visibleCells.map(({ id, x, y, project, mainCategory }) => (
						<ProjectCell key={id} x={x} y={y} project={project} category={mainCategory} link={project.goodreads_url} />
					))
				)}
			</div>
		</div>
	)
}

const CategoryHexagon = memo(function CategoryHexagon({
	                                                      category, onClick
                                                      }: { category: PlacedCategory, onClick: () => void }) {
	const style = GALAXY_STYLES[category.name] || GALAXY_STYLES.default;
	
	return (
		<div
			data-x={category.x}
			data-y={category.y}
			onClick={onClick}
			className={`rounded-full absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-700 hover:scale-105 ${style.hexBg} ${style.glow} border-4 shadow-xl`}
			style={{
				width: 4000,
				height: 4000,
			}}
		>
    <span
	    style={{ fontFamily: "var(--font-fraunces), serif" }}
	    className="text-ink text-[400px] font-bold uppercase tracking-widest text-center px-4">
      {category.name}
    </span>
		</div>
	)
});

const ProjectCell = memo(function ProjectCell({
	                                              x, y, project, category, link
                                              }: { x: number; y: number; project: Project; category: string, link: string }) {
	const style = GALAXY_STYLES[category] || GALAXY_STYLES.default;
	
	return (
		<div
			onClick={(e) => {
				e.stopPropagation();
				window.open(link, '_blank');
			}}
			data-x={x}
			data-y={y}
			style={{ width: CELL_W, height: CELL_H, position: "absolute", willChange: "transform" }}
			className={`bg-papyrus hover:bg-white transition-colors border-2 ${style.border} flex flex-col overflow-hidden cursor-pointer rounded-xl shadow-sm`}
		>
			<div className="flex justify-between items-start px-3.5 pt-3.5">
      <span
	        style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600 }}
	      className={` text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-sm font-bold ${style.badge}`}>
        {category}
      </span>
				<span
					style={{ fontFamily: 'var(--font-dm-serif), serif', fontStyle: 'italic' }}
					className=" text-[12px] text-coffee pt-0.5">
        {project.year}
      </span>
			</div>
			
			<div className="flex-1 flex items-center justify-center p-2">
				<img
					src={project.image}
					width={CELL_W * 0.4}
					height={CELL_H * 0.4}
					alt={project.title}
					className="pointer-events-none object-contain rounded-sm drop-shadow-lg"
				/>
			</div>
			
			<div className="px-3.5 pb-3.5 flex text-center flex-col gap-1">
      <span
	      style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600 }}
	      className="font-serif text-[14px]  tracking-wide text-ink font-bold leading-tight line-clamp-2">
        {project.title}
      </span>
				<span
					style={{ fontFamily: 'var(--font-dm-serif), serif' }}
					className=" text-[12px] text-coffee truncate">
        {project.author}
      </span>
			</div>
		</div>
	);
});

function MobileEditorialView() {
	const projects = myData as Project[];
	
	const categories = useMemo(() => {
		const groups: Record<string, Project[]> = {};
		projects.forEach(p => {
			const cat = p.categories?.[0] || 'other';
			if (!groups[cat]) groups[cat] = [];
			groups[cat].push(p);
		});
		return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
	}, [projects]);

	return (
		<div className="bg-parchment min-h-screen pb-20 font-sans">
			<div className="p-6 sticky top-0 bg-parchment/90 backdrop-blur z-50 border-b border-ink/10 flex justify-between items-center">
				<div onClick={() => window.location.href = '/'} className="cursor-pointer text-2xl leading-none tracking-tight text-ink">
					<span style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600 }}>Best</span>
					<span style={{ fontFamily: 'var(--font-dm-serif), serif', fontStyle: 'italic' }}>lib</span>
				</div>
			</div>

			<div className="p-0 pt-6">
				<div>
					{categories.map(([catName, books]) => {
						return (
							<div key={catName} className="mb-12">
								<div className="flex items-center justify-between mb-5 px-6">
									<h2 className="text-xl font-bold text-ink capitalize" style={{ fontFamily: 'var(--font-fraunces), serif' }}>{catName}</h2>
								</div>
								
								<div className="flex overflow-x-auto gap-4 pb-4 scroll-pl-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] before:shrink-0 before:w-2 after:shrink-0 after:w-2">
									{books.map((book) => (
										<div key={book.title} className="snap-start shrink-0">
											<BookCard book={book as unknown as Book} />
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default function LibraryPage() {
	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	if (isMobile === null) return null; // Avoid hydration mismatch

	return isMobile ? <MobileEditorialView /> : <InfiniteCanvas />;
}

