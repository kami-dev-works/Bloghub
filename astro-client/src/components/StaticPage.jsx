import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { websiteSettingApi } from '../lib/api';
import HtmlContent from './HtmlContent';
import { useThemeContext } from '../stores/ThemeContext';

const pageFields = {
  about: { title: 'About Us', field: 'aboutUs' },
  terms: { title: 'Terms & Conditions', field: 'termsAndConditions' },
  privacy: { title: 'Privacy Policy', field: 'privacyPolicy' },
  contact: { title: 'Contact Us', field: null },
};

const StaticPage = () => {
  const { pathname } = useLocation();
  const page = pathname.split('/')[1];
  const { isDark } = useThemeContext();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    websiteSettingApi.get()
      .then(res => { setSettings(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [pathname]);

  const info = pageFields[page];
  if (!info) return <Container sx={{ py: 8, textAlign: 'center' }}><Typography variant="h4">Page not found</Typography></Container>;

  if (loading) return <Container sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, fontFamily: 'Poppins', background: isDark ? 'linear-gradient(135deg, #F43F5E, #A855F7)' : 'linear-gradient(135deg, #0D9488, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {info.title}
      </Typography>

      {page === 'contact' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {settings?.contactEmail && (
            <Box><Typography variant="subtitle2" color="text.secondary">Email</Typography><Typography>{settings.contactEmail}</Typography></Box>
          )}
          {settings?.contactPhone && (
            <Box><Typography variant="subtitle2" color="text.secondary">Phone</Typography><Typography>{settings.contactPhone}</Typography></Box>
          )}
          {settings?.contactAddress && (
            <Box><Typography variant="subtitle2" color="text.secondary">Address</Typography><Typography>{settings.contactAddress}</Typography></Box>
          )}
        </Box>
      ) : (
        settings?.[info.field] ? (
          <HtmlContent html={settings[info.field]} />
        ) : (
          <Typography color="text.secondary">No content available yet.</Typography>
        )
      )}
    </Container>
  );
};

export default StaticPage;
