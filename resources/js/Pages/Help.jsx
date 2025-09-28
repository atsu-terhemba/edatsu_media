import { Fragment, useEffect } from "react"
import GuestLayout from "@/Layouts/GuestLayout"
import Metadata from "@/Components/Metadata"
import { Container, Row, Col } from 'react-bootstrap';

export default function Help(){

  useEffect(() => {
    // Initialize Tawk.to API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    // Create and configure script element
    const script = document.createElement("script");
    script.async = true;
    script.src = 'https://embed.tawk.to/5b8c155cf31d0f771d846049/default';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Insert script into document
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
    
    // Optional: Add event listeners for Tawk.to events
    window.Tawk_API.onLoad = function(){
      console.log('Tawk.to chat widget loaded successfully');
    };
    
    // Cleanup function to remove script if component unmounts
    return () => {
      // Remove Tawk.to widget if it exists
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
      
      // Remove script from DOM
      const tawkScript = document.querySelector('script[src*="tawk.to"]');
      if (tawkScript) {
        tawkScript.remove();
      }
    };
  }, [])


    return(
      <Fragment>
      {/* Help Centre Heading Section */}
      <Metadata
        title="Edatsu Help Center | Get Support & Find Answers"
        description="Need assistance? Visit the Edatsu Help Center to find answers to common questions, troubleshoot issues, and get support for using our platform and services."
        keywords="Edatsu help center, customer support, FAQs, troubleshooting, user assistance"
        canonicalUrl="https://www.edatsu.com/help"
        ogTitle="Edatsu Help Center | Get Support & Find Answers"
        ogDescription="Need assistance? Visit the Edatsu Help Center to find answers to common questions, troubleshoot issues, and get support for using our platform and services."
        ogImage="/img/logo/help_banner.jpg"
        ogUrl="https://www.edatsu.com/help"
        twitterTitle="Edatsu Help Center | Get Support & Find Answers"
        twitterDescription="Need assistance? Visit the Edatsu Help Center to find answers to common questions, troubleshoot issues, and get support for using our platform and services."
        twitterImage="/img/logo/help_banner.jpg"
      />

      <GuestLayout>
      <Container fluid>
        <Container>
          <Row>
            <Col sm={12}>
              <div className="pt-5 pb-4">
                <h1 className="poppins-semibold text-center mb-4">Help Centre</h1>
                <div className="text-center">
                  <p className="mb-4 text-muted">Get instant support through our live chat or email us directly</p>
                  <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
                    <a 
                      href="https://tawk.to/chat/5b8c155cf31d0f771d846049/default" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-lg px-4 py-2 text-decoration-none d-flex align-items-center gap-2"
                      style={{
                        backgroundColor: '#28a745',
                        borderColor: '#28a745',
                        borderRadius: '8px',
                        fontWeight: '600',
                        minWidth: '200px'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.39L2 22l5.61-1.05C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10zm0 18c-1.21 0-2.43-.25-3.58-.73L7 20l.73-1.42C7.25 17.43 7 16.21 7 15c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5z"/>
                      </svg>
                      Start Live Chat
                    </a>
                    <a 
                      href="mailto:info@edatsu.com?subject=Help%20Request%20-%20Edatsu%20Support&body=Hi%20Edatsu%20Support%20Team,%0D%0A%0D%0AI%20need%20assistance%20with:%0D%0A%0D%0A[Please%20describe%20your%20question%20or%20issue%20here]%0D%0A%0D%0AThank%20you!"
                      className="btn btn-outline-primary btn-lg px-4 py-2 text-decoration-none d-flex align-items-center gap-2"
                      style={{
                        borderRadius: '8px',
                        fontWeight: '600',
                        minWidth: '200px'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      Send Email
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Content Section */}
      <Container fluid className="bg-light">
        <Container>
          <Row>
            <Col sm={12}>
              <div className="py-5">
                <Row className="g-4">
                  <Col md={6}>
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center p-4">
                        <div className="mb-3">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="#28a745" className="mb-3">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.39L2 22l5.61-1.05C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10zm0 18c-1.21 0-2.43-.25-3.58-.73L7 20l.73-1.42C7.25 17.43 7 16.21 7 15c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5z"/>
                          </svg>
                        </div>
                        <h4 className="fw-bold mb-3">Live Chat Support</h4>
                        <p className="text-muted mb-4">Get instant help from our support team. Available 24/7 for immediate assistance.</p>
                        <a 
                          href="https://tawk.to/chat/5b8c155cf31d0f771d846049/default" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-success btn-lg w-100 text-decoration-none"
                          style={{ borderRadius: '8px', fontWeight: '600' }}
                        >
                          Open Chat Window
                        </a>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center p-4">
                        <div className="mb-3">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="#0d6efd" className="mb-3">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                        </div>
                        <h4 className="fw-bold mb-3">Email Support</h4>
                        <p className="text-muted mb-4">Send us detailed questions or feedback. We'll respond within 24 hours.</p>
                        <a 
                          href="mailto:info@edatsu.com?subject=Support%20Request%20-%20Edatsu%20Help%20Center&body=Hi%20Edatsu%20Support%20Team,%0D%0A%0D%0AI%20am%20contacting%20you%20from%20the%20Help%20Center%20regarding:%0D%0A%0D%0A[Please%20describe%20your%20question%20or%20issue%20here]%0D%0A%0D%0AThank%20you%20for%20your%20assistance!"
                          className="btn btn-primary btn-lg w-100 text-decoration-none"
                          style={{ borderRadius: '8px', fontWeight: '600' }}
                        >
                          Send Email
                        </a>
                      </div>
                    </div>
                  </Col>
                </Row>
                
                <Row className="mt-5">
                  <Col sm={12} className="text-center">
                    <div className="bg-white rounded p-4">
                      <h5 className="fw-bold mb-3">Quick Help</h5>
                      <p className="text-muted mb-3">The chat widget in the bottom-right corner is also available for instant support!</p>
                      <small className="text-muted">Response time: Live Chat (Instant) | Email (Within 24 hours)</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
      </GuestLayout>
        </Fragment>
    )
}