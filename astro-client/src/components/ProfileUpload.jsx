import { useState, useRef } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import CloudUpload from '@mui/icons-material/CloudUpload';
import { motion } from 'framer-motion';
import { uploadApi } from '../lib/api';

const ProfileUpload = ({ onUploadComplete, currentAvatar }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) { setError('Invalid file type.'); return false; }
    if (file.size > maxSize) { setError('File size too large. Max 5MB.'); return false; }
    return true;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    const files = e.dataTransfer.files;
    if (files && files[0] && validateFile(files[0])) await uploadFile(files[0]);
  };

  const handleChange = async (e) => {
    e.preventDefault();
    setError(null);
    const files = e.target.files;
    if (files && files[0] && validateFile(files[0])) await uploadFile(files[0]);
  };

  const uploadFile = async (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    try {
      const response = await uploadApi.uploadProfile(file);
      if (onUploadComplete) onUploadComplete(response.data.avatar);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <motion.div
        animate={{ borderColor: dragActive ? '#0D9488' : '#e0e0e0', backgroundColor: dragActive ? 'rgba(13, 148, 136, 0.05)' : 'transparent' }}
        style={{ border: '2px dashed', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} onChange={handleChange} />
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}><CircularProgress size={40} /><Typography color="text.secondary">Uploading...</Typography></Box>
        ) : preview || currentAvatar ? (
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <img src={preview || currentAvatar} alt="Preview" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
            </motion.div>
            <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'primary.main', borderRadius: '50%', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloudUpload sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Box><Typography variant="h6" gutterBottom>Drag and drop your profile picture</Typography><Typography variant="body2" color="text.secondary">or click to browse</Typography></Box>
            <Typography variant="caption" color="text.secondary">JPG, PNG, GIF or WebP. Max 5MB.</Typography>
          </Box>
        )}
      </motion.div>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default ProfileUpload;