import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import { TrendingUp, Wrench, DollarSign, Globe, Award, Users, Zap, Shield, BookOpen, Target, BarChart3, PiggyBank, ArrowRight, LineChart } from 'lucide-react';
import FlatButton from './FlatButton';

export default function SuccessSection() {
    return (
        <section className="py-4 py-md-5 bg-light">
            <Container className="px-3 px-md-4">
                <Row className="mb-4 mb-md-5">
                    <Col xs={12} className="text-center">
                        <h2 className="section-title fw-bold text-dark mb-3 mb-md-4">
                            Intelligence-Powered Business Ecosystem
                        </h2>
                        <p className="section-subtitle text-muted mb-0 px-3 px-md-0">
                            Our proprietary algorithms analyze global data streams, market patterns, and funding flows to deliver strategic intelligence that transforms how entrepreneurs discover and capture opportunities.
                        </p>
                    </Col>
                </Row>
                
                <Row className="g-3 g-md-4 justify-content-center">
                    {/* Opportunities Card */}
                    <Col xs={12} sm={6} md={4}>
                        <Card className="h-100 border-0 d-flex">
                            <Card.Body className="p-4 text-center d-flex flex-column">
                                <div className="mb-4">
                                    <div 
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                        style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            backgroundColor: '#f8f9fa', 
                                            border: '2px solid #dee2e6' 
                                        }}
                                    >
                                        <TrendingUp size={32} className="text-dark" />
                                    </div>
                                </div>
                                
                                <h4 className="fw-bold mb-3">Strategic market positioning</h4>
                                <p className="text-muted mb-4 fs-9 flex-grow-1">
                                Our bots scan 1,000+ data sources daily to surface hidden funding opportunities with 99.7% accuracy — delivering intelligence before it becomes public knowledg
                                </p>
                                
                                <div className="mt-auto">
                                    <FlatButton
                                        href="/opportunities"
                                        variant="secondary"
                                        className="w-100 d-flex align-items-center justify-content-center gap-2"
                                    >
                                        Access Opportunities
                                        <ArrowRight size={16} />
                                    </FlatButton>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Toolshed Card */}
                    <Col md={4} sm={6}>
                        <Card className="h-100 border-0 d-flex">
                            <Card.Body className="p-4 text-center d-flex flex-column">
                                <div className="mb-4">
                                    <div 
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                        style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            backgroundColor: '#f8f9fa', 
                                            border: '2px solid #dee2e6' 
                                        }}
                                    >
                                        <Wrench size={32} className="text-dark" />
                                    </div>
                                </div>
                                
                                <h4 className="fw-bold mb-3">Productivity Tools</h4>
                                <p className="text-muted fs-9 mb-4 flex-grow-1">
                                  Navigate the modern age of AI with intelligence-driven business productivity. We evaluate, rank, and monitor 500+ tools to help entrepreneurs optimize efficiency and growth
                                </p>
                                
                                <div className="mt-auto">
                                    <FlatButton
                                        href="/toolshed"
                                        variant="secondary"
                                        className="w-100 d-flex align-items-center justify-content-center gap-2"
                                    >
                                        Find Tools
                                        <ArrowRight size={16} />
                                    </FlatButton>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Finance Technology Card */}
                    <Col xs={12} sm={6} md={4}>
                        <Card className="h-100 border-0 d-flex position-relative">
                            {/* Coming Soon Label */}
                            <div 
                                className="position-absolute d-inline-flex align-items-center justify-content-center"
                                style={{ 
                                    top: '-8px', 
                                    right: '16px', 
                                    backgroundColor: '#ef4444', 
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    zIndex: 10,
                                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Coming Soon
                            </div>
                            
                            <Card.Body className="p-3 p-md-4 text-center d-flex flex-column">
                                <div className="mb-4">
                                    <div 
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                        style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            backgroundColor: '#f8f9fa', 
                                            border: '2px solid #dee2e6' 
                                        }}
                                    >
                                        <LineChart size={32} className="text-dark" />
                                    </div>
                                </div>
                                
                                <h4 className="fw-bold mb-3">Finance Technology & Investment News</h4>
                                <p className="text-muted mb-4 fs-9 flex-grow-1">
                                    Stay ahead with cutting-edge fintech innovations, market analysis, and investment opportunities. Get insider insights on emerging financial technologies and investment trends.
                                </p>
                                
                                <div className="mt-auto">
                                    <FlatButton
                                        href="#"
                                        variant="secondary"
                                        disabled
                                        className="w-100 d-flex align-items-center justify-content-center gap-2"
                                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                    >
                                        Coming Soon
                                        <ArrowRight size={16} />
                                    </FlatButton>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Money Guide Card - Commented out until page is ready */}
                    {/* 
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body className="p-4 text-center">
                                <div className="mb-4">
                                    <div 
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                        style={{ 
                                            width: '80px', 
                                            height: '80px', 
                                            backgroundColor: '#E8F5E8' 
                                        }}
                                    >
                                        <DollarSign size={32} className="text-success" />
                                    </div>
                                </div>
                                
                                <h4 className="fw-bold mb-3">Money Guide</h4>
                                <p className="text-muted mb-4">
                                    Learn proven strategies for making money in today's 
                                    modern economy
                                </p>
                                
                                <div className="mb-4">
                                    <div className="d-flex align-items-center mb-2">
                                        <BookOpen size={16} className="text-success me-2" />
                                        <span className="text-muted">Compound reselling</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <BarChart3 size={16} className="text-success me-2" />
                                        <span className="text-muted">Marketplace strategies</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Target size={16} className="text-success me-2" />
                                        <span className="text-muted">Investment guides</span>
                                    </div>
                                </div>
                                
                                <Link
                                    href="/money-guide"
                                    className="btn btn-success text-white fw-semibold px-4 py-2 text-decoration-none"
                                >
                                    Start Learning
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    */}
                </Row>
            </Container>
        </section>
    );
}
