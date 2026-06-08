import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Campaign from '@mui/icons-material/Campaign';
import { notificationApi } from '../lib/api';
import { useThemeContext } from '../stores/ThemeContext';

const NotificationMarquee = () => {
  const { isDark } = useThemeContext();
  const [text, setText] = useState('');
  const [textHi, setTextHi] = useState('');

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await notificationApi.get();
        setText(response.data.text || '');
        setTextHi(response.data.textHi || '');
      } catch {
        setText('');
        setTextHi('');
      }
    };
    fetchNotification();
  }, []);

  const enText = text || 'No notifications are available';
  const hiText = textHi || 'कोई सूचना उपलब्ध नहीं है';

  const marqueeContent = `${enText}  •  ${hiText}`;

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      bgcolor: isDark ? 'rgba(244, 63, 94, 0.15)' : 'rgba(244, 63, 94, 0.08)',
      borderTop: '1px solid',
      borderBottom: '1px solid',
      borderColor: isDark ? 'rgba(244, 63, 94, 0.3)' : 'rgba(244, 63, 94, 0.2)',
      overflow: 'hidden',
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1.2,
        bgcolor: 'error.main',
        color: '#fff',
        flexShrink: 0,
        borderRadius: '0 8px 8px 0',
      }}>
        <Campaign sx={{ fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: { xs: 'none', sm: 'block' } }}>Announcement</Typography>
      </Box>
      <Box sx={{ overflow: 'hidden', flex: 1, py: 1.2 }}>
        <Box sx={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'marquee 30s linear infinite',
          '@keyframes marquee': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
        }}>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, px: 2, flexShrink: 0 }}>
            {marqueeContent}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, px: 2, flexShrink: 0 }}>
            {marqueeContent}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationMarquee;
