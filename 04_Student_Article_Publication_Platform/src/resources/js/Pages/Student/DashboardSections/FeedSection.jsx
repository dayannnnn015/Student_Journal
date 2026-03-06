import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Avatar,
  Tooltip,
  Fade,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material';
import {
  BookmarkBorder,
  Bookmark,
  Visibility,
  ChatBubbleOutline,
  Star,
  TrendingUp,
  Schedule,
  ArrowForward,
  Search as SearchIcon,
  Whatshot,
} from '@mui/icons-material';
import { COLORS, DARK_COLORS, SORT_OPTIONS } from './dashboardTheme';

// Metric Badge Component - Original style
const MetricBadge = ({ icon, value, color, tooltip }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Tooltip title={tooltip} arrow placement="top">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Box sx={{ color: theme.palette.text.secondary, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, fontFamily: theme.typography.fontFamily }}>
          {value}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

// Category Chip Component - Original style
const CategoryChip = ({ label, color, isDark }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 22,
        fontSize: '0.72rem',
        fontWeight: 700,
        bgcolor: theme.palette.action.selected,
        color: theme.palette.primary.main,
        borderRadius: 0,
        border: `1px solid ${theme.palette.divider}`,
        fontFamily: theme.typography.fontFamily,
        '& .MuiChip-label': { px: 1.2 },
      }}
    />
  );
};

