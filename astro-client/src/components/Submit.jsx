import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Alert } from '@mui/material';
import { useThemeContext } from '../stores/ThemeContext';
import { useData } from '../stores/DataContext';
import { useLanguage } from '../stores/LanguageContext';
import UserSubmission from './UserSubmission';

const Submit = () => {
  const { isDark } = useThemeContext();
  const { isAuthenticated, showToast } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      showToast(t('pleaseLoginToSubmit'), 'warning');
      navigate('/login');
    } else {
      setReady(true);
    }
  }, [isAuthenticated, navigate, showToast, t]);

  const handleSuccess = () => {
    showToast('Submission received! Pending approval.', 'success');
    setTimeout(() => {
      navigate('/admin');
    }, 2000);
  };

  if (!ready || !isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          {t('pleaseLoginToSubmit')}. <Link to="/login">Login here</Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            fontFamily: 'Poppins',
            background: isDark
              ? 'linear-gradient(135deg, #F43F5E, #A855F7)'
              : 'linear-gradient(135deg, #0D9488, #6366F1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('submitBlogTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('submitBlogSubtitle')}
        </Typography>
      </Box>

      <UserSubmission onSuccess={handleSuccess} />
    </Container>
  );
};

export default Submit;