import{a as N,r as i,j as e,U as h}from"./app-Dw-sakWW.js";import{I as d}from"./InputError-DOKpbrzd.js";import{I as m}from"./InputLabel-g72mYDHH.js";import{T as p}from"./TextInput-BC9mJPDo.js";import{G as y}from"./GuestLayout-DgL3_-KA.js";import{M as C}from"./Metadata-DbQwyRdo.js";import{S as z}from"./SocialLogin-DiWXDuar.js";import"./Header-CzhjMLPY.js";import"./ThemeProvider-CN9ehXRP.js";import"./sweetalert2.esm.all-B0Dix5B2.js";import"./Nav-Bk68sUrU.js";import"./useMergedRefs-DMCPGJpj.js";import"./Button-BLO6BfsQ.js";import"./AbstractModalHeader-kbibA2T9.js";import"./index-BxXdI4us.js";import"./warning-Cq_vVWuK.js";import"./Button-dVVgUqBb.js";import"./Col-CZNOFJ3S.js";import"./Row-BM2ElXb8.js";import"./smartphone-KiUxPnsZ.js";import"./createLucideIcon-_IzGmtr8.js";import"./download-C0iIyIK_.js";function Q({role:S}){const{data:a,setData:r,post:f,processing:g,errors:o,reset:w}=N({name:"",email:"",password:"",role:"subscriber",password_confirmation:""}),n=[{icon:"🎯",title:"Personalized Dashboard",description:"Access tailored opportunities and insights just for you"},{icon:"💼",title:"Global Opportunities",description:"Discover funding and business opportunities worldwide"},{icon:"📈",title:"Track Your Progress",description:"Monitor applications and success metrics in real-time"},{icon:"🔔",title:"Smart Alerts",description:"Never miss an opportunity with instant notifications"}],[x,u]=i.useState(0),[l,v]=i.useState(!1),[c,b]=i.useState(!1);i.useEffect(()=>{const s=setInterval(()=>{u(t=>(t+1)%n.length)},3e3);return()=>clearInterval(s)},[n.length]);const j=s=>{s.preventDefault(),f(route("sign-up"),{onFinish:()=>w("password","password_confirmation")})};return e.jsxs(i.Fragment,{children:[e.jsx(C,{title:"Sign Up - Edatsu Media",description:"Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!",keywords:"sign up, create account, business opportunities, funding resources, finance tools, entrepreneur support, grants and investments, Edatsu Media",canonicalUrl:"https://www.edatsu.com/signup",ogTitle:"Join Edatsu Media - Business Insights & Funding Opportunities",ogDescription:"Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!",ogImage:"/img/logo/default_logo.jpg",ogUrl:"https://www.edatsu.com/signup",twitterTitle:"Join Edatsu Media - Business Insights & Funding Opportunities",twitterDescription:"Create your Edatsu account to access exclusive business insights, funding opportunities, and global finance resources. Join today!",twitterImage:"/img/logo/default_logo.jpg"}),e.jsxs(y,{children:[e.jsx("style",{children:`
                .register-container {
                    min-height: 100vh;
                }
                
                .register-container .row {
                    min-height: 100vh;
                }
                
                .register-container .col-lg-7,
                .register-container .col-md-6 {
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
                    border-radius: 16px;
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
                
                .password-input-wrapper {
                    position: relative;
                }
                
                .password-toggle-btn {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #6c757d;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .password-toggle-btn:hover {
                    color: #495057;
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
                    .register-container {
                        min-height: 100vh;
                        max-height: none;
                        overflow: auto;
                    }
                    
                    .register-container .row {
                        min-height: 100vh;
                        flex-direction: column;
                    }
                    
                    .register-container .col-lg-7,
                    .register-container .col-md-6 {
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
                    
                    .register-container .col-lg-7,
                    .register-container .col-md-6 {
                        min-height: 60vh;
                    }
                }

                @media (max-height: 800px) {
                    .hero-section {
                        min-height: 50vh;
                    }
                    
                    .register-container .col-lg-7,
                    .register-container .col-md-6 {
                        min-height: 50vh;
                    }
                    
                    .form-section {
                        min-height: 50vh;
                        align-items: flex-start;
                        padding-top: 1rem;
                    }
                    
                    .register-container {
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
            `}),e.jsx("div",{className:"register-container",children:e.jsxs("div",{className:"row g-0 h-100",children:[e.jsx("div",{className:"col-lg-7 col-md-6",children:e.jsxs("div",{className:"hero-section",children:[e.jsx("div",{className:"hero-illustration"}),e.jsxs("div",{className:"content-overlay",children:[e.jsx("div",{className:"brand-logo",children:"edatsu.media"}),e.jsx("h1",{className:"welcome-title",children:"Start your journey today!"}),e.jsx("p",{className:"welcome-subtitle",children:"Join thousands of entrepreneurs discovering opportunities worldwide"}),e.jsx("div",{className:"features-container",children:n.map((s,t)=>e.jsx("div",{className:`feature-slide ${t===x?"active":""}`,children:e.jsx("div",{className:"feature-item",children:e.jsxs("div",{className:"d-flex align-items-center gap-3",children:[e.jsx("div",{className:"feature-icon",children:e.jsx("span",{style:{fontSize:"1.5rem"},children:s.icon})}),e.jsxs("div",{children:[e.jsx("h6",{className:"mb-1 fw-semibold",children:s.title}),e.jsx("small",{className:"opacity-75",children:s.description})]})]})})},t))}),e.jsx("div",{className:"feature-indicators",children:n.map((s,t)=>e.jsx("div",{className:`feature-indicator ${t===x?"active":""}`,onClick:()=>u(t)},t))}),e.jsx("div",{className:"mt-4 pt-3 border-top border-light border-opacity-25",children:e.jsxs("div",{className:"d-flex gap-3 text-center",children:[e.jsxs("div",{className:"flex-fill",children:[e.jsx("div",{className:"fw-bold fs-4",children:"10K+"}),e.jsx("small",{className:"opacity-75",children:"Active Users"})]}),e.jsxs("div",{className:"flex-fill",children:[e.jsx("div",{className:"fw-bold fs-4",children:"500+"}),e.jsx("small",{className:"opacity-75",children:"Opportunities"})]}),e.jsxs("div",{className:"flex-fill",children:[e.jsx("div",{className:"fw-bold fs-4",children:"Free"}),e.jsx("small",{className:"opacity-75",children:"To Join"})]})]})})]})]})}),e.jsx("div",{className:"col-lg-5 col-md-6",children:e.jsx("div",{className:"form-section",children:e.jsxs("div",{className:"form-container",children:[e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("h2",{className:"h4 fw-bold text-dark mb-2",children:"Create Account"}),e.jsx("p",{className:"text-muted small",children:"Fill in your details to get started"})]}),e.jsxs("form",{onSubmit:j,children:[e.jsxs("div",{className:"mb-3",children:[e.jsx(m,{htmlFor:"name",value:"Username",className:"form-label fw-semibold"}),e.jsx(p,{id:"name",name:"name",value:a.name,className:"form-control shadow-none focus:shadow-none",style:{padding:"12px 16px",borderRadius:"8px",border:"2px solid #e9ecef",fontSize:"16px"},autoComplete:"name",isFocused:!0,onChange:s=>r("name",s.target.value),required:!0}),e.jsxs("small",{className:"text-secondary small d-block mt-1",children:[e.jsx("strong",{className:"text-danger",children:"* "}),"Spaces not allowed. Use underscores instead"]}),e.jsx(d,{message:o.name,className:"mt-1 text-danger small"})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx(m,{htmlFor:"email",value:"Email address",className:"form-label fw-semibold"}),e.jsx(p,{id:"email",type:"email",name:"email",value:a.email,className:"form-control shadow-none focus:shadow-none",style:{padding:"12px 16px",borderRadius:"8px",border:"2px solid #e9ecef",fontSize:"16px"},autoComplete:"username",onChange:s=>r("email",s.target.value),required:!0}),e.jsx(d,{message:o.email,className:"mt-1 text-danger small"})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx(m,{htmlFor:"password",value:"Password",className:"form-label fw-semibold"}),e.jsxs("div",{className:"password-input-wrapper",children:[e.jsx(p,{id:"password",type:l?"text":"password",name:"password",value:a.password,className:"form-control shadow-none focus:shadow-none",style:{padding:"12px 40px 12px 16px",borderRadius:"8px",border:"2px solid #e9ecef",fontSize:"16px"},autoComplete:"new-password",onChange:s=>r("password",s.target.value),required:!0}),e.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>v(!l),"aria-label":l?"Hide password":"Show password",children:l?e.jsxs("svg",{width:"20",height:"20",fill:"currentColor",viewBox:"0 0 16 16",children:[e.jsx("path",{d:"M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"}),e.jsx("path",{d:"M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"}),e.jsx("path",{d:"M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"})]}):e.jsxs("svg",{width:"20",height:"20",fill:"currentColor",viewBox:"0 0 16 16",children:[e.jsx("path",{d:"M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"}),e.jsx("path",{d:"M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"})]})})]}),e.jsx(d,{message:o.password,className:"mt-1 text-danger small"})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx(m,{htmlFor:"password_confirmation",value:"Confirm Password",className:"form-label fw-semibold"}),e.jsxs("div",{className:"password-input-wrapper",children:[e.jsx(p,{id:"password_confirmation",type:c?"text":"password",name:"password_confirmation",value:a.password_confirmation,className:"form-control shadow-none focus:shadow-none",style:{padding:"12px 40px 12px 16px",borderRadius:"8px",border:"2px solid #e9ecef",fontSize:"16px"},autoComplete:"new-password",onChange:s=>r("password_confirmation",s.target.value),required:!0}),e.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>b(!c),"aria-label":c?"Hide password":"Show password",children:c?e.jsxs("svg",{width:"20",height:"20",fill:"currentColor",viewBox:"0 0 16 16",children:[e.jsx("path",{d:"M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"}),e.jsx("path",{d:"M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"}),e.jsx("path",{d:"M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"})]}):e.jsxs("svg",{width:"20",height:"20",fill:"currentColor",viewBox:"0 0 16 16",children:[e.jsx("path",{d:"M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"}),e.jsx("path",{d:"M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"})]})})]}),e.jsx(d,{message:o.password_confirmation,className:"mt-1 text-danger small"})]}),e.jsx("button",{type:"submit",className:"btn w-100 fw-semibold",disabled:g,style:{background:"#1a1a2e",border:"none",padding:"12px",borderRadius:"8px",color:"white",fontSize:"16px"},children:g?"Creating account...":"Create Account"})]}),e.jsx("div",{className:"text-center my-4",children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("hr",{className:"flex-grow-1"}),e.jsx("span",{className:"px-3 small text-muted",children:"or continue with"}),e.jsx("hr",{className:"flex-grow-1"})]})}),e.jsx(z,{}),e.jsxs("div",{className:"text-center mt-4 pt-3 border-top",children:[e.jsxs("p",{className:"small text-muted mb-2",children:["Already have an account?",e.jsx(h,{href:"/login",className:"text-primary text-decoration-none fw-semibold ms-1",children:"Sign in here"})]}),e.jsxs("p",{className:"small text-muted",style:{fontSize:"0.75rem",lineHeight:"1.4"},children:["By signing up you agree to the ",e.jsx(h,{href:"/terms",className:"text-primary text-decoration-none",children:"Terms of Service"})," and ",e.jsx(h,{href:"/privacy",className:"text-primary text-decoration-none",children:"Privacy Policy"})]})]})]})})})]})})]})]})}export{Q as default};
