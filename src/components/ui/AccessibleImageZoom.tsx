import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, X, RotateCcw, Loader2, ZoomIn, Contrast as ContrastIcon, Hand } from 'lucide-react';

interface AccessibleImageZoomProps {
  src: string;
  alt: string;
  /** Classes extras para o container inline (dimensão/aspecto ficam com o pai) */
  className?: string;
  /** Classes extras para a <img> inline */
  imgClassName?: string;
  /** Badge "Zoom Acessível / Ampliar" — desativável */
  showBadge?: boolean;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const LENS_ZOOM = 2;

/** Normaliza caminhos locais para absoluta a partir da raiz (não quebra em rotas aninhadas) */
export function normalizeImageUrl(src: string): string {
  if (!src) return '/img/logo.png';
  if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) return src;
  const cleaned = src.replace(/^\.?\//, '');
  return `/${cleaned}`;
}

const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));

const PRESETS: { zoom: number; label: string; hint: string }[] = [
  { zoom: 1, label: '1x', hint: 'Ajustar' },
  { zoom: 1.5, label: '1,5x', hint: '' },
  { zoom: 2, label: '2x', hint: 'Rótulo' },
  { zoom: 3, label: '3x', hint: 'Bula' }
];

const ZOOM_STEP = 0.25;

export const AccessibleImageZoom: React.FC<AccessibleImageZoomProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  showBadge = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lensPos, setLensPos] = useState<{ x: number; y: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgErro, setImgErro] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const lastTapTime = useRef(0);

  const displaySrc = imgErro ? normalizeImageUrl('img/logo.png') : normalizeImageUrl(src);

  // Reset ao abrir/fechar/trocar imagem
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setLoading(true);
      setImgErro(false);
    }
  }, [isOpen, src]);

  // Bloqueio de scroll do body enquanto o lightbox está aberto
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const zoomAtCenter = useCallback((delta: number) => {
    setZoom((z) => clampZoom(z + delta));
  }, []);

  // ── Teclado (só quando o lightbox está aberto) ──────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          zoomAtCenter(ZOOM_STEP);
          break;
        case '-':
        case '_':
          e.preventDefault();
          zoomAtCenter(-ZOOM_STEP);
          break;
        case '0':
          e.preventDefault();
          setZoom(1);
          setPan({ x: 0, y: 0 });
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown': {
          e.preventDefault();
          const step = 40;
          setPan((p) => {
            const nx = e.key === 'ArrowLeft' ? p.x + step : e.key === 'ArrowRight' ? p.x - step : p.x;
            const ny = e.key === 'ArrowUp' ? p.y + step : e.key === 'ArrowDown' ? p.y - step : p.y;
            return { x: nx, y: ny };
          });
          break;
        }
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, zoomAtCenter]);

  // ── Mouse handlers da lente inline (desktop) ────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  // ── Pan & Drag (Pointer Events com capture) ─────────────────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, baseX: pan.x, baseY: pan.y };
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setPan({ x: dragState.current.baseX + dx, y: dragState.current.baseY + dy });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    setDragging(false);
    dragState.current = null;
  };

  // Duplo clique/toque: alterna 1.0x <-> 2.5x
  const handleDoubleClick = () => {
    if (zoom > 1.01) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(2.5);
    }
  };

  // Detecta duplo-toque em touchstart via pointerdown duplicado rápido
  const handlePointerClick = (e: React.PointerEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      e.preventDefault();
      handleDoubleClick();
      lastTapTime.current = 0;
    } else {
      lastTapTime.current = now;
    }
  };

  // Scroll do mouse = zoom progressivo
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    zoomAtCenter(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
  };

  // ── Lightbox ────────────────────────────────────────────────────────
  const lightbox = !isOpen ? null : createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex flex-col animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Visualizador em tela cheia — ${alt}`}
    >
      {/* Barra superior de controles */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-black/60 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1 min-w-0">
          <button
            type="button"
            onClick={() => zoomAtCenter(-ZOOM_STEP)}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Diminuir zoom"
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-14 text-center text-xs font-mono font-bold text-white/90" aria-live="polite">
            {zoom.toFixed(1).replace('.', ',')}x
          </span>
          <button
            type="button"
            onClick={() => zoomAtCenter(ZOOM_STEP)}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Aumentar zoom"
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Presets rápidos */}
          <div className="hidden sm:flex items-center gap-1 ml-2 pl-2 border-l border-white/10">
            {PRESETS.map((p) => (
              <button
                key={p.zoom}
                type="button"
                onClick={() => { setZoom(p.zoom); setPan({ x: 0, y: 0 }); }}
                title={p.hint ? `${p.label} — ${p.hint}` : p.label}
                className={`h-8 px-2.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  Math.abs(zoom - p.zoom) < 0.01
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white/10 hover:bg-white/20 text-white/90'
                }`}
              >
                {p.label}{p.hint && <span className="ml-1 opacity-70">{p.hint}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Alto contraste / nitidez */}
          <button
            type="button"
            onClick={() => setHighContrast((v) => !v)}
            aria-pressed={highContrast}
            title="Alto contraste / Nitidez"
            className={`h-9 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              highContrast ? 'bg-amber-400 text-black' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <ContrastIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Contraste</span>
          </button>

          <button
            type="button"
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            aria-label="Resetar zoom"
            title="Resetar zoom (0)"
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar visualizador"
            title="Fechar (Esc)"
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Palco da imagem (pan/drag/duplo-clique/scroll) */}
      <div
        ref={stageRef}
        className="relative flex-1 overflow-hidden flex items-center justify-center touch-none select-none"
        style={{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handlePointerClick}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        {loading && !imgErro && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        )}
        <img
          src={displaySrc}
          alt={alt}
          draggable={false}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setImgErro(true); }}
          className="max-w-full max-h-full object-contain will-change-transform pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragging ? 'none' : 'transform 180ms ease-out',
            filter: highContrast ? 'contrast(170%) brightness(105%)' : undefined,
            transformOrigin: 'center center'
          }}
        />

        {/* Dica de interação */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-[10px] text-white/70 flex items-center gap-1.5 pointer-events-none">
          <Hand className="w-3 h-3" />
          <span>Arraste para mover • Duplo clique amplia • Roda do mouse = zoom • Setas movem • Esc fecha</span>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      {/* ── Imagem inline com lente de aumento (2.0x no cursor) ── */}
      <div
        ref={stageRef}
        className={`relative overflow-hidden ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setLensPos(null)}
        onClick={() => { setIsOpen(true); setLoading(true); }}
        role="button"
        tabIndex={0}
        aria-label={`Ampliar imagem: ${alt}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
            setLoading(true);
          }
        }}
        style={{ cursor: 'zoom-in' }}
      >
        <img
          src={displaySrc}
          alt={alt}
          draggable={false}
          className={`w-full h-full object-contain pointer-events-none ${imgClassName}`}
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            if (el.src.indexOf('logo.png') === -1) el.src = '/img/logo.png';
          }}
        />

        {/* Lente inline — apenas desktop com mouse */}
        {lensPos && (
          <div
            aria-hidden="true"
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("${displaySrc}")`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              transform: `scale(${LENS_ZOOM})`,
              transformOrigin: `${lensPos.x}% ${lensPos.y}%`,
              transition: 'transform 60ms ease-out',
              maskImage: 'linear-gradient(#000, #000)',
              WebkitMaskImage: 'linear-gradient(#000, #000)'
            }}
          />
        )}

        {/* Badge convite ao zoom */}
        {showBadge && (
          <span className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
            <ZoomIn className="w-3 h-3" />
            <span className="hidden sm:inline">Zoom Acessível / Ampliar</span>
          </span>
        )}

        {/* Contagem de fotos (se o pai providenciar via children futuramente) */}
      </div>

      {lightbox}
    </>
  );
};

export default AccessibleImageZoom;
