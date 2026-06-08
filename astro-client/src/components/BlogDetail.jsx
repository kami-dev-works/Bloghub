import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  IconButton,
  Button,
  Divider,
  Skeleton,
  TextField,
  Avatar,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import Favorite from '@mui/icons-material/Favorite';
import Comment from '@mui/icons-material/Comment';
import Share from '@mui/icons-material/Share';
import Twitter from '@mui/icons-material/Twitter';
import Facebook from '@mui/icons-material/Facebook';
import LinkedIn from '@mui/icons-material/LinkedIn';
import { motion } from 'framer-motion';
import { useThemeContext } from '../stores/ThemeContext';
import { useLanguage } from '../stores/LanguageContext';
import { useData } from '../stores/DataContext';
import { blogApi, commentApi } from '../lib/api';
import HtmlContent, { processContent } from './HtmlContent';
import { parseBlogSlug } from '../lib/slug';
import { getImgSrcSet } from '../lib/images';
import BlogCard from './BlogCard';
import SeoHead from './SeoHead';
import { JsonLdBlog, JsonLdBreadcrumb } from './JsonLd';

const BlogDetail = () => {
  const { slug } = useParams();
  const shortId = parseBlogSlug(slug);
  const { isDark } = useThemeContext();
  const { t } = useLanguage();
  const { isAuthenticated, user, showToast, refreshUser } = useData();

  const [blog, setBlog] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const response = await blogApi.getByShortId(shortId);
        const blogData = response.data;
        setBlog(blogData);

        const userId = user?._id;
        if (userId) {
          const liked = blogData.likes?.some(
            (like) => like.toString() === userId.toString()
          ) || user?.likedNews?.some((lid) => lid.toString() === blogData._id.toString());
          setIsLiked(liked);
        }

        const [commentsRes, relatedRes] = await Promise.all([
          commentApi.getByBlog(blogData._id),
          blogData.category ? blogApi.getAll({ category: blogData.category, limit: 4 }) : Promise.resolve(null),
        ]);
        setComments(commentsRes.data);
        if (relatedRes) {
          setRelatedNews(relatedRes.data.blogs.filter((n) => n._id !== blogData._id));
        }
      } catch (err) {
        console.error('Failed to fetch blog:', err);
        showToast('Failed to load blog', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [shortId, user]);

  useEffect(() => {
    if (blog?.contentType === 'html-only') {
      window.location.replace(`/render/blog/${blog.slug}`);
    }
  }, [blog]);

  const handleLike = async () => {
    if (!isAuthenticated || !blog) {
      showToast(t('pleaseLogin'), 'warning');
      return;
    }
    try {
      const response = await blogApi.like(blog._id);
      setIsLiked(response.data.liked);
      if (refreshUser) {
        refreshUser();
      }
    } catch (err) {
      showToast('Failed to like blog', 'error');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = blog.title;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      showToast(t('share') + '!', 'success');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast(t('pleaseLogin'), 'warning');
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await commentApi.create(blog._id, newComment);
      setComments([...comments, response.data]);
      setNewComment('');
      showToast(t('success'), 'success');
    } catch (err) {
      showToast('Failed to add comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Skeleton variant="rectangular" height={{ xs: 220, sm: 400 }} sx={{ borderRadius: 2, mb: 4 }} />
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          News not found
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Go Home
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      <SeoHead
        title={blog.title}
        description={blog.metaDescription || blog.description}
        seoTitles={blog.seoTitles}
        image={blog.image}
        type="article"
        path={`/blog/${slug}`}
        publishedDate={blog.createdAt}
        updatedDate={blog.updatedAt}
        author={blog.author?.username}
      />
      <JsonLdBlog blog={blog} />
      <JsonLdBreadcrumb items={[
        { name: 'Home', url: window.location.origin },
        { name: blog.category, url: `${window.location.origin}/?category=${blog.category}` },
        { name: blog.title, url: window.location.href },
      ]} />
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          sx={{ mb: { xs: 1.5, sm: 3 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          {t('home')}
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: { xs: '4/3', sm: '15/8' },
              borderRadius: { xs: 2, sm: 3 },
              overflow: 'hidden',
              mb: { xs: 2, sm: 4 },
            }}
          >
            <Box
              component="img"
              src={blog.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200'}
              alt={blog.title}
              loading="lazy"
              srcSet={getImgSrcSet(blog.image)}
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 100vw, 1200px"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 2, sm: 4 },
              }}
            >
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={blog.category?.toUpperCase() || 'BLOG'}
                  size="small"
                  sx={{
                    bgcolor: isDark ? 'rgba(168, 85, 247, 0.9)' : 'rgba(13, 148, 136, 0.9)',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                />
                {blog.isFeatured && (
                  <Chip
                    label={t('hot')}
                    size="small"
                    color="error"
                    sx={{ fontWeight: 700 }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 0.5, sm: 0 } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: { xs: 1.5, sm: 2 },
                fontFamily: 'Poppins',
                fontSize: { xs: '1.35rem', sm: '2rem', md: '2.5rem' },
                lineHeight: 1.25,
              }}
            >
              {blog.title}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, sm: 3 },
                mb: { xs: 2, sm: 3 },
                flexWrap: 'wrap',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: { xs: 24, sm: 32 }, height: { xs: 24, sm: 32 }, bgcolor: 'primary.main', fontSize: { xs: '0.75rem', sm: '1rem' } }}>
                  {blog.author?.username?.charAt(0).toUpperCase() || 'A'}
                </Avatar>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {t('by')} {blog.author?.username || 'Anonymous'}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {t('publishedOn')} {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: { xs: 0.5, sm: 1 },
                mb: { xs: 2, sm: 4 },
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Button
                variant={isLiked ? 'contained' : 'outlined'}
                color="error"
                startIcon={<Favorite sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                onClick={handleLike}
                size="small"
                sx={{ borderRadius: 2, fontSize: { xs: '0.7rem', sm: '0.875rem' }, px: { xs: 1, sm: 2 } }}
              >
                {blog.likes?.length || 0} {t('likes')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Comment sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                size="small"
                sx={{ borderRadius: 2, fontSize: { xs: '0.7rem', sm: '0.875rem' }, px: { xs: 1, sm: 2 } }}
              >
                {comments.length} {t('comments')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Visibility sx={{ fontSize: { xs: 16, sm: 20 } }} />}
                size="small"
                sx={{ borderRadius: 2, fontSize: { xs: '0.7rem', sm: '0.875rem' }, px: { xs: 1, sm: 2 } }}
              >
                {blog.views || 0} {t('views')}
              </Button>
              <Box sx={{ display: 'flex', gap: { xs: 0, sm: 0.5 }, ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-end' }, mt: { xs: 0.5, sm: 0 } }}>
                <IconButton onClick={() => handleShare('twitter')} color="primary" size="small" sx={{ p: { xs: 0.5, sm: 1 } }}>
                  <Twitter sx={{ fontSize: { xs: 18, sm: 24 } }} />
                </IconButton>
                <IconButton onClick={() => handleShare('facebook')} color="primary" size="small" sx={{ p: { xs: 0.5, sm: 1 } }}>
                  <Facebook sx={{ fontSize: { xs: 18, sm: 24 } }} />
                </IconButton>
                <IconButton onClick={() => handleShare('linkedin')} color="primary" size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  <LinkedIn />
                </IconButton>
                <IconButton onClick={() => handleShare('copy')} size="small" sx={{ p: { xs: 0.5, sm: 1 } }}>
                  <Share sx={{ fontSize: { xs: 18, sm: 24 } }} />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ mb: { xs: 2, sm: 4 } }} />

            {blog.contentType === 'html-only' ? (
              <Box sx={{ textAlign: 'center', py: 6, mb: 4 }}>
                <Typography variant="body1" color="text.secondary">Redirecting to standalone content...</Typography>
              </Box>
            ) : (
              <>
                {blog.description && (
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '0.95rem', sm: '1.125rem' },
                      lineHeight: { xs: 1.6, sm: 1.8 },
                      mb: { xs: 2, sm: 4 },
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {blog.description}
                  </Typography>
                )}

                {blog.content && (
                  <Box sx={{ width: '100%', mb: { xs: 2, sm: 4 } }}>
                    <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {Math.ceil(blog.content.split(/\s+/).length / 200)} min read
                      </Typography>
                    </Box>
                    <HtmlContent html={processContent(blog.content)} />
                  </Box>
                )}
              </>
            )}

            {blog.faq && blog.faq.length > 0 && (
              <Box sx={{ mb: { xs: 2, sm: 4 } }} className="article-faq">
                <Typography variant="h5" sx={{ fontWeight: 600, mb: { xs: 1.5, sm: 2 }, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>Frequently Asked Questions</Typography>
                {blog.faq.map((item, i) => (
                  <Accordion key={i} sx={{ bgcolor: 'background.paper', '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: '8px !important', overflow: 'hidden' }}>
                    <AccordionSummary expandIcon={<Typography sx={{ fontSize: { xs: 16, sm: 20 } }}>+</Typography>}>
                      <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' } }}>{item.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{item.answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}

            <Divider sx={{ my: { xs: 2, sm: 4 } }} />

            <Box sx={{ mb: { xs: 2, sm: 4 } }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: { xs: 1.5, sm: 3 }, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                {t('comments')} ({comments.length})
              </Typography>

              {isAuthenticated && (
                <Box
                  component="form"
                  onSubmit={handleSubmitComment}
                  sx={{ mb: { xs: 2, sm: 4 } }}
                >
                  <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'flex-start' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 28, sm: 40 }, height: { xs: 28, sm: 40 }, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder={t('writeComment')}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: { xs: 1, sm: 2 } }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      disabled={!newComment.trim() || submittingComment}
                    >
                      {submittingComment ? <CircularProgress size={20} /> : t('postComment')}
                    </Button>
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 3 } }}>
                {comments.map((comment) => (
                  <Box key={comment._id} sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: { xs: 28, sm: 40 }, height: { xs: 28, sm: 40 }, fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                      {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {comment.user?.username || 'User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' }, wordBreak: 'break-word' }}>
                        {comment.content}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {relatedNews.length > 0 && (
        <Box sx={{ bgcolor: 'background.paper', py: { xs: 2, sm: 4 } }}>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 600, mb: { xs: 1.5, sm: 3 }, fontSize: { xs: '1.15rem', sm: '1.5rem', md: '2rem' } }}>
              {t('relatedBlogs')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {relatedNews.map((item) => (
                <BlogCard key={item._id} blog={item} />
              ))}
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default BlogDetail;