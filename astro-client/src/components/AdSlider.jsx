import { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Chip, Skeleton } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../stores/ThemeContext';
import { adsApi } from '../lib/api';

const AdSlider = () => {
  const { isDark } = useThemeContext();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await adsApi.getAll();
        setAds(response.data);
      } catch (err) {
        console.error('Failed to fetch ads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    autoPlayRef.current = () => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    };
  }, [ads.length]);

  useEffect(() => {
    const play = () => {
      autoPlayRef.current?.();
    };

    const interval = setInterval(play, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: 200, position: 'relative', overflow: 'hidden' }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentIndex];

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 150, sm: 250, md: 300 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Box
            component="a"
            href={currentAd.redirectLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => adsApi.click(currentAd._id)}
            sx={{
              display: 'block',
              width: '100%',
              height: '100%',
              position: 'relative',
              textDecoration: 'none',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${currentAd.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 2, sm: 4, md: 5 },
              }}
            >
              <Chip
                label="SPONSORED"
                size="small"
                icon={<OpenInNew sx={{ fontSize: 14 }} />}
                sx={{
                  mb: 2,
                  bgcolor: isDark ? 'rgba(168, 85, 247, 0.9)' : 'rgba(13, 148, 136, 0.9)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  mb: 1,
                  fontFamily: 'Poppins',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {currentAd.title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: 2,
                  display: { xs: 'none', sm: 'block' },
                  maxWidth: 600,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                {currentAd.description?.substring(0, 150)}
              </Typography>

              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Click to learn more
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          left: { xs: 8, sm: 16 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: { xs: 8, sm: 16 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ChevronRight />
      </IconButton>

      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 16, sm: 24 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        {ads.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: index === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#fff',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AdSlider;
