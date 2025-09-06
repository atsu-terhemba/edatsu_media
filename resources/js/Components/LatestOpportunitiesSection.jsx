
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import { Globe, MapPin, Users, Clock } from 'lucide-react';

const opportunities = [
  {
    id: 1,
    region: 'Africa',
    regionColor: '#FF9800',
    regionIcon: <MapPin size={15} className="me-1" style={{marginBottom: '2px'}} />, 
    title: 'Win $25K in Llama AI Accelerator for Nigerian Startups',
    daysLeft: 8,
    description: "Are you a Nigerian startup harnessing Llama's AI technology to solve real-world challenges?"
  },
  {
    id: 2,
    region: 'Global',
    regionColor: '#26A69A',
    regionIcon: <Globe size={15} className="me-1" style={{marginBottom: '2px'}} />, 
    title: 'KBr Photo Award 2025 for Documentary Photography',
    daysLeft: 74,
    description: "The KBr Photo Award 2025 is now open for entries from professional photographers working within..."
  },
  {
    id: 3,
    region: 'North America',
    regionColor: '#43A047',
    regionIcon: <Users size={15} className="me-1" style={{marginBottom: '2px'}} />, 
    title: 'Apply to YiC 2025: Win Support for Impact Ideas in Canada',
    daysLeft: 14,
    description: "Have a bold idea to make the world better? The Youth Innovation Challenge (YiC) 2025 is now accepting..."
  }
];

export default function LatestOpportunitiesSection() {
  return (
    <section className="py-5" style={{ backgroundColor: '#F8FAFC' }}>
      <Container>
        <Row className="mb-5">
          <Col xs={12} className="text-center">
            <h2 className="display-5 fw-bold text-dark mb-3">Live Intelligence Feed</h2>
            <p className="lead text-muted mb-0" style={{ maxWidth: '700px', margin: '0 auto' }}>
              Real-time opportunity intelligence from our global monitoring systems. These high-value targets have been algorithmically identified and ranked by potential ROI.
            </p>
          </Col>
        </Row>
        <Row className="g-4 mb-4">
          {opportunities.map((opp) => (
            <Col md={4} key={opp.id}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge 
                      style={{ 
                        backgroundColor: opp.regionColor, 
                        color: '#fff', 
                        fontWeight: 600, 
                        fontSize: '0.85em', 
                        letterSpacing: '0.01em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25em',
                        padding: '0.4em 0.9em',
                        lineHeight: 1.1
                      }} 
                      className="rounded-pill border-0"
                    >
                      {opp.regionIcon}{opp.region}
                    </Badge>
                    <span 
                      style={{ 
                        color: opp.daysLeft <= 10 ? '#EF4444' : '#10B981',
                        fontWeight: 500, 
                        fontSize: '0.85em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2em'
                      }} 
                    >
                      <Clock size={12} />
                      {opp.daysLeft} days left
                    </span>
                  </div>
                  <h5 className="fw-bold mb-2" style={{ fontSize: '1.18em' }}>{opp.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.98em' }}>{opp.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row>
          <Col xs={12} className="text-center">
            <Link
              href="/opportunities"
              className="btn btn-lg px-5 py-3 text-decoration-none fw-semibold"
              style={{ backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '12px' }}
            >
              View All Opportunities &nbsp;→
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
