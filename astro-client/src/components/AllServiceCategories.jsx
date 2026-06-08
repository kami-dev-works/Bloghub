import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Skeleton } from '@mui/material';
import Category from '@mui/icons-material/Category';
import { useThemeContext } from '../stores/ThemeContext';
import { serviceCategoryApi } from '../lib/api';

const AllServiceCategories = () => {
  const { isDark } = useThemeContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await serviceCategoryApi.getAll();
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
        {[...Array(8)].map((_, i) => (
          <Box key={i} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto' }} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Category sx={{ color: 'primary.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>All Service Categories</Typography>
      </Box>
      {categories.length === 0 ? (
        <Typography color="text.secondary">No categories available.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
          {categories.map((cat) => (
            <Link key={cat._id} to={`/services/category/${cat.value}`} style={{ textDecoration: 'none' }}>
              <Box sx={{
                p: 3, borderRadius: 3, textAlign: 'center',
                border: '1px solid', borderColor: 'divider',
                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'background.paper',
                transition: 'all 0.3s ease', cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)',
                  borderColor: 'primary.main',
                },
              }}>
                <Box sx={{
                  width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', mx: 'auto', mb: 2,
                  border: '2px solid', borderColor: 'primary.main',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                }}>
                  <Box component="img" src={cat.icon} alt={cat.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  {!cat.icon && (
                    <Typography variant="h3" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                      {cat.name.charAt(0).toUpperCase()}
                    </Typography>
                  )}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {cat.name}
                </Typography>
                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                  View Services →
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AllServiceCategories;
