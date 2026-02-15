import{V as y,r as l,j as e,b as x}from"./app-BBoIa_Yt.js";import{M as j}from"./Metadata-D-X6OeoH.js";import{R as o}from"./Row-BfSS8SHS.js";import{C as t}from"./Col-BicBp_ja.js";import{G as w}from"./GuestLayout-Du2hNioc.js";import{C as n}from"./Header-D_3UkLXk.js";import{F as N}from"./FixedMobileNav-BwKxrNKn.js";import"./index-Dir0O_cm.js";import"./ThemeProvider-CX3OIfIx.js";import"./Button-BcnVGAvM.js";import"./Button-CNfD2lw6.js";import"./smartphone-BQbOSSZD.js";import"./createLucideIcon-RvaiaMyo.js";import"./download-DU1IZN9S.js";import"./sweetalert2.esm.all-B0Dix5B2.js";import"./Nav-4fss9wif.js";import"./useMergedRefs-D6eVEGOV.js";import"./AbstractModalHeader-UfYm0CTG.js";import"./warning-xqPjWNas.js";const T=()=>{const{props:c}=y();l.useState("free");const[d,h]=l.useState(!1),[r,b]=l.useState("NGN"),[a,u]=l.useState("monthly"),m=[{id:"free",name:"Free",price:{monthly:{USD:0,NGN:0},yearly:{USD:0,NGN:0}},period:"Forever",description:"Perfect for getting started with opportunities",popular:!1,icon:"star",features:[{text:"Access to basic opportunities",icon:"check_circle"},{text:"Weekly newsletter",icon:"mail"},{text:"Community access",icon:"groups"},{text:"Basic search filters",icon:"search"},{text:"Mobile app access",icon:"smartphone"},{text:"Save up to 10 opportunities & tools",icon:"bookmark"}],limitations:["Limited bookmarks (10 max)","Ads displayed while browsing","No calendar integration","No push notifications","No AI assistant","No export features"],buttonText:"Get Started Free",buttonClass:"btn-primary"},{id:"premium",name:"Pro",price:{monthly:{USD:2.11,NGN:3e3},yearly:{USD:22.79,NGN:32400}},period:a==="monthly"?"month":"year",description:"Supercharge your opportunity hunting",popular:!0,icon:"workspace_premium",features:[{text:"Unlimited saved Opportunities & Tools",icon:"all_inclusive",highlight:!0},{text:"Smart reminders via push & email",icon:"notifications_active",highlight:!0},{text:"Google Calendar sync for deadlines",icon:"calendar_month",highlight:!0},{text:"Personalized AI Assistant",icon:"smart_toy",highlight:!0},{text:"Ad-free browsing experience",icon:"block",highlight:!1},{text:"Priority access to new opportunities",icon:"bolt",highlight:!1},{text:"Export saved items (PDF / CSV)",icon:"download",highlight:!1}],limitations:[],buttonText:"Upgrade to Pro",buttonClass:"btn-success"}],g=async i=>{h(!0);try{if(i.id==="free")c.auth.user?(await x.post("/process-subscription",{plan_id:i.id,plan_name:i.name,price:i.price[a][r],currency:r,billing_period:a})).data.success&&alert("Welcome to the Free plan! You now have access to all basic features."):window.location.href="/register";else if(!c.auth.user)localStorage.setItem("selectedPlan",JSON.stringify({plan:i,currency:r,billingPeriod:a})),window.location.href="/register";else{const s=await x.post("/process-subscription",{plan_id:i.id,plan_name:i.name,price:i.price[a][r],currency:r,billing_period:a});s.data.success&&(s.data.payment_url?window.location.href=s.data.payment_url:alert("Pro subscription activated! Welcome to Pro."))}}catch(s){console.error("Subscription error:",s),alert("There was an error processing your subscription. Please try again.")}finally{h(!1)}},f=()=>{b(r==="USD"?"NGN":"USD")};return e.jsxs(w,{children:[e.jsx("style",{children:`
                .pricing-hero {
                    padding: 4rem 0 3rem;
                    text-align: center;
                    position: relative;
                    z-index: 1;
                }
                
                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    padding: 0.5rem 1.25rem;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    color: white;
                }
                
                .billing-toggle {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border-radius: 50px;
                    padding: 4px;
                }
                
                .toggle-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1.5rem;
                    border-radius: 50px;
                    border: none;
                    background: transparent;
                    color: rgba(255, 255, 255, 0.8);
                }
                
                .toggle-btn.active {
                    background: white;
                    color: #374151;
                }
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .toggle-btn.active {
                    background: white;
                    color: #1f2937;
                    font-weight: 600;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .toggle-btn .save-badge {
                    background: #e9ecef;
                    color: #374151;
                    padding: 0.15rem 0.5rem;
                    border-radius: 50px;
                    font-size: 0.7rem;
                    font-weight: 600;
                }
                
                .toggle-switch {
                    position: relative;
                    width: 52px;
                    height: 28px;
                    background: #e9ecef;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                
                .toggle-switch.active {
                    background: #374151;
                }
                
                .toggle-switch::after {
                    content: '';
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    width: 22px;
                    height: 22px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.3s ease;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                
                .toggle-switch.active::after {
                    transform: translateX(24px);
                }
                
                .save-badge {
                    background: rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                .currency-toggle {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    border-radius: 50px;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    color: white;
                    transition: all 0.3s ease;
                }
                
                .currency-toggle:hover {
                    background: rgba(255, 255, 255, 0.25);
                    color: white;
                }
                
                .pricing-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    border: 1px solid #e5e7eb;
                    transition: all 0.3s ease;
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    max-width: 420px;
                    margin: 0 auto;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }
                
                .pricing-card:hover {
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
                    transform: translateY(-4px);
                }
                
                .pricing-card.popular {
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
                }
                
                .popular-badge {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #dc2626;
                    color: white;
                    padding: 5px 14px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    white-space: nowrap;
                }
                
                .plan-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    font-size: 24px;
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .plan-icon.free {
                    background: #f3f4f6;
                    color: #6b7280;
                }
                
                .plan-icon.premium {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .price-display {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0.5rem 0;
                    line-height: 1;
                }
                
                .price-currency {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .price-period {
                    font-size: 0.9rem;
                    color: #6b7280;
                    font-weight: 400;
                }
                
                .pricing-note {
                    font-size: 0.8rem;
                    color: #94a3b8;
                    margin-top: 0.25rem;
                }
                
                .feature-list {
                    flex-grow: 1;
                    margin: 1.5rem 0;
                }
                
                .feature-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 0.875rem;
                    font-size: 0.9rem;
                    color: #374151;
                }
                
                .feature-item.highlight-feature {
                    font-weight: 500;
                }
                
                .feature-icon {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 0.75rem;
                    flex-shrink: 0;
                    margin-top: 2px;
                    background: #f3f4f6;
                    color: #6b7280;
                }
                
                .feature-icon.check {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .feature-icon.premium-icon {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .limitation-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.5rem;
                    font-size: 0.85rem;
                    color: #9ca3af;
                }
                
                .limitation-icon {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 0.75rem;
                    background: #f3f4f6;
                    color: #9ca3af;
                    flex-shrink: 0;
                }
                
                .btn-primary-dark {
                    background: #374151;
                    border: none;
                    color: white;
                    transition: all 0.3s ease;
                }
                
                .btn-primary-dark:hover {
                    background: #1f2937;
                    color: white;
                    transform: translateY(-1px);
                }
                
                .btn-outline-dark {
                    background: transparent;
                    border: 1px solid #e5e7eb;
                    color: #374151;
                    transition: all 0.3s ease;
                }
                
                .btn-outline-dark:hover {
                    background: #f8fafc;
                    border-color: #d1d5db;
                }
                
                .features-section {
                    background: #f8f9fa;
                    padding: 4rem 0;
                    margin-top: 3rem;
                }
                
                .feature-highlight {
                    background: white;
                    border-radius: 16px;
                    padding: 1.75rem;
                    text-align: center;
                    border: 1px solid #e5e7eb;
                    height: 100%;
                    transition: all 0.3s ease;
                }
                
                .feature-highlight:hover {
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }
                
                .feature-highlight-icon {
                    background: #f3f4f6;
                    color: #374151;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    font-size: 22px;
                }
                
                .premium-badge-sm {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    background: #e9ecef;
                    color: #374151;
                    padding: 0.25rem 0.75rem;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                @media (max-width: 768px) {
                    .pricing-hero {
                        padding: 2rem 0 1rem;
                    }
                    
                    .pricing-card {
                        padding: 1.5rem;
                        margin-bottom: 2rem;
                    }
                    
                    .price-display {
                        font-size: 2.25rem;
                    }
                    
                    .billing-toggle {
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                }
                
                @media (max-width: 576px) {
                    .pricing-card {
                        padding: 1.25rem;
                    }
                    
                    .price-display {
                        font-size: 2rem;
                    }
                    
                    .plan-icon {
                        width: 48px;
                        height: 48px;
                        font-size: 24px;
                    }
                }
            `}),e.jsx(j,{title:"Subscription Plans - Edatsu Media",description:"Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support with Edatsu Media subscription plans.",keywords:"subscription plans, business opportunities, premium access, Edatsu Media pricing, exclusive opportunities, business growth",canonicalUrl:`${window.location.origin}/subscription`,ogTitle:"Subscription Plans - Edatsu Media",ogDescription:"Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support.",twitterTitle:"Subscription Plans - Edatsu Media",twitterDescription:"Choose the perfect plan for your business growth journey. Get access to exclusive opportunities, premium features, and priority support."}),e.jsx(n,{fluid:!0,children:e.jsx(o,{className:"footer-banner position-relative border-0",children:e.jsx("div",{className:"overlay d-flex align-items-center",children:e.jsx(n,{children:e.jsx(o,{className:"justify-content-center",children:e.jsxs(t,{lg:8,className:"text-center",children:[e.jsx("div",{className:"hero-badge",children:"Choose Your Plan"}),e.jsx("h1",{className:"text-m-0 mb-3 p-0 text-light fw-bold",style:{fontSize:"clamp(1.75rem, 6vw, 2.5rem)",lineHeight:"1.2"},children:"Simple, Transparent Pricing"}),e.jsx("p",{className:"banner-subtitle text-light mb-4 px-2 px-sm-0",style:{fontSize:"clamp(1rem, 3vw, 1.1rem)",lineHeight:"1.5",maxWidth:"600px",margin:"0 auto 1.5rem"},children:"Start for free and upgrade when you're ready. No hidden fees, cancel anytime."}),e.jsxs("div",{className:"billing-toggle",children:[e.jsx("button",{className:`toggle-btn ${a==="monthly"?"active":""}`,onClick:()=>u("monthly"),children:"Monthly"}),e.jsxs("button",{className:`toggle-btn ${a==="yearly"?"active":""}`,onClick:()=>u("yearly"),children:["Yearly",e.jsx("span",{className:"save-badge",children:"Save 10%"})]})]}),e.jsx("div",{className:"mt-3",children:e.jsxs("button",{className:"currency-toggle btn",onClick:f,style:{color:"rgba(255, 255, 255, 0.9)"},children:[e.jsx("span",{className:"material-symbols-outlined me-2",style:{fontSize:"18px"},children:"currency_exchange"}),"Switch to ",r==="USD"?"NGN (₦)":"USD ($)"]})})]})})})})})}),e.jsx(n,{className:"py-5",children:e.jsx(o,{className:"justify-content-center g-4",children:m.map(i=>e.jsx(t,{lg:4,md:6,children:e.jsxs("div",{className:`pricing-card ${i.popular?"popular":""}`,children:[i.popular&&e.jsx("div",{className:"popular-badge",children:"Most Popular"}),e.jsx("div",{className:`plan-icon ${i.id}`,children:e.jsx("span",{className:"material-symbols-outlined",children:i.icon})}),e.jsxs("div",{children:[e.jsx("h3",{className:"fw-bold mb-2",children:i.name}),e.jsx("p",{className:"text-muted mb-3",children:i.description}),e.jsxs("div",{className:"price-display",children:[e.jsx("span",{className:"price-currency",children:r==="USD"?"$":"₦"}),i.price[a][r].toLocaleString(),e.jsx("span",{className:"price-period",children:i.price[a][r]>0?` /${a==="monthly"?"month":"year"}`:""})]}),i.id==="premium"&&e.jsx("p",{className:"text-muted small mb-0",children:"Cancel anytime • No hidden fees"})]}),e.jsxs("div",{className:"feature-list",children:[e.jsx("h6",{className:"fw-semibold mb-3 text-uppercase",style:{fontSize:"0.75rem",letterSpacing:"0.05em",color:"#64748b"},children:i.id==="premium"?"Everything you need":"What's included"}),i.features.map((s,p)=>e.jsxs("div",{className:`feature-item ${s.highlight?"highlight-feature":""}`,children:[e.jsx("div",{className:`feature-icon ${i.id==="premium"&&s.highlight?"premium-icon":"check"}`,children:e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:s.icon||"check"})}),e.jsx("span",{style:{fontWeight:s.highlight?600:400},children:s.text})]},p)),i.limitations.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("h6",{className:"fw-semibold mb-3 mt-4 text-uppercase",style:{fontSize:"0.75rem",letterSpacing:"0.05em",color:"#94a3b8"},children:"Limitations"}),i.limitations.map((s,p)=>e.jsxs("div",{className:"limitation-item",children:[e.jsx("div",{className:"limitation-icon",children:e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"12px"},children:"close"})}),e.jsx("span",{children:s})]},p))]})]}),e.jsx("button",{className:`btn ${i.buttonClass} w-100 fw-bold py-3`,onClick:()=>g(i),disabled:d,style:{marginTop:"auto",borderRadius:"12px"},children:d?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm me-2"}),"Processing..."]}):i.buttonText})]})},i.id))})}),e.jsx("div",{className:"features-section",children:e.jsxs(n,{children:[e.jsx(o,{className:"text-center mb-5",children:e.jsxs(t,{lg:8,className:"mx-auto",children:[e.jsxs("div",{className:"premium-badge-sm mb-3",children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"workspace_premium"}),"Pro Features"]}),e.jsx("h2",{className:"fw-bold mb-3",children:"Why Go Pro?"}),e.jsx("p",{className:"lead text-muted",children:"Unlock powerful features designed to help you stay organized and never miss an opportunity."})]})}),e.jsxs(o,{className:"g-4",children:[e.jsx(t,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"all_inclusive"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Unlimited Saves"}),e.jsx("p",{className:"text-muted",children:"Save as many opportunities and tools as you want. No limits, no restrictions. Build your personal database."})]})}),e.jsx(t,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"notifications_active"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Smart Reminders"}),e.jsx("p",{className:"text-muted",children:"Get push notifications and email alerts for deadlines and key dates. Never miss an application window again."})]})}),e.jsx(t,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"calendar_month"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Google Calendar Sync"}),e.jsx("p",{className:"text-muted",children:"Automatically sync deadlines to your Google Calendar. Stay organized with all your dates in one place."})]})}),e.jsx(t,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"smart_toy"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Personalized AI Assistant"}),e.jsx("p",{className:"text-muted",children:"Get AI-powered recommendations tailored to your profile. Ask questions, get insights, and discover opportunities matched to you."})]})}),e.jsx(t,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"block"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Ad-Free Experience"}),e.jsx("p",{className:"text-muted",children:"Browse and research opportunities without distractions. Enjoy a clean, focused browsing experience."})]})}),e.jsx(t,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"bolt"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Priority Access"}),e.jsx("p",{className:"text-muted",children:"Get early access to newly listed opportunities before they're available to free users. Apply first, win more."})]})}),e.jsx(t,{lg:4,md:6,children:e.jsxs("div",{className:"feature-highlight",children:[e.jsx("div",{className:"feature-highlight-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"download"})}),e.jsx("h5",{className:"fw-bold mb-3",children:"Export Your Data"}),e.jsx("p",{className:"text-muted",children:"Download your saved opportunities as PDF or CSV. Share with your team or keep offline records."})]})})]})]})}),e.jsx(n,{className:"my-5",children:e.jsx(o,{className:"justify-content-center",children:e.jsxs(t,{lg:8,children:[e.jsx("h2",{className:"text-center fw-bold mb-5",children:"Frequently Asked Questions"}),e.jsxs("div",{className:"accordion",id:"faqAccordion",children:[e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq1",children:"How do smart reminders work?"})}),e.jsx("div",{id:"faq1",className:"accordion-collapse collapse show","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:"When you save an opportunity with a deadline, you can set custom reminders. We'll send you push notifications and email alerts before the deadline so you never miss an application window. You control when and how you want to be reminded."})})]}),e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button collapsed fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq2",children:"How does Google Calendar sync work?"})}),e.jsx("div",{id:"faq2",className:"accordion-collapse collapse","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:"Connect your Google Calendar once, and we'll automatically add opportunity deadlines as calendar events. You'll see all your important dates right in your calendar alongside your other commitments."})})]}),e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button collapsed fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq3",children:"What export formats are available?"})}),e.jsx("div",{id:"faq3",className:"accordion-collapse collapse","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:"Premium users can export their saved opportunities and tools as PDF (great for printing or sharing) or CSV (perfect for spreadsheets and data analysis). Export your entire list or select specific items."})})]}),e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button collapsed fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq4",children:"What can the AI Assistant do?"})}),e.jsx("div",{id:"faq4",className:"accordion-collapse collapse","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:'Your personalized AI assistant learns your preferences and goals to recommend the most relevant opportunities. Ask it questions like "Find grants for tech startups in Africa" or "What opportunities match my profile?" and get instant, tailored results.'})})]}),e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button collapsed fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq5",children:"What does priority access mean?"})}),e.jsx("div",{id:"faq5",className:"accordion-collapse collapse","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:"Premium members get early access to newly listed opportunities. When hot opportunities are added, you'll see them first—giving you a head start on applications before the crowd."})})]}),e.jsxs("div",{className:"accordion-item border-0 mb-3",style:{borderRadius:"12px",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},children:[e.jsx("h3",{className:"accordion-header",children:e.jsx("button",{className:"accordion-button collapsed fw-semibold",type:"button","data-bs-toggle":"collapse","data-bs-target":"#faq6",children:"Can I cancel my subscription anytime?"})}),e.jsx("div",{id:"faq6",className:"accordion-collapse collapse","data-bs-parent":"#faqAccordion",children:e.jsx("div",{className:"accordion-body",children:"Absolutely! Cancel anytime with no questions asked. You'll keep Premium access until the end of your billing period. Your saved opportunities will remain accessible on the free plan (up to 10 items)."})})]})]})]})})}),e.jsx("div",{style:{background:"#f3f4f6",padding:"4rem 0",marginTop:"2rem",textAlign:"center"},children:e.jsx(n,{children:e.jsx(o,{className:"justify-content-center",children:e.jsxs(t,{lg:8,children:[e.jsx("h2",{className:"fw-bold mb-3",style:{color:"#1f2937"},children:"Ready to Never Miss an Opportunity?"}),e.jsx("p",{className:"lead mb-4",style:{color:"#6b7280"},children:"Join thousands of ambitious professionals who stay organized and ahead of deadlines."}),e.jsxs("button",{className:"btn btn-success btn-lg fw-bold px-5 py-3",onClick:()=>g(m[1]),disabled:d,style:{borderRadius:"12px"},children:["Start Pro for ",r==="USD"?"$":"₦",m[1].price[a][r].toLocaleString(),"/",a==="monthly"?"month":"year"]}),e.jsx("p",{className:"mt-3 small",style:{color:"#6b7280"},children:"No credit card required - Cancel anytime"})]})})})}),e.jsx(N,{isAuthenticated:!!c.auth.user})]})};export{T as default};
