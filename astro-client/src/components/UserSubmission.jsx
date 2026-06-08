import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Autocomplete,
} from '@mui/material';
import Send from '@mui/icons-material/Send';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import { useThemeContext } from '../stores/ThemeContext';
import { useLanguage } from '../stores/LanguageContext';
import { blogApi } from '../lib/api';
import BlogImageUpload from './BlogImageUpload';
import RichTextEditor from './RichTextEditor';

const categoryKeywords = {
  technology: [
    'tech', 'technology', 'ai', 'artificial intelligence', 'software', 'computer', 'digital', 
    'internet', 'app', 'application', 'smartphone', 'phone', 'laptop', 'robot',
    'cyber', 'data', 'cloud', 'startup', 'innovation', 'coding', 'programming', 'developer',
    'google', 'microsoft', 'apple', 'meta', 'facebook', 'twitter', 'instagram', 'elon musk',
    'openai', 'chatgpt', 'machine learning', 'blockchain', 'crypto', 'cryptocurrency', 'bitcoin',
  ],
  sports: [
    'sports', 'football', 'cricket', 'basketball', 'tennis', 'hockey', 'rugby', 'golf',
    'player', 'team', 'match', 'game', 'score', 'goal', 'win', 'lose', 'championship',
    'messi', 'ronaldo', 'kohli', 'dhoni', 'sachin', 'rohit', 'icc', 'wimbledon',
    'nba', 'nfl', 'fitness', 'gym', 'workout', 'running', 'jogging', 'cycling', 'skiing',
  ],
  business: [
    'business', 'economy', 'market', 'stock', 'share', 'investment', 'finance', 'banking',
    'money', 'dollar', 'rupee', 'euro', 'pound', 'currency', 'trading', 'wall street',
    'sensex', 'nifty', 'nasdaq', 'dow jones', 'ipo', 'shares', 'bonds', 'mutual fund',
    'gdp', 'inflation', 'recession', 'growth', 'profit', 'loss', 'revenue', 'earnings',
  ],
  entertainment: [
    'entertainment', 'movie', 'film', 'cinema', 'bollywood', 'hollywood', 'tollywood',
    'actor', 'actress', 'star', 'celebrity', 'celeb', 'famous', 'viral', 'trend',
    'music', 'song', 'album', 'singer', 'band', 'concert', 'festival', 'dj',
  ],
  health: [
    'health', 'medical', 'medicine', 'doctor', 'hospital', 'treatment', 'therapy', 'surgery',
    'disease', 'illness', 'infection', 'virus', 'pandemic', 'covid', 'corona', 'cancer',
    'diabetes', 'heart', 'cardiac', 'blood pressure', 'stroke', 'brain', 'mental health',
  ],
  science: [
    'science', 'research', 'discovery', 'experiment', 'laboratory', 'lab',
    'nasa', 'isro', 'space', 'astronaut', 'satellite', 'rocket', 'mission', 'mars',
    'moon', 'galaxy', 'universe', 'stars', 'planet', 'asteroid', 'comet', 'black hole',
  ],
  world: [
    'world', 'international', 'global', 'foreign', 'country', 'nations', 'diplomacy',
    'war', 'conflict', 'peace', 'treaty', 'summit', 'meeting', 'g20', 'g7', 'united nations',
  ],
  local: [
    'local', 'city', 'town', 'village', 'district', 'neighborhood', 'community',
    'municipal', 'corporation', 'council', 'traffic', 'road', 'highway', 'metro',
  ],
};

const commonWords = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
  'can', 'will', 'now', 'new', 'old', 'top', 'big', 'small', 'first', 'last',
  'due', 'over', 'set', 'time', 'year', 'years', 'day', 'days', 'make', 'like',
]);

const detectCategory = (title) => {
  if (!title || title.length < 3) return null;
  const lowerTitle = title.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        score += keyword.split(' ').length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }
  return bestScore >= 1 ? bestMatch : null;
};

