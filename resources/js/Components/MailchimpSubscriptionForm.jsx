import React, { useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MailchimpSubscriptionForm = () => {
  // Load the Mailchimp script when the component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Mailchimp validation
    script.onload = () => {
      window.fnames = new Array();
      window.ftypes = new Array();
      fnames[1] = 'FNAME';
      ftypes[1] = 'text';
      fnames[2] = 'LNAME';
      ftypes[2] = 'text';
      fnames[0] = 'EMAIL';
      ftypes[0] = 'email';
      const $mcj = window.jQuery.noConflict(true);
    };

    // Cleanup: Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="mc_embed_shell" className="subscription-box border rounded p-3 mb-5">
      <div id="mc_embed_signup">
        <Form
          action="https://edatsu.us18.list-manage.com/subscribe/post?u=ce5edb3afeca14d1d47a046bf&amp;id=873d67a43e&amp;f_id=00cf9ce6f0"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
        >
          <div id="mc_embed_signup_scroll">
            <h3 className="m-0 p-0 dm-serif-display-regular mb-1" style={{ fontSize: '1.5em' }}>
              Subscribe
            </h3>
            <p className="p-0 fs-8 mb-2">
              Stay up-to-date with the latest trends. Get weekly insights on global tech and business
              opportunities delivered straight to your inbox.
            </p>

            {/* First Name and Last Name */}
            <Row>
              <Col sm={6} xs={12}>
                <Form.Group controlId="mce-FNAME" className="mb-3">
                  <Form.Label className="fs-9">
                    First Name <span className="asterisk">*</span>
                  </Form.Label>
                  <Form.Control type="text" name="FNAME" className="w-100 form-control rounded-1 border" />
                </Form.Group>
              </Col>
              <Col sm={6} xs={12}>
                <Form.Group controlId="mce-LNAME" className="mb-3">
                  <Form.Label className="fs-9">
                    Last Name <span className="asterisk">*</span>
                  </Form.Label>
                  <Form.Control type="text" name="LNAME" className="w-100 form-control rounded-1 border" />
                </Form.Group>
              </Col>
            </Row>

            {/* Email Address */}
            <Form.Group controlId="mce-EMAIL" className="mb-3">
              <Form.Label className="fs-9">
                Email Address <span className="asterisk">*</span>
              </Form.Label>
              <Form.Control type="email" name="EMAIL" className="w-100 form-control rounded-1 border" required />
            </Form.Group>

            {/* Hidden Anti-Bot Field */}
            <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
              <input
                type="text"
                name="b_ce5edb3afeca14d1d47a046bf_873d67a43e"
                tabIndex="-1"
                value=""
              />
            </div>

            {/* Responses */}
            <div id="mce-responses" className="w-100">
              <div id="mce-error-response" className="response text-danger fs-8 poppins-semibold" style={{ display: 'none' }}></div>
              <div id="mce-success-response" className="response text-success fs-8 poppins-semibold" style={{ display: 'none' }}></div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              name="subscribe"
              id="mc-embedded-subscribe"
              className="w-100 d-block btn-dark poppins-semibold py-3 mt-3 border-0"
            >
              Subscribe
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MailchimpSubscriptionForm;