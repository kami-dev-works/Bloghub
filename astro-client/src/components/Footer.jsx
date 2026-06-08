import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import Facebook from '@mui/icons-material/Facebook';
import Twitter from '@mui/icons-material/Twitter';
import Instagram from '@mui/icons-material/Instagram';
import LinkedIn from '@mui/icons-material/LinkedIn';
import YouTube from '@mui/icons-material/YouTube';
import Send from '@mui/icons-material/Send';
import { motion } from 'framer-motion';
import { useData } from '../stores/DataContext';
import { useLanguage } from '../stores/LanguageContext';
import { websiteSettingApi } from '../lib/api';

const socialIcons = [
  { key: 'facebook', icon: <Facebook />, label: 'Facebook', color: '#1877F2' },
  { key: 'twitter', icon: <Twitter />, label: 'Twitter', color: '#1DA1F2' },
  { key: 'instagram', icon: <Instagram />, label: 'Instagram', color: '#E4405F' },
  { key: 'linkedin', icon: <LinkedIn />, label: 'LinkedIn', color: '#0A66C2' },
  { key: 'youtube', icon: <YouTube />, label: 'YouTube', color: '#FF0000' },
];

const footerCategories = [
  { labelKey: 'technology', value: 'technology' },
  { labelKey: 'business', value: 'business' },
  { labelKey: 'sports', value: 'sports' },
  { labelKey: 'entertainment', value: 'entertainment' },
  { labelKey: 'health', value: 'health' },
  { labelKey: 'science', value: 'science' },
];

const Footer = () => {
  const { showToast } = useData();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [settings, setSettings] = useState(null);
  const siteName = settings?.siteName || 'BlogHub';
  const socialLinks = settings?.socialLinks || {};

  useEffect(() => {
    websiteSettingApi.get().then(res => setSettings(res.data)).catch(() => { });
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showToast(t('successSubscribed'), 'success');
      setEmail('');
    }
  };

  const quickLinks = [
    { labelKey: 'aboutUs', to: '/about' },
    { labelKey: 'contact', to: '/contact' },
    { labelKey: 'privacyPolicy', to: '/privacy' },
    { labelKey: 'termsOfService', to: '/terms' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'var(--color-footerBg)',
        borderTop: 1,
        borderColor: 'var(--color-border)',
        mt: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary), transparent 95%) 0%, color-mix(in srgb, var(--color-secondary), transparent 95%) 100%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={4}>
            {settings?.logo ? (
              <Box component="img" src={settings.logo} alt={siteName} sx={{ height: { xs: 40, sm: 56, md: parseInt(settings.logoHeight, 10) * 2 || 40 }, width: { xs: 'auto', sm: parseInt(settings.logoWidth, 10) * 2 || 'auto' }, maxHeight: { xs: 40, sm: 56, md: 'none' }, mb: 2, objectFit: 'contain', borderRadius: settings.logoBorderRadius ? parseInt(settings.logoBorderRadius) : 0 }} />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Poppins', color: 'var(--color-primary)', mb: 2, fontSize: { xs: '1.15rem', sm: '1.25rem', md: '1.5rem' } }}>
                {siteName}
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: 'var(--color-footerText)', mb: 3 }}>
              {settings?.siteDescription || `${t('allBlogs')} - ${t('aboutUs')}.`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialIcons.map((social) => {
                const href = socialLinks[social.key];
                if (!href) return null;
                return (
                  <motion.div
                    key={social.key}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      component="a"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      sx={{
                        bgcolor: 'color-mix(in srgb, var(--color-footerText), transparent 95%)',
                        color: 'var(--color-footerText)',
                        '&:hover': {
                          bgcolor: social.color,
                          color: '#fff',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </motion.div>
                );
              })}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('quickLinks')}
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {quickLinks.map((link) => (
                <Box component="li" key={link.labelKey} sx={{ mb: 1 }}>
                  <Typography
                    component={Link}
                    to={link.to}
                    sx={{
                      color: 'var(--color-footerText)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: 'var(--color-primary)',
                      },
                    }}
                  >
                    {t(link.labelKey)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('categories')}
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {footerCategories.map((cat) => (
                <Box component="li" key={cat.value} sx={{ mb: 1 }}>
                  <Typography
                    component={Link}
                    to={`/?category=${cat.value}`}
                    sx={{
                      color: 'var(--color-footerText)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: 'var(--color-primary)',
                      },
                    }}
                  >
                    {t(cat.labelKey)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('blogNewsletter')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-footerText)', mb: 2 }}>
              {t('subscribeDesc')}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{
                display: 'flex',
                gap: 1,
              }}
            >
              <TextField
                size="small"
                placeholder={t('yourEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                type="email"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'color-mix(in srgb, var(--color-footerText), transparent 95%)',
                  },
                }}
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ minWidth: 'auto', px: 2 }}
                  aria-label={t('subscribe')}
                >
                  <Send />
                </Button>
              </motion.div>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'var(--color-border)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'var(--color-footerText)' }}>
            © {new Date().getFullYear()} {siteName}. {t('allRightsReserved')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              component={Link}
              to="/privacy"
              variant="body2"
              sx={{ color: 'var(--color-footerText)', textDecoration: 'none', '&:hover': { color: 'var(--color-primary)' } }}
            >
              {t('privacy')}
            </Typography>
            <Typography
              component={Link}
              to="/terms"
              variant="body2"
              sx={{ color: 'var(--color-footerText)', textDecoration: 'none', '&:hover': { color: 'var(--color-primary)' } }}
            >
              {t('terms')}
            </Typography>
            <Typography
              component={Link}
              to="/contact"
              variant="body2"
              sx={{ color: 'var(--color-footerText)', textDecoration: 'none', '&:hover': { color: 'var(--color-primary)' } }}
            >
              {t('contact')}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;