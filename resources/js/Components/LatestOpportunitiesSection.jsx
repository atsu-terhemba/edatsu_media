import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import { Globe, MapPin, Users, Clock, TrendingUp, Eye } from 'lucide-react';

export default function LatestOpportunitiesSection({ opportunities = [], isLoading = false }) {
  const fallbackOpportunities = [
    {
      id: 1,
      title: 'Win $25K in Llama AI Accelerator for Nigerian Startups',
      description: "Are you a Nigerian startup harnessing Llama AI technology to solve challenges? This accelerator program offers $25,000 in funding plus mentorship opportunities.",
      daysLeft: 8,
      region: 'Africa',
      regionColor: '#FF9800',
      regionIcon: 'MapPin',
      cover_img: null
    },
    {
      id: 2,
      title: 'KBr Photo Award 2025 for Documentary Photography',
      description: "The KBr Photo Award 2025 is open for professional photographers worldwide. Submit your best documentary photography work for international recognition.",
      daysLeft: 74,
      region: 'Global',
      regionColor: '#26A69A',
      regionIcon: 'Globe',
      cover_img: null
    },
    {
      id: 3,
      title: 'Apply to YiC 2025: Win Support for Impact Ideas in Canada',
      description: "Youth Innovation Challenge accepting applications from young innovators across Canada. Transform your social impact ideas into reality with funding and mentorship.",
      daysLeft: 14,
      region: 'North America',
      regionColor: '#43A047',
      regionIcon: 'Users',
      cover_img: null
    }
  ];

  const displayOpportunities = (!isLoading && opportunities.length > 0) ? opportunities : fallbackOpportunities;
  const fallbackImageUrl = "/img/logo/main_2.png";

  const getRegionIcon = (iconName) => {
    switch(iconName) {
      case 'Globe':
        return <Globe size={15} className="me-1" />;
      case 'MapPin':
        return <MapPin size={15} className="me-1" />;
      case 'Users':
        return <Users size={15} className="me-1" />;
      default:
        return <Globe size={15} className="me-1" />;
    }
  };

  const handleImageError = (e) => {
    e.target.src = fallbackImageUrl;
  };

  const isValidImage = (img) => {
    return img && typeof img === 'string' && img.trim() !== '';
  };

  const truncateText = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const pageLink = (type, slug, id) => {
    return `/opportunity/${slug || 'opportunity'}/${id}`;
  };

  return (
    <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
      <Container>
        <Row className="mb-5">
          <Col xs={12} className="text-center">
            <h2 className="display-6 fw-bold text-dark mb-3">Latest Opportunities</h2>
            <p className="text-muted mb-0">
              Real-time opportunity intelligence from our global monitoring systems.
            </p>
          </Col>
        </Row>
        
        <div className="row g-4 mb-4">
          {displayOpportunities.map((opp, index) => {
            const isUrgent = opp.daysLeft <= 10;
            const hasImage = opp.cover_img && isValidImage(opp.cover_img);
            
            return (
              <div key={opp.id || index} className="col-md-6 col-lg-4">
                <Card className="h-100 border-0 shadow-sm position-relative" 
                      style={{ 
                        minHeight: '380px',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                      }}
                >
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Badge 
                        style={{ 
                          backgroundColor: opp.regionColor, 
                          color: '#fff', 
                          fontWeight: 600, 
                          fontSize: '0.8rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px'
                        }} 
                        className="border-0"
                      >
                        {getRegionIcon(opp.regionIcon)}
                        {opp.region}
                      </Badge>
                      
                      <span style={{ 
                        color: isUrgent ? '#EF4444' : '#10B981',
                        fontWeight: 600, 
                        fontSize: '0.8rem'
                      }}>
                        <Clock size={12} className="me-1" />
                        {opp.daysLeft} days left
                      </span>
                    </div>

                    {/* Image Section - matching toolshed pattern */}
                    {hasImage && (
                      <div className="mb-3">
                        <div 
                          className="rounded d-inline-flex align-items-center justify-content-center"
                          style={{ 
                            width: '60px', 
                            height: '60px',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={`${(import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/$/, '')}/uploads/opp/${opp.cover_img}`}
                            alt={`Cover image for ${opp.title}`}
                            className="img-fluid w-100 h-100 object-fit-cover rounded"
                            onError={handleImageError}
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                        </div>
                      </div>
                    )}

                    <Link
                      href={pageLink('opportunity', opp.slug, opp.id)}
                      className="text-decoration-none text-dark"
                    >
                      <h5 className="fw-bold mb-3" style={{ 
                        fontSize: '1.1rem',
                        transition: 'color 0.3s ease',
                        lineHeight: '1.4'
                      }}>
                        {truncateText(opp.title, 60)}
                      </h5>
                    </Link>

                    <p className="text-muted mb-4 flex-grow-1" style={{ 
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      height: '4.5rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {truncateText(opp.description, 120)}
                    </p>

                    {/* Views or engagement indicator - matching toolshed pattern */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center text-muted" style={{ fontSize: '0.8rem' }}>
                        <Eye size={12} className="me-1" />
                        {opp.views || Math.floor(Math.random() * 500) + 100} views
                      </div>
                      <div className="fw-bold text-dark" style={{ fontSize: '1rem' }}>
                        Free to Apply
                      </div>
                    </div>

                    {/* Spacer to push button to bottom */}
                    <div className="flex-grow-1"></div>

                    <div className="mt-auto">
                      <Link
                        href={pageLink('opportunity', opp.slug, opp.id)}
                        className="btn w-100 text-decoration-none fw-semibold d-flex align-items-center justify-content-center"
                        style={{ 
                          backgroundColor: opp.regionColor,
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.75rem 1.5rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        View Details
                        <TrendingUp size={16} className="ms-2" />
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
        
        <Row>
          <Col xs={12} className="text-center">
            <Link
              href="/opportunities"
              className="btn btn-lg px-5 py-3 text-decoration-none fw-semibold"
              style={{ 
                backgroundColor: '#FF9800', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px'
              }}
            >
              View All Opportunities 
              <TrendingUp size={20} className="ms-2" />
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
