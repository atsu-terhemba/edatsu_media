import { Fragment, useState } from "react"
import { Link } from "@inertiajs/react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Image } from "react-bootstrap";
import { Images } from "@/utils/Images";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebook,
    faInstagram,
    faLinkedinIn,
    faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const languages = [
    { code: 'en', label: 'English (US)' },
    { code: 'en-gb', label: 'English (UK)' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
];

const footerLinkStyle = {
    color: 'rgba(255, 255, 255, 0.45)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 400,
    transition: 'color 0.15s ease',
};

const sectionTitleStyle = {
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '20px',
};

export default function Footer() {
    const [selectedLang, setSelectedLang] = useState('en');

    return (
        <Fragment>
            <footer style={{ background: '#000' }}>
                {/* Main Footer */}
                <Container>
                    <div style={{ paddingTop: '64px', paddingBottom: '40px' }}>
                        <Row>
                            {/* Brand Column */}
                            <Col xs={12} md={4} className="mb-4 mb-md-0" style={{ paddingRight: '48px' }}>
                                <Image
                                    src={Images.app_logo_trans}
                                    width="48"
                                    className="img-fluid d-block mb-3"
                                    alt="Edatsu Media"
                                />
                                <p style={{
                                    fontSize: '14px',
                                    color: 'rgba(255,255,255,0.45)',
                                    lineHeight: 1.625,
                                    fontWeight: 400,
                                    margin: '0 0 24px 0',
                                    maxWidth: '280px',
                                }}>
                                    Helping entrepreneurs discover funding opportunities, grants, accelerators, and essential business tools to launch and scale their ventures globally.
                                </p>

                                {/* Social Icons */}
                                <div className="d-flex gap-3">
                                    {[
                                        { icon: faFacebook, href: 'https://www.facebook.com/edatsu_media' },
                                        { icon: faInstagram, href: 'https://www.instagram.com/edatsu_media/' },
                                        { icon: faYoutube, href: 'https://www.youtube.com/channel/UCwIxkgCrdzsL3ApDjVgRLCQ' },
                                        { icon: faLinkedinIn, href: 'https://www.linkedin.com/company/edatsu-media' },
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'rgba(255,255,255,0.4)',
                                                fontSize: '14px',
                                                transition: 'all 0.15s ease',
                                                textDecoration: 'none',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.color = '#fff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                                e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                                            }}
                                        >
                                            <FontAwesomeIcon icon={social.icon} />
                                        </a>
                                    ))}
                                </div>
                            </Col>

                            {/* Links Columns */}
                            <Col xs={12} md={8}>
                                <Row>
                                    {/* Products */}
                                    <Col xs={6} sm={4}>
                                        <h6 style={sectionTitleStyle}>Products</h6>
                                        <ul className="list-unstyled m-0">
                                            {[
                                                { label: 'Opportunities', href: '/opportunities' },
                                                { label: 'Toolshed', href: '/toolshed' },
                                                { label: 'Subscription', href: '/subscription' },
                                                { label: 'Advertise', href: '/advertise' },
                                                { label: 'Subscribe', href: '/subscribe' },
                                                { label: 'Sponsorship', href: '/sponsorship' },
                                            ].map((link, i) => (
                                                <li key={i} style={{ marginBottom: '12px' }}>
                                                    <Link
                                                        href={link.href}
                                                        style={footerLinkStyle}
                                                        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                                                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </Col>

                                    {/* Company */}
                                    <Col xs={6} sm={4}>
                                        <h6 style={sectionTitleStyle}>Company</h6>
                                        <ul className="list-unstyled m-0">
                                            {[
                                                { label: 'About', href: '/about-us' },
                                                { label: 'Terms of Use', href: '/terms' },
                                                { label: 'Privacy Policy', href: '/privacy-policy' },
                                                { label: 'Sitemap', href: '/sitemap.xml', external: true },
                                            ].map((link, i) => (
                                                <li key={i} style={{ marginBottom: '12px' }}>
                                                    {link.external ? (
                                                        <a
                                                            href={link.href}
                                                            target="_blank"
                                                            style={footerLinkStyle}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                                                        >
                                                            {link.label}
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            href={link.href}
                                                            style={footerLinkStyle}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </Col>

                                    {/* Support */}
                                    <Col xs={6} sm={4} className="mt-4 mt-sm-0">
                                        <h6 style={sectionTitleStyle}>Support</h6>
                                        <ul className="list-unstyled m-0">
                                            {[
                                                { label: 'Help Center', href: '/help' },
                                                { label: 'Contact Us', href: 'mailto:info@edatsu.com', external: true },
                                                { label: 'Live Chat', href: '#', external: true },
                                                { label: 'Commentary Policy', href: '/terms' },
                                            ].map((link, i) => (
                                                <li key={i} style={{ marginBottom: '12px' }}>
                                                    {link.external ? (
                                                        <a
                                                            href={link.href}
                                                            style={footerLinkStyle}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                                                        >
                                                            {link.label}
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            href={link.href}
                                                            style={footerLinkStyle}
                                                            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                    {/* Bottom Bar */}
                    <div
                        style={{
                            paddingTop: '20px',
                            paddingBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '16px',
                        }}
                    >
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
                            &copy; {new Date().getFullYear()} Edatsu Media. A product of{' '}
                            <a
                                href="https://www.edatsu.com"
                                target="_blank"
                                className="text-decoration-none"
                                style={{ color: 'rgba(255,255,255,0.45)', transition: 'color 0.15s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                            >
                                Edatsu Technology Limited
                            </a>
                        </span>

                        {/* Language Switcher */}
                        <div className="d-flex align-items-center gap-2">
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: '16px', color: 'rgba(255,255,255,0.35)' }}
                            >
                                language
                            </span>
                            <select
                                value={selectedLang}
                                onChange={(e) => setSelectedLang(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '8px',
                                    color: 'rgba(255,255,255,0.45)',
                                    fontSize: '12px',
                                    fontWeight: 400,
                                    padding: '6px 12px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'auto',
                                }}
                            >
                                {languages.map((lang) => (
                                    <option
                                        key={lang.code}
                                        value={lang.code}
                                        style={{ background: '#111', color: '#fff' }}
                                    >
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Container>
            </footer>
        </Fragment>
    )
}
