import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Phone from '@mui/icons-material/Phone';
import ChatBot from './ChatBot';
import { websiteSettingApi } from '../lib/api';

const WHATSAPP_NUMBER = '9999999999';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const sanitizePhone = (raw) => (raw || '').replace(/[^\d+]/g, '');

const FloatingActions = () => {
  const [phone, setPhone] = useState('');

  useEffect(() => {
    let alive = true;
    websiteSettingApi
      .get()
      .then((res) => {
        if (alive) setPhone(res?.data?.contactPhone || '');
      })
      .catch(() => { });
    return () => {
      alive = false;
    };
  }, []);

  const telHref = sanitizePhone(phone) ? `tel:${sanitizePhone(phone)}` : null;

  return (
    <>
      {telHref && (
        <Box
          component="a"
          href={telHref}
          aria-label="Call us"
          sx={{
            position: 'fixed',
            right: 16,
            bottom: 24,
            width: 52,
            height: 52,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#10B981',
            color: '#fff',
            cursor: 'pointer',
            zIndex: 1250,
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45)',
            textDecoration: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': { transform: 'scale(1.08)', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.6)' },
            '&:active': { transform: 'scale(0.95)' },
          }}
        >
          <Phone />
        </Box>
      )}
      <Box
        component="a"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        sx={{
          position: 'fixed',
          right: 16,
          bottom: 96,
          width: 52,
          height: 52,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#25D366',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 1250,
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': { transform: 'scale(1.08)', boxShadow: '0 8px 24px rgba(37, 211, 102, 0.6)' },
          '&:active': { transform: 'scale(0.95)' },
        }}
      >
        <WhatsApp />
      </Box>
      <ChatBot />
    </>
  );
};

export default FloatingActions;
