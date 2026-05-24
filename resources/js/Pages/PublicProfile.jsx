import GuestLayout from '@/Layouts/GuestLayout';
import Metadata from '@/Components/Metadata';
import Container from 'react-bootstrap/Container';
import { Link } from '@inertiajs/react';

export default function PublicProfile({ profile, collections }) {
    const avatarUrl = profile.avatar
        ? (profile.avatar.startsWith('http') ? profile.avatar : `/storage/${profile.avatar}`)
        : null;

    return (
        <GuestLayout>
            <Metadata
                title={`${profile.name} — Reading lists`}
                description={`Public reading lists curated by ${profile.name} on Edatsu Media`}
                ogTitle={`${profile.name} on Edatsu`}
                ogDescription={`${collections.length} public reading list${collections.length === 1 ? '' : 's'}`}
                canonicalUrl={`https://www.edatsu.com/u/${profile.profile_slug}`}
            />

            <section style={{ paddingTop: '120px', paddingBottom: '48px', background: '#fff' }}>
                <Container>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '8px' }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '50%',
                            background: '#f5f5f7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', flexShrink: 0,
                            border: '1px solid #f0f0f0',
                        }}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '28px', fontWeight: 600, color: '#000' }}>
                                    {(profile.name || '?').charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="section-eyebrow" style={{ color: '#86868b' }}>Reader</span>
                            <div className="eyebrow-bar" style={{ margin: '8px 0' }} />
                            <h1 style={{
                                fontSize: 'clamp(28px, 4vw, 34px)',
                                fontWeight: 600, color: '#000',
                                letterSpacing: '-0.02em', margin: 0,
                            }}>{profile.name}</h1>
                            <p style={{ fontSize: '13px', color: '#86868b', margin: '4px 0 0' }}>
                                {collections.length} public reading list{collections.length === 1 ? '' : 's'}
                            </p>
                        </div>
                    </div>
                </Container>
            </section>

            <section style={{ paddingBottom: '96px', background: '#f5f5f7' }}>
                <Container>
                    {collections.length === 0 ? (
                        <div style={{
                            background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0',
                            padding: '64px 24px', textAlign: 'center', marginTop: '32px',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#d1d1d6', display: 'block', marginBottom: '12px' }}>
                                folder_open
                            </span>
                            <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
                                {profile.name} hasn't shared any public reading lists yet.
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '16px',
                            paddingTop: '32px',
                        }}>
                            {collections.map((c) => (
                                <Link
                                    key={c.slug}
                                    href={`/u/${profile.profile_slug}/${c.slug}`}
                                    style={{
                                        textDecoration: 'none',
                                        background: '#fff',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        transition: 'all 0.2s ease',
                                        display: 'block',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#e0e0e0';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#f0f0f0';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '10px',
                                        background: `${c.color || '#f5f5f7'}20`,
                                        border: `1px solid ${c.color || '#e5e5e5'}40`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '16px',
                                    }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: c.color || '#86868b' }}>
                                            folder
                                        </span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '17px', fontWeight: 600, color: '#000',
                                        margin: '0 0 6px', letterSpacing: '-0.01em',
                                    }}>
                                        {c.name}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: '#86868b', margin: 0 }}>
                                        {c.item_count} article{c.item_count === 1 ? '' : 's'}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </Container>
            </section>
        </GuestLayout>
    );
}