const extractTags = (title) => {
  if (!title || title.length < 3) return [];
  const words = title.toLowerCase()
    .split(/[\s,.!?;:'"()\-]+/)
    .filter(word => word.length >= 3 && !commonWords.has(word) && !/^\d+$/.test(word));
  return [...new Set(words)].slice(0, 8);
};

const UserSubmission = ({ onSuccess }) => {
  const { isDark } = useThemeContext();
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('world');
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(null);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [tagsInput, setTagsInput] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    const detected = detectCategory(title);
    setSuggestedCategory(detected);
    const tags = extractTags(title);
    if (tags.length > 0) {
      setSuggestedTags(tags);
    } else {
      setSuggestedTags([]);
    }
  }, [title]);

  const handleImageUpload = (imageUrl) => {
    setImage(imageUrl);
  };

  const applyCategorySuggestion = () => {
    if (suggestedCategory) {
      setCategory(suggestedCategory);
      setSuggestedCategory(null);
    }
  };

  const applyTagsSuggestion = (tag) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setTagsInput(newTags.join(', '));
      setSuggestedTags(prev => prev.filter(t => t !== tag));
    }
  };

  const applyAllTags = () => {
    if (suggestedTags.length > 0) {
      const newTags = [...new Set([...tags, ...suggestedTags])];
      setTags(newTags);
      setTagsInput(newTags.join(', '));
      setSuggestedTags([]);
    }
  };

  const removeSuggestedCategory = () => {
    setSuggestedCategory(null);
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError(t('title') + ' is required');
      titleRef.current?.focus();
      return false;
    }
    if (title.length < 10) {
      setError(t('title') + ' must be at least 10 characters');
      titleRef.current?.focus();
      return false;
    }
    if (!content.trim()) {
      setError(t('content') + ' is required');
      return false;
    }
    if (content.length < 50) {
      setError(t('content') + ' must be at least 50 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const tagsArray = tags.filter(tag => tag.trim().length > 0);
      await blogApi.submit({
        title: title.trim(),
        description: description.trim() || title,
        content: content.trim(),
        category: category,
        tags: tagsArray,
        image: image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setContent('');
      setCategory('world');
      setTags([]);
      setImage('');
      setTagsInput('');
      setSuggestedCategory(null);
      setSuggestedTags([]);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setCategory('world');
    setTags([]);
    setImage('');
    setTagsInput('');
    setError(null);
    setSuccess(false);
    setSuggestedCategory(null);
    setSuggestedTags([]);
  };

  const showSuggestions = title.length >= 5 && (suggestedCategory || suggestedTags.length > 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {t('submitBlogTitle')} / Blog
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('submitBlogSubtitle')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
        Your submission has been received! It will be reviewed by our editorial team.
      </Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          inputRef={titleRef}
          label={t('title')}
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 1 }}
          placeholder="Enter a compelling title for your article"
          inputProps={{ maxLength: 200 }}
          helperText={`${title.length}/200 characters`}
        />

        {showSuggestions && (
          <Box sx={{ mb: 2, p: 2, bgcolor: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(13, 148, 136, 0.1)', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AutoAwesome sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={600} color="primary.main">AI Suggestions</Typography>
            </Box>
            {suggestedCategory && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">Category:</Typography>
                <Chip icon={<AutoAwesome sx={{ fontSize: 14 }} />} label={t(suggestedCategory) || suggestedCategory} size="small" color="primary" variant="outlined" onClick={applyCategorySuggestion} onDelete={removeSuggestedCategory} sx={{ cursor: 'pointer' }} />
              </Box>
            )}
            {suggestedTags.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">Tags:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {suggestedTags.slice(0, 5).map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" onClick={() => applyTagsSuggestion(tag)} sx={{ cursor: 'pointer' }} />
                  ))}
                  {suggestedTags.length > 5 && (
                    <Chip label={`+${suggestedTags.length - 5}`} size="small" variant="outlined" onClick={applyAllTags} sx={{ cursor: 'pointer' }} />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}

        <TextField fullWidth label="Short Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={2} sx={{ mb: 2 }} placeholder="A brief summary (shown in blog cards)" inputProps={{ maxLength: 500 }} helperText={`${description.length}/500 characters`} />

        <Box sx={{ mb: 2 }}><Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>{t('Content/Full Description')} *</Typography><RichTextEditor value={content} onChange={(val) => setContent(val)} height={300} /></Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('category')} *</InputLabel>
          <Select name="category" value={category} onChange={(e) => setCategory(e.target.value)} label={t('category') + ' *'} required>
            {Object.keys(categoryKeywords).map((key) => (
              <MenuItem key={key} value={key}>{t(key) || key.charAt(0).toUpperCase() + key.slice(1)}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={tags}
          onChange={(event, newValue) => { setTags(newValue); setTagsInput(newValue.join(', ')); }}
          inputValue={tagsInput}
          onInputChange={(event, newValue) => setTagsInput(newValue)}
          renderTags={(value, getTagProps) => value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} key={option} size="small" sx={{ bgcolor: isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(13, 148, 136, 0.1)' }} />
          ))}
          renderInput={(params) => (
            <TextField {...params} name="tags" label="Tags" placeholder="Type tag and press Enter" helperText="Press Enter after each tag" />
          )}
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 3 }}>
          <BlogImageUpload onUploadComplete={handleImageUpload} label="Featured Image (Optional)" />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleClear}>{t('cancel')}</Button>
          <Button type="submit" variant="contained" disabled={loading} endIcon={loading ? <CircularProgress size={20} /> : <Send />}>
            {loading ? 'Submitting...' : t('submit')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserSubmission;