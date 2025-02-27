import React, { useEffect } from 'react';
import '../../css/SendPulseForm.css'; // Import the CSS file (if you extract styles)

const SendPulseForm = () => {
  // Load the script when the component mounts
  // useEffect(() => {
  //   alert();
  //   const script = document.createElement('script');
  //   script.src = '//web.webformscr.com/apps/fc3/build/loader.js';
  //   script.async = true;
  //   script.setAttribute('sp-form-id', 'b1636816c5d597c14dda744aa3089b1abe7f7363a2aa2d1064e33e31bcec27e3');
  //   document.body.appendChild(script);

  //   // Cleanup: Remove the script when the component unmounts
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return (
    <div className="sp-form-outer sp-force-hide">
      <div
        id="sp-form-243730"
        sp-id="243730"
        sp-hash="b1636816c5d597c14dda744aa3089b1abe7f7363a2aa2d1064e33e31bcec27e3"
        sp-lang="en"
        className="sp-form sp-form-regular sp-form-embed sp-form-full-width"
        sp-show-options='{"satellite":false,"maDomain":"login.sendpulse.com","formsDomain":"forms.sendpulse.com","condition":"onEnter","scrollTo":25,"delay":10,"repeat":3,"background":"rgba(0, 0, 0, 0.5)","position":"bottom-right","animation":"","hideOnMobile":false,"submitRedirectUrl":"","urlFilter":false,"urlFilterConditions":[{"force":"hide","clause":"contains","token":""}],"analytics":{"ga":{"eventLabel":null,"send":false}},"utmEnable":false}'
      >
        <div className="sp-form-fields-wrapper show-grid">
          <div className="sp-message">
            <div></div>
          </div>
          <form noValidate className="sp-element-container">
            {/* GDPR Confirmation */}
            <div className="sp-field" sp-id="sp-eee1c51b-e0bc-45d8-b686-162c3a76b2de">
              <div className="sp-checkbox-option">
                <label>
                  <input
                    type="checkbox"
                    sp-type="gdprConfirm"
                    name="sform[Z2RwckNvbmZpcm0=]"
                    value="yes"
                    sp-tips='{"required":"Required field"}'
                    required
                  />
                  <span>Yes, please keep me updated on news, events, and offers</span>
                  &nbsp;<span><strong>*</strong></span>
                </label>
              </div>
            </div>

            {/* GDPR Terms */}
            <div className="sp-field" sp-id="sp-a05a88bd-0dc1-48d6-a54a-14372abb1088">
              <div className="sp-checkbox-option">
                <label>
                  <input
                    type="checkbox"
                    sp-type="gdprTerms"
                    name="sform[Z2RwclRlcm1z]"
                    value="yes"
                    sp-tips='{"required":"Required field"}'
                    required
                  />
                  <span>
                    By signing up, you agree to our{' '}
                    <a href="" target="_blank" rel="noopener noreferrer">
                      Terms of Use and Privacy Policy
                    </a>
                    , including the use of cookies and transfer of your personal information.
                  </span>
                  &nbsp;<span><strong>*</strong></span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="sp-field sp-field-full-width" sp-id="sp-209f7e03-345a-4936-b84b-608ae3918827">
              <div style={{ fontFamily: 'inherit', lineHeight: '1.2' }}>
                <p>
                  Stay up-to-date with the latest trends. Get weekly insights on global tech and business
                  opportunities delivered straight to your inbox.
                </p>
              </div>
            </div>

            {/* Name Input */}
            <div className="sp-field" sp-id="sp-2d243cfe-b694-4fc1-a5ee-181c7c6c23fc">
              <label className="sp-control-label">
                <span>Name</span>
                <strong>*</strong>
              </label>
              <input
                type="text"
                sp-type="input"
                name="sform[TmFtZQ==]"
                className="sp-form-control"
                placeholder="John Doe"
                sp-tips='{"required":"Required field"}'
                autoComplete="on"
                required
              />
            </div>

            {/* Email Input */}
            <div className="sp-field" sp-id="sp-1b702ba5-de14-4531-9a72-82e2f784f4b3">
              <label className="sp-control-label">
                <span>Email</span>
                <strong>*</strong>
              </label>
              <input
                type="email"
                sp-type="email"
                name="sform[email]"
                className="sp-form-control"
                placeholder="username@gmail.com"
                sp-tips='{"required":"Required field","wrong":"Wrong email"}'
                autoComplete="on"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="sp-field sp-button-container" sp-id="sp-971a3891-bf91-47eb-ae3d-2193b8c29b39">
              <button id="sp-971a3891-bf91-47eb-ae3d-2193b8c29b39" className="sp-button">
                Subscribe
              </button>
            </div>
          </form>

          {/* SendPulse Branding */}
          <div className="sp-link-wrapper sp-brandname__left">
            <a
              className="sp-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://sendpulse.com/forms-powered-by-sendpulse?sn=SGVtYmEgUmVjcnVpdGVy&from=8347471"
            >
              <span className="sp-link-img">&nbsp;</span>
              <span translate="FORM.PROVIDED_BY">Provided by SendPulse</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendPulseForm;