import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useThemeContext } from '../stores/ThemeContext';
import { serviceCategoryApi } from '../lib/api';

const hexToRgb = (hex) => {
  const c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return c ? `${parseInt(c[1], 16)},${parseInt(c[2], 16)},${parseInt(c[3], 16)}` : '59,130,246';
};

const cardGradientsDark = [
  'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
  'linear-gradient(135deg, #0c0e1a 0%, #1a1b4e 50%, #0c0e1a 100%)',
  'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #1a0a2e 100%)',
  'linear-gradient(135deg, #0d1117 0%, #1f2937 50%, #0d1117 100%)',
  'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
  'linear-gradient(135deg, #10002b 0%, #240046 50%, #10002b 100%)',
  'linear-gradient(135deg, #0b0f19 0%, #1a2744 50%, #0b0f19 100%)',
  'linear-gradient(135deg, #0e0b1a 0%, #2d1b4e 50%, #0e0b1a 100%)',
];

const cardGradientsLight = [
  'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #eef2ff 100%)',
  'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f5f3ff 100%)',
  'linear-gradient(135deg, #ecfeff 0%, #ccfbf1 50%, #ecfeff 100%)',
  'linear-gradient(135deg, #fff1f2 0%, #fecdd3 50%, #fff1f2 100%)',
  'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #faf5ff 100%)',
  'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 50%, #f0f9ff 100%)',
  'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fdf2f8 100%)',
  'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 50%, #f0fdf4 100%)',
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: 2 + Math.random() * 3,
  left: Math.random() * 100,
  top: 10 + Math.random() * 80,
  delay: Math.random() * 4,
  duration: 3 + Math.random() * 4,
  drift: -20 + Math.random() * 40,
}));

