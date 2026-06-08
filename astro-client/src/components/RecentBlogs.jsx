import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { blogApi } from '../lib/api';
import BlogList from './BlogList';

const RecentBlogs = ({ category, setCategory, sort, setSort }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentNews = async () => {
      setLoading(true);
      try {
        const response = await blogApi.getRecent();
        setBlogs(response.data);
      } catch (err) {
        console.error('Failed to fetch recent blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentNews();
  }, []);

  return (
    <Box>
      <BlogList
        blogs={blogs}
        loading={loading}
        showPagination={false}
        onUpdate={(updated) => {
          setBlogs(blogs.map(n => n._id === updated._id ? updated : n));
        }}
      />
    </Box>
  );
};

export default RecentBlogs;