import{V as k,r as a,j as e,M as S}from"./app-BBoIa_Yt.js";import{A as P}from"./AuthenticatedLayout-__BbqVS1.js";import{C as z,O as l}from"./Header-D_3UkLXk.js";import{R as C}from"./Row-BfSS8SHS.js";import{C as U}from"./Col-BicBp_ja.js";import{B as d}from"./Button-BcnVGAvM.js";import"./ThemeProvider-CX3OIfIx.js";import"./sweetalert2.esm.all-B0Dix5B2.js";import"./Nav-4fss9wif.js";import"./useMergedRefs-D6eVEGOV.js";import"./Button-CNfD2lw6.js";import"./AbstractModalHeader-UfYm0CTG.js";import"./index-Dir0O_cm.js";import"./warning-xqPjWNas.js";const V=()=>{k();const[f,m]=a.useState(!1),[i,h]=a.useState(null),[t,p]=a.useState("NGN"),[r,x]=a.useState("monthly"),[n,b]=a.useState(""),[u,o]=a.useState(!1),g=[{id:"free",name:"Free",price:{monthly:{USD:0,NGN:0},yearly:{USD:0,NGN:0}},description:"Basic access to opportunities",icon:"star",features:["Access to basic opportunities","Weekly newsletter","Save up to 10 opportunities","Basic search filters"],current:!0},{id:"pro",name:"Pro",price:{monthly:{USD:2.11,NGN:3e3},yearly:{USD:22.79,NGN:32400}},description:"Unlock all features",icon:"workspace_premium",popular:!0,features:["Unlimited saved opportunities","Smart reminders via push & email","Google Calendar sync","AI Assistant","Ad-free browsing","Priority access to new opportunities","Export saved items (PDF / CSV)"],current:!1}],c=s=>s===0?"Free":t==="NGN"?`₦${s.toLocaleString()}`:`$${s.toFixed(2)}`,y=s=>{s.id!=="free"&&(h(s),m(!0))},N=async()=>{if(!n){alert("Please select a payment method");return}o(!0);try{console.log("Processing payment:",{plan:i,method:n,currency:t,billingPeriod:r}),setTimeout(()=>{o(!1),alert("Payment feature coming soon!")},1500)}catch(s){console.error("Payment error:",s),o(!1)}},j=[{id:"paystack",name:"Paystack",icon:"credit_card",description:"Pay with card (Nigeria)"},{id:"flutterwave",name:"Flutterwave",icon:"payments",description:"Card, Bank Transfer, USSD"},{id:"stripe",name:"Stripe",icon:"credit_score",description:"International cards"}];return e.jsxs(P,{children:[e.jsx(S,{title:"Upgrade to Pro"}),e.jsx("style",{children:`
                .plan-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    border: 1px solid #e5e7eb;
                    transition: all 0.3s ease;
                    height: 100%;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    max-width: 420px;
                    margin: 0 auto;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }
                
                .plan-card:hover {
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
                    transform: translateY(-4px);
                }
                
                .plan-card.popular {
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
                }
                
                .plan-card.current {
                    background: #fafafa;
                    border-color: #e5e7eb;
                }
                
                .popular-tag {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    color: white;
                    padding: 5px 18px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    white-space: nowrap;
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                }
                
                .plan-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.25rem;
                    font-size: 28px;
                }
                
                .plan-icon.free {
                    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                    color: #6b7280;
                }
                
                .plan-icon.pro {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    color: #d97706;
                }
                
                .price-amount {
                    font-size: 2.75rem;
                    font-weight: 700;
                    color: #1f2937;
                    line-height: 1;
                }
                
                .price-period {
                    color: #6b7280;
                    font-size: 0.95rem;
                    font-weight: 400;
                }
                
                .feature-list {
                    list-style: none;
                    padding: 0;
                    margin: 1.5rem 0;
                    flex-grow: 1;
                }
                
                .feature-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 0.6rem 0;
                    color: #374151;
                    font-size: 0.9rem;
                }
                
                .feature-list li .material-symbols-outlined {
                    flex-shrink: 0;
                    margin-top: 2px;
                }
                
                .feature-list li .feature-icon {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f0fdf4;
                    color: #16a34a;
                    flex-shrink: 0;
                }
                
                .feature-list li .feature-icon .material-symbols-outlined {
                    font-size: 14px;
                }
                
                .billing-toggle {
                    display: inline-flex;
                    background: #f3f4f6;
                    border-radius: 50px;
                    padding: 4px;
                }
                
                .billing-btn {
                    padding: 0.5rem 1.25rem;
                    border: none;
                    background: transparent;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .billing-btn.active {
                    background: white;
                    color: #1f2937;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .currency-toggle {
                    display: inline-flex;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50px;
                    padding: 4px;
                }
                
                .currency-btn {
                    padding: 0.375rem 1rem;
                    border: none;
                    background: transparent;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.7);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .currency-btn.active {
                    background: white;
                    color: #1f2937;
                }
                
                .payment-method-item {
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 0.75rem;
                }
                
                .payment-method-item:hover {
                    border-color: #374151;
                }
                
                .payment-method-item.selected {
                    border-color: #374151;
                    background: #f9fafb;
                }
                
                .save-badge {
                    background: #dcfce7;
                    color: #166534;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    margin-left: 0.5rem;
                }
            `}),e.jsxs(z,{className:"py-5",children:[e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("h1",{className:"fw-bold mb-2",children:"Upgrade to Pro"}),e.jsx("p",{className:"text-muted mb-4",children:"Unlock all features and supercharge your opportunity hunting"}),e.jsxs("div",{className:"d-flex justify-content-center gap-3 align-items-center flex-wrap mb-4",children:[e.jsxs("div",{className:"billing-toggle",children:[e.jsx("button",{className:`billing-btn ${t==="NGN"?"active":""}`,onClick:()=>p("NGN"),children:"🇳🇬 NGN"}),e.jsx("button",{className:`billing-btn ${t==="USD"?"active":""}`,onClick:()=>p("USD"),children:"🇺🇸 USD"})]}),e.jsxs("div",{className:"billing-toggle",children:[e.jsx("button",{className:`billing-btn ${r==="monthly"?"active":""}`,onClick:()=>x("monthly"),children:"Monthly"}),e.jsxs("button",{className:`billing-btn ${r==="yearly"?"active":""}`,onClick:()=>x("yearly"),children:["Yearly",e.jsx("span",{className:"save-badge",children:"Save 10%"})]})]})]})]}),e.jsx(C,{className:"justify-content-center g-4",children:g.map(s=>e.jsx(U,{md:5,lg:4,children:e.jsxs("div",{className:`plan-card ${s.popular?"popular":""} ${s.current?"current":""}`,children:[s.popular&&e.jsx("div",{className:"popular-tag",children:"RECOMMENDED"}),e.jsx("div",{className:`plan-icon ${s.id}`,children:e.jsx("span",{className:"material-symbols-outlined",style:{fontVariationSettings:"'FILL' 1"},children:s.icon})}),e.jsx("h3",{className:"text-center fw-bold mb-1",children:s.name}),e.jsx("p",{className:"text-center text-muted mb-3",style:{fontSize:"0.9rem"},children:s.description}),e.jsxs("div",{className:"text-center mb-3",children:[e.jsx("span",{className:"price-amount",children:c(s.price[r][t])}),s.price[r][t]>0&&e.jsxs("span",{className:"price-period",children:["/",r==="monthly"?"mo":"yr"]})]}),e.jsx("ul",{className:"feature-list",children:s.features.map((w,v)=>e.jsxs("li",{children:[e.jsx("div",{className:"feature-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"check"})}),w]},v))}),e.jsx("div",{className:"mt-auto",children:s.id==="free"?e.jsxs(d,{variant:"outline-secondary",className:"w-100 py-2",disabled:!0,style:{borderRadius:"12px",fontWeight:"500"},children:[e.jsx("span",{className:"material-symbols-outlined me-2",style:{fontSize:"18px",verticalAlign:"middle"},children:"check"}),"Current Plan"]}):e.jsxs(d,{variant:"dark",className:"w-100 py-2",style:{borderRadius:"12px",fontWeight:"500",background:"#1f2937"},onClick:()=>y(s),children:[e.jsx("span",{className:"material-symbols-outlined me-2",style:{fontSize:"18px",verticalAlign:"middle"},children:"rocket_launch"}),"Upgrade Now"]})})]})},s.id))})]}),e.jsxs(l,{show:f,onHide:()=>m(!1),placement:"start",style:{width:"400px"},children:[e.jsx(l.Header,{closeButton:!0,className:"border-bottom",children:e.jsxs(l.Title,{className:"fw-bold",children:[e.jsx("span",{className:"material-symbols-outlined me-2",style:{verticalAlign:"middle"},children:"payments"}),"Complete Payment"]})}),e.jsx(l.Body,{children:i&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"bg-light rounded p-3 mb-4",children:[e.jsx("h6",{className:"fw-bold mb-3",children:"Order Summary"}),e.jsxs("div",{className:"d-flex justify-content-between mb-2",children:[e.jsx("span",{className:"text-muted",children:"Plan"}),e.jsx("span",{className:"fw-semibold",children:i.name})]}),e.jsxs("div",{className:"d-flex justify-content-between mb-2",children:[e.jsx("span",{className:"text-muted",children:"Billing"}),e.jsx("span",{className:"fw-semibold text-capitalize",children:r})]}),e.jsx("hr",{}),e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsx("span",{className:"fw-bold",children:"Total"}),e.jsxs("span",{className:"fw-bold",style:{fontSize:"1.25rem"},children:[c(i.price[r][t]),e.jsxs("span",{className:"text-muted fw-normal",style:{fontSize:"0.8rem"},children:["/",r==="monthly"?"mo":"yr"]})]})]})]}),e.jsx("h6",{className:"fw-bold mb-3",children:"Select Payment Method"}),j.map(s=>e.jsxs("div",{className:`payment-method-item d-flex align-items-center ${n===s.id?"selected":""}`,onClick:()=>b(s.id),children:[e.jsx("div",{className:"me-3",children:e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"28px",color:"#374151"},children:s.icon})}),e.jsxs("div",{className:"flex-grow-1",children:[e.jsx("div",{className:"fw-semibold",children:s.name}),e.jsx("small",{className:"text-muted",children:s.description})]}),n===s.id&&e.jsx("span",{className:"material-symbols-outlined text-success",children:"check_circle"})]},s.id)),e.jsxs("div",{className:"mt-4",children:[e.jsx(d,{variant:"dark",className:"w-100 py-3",style:{borderRadius:"10px"},onClick:N,disabled:!n||u,children:u?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm me-2"}),"Processing..."]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"material-symbols-outlined me-2",style:{fontSize:"18px",verticalAlign:"middle"},children:"lock"}),"Pay ",c(i.price[r][t])]})}),e.jsxs("p",{className:"text-center text-muted mt-3",style:{fontSize:"0.8rem"},children:[e.jsx("span",{className:"material-symbols-outlined me-1",style:{fontSize:"14px",verticalAlign:"middle"},children:"verified_user"}),"Secure payment powered by trusted providers"]})]})]})})]})]})};export{V as default};
