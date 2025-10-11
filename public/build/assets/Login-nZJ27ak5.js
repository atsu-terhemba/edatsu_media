import{j as e,a as v,r as l,U as h}from"./app-BPRUcR2b.js";import{C as N}from"./Checkbox-C7ORaGQJ.js";import{I as p}from"./InputError-N6QZX2aH.js";import{I as x}from"./InputLabel-BX_lBwtX.js";import{T as u}from"./TextInput-C9rf1p3A.js";import{G as y}from"./GuestLayout-nhO-4WBb.js";import{M as k}from"./Metadata-CkHBhWp0.js";import{e as f}from"./Header-DsL9Wdcc.js";import"./Row-CA6nwx3c.js";import"./Nav-Ds4tRuCu.js";import"./index-Bq5qq4he.js";import"./smartphone-duYftalW.js";import"./createLucideIcon-Dki8f50x.js";import"./download-DTGSBOnv.js";import"./index-C5lOc3Ym.js";const C=({className:n=""})=>e.jsx("div",{className:`social-login ${n}`,children:e.jsx("div",{className:"d-grid gap-2",children:[{name:"Google",icon:f.google_logo,backgroundColor:"#fff",textColor:"#757575",id:"my-signin2",url:"/auth/redirect/google"},{name:"LinkedIn",icon:f.linkedin_logo,backgroundColor:"#fff",textColor:"#737373",id:"linkedin-signin",url:"/auth/redirect/linkedin-openid"}].map(i=>e.jsxs("a",{href:i.url,className:"d-flex align-items-center justify-content-center py-3 btn text-decoration-none",id:i.id||`${i.name.toLowerCase()}-login`,style:{backgroundColor:i.backgroundColor||"white",color:i.textColor||"black",border:"2px solid #e9ecef",borderRadius:"8px",fontSize:"15px",fontWeight:"500",transition:"all 0.2s ease"},onMouseEnter:s=>{s.target.style.borderColor="#667eea",s.target.style.transform="translateY(-1px)",s.target.style.boxShadow="0 4px 12px rgba(102, 126, 234, 0.15)"},onMouseLeave:s=>{s.target.style.borderColor="#e9ecef",s.target.style.transform="translateY(0)",s.target.style.boxShadow="none"},children:[e.jsx("img",{src:i.icon,alt:`${i.name} logo`,className:"me-3",style:{width:"20px",height:"20px"}}),"Continue with ",i.name]},i.name))})});function G({status:n,canResetPassword:i}){const{data:s,setData:r,post:b,processing:c,errors:d,reset:w}=v({email:"",password:"",remember:!1}),o=[{icon:"🔔",title:"Smart Notifications",description:"Get alerts for opportunities matching your interests"},{icon:"🛠️",title:"Productivity Tools",description:"Calendar sync, deadline tracking, and more"},{icon:"📊",title:"Analytics Dashboard",description:"Track your success and application progress"},{icon:"🎯",title:"AI-Powered Matching",description:"Personalized opportunity recommendations"}],[m,g]=l.useState(0);l.useEffect(()=>{const t=setInterval(()=>{g(a=>(a+1)%o.length)},3e3);return()=>clearInterval(t)},[o.length]);const j=t=>{t.preventDefault(),b(route("login"),{onFinish:()=>w("password")})};return e.jsxs(l.Fragment,{children:[e.jsx(k,{title:"Login - Edatsu Media",description:"Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!",keywords:"login, sign in, business insights, funding opportunities, finance tools, entrepreneur support, grants and investments, Edatsu Media",canonicalUrl:"https://www.edatsu.com/login",ogTitle:"Login to Edatsu Media - Business Insights & Funding Opportunities",ogDescription:"Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!",ogImage:"/img/logo/default_logo.jpg",ogUrl:"https://www.edatsu.com/login",twitterTitle:"Login to Edatsu Media - Business Insights & Funding Opportunities",twitterDescription:"Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!",twitterImage:"/img/logo/default_logo.jpg"}),e.jsxs(y,{children:[e.jsx("style",{children:`
                .login-container {
                    min-height: 100vh;
                }
                
                .login-container .row {
                    min-height: 100vh;
                }
                
                .login-container .col-lg-7,
                .login-container .col-md-6 {
                    min-height: 100vh;
                }
                
                .hero-section {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    position: relative;
                    min-height: 100vh;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }
                
                .hero-illustration {
                    position: absolute;
                    right: -10%;
                    top: 10%;
                    width: 120%;
                    height: 80%;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.1'%3E%3Ccircle cx='400' cy='300' r='200'/%3E%3Ccircle cx='400' cy='300' r='150'/%3E%3Ccircle cx='400' cy='300' r='100'/%3E%3C/g%3E%3C/svg%3E") no-repeat center;
                    background-size: contain;
                }
                
                .content-overlay {
                    position: relative;
                    z-index: 2;
                    color: white;
                    padding: 2rem;
                }
                
                .form-section {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fafbfc;
                    padding: 2rem 1rem;
                }
                
                .form-container {
                    width: 100%;
                    max-width: 400px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    padding: 2rem;
                    margin: 1rem 0;
                }
                
                .feature-item {
                    background: rgba(255,255,255,0.15);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: all 0.3s ease;
                }
                
                .feature-item:hover {
                    background: rgba(255,255,255,0.25);
                    transform: translateY(-2px);
                }

                .features-container {
                    position: relative;
                    height: 120px;
                    overflow: hidden;
                    margin: 1.5rem 0;
                }

                .feature-slide {
                    position: absolute;
                    width: 100%;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0;
                    transform: translateY(20px);
                }

                .feature-slide.active {
                    opacity: 1;
                    transform: translateY(0);
                }

                .feature-indicators {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 1rem;
                }

                .feature-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .feature-indicator.active {
                    background: rgba(255, 255, 255, 0.8);
                    transform: scale(1.2);
                }
                
                @media (max-width: 768px) {
                    .login-container {
                        min-height: 100vh;
                        max-height: none;
                        overflow: auto;
                    }
                    
                    .login-container .row {
                        min-height: 100vh;
                        flex-direction: column;
                    }
                    
                    .login-container .col-lg-7,
                    .login-container .col-md-6 {
                        min-height: 40vh;
                    }
                    
                    .hero-section {
                        min-height: 40vh;
                        padding: 2rem 1rem;
                    }
                    
                    .form-section {
                        min-height: 60vh;
                        padding: 1rem;
                        align-items: flex-start;
                        padding-top: 2rem;
                    }
                    
                    .content-overlay {
                        padding: 1rem;
                    }
                    
                    .hero-illustration {
                        display: none;
                    }
                    
                    .form-container {
                        margin: 0;
                        padding: 1.5rem;
                    }
                }

                @media (max-width: 992px) {
                    .form-section {
                        align-items: flex-start;
                        padding-top: 2rem;
                        padding-bottom: 2rem;
                    }
                    
                    .hero-section {
                        min-height: 60vh;
                    }
                    
                    .login-container .col-lg-7,
                    .login-container .col-md-6 {
                        min-height: 60vh;
                    }
                }

                @media (max-height: 800px) {
                    .hero-section {
                        min-height: 50vh;
                    }
                    
                    .login-container .col-lg-7,
                    .login-container .col-md-6 {
                        min-height: 50vh;
                    }
                    
                    .form-section {
                        min-height: 50vh;
                        align-items: flex-start;
                        padding-top: 1rem;
                    }
                    
                    .login-container {
                        overflow: auto;
                    }
                }
                
                .brand-logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 2rem;
                }
                
                .welcome-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    line-height: 1.2;
                }
                
                .welcome-subtitle {
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }
                
                @media (max-width: 768px) {
                    .welcome-title {
                        font-size: 2rem;
                    }
                    
                    .welcome-subtitle {
                        font-size: 1rem;
                    }
                }
            `}),e.jsx("div",{className:"login-container",children:e.jsxs("div",{className:"row g-0 h-100",children:[e.jsx("div",{className:"col-lg-7 col-md-6",children:e.jsxs("div",{className:"hero-section",children:[e.jsx("div",{className:"hero-illustration"}),e.jsxs("div",{className:"content-overlay",children:[e.jsx("div",{className:"brand-logo",children:"edatsu.media"}),e.jsx("h1",{className:"welcome-title",children:"Welcome back!"}),e.jsx("p",{className:"welcome-subtitle",children:"Continue with the intelligence platform trusted by entrepreneurs worldwide"}),e.jsx("div",{className:"features-container",children:o.map((t,a)=>e.jsx("div",{className:`feature-slide ${a===m?"active":""}`,children:e.jsx("div",{className:"feature-item",children:e.jsxs("div",{className:"d-flex align-items-center gap-3",children:[e.jsx("div",{className:"feature-icon",children:e.jsx("span",{style:{fontSize:"1.5rem"},children:t.icon})}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-1 fw-semibold",children:t.title}),e.jsx("small",{className:"opacity-75",children:t.description})]})]})})},a))}),e.jsx("div",{className:"feature-indicators",children:o.map((t,a)=>e.jsx("div",{className:`feature-indicator ${a===m?"active":""}`,onClick:()=>g(a)},a))}),e.jsx("div",{className:"mt-4 pt-3 border-top border-light border-opacity-25",children:e.jsxs("div",{className:"d-flex gap-3 text-center",children:[e.jsxs("div",{className:"flex-fill",children:[e.jsx("div",{className:"fw-bold fs-4",children:"10K+"}),e.jsx("small",{className:"opacity-75",children:"Active Users"})]}),e.jsxs("div",{className:"flex-fill",children:[e.jsx("div",{className:"fw-bold fs-4",children:"500+"}),e.jsx("small",{className:"opacity-75",children:"Opportunities"})]}),e.jsxs("div",{className:"flex-fill",children:[e.jsx("div",{className:"fw-bold fs-4",children:"95%"}),e.jsx("small",{className:"opacity-75",children:"Success Rate"})]})]})})]})]})}),e.jsx("div",{className:"col-lg-5 col-md-6",children:e.jsx("div",{className:"form-section",children:e.jsxs("div",{className:"form-container",children:[n&&e.jsx("div",{className:"alert alert-success mb-4",children:n}),e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("h2",{className:"h4 fw-bold text-dark mb-2",children:"Sign In"}),e.jsx("p",{className:"text-muted small",children:"Enter your credentials to access your account"})]}),e.jsxs("form",{onSubmit:j,children:[e.jsxs("div",{className:"mb-3",children:[e.jsx(x,{htmlFor:"email",value:"Email address",className:"form-label fw-semibold"}),e.jsx(u,{id:"email",type:"email",name:"email",value:s.email,className:"form-control",style:{padding:"12px 16px",borderRadius:"8px",border:"2px solid #e9ecef",fontSize:"16px"},autoComplete:"username",isFocused:!0,onChange:t=>r("email",t.target.value)}),e.jsx(p,{message:d.email,className:"mt-1 text-danger small"})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx(x,{htmlFor:"password",value:"Password",className:"form-label fw-semibold"}),e.jsx(u,{id:"password",type:"password",name:"password",value:s.password,className:"form-control",style:{padding:"12px 16px",borderRadius:"8px",border:"2px solid #e9ecef",fontSize:"16px"},autoComplete:"current-password",onChange:t=>r("password",t.target.value)}),e.jsx(p,{message:d.password,className:"mt-1 text-danger small"})]}),e.jsx("div",{className:"mb-4",children:e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsxs("label",{className:"d-flex align-items-center",children:[e.jsx(N,{name:"remember",checked:s.remember,onChange:t=>r("remember",t.target.checked),className:"me-2"}),e.jsx("span",{className:"small text-muted",children:"Remember me"})]}),i&&e.jsx(h,{href:route("password.request"),className:"small text-primary text-decoration-none",children:"Forgot password?"})]})}),e.jsx("button",{type:"submit",className:"btn w-100 fw-semibold",disabled:c,style:{background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",border:"none",padding:"12px",borderRadius:"8px",color:"white",fontSize:"16px"},children:c?"Signing in...":"Sign In"})]}),e.jsx("div",{className:"text-center my-4",children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("hr",{className:"flex-grow-1"}),e.jsx("span",{className:"px-3 small text-muted",children:"or continue with"}),e.jsx("hr",{className:"flex-grow-1"})]})}),e.jsx(C,{}),e.jsx("div",{className:"text-center mt-4 pt-3 border-top",children:e.jsxs("p",{className:"small text-muted mb-0",children:["Don't have an account?",e.jsx(h,{href:"/register",className:"text-primary text-decoration-none fw-semibold ms-1",children:"Create one here"})]})})]})})})]})})]})]})}export{G as default};
