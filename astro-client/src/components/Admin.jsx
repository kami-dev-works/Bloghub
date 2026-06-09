import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Pagination,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import Dashboard from '@mui/icons-material/Dashboard';
import People from '@mui/icons-material/People';
import Article from '@mui/icons-material/Article';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Add from '@mui/icons-material/Add';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Pending from '@mui/icons-material/Pending';
import LockReset from '@mui/icons-material/LockReset';
import LocalOffer from '@mui/icons-material/LocalOffer';
import Campaign from '@mui/icons-material/Campaign';
import Build from '@mui/icons-material/Build';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import Settings from '@mui/icons-material/Settings';
import Palette from '@mui/icons-material/Palette';
import { motion } from 'framer-motion';
import { useThemeContext } from '../stores/ThemeContext';
import { useData } from '../stores/DataContext';
import { userApi, blogApi, adsApi, notificationApi, serviceApi, serviceCategoryApi, websiteSettingApi, sliderApi, uploadApi } from '../lib/api';
import BlogImageUpload from './BlogImageUpload';
import Customization from './Customization';
import SliderManager from './SliderManager';
import WordLimitedTextField from './WordLimitedTextField';
import { countWords } from '../lib/wordLimit';
import ImageCropper2 from './ImageCroper/ImageCropper2';
  const apiBase = import.meta.env.API_URL || 'http://localhost:5000';
const categories = [
  { value: 'politics', label: 'Politics' },
  { value: 'sports', label: 'Sports' },
  { value: 'technology', label: 'Technology' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'local', label: 'Local' },
  { value: 'business', label: 'Business' },
  { value: 'health', label: 'Health' },
  { value: 'science', label: 'Science' },
];

const commonWords = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
  'can', 'will', 'now', 'new', 'old', 'top', 'big', 'small', 'first', 'last',
  'due', 'over', 'set', 'time', 'year', 'years', 'day', 'days', 'make', 'like',
]);

const extractTags = (title) => {
  if (!title || title.length < 3) return [];
  const words = title.toLowerCase()
    .split(/[\s,.!?;:'"()\-]+/)
    .filter(word => word.length >= 3 && !commonWords.has(word) && !/^\d+$/.test(word));
  return [...new Set(words)].slice(0, 8);
};

const seoStopWords = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
  'because', 'as', 'until', 'while', 'about', 'between', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'having', 'do', 'does', 'did', 'doing', 'would', 'could', 'should', 'may', 'might',
  'shall', 'can', 'need', 'dare', 'ought', 'used', 'this', 'that', 'these', 'those', 'i', 'it',
  'its', 'my', 'our', 'your', 'his', 'her', 'their', 'me', 'us', 'we', 'you', 'he', 'she', 'they',
  'am', 'get', 'make', 'got', 'made', 'also', 'well', 'will', 'what', 'which', 'who', 'whom',
]);

