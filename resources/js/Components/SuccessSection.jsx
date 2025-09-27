import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import { TrendingUp, Wrench, DollarSign, Globe, Award, Users, Zap, Shield, BookOpen, Target, BarChart3, PiggyBank } from 'lucide-react';

export default function SuccessSection() {
    return (
        <section className="py-5 bg-light">
            <Container>
                <Row className="mb-5">
                    <Col xs={12} className="text-center">
                        <h3 className="display-6 fw-bold text-dark mb-4">
                            Intelligence-Powered Business Ecosystem
                        </h3>
                        <p className="text-muted mb-0" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            Our proprietary algorithms analyze global data streams, market patterns, and funding flows to deliver strategic intelligence that transforms how entrepreneurs discover and capture opportunities.
                        </p>
                    </Col>
                </Row>
                
                <Row className="g-4 justify-content-center">
                    {/* Opportunities Card */}
                    <Col md={4} sm={6}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body className="p-4 text-center position-relative">
                                <div className="mb-4">
                                    <div 
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                                        style={{ 
                                            width: '60px', 
                                            height: '60px', 
                                            backgroundColor: '#FFF3E0' 
                                        }}
                                    >
                                        <TrendingUp size={32} className="text-warning" />
                                    </div>
                                </div>
                                
                                <h4 className="fw-bold mb-3">Strategic market positioning</h4>
                                <p className="text-muted mb-4 fs-9">
                                Our bots scan 1,000+ data sources daily to surface hidden funding opportunities with 99.7% accuracy — delivering intelligence before it becomes public knowledg
                                </p>
                                
                                <Link
                                    href="/opportunities"
                                    className=" bottom-5 btn btn-dark text-white fw-bold px-4 py-2 text-decoration-none"
                                >
                                    Access Opportunities
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
                                            width: '60px', 
                                            height: '60px', 
                                            backgroundColor: '#E0F2F1' 
                                        }}
                                    >
                                        <Wrench size={32} className="text-info" />
                                    </div>
                                </div>
                                
                                <h4 className="fw-bold mb-3">Productivity Tools</h4>
                                <p className="text-muted fs-9 mb-4">
                                  Navigate the modern age of AI with intelligence-driven business productivity. We evaluate, rank, and monitor 500+ tools to help entrepreneurs optimize efficiency and growth
                                </p>
                                
                                <Link
                                    href="/toolshed"
                                    className="btn text-white fw-bold px-4 py-2 text-decoration-none"
                                    style={{ backgroundColor: '#26A69A', border: 'none' }}
                                >
                                   Find Tools
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
