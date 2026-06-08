import { Box, Typography, Pagination, Skeleton } from '@mui/material';
import ServiceCard from './ServiceCard';
import { useLanguage } from '../stores/LanguageContext';

const ServiceList = ({ services = [], loading = false, page = 1, totalPages = 1, onPageChange, showPagination = true, viewMode = 'list' }) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <Box>
        {[...Array(4)].map((_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Skeleton variant="rectangular" width={200} height={150} sx={{ borderRadius: 1 }} />
            <Box sx={{ flex: 1 }}><Skeleton variant="text" width="60%" height={32} /><Skeleton variant="text" width="100%" /><Skeleton variant="text" width="80%" /></Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (services.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>No services found</Typography>
        <Typography variant="body2" color="text.secondary">Check back later for new services.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {viewMode === 'grid' ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          {services.map((item) => (<ServiceCard key={item._id} service={item} viewMode={viewMode} />))}
        </Box>
      ) : (
        services.map((item) => (<ServiceCard key={item._id} service={item} viewMode={viewMode} />))
      )}
      {showPagination && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={totalPages} page={page} onChange={onPageChange} color="primary" size="large" showFirstButton showLastButton />
        </Box>
      )}
    </Box>
  );
};

export default ServiceList;
