import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import Home from "@mui/icons-material/Home";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Favorite from "@mui/icons-material/Favorite";
import Build from "@mui/icons-material/Build";
import WorkspacePremium from "@mui/icons-material/WorkspacePremium";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import Close from "@mui/icons-material/Close";
import TrendingDown from "@mui/icons-material/TrendingDown";
import Timeline from "@mui/icons-material/Timeline";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeContext } from "../stores/ThemeContext";
import { useData } from "../stores/DataContext";
import { useLanguage } from "../stores/LanguageContext";
import { blogApi, websiteSettingApi } from "../lib/api";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'color-mix(in srgb, var(--color-text), transparent 92%)',
  "&:hover": {
    backgroundColor: 'color-mix(in srgb, var(--color-text), transparent 88%)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  transition: "width 0.3s ease",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: 'var(--color-textSecondary)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
      "&:focus": {
        width: "40ch",
      },
    },
  },
}));

const navItems = [
  { label: "home", path: "/", icon: <Home /> },
  { label: "topBlogs", path: "/top-blogs", icon: <TrendingUp /> },
  { label: "likedBlogs", path: "/liked", icon: <Favorite /> },
  { label: "Services", path: "/services", icon: <Build /> },
  { label: "Top Services", path: "/top-services", icon: <WorkspacePremium /> },
  { label: "settings", path: "/settings", icon: <Settings /> },
  { label: "trp", path: "/trp", icon: <TrendingUp /> },
];

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme, isDark } = useThemeContext();
  const { user, isAuthenticated, isAdmin, logout } = useData();
  const { language, toggleLanguage, t } = useLanguage();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [trpData, setTrpData] = useState(null);
  const [trpLoading, setTrpLoading] = useState(true);
  const [siteName, setSiteName] = useState('BlogHub');
  const [siteTitle, setSiteTitle] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [logoWidth, setLogoWidth] = useState('');
  const [logoHeight, setLogoHeight] = useState('40');
  const [logoBorderRadius, setLogoBorderRadius] = useState('0');
  const searchRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    websiteSettingApi.get().then(res => {
      const d = res.data;
      if (d?.siteName) setSiteName(d.siteName);
      if (d?.siteTitle) setSiteTitle(d.siteTitle);
      if (d?.siteTitle || d?.siteName) document.title = d?.siteTitle || d?.siteName;
      if (d?.logo) setSiteLogo(d.logo);
      if (d?.logoWidth) setLogoWidth(d.logoWidth);
      if (d?.logoHeight) setLogoHeight(d.logoHeight);
      if (d?.logoBorderRadius) setLogoBorderRadius(d.logoBorderRadius);
      if (d?.favicon) {
        let link = document.querySelector('link[rel="icon"]');
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = d.favicon;
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchTRP = async () => {
      try {
        const response = await blogApi.getTRP();
        setTrpData(response.data);
      } catch (err) {
        console.error("Failed to fetch TRP:", err);
      } finally {
        setTrpLoading(false);
      }
    };
    fetchTRP();
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box
        sx={{
          px: 2,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          {siteLogo ? (
            <Box component="img" src={siteLogo} alt={siteName} sx={{ height: logoHeight ? parseInt(logoHeight) : 40, width: logoWidth ? parseInt(logoWidth) : 'auto', objectFit: 'contain', borderRadius: logoBorderRadius ? parseInt(logoBorderRadius) : 0 }} />
          ) : (
            <Typography sx={{ fontWeight: 700, fontSize: "1.25rem", fontFamily: "Poppins" }}>{siteName}</Typography>
          )}
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.slice(0, 5).map((item) => (
          <ListItem
            button
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              bgcolor:
                location.pathname === item.path
                  ? 'color-mix(in srgb, var(--color-headerText), transparent 92%)'
                  : "transparent",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={t(item.label)} />
          </ListItem>
        ))}
        <ListItem
          button
          component={Link}
          to="/trp"
          onClick={handleDrawerToggle}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Timeline />
          </ListItemIcon>
          <ListItemText primary={t("TRP")} />
        </ListItem>
        {isAdmin && (
          <ListItem
            button
            component={Link}
            to="/admin"
            onClick={handleDrawerToggle}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={t("admin")} />
          </ListItem>
        )}

      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'color-mix(in srgb, var(--color-headerBg), transparent 10%)',
          borderBottom: 1,
          borderColor: 'var(--color-border)',
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64, md: 70 }, px: { xs: 0.5, sm: 3 }, gap: { xs: 0.5, sm: 1 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: { xs: 0, sm: 1 }, color: 'var(--color-headerText)', p: { xs: 0.5, sm: 1 } }}
            >
              <MenuIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
            </IconButton>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.5rem" },
                fontFamily: "Poppins",
                color: 'var(--color-primary)',
                mr: { xs: 0.5, sm: 3 },
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {siteLogo ? (
                <Box component="img" src={siteLogo} alt={siteName} sx={{ height: { xs: 32, sm: logoHeight ? parseInt(logoHeight) : 40 }, width: { xs: 'auto', sm: logoWidth ? parseInt(logoWidth) : 'auto' }, maxHeight: { xs: 32, sm: 'none' }, objectFit: 'contain', borderRadius: logoBorderRadius ? parseInt(logoBorderRadius) : 0 }} />
              ) : (
                siteName
              )}
            </Box>
          </motion.div>

          <Search
            ref={searchRef}
            sx={{
              flexGrow: 1,
              maxWidth: searchFocused || searchQuery ? 500 : 300,
              display: { xs: "none", sm: "block" },
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={t("searchBlogs")}
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              onFocus={() => setSearchFocused(true)}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {navItems.slice(0, 5).map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: 'var(--color-headerText)',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  bgcolor:
                    location.pathname === item.path
                      ? 'color-mix(in srgb, var(--color-headerText), transparent 92%)'
                      : "transparent",
                  "&:hover": { bgcolor: 'color-mix(in srgb, var(--color-headerText), transparent 88%)' },
                }}
              >
                {t(item.label)}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.25, sm: 1 }, ml: { xs: 0, sm: 1 } }}>
            <Button
              onClick={toggleLanguage}
              variant="outlined"
              size="small"
              sx={{
                minWidth: "auto",
                px: { xs: 0.75, sm: 1.5 },
                fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                fontWeight: 600,
                borderColor: 'var(--color-border)',
              }}
              aria-label="toggle language"
            >
              {language === "en" ? "हिं" : "EN"}
            </Button>

            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <IconButton
                onClick={toggleTheme}
                sx={{ color: 'var(--color-headerText)', p: { xs: 0.5, sm: 1 } }}
                  aria-label="toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDark ? <LightMode sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <DarkMode sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                  </motion.div>
                </AnimatePresence>
              </IconButton>
            </motion.div>

            <Box
              component={Link}
              to="/trp"
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor:
                  trpData?.trend === "up"
                    ? 'var(--color-success)'
                    : trpData?.trend === "down"
                      ? 'var(--color-error)'
                      : 'var(--color-warning)',
                color: "#fff",
                textDecoration: "none",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor:
                    trpData?.trend === "up"
                      ? 'var(--color-success)'
                      : trpData?.trend === "down"
                        ? 'var(--color-error)'
                        : 'var(--color-warning)',
                },
              }}
            >
              {trpLoading ? (
                <CircularProgress size={16} sx={{ color: "#fff" }} />
              ) : (
                <>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    TRP: {trpData?.trp || 0}
                  </Typography>
                  {trpData?.trend === "up" && <TrendingUp sx={{ fontSize: 14 }} />}
                  {trpData?.trend === "down" && (
                    <TrendingDown sx={{ fontSize: 14 }}/>
                  )}
                </>
              )}
            </Box>

            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ p: 0, ml: { xs: 0.25, sm: 1 } }}
                  aria-label="user menu"
                >
                  <Avatar
                    src={user?.avatar}
                    alt={user?.username}
                    sx={{ bgcolor: 'var(--color-primary)', width: { xs: 30, sm: 32, md: 36 }, height: { xs: 30, sm: 32, md: 36 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    sx: { mt: 1, minWidth: 200 },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Box sx={{ fontWeight: 600 }}>{user?.username}</Box>
                    <Box sx={{ fontSize: "0.875rem", color: 'var(--color-textSecondary)' }}>
                      {user?.email}
                    </Box>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/settings");
                    }}
                  >
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    {t("settings")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/liked");
                    }}
                  >
                    <ListItemIcon>
                      <Favorite fontSize="small" />
                    </ListItemIcon>
                    {t("likedBlogs")}
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/admin");
                      }}
                    >
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      {t("admin")}
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    {t("logout")}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 }, ml: { xs: 0.25, sm: 1 } }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{ display: { xs: "none", sm: "flex" }, px: { sm: 1.5 } }}
                >
                  {t("login")}
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="small"
                  sx={{ px: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.7rem', sm: '0.8125rem' } }}
                >
                  {t("register")}
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;