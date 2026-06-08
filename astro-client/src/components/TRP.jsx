import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, LinearProgress, Grid } from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingFlat from '@mui/icons-material/TrendingFlat';
import Visibility from '@mui/icons-material/Visibility';
import Favorite from '@mui/icons-material/Favorite';
import Star from '@mui/icons-material/Star';
import { blogApi } from '../lib/api';
import { useLanguage } from '../stores/LanguageContext';
import { useThemeContext } from '../stores/ThemeContext';
import { motion } from 'framer-motion';

const TRP = () => {
  const { t } = useLanguage();
  const { isDark } = useThemeContext();
  const [trpData, setTrpData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTRP = async () => {
      try { const response = await blogApi.getTRP(); setTrpData(response.data); } catch (err) { console.error('Failed to fetch TRP:', err); } finally { setLoading(false); }
    };
    fetchTRP();
  }, []);

  const getTRPChipColor = (trp) => { if (trp >= 7) return 'success'; if (trp >= 4) return 'warning'; return 'error'; };
  const getTrendIcon = (trend) => { if (trend === 'up') return <TrendingUp sx={{ color: 'success.main' }} />; if (trend === 'down') return <TrendingDown sx={{ color: 'error.main' }} />; return <TrendingFlat sx={{ color: 'warning.main' }} />; };

  if (loading) return <Container maxWidth="lg" sx={{ py: 4 }}><LinearProgress /></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Poppins', background: isDark ? 'linear-gradient(135deg, #F43F5E, #A855F7)' : 'linear-gradient(135deg, #0D9488, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('trp') || 'TRP Ratings'}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Target Rating Point (TRP) analysis for blog content performance</Typography>

        <Paper sx={{ p: 4, mb: 4, background: isDark ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(244, 63, 94, 0.2))' : 'linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(99, 102, 241, 0.1))', border: 1, borderColor: 'primary.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box><Typography variant="h6" color="text.secondary">Current TRP Score</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Typography variant="h2" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>{trpData?.trp || 0}</Typography><Chip icon={getTrendIcon(trpData?.trend)} label={trpData?.trend?.toUpperCase() || 'N/A'} color={trpData?.trend === 'up' ? 'success' : trpData?.trend === 'down' ? 'error' : 'warning'} variant="filled" /></Box></Box>
            <Grid container spacing={3} sx={{ maxWidth: 500 }}>
              <Grid item xs={6} sm={3}><Box sx={{ textAlign: 'center' }}><Visibility sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} /><Typography variant="h5" sx={{ fontWeight: 600 }}>{trpData?.totalViews?.toLocaleString() || 0}</Typography><Typography variant="caption" color="text.secondary">Total Views</Typography></Box></Grid>
              <Grid item xs={6} sm={3}><Box sx={{ textAlign: 'center' }}><Favorite sx={{ fontSize: 32, color: 'error.main', mb: 1 }} /><Typography variant="h5" sx={{ fontWeight: 600 }}>{trpData?.totalLikes?.toLocaleString() || 0}</Typography><Typography variant="caption" color="text.secondary">Total Likes</Typography></Box></Grid>
              <Grid item xs={6} sm={3}><Box sx={{ textAlign: 'center' }}><Star sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} /><Typography variant="h5" sx={{ fontWeight: 600 }}>{trpData?.avgRating || 0}</Typography><Typography variant="caption" color="text.secondary">Avg Rating</Typography></Box></Grid>
              <Grid item xs={6} sm={3}><Box sx={{ textAlign: 'center' }}><TrendingUp sx={{ fontSize: 32, color: 'success.main', mb: 1 }} /><Typography variant="h5" sx={{ fontWeight: 600 }}>{trpData?.blogCount || 0}</Typography><Typography variant="caption" color="text.secondary">Blog Count</Typography></Box></Grid>
            </Grid>
          </Box>
        </Paper>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Top Performing Blogs</Typography>
        <TableContainer component={Paper}><Table><TableHead><TableRow><TableCell>Rank</TableCell><TableCell>Title</TableCell><TableCell align="center">Views</TableCell><TableCell align="center">Likes</TableCell><TableCell align="center">TRP</TableCell></TableRow></TableHead><TableBody>{trpData?.topBlogs?.map((blog, index) => (<TableRow key={blog._id}><TableCell><Chip label={index + 1} color={index < 3 ? 'primary' : 'default'} size="small" /></TableCell><TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</TableCell><TableCell align="center">{blog.views?.toLocaleString()}</TableCell><TableCell align="center">{blog.likes?.toLocaleString()}</TableCell><TableCell align="center"><Chip label={blog.trp || 0} color={getTRPChipColor(blog.trp)} size="small" /></TableCell></TableRow>))}</TableBody></Table></TableContainer>

        <Paper sx={{ p: 3, mt: 4 }}><Typography variant="h6" gutterBottom>About TRP</Typography><Typography variant="body2" color="text.secondary">TRP is calculated: Views (40%), Likes (30%), Ratings (20%), Content Count (10%)</Typography><Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}><Chip label="0-3: Low" color="error" size="small" variant="outlined" /><Chip label="4-6: Medium" color="warning" size="small" variant="outlined" /><Chip label="7+: High" color="success" size="small" variant="outlined" /></Box></Paper>
      </motion.div>
    </Container>
  );
};

export default TRP;