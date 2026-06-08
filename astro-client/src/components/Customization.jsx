import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails,
  Paper, Grid, Chip, IconButton, Tooltip, Alert, Snackbar,
  useMediaQuery, useTheme,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Palette from '@mui/icons-material/Palette';
import RestartAlt from '@mui/icons-material/RestartAlt';
import Save from '@mui/icons-material/Save';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Brightness7 from '@mui/icons-material/Brightness7';
import Brightness4 from '@mui/icons-material/Brightness4';
import { useThemeContext } from '../stores/ThemeContext';
import { websiteSettingApi } from '../lib/api';
import { DEFAULT_THEME, PRESETS, mergeTheme, applyThemeAsCssVars } from '../lib/themePresets';

const SECTIONS = [
  {
    id: 'bg', label: 'Background & Surface', icon: '🎨',
    keys: ['background', 'surface'],
  },
  {
    id: 'text', label: 'Text & Headings', icon: '🔤',
    keys: ['text', 'textSecondary', 'heading'],
  },
  {
    id: 'links', label: 'Links', icon: '🔗',
    keys: ['link', 'linkHover'],
  },
  {
    id: 'borders', label: 'Borders', icon: '📦',
    keys: ['border'],
  },
  {
    id: 'buttons', label: 'Buttons', icon: '🔘',
    keys: ['buttonPrimary', 'buttonPrimaryHover', 'buttonPrimaryText', 'buttonSecondary', 'buttonSecondaryHover', 'buttonSecondaryText'],
  },
  {
    id: 'header', label: 'Header & Footer', icon: '📐',
    keys: ['headerBg', 'headerText', 'footerBg', 'footerText'],
  },
  {
    id: 'semantic', label: 'Accents & Status', icon: '💡',
    keys: ['accent', 'success', 'error', 'warning'],
  },
];

const COLOR_LABELS = {
  primary: 'Primary', secondary: 'Secondary',
  background: 'Background', surface: 'Surface / Card',
  text: 'Body Text', textSecondary: 'Secondary Text', heading: 'Headings',
  link: 'Link', linkHover: 'Link Hover',
  border: 'Border',
  buttonPrimary: 'Primary Button', buttonPrimaryHover: 'Primary Hover',
  buttonPrimaryText: 'Primary Button Text',
  buttonSecondary: 'Secondary Button', buttonSecondaryHover: 'Secondary Hover',
  buttonSecondaryText: 'Secondary Button Text',
  headerBg: 'Header Background', headerText: 'Header Text',
  footerBg: 'Footer Background', footerText: 'Footer Text',
  accent: 'Accent', success: 'Success', error: 'Error', warning: 'Warning',
};

function ColorField({ label, value, onChange, mode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: 40, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer',
          padding: 0, background: 'transparent',
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function ThemePreview({ palette, mode }) {
  const isDark = mode === 'dark';
  const bg = palette.background;
  const surface = palette.surface;
  const text = palette.text;
  const textSec = palette.textSecondary;
  const heading = palette.heading;
  const link = palette.link;
  const border = palette.border;
  const btnPri = palette.buttonPrimary;
  const btnPriHover = palette.buttonPrimaryHover;
  const btnPriText = palette.buttonPrimaryText;
  const btnSec = palette.buttonSecondary;
  const success = palette.success;
  const error = palette.error;
  const warning = palette.warning;
  const accent = palette.accent;

  return (
    <Box sx={{
      bgcolor: bg, color: text, p: 2, borderRadius: 2,
      border: '1px solid', borderColor: border,
      transition: 'all 0.3s ease', height: '100%',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {isDark ? <Brightness4 fontSize="small" /> : <Brightness7 fontSize="small" />}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: heading }}>
          {isDark ? 'Dark Mode Preview' : 'Light Mode Preview'}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: surface, p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: border, mb: 1.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: heading, mb: 0.5 }}>
          Heading Level Text
        </Typography>
        <Typography variant="caption" sx={{ color: text, display: 'block', mb: 0.25 }}>
          Body text example showing how content appears on this surface.
        </Typography>
        <Typography variant="caption" sx={{ color: textSec }}>
          Secondary text with less emphasis.
        </Typography>
        <Box sx={{ mt: 0.75 }}>
          <Typography variant="caption" component="a" href="#" sx={{ color: link, textDecoration: 'underline' }}>
            Sample Link Text
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ px: 1.5, py: 0.5, bgcolor: btnPri, color: btnPriText, borderRadius: 1, fontSize: '0.75rem', fontWeight: 600 }}>
          Primary
        </Box>
        <Box sx={{ px: 1.5, py: 0.5, bgcolor: btnSec, color: '#fff', borderRadius: 1, fontSize: '0.75rem', fontWeight: 600 }}>
          Secondary
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip label="Success" size="small" sx={{ bgcolor: success, color: '#fff', fontSize: '0.65rem' }} />
        <Chip label="Error" size="small" sx={{ bgcolor: error, color: '#fff', fontSize: '0.65rem' }} />
        <Chip label="Warning" size="small" sx={{ bgcolor: warning, color: '#000', fontSize: '0.65rem' }} />
        <Chip label="Accent" size="small" sx={{ bgcolor: accent, color: '#fff', fontSize: '0.65rem' }} />
      </Box>
    </Box>
  );
}

