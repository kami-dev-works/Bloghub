import {
  Box,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Public from '@mui/icons-material/Public';
import Computer from '@mui/icons-material/Computer';
import Business from '@mui/icons-material/Business';
import SportsSoccer from '@mui/icons-material/SportsSoccer';
import Movie from '@mui/icons-material/Movie';
import HealthAndSafety from '@mui/icons-material/HealthAndSafety';
import Science from '@mui/icons-material/Science';
import Language from '@mui/icons-material/Language';
import TrendingUp from '@mui/icons-material/TrendingUp';
import AccessTime from '@mui/icons-material/AccessTime';
import Visibility from '@mui/icons-material/Visibility';
import Favorite from '@mui/icons-material/Favorite';
import FilterList from '@mui/icons-material/FilterList';
import { useLanguage } from '../stores/LanguageContext';

const categoryIcons = {
  all: <Public />,
  technology: <Computer />,
  business: <Business />,
  sports: <SportsSoccer />,
  entertainment: <Movie />,
  health: <HealthAndSafety />,
  science: <Science />,
  world: <Language />,
};

const sortIcons = {
  '-createdAt': <AccessTime />,
  'createdAt': <AccessTime />,
  '-views': <Visibility />,
  '-likes': <Favorite />,
};

const categories = [
  { value: 'all', labelKey: 'allCategories' },
  { value: 'technology', labelKey: 'technology' },
  { value: 'business', labelKey: 'business' },
  { value: 'sports', labelKey: 'sports' },
  { value: 'entertainment', labelKey: 'entertainment' },
  { value: 'health', labelKey: 'health' },
  { value: 'science', labelKey: 'science' },
  { value: 'world', labelKey: 'world' },
];

const sortOptions = [
  { value: '-createdAt', labelKey: 'newestFirst' },
  { value: 'createdAt', labelKey: 'oldestFirst' },
  { value: '-views', labelKey: 'mostViews' },
  { value: '-likes', labelKey: 'mostLiked' },
];

const Sidebar = ({ category, setCategory, sort, setSort, showMobileFilters, setShowMobileFilters }) => {
  const { t } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCategoryChange = (value) => {
    setCategory(value);
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  const sidebarContent = (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterList sx={{ fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {t('category')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5,  }}>
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={category === cat.value ? 'contained' : 'text'}
              onClick={() => handleCategoryChange(cat.value)}
              startIcon={categoryIcons[cat.value]}
              sx={{
                justifyContent: 'flex-start',
                borderRadius: 2,
                py: 1,
                px: 2,
                textTransform: 'none',
                bgcolor: category === cat.value 
                  ? 'primary.main' 
                  : 'transparent',
                color: category === cat.value 
                  ? '#fff' 
                  : 'text.primary',
                '&:hover': {
                  bgcolor: category === cat.value 
                    ? 'primary.dark' 
                    : 'action.hover',
                },
              }}
            >
              {t(cat.labelKey)}
            </Button>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUp sx={{ fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {t('sortBy')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sort === option.value ? 'contained' : 'text'}
              onClick={() => setSort(option.value)}
              startIcon={sortIcons[option.value]}
              sx={{
                justifyContent: 'flex-start',
                borderRadius: 2,
                py: 1,
                px: 2,
                textTransform: 'none',
                bgcolor: sort === option.value 
                  ? 'primary.main' 
                  : 'transparent',
                color: sort === option.value 
                  ? '#fff' 
                  : 'text.primary',
                '&:hover': {
                  bgcolor: sort === option.value 
                    ? 'primary.dark' 
                    : 'action.hover',
                },
              }}
            >
              {t(option.labelKey)}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Box
        sx={{
          display: { xs: showMobileFilters ? 'block' : 'none', md: 'none' },
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 2,
          mb: 2,
          boxShadow: 1,
        }}
      >
        {sidebarContent}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
        width: 250,
        flexShrink: 0,
        position: 'sticky',
        top: 80,
        height: 'fit-content',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        boxShadow: 1,
      }}
    >
      {sidebarContent}
    </Box>
  );
};

export default Sidebar;