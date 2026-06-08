import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import WorkspacePremium from '@mui/icons-material/WorkspacePremium';
import { serviceApi } from '../lib/api';
import ServiceList from './ServiceList';

const TopServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      setLoading(true);
      try {
        const response = await serviceApi.getTop();
        setServices(response.data);
      } catch (err) {
        console.error('Failed to fetch top services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <WorkspacePremium sx={{ color: 'warning.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Top Rated Services</Typography>
      </Box>
      <ServiceList services={services} loading={loading} showPagination={false} viewMode="grid" />
    </Box>
  );
};

export default TopServices;
