import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Person from '@mui/icons-material/Person';
import Notifications from '@mui/icons-material/Notifications';
import Mail from '@mui/icons-material/Mail';
import Article from '@mui/icons-material/Article';
import { useThemeContext } from '../stores/ThemeContext';
import { useData } from '../stores/DataContext';
import { useLanguage } from '../stores/LanguageContext';
import { blogApi, feedbackApi } from '../lib/api';
import ProfileUpload from './ProfileUpload';

const Settings = () => {
  const { isDark } = useThemeContext();
  const { user, updateProfile, refreshUser } = useData();
  const { t } = useLanguage();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  
  const [profile, setProfile] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
  });

  const [notifications, setNotifications] = useState({
    email: user?.notifications?.email ?? true,
    likes: user?.notifications?.likes ?? true,
    comments: user?.notifications?.comments ?? true,
  });

  const [feedback, setFeedback] = useState({ subject: '', message: '' });
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({ username: user.username || '', bio: user.bio || '', location: user.location || '', avatar: user.avatar || '' });
      setNotifications(user.notifications || { email: true, likes: true, comments: true });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 3) fetchMySubmissions();
  }, [activeTab]);

  const fetchMySubmissions = async () => {
    setLoading(true);
    try {
      const response = await blogApi.getMySubmissions();
      setMySubmissions(response.data);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try { await updateProfile(profile); } catch (err) { console.error('Failed to update profile:', err); } finally { setLoading(false); }
  };

  const handleAvatarUpload = async (avatarUrl) => {
    setProfile({ ...profile, avatar: avatarUrl });
    try { await updateProfile({ avatar: avatarUrl }); await refreshUser(); } catch (err) { console.error('Failed to update avatar:', err); }
  };

  const handleNotificationsSave = async () => {
    setLoading(true);
    try { await updateProfile({ notifications }); } catch (err) { console.error('Failed to update notifications:', err); } finally { setLoading(false); }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try { await feedbackApi.submit({ ...feedback, email: user?.email }); setFeedback({ subject: '', message: '' }); } catch (err) { console.error('Failed to submit feedback:', err); }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Poppins', background: isDark ? 'linear-gradient(135deg, #F43F5E, #A855F7)' : 'linear-gradient(135deg, #0D9488, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}>
          {t('settingsTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>{t('settingsSubtitle')}</Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1, borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 1, sm: 2 },
              minWidth: { xs: 70, sm: 120 },
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              '& .MuiTab-iconWrapper': { fontSize: { xs: 18, sm: 24 }, mb: { xs: 0, sm: '4px !important' } }
            }
          }}
        >
          <Tab icon={<Person />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? '' : t('profile')} />
          <Tab icon={<Notifications />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? '' : t('preferences')} />
          <Tab icon={<Mail />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? '' : t('contactTab')} />
          <Tab icon={<Article />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? '' : t('mySubmissions')} />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: { xs: 2, sm: 4 } }}>
            <ProfileUpload onUploadComplete={handleAvatarUpload} currentAvatar={profile.avatar} />
          </Box>
          <Grid container spacing={{ xs: 1, sm: 3 }}>
            <Grid item xs={12}><TextField fullWidth size="small" label={t('username')} value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label={t('bio')} multiline rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label={t('location')} value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} /></Grid>
            <Grid item xs={12}><Button variant="contained" size="small" onClick={handleProfileSave} disabled={loading}>{t('saveProfile')}</Button></Grid>
          </Grid>
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{t('theme')}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{t('themeDesc')}</Typography>
          <Divider sx={{ my: { xs: 2, sm: 3 } }} />
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{t('notificationPreferences')}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel control={<Switch checked={notifications.email} onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })} />} label={t('emailNotifications')} />
            <FormControlLabel control={<Switch checked={notifications.likes} onChange={(e) => setNotifications({ ...notifications, likes: e.target.checked })} />} label={t('notifyLikes')} />
            <FormControlLabel control={<Switch checked={notifications.comments} onChange={(e) => setNotifications({ ...notifications, comments: e.target.checked })} />} label={t('notifyComments')} />
          </Box>
          <Button variant="contained" onClick={handleNotificationsSave} disabled={loading} sx={{ mt: 3 }}>{t('savePreferences')}</Button>
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{t('contactFeedback')}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{t('feedbackDesc')}</Typography>
          <Box component="form" onSubmit={handleFeedbackSubmit}>
            <TextField fullWidth label={t('subject')} value={feedback.subject} onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })} required sx={{ mb: 2 }} />
            <TextField fullWidth label={t('message')} multiline rows={5} value={feedback.message} onChange={(e) => setFeedback({ ...feedback, message: e.target.value })} required sx={{ mb: 2 }} />
            <Button type="submit" variant="contained">{t('sendFeedback')}</Button>
          </Box>
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Typography variant="h6" gutterBottom>{t('mySubmissions')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{t('submissionsDesc')}</Typography>
        {mySubmissions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Article sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>{t('noSubmissionsYet')}</Typography>
            <Typography variant="body2" color="text.secondary">{t('startSharing')}</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {mySubmissions.map((item) => (
              <Grid item xs={12} sm={6} key={item._id}>
                <Card>
                  <CardMedia component="img" height="140" image={item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'} alt={item.title} />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip label={item.category} size="small" sx={{ bgcolor: isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(13, 148, 136, 0.1)' }} />
                      <Chip label={t(item.status) || t('pending')} size="small" color={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'error' : 'warning'} />
                    </Box>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1 }}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{item.description}</Typography>
                    <Typography variant="caption" color="text.secondary">{t('submitted')} {new Date(item.createdAt).toLocaleDateString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
    </Container>
  );
};

function TabPanel({ children, value, index }) {
  return <div role="tabpanel" hidden={value !== index}>{value === index && <Box>{children}</Box>}</div>;
}

export default Settings;