import { useState } from 'react';
import { Box, Typography, Avatar, Stack, Paper, Divider, TextField, Button, useTheme } from '@mui/material';
import { COLORS, DARK_COLORS } from '../DashboardSections/dashboardTheme';

export default function CommentSection({
    comments = [],
    isDark: isDarkProp = false,
    textColor,
    mutedColor,
    onSubmitComment,
    isSubmitting = false,
    currentUserName = 'You',
    errorMessage = '',
}) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const primaryText = textColor || theme.palette.text.primary;
    const secondaryText = mutedColor || theme.palette.text.secondary;

    const handleSubmit = () => {
        const value = commentText.trim();
        if (!value || !onSubmitComment || isSubmitting) {
            return;
        }
        onSubmitComment(value);
        setCommentText('');
    };

    const handleReplySubmit = (parentId) => {
        const value = replyText.trim();
        if (!value || !onSubmitComment || isSubmitting) return;
        onSubmitComment(value, parentId);
        setReplyText('');
        setReplyingTo(null);
    };

    const renderReplies = (replies, parentId) => (
        <Stack spacing={1.5} sx={{ ml: 5, mt: 1 }}>
            {replies.map((reply) => (
                <Stack key={reply.id} direction="row" spacing={1.5}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.royalPurple }}>
                        {reply.author?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: primaryText }}>
                                {reply.author || 'Anonymous'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: secondaryText }}>
                                • {reply.created_at ? new Date(reply.created_at).toLocaleString() : 'just now'}
                            </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: secondaryText }}>
                            {reply.body}
                        </Typography>
                    </Box>
                </Stack>
            ))}
        </Stack>
    );

    return (
        <Paper elevation={0} sx={{
            p: 3,
            borderRadius: 0,
            bgcolor: theme.palette.background.default,
            border: `2px solid ${theme.palette.divider}`,
            fontFamily: 'Georgia, Times, "Times New Roman", serif',
            boxShadow: isDark ? '0 2px 12px 0 rgba(0,0,0,0.18)' : '0 2px 12px 0 rgba(0,0,0,0.04)',
        }}>
            <Typography variant="h3" sx={{ color: theme.palette.text.primary, fontSize: 22, fontWeight: 900, mb: 2, fontFamily: 'Georgia, Times, "Times New Roman", serif', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Comments ({comments.length})
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, fontFamily: 'Georgia, Times, "Times New Roman", serif', fontWeight: 700 }}>
                    {(currentUserName || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            handleSubmit();
                        }
                    }}
                    sx={{
                        fontFamily: 'Georgia, Times, "Times New Roman", serif',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            fontFamily: 'Georgia, Times, "Times New Roman", serif',
                            '& fieldset': { borderColor: '#222' },
                            '&.Mui-focused': {
                                boxShadow: 'none',
                                outline: 'none',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#222',
                            },
                            '& input:focus': {
                                outline: 'none',
                            },
                        },
                    }}
                />
                <Button
                    variant="outlined"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !commentText.trim()}
                    sx={{
                        borderColor: theme.palette.text.primary,
                        color: theme.palette.text.primary,
                        borderRadius: 0,
                        textTransform: 'none',
                        minWidth: 88,
                        fontWeight: 700,
                        fontFamily: 'Georgia, Times, "Times New Roman", serif',
                        '&:hover': { bgcolor: theme.palette.text.primary, color: theme.palette.background.paper },
                        '&:focus, &:focus-visible': {
                            outline: 'none',
                            boxShadow: `0 0 0 2px ${theme.palette.text.primary}22`,
                        },
                        '&.Mui-disabled': { opacity: 0.6, color: theme.palette.text.disabled },
                    }}
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
            </Stack>

            {errorMessage ? (
                <Typography variant="caption" sx={{ color: theme.palette.error.main, display: 'block', mb: 2, fontFamily: 'Georgia, Times, "Times New Roman", serif' }}>
                    {errorMessage}
                </Typography>
            ) : null}

            <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

            <Stack spacing={2}>
                {comments.map((comment) => (
                    <Box key={comment.id}>
                        <Stack direction="row" spacing={1.5}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, fontFamily: 'Georgia, Times, "Times New Roman", serif', fontWeight: 700 }}>
                                {comment.author?.charAt(0) || 'U'}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 900, color: theme.palette.text.primary, fontFamily: 'Georgia, Times, "Times New Roman", serif' }}>
                                        {comment.author || 'Anonymous'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.disabled, fontFamily: 'Georgia, Times, "Times New Roman", serif' }}>
                                        • {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'just now'}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontFamily: 'Georgia, Times, "Times New Roman", serif' }}>
                                    {comment.body}
                                </Typography>
                                <Button
                                    size="small"
                                    sx={{ mt: 0.5, color: theme.palette.text.primary, textTransform: 'none', fontFamily: 'Georgia, Times, "Times New Roman", serif', fontWeight: 700, borderRadius: 0, border: `1px solid ${theme.palette.text.primary}`, px: 2, py: 0.5, minWidth: 60, fontSize: '0.9rem', '&:hover': { bgcolor: theme.palette.text.primary, color: theme.palette.background.paper } }}
                                    onClick={() => setReplyingTo(comment.id)}
                                >
                                    Reply
                                </Button>
                                {replyingTo === comment.id && (
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            placeholder="Write a reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' && !event.shiftKey) {
                                                    event.preventDefault();
                                                    handleReplySubmit(comment.id);
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => handleReplySubmit(comment.id)}
                                            disabled={isSubmitting || !replyText.trim()}
                                            sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, borderRadius: 1.5, textTransform: 'none' }}
                                        >
                                            {isSubmitting ? 'Posting...' : 'Reply'}
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                            sx={{ color: theme.palette.primary.main, textTransform: 'none' }}
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                )}
                                {comment.replies && comment.replies.length > 0 && renderReplies(comment.replies, comment.id)}
                            </Box>
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}
