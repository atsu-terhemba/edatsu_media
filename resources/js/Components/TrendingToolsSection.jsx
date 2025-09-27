import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import { Star, ArrowRight, Zap, Eye } from 'lucide-react';

export default function TrendingToolsSection({ tools = [], isLoading = false }) {
  // Helper function to infer category from product name
  const inferCategory = (name) => {
    if (!name) return 'Other';
    const nameLower = name.toLowerCase();
    if (nameLower.includes('ai') || nameLower.includes('gpt') || nameLower.includes('claude')) {
      return 'AI Assistant';
    } else if (nameLower.includes('notion') || nameLower.includes('productivity')) {
      return 'Productivity';
    } else if (nameLower.includes('design') || nameLower.includes('canva') || nameLower.includes('midjourney')) {
      return 'Design';
    } else if (nameLower.includes('automation') || nameLower.includes('zapier')) {
      return 'Automation';
    }
    return 'Tool';
  };

  // Helper function to get tool icon
  const getToolIcon = (name) => {
    if (!name) return '';
    const nameLower = name.toLowerCase();
    if (nameLower.includes('ai') || nameLower.includes('gpt') || nameLower.includes('claude')) {
      return '';
    } else if (nameLower.includes('notion')) {
      return '';
    } else if (nameLower.includes('design') || nameLower.includes('midjourney')) {
      return '';
    } else if (nameLower.includes('automation') || nameLower.includes('zapier')) {
      return '';
    } else if (nameLower.includes('canva')) {
      return '';
    }
    return '';
  };

  // Helper function to get icon color
  const getIconColor = (name) => {
    if (!name) return '#6B7280';
    const nameLower = name.toLowerCase();
    if (nameLower.includes('ai') || nameLower.includes('gpt')) {
      return '#8B5CF6';
    } else if (nameLower.includes('notion')) {
      return '#3B82F6';
    } else if (nameLower.includes('design') || nameLower.includes('midjourney')) {
      return '#EC4899';
    } else if (nameLower.includes('automation') || nameLower.includes('zapier')) {
      return '#F59E0B';
    } else if (nameLower.includes('claude')) {
      return '#10B981';
    } else if (nameLower.includes('canva')) {
      return '#06B6D4';
    }
    return '#6B7280';
  };

  const fallbackTools = [
    {
      id: 1,
      product_name: "ChatGPT AI Assistant",
      description: "Advanced AI chatbot for productivity and creativity",
      cover_img: null,
      views: 1250,
      average_rating: 4.8,
      total_ratings: 324,
      source_url: "https://chat.openai.com",
      slug: "chatgpt-ai-assistant"
    },
    {
      id: 2,
      product_name: "Notion Workspace",
      description: "All-in-one workspace for notes, docs, and project management",
      cover_img: null,
      views: 980,
      average_rating: 4.7,
      total_ratings: 256,
      source_url: "https://notion.so",
      slug: "notion-workspace"
    },
    {
      id: 3,
      product_name: "Canva Design Tool",
      description: "Easy graphic design platform for social media and marketing",
      cover_img: null,
      views: 850,
      average_rating: 4.6,
      total_ratings: 189,
      source_url: "https://canva.com",
      slug: "canva-design-tool"
    },
    {
      id: 4,
      product_name: "Zapier Automation",
      description: "Connect apps and automate workflows without coding",
      cover_img: null,
      views: 720,
      average_rating: 4.5,
      total_ratings: 142,
      source_url: "https://zapier.com",
      slug: "zapier-automation"
    },
    {
      id: 5,
      product_name: "Midjourney AI Art",
      description: "Create stunning AI-generated artwork and images",
      cover_img: null,
      views: 650,
      average_rating: 4.4,
      total_ratings: 98,
      source_url: "https://midjourney.com",
      slug: "midjourney-ai-art"
    },
    {
      id: 6,
      product_name: "Claude AI Assistant",
      description: "Helpful AI assistant for writing and analysis",
      cover_img: null,
      views: 580,
      average_rating: 4.3,
      total_ratings: 87,
      source_url: "https://claude.ai",
      slug: "claude-ai-assistant"
    }
  ];

  const displayTools = (!isLoading && tools.length > 0) ? tools : fallbackTools;
  const fallbackImageUrl = "/img/logo/main_2.png";

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
    return `/product/${slug}/${id}`;
  };

  return (
    <section className="py-5" style={{ backgroundColor: '#F8F9FA' }}>
      <Container>
        <Row className="mb-5">
          <Col xs={12} className="text-center">
            <h2 className="display-6 fw-bold text-dark mb-3">Trending Tools</h2>
            <p className="text-muted mb-0">
              Discover the most popular tools and resources for productivity and growth.
            </p>
          </Col>
        </Row>
        
        <div className="row g-4 mb-4">
          {displayTools.map((tool, index) => {
            const hasImage = tool.cover_img && isValidImage(tool.cover_img);
            const isTrending = index === 0 || tool.is_trending || tool.views > 1000;
            const iconColor = getIconColor(tool.product_name);
            
            return (
              <div key={tool.id || index} className="col-md-6 col-lg-4">
                <Card className="h-100 border-0 shadow-sm position-relative tool-card" 
                      style={{ 
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        minHeight: '400px'
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
                  {/* Trending Badge */}
                  {isTrending && (
                    <Badge 
                      className="position-absolute top-0 start-50 translate-middle-x mt-3"
                      style={{ 
                        backgroundColor: '#007bff',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        zIndex: 2
                      }}
                    >
                       Trending
                    </Badge>
                  )}
                  
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="mb-3">
                      {hasImage ? (
                        <div 
                          className="rounded d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ 
                            width: '60px', 
                            height: '60px',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={`/storage/public/uploads/prod/${tool.cover_img}`}
                            alt={`Cover image for ${tool.product_name}`}
                            className="img-fluid w-100 h-100 object-fit-cover rounded"
                            onError={handleImageError}
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="rounded d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            backgroundColor: iconColor + '20',
                            fontSize: '24px'
                          }}
                        >
                          {getToolIcon(tool.product_name)}
                        </div>
                      )}
                    </div>
                    
                    <Link
                      href={tool.source_url || pageLink('product', tool.slug, tool.id)}
                      className="text-decoration-none text-dark tool-title-link"
                    >
                      <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', transition: 'color 0.3s ease' }}>
                        {truncateText(tool.product_name, 40)}
                      </h5>
                    </Link>
                    
                    <p className="text-muted mb-4" style={{ 
                      fontSize: '0.9rem', 
                      lineHeight: '1.5',
                      height: '4.5rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {truncateText(tool.description || tool.product_description, 120)}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.1rem' }}>
                          Free
                        </div>
                        {/* Rating Display */}
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center me-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                size={14} 
                                className={star <= Math.round(tool.average_rating || 0) ? 'text-warning' : 'text-muted'} 
                                fill={star <= Math.round(tool.average_rating || 0) ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                            {tool.average_rating ? parseFloat(tool.average_rating).toFixed(1) : '0.0'} ({tool.total_ratings || 0})
                          </span>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center gap-2">
                        {/* Views indicator */}
                        <div className="d-flex align-items-center text-muted" style={{ fontSize: '0.8rem' }}>
                          <Eye size={12} className="me-1" />
                          {tool.views || 0}
                        </div>
                      </div>
                    </div>
                    
                    {/* Spacer to push button to bottom */}
                    <div className="flex-grow-1"></div>
                    
                    {/* Try Now Button - Separate at Bottom */}
                    <Link
                      href={tool.source_url || pageLink('product', tool.slug, tool.id)}
                      target={tool.source_url ? "_blank" : "_self"}
                      className="btn btn-dark w-100 d-flex align-items-center justify-content-center text-decoration-none"
                      style={{ 
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}
                    >
                      Try Now
                      <ArrowRight size={16} className="ms-2" />
                    </Link>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
        
        <Row>
          <Col xs={12} className="text-center">
            <Link
              href="/toolshed"
              className="btn btn-lg px-5 py-3 text-decoration-none fw-semibold"
              style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px'
              }}
            >
              View All Tools 
              <Zap size={20} className="ms-2" />
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
