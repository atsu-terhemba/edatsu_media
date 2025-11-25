import{a as f,r as l,j as e,U as d}from"./app-4wCrxnXP.js";import{C as w}from"./Checkbox-Ddbca9RY.js";import{I as c}from"./InputError-DDpBFndN.js";import{I as m}from"./InputLabel-B3eci0RY.js";import{T as p}from"./TextInput-DF_lsacl.js";import{G as j}from"./GuestLayout-CxqEGiNL.js";import{M as N}from"./Metadata-CtbcVe3r.js";import{S as v}from"./SocialLogin-C9aoztR3.js";import"./Header-DxZsnhO4.js";import"./Nav-CXQzwDUe.js";import"./index-CY6IMWrD.js";import"./index-CuXER6Vq.js";import"./Row-DPsvcYvS.js";import"./smartphone-CsrXIhEY.js";import"./createLucideIcon-Ce5412wp.js";import"./download-Kc5b7Rhd.js";function P({status:r,canResetPassword:g}){const{data:t,setData:o,post:u,processing:n,errors:i,reset:x}=f({email:"",password:"",remember:!1}),[a,h]=l.useState(!1),b=s=>{s.preventDefault(),u(route("login"),{onFinish:()=>x("password")})};return e.jsxs(l.Fragment,{children:[e.jsx(N,{title:"Login - Edatsu Media",description:"Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!",keywords:"login, sign in, business insights, funding opportunities, finance tools, entrepreneur support, grants and investments, Edatsu Media",canonicalUrl:"https://www.edatsu.com/login",ogTitle:"Login to Edatsu Media - Business Insights & Funding Opportunities",ogDescription:"Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!",ogImage:"/img/logo/default_logo.jpg",ogUrl:"https://www.edatsu.com/login",twitterTitle:"Login to Edatsu Media - Business Insights & Funding Opportunities",twitterDescription:"Access your Edatsu account to stay updated on global business insights, funding opportunities, and finance resources. Log in now!",twitterImage:"/img/logo/default_logo.jpg"}),e.jsxs(j,{children:[e.jsx("style",{children:`
                    .login-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fafbfc;
                        padding: 2rem 1rem;
                    }
                    
                    .form-container {
                        width: 100%;
                        max-width: 450px;
                        border-radius: 16px;
                        padding: 2.5rem;
                        margin: 1rem auto;
                    }
                    
                    .brand-logo {
                        text-align: center;
                        font-size: 1.8rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-bottom: 2rem;
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
                    
                    @media (max-width: 768px) {
                        .login-container {
                            padding: 1rem;
                        }
                        
                        .form-container {
                            padding: 2rem 1.5rem;
                        }
                    }
                `}),e.jsx("div",{className:"login-container",children:e.jsxs("div",{className:"form-container",children:[e.jsx("div",{className:"brand-logo",children:"edatsu.media"}),r&&e.jsx("div",{className:"alert alert-success mb-4",children:r}),e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("h2",{className:"h4 fw-bold text-dark mb-2",children:"Sign In"}),e.jsx("p",{className:"text-muted small",children:"Enter your credentials to access your account"})]}),e.jsxs("form",{onSubmit:b,children:[e.jsxs("div",{className:"mb-3",children:[e.jsx(m,{htmlFor:"email",value:"Email address",className:"form-label fw-semibold"}),e.jsx(p,{id:"email",type:"email",name:"email",value:t.email,className:"form-control shadow-none focus:shadow-none border-0",style:{padding:"12px 16px",borderRadius:"8px",backgroundColor:"#f8f9fa",fontSize:"16px"},autoComplete:"username",isFocused:!0,onChange:s=>o("email",s.target.value)}),e.jsx(c,{message:i.email,className:"mt-1 text-danger small"})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx(m,{htmlFor:"password",value:"Password",className:"form-label fw-semibold"}),e.jsxs("div",{className:"password-input-wrapper",children:[e.jsx(p,{id:"password",type:a?"text":"password",name:"password",value:t.password,className:"form-control shadow-none focus:shadow-none border-0",style:{padding:"12px 40px 12px 16px",borderRadius:"8px",backgroundColor:"#f8f9fa",fontSize:"16px"},autoComplete:"current-password",onChange:s=>o("password",s.target.value)}),e.jsx("button",{type:"button",className:"password-toggle-btn",onClick:()=>h(!a),"aria-label":a?"Hide password":"Show password",children:a?e.jsxs("svg",{width:"20",height:"20",fill:"currentColor",viewBox:"0 0 16 16",children:[e.jsx("path",{d:"M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"}),e.jsx("path",{d:"M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"}),e.jsx("path",{d:"M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"})]}):e.jsxs("svg",{width:"20",height:"20",fill:"currentColor",viewBox:"0 0 16 16",children:[e.jsx("path",{d:"M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"}),e.jsx("path",{d:"M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"})]})})]}),e.jsx(c,{message:i.password,className:"mt-1 text-danger small"})]}),e.jsx("div",{className:"mb-4",children:e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsxs("label",{className:"d-flex align-items-center",children:[e.jsx(w,{name:"remember",checked:t.remember,onChange:s=>o("remember",s.target.checked),className:"me-2"}),e.jsx("span",{className:"small text-muted",children:"Remember me"})]}),g&&e.jsx(d,{href:route("password.request"),className:"small text-primary text-decoration-none",children:"Forgot password?"})]})}),e.jsx("button",{type:"submit",className:"btn w-100 fw-semibold",disabled:n,style:{background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",border:"none",padding:"12px",borderRadius:"8px",color:"white",fontSize:"16px"},children:n?"Signing in...":"Sign In"})]}),e.jsx("div",{className:"text-center my-4",children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("hr",{className:"flex-grow-1"}),e.jsx("span",{className:"px-3 small text-muted",children:"or continue with"}),e.jsx("hr",{className:"flex-grow-1"})]})}),e.jsx(v,{}),e.jsx("div",{className:"text-center mt-4 pt-3 border-top",children:e.jsxs("p",{className:"small text-muted mb-0",children:["Don't have an account?",e.jsx(d,{href:"/register",className:"text-primary text-decoration-none fw-semibold ms-1",children:"Create one here"})]})})]})})]})]})}export{P as default};
