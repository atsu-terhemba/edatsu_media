import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import { TrendingUp, Wrench, DollarSign, Globe, Award, Users, Zap, Shield, BookOpen, Target, BarChart3, PiggyBank } from 'lucide-react';

export default function SuccessSection() {
    return (
        <section className="py-5 bg-light">
            <Container>
                <Row className="mb-5">
                    <Col xs={12} className="text-center">
                        <h2 className="display-4 fw-bold text-dark mb-4">
                            Intelligence-Powered Business Ecosystem
                        </h2>
                        <p className="lead text-muted mb-0" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            Our proprietary algorithms analyze global data streams, market patterns, and funding flows to deliver strategic intelligence that transforms how entrepreneurs discover and capture opportunities.
                        </p>
                    </Col>
                </Row>
                
                <Row className="g-4 justify-content-center">
                    {/* Opportunities Card */}
                    <Col md={4} sm={6}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body className="p-4 text-center">
                                <div className="mb-4">
                                    <div 
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                        style={{ 
                                            width: '80px', 
                                            height: '80px', 
                                            backgroundColor: '#FFF3E0' 
                                        }}
                                    >
                                        <TrendingUp size={32} className="text-warning" />
                                    </div>
                                </div>
                                
                                <h4 className="fw-bold mb-3">Opportunity Intelligence</h4>
                                <p className="text-muted mb-4">
                                    Our AI scans 10,000+ data sources daily to surface hidden funding opportunities with 99.7% accuracy. Get intelligence before it becomes public knowledge.
                                </p>
                                
                                <div className="mb-4">
                                    <div className="d-flex align-items-center mb-2">
                                        <Globe size={16} className="text-warning me-2" />
                                        <span className="text-muted">Predictive funding analytics</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <Award size={16} className="text-warning me-2" />
                                        <span className="text-muted">Real-time opportunity scoring</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Users size={16} className="text-warning me-2" />
                                        <span className="text-muted">Strategic market positioning</span>
                                    </div>
                                </div>
                                
                                <Link
                                    href="/opportunities"
                                    className="btn btn-warning text-white fw-semibold px-4 py-2 text-decoration-none"
                                    style={{ backgroundColor: '#FF9800', border: 'none' }}
                                >
                                    Access Intelligence
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Toolshed Card */}
                    <Col md={4} sm={6}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body className="p-4 text-center">
                                <div className="mb-4">
                                    <div 
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                        style={{ 
                                            width: '80px', 
                                            height: '80px', 
                                            backgroundColor: '#E0F2F1' 
                                        }}
                                    >
                                        <Wrench size={32} className="text-info" />
                                    </div>
                                </div>
                                
                                <h4 className="fw-bold mb-3">Strategic Arsenal</h4>
                                <p className="text-muted mb-4">
                                    Military-grade tool intelligence. Our analysts evaluate, rank, and monitor 500+ business tools across threat landscapes and operational efficiency.
                                </p>
                                
                                <div className="mb-4">
                                    <div className="d-flex align-items-center mb-2">
                                        <Zap size={16} className="text-info me-2" />
                                        <span className="text-muted">Mission-critical productivity stack</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <Shield size={16} className="text-info me-2" />
                                        <span className="text-muted">Security-first tool selection</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Users size={16} className="text-info me-2" />
                                        <span className="text-muted">Operational excellence platforms</span>
                                    </div>
                                </div>
                                
                                <Link
                                    href="/toolshed"
                                    className="btn text-white fw-semibold px-4 py-2 text-decoration-none"
                                    style={{ backgroundColor: '#26A69A', border: 'none' }}
                                >
                                    Deploy Arsenal
                                </Link>
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
