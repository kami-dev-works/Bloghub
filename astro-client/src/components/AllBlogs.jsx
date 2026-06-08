import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Chip, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from '@mui/material';
import ViewList from '@mui/icons-material/ViewList';
import ViewModule from '@mui/icons-material/ViewModule';
import { blogApi } from '../lib/api';
import BlogList from './BlogList';
import { useLanguage } from '../stores/LanguageContext';

const AllBlogs = ({ category, setCategory, sort, setSort }) => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('list');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        sort,
      };
      
      if (category && category !== 'all') {
        params.category = category;
      }
      
      if (search) {
        params.search = search;
      }

      const response = await blogApi.getAll(params);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, category, sort, search]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1;

    if (categoryParam && categoryParam !== category) {
      setCategory(categoryParam);
    }
    if (searchParam && searchParam !== search) {
      setSearch(searchParam);
    }
    if (pageParam !== page) {
      setPage(pageParam);
    }
  }, [searchParams]);

  const handlePageChange = (event, value) => {
    setPage(value);
    const params = new URLSearchParams(searchParams);
    if (value <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(value));
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    
    const params = new URLSearchParams(searchParams);
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    setSearchParams(params);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const handleViewModeChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <Box>
      {search && (
        <Chip
          label={`${t('searchBlogs')}: ${search}`}
          onDelete={() => {
            setSearch('');
            setSearchParams({});
          }}
          color="primary"
          sx={{ mb: 2 }}
        />
      )}
      
      {isDesktop && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            aria-label="view mode"
          >
            <ToggleButton value="list" aria-label="list view">
              <ViewList sx={{ mr: 0.5 }} />
              List
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModule sx={{ mr: 0.5 }} />
              Grid
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
      
      <BlogList
        blogs={blogs}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onUpdate={(updated) => {
          setBlogs(blogs.map(n => n._id === updated._id ? updated : n));
        }}
        viewMode={viewMode}
      />
    </Box>
  );
};

export default AllBlogs;