import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import { Star, ArrowRight } from 'lucide-react';

export default function TrendingToolsSection() {
    const tools = [
        {
            id: 1,
            name: "ChatGPT Plus",
            category: "AI Assistant",
            description: "Advanced AI for writing, coding, and problem-solving with GPT-4 access",
            price: "$20/month",
            rating: null,
            trending: true,
            icon: "🤖",
            iconColor: "#8B5CF6",
            link: "/toolshed"
        },
        {
            id: 2,
            name: "Notion AI",
            category: "Productivity",
            description: "All-in-one workspace with AI-powered writing and organization tools",
            price: "$10/month",
            rating: null,
            trending: true,
            icon: "🗂️",
            iconColor: "#3B82F6",
            link: "/toolshed"
        },
        {
            id: 3,
            name: "Midjourney",
            category: "AI Design",
            description: "Create stunning AI-generated artwork and designs from text prompts",
            price: "$10/month",
            rating: null,
            trending: true,
            icon: "🎨",
            iconColor: "#EC4899",
            link: "/toolshed"
        },
        {
            id: 4,
            name: "Zapier",
            category: "Automation",
            description: "Connect and automate workflows between your favorite apps",
            price: "Free/month",
            rating: 4.6,
            trending: false,
            icon: "⚡",
            iconColor: "#F59E0B",
            link: "/toolshed"
        },
        {
            id: 5,
            name: "Claude Pro",
            category: "AI Assistant",
            description: "Advanced conversational AI for complex reasoning and analysis",
            price: "$20/month",
            rating: null,
            trending: true,
            icon: "🧠",
            iconColor: "#10B981",
            link: "/toolshed"
        },
        {
            id: 6,
            name: "Canva Pro",
            category: "Design",
            description: "Professional design tools with AI-powered features and templates",
            price: "$15/month",
            rating: 4.7,
            trending: false,
            icon: "🎭",
            iconColor: "#06B6D4",
            link: "/toolshed"
        }
    ];

    return (
        <section className="py-5" style={{ backgroundColor: '#F8FAFC' }}>
            <Container>
                <Row className="mb-5">
                    <Col xs={12} className="text-center">
                        <h2 className="display-4 fw-bold text-dark mb-4">
                            Mission-Critical Technology Stack
                        </h2>
                        <p className="lead text-muted mb-0" style={{ maxWidth: '700px', margin: '0 auto' }}>
                            Intelligence-grade tools deployed by elite entrepreneurs. Each tool undergoes our proprietary vetting algorithm to ensure operational superiority.
                        </p>
                    </Col>
                </Row>
                
                <Row className="g-4">
                    {tools.map((tool) => (
                        <Col md={6} lg={4} key={tool.id}>
                            <Card className="h-100 border-0 shadow-sm position-relative" style={{ transition: 'transform 0.2s' }}>
                                {tool.trending && (
                                    <Badge 
                                        className="position-absolute top-0 start-50 translate-middle-x mt-3"
                                        style={{ 
                                            backgroundColor: '#EF4444',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px'
                                        }}
                                    >
                                        🔥 Trending
                                    </Badge>
                                )}
                                
                                <Card.Body className="p-4">
                                    <div className="mb-3">
                                        <div 
                                            className="rounded d-inline-flex align-items-center justify-content-center mb-3"
                                            style={{ 
                                                width: '50px', 
                                                height: '50px', 
                                                backgroundColor: tool.iconColor + '20',
                                                fontSize: '24px'
                                            }}
                                        >
                                            {tool.icon}
                                        </div>
                                    </div>
                                    
                                    <h5 className="fw-bold mb-2">{tool.name}</h5>
                                    
                                    <Badge 
                                        className="mb-3"
                                        style={{ 
                                            backgroundColor: tool.iconColor,
                                            fontSize: '0.7rem',
                                            fontWeight: '500',
                                            padding: '0.4rem 0.8rem'
                                        }}
                                    >
                                        {tool.category}
                                    </Badge>
                                    
                                    <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        {tool.description}
                                    </p>
                                    
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.1rem' }}>
                                                {tool.price}
                                            </div>
                                            {tool.rating && (
                                                <div className="d-flex align-items-center">
                                                    <Star size={14} className="text-warning me-1" fill="currentColor" />
                                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                        {tool.rating}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <Link
                                            href={tool.link}
                                            className="btn btn-dark btn-sm d-flex align-items-center text-decoration-none"
                                            style={{ 
                                                padding: '0.5rem 1rem',
                                                borderRadius: '8px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Try Now
                                            <ArrowRight size={14} className="ms-2" />
                                        </Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                
                <Row className="mt-5">
                    <Col xs={12} className="text-center">
                        <Link
                            href="/toolshed"
                            className="btn btn-lg px-5 py-3 text-decoration-none fw-semibold"
                            style={{ 
                                backgroundColor: '#3B82F6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px'
                            }}
                        >
                            View All Tools
                        </Link>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
