import { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import { blogApi } from '../lib/api';
import BlogList from './BlogList';

const TopBlogs = ({ category, setCategory, sort, setSort }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopNews = async () => {
      setLoading(true);
      try {
        const response = await blogApi.getTop();
        setBlogs(response.data);
      } catch (err) {
        console.error('Failed to fetch top blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopNews();
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

export default TopBlogs;