const CategoryCard = ({ category, index, primaryRgb, isDark }) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const grad = isDark
    ? cardGradientsDark[index % cardGradientsDark.length]
    : cardGradientsLight[index % cardGradientsLight.length];

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -16, y: (x - 0.5) * 16 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <Link to={`/services/category/${category.value}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
      <Box
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: { xs: 0.5, sm: 1 },
          p: { xs: 1, sm: 2 }, borderRadius: 3,
          background: grad,
          border: '1px solid', borderColor: `rgba(${primaryRgb},${isHovered ? 0.7 : 0.25})`,
          width: { xs: 100, sm: 150 }, height: { xs: 110, sm: 190 }, userSelect: 'none',
          position: 'relative', overflow: 'hidden',
          transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.04 : 1})`,
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
          boxShadow: isHovered
            ? `0 12px 40px rgba(${primaryRgb},0.25), 0 0 60px rgba(${primaryRgb},0.1)`
            : `0 4px 12px rgba(${primaryRgb},0.06)`,
          '&::before': {
            content: '""', position: 'absolute', inset: 0, borderRadius: 3, pointerEvents: 'none',
            background: isHovered
              ? `linear-gradient(135deg, rgba(${primaryRgb},0.15) 0%, transparent 50%, rgba(${primaryRgb},0.08) 100%)`
              : 'none',
            transition: 'background 0.3s ease',
          },

        }}>
        <Box sx={{
          width: { xs: 50, sm: 110 }, height: { xs: 50, sm: 110 }, borderRadius: '50%', overflow: 'hidden',
          border: '2px solid', borderColor: `rgba(${primaryRgb},0.4)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(4px)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          boxShadow: isHovered ? `0 0 20px rgba(${primaryRgb},0.3)` : 'none',
        }}>
          <Box component="img" src={category.icon} alt={category.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
          {!category.icon && (
            <Typography variant="h4" sx={{ color: isDark ? 'rgba(255,255,255,0.8)' : `rgba(${primaryRgb},0.8)`, fontWeight: 700, fontSize: { xs: '1.25rem', sm: '2rem' } }}>
              {category.name.charAt(0).toUpperCase()}
            </Typography>
          )}
        </Box>
        <Typography variant="body2" sx={{
          fontWeight: 600, textAlign: 'center',
          color: isDark ? 'rgba(255,255,255,0.9)' : `rgba(${primaryRgb},0.85)`,
          lineHeight: 1.2, maxWidth: { xs: 90, sm: 120 }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          textShadow: isDark ? `0 0 8px rgba(${primaryRgb},0.3)` : 'none',
          fontSize: { xs: '0.7rem', sm: '0.875rem' },
        }}>
          {category.name}
        </Typography>
      </Box>
    </Link>
  );
};

const LaserLines = ({ primaryRgb, isDark, containerWidth, scrollPos }) => {
  const w = containerWidth || 1400;
  const h = 120;
  const yOffsets = [28, 55, 85];
  const amplitudes = [14, 10, 16];
  const periods = [180, 140, 220];
  const delays = [0, 0.8, 1.6];

  const buildPath = (amp, period, yBase) => {
    let d = `M 0 ${yBase}`;
    for (let x = 0; x <= w; x += 20) {
      const y = yBase + Math.sin((x / period) * Math.PI * 2) * amp;
      d += ` L ${x} ${y}`;
    }
    return d;
  };

  const op = isDark ? 1 : 0.5;

  const colors = useMemo(() => ([
    { base: `rgba(${primaryRgb},${0.03 * op})`, glow: `rgba(${primaryRgb},${0.12 * op})`, trail: `rgba(${primaryRgb},${0.08 * op})` },
    { base: `rgba(${primaryRgb},${0.02 * op})`, glow: `rgba(${primaryRgb},${0.10 * op})`, trail: `rgba(${primaryRgb},${0.06 * op})` },
    { base: `rgba(${primaryRgb},${0.02 * op})`, glow: `rgba(${primaryRgb},${0.08 * op})`, trail: `rgba(${primaryRgb},${0.05 * op})` },
  ]), [primaryRgb, op]);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
      style={{ position: 'absolute', top: -10, left: 0, width: '100%', height: h, pointerEvents: 'none' }}
    >
      <defs>
        <filter id="lg">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lgs">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="tg0" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={`rgb(${primaryRgb})`} stopOpacity="0" />
          <stop offset="60%" stopColor={`rgb(${primaryRgb})`} stopOpacity="0" />
          <stop offset="85%" stopColor={`rgb(${primaryRgb})`} stopOpacity={`${0.5 * op}`} />
          <stop offset="93%" stopColor={`rgb(${primaryRgb})`} stopOpacity={`${0.9 * op}`} />
          <stop offset="100%" stopColor={`rgb(${primaryRgb})`} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tg1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={`rgb(${primaryRgb})`} stopOpacity="0" />
          <stop offset="60%" stopColor={`rgb(${primaryRgb})`} stopOpacity="0" />
          <stop offset="85%" stopColor={`rgb(${primaryRgb})`} stopOpacity={`${0.4 * op}`} />
          <stop offset="93%" stopColor={`rgb(${primaryRgb})`} stopOpacity={`${0.8 * op}`} />
          <stop offset="100%" stopColor={`rgb(${primaryRgb})`} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tg2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={`rgb(${primaryRgb})`} stopOpacity="0" />
          <stop offset="60%" stopColor={`rgb(${primaryRgb})`} stopOpacity="0" />
          <stop offset="85%" stopColor={`rgb(${primaryRgb})`} stopOpacity={`${0.3 * op}`} />
          <stop offset="93%" stopColor={`rgb(${primaryRgb})`} stopOpacity={`${0.7 * op}`} />
          <stop offset="100%" stopColor={`rgb(${primaryRgb})`} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 1, 2].map((i) => {
        const path = buildPath(amplitudes[i], periods[i], yOffsets[i]);
        const pulseDur = 4 + i;
        return (
          <g key={i}>
            <path d={path} fill="none" stroke={colors[i].base} strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round"
            />
            <path d={path} fill="none" stroke={colors[i].glow} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ filter: 'url(#lgs)', animation: `gp ${3 + i}s ease-in-out infinite` }}
            />
            <path d={path} fill="none" stroke={`rgba(${primaryRgb},${1 * op})`} strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="60 700"
              style={{ filter: 'url(#lg)', animation: `lp${i + 1} ${pulseDur}s linear infinite`, animationDelay: `${delays[i]}s` }}
            />
            <path d={path} fill="none" stroke={`rgba(${primaryRgb},${0.5 * op})`} strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="30 700"
              style={{ filter: 'url(#lgs)', animation: `lp${i + 1} ${pulseDur}s linear infinite`, animationDelay: `${delays[i]}s` }}
            />
            <path d={path} fill="none" stroke={`url(#tg${i})`} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="100 900"
              style={{ filter: 'url(#lg)', animation: `lp${i + 1} ${pulseDur}s linear infinite`, animationDelay: `${delays[i]}s` }}
            />
          </g>
        );
      })}
    </svg>
  );
};

