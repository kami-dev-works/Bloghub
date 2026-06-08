import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
} from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import Visibility from '@mui/icons-material/Visibility';
import Favorite from '@mui/icons-material/Favorite';
import Comment from '@mui/icons-material/Comment';
import Share from '@mui/icons-material/Share';
import { motion } from 'framer-motion';
import { useThemeContext } from '../stores/ThemeContext';
import { useData } from '../stores/DataContext';
import { useLanguage } from '../stores/LanguageContext';
import { getImgSrcSet } from '../lib/images';
import { blogApi } from '../lib/api';
import { toBlogSlug } from '../lib/slug';

const BlogCard = ({ blog, onUpdate, viewMode = 'list' }) => {
  const { isDark } = useThemeContext();
  const { isAuthenticated, user, showToast, refreshUser } = useData();
  const { t } = useLanguage();
  const isHtmlOnly = blog.contentType === 'html-only';
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes?.length || 0);
  const [liking, setLiking] = useState(false);
  const prevBlogId = useRef(blog._id);
  const prevUserId = useRef(user?._id);

  useEffect(() => {
    let changed = false;
    if (prevBlogId.current !== blog._id) {
      prevBlogId.current = blog._id;
      changed = true;
    }
    if (prevUserId.current !== user?._id) {
      prevUserId.current = user?._id;
      changed = true;
    }
    if (!changed) return;
    const userId = user?._id;
    if (!userId) {
      setLikeCount(blog.likes?.length || 0);
      setIsLiked(false);
      return;
    }
    if (Array.isArray(blog.likes)) {
      const liked = blog.likes.some(like => (like._id || like).toString() === userId.toString());
      setIsLiked(liked);
      setLikeCount(blog.likes.length);
    } else {
      const likedFromUser = user?.likedNews?.some(id => (id._id || id).toString() === blog._id.toString());
      setIsLiked(likedFromUser);
    }
  }, [user, blog.likes, blog._id, user?.likedNews]);

  const handleMenuOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast('Please login to like blog', 'warning');
      return;
    }
    try {
      if (liking) return;
      setLiking(true);
      const response = await blogApi.like(blog._id);
      setIsLiked(response.data.liked);
      setLikeCount(response.data.likes);
      if (onUpdate) {
        const userId = user._id.toString();
        if (response.data.liked) {
          onUpdate({ ...blog, likes: [...(blog.likes || []), userId] });
        } else {
          onUpdate({ ...blog, likes: (blog.likes || []).filter(id => (id._id || id).toString() !== userId) });
        }
      }
      if (refreshUser) {
        refreshUser();
      }
    } catch (err) {
      showToast('Failed to like blog', 'error');
    } finally {
      setLiking(false);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.description,
        url: window.location.origin + `/blog/${blog.slug || toBlogSlug(blog.title, blog._id, blog.shortId)}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/blog/${blog.slug || toBlogSlug(blog.title, blog._id, blog.shortId)}`);
      showToast('Link copied to clipboard!', 'success');
    }
    handleMenuClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        component={isHtmlOnly ? 'a' : Link}
        href={isHtmlOnly ? `/render/blog/${blog.slug || toBlogSlug(blog.title, blog._id, blog.shortId)}` : undefined}
        to={isHtmlOnly ? undefined : `/blog/${blog.slug || toBlogSlug(blog.title, blog._id, blog.shortId)}`}
        target={isHtmlOnly ? '_blank' : undefined}
        rel={isHtmlOnly ? 'noopener noreferrer' : undefined}
        sx={{
          textDecoration: 'none',
          display: 'flex',
          flexDirection: viewMode === 'grid' ? 'column' : { xs: 'column', sm: 'row' },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          mb: viewMode === 'grid' ? 0 : 2,
          height: viewMode === 'grid' ? '100%' : 'auto',
          '&:hover': {
            boxShadow: isDark
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(0,0,0,0.1)',
            '& .card-image': {
              transform: 'scale(1.02)',
            },
          },
        }}
      >
        {viewMode === 'grid' && (
          <Box
            sx={{
              width: '100%',
              height: 180,
              position: 'relative',
            }}
          >
            <CardMedia
              component="img"
              image={blog.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'}
              alt={blog.title}
              className="card-image"
              loading="lazy"
              srcSet={getImgSrcSet(blog.image)}
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 400px"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
              }}
            />
          </Box>
        )}
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                label={blog.category?.toUpperCase() || 'NEWS'}
                size="small"
                sx={{
                  bgcolor: isDark ? 'rgba(168, 85, 247, 0.9)' : 'rgba(13, 148, 136, 0.9)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                }}
              />
              {blog.isFeatured && (
                <Chip
                  label="HOT"
                  size="small"
                  color="error"
                  sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                />
              )}
            </Box>

            <Typography
              gutterBottom
              variant="h6"
              component="h3"
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                lineHeight: 1.3,
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                color: 'text.primary',
              }}
            >
              {blog.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flexGrow: 1,
              }}
            >
              {blog.description || t('clickToReadMore')}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pt: 1,
                borderTop: 1,
                borderColor: 'divider',
                gap: { xs: 0.5, sm: 1 },
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap', minWidth: 0 }}>
                <Tooltip title="Views">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Visibility sx={{ fontSize: { xs: 14, sm: 20 }, opacity: 0.7 }} />
                    <Typography variant="caption" sx={{ opacity: 0.7, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {blog.views || 0}
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                    <Box
                      component="button"
                      onClick={handleLike}
                      disabled={liking}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        border: 'none',
                        bgcolor: 'transparent',
                        cursor: liking ? 'default' : 'pointer',
                        color: isLiked ? 'error.main' : 'inherit',
                        transition: 'color 0.2s ease',
                        opacity: liking ? 0.6 : 1,
                        '&:hover': { color: liking ? 'inherit' : 'error.main' },
                        p: 0,
                      }}
                    >
                    <Favorite sx={{ fontSize: { xs: 14, sm: 20 }, opacity: 0.7 }} />
                    <Typography variant="caption" sx={{ opacity: 0.7, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {likeCount}
                    </Typography>
                  </Box>
                </Tooltip>

                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                  <Tooltip title="Comments">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Comment fontSize="small" sx={{ opacity: 0.7 }} />
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {blog.comments?.length || 0}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: { xs: 'none', sm: 'inline' } }}
                >
                  {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    p: { xs: 0.25, sm: 0.5 },
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                  aria-label="more options"
                >
                  <MoreVert sx={{ fontSize: { xs: 16, sm: 20 } }} />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Box>

        {viewMode !== 'grid' && (
          <Box
            sx={{
              flex: { xs: '0 0 100%', sm: '0 0 35%' },
              height: { xs: 200, sm: 'auto' },
              minHeight: { sm: 160 },
              position: 'relative',
              order: { xs: -1, sm: 1 },
            }}
          >
            <CardMedia
              component="img"
              image={blog.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'}
              alt={blog.title}
              className="card-image"
              loading="lazy"
              srcSet={getImgSrcSet(blog.image)}
              sizes="(max-width: 600px) 100vw, 400px"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
              }}
            />
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{ sx: { minWidth: 150 } }}
        >
          <MenuItem onClick={handleShare}>
            <Share fontSize="small" sx={{ mr: 1 }} />
            Share
          </MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
};

export default BlogCard;