import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Skeleton, Pagination } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { serviceApi, adsApi } from '../lib/api';
import ServiceCard from './ServiceCard';

const CategoryServices = () => {
  const { value } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ads, setAds] = useState([]);
  const limit = 16;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesRes, adsRes] = await Promise.all([
          serviceApi.getAll({ category: value, page, limit }),
          adsApi.getAll(),
        ]);
        setServices(servicesRes.data.services);
        setTotalPages(servicesRes.data.pagination?.pages || 1);
        setAds(adsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch category services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [value, page]);

  const handlePageChange = (e, v) => {
    setPage(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryName = value?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const getRandomAd = (index) => {
    if (ads.length === 0) return null;
    return ads[index % ads.length];
  };

  const renderItems = () => {
    const items = [];
    const adInterval = 8;

    services.forEach((service, i) => {
      items.push(
        <Box key={`service-${service._id}`}>
          <ServiceCard service={service} viewMode="grid" />
        </Box>
      );

      if ((i + 1) % adInterval === 0) {
        const ad = getRandomAd(Math.floor(i / adInterval));
        if (ad) {
          items.push(
            <Box key={`ad-${i}`} sx={{ gridColumn: '1 / -1' }}>
              <Box
                component="a"
                href={ad.redirectLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { try { adsApi.click(ad._id); } catch {} }}
                sx={{
                  display: 'block', borderRadius: 2, overflow: 'hidden',
                  border: '1px solid', borderColor: 'divider',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': { boxShadow: 3 },
                }}
              >
                <Box
                  component="img"
                  src={ad.image}
                  alt={ad.title}
                  sx={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
                />
                <Box sx={{ p: 1.5, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{ad.title}</Typography>
                  {ad.description && (
                    <Typography variant="caption" color="text.secondary">{ad.description}</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        }
      }
    });

    return items;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box component={Link} to="/service-categories" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
          <ArrowBack fontSize="small" />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
          {categoryName} Services
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
          {[...Array(8)].map((_, i) => (
            <Box key={i} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              <Skeleton variant="rectangular" height={180} />
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
            </Box>
          ))}
        </Box>
      ) : services.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>No services found in this category</Typography>
          <Typography variant="body2" color="text.secondary">Check back later or browse other categories.</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
            {renderItems()}
          </Box>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" size="large" showFirstButton showLastButton />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CategoryServices;