const InjectStyles = ({ primaryRgb }) => {
  const keyframesCss = useMemo(() => `
    @keyframes lp1 { 0% { stroke-dashoffset: 1200; } 100% { stroke-dashoffset: 0; } }
    @keyframes lp2 { 0% { stroke-dashoffset: 1200; } 100% { stroke-dashoffset: 0; } }
    @keyframes lp3 { 0% { stroke-dashoffset: 1200; } 100% { stroke-dashoffset: 0; } }
    @keyframes gp { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
    @keyframes fp {
      0% { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
      15% { opacity: 0.8; transform: translateY(-10px) translateX(5px) scale(1); }
      85% { opacity: 0.4; }
      100% { transform: translateY(-90px) translateX(25px) scale(0); opacity: 0; }
    }
    .cs-scroll { scrollbar-width: none; -ms-overflow-style: none; }
    .cs-scroll::-webkit-scrollbar { display: none; }
  `, []);

  return <style>{keyframesCss}</style>;
};

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1400);
  const [isHoveringScroll, setIsHoveringScroll] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [mouseInArea, setMouseInArea] = useState(false);
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const autoScrollRef = useRef(null);
  const { isDark } = useThemeContext();
  const theme = useTheme();
  const primaryRgb = useMemo(() => hexToRgb(theme.palette.primary.main), [theme.palette.primary.main]);

  useEffect(() => {
    serviceCategoryApi.getAll().then(r => setCategories(r.data)).catch(e => console.error(e)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    const onResize = () => { if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || categories.length === 0) return;
    const step = () => {
      if (!isHoveringScroll && !isDragging.current) {
        el.scrollLeft += 0.8;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 20) {
          el.scrollLeft = 0;
        }
      }
      autoScrollRef.current = requestAnimationFrame(step);
    };
    autoScrollRef.current = requestAnimationFrame(step);
    return () => { if (autoScrollRef.current) cancelAnimationFrame(autoScrollRef.current); };
  }, [isHoveringScroll, categories.length]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) setScrollPos(scrollRef.current.scrollLeft);
  }, []);

  const handleMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5;
  };

  const handleContainerMouse = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const trailOpacity = Math.min(scrollPos / 250, 0.5);
  const themeBg = isDark ? '#0a0a1a' : '#f4f6ff';

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4, mb: 2 }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 }, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {[...Array(6)].map((_, i) => (
              <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 1.5, width: 150, height: 190 }}>
                <Skeleton variant="circular" width={110} height={110} />
                <Skeleton variant="text" width={80} height={16} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  if (categories.length === 0) return null;

  const noScrollYet = scrollPos < 15;

  return (
    <>
      <InjectStyles primaryRgb={primaryRgb} />

      <Box sx={{ width: '100%', mt: 4, mb: 2 }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'left', sm: 'center' }, mb: 2.5, position: 'relative' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Poppins', textAlign: { xs: 'left', sm: 'center' } }}>Categories
            </Typography>
            <Link to="/service-categories" style={{ textDecoration: 'none', position: 'absolute', right: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                View All <ArrowForward sx={{ fontSize: 16 }} />
              </Typography>
            </Link>
          </Box>
        </Box>

        <Box ref={containerRef}
          onMouseMove={handleContainerMouse}
          onMouseEnter={() => setMouseInArea(true)}
          onMouseLeave={() => { setMouseInArea(false); setMousePos({ x: -999, y: -999 }); }}
          sx={{
            width: '100%',
            borderTop: '1px solid', borderBottom: '1px solid',
            borderColor: isDark ? `rgba(${primaryRgb},0.15)` : `rgba(${primaryRgb},0.1)`,
            bgcolor: themeBg,
            py: 3, position: 'relative', overflow: 'hidden',
          }}>
          <LaserLines primaryRgb={primaryRgb} isDark={isDark} containerWidth={containerWidth} scrollPos={scrollPos} />

          <Box sx={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: mouseInArea
              ? `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, rgba(${primaryRgb},${isDark ? 0.06 : 0.03}) 0%, transparent 70%)`
              : 'none',
            transition: 'background 0.05s ease',
          }}
          />

          <Box sx={{
            position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 2,
            width: noScrollYet ? 0 : Math.min(scrollPos + 80, 350),
            background: `linear-gradient(to right,
              rgba(${primaryRgb},${trailOpacity * 0.5}) 0%,
              rgba(${primaryRgb},${trailOpacity * 0.2}) 40%,
              rgba(${primaryRgb},${trailOpacity * 0.05}) 70%,
              transparent 100%
            )`,
            transition: 'width 0.1s ease',
            pointerEvents: 'none',
          }} />

          <Box sx={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 60, zIndex: 2,
            background: `linear-gradient(to left, ${themeBg}, transparent)`,
            pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 40, zIndex: 2,
            background: `linear-gradient(to right, ${themeBg}, transparent)`,
            pointerEvents: 'none',
          }} />

          {particles.map((p) => (
            <Box key={p.id} sx={{
              position: 'absolute', zIndex: 1,
              width: p.size, height: p.size, borderRadius: '50%',
              bgcolor: `rgba(${primaryRgb},${isDark ? 0.6 : 0.3})`,
              left: `${p.left}%`, top: `${p.top}%`,
              animation: `fp ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              boxShadow: isDark ? `0 0 4px rgba(${primaryRgb},0.5)` : 'none',
            }} />
          ))}

          <Box sx={{
            overflow: 'hidden', px: { xs: 2, sm: 3 },
            position: 'relative', zIndex: 3,
          }}>
            <Box ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onScroll={handleScroll}
              onMouseEnter={() => setIsHoveringScroll(true)}
              onMouseLeave={() => {
                handleMouseUp();
                setIsHoveringScroll(false);
              }}
              className="cs-scroll"
              sx={{
                display: 'flex', gap: 2.5, overflowX: 'auto', cursor: 'grab',
                scrollBehavior: 'auto', py: 1,
              }}>
              {categories.map((cat, i) => (
                <CategoryCard key={cat._id} category={cat} index={i} primaryRgb={primaryRgb} isDark={isDark} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default CategorySlider;
