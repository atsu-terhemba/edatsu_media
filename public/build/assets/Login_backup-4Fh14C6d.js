import{a as g,j as e,r as u,U as o}from"./app-BEbjaJ0j.js";import{C as f}from"./Checkbox-BLyssPn8.js";import{I as l}from"./InputError-C4X8b_Ex.js";import{I as d}from"./InputLabel-BgvFRnSE.js";import{T as c}from"./TextInput-oL7ozsJV.js";import{G as b}from"./GuestLayout-DG5q--TE.js";import{M as j}from"./Metadata-RDa4w6Tz.js";import"./Header-DAkF0IRS.js";import"./ThemeProvider-BvqNrVy1.js";import"./sweetalert2.esm.all-B0Dix5B2.js";import"./Nav-CAnbmLoe.js";import"./useMergedRefs-AOWqxIwy.js";import"./Button-kf8okebG.js";import"./AbstractModalHeader-CRU5p0Uh.js";import"./index-BF1-HPCi.js";import"./warning-DWLneV_o.js";import"./Button-Apf8HkCF.js";import"./Col-Cln8vZTh.js";import"./Row-B3TUcrJ7.js";import"./smartphone-CiDTFAlB.js";import"./createLucideIcon-D6gsrNnO.js";import"./download-Cu5bKH52.js";function _({status:t,canResetPassword:m}){const{data:i,setData:a,post:h,processing:r,errors:n,reset:p}=g({email:"",password:"",remember:!1}),x=s=>{s.preventDefault(),h(route("login"),{onFinish:()=>p("password")})};return e.jsxs(u.Fragment,{children:[e.jsx(j,{title:"Login - Edatsu Media",description:"Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!",keywords:"login, sign in, business insights, funding opportunities, finance tools, entrepreneur support, grants and investments, Edatsu Media",canonicalUrl:"https://www.edatsu.com/login",ogTitle:"Login to Edatsu Media - Business Insights & Funding Opportunities",ogDescription:"Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!",ogImage:"/img/logo/default_logo.jpg",ogUrl:"https://www.edatsu.com/login",twitterTitle:"Login to Edatsu Media - Business Insights & Funding Opportunities",twitterDescription:"Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!",twitterImage:"/img/logo/default_logo.jpg"}),e.jsxs(b,{children:[e.jsx("style",{children:`
                .login-container {
                    min-height: 100vh;
                    max-height: 100vh;
                    overflow: hidden;
                }
                
                .hero-section {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    position: relative;
                    min-height: 100vh;
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
                
                @media (max-width: 768px) {
                    .login-container {
                        min-height: 100vh;
                        max-height: none;
                        overflow: auto;
                    }
                    
                    .hero-section {
                        min-height: 40vh;
                        padding: 2rem 1rem;
                    }
                    
                    .form-section {
                        min-height: 60vh;
                        padding: 1rem;
                    }
                    
                    .content-overlay {
                        padding: 1rem;
                    }
                    
                    .hero-illustration {
                        display: none;
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
            `}),e.jsx("div",{className:"login-container",children:e.jsxs("div",{className:"row g-0 h-100",children:[e.jsx("div",{className:"col-lg-7 col-md-6",children:e.jsxs("div",{className:"hero-section",children:[e.jsx("div",{className:"hero-illustration"}),e.jsxs("div",{className:"content-overlay",children:[e.jsx("div",{className:"brand-logo",children:"edatsu.media"}),e.jsx("h1",{className:"welcome-title",children:"Welcome back!"}),e.jsx("p",{className:"welcome-subtitle",children:"Continue with the intelligence platform trusted by entrepreneurs worldwide"}),e.jsxs("div",{className:"features-grid",children:[e.jsx("div",{className:"feature-item",children:e.jsxs("div",{className:"d-flex align-items-center gap-3",children:[e.jsx("div",{className:"feature-icon",children:e.jsx("span",{style:{fontSize:"1.5rem"},children:"🔔"})}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-1 fw-semibold",children:"Smart Notifications"}),e.jsx("small",{className:"opacity-75",children:"Get alerts for opportunities matching your interests"})]})]})}),e.jsx("div",{className:"feature-item",children:e.jsxs("div",{className:"d-flex align-items-center gap-3",children:[e.jsx("div",{className:"feature-icon",children:e.jsx("span",{style:{fontSize:"1.5rem"},children:"🛠️"})}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-1 fw-semibold",children:"Productivity Tools"}),e.jsx("small",{className:"opacity-75",children:"Calendar sync, deadline tracking, and more"})]})]})}),e.jsx("div",{className:"feature-item",children:e.jsxs("div",{className:"d-flex align-items-center gap-3",children:[e.jsx("div",{className:"feature-icon",children:e.jsx("span",{style:{fontSize:"1.5rem"},children:"📊"})}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-1 fw-semibold",children:"Analytics Dashboard"}),e.jsx("small",{className:"opacity-75",children:"Track your success and application progress"})]})]})}),e.jsx("div",{className:"feature-item",children:e.jsxs("div",{className:"d-flex align-items-center gap-3",children:[e.jsx("div",{className:"feature-icon",children:e.jsx("span",{style:{fontSize:"1.5rem"},children:"🎯"})}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-1 fw-semibold",children:"AI-Powered Matching"}),e.jsx("small",{className:"opacity-75",children:"Personalized opportunity recommendations"})]})]})})]}),e.jsx("div",{className:"mt-4 pt-3 border-top border-light border-opacity-25",children:e.jsxs("div",{className:"d-flex gap-3 text-center",children:[e.jsxs("div",{className:"flex-fill",children:[e.jsx("div",{className:"fw-bold fs-4",children:"10K+"}),e.jsx("small",{className:"opacity-75",children:"Active Users"})]}),e.jsxs("div",{className:"flex-fill",children:[e.jsx("div",{className:"fw-bold fs-4",children:"500+"}),e.jsx("small",{className:"opacity-75",children:"Opportunities"})]}),e.jsxs("div",{className:"flex-fill",children:[e.jsx("div",{className:"fw-bold fs-4",children:"95%"}),e.jsx("small",{className:"opacity-75",children:"Success Rate"})]})]})})]})]})}),e.jsx("div",{className:"col-lg-5 col-md-6",children:e.jsx("div",{className:"form-section",children:e.jsxs("div",{className:"form-container",children:[t&&e.jsx("div",{className:"alert alert-success mb-4",children:t}),e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("h2",{className:"h4 fw-bold text-dark mb-2",children:"Sign In"}),e.jsx("p",{className:"text-muted small",children:"Enter your credentials to access your account"})]}),e.jsxs("form",{onSubmit:x,children:[e.jsxs("div",{className:"mb-3",children:[e.jsx(d,{htmlFor:"email",value:"Email address",className:"form-label fw-semibold"}),e.jsx(c,{id:"email",type:"email",name:"email",value:i.email,className:"form-control",style:{padding:"12px 16px",borderRadius:"8px",border:"2px solid #e9ecef",fontSize:"16px"},autoComplete:"username",isFocused:!0,onChange:s=>a("email",s.target.value)}),e.jsx(l,{message:n.email,className:"mt-1 text-danger small"})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx(d,{htmlFor:"password",value:"Password",className:"form-label fw-semibold"}),e.jsx(c,{id:"password",type:"password",name:"password",value:i.password,className:"form-control",style:{padding:"12px 16px",borderRadius:"8px",border:"2px solid #e9ecef",fontSize:"16px"},autoComplete:"current-password",onChange:s=>a("password",s.target.value)}),e.jsx(l,{message:n.password,className:"mt-1 text-danger small"})]}),e.jsx("div",{className:"mb-4",children:e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsxs("label",{className:"d-flex align-items-center",children:[e.jsx(f,{name:"remember",checked:i.remember,onChange:s=>a("remember",s.target.checked),className:"me-2"}),e.jsx("span",{className:"small text-muted",children:"Remember me"})]}),m&&e.jsx(o,{href:route("password.request"),className:"small text-primary text-decoration-none",children:"Forgot password?"})]})}),e.jsx("button",{type:"submit",className:"btn w-100 fw-semibold",disabled:r,style:{background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",border:"none",padding:"12px",borderRadius:"8px",color:"white",fontSize:"16px"},children:r?"Signing in...":"Sign In"})]}),e.jsx("div",{className:"text-center mt-4 pt-3 border-top",children:e.jsxs("p",{className:"small text-muted mb-0",children:["Don't have an account?",e.jsx(o,{href:"/register",className:"text-primary text-decoration-none fw-semibold ms-1",children:"Create one here"})]})})]})})})]})})]})]})}export{_ as default};
