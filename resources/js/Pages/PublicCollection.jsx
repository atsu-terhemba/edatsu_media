import GuestLayout from '@/Layouts/GuestLayout';
import Metadata from '@/Components/Metadata';
import Container from 'react-bootstrap/Container';
import { Link } from '@inertiajs/react';

export default function PublicCollection({ profile, collection, articles }) {
    return (
        <GuestLayout>
            <Metadata
                title={`${collection.name} — ${profile.name}`}
                description={`A public reading list by ${profile.name} on Edatsu Media: ${collection.count} article${collection.count === 1 ? '' : 's'}`}
                ogTitle={`${collection.name}`}
                ogDescription={`Reading list by ${profile.name} — ${collection.count} article${collection.count === 1 ? '' : 's'}`}
                canonicalUrl={`https://www.edatsu.com/u/${profile.profile_slug}/${collection.slug}`}
            />

            <section style={{ paddingTop: '120px', paddingBottom: '32px', background: '#fff' }}>
                <Container>
                    <Link
                        href={`/u/${profile.profile_slug}`}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            fontSize: '12px', fontWeight: 500, color: '#86868b',
                            textDecoration: 'none', marginBottom: '16px',
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
                        Back to {profile.name}'s profile
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '14px',
                            background: `${collection.color || '#f5f5f7'}20`,
                            border: `1px solid ${collection.color || '#e5e5e5'}40`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: collection.color || '#86868b' }}>folder</span>
                        </div>
                        <div>
                            <span className="section-eyebrow" style={{ color: '#86868b' }}>Reading list</span>
                            <div className="eyebrow-bar" style={{ margin: '8px 0' }} />
                            <h1 style={{
                                fontSize: 'clamp(26px, 4vw, 32px)',
                                fontWeight: 600, color: '#000',
                                letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2,
                            }}>{collection.name}</h1>
                            <p style={{ fontSize: '13px', color: '#86868b', margin: '6px 0 0' }}>
                                Curated by <Link href={`/u/${profile.profile_slug}`} style={{ color: '#000', fontWeight: 500, textDecoration: 'none' }}>{profile.name}</Link>
                                {' · '}{collection.count} article{collection.count === 1 ? '' : 's'}
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            <section style={{ paddingBottom: '96px', background: '#f5f5f7' }}>
                <Container>
                    {articles.length === 0 ? (
                        <div style={{
                            background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0',
                            padding: '48px 24px', textAlign: 'center', marginTop: '24px',
                        }}>
                            <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                This list is empty.
                            </p>
                        </div>
                    ) : (
                        <div style={{ paddingTop: '24px' }}>
                            {articles.map((article) => (
                                <a
                                    key={article.id}
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'block',
                                        padding: '20px',
                                        borderRadius: '16px',
                                        border: '1px solid #f0f0f0',
                                        background: '#fff',
                                        marginBottom: '12px',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#e0e0e0';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#f0f0f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <h3 style={{
                                        fontSize: '15px', fontWeight: 500, color: '#000',
                                        margin: '0 0 8px', lineHeight: 1.4,
                                    }}>{article.title}</h3>
                                    {article.description && (
                                        <p style={{
                                            fontSize: '13px', color: '#86868b', lineHeight: 1.5,
                                            margin: '0 0 10px', overflow: 'hidden',
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                        }}>{article.description}</p>
                                    )}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                        {article.feed_title && (
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                padding: '4px 10px', borderRadius: '9999px', background: '#f5f5f7',
                                                fontSize: '12px', fontWeight: 500, color: '#000',
                                            }}>
                                                {article.feed_favicon && (
                                                    <img src={article.feed_favicon} alt="" width={14} height={14} style={{ borderRadius: '3px' }}
                                                        onError={(e) => { e.target.style.display = 'none'; }} />
                                                )}
                                                {article.feed_title}
                                            </span>
                                        )}
                                        {article.article_date && (
                                            <span style={{ fontSize: '12px', color: '#b0b0b5' }}>{article.article_date}</span>
                                        )}
                                        <span style={{ fontSize: '12px', color: '#f97316', marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                            Read
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '32px', padding: '16px', borderRadius: '12px', background: '#fff', border: '1px solid #f0f0f0' }}>
                        <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                            Build your own reading lists on{' '}
                            <Link href="/feeds" style={{ color: '#000', fontWeight: 500, textDecoration: 'none' }}>Edatsu Media</Link>
                        </p>
                    </div>
                </Container>
            </section>
        </GuestLayout>
    );
}
