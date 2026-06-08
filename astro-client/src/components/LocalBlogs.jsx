import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import LocationOn from '@mui/icons-material/LocationOn';
import { blogApi } from '../lib/api';
import BlogList from './BlogList';
import { useLanguage } from '../stores/LanguageContext';
import { useData } from '../stores/DataContext';

const LocalBlogs = ({ category, setCategory, sort, setSort }) => {
  const { t } = useLanguage();
  const { user, showToast } = useData();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(user?.location || '');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState('');

  useEffect(() => {
    if (user?.location || location) {
      fetchLocalNews(location || user.location);
    } else {
      setLoading(false);
    }
  }, [user?.location]);

  const fetchLocalNews = async (loc) => {
    setLoading(true);
    try {
      const response = await blogApi.getLocal(loc);
      setBlogs(response.data);
    } catch (err) {
      console.error('Failed to fetch local blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetLocation = () => {
    if (tempLocation.trim()) {
      setLocation(tempLocation.trim());
      setDialogOpen(false);
      fetchLocalNews(tempLocation.trim());
      showToast('Location updated!', 'success');
    }
  };

  const handleOpenDialog = () => {
    setTempLocation(location || '');
    setDialogOpen(true);
  };

  if (!location && !loading) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          bgcolor: 'background.paper',
          borderRadius: 3,
        }}
      >
        <LocationOn sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {t('enableLocation')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('enableLocationDesc')}
        </Typography>
        <Button variant="contained" onClick={handleOpenDialog}>
          {t('setLocation')}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {location ? `${t('localBlogs')} - ${location}` : t('localBlogs')}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<LocationOn />}
          onClick={handleOpenDialog}
          sx={{ mt: 1 }}
        >
          {location ? t('changeLocation') : t('setLocation')}
        </Button>
      </Box>

      {blogs.length === 0 && !loading ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'background.paper',
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {t('noLocalBlogs')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('tryDifferentLocation')}
          </Typography>
        </Box>
      ) : (
        <BlogList
          blogs={blogs}
          loading={loading}
          showPagination={false}
          onUpdate={(updated) => {
            setBlogs(blogs.map(n => n._id === updated._id ? updated : n));
          }}
        />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('setLocation')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('cityRegion')}
            fullWidth
            variant="outlined"
            value={tempLocation}
            onChange={(e) => setTempLocation(e.target.value)}
            placeholder="e.g., New York, London, Tokyo"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSetLocation} variant="contained" disabled={!tempLocation.trim()}>
            {t('setLocation')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LocalBlogs;