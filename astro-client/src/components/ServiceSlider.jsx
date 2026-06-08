import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Skeleton, Chip } from '@mui/material';
import Star from '@mui/icons-material/Star';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Visibility from '@mui/icons-material/Visibility';
import ThumbUp from '@mui/icons-material/ThumbUp';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import { useThemeContext } from '../stores/ThemeContext';
import { serviceApi } from '../lib/api';

const ServiceSlideCard = ({ service }) => {
  const { isDark } = useThemeContext();
  const isHtmlOnly = service.contentType === 'html-only';
  const CardWrapper = isHtmlOnly ? 'a' : Link;
  const wrapperProps = isHtmlOnly
    ? { href: `/render/service/${service.slug}`, target: '_blank', rel: 'noopener noreferrer', style: { textDecoration: 'none', flexShrink: 0 } }
    : { to: `/service/${service.slug}`, style: { textDecoration: 'none', flexShrink: 0 } };
  return (
    <CardWrapper {...wrapperProps}>
      <Box sx={{
        width: { xs: 155, sm: 280 }, height: { xs: 270, sm: 340 }, borderRadius: 3, overflow: 'hidden',
        border: '1px solid', borderColor: 'divider',
        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'background.paper',
        display: 'flex', flexDirection: 'column', userSelect: 'none',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.15)' },
      }}>
        <Box sx={{ height: { xs: 110, sm: 140 }, position: 'relative', overflow: 'hidden' }}>
          <Box component="img" src={service.image} alt={service.title} loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease',
              '&:hover': { transform: 'scale(1.05)' } }} />
          {service.isFeatured && (
            <Chip label="FEATURED" size="small" color="error"
              sx={{ position: 'absolute', top: { xs: 4, sm: 8 }, left: { xs: 4, sm: 8 }, fontWeight: 700, fontSize: { xs: '0.55rem', sm: '0.6rem' }, height: { xs: 18, sm: 20 } }} />
          )}
          <Chip label={service.category?.toUpperCase()} size="small"
            sx={{ position: 'absolute', bottom: { xs: 4, sm: 8 }, left: { xs: 4, sm: 8 },
              bgcolor: isDark ? 'rgba(168, 85, 247, 0.9)' : 'rgba(13, 148, 136, 0.9)',
              color: '#fff', fontWeight: 600, fontSize: { xs: '0.55rem', sm: '0.6rem' }, height: { xs: 18, sm: 20 } }} />
        </Box>
        <Box sx={{ p: { xs: 1, sm: 1.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3, mb: 0.5, color: 'text.primary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
            {service.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            {service.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 0.5, borderTop: '1px solid', borderColor: 'divider', gap: 0.5, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ fontSize: { xs: 12, sm: 14 }, color: 'warning.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{service.rating || 0}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <Visibility sx={{ fontSize: { xs: 12, sm: 13 }, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{service.views || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                <ThumbUp sx={{ fontSize: { xs: 12, sm: 13 }, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{service.likes?.length || 0}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <MonetizationOn sx={{ fontSize: { xs: 13, sm: 15 }, color: 'success.main' }} />
            <Typography sx={{ fontWeight: 700, color: 'success.main', fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
              {service.price > 0 ? `$${service.price}` : 'Free'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CardWrapper>
  );
};

const ServiceSlider = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceApi.getTop(20);
        setServices(response.data);
      } catch (err) {
        console.error('Failed to fetch top services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
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
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchStart = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    startX.current = e.touches[0].pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4, mb: 2 }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 }, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ width: 280, height: 340, borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <Skeleton variant="rectangular" height={140} />
                <Box sx={{ p: 1.5 }}>
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="100%" height={14} />
                  <Skeleton variant="text" width="60%" height={14} />
                  <Skeleton variant="text" width="40%" height={14} sx={{ mt: 1 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  if (services.length === 0) return null;

  return (
    <Box sx={{ width: '100%', my: 4 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'left', sm: 'center' }, mb: 2.5, position: 'relative' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Poppins', textAlign: { xs: 'left', sm: 'center' } }}>
            Our Services
          </Typography>
          <Link to="/services" style={{ textDecoration: 'none', position: 'absolute', right: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              View All <ArrowForward sx={{ fontSize: 16 }} />
            </Typography>
          </Link>
        </Box>
      </Box>
      <Box sx={{
        width: '100%',
        borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider',
        bgcolor: 'background.paper', py: 2.5,
      }}>
        <Box sx={{ overflow: 'hidden', px: { xs: 2, sm: 3 } }}>
          <Box ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            sx={{
              display: 'flex', gap: 2.5, overflowX: 'auto', cursor: 'grab',
              scrollbarWidth: 'none', msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollBehavior: 'auto',
            }}>
            {services.map((svc) => (
              <ServiceSlideCard key={svc._id} service={svc} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ServiceSlider;
