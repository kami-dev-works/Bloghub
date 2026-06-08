import { useState, useRef, useEffect } from 'react';
import { Box, Paper, IconButton, TextField, Typography, Stack, Avatar, CircularProgress } from '@mui/material';
import Chat from '@mui/icons-material/Chat';
import Close from '@mui/icons-material/Close';
import Send from '@mui/icons-material/Send';
import SmartToy from '@mui/icons-material/SmartToy';
import { motion, AnimatePresence } from 'framer-motion';
import { getBotReply, chatbotContext } from '../lib/chatbotContext';

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, from: 'bot', text: `Hi! I'm ${chatbotContext.name}. Ask me anything about BlogHub — I can help with services, accounts, policies, and more.` },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const listRef = useRef(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    if (open) setUnread(0);
  }, [open, messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const id = nextId.current++;
    setMessages(prev => [...prev, { id, from: 'user', text }]);
    setInput('');
    setTyping(true);
    const delay = 500 + Math.min(1500, text.length * 20);
    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages(prev => [...prev, { id: nextId.current++, from: 'bot', text: reply }]);
      setTyping(false);
      if (!open) setUnread(u => u + 1);
    }, delay);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              right: 16,
              bottom: 242,
              width: 340,
              maxWidth: 'calc(100vw - 32px)',
              height: 460,
              maxHeight: 'calc(100vh - 200px)',
              zIndex: 1300,
            }}
          >
            <Paper
              elevation={8}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                border: 1,
                borderColor: 'var(--color-border)',
                bgcolor: 'var(--color-surface)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  px: 2,
                  py: 1.4,
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  color: '#fff',
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
                  <SmartToy fontSize="small" />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.1 }} noWrap>
                    {chatbotContext.name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.85 }} noWrap>
                    Demo · Typically replies instantly
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#fff' }} aria-label="Close chat">
                  <Close fontSize="small" />
                </IconButton>
              </Box>

              <Box ref={listRef} sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5, bgcolor: 'var(--color-background)' }}>
                <Stack spacing={1.2}>
                  {messages.map((m) => (
                    <Box
                      key={m.id}
                      sx={{
                        display: 'flex',
                        justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          px: 1.5,
                          py: 1,
                          maxWidth: '80%',
                          borderRadius: 2,
                          bgcolor: m.from === 'user' ? 'var(--color-primary)' : 'var(--color-surface)',
                          color: m.from === 'user' ? 'var(--color-buttonPrimaryText)' : 'var(--color-text)',
                          border: m.from === 'user' ? 'none' : 1,
                          borderColor: 'var(--color-border)',
                          fontSize: '0.9rem',
                          lineHeight: 1.4,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {m.text}
                      </Paper>
                    </Box>
                  ))}
                  {typing && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <Paper
                        elevation={0}
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderRadius: 2,
                          bgcolor: 'var(--color-surface)',
                          border: 1,
                          borderColor: 'var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <CircularProgress size={14} thickness={5} />
                        <Typography variant="caption" sx={{ color: 'var(--color-textSecondary)', ml: 0.5 }}>
                          Bot is typing…
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Box
                sx={{
                  p: 1.2,
                  borderTop: 1,
                  borderColor: 'var(--color-border)',
                  bgcolor: 'var(--color-surface)',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-end">
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    maxRows={3}
                    placeholder="Type your message…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKey}
                    inputProps={{ maxLength: 500 }}
                  />
                  <IconButton
                    color="primary"
                    onClick={send}
                    disabled={!input.trim() || typing}
                    sx={{
                      bgcolor: 'var(--color-primary)',
                      color: 'var(--color-buttonPrimaryText)',
                      '&:hover': { bgcolor: 'var(--color-buttonPrimaryHover)' },
                      '&.Mui-disabled': { bgcolor: 'var(--color-border)', color: 'var(--color-textSecondary)' },
                    }}
                    aria-label="Send message"
                  >
                    <Send fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{
          position: 'fixed',
          right: 16,
          bottom: 168,
          width: 52,
          height: 52,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'var(--color-primary)',
          color: 'var(--color-buttonPrimaryText)',
          cursor: 'pointer',
          zIndex: 1250,
          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': { transform: 'scale(1.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
          '&:active': { transform: 'scale(0.95)' },
        }}
        role="button"
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
      >
        {open ? <Close /> : <Chat />}
        {!open && unread > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              minWidth: 18,
              height: 18,
              borderRadius: '50%',
              bgcolor: 'var(--color-error, #EF4444)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 0.5,
              border: '2px solid var(--color-surface)',
            }}
          >
            {unread}
          </Box>
        )}
      </Box>
    </>
  );
};

export default ChatBot;
