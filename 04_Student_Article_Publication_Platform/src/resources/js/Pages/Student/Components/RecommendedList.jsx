import { Box, Typography, Stack, Paper, Chip, useTheme } from '@mui/material';
import { BookmarkBorder, Visibility, Comment } from '@mui/icons-material';
import { COLORS, DARK_COLORS } from '../DashboardSections/dashboardTheme';

export default function RecommendedList({
    articles = [],
    isDark = false,
    textColor,
    mutedColor,
}) {
    const theme = useTheme();
    // Use theme.palette.mode for dark mode detection, ignore isDark prop to avoid duplicate declaration
    const primaryText = textColor || theme.palette.text.primary;
    const secondaryText = mutedColor || theme.palette.text.secondary;

    return (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: theme.palette.background.paper }}>
            <Stack spacing={1.5}>
                {articles.map((article) => (
                    <Box
                        key={article.id}
                        sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            border: `1px solid ${theme.palette.divider}`,
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                bgcolor: isDark ? theme.palette.action.hover : theme.palette.action.selected,
                            },
                        }}
                    >
                        <Typography sx={{ color: primaryText, fontWeight: 600, fontSize: 14, mb: 0.5 }}>
                            {article.title}
                        </Typography>

                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Chip
                                label={article.category || 'General'}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: 10,
                                    bgcolor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    borderRadius: 1,
                                }}
                            />
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Visibility sx={{ fontSize: 12, color: secondaryText }} />
                                <Typography variant="caption" sx={{ color: primaryText }}>345</Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Comment sx={{ fontSize: 12, color: secondaryText }} />
                                <Typography variant="caption" sx={{ color: primaryText }}>{article.commentCount || 0}</Typography>
                            </Stack>
                            <BookmarkBorder sx={{ fontSize: 14, color: secondaryText }} />
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}
