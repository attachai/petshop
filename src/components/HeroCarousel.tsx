import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PROMOTIONS } from '../promotions';

const AUTO_ADVANCE_MS = 5000;

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
};

const textVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: 'easeOut' },
  }),
};

export const HeroCarousel: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const prev = useCallback(() => {
    goTo((current - 1 + PROMOTIONS.length) % PROMOTIONS.length, -1);
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % PROMOTIONS.length, 1);
  }, [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    progressRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % PROMOTIONS.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPaused, current]);

  const promo = PROMOTIONS[current];

  return (
    <header className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div
        className="relative rounded-[2rem] overflow-hidden bg-slate-900 aspect-[21/9] md:aspect-[21/7]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* â”€â”€ Slides â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={promo.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {/* Background image */}
            <img
              src={promo.image}
              alt={promo.collectionHeading}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Gradient overlay using inline style to avoid purge of dynamic classes */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${promo.overlayColor} 0%, ${promo.overlayColor.replace(/[\d.]+\)$/, '0.4)')} 55%, transparent 100%)`,
              }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 max-w-xl">
              {/* Label + Badge row */}
              <motion.div
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-3 mb-4"
              >
                <span className={`${promo.labelColor} font-bold tracking-widest text-xs uppercase`}>
                  {promo.label}
                </span>
                {promo.badge && (
                  <span className={`${promo.badgeColor} text-white text-[11px] font-bold px-3 py-1 rounded-full`}>
                    {promo.badge}
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                custom={0.08}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-4 leading-normal"
              >
                {promo.title.split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
                ))}
              </motion.h1>

              {/* Description */}
              <motion.p
                custom={0.16}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-white/65 text-sm md:text-base mb-8 leading-relaxed"
              >
                {promo.description}
              </motion.p>

              {/* CTA */}
              <motion.div
                custom={0.22}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <button
                  onClick={() => navigate(`/collection?promo=${promo.id}`)}
                  className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-2 hover:bg-secondary/25 transition-colors group"
                >
                  {promo.ctaText}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Slide number */}
            <div className="absolute bottom-14 right-8 text-white/30 text-xs font-bold tabular-nums select-none">
              {String(current + 1).padStart(2, '0')} / {String(PROMOTIONS.length).padStart(2, '0')}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* â”€â”€ Navigation arrows â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white/15 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white/15 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all text-white"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* â”€â”€ Dot indicators â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {PROMOTIONS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-7 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}: ${p.label}`}
            />
          ))}
        </div>

        {/* â”€â”€ Auto-play progress bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-20">
          {!isPaused && (
            <motion.div
              key={`progress-${current}`}
              className="h-full bg-white/50"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
            />
          )}
        </div>
      </div>
    </header>
  );
};

