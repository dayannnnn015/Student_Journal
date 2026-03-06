import { Box, Chip, Paper, Stack, Typography, Avatar, Tooltip, alpha, useTheme } from '@mui/material';
import {
  TrendingUp,
  Whatshot,
  AccessTime,
  PlayCircle,
} from '@mui/icons-material';
import { COLORS, DARK_COLORS } from './dashboardTheme';

// Widget Header Component
const WidgetHeader = ({ icon, title, badge }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2.5 }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ color: theme.palette.text.primary, display: 'flex' }}>{icon}</Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 900,
            color: theme.palette.text.primary,
            fontFamily: 'Georgia, Times, "Times New Roman", serif',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Typography>
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{
              bgcolor: isDark ? alpha(theme.palette.warning.light, 0.15) : theme.palette.warning.light,
              color: theme.palette.warning.dark,
              height: 20,
              fontSize: '0.7rem',
              borderRadius: 0,
              border: `1px solid ${theme.palette.warning.dark}`,
              fontFamily: 'Georgia, Times, "Times New Roman", serif',
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};

// Trending Item Component
const TrendingItem = ({ item, index, onClick, isDark }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      onClick={() => onClick?.(item.id)}
      sx={{
        p: 2,
        borderRadius: 0,
        border: `1.5px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        fontFamily: 'Georgia, Times, "Times New Roman", serif',
        boxShadow: isDark ? '0 2px 8px 0 rgba(0,0,0,0.18)' : '0 2px 8px 0 rgba(0,0,0,0.03)',
        '&:hover': {
          background: isDark ? alpha(theme.palette.primary.light, 0.08) : theme.palette.action.hover,
          borderColor: theme.palette.primary.main,
          transform: 'translateX(4px)',
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar
          sx={{
            width: 28,
            height: 28,
            bgcolor: isDark ? alpha(theme.palette.primary.light, 0.15) : theme.palette.grey[200],
            color: theme.palette.text.primary,
            fontSize: '0.75rem',
            fontWeight: 700,
            fontFamily: 'Georgia, Times, "Times New Roman", serif',
          }}
        >
          {index + 1}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 900,
              mb: 0.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: theme.palette.text.primary,
              fontFamily: 'Georgia, Times, "Times New Roman", serif',
            }}
          >
            {item.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={item.category || 'Article'}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.6rem',
                bgcolor: isDark ? alpha(theme.palette.background.paper, 0.2) : theme.palette.background.default,
                color: theme.palette.text.primary,
                borderRadius: 0,
                border: `1px solid ${theme.palette.divider}`,
                fontFamily: 'Georgia, Times, "Times New Roman", serif',
                '& .MuiChip-label': { px: 0.75 },
              }}
            />
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Whatshot sx={{ fontSize: 12, color: theme.palette.warning.main }} />
              <Typography variant="caption" sx={{ color: theme.palette.warning.main, fontWeight: 700, fontFamily: 'Georgia, Times, "Times New Roman", serif' }}>
                {item.trending || Math.floor(Math.random() * 50) + 50}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

// Continue Reading Item Component
const ContinueReadingItem = ({ item, onClick, isDark }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      onClick={() => onClick?.(item.id)}
      sx={{
        p: 2,
        borderRadius: 0,
        border: `1.5px solid ${theme.palette.divider}`,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        bgcolor: theme.palette.background.paper,
        fontFamily: 'Georgia, Times, "Times New Roman", serif',
        boxShadow: isDark ? '0 2px 8px 0 rgba(0,0,0,0.18)' : '0 2px 8px 0 rgba(0,0,0,0.03)',
        '&:hover': {
          background: isDark ? alpha(theme.palette.primary.light, 0.08) : theme.palette.action.hover,
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.text.primary, fontFamily: 'Georgia, Times, "Times New Roman", serif' }}>
            {item.title}
          </Typography>
          <Tooltip title="Continue reading">
            <PlayCircle sx={{ fontSize: 18, color: theme.palette.warning.main }} />
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default function RightWidgets({
  trendingItems = [],
  continueReading = [],
  textPrimary,
  textSecondary,
  borderColor,
  onArticleClick,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      {/* Trending Widget */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 0,
          border: `2px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
          fontFamily: 'Georgia, Times, "Times New Roman", serif',
          boxShadow: isDark ? '0 2px 12px 0 rgba(0,0,0,0.18)' : '0 2px 12px 0 rgba(0,0,0,0.04)',
        }}
      >
        <WidgetHeader
          icon={<TrendingUp sx={{ fontSize: 20, color: theme.palette.text.primary }} />}
          title="Trending Now"
          badge="Live"
        />

        <Box
          sx={{
            maxHeight: { xs: 280, md: 340 },
            overflowY: 'auto',
            pr: 0.5,
            mr: -0.5,
          }}
        >
          <Stack spacing={0.5}>
            {trendingItems.map((item, index) => (
              <TrendingItem
                key={item.id || index}
                item={item}
                index={index}
                onClick={onArticleClick}
                isDark={isDark}
              />
            ))}
          </Stack>
        </Box>

        {trendingItems.length === 0 && (
          <Typography variant="body2" sx={{ color: theme.palette.text.disabled, textAlign: 'center', py: 3, fontFamily: 'Georgia, Times, "Times New Roman", serif' }}>
            No trending items
          </Typography>
        )}
      </Paper>

      {/* Continue Reading Widget */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 0,
          border: `2px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
          fontFamily: 'Georgia, Times, "Times New Roman", serif',
          boxShadow: isDark ? '0 2px 12px 0 rgba(0,0,0,0.18)' : '0 2px 12px 0 rgba(0,0,0,0.04)',
        }}
      >
        <WidgetHeader
          icon={<AccessTime sx={{ fontSize: 20, color: theme.palette.text.primary }} />}
          title="Continue Reading"
        />

        <Box
          sx={{
            maxHeight: { xs: 280, md: 340 },
            overflowY: 'auto',
            pr: 0.5,
            mr: -0.5,
          }}
        >
          <Stack spacing={1.5}>
            {continueReading.length > 0 ? (
              continueReading.map((item, index) => (
                <ContinueReadingItem
                  key={item.id || index}
                  item={item}
                  onClick={onArticleClick}
                  isDark={isDark}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: theme.palette.text.disabled, textAlign: 'center', py: 3, fontFamily: 'Georgia, Times, "Times New Roman", serif' }}>
                No articles in progress
              </Typography>
            )}
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
}
