import { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, InputAdornment } from '@mui/material';
import Build from '@mui/icons-material/Build';
import Search from '@mui/icons-material/Search';
import { serviceApi } from '../lib/api';
import ServiceList from './ServiceList';

const AllServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (search) params.search = search;
        const response = await serviceApi.getAll(params);
        setServices(response.data.services);
        setTotalPages(response.data.pagination?.pages || 1);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [page, search]);

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', gap: 1, mb: 3 }}>
        <Build sx={{ color: 'primary.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center' }}>Our Services</Typography>
      </Box>
      <TextField
        size="small"
        placeholder="Search services..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
        }}
        sx={{ mb: 2, maxWidth: 400 }}
      />
      <ServiceList services={services} loading={loading} page={page} totalPages={totalPages}
        onPageChange={(e, v) => setPage(v)} showPagination={true} viewMode="grid"
      />
    </Container>
  );
};

export default AllServices;
