import{V as x,r as l,j as e,b as p}from"./app-xvdQQSge.js";import{M as f}from"./Metadata-CWDtT11X.js";import{R as t}from"./Row-jOkWGbWP.js";import{C as a}from"./Col-oWowdqEb.js";import{G as y}from"./GuestLayout-BSyuFpnM.js";import{C as o}from"./Header-DrzVB-Vl.js";import{F as j}from"./FixedMobileNav-DWPYb7bJ.js";import"./index-BCjeEDFz.js";import"./ThemeProvider-z22TJ1sn.js";import"./Button-Du7WyOxd.js";import"./Button-493rkeY-.js";import"./smartphone-Dv3CTl36.js";import"./createLucideIcon-Cc5lXGu5.js";import"./download-D5vDTJdU.js";import"./sweetalert2.esm.all-B0Dix5B2.js";import"./Nav-C22INR7D.js";import"./useMergedRefs-CbAm-RBP.js";import"./AbstractModalHeader-CRMvupCg.js";import"./warning-DHYhPFk4.js";const Y=()=>{const{props:n}=x();l.useState("free");const[d,m]=l.useState(!1),[r,u]=l.useState("USD"),h=[{id:"free",name:"Free Explorer",price:{USD:0,NGN:0},period:"Forever",description:"Perfect for getting started with opportunities",popular:!1,features:["Access to basic opportunities","Weekly newsletter","Community access","Basic search filters","Mobile app access","Email notifications"],limitations:["Limited to 10 bookmarks","Basic support only","Standard search results","No access to complete opportunity database","Limited to featured opportunities only"],buttonText:"Get Started Free",buttonClass:"btn-outline-primary"},{id:"premium",name:"Premium Pro",price:{USD:.99,NGN:1300},period:"month",description:"Unlock premium features and exclusive opportunities",popular:!0,features:["Everything in Free Explorer plus:","Unlimited bookmarks","Remove ads","Add Reminders","Integration with calendar apps"],limitations:[],buttonText:"Start Premium Trial",buttonClass:"btn-primary"}],b=async s=>{m(!0);try{if(s.id==="free")n.auth.user?(await p.post("/process-subscription",{plan_id:s.id,plan_name:s.name,price:s.price[r],currency:r})).data.success&&alert("Welcome to the Free Explorer plan! You now have access to all basic features."):window.location.href="/register";else if(!n.auth.user)localStorage.setItem("selectedPlan",JSON.stringify({plan:s,currency:r})),window.location.href="/register";else{const i=await p.post("/process-subscription",{plan_id:s.id,plan_name:s.name,price:s.price[r],currency:r});i.data.success&&(i.data.payment_url?window.location.href=i.data.payment_url:alert("Premium subscription activated! Welcome to Premium Pro."))}}catch(i){console.error("Subscription error:",i),alert("There was an error processing your subscription. Please try again.")}finally{m(!1)}},g=()=>{u(r==="USD"?"NGN":"USD")};return e.jsxs(y,{children:[e.jsx("style",{children:`
                .pricing-hero {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 4rem 0;
                    margin-bottom: 3rem;
                }
                
                .pricing-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2.5rem;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                    border: 2px solid transparent;
                    transition: all 0.3s ease;
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .pricing-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                }
                
                .pricing-card.popular {
                    border-color: #3b82f6;
                    transform: scale(1.05);
                }
                
                .popular-badge {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    padding: 8px 24px;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                }
                
                .price-display {
                    font-size: 3rem;
                    font-weight: 800;
                    color: #1f2937;
                    margin: 1rem 0;
                }
                
                .price-currency {
                    font-size: 1.5rem;
                    vertical-align: top;
                    margin-right: 0.5rem;
                }
                
                .price-period {
                    font-size: 1rem;
                    color: #6b7280;
                    font-weight: 400;
                }
                
                .feature-list {
                    flex-grow: 1;
                    margin: 2rem 0;
                }
                
                .feature-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.75rem;
                    font-size: 0.95rem;
                }
                
                .highlight-feature {
                    background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
                    border: 1px solid rgba(251, 191, 36, 0.3);
                    border-radius: 8px;
                    padding: 0.75rem;
                    margin-bottom: 1rem !important;
                    font-weight: 600;
                    position: relative;
                }
                
                .highlight-feature .feature-icon {
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    color: white;
                }
                
                .feature-icon {
                    background: #dbeafe;
                    color: #3b82f6;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 0.75rem;
                    font-size: 12px;
                }
                
                .limitation-icon {
                    background: #fef2f2;
                    color: #ef4444;
                }
                
                .currency-toggle {
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 30px;
                    padding: 0.5rem 1.5rem;
                    color: white;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .currency-toggle:hover {
                    background: rgba(255, 255, 255, 0.3);
                    color: white;
                    transform: translateY(-2px);
                }
                
                .features-section {
                    background: #f8fafc;
                    padding: 4rem 0;
                    margin-top: 4rem;
                }
                
                .feature-highlight {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    height: 100%;
                }
                
                .feature-highlight-icon {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    font-size: 24px;
                }
                
                @media (max-width: 768px) {
                    .pricing-hero {
                        padding: 2rem 0;
                    }
                    
                    .pricing-card {
                        padding: 2rem;
                        margin-bottom: 2rem;
                    }
                    
                    .pricing-card.popular {
                        transform: none;
                    }
                    
                    .price-display {
                        font-size: 2.5rem;
                    }
                    
                    .currency-toggle {
                        width: 100%;
                        margin-bottom: 2rem;
                    }
                }
                
                @media (max-width: 576px) {
                    .pricing-card {
                        padding: 1.5rem;
                    }
                    
                    .price-display {
                        font-size: 2rem;
                    }
                }
            `}),e.jsx(f,{title:"Subscription Plans - Edatsu Media",description:"Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support with Edatsu Media subscription plans.",keywords:"subscription plans, business opportunities, premium access, Edatsu Media pricing, exclusive opportunities, business growth",canonicalUrl:`${window.location.origin}/subscription`,ogTitle:"Subscription Plans - Edatsu Media",ogDescription:"Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support.",twitterTitle:"Subscription Plans - Edatsu Media",twitterDescription:"Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support."}),e.jsx("div",{className:"pricing-hero",children:e.jsx(o,{children:e.jsx(t,{className:"justify-content-center text-center",children:e.jsxs(a,{lg:8,children:[e.jsx("h1",{className:"display-4 fw-bold mb-4",children:"Choose Your Growth Plan"}),e.jsx("p",{className:"lead mb-4",children:"Unlock exclusive opportunities and premium features designed to accelerate your business growth journey."}),e.jsxs("button",{className:"currency-toggle btn",onClick:g,children:[e.jsx("span",{className:"material-symbols-outlined me-2",style:{fontSize:"20px"},children:"currency_exchange"}),"Switch to ",r==="USD"?"NGN (₦)":"USD ($)"]})]})})})}),e.jsx(o,{children:e.jsx(t,{className:"justify-content-center g-4",children:h.map(s=>e.jsx(a,{lg:5,md:6,children:e.jsxs("div",{className:`pricing-card ${s.popular?"popular":""}`,children:[s.popular&&e.jsxs("div",{className:"popular-badge",children:[e.jsx("span",{className:"material-symbols-outlined me-1",style:{fontSize:"16px"},children:"star"}),"Most Popular"]}),e.jsxs("div",{className:"text-center",children:[e.jsx("h3",{className:"fw-bold mb-2",children:s.name}),e.jsx("p",{className:"text-muted mb-3",children:s.description}),e.jsxs("div",{className:"price-display",children:[e.jsx("span",{className:"price-currency",children:r==="USD"?"$":"₦"}),s.price[r].toLocaleString(),e.jsx("span",{className:"price-period",children:s.price[r]>0?` /${s.period}`:""})]})]}),e.jsxs("div",{className:"feature-list",children:[e.jsx("h6",{className:"fw-semibold mb-3",children:"What's included:"}),s.features.map((i,c)=>e.jsxs("div",{className:`feature-item ${i.includes("All Opportunities Posts")?"highlight-feature":""}`,children:[e.jsx("div",{className:"feature-icon",children:e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"12px"},children:i.includes("All Opportunities Posts")?"stars":"check"})}),i,i.includes("All Opportunities Posts")&&e.jsx("span",{className:"badge bg-warning text-dark ms-2",children:"New!"})]},c)),s.limitations.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("h6",{className:"fw-semibold mb-3 mt-4 text-muted",children:"Limitations:"}),s.limitations.map((i,c)=>e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"feature-icon limitation-icon",children:e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"12px"},children:"close"})}),e.jsx("span",{className:"text-muted",children:i})]},c))]})]}),e.jsx("button",{className:`btn ${s.buttonClass} w-100 fw-bold py-3`,onClick:()=>b(s),disabled:d,style:{marginTop:"auto"},children:d?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm me-2"}),"Processing..."]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"material-symbols-outlined me-2",style:{fontSize:"18px"},children:s.id==="free"?"rocket_launch":"workspace_premium"}),s.buttonText]})})]})},s.id))})}),e.jsx("div",{className:"features-section",children:e.jsxs(o,{children:[e.jsx(t,{className:"text-center mb-5",children:e.jsxs(a,{lg:8,className:"mx-auto",children:[e.jsx("h2",{className:"fw-bold mb-3",children:"Why Choose Edatsu Media?"}),e.jsx("p",{className:"lead text-muted",children:"Join thousands of entrepreneurs who trust us to deliver the best business opportunities and insights."})]})}),e.jsxs(t,{className:"g-4",children:[e.jsx(a,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"database"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Complete Opportunity Database"}),e.jsx("p",{className:"text-muted",children:"Premium subscribers get exclusive access to our complete database of all opportunities posts, including historical data and comprehensive search capabilities."}),e.jsx("div",{className:"text-center mt-3",children:e.jsx("span",{className:"badge bg-warning text-dark",children:"Premium Feature"})})]})}),e.jsx(a,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"trending_up"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Exclusive Opportunities"}),e.jsx("p",{className:"text-muted",children:"Access premium business opportunities not available anywhere else, curated specifically for our subscribers."})]})}),e.jsx(a,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"support_agent"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Priority Support"}),e.jsx("p",{className:"text-muted",children:"Get dedicated support from our team to help you make the most of every opportunity that comes your way."})]})}),e.jsx(a,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"notifications_active"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Real-time Alerts"}),e.jsx("p",{className:"text-muted",children:"Never miss an opportunity with instant notifications delivered directly to your device as soon as they're available."})]})}),e.jsx(a,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"analytics"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Analytics Dashboard"}),e.jsx("p",{className:"text-muted",children:"Track your application success rate and get insights to improve your chances of winning opportunities."})]})}),e.jsx(a,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"security"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Secure & Reliable"}),e.jsx("p",{className:"text-muted",children:"Your data is protected with enterprise-grade security, and our platform maintains 99.9% uptime."})]})}),e.jsx(a,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"groups"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Community Access"}),e.jsx("p",{className:"text-muted",children:"Connect with like-minded entrepreneurs and share insights in our exclusive subscriber community."})]})})]})]})}),e.jsx(o,{className:"my-5",children:e.jsx(t,{className:"justify-content-center",children:e.jsxs(a,{lg:8,children:[e.jsx("h2",{className:"text-center fw-bold mb-5",children:"Frequently Asked Questions"}),e.jsxs("div",{className:"accordion",id:"faqAccordion",children:[e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq1",children:"Can I upgrade or downgrade my plan anytime?"})}),e.jsx("div",{id:"faq1",className:"accordion-collapse collapse show","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:"Yes! You can upgrade to Premium anytime to unlock additional features. If you're on Premium and want to downgrade, you'll retain access until your current billing cycle ends."})})]}),e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button collapsed fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq2",children:"What payment methods do you accept?"})}),e.jsx("div",{id:"faq2",className:"accordion-collapse collapse","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:"We accept all major credit cards, PayPal, and local payment methods including bank transfers and mobile money for Nigerian users."})})]}),e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button collapsed fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq3",children:'What does "All Opportunities Posts" include?'})}),e.jsx("div",{id:"faq3",className:"accordion-collapse collapse","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:"Premium subscribers get access to our complete database of all opportunity posts, including archived opportunities, advanced search filters, bulk export features, and the ability to view detailed analytics and trends. This comprehensive access helps you discover opportunities you might have missed and track market patterns."})})]}),e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button collapsed fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq4",children:"Is there a free trial for Premium?"})}),e.jsx("div",{id:"faq4",className:"accordion-collapse collapse","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:"Yes! New users get a 7-day free trial of Premium features. No credit card required to start your trial."})})]}),e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button collapsed fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq4",children:"Can I cancel my subscription anytime?"})}),e.jsx("div",{id:"faq4",className:"accordion-collapse collapse","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:"Absolutely! You can cancel your Premium subscription at any time. You'll continue to have access to Premium features until the end of your current billing period."})})]})]})]})})}),e.jsx(j,{isAuthenticated:!!n.auth.user})]})};export{Y as default};
