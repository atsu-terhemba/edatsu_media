import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GuestLayout from '@/Layouts/GuestLayout';
import Metadata from '@/Components/Metadata';
import FixedMobileNav from '@/Components/FixedMobileNav';
import { usePage, Link } from '@inertiajs/react';
import { useContext, useState } from 'react';
import { AuthContext } from '@/Layouts/GuestLayout';
import axios from 'axios';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, timerProgressBar: true,
});

const reportConfirm = async (type, id) => {
    const { value: reason, isConfirmed } = await Swal.fire({
        title: 'Report this ' + type,
        input: 'textarea',
        inputPlaceholder: 'Why is this being reported? (optional)',
        showCancelButton: true,
        confirmButtonText: 'Submit report',
        confirmButtonColor: '#000',
    });
    if (!isConfirmed) return;
    try {
        await axios.post('/api/forum/report', { type, id, reason: reason || null });
        Toast.fire({ icon: 'success', title: 'Report submitted' });
    } catch {
        Toast.fire({ icon: 'error', title: 'Failed to submit report' });
    }
};

const PostBlock = ({ post, isAuthenticated, onReply, isReply = false, children }) => (
    <div style={{
        background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0',
        padding: isReply ? '14px 16px' : '20px', marginBottom: '10px',
        marginLeft: isReply ? '36px' : 0,
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: isReply ? '12px' : '13px', fontWeight: 600, color: '#000' }}>
                    {post.user?.name || 'Anonymous'}
                </span>
                <span style={{ fontSize: '11px', color: '#b0b0b5' }}>· {post.created_at}</span>
            </div>
            {isAuthenticated && (
                <button
                    onClick={() => reportConfirm('post', post.id)}
                    title="Report"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#b0b0b5' }}>flag</span>
                </button>
            )}
        </div>
        <p style={{ fontSize: isReply ? '12.5px' : '13px', color: '#000', lineHeight: 1.55, margin: '0 0 8px', whiteSpace: 'pre-wrap' }}>{post.body}</p>
        {isAuthenticated && !isReply && (
            <button
                onClick={() => onReply(post)}
                style={{
                    background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                    fontSize: '11px', fontWeight: 500, color: '#86868b',
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontFamily: "'Poppins', sans-serif",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f97316'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>reply</span>
                Reply
            </button>
        )}
        {children}
    </div>
);

const ForumThread = () => {
    const { thread, posts: initialPosts = [], isMuted: initialMuted, auth } = usePage().props;
    const authUser = useContext(AuthContext);
    const isAuthenticated = !!authUser || !!auth?.user;

    const [posts, setPosts] = useState(initialPosts);
    const [muted, setMuted] = useState(initialMuted);
    const [replyBody, setReplyBody] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null); // post object or null
    const [inlineBody, setInlineBody] = useState('');
    const [inlineSubmitting, setInlineSubmitting] = useState(false);

    const submitReply = async (body, parent_id = null) => {
        const res = await axios.post(`/api/forum/threads/${thread.id}/posts`, {
            body: body.trim(),
            parent_id,
        });
        setPosts((prev) => [...prev, res.data.post]);
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyBody.trim() || submitting) return;
        setSubmitting(true);
        try {
            await submitReply(replyBody);
            setReplyBody('');
            Toast.fire({ icon: 'success', title: 'Reply posted' });
        } catch {
            Toast.fire({ icon: 'error', title: 'Failed to reply' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleInlineReply = async (e) => {
        e.preventDefault();
        if (!inlineBody.trim() || inlineSubmitting || !replyingTo) return;
        setInlineSubmitting(true);
        try {
            await submitReply(inlineBody, replyingTo.id);
            setInlineBody('');
            setReplyingTo(null);
            Toast.fire({ icon: 'success', title: 'Reply posted' });
        } catch {
            Toast.fire({ icon: 'error', title: 'Failed to reply' });
        } finally {
            setInlineSubmitting(false);
        }
    };

    // Group posts: top-level posts (parent_id null) with their children
    const topLevel = posts.filter((p) => !p.parent_id);
    const childrenByParent = posts.reduce((acc, p) => {
        if (p.parent_id) {
            (acc[p.parent_id] ||= []).push(p);
        }
        return acc;
    }, {});

    const toggleMute = async () => {
        try {
            if (muted) {
                await axios.delete(`/api/forum/threads/${thread.id}/mute`);
                setMuted(false);
                Toast.fire({ icon: 'success', title: 'Unmuted' });
            } else {
                await axios.post(`/api/forum/threads/${thread.id}/mute`);
                setMuted(true);
                Toast.fire({ icon: 'success', title: 'Muted' });
            }
        } catch {
            Toast.fire({ icon: 'error', title: 'Failed' });
        }
    };

    return (
        <GuestLayout>
            <Metadata title={thread.title} description={thread.body || ''} />

            <section style={{ background: '#f5f5f7', minHeight: '90vh', padding: '96px 0 120px' }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Link href="/forum" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#86868b', textDecoration: 'none', marginBottom: '20px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                                Back to forum
                            </Link>

                            {/* OP card */}
                            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', padding: '28px', marginBottom: '20px' }}>
                                {thread.categories?.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                                        {thread.categories.map((c) => (
                                            <span key={c.id} style={{
                                                fontSize: '11px', fontWeight: 500, color: '#f97316',
                                                background: '#fff7ed', border: '1px solid #fed7aa',
                                                padding: '3px 10px', borderRadius: '9999px',
                                            }}>{c.name}</span>
                                        ))}
                                    </div>
                                )}

                                <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#000', margin: '0 0 10px', lineHeight: 1.3, fontFamily: "'Poppins', sans-serif" }}>
                                    {thread.title}
                                </h1>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#86868b', marginBottom: '16px' }}>
                                    <span>{thread.user?.name || 'Anonymous'}</span>
                                    <span>·</span>
                                    <span>{thread.created_at}</span>
                                </div>

                                {thread.body && (
                                    <p style={{ fontSize: '14px', color: '#000', lineHeight: 1.6, margin: '0 0 16px', whiteSpace: 'pre-wrap' }}>
                                        {thread.body}
                                    </p>
                                )}

                                {thread.article_link && (
                                    <a href={thread.article_link} target="_blank" rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px',
                                            color: '#86868b', textDecoration: 'none', background: '#f5f5f7',
                                            padding: '8px 14px', borderRadius: '8px', marginBottom: '16px',
                                        }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>link</span>
                                        {thread.article_source ? `${thread.article_source}: ` : ''}{thread.article_title || thread.article_link}
                                    </a>
                                )}

                                {isAuthenticated && (
                                    <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid #f0f0f0' }}>
                                        <button onClick={toggleMute}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                background: 'transparent', border: '1px solid #e5e5e5',
                                                color: '#86868b', fontSize: '12px', fontWeight: 500,
                                                padding: '6px 12px', borderRadius: '9999px', cursor: 'pointer',
                                                fontFamily: "'Poppins', sans-serif",
                                            }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                                {muted ? 'notifications_off' : 'notifications'}
                                            </span>
                                            {muted ? 'Unmute' : 'Mute'}
                                        </button>
                                        <button onClick={() => reportConfirm('thread', thread.id)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                background: 'transparent', border: '1px solid #e5e5e5',
                                                color: '#86868b', fontSize: '12px', fontWeight: 500,
                                                padding: '6px 12px', borderRadius: '9999px', cursor: 'pointer',
                                                fontFamily: "'Poppins', sans-serif",
                                            }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>flag</span>
                                            Report
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Replies */}
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px' }}>
                                {posts.length} {posts.length === 1 ? 'reply' : 'replies'}
                            </div>

                            {topLevel.map((p) => (
                                <PostBlock key={p.id} post={p} isAuthenticated={isAuthenticated} onReply={setReplyingTo}>
                                    {(childrenByParent[p.id] || []).map((c) => (
                                        <PostBlock key={c.id} post={c} isAuthenticated={isAuthenticated} isReply />
                                    ))}
                                    {replyingTo?.id === p.id && (
                                        <form onSubmit={handleInlineReply} style={{ marginTop: '12px', marginLeft: '36px' }}>
                                            <textarea
                                                value={inlineBody}
                                                onChange={(e) => setInlineBody(e.target.value)}
                                                rows={3}
                                                maxLength={10000}
                                                placeholder={`Reply to ${p.user?.name || 'Anonymous'}…`}
                                                autoFocus
                                                style={{
                                                    width: '100%', padding: '8px 10px', border: '1px solid #e5e5e5',
                                                    borderRadius: '8px', fontSize: '12.5px', fontFamily: "'Poppins', sans-serif",
                                                    outline: 'none', resize: 'vertical', marginBottom: '8px',
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button type="submit" disabled={!inlineBody.trim() || inlineSubmitting}
                                                    style={{
                                                        padding: '6px 14px', borderRadius: '9999px', border: 'none',
                                                        background: (!inlineBody.trim() || inlineSubmitting) ? '#b0b0b5' : '#000',
                                                        color: '#fff', fontSize: '12px', fontWeight: 500,
                                                        cursor: (!inlineBody.trim() || inlineSubmitting) ? 'not-allowed' : 'pointer',
                                                        fontFamily: "'Poppins', sans-serif",
                                                    }}>
                                                    {inlineSubmitting ? 'Posting…' : 'Reply'}
                                                </button>
                                                <button type="button" onClick={() => { setReplyingTo(null); setInlineBody(''); }}
                                                    style={{
                                                        padding: '6px 14px', borderRadius: '9999px',
                                                        border: '1px solid #e5e5e5', background: '#fff',
                                                        color: '#86868b', fontSize: '12px', fontWeight: 500,
                                                        cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
                                                    }}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </PostBlock>
                            ))}

                            {/* Reply form */}
                            {isAuthenticated ? (
                                <form onSubmit={handleReply} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', padding: '20px', marginTop: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#000', marginBottom: '8px' }}>
                                        Your reply
                                    </label>
                                    <textarea
                                        value={replyBody}
                                        onChange={(e) => setReplyBody(e.target.value)}
                                        rows={4}
                                        maxLength={10000}
                                        placeholder="Share your thoughts…"
                                        style={{
                                            width: '100%', padding: '10px 12px', border: '1px solid #e5e5e5',
                                            borderRadius: '8px', fontSize: '13px', fontFamily: "'Poppins', sans-serif",
                                            outline: 'none', resize: 'vertical', marginBottom: '12px',
                                        }}
                                    />
                                    <button type="submit" disabled={!replyBody.trim() || submitting}
                                        style={{
                                            padding: '10px 22px', borderRadius: '9999px', border: 'none',
                                            background: (!replyBody.trim() || submitting) ? '#b0b0b5' : '#000',
                                            color: '#fff', fontSize: '13px', fontWeight: 500,
                                            cursor: (!replyBody.trim() || submitting) ? 'not-allowed' : 'pointer',
                                            fontFamily: "'Poppins', sans-serif",
                                        }}>
                                        {submitting ? 'Posting…' : 'Post reply'}
                                    </button>
                                </form>
                            ) : (
                                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', padding: '20px', marginTop: '20px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: '0 0 12px' }}>Log in to reply</p>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        <a href="/login" style={{ padding: '8px 18px', borderRadius: '9999px', border: '1px solid #e5e5e5', background: '#fff', color: '#000', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}>Login</a>
                                        <a href="/sign-up" style={{ padding: '8px 18px', borderRadius: '9999px', border: 'none', background: '#000', color: '#fff', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}>Sign Up</a>
                                    </div>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>

            <FixedMobileNav isAuthenticated={isAuthenticated} />
        </GuestLayout>
    );
};

export default ForumThread;
