import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    Avatar,
    Divider,
    IconButton,
    Stack,
    Paper,
    Button,
    Modal,
    Fade,
    Backdrop,
} from '@mui/material';
import {
    Close,
    StarBorder,
    Star,
    Schedule,
    Visibility,
    ArrowBack,
    ArrowForward,
} from '@mui/icons-material';
import CommentSection from './CommentSection';
import RecommendedList from './RecommendedList';
import { COLORS, DARK_COLORS, estimateReadingTime } from '../DashboardSections/dashboardTheme';
import { useTheme } from '@mui/material';

export default function ArticleView({
    article,
    open = false,
    onClose,
    onToggleStar,
    isStarred = false,
    starCount = 0,
    isTogglingStar = false,
    mode = 'light',
    onNext,
    onPrevious,
    onSubmitComment,
    isSubmittingComment = false,
    commentError = '',
    currentUserName = 'You',
}) {
    const [readingProgress, setReadingProgress] = useState(0);
    const [articleScrollRef, setArticleScrollRef] = useState(null);
    const [commentScrollRef, setCommentScrollRef] = useState(null);

    useEffect(() => {
        if (!open) return;

        const element = articleScrollRef;
        if (!element) return;

        const handleScroll = () => {
            const scrollTop = element.scrollTop;
            const scrollHeight = element.scrollHeight - element.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
        };

        element.addEventListener('scroll', handleScroll);
        return () => element.removeEventListener('scroll', handleScroll);
    }, [open, articleScrollRef]);

    if (!article) return null;

    const theme = useTheme();
    const isDark = mode === 'dark' || theme.palette.mode === 'dark';
    const bgColor = theme.palette.background.paper;
    const textColor = theme.palette.text.primary;
    const mutedColor = theme.palette.text.secondary;
    const readingTime = article.readMins || estimateReadingTime(article.content || article.excerpt || '');

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500, sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        width: '95%',
                        maxWidth: 1400,
                        height: '90vh',
                        bgcolor: bgColor,
                        borderRadius: 2,
                        boxShadow: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            bgcolor: `${COLORS.mediumPurple}30`,
                            zIndex: 20,
                        }}
                    >
                        <Box
                            sx={{
                                width: `${readingProgress}%`,
                                height: '100%',
                                bgcolor: COLORS.softPink,
                                transition: 'width 0.1s ease',
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            p: 2,
                            borderBottom: `1px solid ${isDark ? DARK_COLORS.border : `${COLORS.mediumPurple}30`}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: bgColor,
                            position: 'sticky',
                            top: 0,
                            zIndex: 15,
                        }}
                    >
                        <Typography variant="h6" sx={{ color: textColor, fontWeight: 600, fontSize: 16 }}>
                            {article.title.substring(0, 60)}{article.title.length > 60 ? '...' : ''}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton
                                onClick={() => onToggleStar?.(article.id)}
                                disabled={isTogglingStar}
                                sx={{ color: isStarred ? COLORS.softPink : mutedColor }}
                            >
                                {isStarred ? <Star /> : <StarBorder />}
                            </IconButton>
                            <Typography variant="caption" sx={{ color: mutedColor, alignSelf: 'center', minWidth: 20 }}>
                                {starCount}
                            </Typography>
                            <IconButton onClick={onClose} sx={{ color: mutedColor }}>
                                <Close />
                            </IconButton>
                        </Stack>
                    </Box>

                    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                        <Box
                            ref={setArticleScrollRef}
                            sx={{
                                flex: '0 0 70%',
                                overflowY: 'auto',
                                p: 3,
                                borderRight: `1px solid ${isDark ? DARK_COLORS.border : `${COLORS.mediumPurple}20`}`,
                                '&::-webkit-scrollbar': { width: 8 },
                                '&::-webkit-scrollbar-track': {
                                    background: isDark ? DARK_COLORS.border : '#f1f1f1',
                                    borderRadius: 4,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
                                    borderRadius: 4,
                                },
                            }}
                        >
                            <ArticleContent
                                article={article}
                                readingTime={readingTime}
                                textColor={textColor}
                                mutedColor={mutedColor}
                                isDark={isDark}
                            />

                            <Box sx={{ mt: 4 }}>
                                <RecommendedList
                                    articles={article.recommendations || []}
                                    isDark={isDark}
                                    textColor={textColor}
                                    mutedColor={mutedColor}
                                />
                            </Box>
                        </Box>

                        <Box
                            ref={setCommentScrollRef}
                            sx={{
                                flex: '0 0 30%',
                                overflowY: 'auto',
                                p: 2,
                                bgcolor: isDark ? `${DARK_COLORS.cardBg}80` : '#F9F9FC',
                                '&::-webkit-scrollbar': { width: 8 },
                                '&::-webkit-scrollbar-track': {
                                    background: isDark ? DARK_COLORS.border : '#f1f1f1',
                                    borderRadius: 4,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
                                    borderRadius: 4,
                                },
                            }}
                        >
                            <CommentSection
                                comments={article.comments || []}
                                isDark={isDark}
                                textColor={textColor}
                                mutedColor={mutedColor}
                                onSubmitComment={onSubmitComment}
                                isSubmitting={isSubmittingComment}
                                currentUserName={currentUserName}
                                errorMessage={commentError}
                            />
                        </Box>
                    </Box>

                    {(onPrevious || onNext) && (
                        <Box
                            sx={{
                                p: 2,
                                borderTop: `1px solid ${isDark ? DARK_COLORS.border : `${COLORS.mediumPurple}30`}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                bgcolor: bgColor,
                            }}
                        >
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={onPrevious}
                                disabled={!onPrevious}
                                sx={{
                                    color: mutedColor,
                                    textTransform: 'none',
                                    '&:hover:not(:disabled)': { color: COLORS.softPink },
                                }}
                            >
                                Previous Article
                            </Button>
                            <Button
                                endIcon={<ArrowForward />}
                                onClick={onNext}
                                disabled={!onNext}
                                sx={{
                                    color: mutedColor,
                                    textTransform: 'none',
                                    '&:hover:not(:disabled)': { color: COLORS.softPink },
                                }}
                            >
                                Next Article
                            </Button>
                        </Box>
                    )}
                </Box>
            </Fade>
        </Modal>
    );
}

