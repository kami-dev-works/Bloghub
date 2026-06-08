import { Box, Typography, Pagination, Skeleton, Chip } from '@mui/material';
import Campaign from '@mui/icons-material/Campaign';
import OpenInNew from '@mui/icons-material/OpenInNew';
import BlogCard from './BlogCard';
import { useLanguage } from '../stores/LanguageContext';
import { useThemeContext } from '../stores/ThemeContext';
import { useState, useEffect, useCallback } from 'react';
import { adsApi } from '../lib/api';

const AdSlot = ({ ad }) => {
  const { isDark } = useThemeContext();
  const { t } = useLanguage();

  const handleClick = useCallback(() => {
    adsApi.click(ad._id).catch(() => {});
  }, [ad._id]);

  if (!ad) return null;

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <a
        href={ad.redirectLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        style={{ textDecoration: 'none', display: 'block', width: '100%' }}
      >
        <Box
          sx={{
            width: '100%',
            minHeight: 130,
            bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.04)',
            borderRadius: 3,
            border: 1.5,
            borderColor: isDark ? 'rgba(168,85,247,0.25)' : 'rgba(99,102,241,0.2)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: isDark ? 'rgba(168,85,247,0.6)' : 'rgba(99,102,241,0.6)',
              bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.08)',
              boxShadow: isDark
                ? '0 4px 20px rgba(168,85,247,0.15)'
                : '0 4px 20px rgba(99,102,241,0.12)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
            <Chip
              icon={<Campaign sx={{ fontSize: 13 }} />}
              label={t('advertisement')}
              size="small"
              color="secondary"
              variant="filled"
              sx={{
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                backdropFilter: 'blur(4px)',
                bgcolor: isDark ? 'rgba(168,85,247,0.85)' : 'rgba(99,102,241,0.85)',
                color: '#fff',
                height: 24,
                '& .MuiChip-icon': { ml: 0.5 },
              }}
            />
          </Box>

          <Box
            component="img"
            src={ad.image}
            alt={ad.title}
            sx={{
              width: { xs: '100%', sm: 240 },
              height: { xs: 160, sm: 'auto' },
              minHeight: { sm: 130 },
              maxHeight: { sm: 180 },
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />

          <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                mb: 0.75,
                color: isDark ? '#fff' : 'text.primary',
                lineHeight: 1.3,
              }}
            >
              {ad.title}
            </Typography>
            {ad.description && (
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? 'rgba(255,255,255,0.65)' : 'text.secondary',
                  mb: 1,
                  lineHeight: 1.4,
                }}
              >
                {ad.description}
              </Typography>
            )}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                color: isDark ? 'rgba(168,85,247,0.9)' : 'primary.main',
                fontWeight: 600,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                mt: 'auto',
              }}
            >
              {t('learnMore') || 'Learn More'}
              <OpenInNew sx={{ fontSize: 14 }} />
            </Box>
          </Box>
        </Box>
      </a>
    </Box>
  );
};

const BlogList = ({
  blogs = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  onUpdate,
  showPagination = true,
  viewMode = 'list',
}) => {
  const { t } = useLanguage();
  const [ads, setAds] = useState([]);
  
  useEffect(() => {
    adsApi.getAll().then(res => setAds(res.data)).catch(() => {});
  }, []);
  
  const shouldShowPagination = showPagination && totalPages > 1;

  if (loading) {
    if (viewMode === 'grid') {
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: { xs: 1, sm: 2 } }}>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      );
    }
    return (
      <Box>
        {[...Array(6)].map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0, sm: 2 },
              mb: 2,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Skeleton variant="rectangular" width={{ xs: '100%', sm: 200 }} height={{ xs: 160, sm: 150 }} sx={{ borderRadius: 1 }} />
            <Box sx={{ flex: 1, p: { xs: 1.5, sm: 0 } }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (blogs.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {t('noBlogsFound')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('tryAdjusting')}
        </Typography>
      </Box>
    );
  }

  const renderNewsWithAds = () => {
    const items = [];
    const adsInterval = 4;
    let adIndex = 0;

    blogs.forEach((item, index) => {
      items.push(
        <BlogCard
          key={item._id}
          blog={item}
          onUpdate={onUpdate}
          viewMode={viewMode}
        />
      );

      if ((index + 1) % adsInterval === 0 && index < blogs.length - 1) {
        const ad = ads.length > 0 ? ads[adIndex % ads.length] : null;
        if (viewMode === 'grid') {
          items.push(
            <Box key={`ad-${index}`} sx={{ gridColumn: { xs: '1 / -1' } }}>
              <AdSlot ad={ad} />
            </Box>
          );
        } else {
          items.push(<AdSlot key={`ad-${index}`} ad={ad} />);
        }
        adIndex++;
      }
    });

    if (viewMode === 'grid') {
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: { xs: 1, sm: 2 } }}>
          {items}
        </Box>
      );
    }

    return items;
  };

  return (
    <Box>
      {renderNewsWithAds()}

      {shouldShowPagination && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 4 } }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default BlogList;