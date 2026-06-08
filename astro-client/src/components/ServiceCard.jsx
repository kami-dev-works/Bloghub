import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Tooltip } from '@mui/material';
import Star from '@mui/icons-material/Star';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import Visibility from '@mui/icons-material/Visibility';
import Favorite from '@mui/icons-material/Favorite';
import { motion } from 'framer-motion';
import { useThemeContext } from '../stores/ThemeContext';
import { serviceApi } from '../lib/api';
import { getImgSrcSet } from '../lib/images';
import { useData } from '../stores/DataContext';

const ServiceCard = ({ service, viewMode = 'list', onUpdate }) => {
  const { isDark } = useThemeContext();
  const { user, isAuthenticated, refreshUser, showToast } = useData();
  const isHtmlOnly = service.contentType === 'html-only';
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(service.likes?.length || 0);
  const [liking, setLiking] = useState(false);

  const prevServiceId = useRef(service._id);
  const prevUserId = useRef(user?._id);

  useEffect(() => {
    let changed = false;
    if (prevServiceId.current !== service._id) {
      prevServiceId.current = service._id;
      changed = true;
    }
    if (prevUserId.current !== user?._id) {
      prevUserId.current = user?._id;
      changed = true;
    }
    if (!changed) return;
    const userId = user?._id;
    if (!userId) {
      setLikeCount(service.likes?.length || 0);
      setIsLiked(false);
      return;
    }
    if (Array.isArray(service.likes)) {
      const liked = service.likes.some(like => (like._id || like).toString() === userId.toString());
      setIsLiked(liked);
      setLikeCount(service.likes.length);
    }
  }, [user, service.likes, service._id]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please login to like service', 'warning');
      return;
    }
    try {
      if (liking) return;
      setLiking(true);
      const response = await serviceApi.like(service._id);
      setIsLiked(response.data.liked);
      setLikeCount(response.data.likes);
      if (onUpdate) {
        const userId = user._id.toString();
        if (response.data.liked) {
          onUpdate({ ...service, likes: [...(service.likes || []), userId] });
        } else {
          onUpdate({ ...service, likes: (service.likes || []).filter(id => (id._id || id).toString() !== userId) });
        }
      }
      if (refreshUser) refreshUser();
    } catch (err) {
      showToast('Failed to like service', 'error');
    } finally {
      setLiking(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        component={isHtmlOnly ? 'a' : Link}
        href={isHtmlOnly ? `/render/service/${service.slug}` : undefined}
        to={isHtmlOnly ? undefined : `/service/${service.slug}`}
        target={isHtmlOnly ? '_blank' : undefined}
        rel={isHtmlOnly ? 'noopener noreferrer' : undefined}
        sx={{
          textDecoration: 'none',
          display: 'flex',
          flexDirection: viewMode === 'grid' ? 'column' : { xs: 'column', sm: 'row' },
          borderRadius: 2,
          mb: viewMode === 'grid' ? 0 : 2,
          height: viewMode === 'grid' ? '100%' : 'auto',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)',
            '& .card-image': { transform: 'scale(1.02)' },
          },
        }}
      >
        {viewMode === 'grid' && (
          <Box sx={{ width: '100%', height: 180, position: 'relative' }}>
            <CardMedia component="img" image={service.image} alt={service.title} loading="lazy" srcSet={getImgSrcSet(service.image)} sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 400px"
              className="card-image"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
          </Box>
        )}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, mb: 1, flexWrap: 'wrap' }}>
              <Chip label={service.category?.toUpperCase()} size="small"
                sx={{ bgcolor: isDark ? 'rgba(168, 85, 247, 0.9)' : 'rgba(13, 148, 136, 0.9)',
                  color: '#fff', fontWeight: 600, fontSize: '0.65rem' }} />
              {service.isFeatured && <Chip label="FEATURED" size="small" color="error" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />}
            </Box>
            <Typography gutterBottom variant="h6" component="h3"
              sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, fontWeight: 600, lineHeight: 1.3, mb: 1,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: 'text.primary' }}>
              {service.title}
            </Typography>
            <Typography variant="body2" color="text.secondary"
              sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1,
                fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              {service.description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: 1, borderColor: 'divider',
              gap: { xs: 0.5, sm: 1 }, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap', minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ fontSize: { xs: 14, sm: 16 }, color: 'warning.main' }} />
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{service.rating || 0}</Typography>
                </Box>
                <Tooltip title="Views">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Visibility sx={{ fontSize: { xs: 14, sm: 20 }, opacity: 0.7 }} />
                    <Typography variant="caption" sx={{ opacity: 0.7, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {service.views || 0}
                    </Typography>
                  </Box>
                </Tooltip>
                <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                  <Box
                    component="button"
                    onClick={handleLike}
                    disabled={liking}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      border: 'none',
                      bgcolor: 'transparent',
                      cursor: liking ? 'default' : 'pointer',
                      color: isLiked ? 'error.main' : 'inherit',
                      transition: 'color 0.2s ease',
                      opacity: liking ? 0.6 : 1,
                      '&:hover': { color: liking ? 'inherit' : 'error.main' },
                      p: 0,
                    }}
                  >
                    <Favorite sx={{ fontSize: { xs: 14, sm: 20 }, opacity: 0.7 }} />
                    <Typography variant="caption" sx={{ opacity: 0.7, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {likeCount}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                <MonetizationOn sx={{ fontSize: { xs: 14, sm: 16 }, color: 'success.main' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  {service.price > 0 ? `$${service.price}` : 'Free'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Box>
        {viewMode !== 'grid' && (
          <Box sx={{ flex: { xs: '0 0 100%', sm: '0 0 35%' }, height: { xs: 200, sm: 'auto' }, minHeight: { sm: 160 }, position: 'relative', order: { xs: -1, sm: 1 } }}>
            <CardMedia component="img" image={service.image} alt={service.title} loading="lazy" srcSet={getImgSrcSet(service.image)} sizes="(max-width: 600px) 100vw, 400px"
              className="card-image"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
          </Box>
        )}
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