// Empty State Component - Original style
const EmptyState = ({ icon, title, description, actionLabel, onClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 0,
          border: `2px double ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
        }}
      >
        <Box sx={{
          color: theme.palette.primary.main,
          mb: 2,
          transform: 'scale(1.5)',
        }}>
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary, fontFamily: theme.typography.fontFamily }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3, maxWidth: 340, mx: 'auto', fontFamily: theme.typography.fontFamily }}>
          {description}
        </Typography>
        <Button
          variant="outlined"
          onClick={onClick}
          endIcon={<ArrowForward />}
          sx={{
            borderColor: theme.palette.text.primary,
            color: theme.palette.text.primary,
            borderRadius: 0,
            textTransform: 'none',
            px: 3,
            fontWeight: 700,
            fontFamily: theme.typography.fontFamily,
            '&:hover': {
              bgcolor: theme.palette.text.primary,
              color: theme.palette.background.paper,
            },
          }}
        >
          {actionLabel}
        </Button>
      </Paper>
    </Fade>
  );
};

// Loading indicator component - Original style
const LoadingIndicator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          gap: 2,
        }}
      >
        <CircularProgress
          size={32}
          sx={{
            color: isDark ? DARK_COLORS.softPink : COLORS.softPink,
          }}
        />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Loading more articles...
        </Typography>
      </Box>
    </Fade>
  );
};

export default function FeedSection({
  activeNav,
  filteredArticles,
  search,
  sortBy,
  onSortChange,
  bookmarkedIds,
  onToggleBookmark,
  textPrimary,
  textSecondary,
  borderColor,
  onOpenArticle,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const loadingRef = useRef();

  const ARTICLES_PER_PAGE = 5;

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayedArticles(filteredArticles.slice(0, ARTICLES_PER_PAGE));
    setPage(1);
    setHasMore(filteredArticles.length > ARTICLES_PER_PAGE);
  }, [filteredArticles]);

  // Load more articles
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const end = nextPage * ARTICLES_PER_PAGE;
      setDisplayedArticles(filteredArticles.slice(0, end));
      setPage(nextPage);
      setHasMore(end < filteredArticles.length);
      setLoading(false);
    }, 500);
  }, [loading, hasMore, page, filteredArticles]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMore]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 0,
        border: `2px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.default,
        boxShadow: theme.shadows[2],
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {/* Masthead Header Section */}
      <Box sx={{
        borderBottom: `4px double ${theme.palette.divider}`,
        mb: 3,
        pb: 1.5,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontSize: { xs: '1.5rem', md: '2.2rem' },
              mr: 1,
            }}
          >
            {activeNav === 'saved' ? 'Saved Articles' : 'Student Journal'}
          </Typography>
          {filteredArticles.length > 0 && (
            <Chip
              label={filteredArticles.length}
              size="small"
              sx={{
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                fontWeight: 700,
                borderRadius: 0,
                border: `1px solid ${theme.palette.divider}`,
                fontFamily: theme.typography.fontFamily,
              }}
            />
          )}
        </Box>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            sx={{
              borderRadius: 0,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              border: `1px solid ${theme.palette.divider}`,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.primary,
              },
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value || option} value={option.value || option}>
                {option.label || option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Empty States */}
      {activeNav === 'saved' && filteredArticles.length === 0 && (
        <EmptyState
          icon={<Bookmark sx={{ fontSize: 48 }} />}
          title="No bookmarks yet"
          description="Articles you save will appear right here for easy access"
          actionLabel="Browse Articles"
          onClick={() => {}}
        />
      )}

      {search.trim() && filteredArticles.length === 0 && (
        <EmptyState
          icon={<SearchIcon sx={{ fontSize: 48 }} />}
          title="No matches found"
          description="Try different keywords or browse our trending section"
          actionLabel="View Trending"
          onClick={() => {}}
        />
      )}

      {/* Articles List */}
      <Stack spacing={2}>
        {displayedArticles.map((article, index) => {
          const bookmarked = bookmarkedIds.has(article.id);
          const isHot = article.hot;
          const isNew = index < 2;

          return (
            <Fade in timeout={300 + index * 100} key={article.id || index}>
              <Paper
                elevation={0}
                onClick={() => onOpenArticle(article.id)}
                sx={{
                  p: 3,
                  borderRadius: 0,
                  border: `1.5px solid ${theme.palette.divider}`,
                  boxShadow: theme.shadows[1],
                  transition: 'all 250ms ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: theme.palette.background.paper,
                  fontFamily: theme.typography.fontFamily,
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    borderColor: theme.palette.text.primary,
                    background: theme.palette.action.hover,
                  },
                  '&::after': article.progress > 0 ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${article.progress}%`,
                    height: '3px',
                    background: theme.palette.primary.main,
                    transition: 'width 300ms ease',
                  } : {},
                  '&::before': isHot ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '0 30px 30px 0',
                    borderColor: `transparent ${theme.palette.warning.main} transparent transparent`,
                    opacity: 0.7,
                  } : {},
                }}
              >
                <Stack spacing={2}>
                  {/* Top Row - Categories & Metadata */}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                      <CategoryChip label={article.category} />
                    </Stack>
                    <Tooltip title={bookmarked ? "Remove bookmark" : "Save article"}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(article.id);
                        }}
                        sx={{
                          color: bookmarked ? '#b30000' : '#888',
                          '&:hover': {
                            bgcolor: '#eee',
                          },
                        }}
                      >
                        {bookmarked ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  {/* Title & Excerpt */}
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        mb: 1,
                        lineHeight: 1.2,
                        color: '#111',
                        fontSize: '1.25rem',
                        fontFamily: 'Georgia, Times, "Times New Roman", serif',
                        letterSpacing: 0.2,
                      }}
                    >
                      {article.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#444',
                        fontFamily: 'Georgia, Times, "Times New Roman", serif',
                        fontSize: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {article.excerpt}
                    </Typography>
                  </Box>
                  {/* Metrics Row */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Visibility sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.disabled, fontFamily: theme.typography.fontFamily }}>
                          {(article.viewCount || 0).toLocaleString()}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ChatBubbleOutline sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.disabled, fontFamily: theme.typography.fontFamily }}>
                          {article.commentCount || 0}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Star sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.disabled, fontFamily: theme.typography.fontFamily }}>
                          {article.starCount || 0}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenArticle(article.id);
                      }}
                      endIcon={<ArrowForward />}
                      sx={{
                        color: theme.palette.text.primary,
                        borderColor: theme.palette.text.primary,
                        borderRadius: 0,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontFamily: theme.typography.fontFamily,
                        '&:hover': {
                          bgcolor: theme.palette.text.primary,
                          color: theme.palette.background.paper,
                        },
                      }}
                    >
                      Read
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Fade>
          );
        })}
      </Stack>

      {/* Infinite scroll sentinel */}
      {hasMore && filteredArticles.length > 0 && (
        <Box ref={loadingRef} sx={{ mt: 2 }}>
          {loading ? <LoadingIndicator /> : null}
        </Box>
      )}
    </Paper>
  );
}
