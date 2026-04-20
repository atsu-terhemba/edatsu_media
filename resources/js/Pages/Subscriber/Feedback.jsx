import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SubscriberSideNav from './Components/SideNav';
import Footer from '@/Components/Footer';
import EmailVerificationOverlay from '@/Components/EmailVerificationOverlay';

function SectionEyebrow({ text }) {
    return (
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
                width: '24px',
                height: '2px',
                background: '#f97316',
                display: 'inline-block',
            }} />
            <span style={{
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#86868b',
            }}>
                {text}
            </span>
        </div>
    );
}

const categories = [
    { value: 'bug',     label: 'Bug report',      icon: 'bug_report',    hint: 'Something is broken or behaving unexpectedly.' },
    { value: 'feature', label: 'Feature request', icon: 'lightbulb',     hint: 'An idea you’d like us to consider.' },
    { value: 'general', label: 'General',         icon: 'chat',          hint: 'Thoughts on the experience overall.' },
    { value: 'other',   label: 'Other',           icon: 'more_horiz',    hint: 'Anything else you’d like to share.' },
];

export default function Feedback() {
    const { flash } = usePage().props;
    const [justSubmitted, setJustSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        category: 'general',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('subscriber.feedback.submit'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('subject', 'message');
                setJustSubmitted(true);
            },
        });
    };

    const charCount = data.message.length;
    const charMax = 5000;

    return (
        <AuthenticatedLayout>
            <Head title="Feedback" />

            <Container fluid={true}>
                <Container>
                    <Row className="g-4" style={{ paddingTop: '80px' }}>
                        <Col md={3} className="d-none d-md-block">
                            <SubscriberSideNav />
                        </Col>

                        <Col md={9} xs={12}>
                            {/* Header */}
                            <div style={{ paddingBottom: '24px' }}>
                                <SectionEyebrow text="Feedback" />
                                <h1 style={{
                                    fontSize: '28px',
                                    fontWeight: 600,
                                    color: '#000',
                                    margin: 0,
                                    letterSpacing: '-0.01em',
                                }}>
                                    Tell us what you think
                                </h1>
                                <p style={{ fontSize: '14px', color: '#86868b', margin: '6px 0 0', maxWidth: '560px' }}>
                                    Spotted a bug, dreaming up a feature, or just want to share? We read every message.
                                </p>
                            </div>

                            {(flash?.success || justSubmitted) && (
                                <div style={{
                                    background: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                    color: '#15803d',
                                    borderRadius: '14px',
                                    padding: '14px 18px',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '14px',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#16a34a' }}>
                                        check_circle
                                    </span>
                                    {flash?.success || 'Thanks — your feedback has been sent.'}
                                </div>
                            )}

                            <form onSubmit={submit}>
                                {/* Category */}
                                <div style={{
                                    padding: '28px',
                                    borderRadius: '16px',
                                    background: '#fff',
                                    border: '1px solid #f0f0f0',
                                    marginBottom: '16px',
                                }}>
                                    <SectionEyebrow text="What's this about" />
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '10px',
                                        marginTop: '12px',
                                    }}>
                                        {categories.map((cat) => {
                                            const active = data.category === cat.value;
                                            return (
                                                <button
                                                    type="button"
                                                    key={cat.value}
                                                    onClick={() => setData('category', cat.value)}
                                                    style={{
                                                        textAlign: 'left',
                                                        padding: '14px 16px',
                                                        borderRadius: '12px',
                                                        border: active ? '1px solid #000' : '1px solid #e5e5e7',
                                                        background: active ? '#000' : '#fff',
                                                        color: active ? '#fff' : '#000',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '10px',
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined" style={{
                                                        fontSize: '20px',
                                                        color: active ? '#f97316' : '#000',
                                                        flexShrink: 0,
                                                    }}>
                                                        {cat.icon}
                                                    </span>
                                                    <span style={{ minWidth: 0 }}>
                                                        <span style={{
                                                            display: 'block',
                                                            fontSize: '14px',
                                                            fontWeight: 500,
                                                            marginBottom: '2px',
                                                        }}>
                                                            {cat.label}
                                                        </span>
                                                        <span style={{
                                                            display: 'block',
                                                            fontSize: '12px',
                                                            color: active ? 'rgba(255,255,255,0.6)' : '#86868b',
                                                            lineHeight: 1.4,
                                                        }}>
                                                            {cat.hint}
                                                        </span>
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.category && (
                                        <div style={{ color: '#b91c1c', fontSize: '13px', marginTop: '10px' }}>{errors.category}</div>
                                    )}
                                </div>

                                {/* Subject */}
                                <div style={{
                                    padding: '28px',
                                    borderRadius: '16px',
                                    background: '#fff',
                                    border: '1px solid #f0f0f0',
                                    marginBottom: '16px',
                                }}>
                                    <SectionEyebrow text="Subject" />
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        maxLength={150}
                                        placeholder="A short headline"
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            border: '1px solid #e5e5e7',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            color: '#000',
                                            background: '#fff',
                                            outline: 'none',
                                            marginTop: '10px',
                                            transition: 'border-color 0.15s ease',
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                                    />
                                    {errors.subject && (
                                        <div style={{ color: '#b91c1c', fontSize: '13px', marginTop: '8px' }}>{errors.subject}</div>
                                    )}
                                </div>

                                {/* Message */}
                                <div style={{
                                    padding: '28px',
                                    borderRadius: '16px',
                                    background: '#fff',
                                    border: '1px solid #f0f0f0',
                                    marginBottom: '16px',
                                }}>
                                    <SectionEyebrow text="Your message" />
                                    <textarea
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        maxLength={charMax}
                                        rows={8}
                                        placeholder="Walk us through it. The more detail, the better."
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            border: '1px solid #e5e5e7',
                                            borderRadius: '12px',
                                            fontSize: '14px',
                                            color: '#000',
                                            background: '#fff',
                                            outline: 'none',
                                            marginTop: '10px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            lineHeight: 1.55,
                                            transition: 'border-color 0.15s ease',
                                        }}
                                        onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e7'}
                                    />
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: '8px',
                                    }}>
                                        {errors.message ? (
                                            <div style={{ color: '#b91c1c', fontSize: '13px' }}>{errors.message}</div>
                                        ) : <span />}
                                        <span style={{
                                            fontSize: '12px',
                                            color: charCount > charMax * 0.9 ? '#f97316' : '#86868b',
                                        }}>
                                            {charCount.toLocaleString()} / {charMax.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '32px' }}>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '12px 28px',
                                            borderRadius: '9999px',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            background: '#000',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: processing ? 'wait' : 'pointer',
                                            opacity: processing ? 0.7 : 1,
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                            send
                                        </span>
                                        {processing ? 'Sending…' : 'Send feedback'}
                                    </button>
                                </div>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Footer />
            <EmailVerificationOverlay />
        </AuthenticatedLayout>
    );
}
