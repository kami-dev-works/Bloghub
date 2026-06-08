import { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Button, useMediaQuery, useTheme } from '@mui/material';
import FilterList from '@mui/icons-material/FilterList';
import Header from './components/Header';
import Footer from './components/Footer';
import AdSlider from './components/AdSlider';
import Sidebar from './components/Sidebar';
import BlogSlider from './components/BlogSlider';
import NotificationMarquee from './components/NotificationMarquee';
import CategorySlider from './components/CategorySlider';
import ServiceSlider from './components/ServiceSlider';

const AllBlogs = lazy(() => import('./components/AllBlogs'));
const BlogDetail = lazy(() => import('./components/BlogDetail'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Submit = lazy(() => import('./components/Submit'));
const Settings = lazy(() => import('./components/Settings'));
const Admin = lazy(() => import('./components/Admin'));
const LikedBlogs = lazy(() => import('./components/LikedBlogs'));
const TopBlogs = lazy(() => import('./components/TopBlogs'));
const AllServices = lazy(() => import('./components/AllServices'));
const TopServices = lazy(() => import('./components/TopServices'));
const AllServiceCategories = lazy(() => import('./components/AllServiceCategories'));
const CategoryServices = lazy(() => import('./components/CategoryServices'));
const ServiceDetail = lazy(() => import('./components/ServiceDetail'));
const TRP = lazy(() => import('./components/TRP'));
const StaticPage = lazy(() => import('./components/StaticPage'));
import { useData } from './stores/DataContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useData();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Layout = ({ 
  category, 
  setCategory, 
  sort, 
  setSort,
  showSlider = true,
  showServiceSlider = false,
  children 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'all 0.3s ease',
      }}
    >
      <Header />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pb: 4,
        }}
      >
        {showSlider && <><BlogSlider /><NotificationMarquee /><CategorySlider /></>}
        {showServiceSlider && <ServiceSlider />}

        {typeof category !== 'undefined' && typeof setCategory !== 'undefined' ? (
          <Box sx={{ 
            maxWidth: 1400, 
            mx: 'auto', 
            px: { xs: 2, sm: 3 },
            mt: 4,
          }}>
            {isMobile && (
              <Button
                variant={showMobileFilters ? 'contained' : 'outlined'}
                startIcon={<FilterList />}
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                sx={{ mb: 2 }}
              >
                {showMobileFilters ? 'Hide Filters' : 'Filters'}
              </Button>
            )}

            <Box sx={{ display: 'flex', gap: 3 }}>
              <Sidebar
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
                showMobileFilters={showMobileFilters}
                setShowMobileFilters={setShowMobileFilters}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {children}
              </Box>
            </Box>
          </Box>
        ) : (
          children
        )}
      </Box>

      <AdSlider />
      <Footer />
    </Box>
  );
};

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress />
  </Box>
);

const AppContent = () => {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('-createdAt');

  return (
    <Suspense fallback={<LoadingFallback />}>
    <Routes>
      <Route path="/" element={
        <Layout
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          showSlider={true}
          showServiceSlider={true}
        >
          <AllBlogs 
            category={category} 
            setCategory={setCategory} 
            sort={sort} 
            setSort={setSort} 
          />
        </Layout>
      } />
      
      <Route path="/blog/:slug" element={
        <Layout showSlider={false}>
          <BlogDetail />
        </Layout>
      } />
      
      <Route path="/top-blogs" element={
        <Layout
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          showSlider={true}
        >
          <TopBlogs 
            category={category} 
            setCategory={setCategory} 
            sort={sort} 
            setSort={setSort} 
          />
        </Layout>
      } />
      
      <Route path="/liked" element={
        <ProtectedRoute>
          <Layout
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
            showSlider={true}
          >
            <LikedBlogs 
              category={category} 
              setCategory={setCategory} 
              sort={sort} 
              setSort={setSort} 
            />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/services" element={
        <Layout showSlider={true}>
          <AllServices />
        </Layout>
      } />
      
      <Route path="/top-services" element={
        <Layout showSlider={true}>
          <TopServices />
        </Layout>
      } />

      <Route path="/service-categories" element={
        <Layout showSlider={false}>
          <AllServiceCategories />
        </Layout>
      } />

      <Route path="/services/category/:value" element={
        <Layout showSlider={false}>
          <CategoryServices />
        </Layout>
      } />

      <Route path="/service/:slug" element={
        <Layout showSlider={false}>
          <ServiceDetail />
        </Layout>
      } />
      
      <Route path="/submit" element={
        <ProtectedRoute>
          <Layout showSlider={false}>
            <Submit />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout showSlider={false}>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <Layout showSlider={false}>
            <Admin />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/trp" element={
        <Layout showSlider={false}>
          <TRP />
        </Layout>
      } />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<StaticPage />} />
      <Route path="/contact" element={<StaticPage />} />
      <Route path="/terms" element={<StaticPage />} />
      <Route path="/privacy" element={<StaticPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;