const extractSeoTitles = (title) => {
  if (!title || title.length < 5) return [];
  const raw = title.replace(/[^\w\s-]/g, '').replace(/-/g, ' ');
  const words = raw.split(/\s+/).filter(Boolean);
  const phrases = new Set();
  const meaningful = words.filter(w => w.length > 2 && !seoStopWords.has(w.toLowerCase()));
  meaningful.forEach(w => { phrases.add(w.charAt(0).toUpperCase() + w.slice(1)); });
  for (let i = 0; i < meaningful.length - 1; i++) {
    const p = meaningful.slice(i, i + 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (p.length > 4) phrases.add(p);
  }
  for (let i = 0; i < meaningful.length - 2; i++) {
    const p = meaningful.slice(i, i + 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (p.length > 8 && p.length < 60) phrases.add(p);
  }
  const titleWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  phrases.add(titleWords.join(' '));
  return Array.from(phrases).slice(0, 8);
};

const keywordCategoryMap = {
  politics: ['politics', 'political', 'government', 'election', 'minister', 'president', 'prime minister', 'parliament', 'vote', 'democracy', 'policy', 'law', 'legal', 'congress', 'party', 'campaign', 'diplomat', 'senate', 'constitution', 'republic', 'democrat', 'republican', 'biden', 'trump', 'modi', 'bill', 'act', 'amendment', 'senator', 'governor'],
  sports: ['sports', 'sport', 'cricket', 'football', 'soccer', 'tennis', 'basketball', 'baseball', 'game', 'match', 'tournament', 'championship', 'olympic', 'player', 'coach', 'team', 'score', 'goal', 'champion', 'league', 'stadium', 'athlete', 'medal', 'fifa', 'nba', 'nfl', 'ipl', 'bowling', 'batting'],
  technology: ['tech', 'technology', 'software', 'hardware', 'app', 'iphone', 'android', 'computer', 'digital', 'ai', 'artificial intelligence', 'programming', 'code', 'data', 'cyber', 'robot', 'automation', 'blockchain', 'crypto', 'bitcoin', 'internet', 'website', 'server', 'cloud', 'mobile', 'device', 'gadget', 'innovation', 'startup', 'coding', 'developer', 'api'],
  entertainment: ['entertainment', 'movie', 'film', 'music', 'song', 'actor', 'actress', 'celebrity', 'show', 'tv', 'television', 'concert', 'dance', 'art', 'artist', 'theater', 'cinema', 'hollywood', 'bollywood', 'netflix', 'series', 'comedy', 'drama', 'oscar', 'award', 'singer', 'director'],
  local: ['local', 'city', 'town', 'community', 'neighborhood', 'street', 'area', 'region', 'village', 'district', 'county', 'municipal', 'civic', 'public', 'park', 'school', 'college', 'university'],
  business: ['business', 'finance', 'economy', 'economic', 'market', 'stock', 'trading', 'investment', 'bank', 'banking', 'money', 'corporate', 'company', 'entrepreneur', 'revenue', 'profit', 'sales', 'industry', 'commercial', 'trade', 'fund', 'funding', 'venture', 'startup', 'merger', 'acquisition'],
  health: ['health', 'medical', 'doctor', 'hospital', 'disease', 'covid', 'vaccine', 'medicine', 'treatment', 'surgery', 'patient', 'wellness', 'fitness', 'nutrition', 'diet', 'mental', 'therapy', 'clinical', 'yoga', 'exercise', 'workout'],
  science: ['science', 'scientific', 'research', 'discovery', 'space', 'nasa', 'mars', 'planet', 'astronomy', 'physics', 'chemistry', 'biology', 'genetic', 'evolution', 'nuclear', 'experiment', 'lab', 'scientist', 'study', 'universe', 'climate', 'environment'],
};

const suggestCategory = (title, knownCategories = null) => {
  if (!title || title.length < 3) return null;
  const lower = title.toLowerCase();
  const words = lower.split(/[\s,.!?;:'"()\-]+/).filter(w => w.length > 2);

  if (knownCategories && knownCategories.length > 0) {
    let best = null, bestScore = 0;
    for (const cat of knownCategories) {
      const catName = (cat.name || cat.value || cat).toLowerCase();
      let score = 0;
      for (const word of words) {
        if (catName.includes(word) || word.includes(catName)) score += word.length;
      }
      if (lower.includes(catName)) score += 5;
      if (score > bestScore) { bestScore = score; best = cat.value || cat; }
    }
    return bestScore > 2 ? best : null;
  }

  let best = null, bestScore = 0;
  for (const [category, keywords] of Object.entries(keywordCategoryMap)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        score += kw.length + (lower.startsWith(kw) || lower.includes(' ' + kw) ? 3 : 0);
      }
    }
    if (score > bestScore) { bestScore = score; best = category; }
  }
  return bestScore > 0 ? best : null;
};

const Admin = () => {
  const { isDark } = useThemeContext();
  const { isAdmin, isAuthenticated, showToast } = useData();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogDialog, setBlogDialog] = useState({ open: false, blog: null });
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [suggestedSeoTitles, setSuggestedSeoTitles] = useState([]);
  const [resetPasswordDialog, setResetPasswordDialog] = useState({ open: false, user: null });
  const [newPassword, setNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [blogForm, setBlogForm] = useState({ title: '', description: '', content: '', htmlContent: '', image: '', category: 'technology', tags: '', isFeatured: false, views: 0, likes: 0, seoTitles: '', metaDescription: '', metaTitle: '', ogImage: '', canonicalUrl: '', keywords: '', faq: [] });
  const [contentMode, setContentMode] = useState('visual');
  const [serviceContentMode, setServiceContentMode] = useState('visual');
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [blogTotalPages, setBlogTotalPages] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [ads, setAds] = useState([]);
  const [adPage, setAdPage] = useState(1);
  const [adTotalPages, setAdTotalPages] = useState(1);
  const [adDialog, setAdDialog] = useState({ open: false });
  const [adForm, setAdForm] = useState({ title: '', description: '', image: '', redirectLink: '' });
  const [services, setServices] = useState([]);
  const [servicePage, setServicePage] = useState(1);
  const [serviceTotalPages, setServiceTotalPages] = useState(1);
  const [serviceDialog, setServiceDialog] = useState({ open: false, service: null });
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', content: '', htmlContent: '', image: '', category: '', price: 0, isFeatured: false, tags: '', seoTitles: '', metaDescription: '', metaTitle: '', ogImage: '', canonicalUrl: '', keywords: '', faq: [] });
  const [serviceCategories, setServiceCategories] = useState([]);
  const [categoryDialog, setCategoryDialog] = useState({ open: false });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [notificationText, setNotificationText] = useState('');
  const [notificationTextHi, setNotificationTextHi] = useState('');
  const [notificationSaved, setNotificationSaved] = useState(false);
  const [websiteSettings, setWebsiteSettings] = useState(null);
  const [CkEditor, setCkEditor] = useState(null);




  const [fileName, setFileName] = useState("");
  const [fileContant, setfileContant] = useState("");
  const [finalImg, setfinalImg] = useState("");
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [fileNameB, setFileNameB] = useState("");
  const [fileContantB, setfileContantB] = useState("");
  const [finalImgB, setfinalImgB] = useState("");
  const [croppedImageUrlB, setCroppedImageUrlB] = useState(null);
  const [fileNameB2, setFileNameB2] = useState("");
  const [fileContantB2, setfileContantB2] = useState("");
  const [finalImgB2, setfinalImgB2] = useState("");
  const [croppedImageUrlB2, setCroppedImageUrlB2] = useState(null);
  const [fileNameB3, setFileNameB3] = useState("");
  const [fileContantB3, setfileContantB3] = useState("");
  const [finalImgB3, setfinalImgB3] = useState("");
  const [croppedImageUrlB3, setCroppedImageUrlB3] = useState(null);
 

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    else if (!isAdmin) navigate('/');
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) { fetchStats(); fetchUsers(); fetchAllBlogs(); fetchPendingBlogs(); fetchAds(); fetchNotification(); fetchServices(); fetchServiceCategories(); fetchWebsiteSettings(); }
  }, [isAdmin]);

  const [suggestedServiceTags, setSuggestedServiceTags] = useState([]);
  const [suggestedServiceSeoTitles, setSuggestedServiceSeoTitles] = useState([]);

  useEffect(() => {
    const current = blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    setSuggestedTags(prev => prev.filter(t => !current.includes(t)));
  }, [blogForm.tags]);

  useEffect(() => {
    const current = serviceForm.tags ? serviceForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    setSuggestedServiceTags(prev => prev.filter(t => !current.includes(t)));
  }, [serviceForm.tags]);

  useEffect(() => {
    if (activeTab === 5 && !CkEditor) {
      import('./CKEditorWrapper').then(m => setCkEditor(() => m.default));
    }
  }, [activeTab]);

  const handleBlogTitleChange = (title) => {
    const currentTags = blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const rawTags = extractTags(title);
    setSuggestedTags(rawTags.filter(t => !currentTags.includes(t)));
    const currentSeo = blogForm.seoTitles ? blogForm.seoTitles.split(',').map(t => t.trim()).filter(Boolean) : [];
    const rawSeo = extractSeoTitles(title);
    setSuggestedSeoTitles(rawSeo.filter(t => !currentSeo.includes(t)));
    setBlogForm(prev => ({ ...prev, title }));
    const cat = suggestCategory(title);
    if (cat && categories.some(c => c.value === cat)) {
      setBlogForm(prev => ({ ...prev, category: cat }));
    }
  };

  const handleServiceTitleChange = (title) => {
    const currentTags = serviceForm.tags ? serviceForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const rawTags = extractTags(title);
    setSuggestedServiceTags(rawTags.filter(t => !currentTags.includes(t)));
    const currentSeo = serviceForm.seoTitles ? serviceForm.seoTitles.split(',').map(t => t.trim()).filter(Boolean) : [];
    const rawSeo = extractSeoTitles(title);
    setSuggestedServiceSeoTitles(rawSeo.filter(t => !currentSeo.includes(t)));
    setServiceForm(prev => ({ ...prev, title }));
    const cat = suggestCategory(title, serviceCategories);
    if (cat && serviceCategories.some(c => (c.value || c) === cat)) {
      setServiceForm(prev => ({ ...prev, category: cat }));
    }
  };

  const fetchStats = async () => {
    try { const response = await userApi.getStats(); setStats(response.data); } catch (err) { console.error('Failed to fetch stats:', err); }
  };

  const fetchUsers = async (page = 1) => {
    try { const response = await userApi.getAllWithPasswords({ page, limit: 10 }); setUsers(response.data.users || []); setUserTotalPages(response.data.pagination?.pages || 1); } catch (err) { console.error('Failed to fetch users:', err); }
  };

  const fetchAllBlogs = async (page = 1) => {
    try { const response = await blogApi.getAll({ page, limit: 10 }); setBlogs(response.data.blogs); setBlogTotalPages(response.data.pagination?.pages || 1); } catch (err) { console.error('Failed to fetch blogs:', err); } finally { setLoading(false); }
  };

  const fetchPendingBlogs = async (page = 1) => {
    try { const response = await blogApi.getPending({ page, limit: 12 }); setPendingBlogs(response.data.blogs); setPendingTotalPages(response.data.pagination?.pages || 1); } catch (err) { console.error('Failed to fetch pending blogs:', err); }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try { await userApi.deleteUser(userId); setUsers(users.filter(u => u._id !== userId)); showToast('User deleted', 'success'); } catch (err) { showToast('Failed to delete user', 'error'); }
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Delete this blog?')) {
      try { await blogApi.delete(blogId); setBlogs(blogs.filter(n => n._id !== blogId)); showToast('Blog deleted', 'success'); } catch (err) { showToast('Failed to delete blog', 'error'); }
    }
  };

  const handleApproveBlog = async (blogId) => {
    try { await blogApi.approve(blogId); setPendingBlogs(pendingBlogs.filter(n => n._id !== blogId)); showToast('Blog approved', 'success'); fetchAllBlogs(); } catch (err) { showToast('Failed to approve', 'error'); }
  };

  const handleRejectBlog = async (blogId) => {
    if (window.confirm('Reject this blog?')) {
      try { await blogApi.reject(blogId); setPendingBlogs(pendingBlogs.filter(n => n._id !== blogId)); showToast('Blog rejected', 'info'); } catch (err) { showToast('Failed to reject', 'error'); }
    }
  };

  const handleOpenBlogDialog = (blogItem = null) => {
    if (!CkEditor) import('./CKEditorWrapper').then(m => setCkEditor(() => m.default));
    setLoading(true);
    if (blogItem) {
      setContentMode(blogItem.contentType || 'visual');
      setBlogForm({ title: blogItem.title, description: blogItem.description, content: blogItem.content, htmlContent: blogItem.htmlContent || '', image: blogItem.image || '', category: blogItem.category, tags: blogItem.tags?.join(', ') || '', isFeatured: blogItem.isFeatured || false, views: blogItem.views || 0, likes: blogItem.likes?.length || 0, seoTitles: blogItem.seoTitles?.join(', ') || '', metaDescription: blogItem.metaDescription || '', metaTitle: blogItem.metaTitle || '', ogImage: blogItem.ogImage || '', canonicalUrl: blogItem.canonicalUrl || '', keywords: blogItem.keywords?.join(', ') || '', faq: blogItem.faq || [] });
      const currentTags = blogItem.tags || [];
      setSuggestedTags(extractTags(blogItem.title).filter(t => !currentTags.includes(t)));
      const currentSeo = blogItem.seoTitles || [];
      setSuggestedSeoTitles(extractSeoTitles(blogItem.title).filter(t => !currentSeo.includes(t)));
       setCroppedImageUrlB2(apiBase + blogItem.image);
    } else {
      setContentMode('visual');
      setBlogForm({ title: '', description: '', content: '', htmlContent: '', image: '', category: 'technology', tags: '', isFeatured: false, views: 0, likes: 0, seoTitles: '', metaDescription: '', metaTitle: '', ogImage: '', canonicalUrl: '', keywords: '', faq: [] });
      setSuggestedTags([]);
      setSuggestedSeoTitles([]);
    }
    setBlogDialog({ open: true, blog: blogItem });
  };

  const handleSaveBlog = async () => {
    try {
      if (countWords(blogForm.title) > 20) return showToast('Title exceeds 20 word limit', 'error');
      if (contentMode !== 'html-only' && countWords(blogForm.description) > 50) return showToast('Description exceeds 50 word limit', 'error');
      const isHtmlOnly = contentMode === 'html-only';

          if (!croppedImageUrlB2 && contentMode !== 'html-only') {
        showToast('Please select image', 'error')
        return

      }

      let imgs = ""

if (!isHtmlOnly && fileContantB2) {
  
  const response = await uploadApi?.uploadBlogImageNew({ fileContant: fileContantB2, fileName: fileNameB2 })

imgs =  response?.data?.image

}else{
  imgs = croppedImageUrlB2
}



      // console.log(response?.data);


      // await adsApi.create({ ...adForm, image: response?.data?.image });
      const data = {
        title: blogForm.title,
        description: isHtmlOnly ? '' : blogForm.description,
        content: isHtmlOnly ? '' : blogForm.content,
        htmlContent: isHtmlOnly ? blogForm.htmlContent : '',
        contentType: contentMode,
        image: isHtmlOnly ? '' : imgs,
        category: blogForm.category,
        tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        isFeatured: blogForm.isFeatured,
        seoTitles: blogForm.seoTitles ? blogForm.seoTitles.split(',').map(t => t.trim()).filter(Boolean) : [],
        metaDescription: blogForm.metaDescription,
        metaTitle: blogForm.metaTitle,
        ogImage: blogForm.ogImage,
        canonicalUrl: blogForm.canonicalUrl,
        keywords: blogForm.keywords ? blogForm.keywords.split(',').map(t => t.trim()).filter(Boolean) : [],
        faq: blogForm.faq
      };
      if (blogDialog.blog) {
        await blogApi.update(blogDialog.blog._id, data);
        await blogApi.updateStats(blogDialog.blog._id, { views: blogForm.views, likes: Array(blogForm.likes).fill(null) });
        showToast('Blog updated', 'success');
      } else {
        
        await blogApi.create(data); showToast('Blog created', 'success'); 
      
      
      }
      setBlogDialog({ open: false, blog: null }); fetchAllBlogs();
    } catch (err) { showToast('Failed to save', 'error'); }
  };

  const handleSaveBlogAsPending = async () => {
    try {
      if (countWords(blogForm.title) > 20) return showToast('Title exceeds 20 word limit', 'error');
      if (contentMode !== 'html-only' && countWords(blogForm.description) > 50) return showToast('Description exceeds 50 word limit', 'error');
      const isHtmlOnly = contentMode === 'html-only';

       if (!croppedImageUrlB2 && contentMode !== 'html-only') {
        showToast('Please select image', 'error')
        return

      }

      let imgs = ""

if (!isHtmlOnly) {
  
  const response = await uploadApi?.uploadBlogImageNew({ fileContant: fileContantB2, fileName: fileNameB2 })

imgs =  response?.data?.image

}
      const data = {
        title: blogForm.title,
        description: isHtmlOnly ? '' : blogForm.description,
        content: isHtmlOnly ? '' : blogForm.content,
        htmlContent: isHtmlOnly ? blogForm.htmlContent : '',
        contentType: contentMode,
        image: isHtmlOnly ? '' : blogForm.image,
        image: isHtmlOnly ? '' : imgs,
        category: blogForm.category,
        tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        isFeatured: blogForm.isFeatured,
        status: 'pending',
        seoTitles: blogForm.seoTitles ? blogForm.seoTitles.split(',').map(t => t.trim()).filter(Boolean) : [],
        metaDescription: blogForm.metaDescription,
        metaTitle: blogForm.metaTitle,
        ogImage: blogForm.ogImage,
        canonicalUrl: blogForm.canonicalUrl,
        keywords: blogForm.keywords ? blogForm.keywords.split(',').map(t => t.trim()).filter(Boolean) : [],
        faq: blogForm.faq
      };
      await blogApi.create(data);
      showToast('Blog saved as pending', 'info');
      setCroppedImageUrlB2(null)
      setBlogDialog({ open: false, blog: null }); fetchAllBlogs(); fetchPendingBlogs();
    } catch (err) { showToast('Failed to save', 'error'); }
  };

  const fetchNotification = async () => {
    try { const response = await notificationApi.get(); setNotificationText(response.data.text || ''); setNotificationTextHi(response.data.textHi || ''); } catch (err) { console.error('Failed to fetch notification:', err); }
  };

  const handleSaveNotification = async () => {
    try { await notificationApi.update({ text: notificationText, textHi: notificationTextHi }); setNotificationSaved(true); showToast('Notification updated', 'success'); setTimeout(() => setNotificationSaved(false), 2000); } catch (err) { showToast('Failed to save notification', 'error'); }
  };

  const handleClearNotification = async () => {
    try { await notificationApi.update({ text: '', textHi: '' }); setNotificationText(''); setNotificationTextHi(''); showToast('Notification cleared', 'info'); } catch (err) { showToast('Failed to clear notification', 'error'); }
  };

  const fetchAds = async () => {
    try { const response = await adsApi.getAllAdmin(); setAds(response.data); setAdTotalPages(Math.ceil(response.data.length / 10) || 1); } catch (err) { console.error('Failed to fetch ads:', err); }
  };

  const handleOpenAdDialog = () => {
    setAdForm({ title: '', description: '', image: '', redirectLink: '' });
    setAdDialog({ open: true });
  };

  const handleSaveAd = async () => {
    try {



      if (!croppedImageUrlB) {
        showToast('Please select image', 'error')
        return

      }


      console.log(fileContantB);
      console.log(fileNameB);

      const response = await uploadApi?.uploadBlogImageNew({ fileContant: fileContantB, fileName: fileNameB })


      console.log(response?.data);


      await adsApi.create({ ...adForm, image: response?.data?.image });
      setCroppedImageUrlB(null)
      showToast('Advertisement created', 'success');
      setAdDialog({ open: false });
      fetchAds();
    } catch (err) { showToast('Failed to create ad', 'error'); }
  };

  const handleDeleteAd = async (adId) => {
    if (window.confirm('Delete this advertisement?')) {
      try { await adsApi.delete(adId); setAds(ads.filter(a => a._id !== adId)); showToast('Ad deleted', 'success'); } catch (err) { showToast('Failed to delete ad', 'error'); }
    }
  };

  const fetchServices = async (page = 1) => {
    try { const response = await serviceApi.getAll({ page, limit: 10 }); setServices(response.data.services); setServiceTotalPages(response.data.pagination?.pages || 1); } catch (err) { console.error('Failed to fetch services:', err); }
  };

  const fetchServiceCategories = async () => {
    try { const response = await serviceCategoryApi.getAll(); setServiceCategories(response.data); } catch (err) { console.error('Failed to fetch service categories:', err); }
  };

  const fetchWebsiteSettings = async () => {
    try { const response = await websiteSettingApi.get(); setWebsiteSettings(response.data); } catch (err) { console.error('Failed to fetch website settings:', err); }
  };

  const handleSaveWebsiteSettings = async () => {
    if (!websiteSettings) return;
    try { await websiteSettingApi.update(websiteSettings); showToast('Website settings saved', 'success'); } catch (err) { showToast('Failed to save', 'error'); }
  };

  const handleAddCategory = async () => {


    console.log("Sdfsdf");

    if (!newCategoryName.trim()) {
      showToast('Please enter name', 'error')
      return
    };
    console.log("Sdfsdf---2");
    // uploadBlogImageNew
    // headers: { 'Content-Type': 'multipart/form-data' },
    try {
      console.log("Sdfsdf---3");
      // if (fileContant) formDatap.append("image", fileContant, fileName);
      if (!croppedImageUrl) {
        showToast('Please select image', 'error')
        return

      }
      console.log("Sdfsdf---4");
      console.log("Sdfsdf---4", fileContant);
      console.log("Sdfsdf---4", fileName);
      const response = await uploadApi?.uploadBlogImageNew({ fileContant, fileName })


      console.log(response?.data);

      await serviceCategoryApi.create({ name: newCategoryName.trim(), icon: response?.data?.image });
      setCroppedImageUrl(null)

      setNewCategoryName(''); setNewCategoryIcon(''); fetchServiceCategories(); showToast('Category added', 'success');
    } catch (err) { showToast('Failed to add category', 'error'); }
  };

  const handleDialogClose = () => {
    setCategoryDialog({ open: false });
    setNewCategoryName('');
    setNewCategoryIcon('');
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) { try { await serviceCategoryApi.delete(id); fetchServiceCategories(); showToast('Category deleted', 'success'); } catch (err) { showToast('Failed to delete', 'error'); } }
  };

  const handleOpenServiceDialog = (serviceItem = null) => {
    if (!CkEditor) import('./CKEditorWrapper').then(m => setCkEditor(() => m.default));
    if (serviceItem) {
      setServiceContentMode(serviceItem.contentType || 'visual');
      setServiceForm({ title: serviceItem.title, description: serviceItem.description, content: serviceItem.content || '', htmlContent: serviceItem.htmlContent || '', image: serviceItem.image || '', category: serviceItem.category, price: serviceItem.price || 0, isFeatured: serviceItem.isFeatured || false, tags: serviceItem.tags?.join(', ') || '', seoTitles: serviceItem.seoTitles?.join(', ') || '', metaDescription: serviceItem.metaDescription || '', metaTitle: serviceItem.metaTitle || '', ogImage: serviceItem.ogImage || '', canonicalUrl: serviceItem.canonicalUrl || '', keywords: serviceItem.keywords?.join(', ') || '', faq: serviceItem.faq || [] });
      const currentTags = serviceItem.tags || [];
      setSuggestedServiceTags(extractTags(serviceItem.title).filter(t => !currentTags.includes(t)));
      const currentSeo = serviceItem.seoTitles || [];
      setSuggestedServiceSeoTitles(extractSeoTitles(serviceItem.title).filter(t => !currentSeo.includes(t)));
       setCroppedImageUrlB3(apiBase + serviceItem.image);
    } else {
      setServiceContentMode('visual');
      const defaultCategory = serviceCategories.length > 0 ? serviceCategories[0].value : '';
      setServiceForm({ title: '', description: '', content: '', htmlContent: '', image: '', category: defaultCategory, price: 0, isFeatured: false, tags: '', seoTitles: '', metaDescription: '', metaTitle: '', ogImage: '', canonicalUrl: '', keywords: '', faq: [] });
      setSuggestedServiceTags([]);
      setSuggestedServiceSeoTitles([]);
    }
    setServiceDialog({ open: true, service: serviceItem });
  };

  const handleSaveService = async () => {
    try {
      if (countWords(serviceForm.title) > 20) return showToast('Title exceeds 20 word limit', 'error');
      if (serviceContentMode !== 'html-only' && countWords(serviceForm.description) > 50) return showToast('Description exceeds 50 word limit', 'error');
      const isHtmlOnly = serviceContentMode === 'html-only';


            if (!croppedImageUrlB3 && contentMode !== 'html-only') {
        showToast('Please select image', 'error')
        return

      }

      let imgs = ""

if (!isHtmlOnly && fileContantB3) {
  
  const response = await uploadApi?.uploadBlogImageNew({ fileContant: fileContantB3, fileName: fileNameB3 })

imgs =  response?.data?.image

}
      const data = {
        title: serviceForm.title,
        description: isHtmlOnly ? '' : serviceForm.description,
        content: isHtmlOnly ? '' : serviceForm.content,
        htmlContent: isHtmlOnly ? serviceForm.htmlContent : '',
        contentType: serviceContentMode,
        // image: isHtmlOnly ? '' : serviceForm.image,
        image: isHtmlOnly ? '' : imgs,
        category: serviceForm.category,
        price: serviceForm.price,
        isFeatured: serviceForm.isFeatured,
        tags: serviceForm.tags ? serviceForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        seoTitles: serviceForm.seoTitles ? serviceForm.seoTitles.split(',').map(t => t.trim()).filter(Boolean) : [],
        metaDescription: serviceForm.metaDescription || '',
        metaTitle: serviceForm.metaTitle,
        ogImage: serviceForm.ogImage,
        canonicalUrl: serviceForm.canonicalUrl,
        keywords: serviceForm.keywords ? serviceForm.keywords.split(',').map(t => t.trim()).filter(Boolean) : [],
        faq: serviceForm.faq
      };
      if (serviceDialog.service) {
        await serviceApi.update(serviceDialog.service._id, data);
        showToast('Service updated', 'success');
      } else {
        await serviceApi.create(data);
        showToast('Service created', 'success');
      }
      setServiceDialog({ open: false, service: null });
         setCroppedImageUrlB3(null)
      fetchServices();
    } catch (err) { showToast('Failed to save', 'error'); }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Delete this service?')) {
      try { await serviceApi.delete(serviceId); setServices(services.filter(s => s._id !== serviceId)); showToast('Service deleted', 'success'); } catch (err) { showToast('Failed to delete', 'error'); }
    }
  };

  const handleUserPageChange = (e, v) => { setUserPage(v); fetchUsers(v); };
  const handleBlogPageChange = (e, v) => { setBlogPage(v); fetchAllBlogs(v); };
  const handlePendingPageChange = (e, v) => { setPendingPage(v); fetchPendingBlogs(v); };
  const handleServicePageChange = (e, v) => { setServicePage(v); fetchServices(v); };
  const handleAdPageChange = (e, v) => setAdPage(v);

  const paginatedAds = ads.slice((adPage - 1) * 10, adPage * 10);

  if (!isAdmin) return null;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Poppins', background: isDark ? 'linear-gradient(135deg, #F43F5E, #A855F7)' : 'linear-gradient(135deg, #0D9488, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}>Admin Dashboard</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>Manage users, content, and view analytics</Typography>
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
          <Tab icon={<Dashboard />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? '' : 'Dashboard'} />
          <Tab icon={<Pending />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? `${pendingBlogs.length}` : `Pending (${pendingBlogs.length})`} />
          <Tab icon={<People />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? '' : 'Users'} />
          <Tab icon={<Article />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? '' : 'Blogs'} />
          <Tab icon={<Build />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? '' : 'Services'} />
          <Tab icon={<Settings />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? '' : 'Web Settings'} />
          <Tab icon={<Palette />} iconPosition={isMobile ? 'top' : 'start'} label={isMobile ? '' : 'Customization'} />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 3, textAlign: 'center', bgcolor: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(99, 102, 241, 0.1)' }}><Person sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} /><Typography variant="h3" sx={{ fontWeight: 700 }}>{stats?.totalUsers || 0}</Typography><Typography color="text.secondary">Total Users</Typography></Paper></Grid>
          <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 3, textAlign: 'center', bgcolor: isDark ? 'rgba(244, 63, 94, 0.1)' : 'rgba(13, 148, 136, 0.1)' }}><Article sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} /><Typography variant="h3" sx={{ fontWeight: 700 }}>{stats?.totalBlogs || 0}</Typography><Typography color="text.secondary">Total Blogs</Typography></Paper></Grid>
          <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 3, textAlign: 'center', bgcolor: isDark ? 'rgba(236, 72, 153, 0.1)' : 'rgba(14, 165, 233, 0.1)' }}><Visibility sx={{ fontSize: 40, color: 'info.main', mb: 1 }} /><Typography variant="h3" sx={{ fontWeight: 700 }}>{stats?.totalViews?.toLocaleString() || 0}</Typography><Typography color="text.secondary">Total Views</Typography></Paper></Grid>
          <Grid item xs={12} sm={6} md={3}><Paper sx={{ p: 3, textAlign: 'center', bgcolor: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)' }}><TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} /><Typography variant="h3" sx={{ fontWeight: 700 }}>{stats?.trendingBlogs?.length || 0}</Typography><Typography color="text.secondary">Trending Blogs</Typography></Paper></Grid>
        </Grid>
        <Paper sx={{ p: 3 }}><Typography variant="h6" gutterBottom>Trending Posts</Typography>
          <TableContainer><Table><TableHead><TableRow><TableCell>Title</TableCell><TableCell>Author</TableCell><TableCell align="right">Views</TableCell><TableCell align="right">Likes</TableCell></TableRow></TableHead><TableBody>{stats?.trendingBlogs?.map((item) => (<TableRow key={item._id}><TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</TableCell><TableCell>{item.author?.username || 'Unknown'}</TableCell><TableCell align="right">{item.views}</TableCell><TableCell align="right">{item.likes?.length || 0}</TableCell></TableRow>))}</TableBody></Table></TableContainer>
        </Paper>
        <SliderManager />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6" gutterBottom>Pending Submissions</Typography>
        {pendingBlogs.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}><Check sx={{ fontSize: 64, color: 'success.main', mb: 2 }} /><Typography variant="h6" color="text.secondary">No pending submissions</Typography></Paper>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {pendingBlogs.map((item) => (
                <Grid item xs={12} md={6} key={item._id}>
                  <Card><CardMedia component="img" height="160" image={item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'} alt={item.title} /><CardContent><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Chip label={item.category} size="small" /><Typography variant="caption">{new Date(item.createdAt).toLocaleDateString()}</Typography></Box><Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{item.description}</Typography><Box sx={{ display: 'flex', gap: 1 }}><Button variant="contained" color="success" startIcon={<Check />} onClick={() => handleApproveBlog(item._id)} fullWidth>Approve</Button><Button variant="outlined" color="error" startIcon={<Close />} onClick={() => handleRejectBlog(item._id)} fullWidth>Reject</Button></Box></CardContent></Card>
                </Grid>
              ))}
            </Grid>
            {pendingTotalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center' }}><Pagination count={pendingTotalPages} page={pendingPage} onChange={handlePendingPageChange} color="primary" size="large" showFirstButton showLastButton /></Box>}
          </>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Paper sx={{ mb: 2 }}><Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>User Management</Typography>{isMobile && <IconButton size="small" onClick={() => setShowPasswords(!showPasswords)}>{showPasswords ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton>}</Box>
          {isMobile ? (
            <Stack spacing={1} sx={{ p: 1 }}>
              {users.map((user) => (
                <Paper key={user._id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>{user.username?.charAt(0).toUpperCase()}</Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }} noWrap>{user.username}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>{user.email}</Typography>
                      </Box>
                    </Box>
                    <Chip label={user.role} color={user.role === 'admin' ? 'secondary' : 'default'} size="small" sx={{ ml: 1 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">Joined: {new Date(user.createdAt).toLocaleDateString()}</Typography>
                    <Box>
                      <IconButton size="small" color="warning" onClick={() => { setNewPassword(''); setResetPasswordDialog({ open: true, user }); }}><LockReset fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteUser(user._id)} disabled={user.role === 'admin'}><Delete fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          ) : (
            <TableContainer><Table><TableHead><TableRow><TableCell>User</TableCell><TableCell>Email</TableCell><TableCell>Password<IconButton size="small" sx={{ ml: 0.5 }} onClick={() => setShowPasswords(!showPasswords)}>{showPasswords ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></TableCell><TableCell>Role</TableCell><TableCell>Joined</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{users.map((user) => (<TableRow key={user._id}><TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar sx={{ bgcolor: 'primary.main' }}>{user.username?.charAt(0).toUpperCase()}</Avatar><Typography>{user.username}</Typography></Box></TableCell><TableCell>{user.email}</TableCell><TableCell><Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{showPasswords ? user.password : '••••••••'}</Typography></TableCell><TableCell><Chip label={user.role} color={user.role === 'admin' ? 'secondary' : 'default'} size="small" /></TableCell><TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell><TableCell align="right"><IconButton color="warning" onClick={() => { setNewPassword(''); setResetPasswordDialog({ open: true, user }); }}><LockReset /></IconButton><IconButton color="error" onClick={() => handleDeleteUser(user._id)} disabled={user.role === 'admin'}><Delete /></IconButton></TableCell></TableRow>))}</TableBody></Table></TableContainer>
          )}
        </Paper>
        {userTotalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center' }}><Pagination count={userTotalPages} page={userPage} onChange={handleUserPageChange} color="primary" size={isMobile ? 'small' : 'large'} showFirstButton showLastButton /></Box>}
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Box sx={{ mb: 2, display: 'flex', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
          <Button variant="contained" size={isMobile ? 'small' : 'medium'} startIcon={<Add />} onClick={() => handleOpenBlogDialog()}>Add Blog</Button>
          <Button variant="contained" color="secondary" size={isMobile ? 'small' : 'medium'} startIcon={<LocalOffer />} onClick={handleOpenAdDialog}>Add Advertisement</Button>
        </Box>
        <Paper sx={{ mb: 3 }}>
          {isMobile ? (
            <Stack spacing={1} sx={{ p: 1 }}>
              {blogs.map((item) => (
                <Paper key={item._id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', flex: 1, minWidth: 0 }} noWrap>{item.title}</Typography>
                    <Chip label={item.category} size="small" sx={{ flexShrink: 0 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">{item.author?.username || 'Unknown'} · {item.views} views · {item.likes?.length || 0} likes</Typography>
                    <Box>
                      <IconButton size="small" onClick={() => handleOpenBlogDialog(item)}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteBlog(item._id)}><Delete fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          ) : (
            <TableContainer><Table><TableHead><TableRow><TableCell>Title</TableCell><TableCell>Category</TableCell><TableCell>Author</TableCell><TableCell align="right">Views</TableCell><TableCell align="right">Likes</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{blogs.map((item) => (<TableRow key={item._id}><TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</TableCell><TableCell><Chip label={item.category} size="small" /></TableCell><TableCell>{item.author?.username || 'Unknown'}</TableCell><TableCell align="right">{item.views}</TableCell><TableCell align="right">{item.likes?.length || 0}</TableCell><TableCell align="right"><IconButton onClick={() => handleOpenBlogDialog(item)}><Edit /></IconButton><IconButton color="error" onClick={() => handleDeleteBlog(item._id)}><Delete /></IconButton></TableCell></TableRow>))}</TableBody></Table></TableContainer>
          )}
        </Paper>
        {blogTotalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}><Pagination count={blogTotalPages} page={blogPage} onChange={handleBlogPageChange} color="primary" size={isMobile ? 'small' : 'large'} showFirstButton showLastButton /></Box>}
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Advertisements ({ads.length})</Typography>
        <Paper sx={{ mb: 2 }}>
          {isMobile ? (
            <Stack spacing={1} sx={{ p: 1 }}>
              {paginatedAds.map((ad) => (
                <Paper key={ad._id} variant="outlined" sx={{ p: 1.5, borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Box component="img" src={ad.image} sx={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }} noWrap>{ad.title}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">{ad.redirectLink}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>{ad.clicks || 0} clicks</Typography>
                  </Box>
                  <IconButton size="small" color="error" onClick={() => handleDeleteAd(ad._id)}><Delete fontSize="small" /></IconButton>
                </Paper>
              ))}
            </Stack>
          ) : (
            <TableContainer><Table><TableHead><TableRow><TableCell>Image</TableCell><TableCell>Title</TableCell><TableCell>Redirect Link</TableCell><TableCell align="right">Clicks</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{paginatedAds.map((ad) => (<TableRow key={ad._id}><TableCell><Box component="img" src={ad.image} sx={{ width: 80, height: 48, objectFit: 'cover', borderRadius: 1 }} /></TableCell><TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.title}</TableCell><TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.redirectLink}</TableCell><TableCell align="right"><Typography sx={{ fontWeight: 700, color: 'primary.main' }}>{ad.clicks || 0}</Typography></TableCell><TableCell align="right"><IconButton color="error" onClick={() => handleDeleteAd(ad._id)}><Delete /></IconButton></TableCell></TableRow>))}</TableBody></Table></TableContainer>
          )}
        </Paper>
        {adTotalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center' }}><Pagination count={adTotalPages} page={adPage} onChange={handleAdPageChange} color="primary" size={isMobile ? 'small' : 'large'} showFirstButton showLastButton /></Box>}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Notification Marquee</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Set the notification text that appears on the homepage marquee. Leave empty for default message.</Typography>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, flexDirection: 'column' }}>
            <TextField fullWidth label="Notification Text (English)" value={notificationText} onChange={(e) => setNotificationText(e.target.value)} placeholder="Enter notification text..." multiline rows={2} size="small" />
            <TextField fullWidth label="Notification Text (हिन्दी)" value={notificationTextHi} onChange={(e) => setNotificationTextHi(e.target.value)} placeholder="हिंदी में सूचना दर्ज करें..." multiline rows={2} size="small" />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" onClick={handleSaveNotification}>Save</Button>
              <Button variant="outlined" color="error" size="small" onClick={handleClearNotification}>Clear</Button>
            </Box>
          </Box>
          {notificationSaved && <Alert severity="success" sx={{ mt: 2 }}>Notification saved!</Alert>}
        </Paper>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Box sx={{ mb: 2, display: 'flex', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
          <Button variant="contained" size={isMobile ? 'small' : 'medium'} startIcon={<Add />} onClick={() => handleOpenServiceDialog()}>Add Service</Button>
          <Button variant="outlined" size={isMobile ? 'small' : 'medium'} startIcon={<LocalOffer />} onClick={() => setCategoryDialog({ open: true })}>Manage Categories</Button>
        </Box>
        <Paper sx={{ mb: 3 }}>
          {isMobile ? (
            <Stack spacing={1} sx={{ p: 1 }}>
              {services.map((item) => (
                <Paper key={item._id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', flex: 1, minWidth: 0 }} noWrap>{item.title}</Typography>
                    <Chip label={item.category} size="small" sx={{ flexShrink: 0 }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main' }}>{item.price > 0 ? `$${item.price}` : 'Free'}</Typography>
                    <Typography variant="caption" color="text.secondary">★ {item.rating || 0}</Typography>
                    <Box>
                      <IconButton size="small" onClick={() => handleOpenServiceDialog(item)}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteService(item._id)}><Delete fontSize="small" /></IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          ) : (
            <TableContainer><Table><TableHead><TableRow><TableCell>Title</TableCell><TableCell>Category</TableCell><TableCell align="right">Price</TableCell><TableCell align="right">Rating</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{services.map((item) => (<TableRow key={item._id}><TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</TableCell><TableCell><Chip label={item.category} size="small" /></TableCell><TableCell align="right"><Typography sx={{ fontWeight: 700, color: 'success.main' }}>{item.price > 0 ? `$${item.price}` : 'Free'}</Typography></TableCell><TableCell align="right">{item.rating || 0}</TableCell><TableCell align="right"><IconButton onClick={() => handleOpenServiceDialog(item)}><Edit /></IconButton><IconButton color="error" onClick={() => handleDeleteService(item._id)}><Delete /></IconButton></TableCell></TableRow>))}</TableBody></Table></TableContainer>
          )}
        </Paper>
        {serviceTotalPages > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}><Pagination count={serviceTotalPages} page={servicePage} onChange={handleServicePageChange} color="primary" size={isMobile ? 'small' : 'large'} showFirstButton showLastButton /></Box>}
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        {websiteSettings && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Site Identity</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Site Name" fullWidth size="small" value={websiteSettings.siteName} onChange={(e) => setWebsiteSettings({ ...websiteSettings, siteName: e.target.value })} />
                <TextField label="Browser Tab Title" fullWidth size="small" value={websiteSettings.siteTitle} onChange={(e) => setWebsiteSettings({ ...websiteSettings, siteTitle: e.target.value })} helperText="Shown in the browser tab (leave empty to use Site Name)" />
                <TextField label="Site Description" fullWidth multiline rows={2} size="small" value={websiteSettings.siteDescription} onChange={(e) => setWebsiteSettings({ ...websiteSettings, siteDescription: e.target.value })} />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Logo Image</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                      <Button variant="outlined" size="small" component="label">
                        Upload
                        <input type="file" hidden accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('image', file);
                          try {
                            const res = await uploadApi.uploadSiteAsset(formData, 'uploads/logo');
                            const url = res.data.url;
                            if (url) setWebsiteSettings({ ...websiteSettings, logo: url });
                          } catch (err) { showToast('Upload failed', 'error'); }
                        }} />
                      </Button>
                      <TextField label="Or Logo URL" fullWidth size="small" value={websiteSettings.logo} onChange={(e) => setWebsiteSettings({ ...websiteSettings, logo: e.target.value })} />
                      {websiteSettings.logo && (
                        <IconButton size="small" color="error" onClick={() => setWebsiteSettings({ ...websiteSettings, logo: '' })}><Delete /></IconButton>
                      )}
                    </Box>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} sm={4}><TextField label="Width (px)" size="small" fullWidth value={websiteSettings.logoWidth || ''} onChange={(e) => setWebsiteSettings({ ...websiteSettings, logoWidth: e.target.value })} /></Grid>
                      <Grid item xs={12} sm={4}><TextField label="Height (px)" size="small" fullWidth value={websiteSettings.logoHeight || '40'} onChange={(e) => setWebsiteSettings({ ...websiteSettings, logoHeight: e.target.value })} /></Grid>
                      <Grid item xs={12} sm={4}><TextField label="Border Radius (px)" size="small" fullWidth value={websiteSettings.logoBorderRadius || '0'} onChange={(e) => setWebsiteSettings({ ...websiteSettings, logoBorderRadius: e.target.value })} /></Grid>
                    </Grid>
                    {websiteSettings.logo && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">Preview:</Typography>
                        <Box component="img" src={websiteSettings.logo} alt="logo preview" sx={{ display: 'block', mt: 0.5, height: parseInt(websiteSettings.logoHeight || '40'), width: websiteSettings.logoWidth ? parseInt(websiteSettings.logoWidth) : 'auto', objectFit: 'contain', border: '1px solid', borderColor: 'divider', borderRadius: parseInt(websiteSettings.logoBorderRadius || '0'), maxWidth: 300 }} />
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Favicon Icon</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                      <Button variant="outlined" size="small" component="label">
                        Upload
                        <input type="file" hidden accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('image', file);
                          try {
                            const res = await uploadApi.uploadSiteAsset(formData, 'uploads/favicon');
                            const url = res.data.url;
                            if (url) setWebsiteSettings({ ...websiteSettings, favicon: url });
                          } catch (err) { showToast('Upload failed', 'error'); }
                        }} />
                      </Button>
                      <TextField label="Or Favicon URL" fullWidth size="small" value={websiteSettings.favicon} onChange={(e) => setWebsiteSettings({ ...websiteSettings, favicon: e.target.value })} />
                      {websiteSettings.favicon && (
                        <IconButton size="small" color="error" onClick={() => setWebsiteSettings({ ...websiteSettings, favicon: '' })}><Delete /></IconButton>
                      )}
                    </Box>
                    {websiteSettings.favicon && (
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Preview:</Typography>
                        <Box component="img" src={websiteSettings.favicon} alt="favicon preview" sx={{ display: 'block', mt: 0.5, height: 24, width: 24, objectFit: 'contain', borderRadius: 1 }} />
                      </Box>
                    )}
                  </Box>
                </Box>
                <TextField label="Footer Text" fullWidth size="small" value={websiteSettings.footerText} onChange={(e) => setWebsiteSettings({ ...websiteSettings, footerText: e.target.value })} />
              </Box>
            </Paper>
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Social Media Links</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Facebook" fullWidth size="small" value={websiteSettings.socialLinks?.facebook || ''} onChange={(e) => setWebsiteSettings({ ...websiteSettings, socialLinks: { ...websiteSettings.socialLinks, facebook: e.target.value } })} />
                <TextField label="Twitter" fullWidth size="small" value={websiteSettings.socialLinks?.twitter || ''} onChange={(e) => setWebsiteSettings({ ...websiteSettings, socialLinks: { ...websiteSettings.socialLinks, twitter: e.target.value } })} />
                <TextField label="Instagram" fullWidth size="small" value={websiteSettings.socialLinks?.instagram || ''} onChange={(e) => setWebsiteSettings({ ...websiteSettings, socialLinks: { ...websiteSettings.socialLinks, instagram: e.target.value } })} />
                <TextField label="LinkedIn" fullWidth size="small" value={websiteSettings.socialLinks?.linkedin || ''} onChange={(e) => setWebsiteSettings({ ...websiteSettings, socialLinks: { ...websiteSettings.socialLinks, linkedin: e.target.value } })} />
                <TextField label="YouTube" fullWidth size="small" value={websiteSettings.socialLinks?.youtube || ''} onChange={(e) => setWebsiteSettings({ ...websiteSettings, socialLinks: { ...websiteSettings.socialLinks, youtube: e.target.value } })} />
              </Box>
            </Paper>
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Contact Information</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Contact Email" fullWidth size="small" value={websiteSettings.contactEmail} onChange={(e) => setWebsiteSettings({ ...websiteSettings, contactEmail: e.target.value })} />
                <TextField label="Contact Phone" fullWidth value={websiteSettings.contactPhone} onChange={(e) => setWebsiteSettings({ ...websiteSettings, contactPhone: e.target.value })} />
                <TextField label="Contact Address" fullWidth multiline rows={2} value={websiteSettings.contactAddress} onChange={(e) => setWebsiteSettings({ ...websiteSettings, contactAddress: e.target.value })} />
              </Box>
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>About Us</Typography>
              {CkEditor ? <CkEditor value={websiteSettings.aboutUs} onChange={(val) => setWebsiteSettings({ ...websiteSettings, aboutUs: val })} height={200} /> : <TextField fullWidth multiline rows={8} value={websiteSettings.aboutUs || ''} onChange={(e) => setWebsiteSettings({ ...websiteSettings, aboutUs: e.target.value })} placeholder="Loading editor..." />}
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Terms &amp; Conditions</Typography>
              {CkEditor ? <CkEditor value={websiteSettings.termsAndConditions} onChange={(val) => setWebsiteSettings({ ...websiteSettings, termsAndConditions: val })} height={200} /> : <TextField fullWidth multiline rows={8} value={websiteSettings.termsAndConditions || ''} onChange={(e) => setWebsiteSettings({ ...websiteSettings, termsAndConditions: e.target.value })} placeholder="Loading editor..." />}
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Privacy Policy</Typography>
              {CkEditor ? <CkEditor value={websiteSettings.privacyPolicy} onChange={(val) => setWebsiteSettings({ ...websiteSettings, privacyPolicy: val })} height={200} /> : <TextField fullWidth multiline rows={8} value={websiteSettings.privacyPolicy || ''} onChange={(e) => setWebsiteSettings({ ...websiteSettings, privacyPolicy: e.target.value })} placeholder="Loading editor..." />}
            </Paper>
            <Button variant="contained" onClick={handleSaveWebsiteSettings} sx={{ alignSelf: 'flex-start' }}>Save Settings</Button>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={6}>
        <Customization />
      </TabPanel>

      <Dialog open={blogDialog.open} onClose={() => setBlogDialog({ open: false, blog: null })} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{blogDialog.blog ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}><WordLimitedTextField wordLimit={20} label="Title" value={blogForm.title} onChange={(e) => handleBlogTitleChange(e.target.value)} required />
          {blogForm.title.length >= 5 && suggestedTags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
              <AutoAwesome sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Suggested SEO tags:</Typography>
              {suggestedTags.map((tag, i) => (
                <Chip key={i} label={tag} size="small" variant="outlined" onClick={() => {
                  const current = blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                  if (!current.includes(tag)) {
                    current.push(tag);
                    setBlogForm({ ...blogForm, tags: current.join(', ') });
                    setSuggestedTags(suggestedTags.filter(t => t !== tag));
                  }
                }} sx={{ cursor: 'pointer' }} />
              ))}
            </Box>
          )}
          {contentMode !== 'html-only' && (
            <WordLimitedTextField wordLimit={50} label="Description" multiline rows={2} value={blogForm.description} onChange={(e) => setBlogForm({ ...blogForm, description: e.target.value })} />
          )}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Content</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button size="small" variant={contentMode === 'visual' ? 'contained' : 'outlined'} onClick={() => setContentMode('visual')} sx={{ minWidth: 50, fontSize: '0.75rem', py: 0.25 }}>Visual</Button>
                <Button size="small" variant={contentMode === 'text' ? 'contained' : 'outlined'} onClick={() => setContentMode('text')} sx={{ minWidth: 50, fontSize: '0.75rem', py: 0.25 }}>Text</Button>
                <Button size="small" variant={contentMode === 'html' ? 'contained' : 'outlined'} onClick={() => setContentMode('html')} sx={{ minWidth: 50, fontSize: '0.75rem', py: 0.25 }}>HTML</Button>
                <Button size="small" variant={contentMode === 'html-only' ? 'contained' : 'outlined'} onClick={() => setContentMode('html-only')} sx={{ minWidth: 70, fontSize: '0.75rem', py: 0.25 }}>Html Only</Button>
              </Box>
            </Box>
            {contentMode === 'visual' ? (
              CkEditor ? (
                <CkEditor value={blogForm.content} onChange={(val) => setBlogForm({ ...blogForm, content: val })} height={250} />
              ) : (
                <TextField fullWidth multiline rows={12} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="Loading editor..." sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' } }} />
              )
            ) : contentMode === 'text' ? (
              CkEditor ? (
                <CkEditor minimal value={blogForm.content} onChange={(val) => setBlogForm({ ...blogForm, content: val })} height={250} placeholder="Write formatted text..." />
              ) : (
                <TextField fullWidth multiline rows={12} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="Loading editor..." sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' } }} />
              )
            ) : contentMode === 'html' ? (
              <TextField fullWidth multiline rows={12} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="Paste raw HTML here..." sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' } }} />
            ) : (
              <TextField fullWidth multiline rows={12} value={blogForm.htmlContent} onChange={(e) => setBlogForm({ ...blogForm, htmlContent: e.target.value })} placeholder="Paste full HTML document here (CSS & JS will be preserved)..." sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' } }} />
            )}
          </Box>
          <FormControl fullWidth><InputLabel>Category</InputLabel><Select value={blogForm.category} label="Category" onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}>{categories.map((cat) => (<MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>))}</Select></FormControl><TextField label="Tags (comma-separated)" fullWidth value={blogForm.tags} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} />
          {blogForm.title.length >= 5 && suggestedSeoTitles.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
              <AutoAwesome sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Suggested SEO titles:</Typography>
              {suggestedSeoTitles.map((t, i) => (
                <Chip key={i} label={t} size="small" variant="outlined" color="success" onClick={() => {
                  const cur = blogForm.seoTitles ? blogForm.seoTitles.split(',').map(x => x.trim()).filter(Boolean) : [];
                  if (!cur.includes(t)) { cur.push(t); setBlogForm({ ...blogForm, seoTitles: cur.join(', ') }); setSuggestedSeoTitles(suggestedSeoTitles.filter(x => x !== t)); }
                }} sx={{ cursor: 'pointer' }} />
              ))}
            </Box>
          )}
          <TextField label="SEO Titles (comma-separated)" fullWidth value={blogForm.seoTitles} onChange={(e) => setBlogForm({ ...blogForm, seoTitles: e.target.value })} placeholder="e.g. Technology Trends, AI Innovation" helperText="Used for meta keywords, OG tags, and JSON-LD structured data" />
          <TextField label="Meta Description" fullWidth multiline rows={2} value={blogForm.metaDescription} onChange={(e) => setBlogForm({ ...blogForm, metaDescription: e.target.value })} placeholder="Brief description for search engine results" />
          <TextField label="Meta Title (overrides page title)" fullWidth value={blogForm.metaTitle} onChange={(e) => setBlogForm({ ...blogForm, metaTitle: e.target.value })} placeholder="Leave blank to use blog title" helperText="Custom <title> tag for search engines" />
          <TextField label="OG Image URL (overrides featured image)" fullWidth value={blogForm.ogImage} onChange={(e) => setBlogForm({ ...blogForm, ogImage: e.target.value })} placeholder="Leave blank to use featured image" />
          <TextField label="Canonical URL" fullWidth value={blogForm.canonicalUrl} onChange={(e) => setBlogForm({ ...blogForm, canonicalUrl: e.target.value })} placeholder="Leave blank to auto-generate" />
          <TextField label="Keywords (comma-separated, for structured data)" fullWidth value={blogForm.keywords} onChange={(e) => setBlogForm({ ...blogForm, keywords: e.target.value })} placeholder="e.g. breaking news, technology, AI" />
          <Box><Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>FAQ (for FAQ Schema rich snippets)</Typography>
            {blogForm.faq.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}><TextField size="small" fullWidth label="Question" value={item.question} onChange={(e) => { const f = [...blogForm.faq]; f[i] = { ...f[i], question: e.target.value }; setBlogForm({ ...blogForm, faq: f }); }} /></Box>
                <Box sx={{ flex: 1 }}><TextField size="small" fullWidth label="Answer" value={item.answer} onChange={(e) => { const f = [...blogForm.faq]; f[i] = { ...f[i], answer: e.target.value }; setBlogForm({ ...blogForm, faq: f }); }} /></Box>
                <IconButton size="small" color="error" onClick={() => setBlogForm({ ...blogForm, faq: blogForm.faq.filter((_, j) => j !== i) })}><Delete fontSize="small" /></IconButton>
              </Box>
            ))}
            <Button size="small" startIcon={<Add />} onClick={() => setBlogForm({ ...blogForm, faq: [...blogForm.faq, { question: '', answer: '' }] })}>Add FAQ Item</Button>
          </Box>
          {contentMode !== 'html-only' &&


<div>


   <ImageCropper2
            aspectRatio={4 / 3}
            // onImageCrop={handleImageCrop}
            setfileContant={setfileContantB2}
            setFileName={setFileNameB2}
            setfinalImg={setfinalImgB2}
            aspectwidth={16}
            aspectheight={10}
            onCropComplete={setCroppedImageUrlB2}
          />

          {croppedImageUrlB2 && (
            <div>
              <img
                src={croppedImageUrlB2}
                alt="Cropped"
                width={160}
                height={100}
              />
            </div>
          )}

  {/* <BlogImageUpload onUploadComplete={(url) => setBlogForm({ ...blogForm, image: url })} label="Featured Image" /> */}
</div>
          
          
          
          }
          
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><input type="checkbox" id="isFeatured" checked={blogForm.isFeatured} onChange={(e) => setBlogForm({ ...blogForm, isFeatured: e.target.checked })} /><label htmlFor="isFeatured">Mark as Featured</label></Box></Box></DialogContent>
        <DialogActions><Button onClick={() => setBlogDialog({ open: false, blog: null })}>Cancel</Button>{!blogDialog.blog && <Button onClick={handleSaveBlogAsPending} color="warning" disabled={countWords(blogForm.title) > 20 || (contentMode !== 'html-only' && countWords(blogForm.description) > 50)}>Pending</Button>}<Button onClick={handleSaveBlog} variant="contained" disabled={countWords(blogForm.title) > 20 || (contentMode !== 'html-only' && countWords(blogForm.description) > 50)}>Save</Button></DialogActions>
      </Dialog>

      <Dialog open={adDialog.open} onClose={() => setAdDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Campaign color="secondary" />Create Advertisement</Box></DialogTitle>
        <DialogContent><Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Title" fullWidth value={adForm.title} onChange={(e) => setAdForm({ ...adForm, title: e.target.value })} required />
          <TextField label="Description" fullWidth multiline rows={2} value={adForm.description} onChange={(e) => setAdForm({ ...adForm, description: e.target.value })} />
          <TextField label="Redirect Link" fullWidth value={adForm.redirectLink} onChange={(e) => setAdForm({ ...adForm, redirectLink: e.target.value })} required placeholder="https://example.com" />

          <ImageCropper2
            aspectRatio={4 / 3}
            // onImageCrop={handleImageCrop}
            setfileContant={setfileContantB}
            setFileName={setFileNameB}
            setfinalImg={setfinalImgB}
            aspectwidth={16}
            aspectheight={10}
            onCropComplete={setCroppedImageUrlB}
          />

          {croppedImageUrlB && (
            <div>
              <img
                src={croppedImageUrlB}
                alt="Cropped"
                width={160}
                height={100}
              />
            </div>
          )}
          {/* <BlogImageUpload onUploadComplete={(url) => setAdForm({ ...adForm, image: url })} label="Advertisement Image" /> */}
        </Box></DialogContent>
        <DialogActions><Button onClick={() => setAdDialog({ open: false })}>Cancel</Button><Button onClick={handleSaveAd} variant="contained" color="secondary">Create Ad</Button></DialogActions>
      </Dialog>

      <Dialog open={resetPasswordDialog.open} onClose={() => setResetPasswordDialog({ open: false, user: null })} maxWidth="sm" fullWidth>
        <DialogTitle><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LockReset color="warning" />Reset Password</Box></DialogTitle>
        <DialogContent><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Set a new password for: <strong>{resetPasswordDialog.user?.username}</strong></Typography><TextField fullWidth label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></DialogContent>
        <DialogActions><Button onClick={() => setResetPasswordDialog({ open: false, user: null })}>Cancel</Button><Button onClick={async () => { if (newPassword.length >= 6 && resetPasswordDialog.user) { await userApi.resetPassword(resetPasswordDialog.user._id, newPassword); showToast('Password reset', 'success'); setResetPasswordDialog({ open: false, user: null }); } }} variant="contained" color="warning">Reset</Button></DialogActions>
      </Dialog>

      <Dialog open={serviceDialog.open} onClose={() => setServiceDialog({ open: false, service: null })} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Build color="primary" />{serviceDialog.service ? 'Edit Service' : 'Create New Service'}</Box></DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}><Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <WordLimitedTextField wordLimit={20} label="Title" value={serviceForm.title} onChange={(e) => handleServiceTitleChange(e.target.value)} required />
          {serviceForm.title.length >= 5 && suggestedServiceTags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
              <AutoAwesome sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Suggested SEO tags:</Typography>
              {suggestedServiceTags.map((tag, i) => (
                <Chip key={i} label={tag} size="small" variant="outlined" onClick={() => {
                  const current = serviceForm.tags ? serviceForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                  if (!current.includes(tag)) {
                    current.push(tag);
                    setServiceForm({ ...serviceForm, tags: current.join(', ') });
                    setSuggestedServiceTags(suggestedServiceTags.filter(t => t !== tag));
                  }
                }} sx={{ cursor: 'pointer' }} />
              ))}
            </Box>
          )}
          {serviceContentMode !== 'html-only' && (
            <WordLimitedTextField wordLimit={50} label="Description" multiline rows={2} value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} />
          )}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Content</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button size="small" variant={serviceContentMode === 'visual' ? 'contained' : 'outlined'} onClick={() => setServiceContentMode('visual')} sx={{ minWidth: 50, fontSize: '0.75rem', py: 0.25 }}>Visual</Button>
                <Button size="small" variant={serviceContentMode === 'text' ? 'contained' : 'outlined'} onClick={() => setServiceContentMode('text')} sx={{ minWidth: 50, fontSize: '0.75rem', py: 0.25 }}>Text</Button>
                <Button size="small" variant={serviceContentMode === 'html' ? 'contained' : 'outlined'} onClick={() => setServiceContentMode('html')} sx={{ minWidth: 50, fontSize: '0.75rem', py: 0.25 }}>HTML</Button>
                <Button size="small" variant={serviceContentMode === 'html-only' ? 'contained' : 'outlined'} onClick={() => setServiceContentMode('html-only')} sx={{ minWidth: 70, fontSize: '0.75rem', py: 0.25 }}>Html Only</Button>
              </Box>
            </Box>
            {serviceContentMode === 'visual' ? (
              CkEditor ? (
                <CkEditor value={serviceForm.content} onChange={(val) => setServiceForm({ ...serviceForm, content: val })} height={250} />
              ) : (
                <TextField fullWidth multiline rows={12} value={serviceForm.content} onChange={(e) => setServiceForm({ ...serviceForm, content: e.target.value })} placeholder="Loading editor..." sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' } }} />
              )
            ) : serviceContentMode === 'text' ? (
              CkEditor ? (
                <CkEditor minimal value={serviceForm.content} onChange={(val) => setServiceForm({ ...serviceForm, content: val })} height={250} placeholder="Write formatted text..." />
              ) : (
                <TextField fullWidth multiline rows={12} value={serviceForm.content} onChange={(e) => setServiceForm({ ...serviceForm, content: e.target.value })} placeholder="Loading editor..." sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' } }} />
              )
            ) : serviceContentMode === 'html' ? (
              <TextField fullWidth multiline rows={12} value={serviceForm.content} onChange={(e) => setServiceForm({ ...serviceForm, content: e.target.value })} placeholder="Paste raw HTML here..." sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' } }} />
            ) : (
              <TextField fullWidth multiline rows={12} value={serviceForm.htmlContent} onChange={(e) => setServiceForm({ ...serviceForm, htmlContent: e.target.value })} placeholder="Paste full HTML document here (CSS & JS will be preserved)..." sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.875rem' } }} />
            )}
          </Box>
          <TextField label="SEO Tags (comma-separated)" fullWidth value={serviceForm.tags} onChange={(e) => setServiceForm({ ...serviceForm, tags: e.target.value })} />
          {serviceForm.title.length >= 5 && suggestedServiceSeoTitles.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
              <AutoAwesome sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Suggested SEO titles:</Typography>
              {suggestedServiceSeoTitles.map((t, i) => (
                <Chip key={i} label={t} size="small" variant="outlined" color="success" onClick={() => {
                  const cur = serviceForm.seoTitles ? serviceForm.seoTitles.split(',').map(x => x.trim()).filter(Boolean) : [];
                  if (!cur.includes(t)) { cur.push(t); setServiceForm({ ...serviceForm, seoTitles: cur.join(', ') }); setSuggestedServiceSeoTitles(suggestedServiceSeoTitles.filter(x => x !== t)); }
                }} sx={{ cursor: 'pointer' }} />
              ))}
            </Box>
          )}
          <TextField label="SEO Titles (comma-separated)" fullWidth value={serviceForm.seoTitles} onChange={(e) => setServiceForm({ ...serviceForm, seoTitles: e.target.value })} placeholder="e.g. Web Development, Digital Marketing" helperText="Used for meta keywords, OG tags, and JSON-LD structured data" />
          <TextField label="Meta Description" fullWidth multiline rows={2} value={serviceForm.metaDescription} onChange={(e) => setServiceForm({ ...serviceForm, metaDescription: e.target.value })} placeholder="Brief description for search engine results" />
          <TextField label="Meta Title (overrides page title)" fullWidth value={serviceForm.metaTitle} onChange={(e) => setServiceForm({ ...serviceForm, metaTitle: e.target.value })} placeholder="Leave blank to use service title" helperText="Custom <title> tag for search engines" />
          <TextField label="OG Image URL (overrides featured image)" fullWidth value={serviceForm.ogImage} onChange={(e) => setServiceForm({ ...serviceForm, ogImage: e.target.value })} placeholder="Leave blank to use featured image" />
          <TextField label="Canonical URL" fullWidth value={serviceForm.canonicalUrl} onChange={(e) => setServiceForm({ ...serviceForm, canonicalUrl: e.target.value })} placeholder="Leave blank to auto-generate" />
          <TextField label="Keywords (comma-separated, for structured data)" fullWidth value={serviceForm.keywords} onChange={(e) => setServiceForm({ ...serviceForm, keywords: e.target.value })} placeholder="e.g. web development, digital marketing" />
          <Box><Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>FAQ (for FAQ Schema rich snippets)</Typography>
            {serviceForm.faq.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}><TextField size="small" fullWidth label="Question" value={item.question} onChange={(e) => { const f = [...serviceForm.faq]; f[i] = { ...f[i], question: e.target.value }; setServiceForm({ ...serviceForm, faq: f }); }} /></Box>
                <Box sx={{ flex: 1 }}><TextField size="small" fullWidth label="Answer" value={item.answer} onChange={(e) => { const f = [...serviceForm.faq]; f[i] = { ...f[i], answer: e.target.value }; setServiceForm({ ...serviceForm, faq: f }); }} /></Box>
                <IconButton size="small" color="error" onClick={() => setServiceForm({ ...serviceForm, faq: serviceForm.faq.filter((_, j) => j !== i) })}><Delete fontSize="small" /></IconButton>
              </Box>
            ))}
            <Button size="small" startIcon={<Add />} onClick={() => setServiceForm({ ...serviceForm, faq: [...serviceForm.faq, { question: '', answer: '' }] })}>Add FAQ Item</Button>
          </Box>
          <FormControl fullWidth><InputLabel>Category</InputLabel><Select value={serviceForm.category} label="Category" onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}>
            {serviceCategories.map((cat) => (
              
              
              <MenuItem key={cat.value} value={cat.value}>{cat.name}</MenuItem>
              
              
              ))}
          </Select></FormControl>
          <TextField label="Price ($)" fullWidth type="number" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) || 0 })} />
          {serviceContentMode !== 'html-only' &&
          

          <div>

   <ImageCropper2
            aspectRatio={4 / 3}
            // onImageCrop={handleImageCrop}
            setfileContant={setfileContantB3}
            setFileName={setFileNameB3}
            setfinalImg={setfinalImgB3}
            aspectwidth={16}
            aspectheight={10}
            onCropComplete={setCroppedImageUrlB3}
          />

          {croppedImageUrlB3 && (
            <div>
              <img
                src={croppedImageUrlB3}
                alt="Cropped"
                width={160}
                height={100}
              />
            </div>
          )}
            {/* <BlogImageUpload onUploadComplete={(url) => setServiceForm({ ...serviceForm, image: url })} label="Service Image" /> */}
          </div>
          
          }
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><input type="checkbox" id="serviceFeatured" checked={serviceForm.isFeatured} onChange={(e) => setServiceForm({ ...serviceForm, isFeatured: e.target.checked })} /><label htmlFor="serviceFeatured">Mark as Featured</label></Box>
        </Box></DialogContent>
        <DialogActions><Button onClick={() => setServiceDialog({ open: false, service: null })}>Cancel</Button><Button onClick={handleSaveService} variant="contained" disabled={countWords(serviceForm.title) > 20 || (serviceContentMode !== 'html-only' && countWords(serviceForm.description) > 50)}>Save</Button></DialogActions>
      </Dialog>

      <Dialog open={categoryDialog.open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LocalOffer color="primary" />Manage Service Categories</Box></DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, pt: 2 }}>
            <TextField fullWidth label="Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()} />
            {/* <BlogImageUpload onUploadComplete={(url) => setNewCategoryIcon(url || '')} label="Category Icon" /> */}
            <ImageCropper2
              aspectRatio={4 / 3}
              // onImageCrop={handleImageCrop}
              setfileContant={setfileContant}
              setFileName={setFileName}
              setfinalImg={setfinalImg}
              aspectwidth={16}
              aspectheight={16}
              onCropComplete={setCroppedImageUrl}
            />

            {croppedImageUrl && (
              <div>
                <img
                  src={croppedImageUrl}
                  alt="Cropped"
                  width={160}
                  height={100}
                />
              </div>
            )}
            <Button variant="contained" onClick={handleAddCategory} sx={{ alignSelf: 'flex-start' }}>Add Category</Button>
          </Box>






          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceCategories.map((cat) => (
                  <TableRow key={cat._id}>
                    <TableCell>{cat.icon ? <Box component="img" src={cat.icon} sx={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 1 }} /> : <Box sx={{ width: 32, height: 32, bgcolor: 'action.hover', borderRadius: 1 }} />}</TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell><Chip label={cat.value} size="small" variant="outlined" /></TableCell>
                    <TableCell align="right"><IconButton color="error" size="small" onClick={() => handleDeleteCategory(cat._id)}><Delete fontSize="small" /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions><Button onClick={handleDialogClose}>Close</Button></DialogActions>
      </Dialog>
    </Container>
  );
};

function TabPanel({ children, value, index }) {
  return <div role="tabpanel" hidden={value !== index}>{value === index && <Box>{children}</Box>}</div>;
}

const Person = ({ sx }) => <Typography sx={{ fontSize: sx?.fontSize || 40 }}>👤</Typography>;

export default Admin;