import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Chip, Skeleton } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import OpenInNew from '@mui/icons-material/OpenInNew';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../stores/ThemeContext';
import { useLanguage } from '../stores/LanguageContext';
import { sliderApi } from '../lib/api';
const BlogSlider = () => {
  const { isDark } = useThemeContext();
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const response = await sliderApi.get();
        setItems(response.data.items || []);
      } catch (err) {
        console.error('Failed to fetch slider:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlider();
  }, []);

  useEffect(() => {
    autoPlayRef.current = () => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    };
  }, [items.length]);

  useEffect(() => {
    const play = () => { autoPlayRef.current?.(); };
    const interval = setInterval(play, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 1000 : -1000, opacity: 0 }),
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: 400, position: 'relative', overflow: 'hidden' }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    );
  }

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];
  const isBlog = currentItem.type === 'blog';
  const isService = currentItem.type === 'service';
  const isCustom = currentItem.type === 'custom';
  const hasLink = isBlog || isService || (isCustom && currentItem.redirectLink);
  const hasTitle = !!currentItem.title;
  const hasDescription = !!currentItem.description;

  const renderLink = (content) => {
    if (isBlog && currentItem.slug) {
      return <Link to={`/blog/${currentItem.slug}`} style={{ textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}>{content}</Link>;
    }
    if (isService && currentItem.slug) {
      return <Link to={`/service/${currentItem.slug}`} style={{ textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}>{content}</Link>;
    }
    if (isCustom && currentItem.redirectLink) {
      return <a href={currentItem.redirectLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}>{content}</a>;
    }
    return content;
  };

  return (
    <Box
      sx={{
        width: { xs: 'calc(100% + 16px)', sm: '100%' },
        height: { xs: 240, sm: 380, md: 630 },
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: 0, md: 2 },
        mx: { xs: -2, sm: 0 },
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
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {renderLink(
            <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: `url(${currentItem.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.5s ease',
                  '&:hover': { transform: 'scale(1.02)' },
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: hasTitle || hasDescription
                    ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)'
                    : 'rgba(0,0,0,0.1)',
                }}
              />

              {(hasTitle || hasDescription) && (
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: { xs: 1.5, sm: 4, md: 5 } }}>
                  {(currentItem.category || (isCustom && currentItem.redirectLink)) && (
                    <Chip
                      label={
                        isCustom && currentItem.redirectLink ? 'PROMOTED'
                        : isService ? (currentItem.category || 'SERVICE').toUpperCase()
                        : (currentItem.category || 'BLOG').toUpperCase()
                      }
                      size="small"
                      sx={{
                        mb: { xs: 0.5, sm: 2 },
                        bgcolor: isDark ? 'rgba(168, 85, 247, 0.9)' : 'rgba(13, 148, 136, 0.9)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        height: { xs: 20, sm: 24 },
                      }}
                    />
                  )}

                  {hasTitle && (
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#fff',
                        mb: 0.5,
                        fontFamily: 'Poppins',
                        fontSize: { xs: '1rem', sm: '1.75rem', md: '2.5rem' },
                        lineHeight: 1.2,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        display: '-webkit-box',
                        WebkitLineClamp: { xs: 2, sm: 3 },
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {currentItem.title}
                    </Typography>
                  )}

                  {hasDescription && (
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        mb: { xs: 0, sm: 2 },
                        display: { xs: 'none', sm: 'block' },
                        maxWidth: 600,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                        fontSize: { xs: '0.8rem', sm: '1rem' },
                      }}
                    >
                      {currentItem.description.substring(0, 150)}
                    </Typography>
                  )}

                  {isCustom && currentItem.redirectLink && (
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                      <OpenInNew sx={{ fontSize: 14 }} />
                      <span>Learn More</span>
                    </Box>
                  )}

                  {isBlog && currentItem.createdAt && (
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: { xs: 'none', sm: 'inline' } }}>
                      {new Date(currentItem.createdAt).toLocaleDateString()} • {currentItem.views || 0} {t('views')}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </motion.div>
      </AnimatePresence>

      <IconButton
        onClick={handlePrev}
        size="small"
        sx={{
          position: 'absolute',
          left: { xs: 4, sm: 16 },
          top: { xs: 'auto', sm: '50%' },
          bottom: { xs: 8, sm: 'auto' },
          transform: { xs: 'none', sm: 'translateY(-50%)' },
          bgcolor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          p: { xs: 0.5, sm: 1 },
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ChevronLeft sx={{ fontSize: { xs: 20, sm: 28 } }} />
      </IconButton>

      <IconButton
        onClick={handleNext}
        size="small"
        sx={{
          position: 'absolute',
          right: { xs: 4, sm: 16 },
          top: { xs: 'auto', sm: '50%' },
          bottom: { xs: 8, sm: 'auto' },
          transform: { xs: 'none', sm: 'translateY(-50%)' },
          bgcolor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          p: { xs: 0.5, sm: 1 },
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <ChevronRight sx={{ fontSize: { xs: 20, sm: 28 } }} />
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
        {items.map((_, index) => (
          <Box
            key={index}
            onClick={() => { setDirection(index > currentIndex ? 1 : -1); setCurrentIndex(index); }}
            sx={{
              width: index === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': { bgcolor: '#fff' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default BlogSlider;
