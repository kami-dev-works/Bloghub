import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Favorite from '@mui/icons-material/Favorite';
import { userApi } from '../lib/api';
import BlogList from './BlogList';
import { useLanguage } from '../stores/LanguageContext';
import { useData } from '../stores/DataContext';

const LikedBlogs = ({ category, setCategory, sort, setSort }) => {
  const { t } = useLanguage();
  const { isAuthenticated, loading: authLoading, user } = useData();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedNews = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await userApi.getLiked();
      setBlogs(response.data);
    } catch (err) {
      console.error('Failed to fetch liked blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedNews();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {t('loginRequired')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('pleaseLogin')}
        </Typography>
        <Button component={Link} to="/login" variant="contained">
          {t('login')}
        </Button>
      </Container>
    );
  }

  if (blogs.length === 0 && !loading) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 3,
        }}
      >
        <Favorite sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {t('noLikedBlogs')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('startExploring')}
        </Typography>
        <Button component={Link} to="/" variant="contained">
          {t('browseBlogs')}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <BlogList
        blogs={blogs}
        loading={loading || authLoading}
        showPagination={false}
        onUpdate={(updated) => {
          setBlogs(prev => prev.filter(n => n._id !== updated._id));
        }}
      />
    </Box>
  );
};

export default LikedBlogs;