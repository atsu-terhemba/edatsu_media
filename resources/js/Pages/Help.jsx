import { Fragment, useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import Metadata from "@/Components/Metadata";
import { Container, Row, Col } from 'react-bootstrap';

export default function Help() {
    useEffect(() => {
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        const script = document.createElement("script");
        script.async = true;
        script.src = 'https://embed.tawk.to/5b8c155cf31d0f771d846049/default';
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');

        const firstScript = document.getElementsByTagName("script")[0];
        firstScript.parentNode.insertBefore(script, firstScript);

        window.Tawk_API.onLoad = function () {
            console.log('Tawk.to chat widget loaded successfully');
        };

        return () => {
            if (window.Tawk_API && window.Tawk_API.hideWidget) {
                window.Tawk_API.hideWidget();
            }
            const tawkScript = document.querySelector('script[src*="tawk.to"]');
            if (tawkScript) tawkScript.remove();
        };
    }, []);

    const Eyebrow = ({ children }) => (
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <span style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 600,
                color: '#86868b',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontFamily: "'Poppins', sans-serif",
            }}>
                {children}
            </span>
            <div style={{
                width: '36px', height: '2px',
                background: '#f97316', borderRadius: '2px',
                margin: '8px auto 0',
            }} />
        </div>
    );

    const faqs = [
        { q: 'How do I create an account?', a: 'Click Sign Up in the top right, enter your details, or use Google/Apple to sign up instantly.' },
        { q: 'How do I bookmark opportunities?', a: 'Tap the bookmark icon on any opportunity card. Saved items appear in your dashboard.' },
        { q: 'What is Pro and what do I get?', a: 'Pro unlocks unlimited bookmarks, custom feeds, bulk exports, and priority support.' },
        { q: 'How do I cancel my subscription?', a: 'Go to Billing in your account menu and click Cancel Subscription. You keep access until the period ends.' },
        { q: 'How do I change my email or password?', a: 'Open Profile from the side menu to update personal details, email, or password.' },
        { q: 'How do I post an opportunity or product?', a: 'Contact us at info@edatsu.com — we manually review submissions to keep quality high.' },
    ];

    return (
        <Fragment>
            <Metadata
                title="Edatsu Help Center | Get Support & Find Answers"
                description="Need assistance? Visit the Edatsu Help Center to find answers to common questions, troubleshoot issues, and get support for using our platform and services."
                keywords="Edatsu help center, customer support, FAQs, troubleshooting, user assistance"
                canonicalUrl="https://www.edatsu.com/help"
                ogTitle="Edatsu Help Center | Get Support & Find Answers"
                ogDescription="Need assistance? Visit the Edatsu Help Center to find answers to common questions, troubleshoot issues, and get support for using our platform and services."
                ogImage="/img/logo/help_banner.jpg"
                ogUrl="https://www.edatsu.com/help"
                twitterTitle="Edatsu Help Center | Get Support & Find Answers"
                twitterDescription="Need assistance? Visit the Edatsu Help Center to find answers to common questions, troubleshoot issues, and get support for using our platform and services."
                twitterImage="/img/logo/help_banner.jpg"
            />

            <GuestLayout>
                {/* Hero */}
                <section style={{ padding: '120px 0 64px', background: '#fff' }}>
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={9} lg={8}>
                                <Eyebrow>Help Center</Eyebrow>
                                <h1 style={{
                                    fontSize: 'clamp(32px, 5vw, 48px)',
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    margin: '0 0 16px',
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.1,
                                    fontFamily: "'Poppins', sans-serif",
                                    color: '#000',
                                }}>
                                    How can we help?
                                </h1>
                                <p style={{
                                    fontSize: '15px',
                                    color: '#86868b',
                                    textAlign: 'center',
                                    lineHeight: 1.6,
                                    margin: '0 auto',
                                    maxWidth: '520px',
                                }}>
                                    Get instant support through our live chat, email us, or browse common questions below.
                                </p>

                                <div style={{
                                    display: 'flex', justifyContent: 'center',
                                    gap: '10px', marginTop: '32px', flexWrap: 'wrap',
                                }}>
                                    <a
                                        href="https://tawk.to/chat/5b8c155cf31d0f771d846049/default"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            padding: '12px 22px',
                                            borderRadius: '9999px',
                                            background: '#000', color: '#fff',
                                            textDecoration: 'none',
                                            fontSize: '14px', fontWeight: 500,
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f97316'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#000'; }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
                                        Start Live Chat
                                    </a>
                                    <a
                                        href="mailto:info@edatsu.com?subject=Help%20Request%20-%20Edatsu%20Support&body=Hi%20Edatsu%20Support%20Team,%0D%0A%0D%0AI%20need%20assistance%20with:%0D%0A%0D%0A[Please%20describe%20your%20question%20or%20issue%20here]%0D%0A%0D%0AThank%20you!"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            padding: '12px 22px',
                                            borderRadius: '9999px',
                                            background: '#fff', color: '#000',
                                            border: '1px solid #e5e5e7',
                                            textDecoration: 'none',
                                            fontSize: '14px', fontWeight: 500,
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f7'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
                                        Email Support
                                    </a>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Contact channels */}
                <section style={{ padding: '64px 0', background: '#f5f5f7' }}>
                    <Container>
                        <Eyebrow>Contact Channels</Eyebrow>
                        <h2 style={{
                            fontSize: 'clamp(24px, 3.5vw, 32px)',
                            fontWeight: 600,
                            textAlign: 'center',
                            margin: '0 0 48px',
                            letterSpacing: '-0.01em',
                            fontFamily: "'Poppins', sans-serif",
                            color: '#000',
                        }}>
                            Reach us where you prefer
                        </h2>

                        <Row className="g-4 justify-content-center">
                            <Col md={6} lg={5}>
                                <div style={{
                                    padding: '32px',
                                    background: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #ececec',
                                    height: '100%',
                                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px',
                                        background: '#fff7ed', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '20px',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#f97316' }}>chat</span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '18px', fontWeight: 600,
                                        margin: '0 0 6px', color: '#000',
                                        fontFamily: "'Poppins', sans-serif",
                                    }}>
                                        Live Chat
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.6, margin: '0 0 20px' }}>
                                        Chat in real time with our support team. Fastest way to get unblocked.
                                    </p>
                                    <a
                                        href="https://tawk.to/chat/5b8c155cf31d0f771d846049/default"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            fontSize: '13px', fontWeight: 500,
                                            color: '#000', textDecoration: 'none',
                                            borderBottom: '1px solid #000',
                                            paddingBottom: '2px',
                                            transition: 'color 0.15s ease, border-color 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#f97316'; e.currentTarget.style.borderColor = '#f97316'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#000'; }}
                                    >
                                        Open chat
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                                    </a>
                                </div>
                            </Col>

                            <Col md={6} lg={5}>
                                <div style={{
                                    padding: '32px',
                                    background: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #ececec',
                                    height: '100%',
                                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px',
                                        background: '#f5f5f7', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '20px',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#000' }}>mail</span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '18px', fontWeight: 600,
                                        margin: '0 0 6px', color: '#000',
                                        fontFamily: "'Poppins', sans-serif",
                                    }}>
                                        Email Support
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#86868b', lineHeight: 1.6, margin: '0 0 20px' }}>
                                        Send us detailed questions or feedback. We reply within 24 hours on business days.
                                    </p>
                                    <a
                                        href="mailto:info@edatsu.com?subject=Support%20Request%20-%20Edatsu%20Help%20Center&body=Hi%20Edatsu%20Support%20Team,%0D%0A%0D%0AI%20am%20contacting%20you%20from%20the%20Help%20Center%20regarding:%0D%0A%0D%0A[Please%20describe%20your%20question%20or%20issue%20here]%0D%0A%0D%0AThank%20you%20for%20your%20assistance!"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            fontSize: '13px', fontWeight: 500,
                                            color: '#000', textDecoration: 'none',
                                            borderBottom: '1px solid #000',
                                            paddingBottom: '2px',
                                            transition: 'color 0.15s ease, border-color 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#f97316'; e.currentTarget.style.borderColor = '#f97316'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = '#000'; }}
                                    >
                                        info@edatsu.com
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                                    </a>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* FAQs */}
                <section style={{ padding: '96px 0', background: '#fff' }}>
                    <Container>
                        <Eyebrow>Frequently Asked</Eyebrow>
                        <h2 style={{
                            fontSize: 'clamp(24px, 3.5vw, 32px)',
                            fontWeight: 600,
                            textAlign: 'center',
                            margin: '0 0 48px',
                            letterSpacing: '-0.01em',
                            fontFamily: "'Poppins', sans-serif",
                            color: '#000',
                        }}>
                            Quick answers
                        </h2>

                        <Row className="justify-content-center">
                            <Col md={10} lg={8}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    {faqs.map((f, i) => (
                                        <details
                                            key={i}
                                            style={{
                                                borderTop: '1px solid #ececec',
                                                borderBottom: i === faqs.length - 1 ? '1px solid #ececec' : 'none',
                                                padding: '20px 4px',
                                            }}
                                        >
                                            <summary style={{
                                                cursor: 'pointer',
                                                listStyle: 'none',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                fontSize: '15px',
                                                fontWeight: 500,
                                                color: '#000',
                                                fontFamily: "'Poppins', sans-serif",
                                            }}>
                                                {f.q}
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#86868b' }}>
                                                    add
                                                </span>
                                            </summary>
                                            <p style={{
                                                fontSize: '14px',
                                                color: '#86868b',
                                                lineHeight: 1.6,
                                                margin: '12px 0 0',
                                            }}>
                                                {f.a}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Final CTA */}
                <section style={{ padding: '64px 0 96px', background: '#f5f5f7' }}>
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={9} lg={8}>
                                <div style={{
                                    padding: '40px 32px',
                                    background: '#fff',
                                    borderRadius: '20px',
                                    border: '1px solid #ececec',
                                    textAlign: 'center',
                                }}>
                                    <span className="material-symbols-outlined" style={{
                                        fontSize: '36px', color: '#f97316', marginBottom: '12px',
                                    }}>
                                        support_agent
                                    </span>
                                    <h3 style={{
                                        fontSize: '20px', fontWeight: 600,
                                        margin: '0 0 8px', color: '#000',
                                        fontFamily: "'Poppins', sans-serif",
                                    }}>
                                        Still stuck?
                                    </h3>
                                    <p style={{
                                        fontSize: '14px', color: '#86868b',
                                        margin: '0 0 20px', lineHeight: 1.6,
                                    }}>
                                        Our chat widget is in the bottom-right corner — always one click away.
                                    </p>
                                    <div style={{
                                        fontSize: '12px', color: '#86868b',
                                        letterSpacing: '0.02em',
                                    }}>
                                        Live Chat · instant  &nbsp;|&nbsp;  Email · under 24 hours
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </GuestLayout>
        </Fragment>
    );
}