function ArticleContent({ article, readingTime, textColor, mutedColor, isDark }) {
    const theme = useTheme();
    const liveViews =
        typeof article.views === 'number'
            ? article.views
            : typeof article.viewCount === 'number'
              ? article.viewCount
              : typeof article.view_count === 'number'
                ? article.view_count
                : null;

    return (
        <Stack spacing={2}>
            <Typography
                variant="h1"
                sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 700, color: theme.palette.text.primary, lineHeight: 1.2 }}
            >
                {article.title}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                        sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main, fontSize: 14, fontWeight: 600 }}
                    >
                        {article.author?.charAt(0) || 'A'}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {article.author || 'Journal Editorial Board'}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} divider={<Divider orientation="vertical" flexItem />}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Schedule sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            {article.publishedAt
                                ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'Unpublished'}
                        </Typography>
                    </Stack>
                    {liveViews !== null && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Visibility sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                {liveViews.toLocaleString()} views
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </Stack>

            <Box
                sx={{
                    mt: 2,
                    '& p': { fontSize: 16, lineHeight: 1.7, color: theme.palette.text.primary, mb: 2 },
                    '& h2': { fontSize: 24, fontWeight: 600, color: theme.palette.text.primary, mt: 4, mb: 2 },
                    '& h3': {
                        fontSize: 20,
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        mt: 3,
                        mb: 1.5,
                    },
                    '& blockquote': {
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        bgcolor: theme.palette.action.selected,
                        py: 1,
                        px: 3,
                        my: 3,
                        borderRadius: 1,
                        fontStyle: 'italic',
                        color: theme.palette.primary.main,
                    },
                }}
            >
                {article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                    <p>{article.excerpt || 'No content available.'}</p>
                )}
            </Box>

            {article.tags && article.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                    {article.tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
                        />
                    ))}
                </Stack>
            )}
        </Stack>
    );
}
