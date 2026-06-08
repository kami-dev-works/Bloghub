import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Container, Typography, Chip, Skeleton, IconButton, Button, Rating, Tooltip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Star from '@mui/icons-material/Star';
import Visibility from '@mui/icons-material/Visibility';
import ThumbUp from '@mui/icons-material/ThumbUp';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Category from '@mui/icons-material/Category';
import Favorite from '@mui/icons-material/Favorite';
import { useThemeContext } from '../stores/ThemeContext';
import { serviceApi } from '../lib/api';
import { getImgSrcSet } from '../lib/images';
import { useData } from '../stores/DataContext';
import HtmlContent, { processContent } from './HtmlContent';
import SeoHead from './SeoHead';
import { JsonLdService, JsonLdBreadcrumb } from './JsonLd';
import ServiceCard from './ServiceCard';

const ServiceDetail = () => {
  const { slug } = useParams();
  const { isDark } = useThemeContext();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const { user, isAuthenticated, refreshUser, showToast } = useData();

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const response = await serviceApi.getBySlug(slug);
        const data = response.data;
        setService(data);

        if (data.category) {
          const relatedRes = await serviceApi.getAll({ category: data.category, limit: 4 });
          setRelatedServices((relatedRes.data.services || []).filter((s) => s._id !== data._id));
        }
      } catch (err) {
        console.error('Failed to fetch service:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  useEffect(() => {
    if (!service || !user) return;
    const userId = user._id;
    const liked = service.likes?.some(
      (like) => like.toString() === userId.toString()
    ) || user?.likedServices?.some((sid) => sid.toString() === service._id.toString());
    setIsLiked(liked);
    const rated = service.ratedBy?.some(
      (id) => id.toString() === userId.toString()
    );
    setHasRated(rated);
  }, [service, user]);

  useEffect(() => {
    if (service?.contentType === 'html-only') {
      window.location.replace(`/render/service/${service.slug}`);
    }
  }, [service]);

  const handleLike = async () => {
    if (!isAuthenticated || !service) {
      showToast('Please login to like this service', 'warning');
      return;
    }
    try {
      const response = await serviceApi.like(service._id);
      setIsLiked(response.data.liked);
      setService(prev => ({
        ...prev,
        likes: response.data.liked
          ? [...(prev.likes || []), user._id]
          : (prev.likes || []).filter(id => id.toString() !== user._id.toString())
      }));
      if (refreshUser) refreshUser();
    } catch (err) {
      showToast('Failed to like service', 'error');
    }
  };

  const handleRate = async (event, newValue) => {
    if (!service) return;
    if (!isAuthenticated) {
      showToast('Please login to rate this service', 'warning');
      return;
    }
    if (hasRated) {
      showToast('You have already rated this service', 'warning');
      return;
    }
    try {
      const response = await serviceApi.rate(service._id, newValue);
      setService(prev => ({
        ...prev,
        rating: response.data.rating,
        ratingCount: response.data.ratingCount,
      }));
      setHasRated(true);
      showToast('Rating submitted!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit rating';
      showToast(msg, 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, sm: 3 } }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, mb: 3 }} />
        <Skeleton variant="text" width="70%" height={40} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
      </Box>
    );
  }

  if (!service) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>Service not found</Typography>
        <Typography variant="body2" color="text.secondary">The service you're looking for doesn't exist.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1300, mx: 'auto', px: { xs: 2, sm: 3 } }}>
      <SeoHead
        title={service.title}
        description={service.metaDescription || service.description}
        seoTitles={service.seoTitles}
        image={service.image}
        type="service"
        path={`/service/${slug}`}
        publishedDate={service.createdAt}
      />
      <JsonLdService service={service} />
      <JsonLdBreadcrumb items={[
        { name: 'Home', url: window.location.origin },
        { name: 'Services', url: `${window.location.origin}/services` },
        { name: service.title, url: window.location.href },
      ]} />
      <Box component={Link} to="/services" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', textDecoration: 'none', mb: 2, '&:hover': { color: 'primary.main' } }}>
        <ArrowBack fontSize="small" /> Back to Services
      </Box>

      <Box sx={{
        borderRadius: 3, overflow: 'hidden',
        border: '1px solid', borderColor: 'divider',
        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'background.paper',
      }}>
        <Box sx={{ aspectRatio: { xs: '4/3', sm: '15/8' }, position: 'relative', overflow: 'hidden' }}>
          <Box component="img" src={service.image} alt={service.title} loading="lazy" srcSet={getImgSrcSet(service.image)} sizes="(max-width: 600px) 100vw, (max-width: 1200px) 100vw, 1200px"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Box sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            p: { xs: 1.5, sm: 3 }, pt: { xs: 4, sm: 6 },
          }}>
            {service.isFeatured && <Chip label="FEATURED" size="small" color="error" sx={{ mb: 1, fontWeight: 700 }} />}
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: '1.1rem', sm: '1.5rem', md: '2rem' } }}>{service.title}</Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
            <Chip icon={<Category sx={{ fontSize: { xs: 14, sm: 18 } }} />} label={service.category?.toUpperCase()} size="small"
              sx={{ bgcolor: isDark ? 'rgba(168, 85, 247, 0.9)' : 'rgba(13, 148, 136, 0.9)', color: '#fff', fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {/* <Rating value={service.rating} precision={0.5} readOnly size="small" /> */}
              <Rating value={4.5} precision={0.5} readOnly size="small" />
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{service.rating} ({service.ratingCount || 0} ratings)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Visibility sx={{ fontSize: { xs: 14, sm: 18 }, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{service.views || 0} views</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Button
                variant={isLiked ? 'contained' : 'outlined'}
                color="error"
                size="small"
                startIcon={<Favorite sx={{ fontSize: { xs: 14, sm: 18 } }} />}
                onClick={handleLike}
                sx={{ borderRadius: 2, minWidth: { xs: 60, sm: 80 }, fontSize: { xs: '0.7rem', sm: '0.8125rem' }, px: { xs: 1, sm: 1.5 } }}
              >
                {service.likes?.length || 0}
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: { xs: 0, sm: 'auto' } }}>
              <MonetizationOn sx={{ fontSize: { xs: 18, sm: 24 }, color: 'success.main' }} />
              <Typography sx={{ fontWeight: 700, color: 'success.main', fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                {service.price > 0 ? `$${service.price}` : 'Free'}
              </Typography>
            </Box>
          </Box>

          {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Rate this service:</Typography>
            <Rating
              onChange={handleRate}
              precision={0.5}
              readOnly={hasRated}
              size="small"
            />
            {hasRated && (
              <Typography variant="caption" color="text.secondary">You rated this service</Typography>
            )}
          </Box> */}

          {service.contentType === 'html-only' ? (
            <Box sx={{ textAlign: 'center', py: 6, mb: 3 }}>
              <Typography variant="body1" color="text.secondary">Redirecting to standalone content...</Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: { xs: 1, sm: 2 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}>Description</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 2, sm: 3 }, lineHeight: { xs: 1.6, sm: 1.8 }, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {service.description}
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: { xs: 1, sm: 2 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}>Details</Typography>
              {service.content && (
                <Box sx={{ width: '100%', mb: { xs: 2, sm: 3 } }}>
                  <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {Math.ceil(service.content.split(/\s+/).length / 200)} min read
                    </Typography>
                  </Box>
                  <HtmlContent html={processContent(service.content)} />
                </Box>
              )}
            </>
          )}

          {service.faq && service.faq.length > 0 && (
            <Box sx={{ mb: 3 }} className="article-faq">
              <Typography variant="h6" sx={{ fontWeight: 600, mb: { xs: 1, sm: 2 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}>Frequently Asked Questions</Typography>
              {service.faq.map((item, i) => (
                <Accordion key={i} sx={{ bgcolor: 'background.paper', '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: '8px !important', overflow: 'hidden' }}>
                  <AccordionSummary expandIcon={<Typography sx={{ fontSize: { xs: 16, sm: 20 } }}>+</Typography>}>
                    <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' } }}>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {relatedServices.length > 0 && (
        <Box sx={{ bgcolor: 'background.paper', py: { xs: 2, sm: 4 }, mt: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 600, mb: { xs: 1.5, sm: 3 }, fontSize: { xs: '1.15rem', sm: '1.5rem', md: '2rem' } }}>
              Related Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {relatedServices.map((item) => (
                <ServiceCard key={item._id} service={item} />
              ))}
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default ServiceDetail;
