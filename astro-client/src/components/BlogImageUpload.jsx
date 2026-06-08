import { useState, useRef } from 'react';
import { Box, Typography, CircularProgress, Alert, IconButton } from '@mui/material';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Delete from '@mui/icons-material/Delete';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadApi } from '../lib/api';

const BlogImageUpload = ({ onUploadComplete, label = 'Upload Image', folder }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.');
      return false;
    }
    if (file.size > maxSize) {
      setError('File size too large. Maximum 5MB allowed.');
      return false;
    }
    return true;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        await uploadFile(file);
      }
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    setError(null);
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        await uploadFile(file);
      }
    }
  };

  const uploadFile = async (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      let imageUrl;
      if (folder) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await uploadApi.uploadSiteAsset(formData, folder);
        imageUrl = response.data.url;
      } else {
        const response = await uploadApi.uploadBlogImage(file);
        imageUrl = response.data.image;
      }
      if (onUploadComplete) onUploadComplete(imageUrl);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (onUploadComplete) onUploadComplete(null);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{label}</Typography>
      
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              <Box component="img" src={preview} alt="Preview" sx={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover' }} />
              <IconButton onClick={handleClear} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
                <Delete />
              </IconButton>
            </Box>
          </motion.div>
        ) : (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              animate={{ borderColor: dragActive ? '#0D9488' : '#e0e0e0', backgroundColor: dragActive ? 'rgba(13, 148, 136, 0.05)' : '#fafafa' }}
              style={{ border: '2px dashed', borderRadius: '12px',             padding: { xs: '24px 16px', sm: '40px 20px' }, textAlign: 'center', cursor: loading ? 'wait' : 'pointer', transition: 'all 0.3s ease' }}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={loading ? undefined : handleClick}
            >
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} onChange={handleChange} />
              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={40} />
                  <Typography color="text.secondary">Uploading...</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CloudUpload sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="h6" gutterBottom>{label}</Typography>
                    <Typography variant="body2" color="text.secondary">Drag and drop or click to browse</Typography>
                  </Box>
                </Box>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default BlogImageUpload;