export default function Customization() {
  const { customTheme, updateTheme } = useThemeContext();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [theme, setTheme] = useState(() => ({ ...customTheme }));
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (customTheme) {
      setTheme({ ...customTheme });
    }
  }, [customTheme]);

  const updateColor = (mode, key, value) => {
    setTheme((prev) => ({
      ...prev,
      [mode]: { ...prev[mode], [key]: value },
    }));
  };

  const applyPreset = (preset) => {
    if (!preset.theme) {
      setTheme({ ...DEFAULT_THEME });
    } else {
      setTheme(mergeTheme(preset.theme));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { theme };
      await websiteSettingApi.update(payload);
      updateTheme(theme);
      setSnackbar({ open: true, message: 'Theme saved successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save theme: ' + (err.message || 'Unknown error'), severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setTheme({ ...DEFAULT_THEME });
  };

  const isCurrentPreset = (presetId) => {
    if (!theme) return presetId === 'default';
    return theme.preset === presetId;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Palette sx={{ color: 'primary.main', fontSize: { xs: 22, sm: 28 } }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>Theme Customization</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Customize colors for light and dark mode. Changes reflect immediately in previews.
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          <CheckCircle fontSize="small" color="primary" /> Color Presets
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {PRESETS.map((p) => (
            <Chip
              key={p.id}
              label={`${p.name}${isMobile ? '' : ` - ${p.desc}`}`}
              onClick={() => applyPreset(p)}
              variant={isCurrentPreset(p.id) ? 'filled' : 'outlined'}
              color={isCurrentPreset(p.id) ? 'primary' : 'default'}
              size="small"
              sx={{ fontWeight: 500, cursor: 'pointer', fontSize: { xs: '0.7rem', sm: '0.8125rem' } }}
            />
          ))}
          <Tooltip title="Reset to defaults">
            <IconButton size="small" onClick={resetToDefaults} sx={{ ml: 0.5 }}>
              <RestartAlt fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {SECTIONS.map((section) => (
              <Accordion key={section.id} defaultExpanded={section.id === 'bg'} disableGutters sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                    {section.icon} {section.label}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, px: { xs: 1, sm: 2 } }}>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'warning.main', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                        <Brightness7 fontSize="inherit" /> Light Mode
                      </Typography>
                      {section.keys.map((key) => (
                        <ColorField
                          key={'light-' + key}
                          label={COLOR_LABELS[key] || key}
                          value={theme?.light?.[key] || DEFAULT_THEME.light[key]}
                          onChange={(v) => updateColor('light', key, v)}
                          mode="light"
                        />
                      ))}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'info.main', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                        <Brightness4 fontSize="inherit" /> Dark Mode
                      </Typography>
                      {section.keys.map((key) => (
                        <ColorField
                          key={'dark-' + key}
                          label={COLOR_LABELS[key] || key}
                          value={theme?.dark?.[key] || DEFAULT_THEME.dark[key]}
                          onChange={(v) => updateColor('dark', key, v)}
                          mode="dark"
                        />
                      ))}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle fontSize="small" color="primary" /> Live Preview
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ThemePreview palette={theme?.light || DEFAULT_THEME.light} mode="light" />
            <ThemePreview palette={theme?.dark || DEFAULT_THEME.dark} mode="dark" />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saving}
              sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem' }}
            >
              {saving ? 'Saving...' : 'Save Theme'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
