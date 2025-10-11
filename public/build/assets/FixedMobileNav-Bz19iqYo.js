import{r,j as t,U as m}from"./app-BPRUcR2b.js";import{j}from"./Header-DsL9Wdcc.js";import{c as i}from"./createLucideIcon-Dki8f50x.js";import{S as w}from"./search-xTrKbfk0.js";/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]],M=i("menu",N);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],C=i("moon",S);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],L=i("sun",z);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],P=i("user",I),U=({isAuthenticated:s=!1,currentPath:u="/",username:x="",toggleSearch:f})=>{r.useState(!0);const[c,l]=r.useState(!1),[d,b]=r.useState(!1);r.useEffect(()=>{localStorage.getItem("darkMode")==="true"&&(l(!0),document.body.classList.add("dark-mode"))},[]);const g=()=>{const e=!c;l(e),localStorage.setItem("darkMode",e.toString()),e?document.body.classList.add("dark-mode"):document.body.classList.remove("dark-mode")},a=()=>{b(!d)},y=()=>{f(),setTimeout(()=>{window.scrollTo({top:0,behavior:"smooth"})},100)},o=e=>u===e,k=()=>{const e=[{name:"Home",path:"/",description:"Back to main page"},{name:"Opportunities",path:"/opportunities",description:"Browse latest opportunities"},{name:"Toolshed",path:"/toolshed",description:"Discover useful tools"},{name:"About",path:"/about",description:"Learn more about us"},{name:"Contact",path:"/contact",description:"Get in touch with us"},{name:"Help",path:"/help",description:"Find answers and support"},{name:"Terms & Conditions",path:"/terms",description:"Our terms of service"},{name:"Privacy Policy",path:"/privacy",description:"How we protect your data"}];return s?[...e,{name:"Profile",path:"/profile",description:"Manage your profile"},{name:"Dashboard",path:"/dashboard",description:"Your personal dashboard"},{name:"Settings",path:"/settings",description:"Account preferences"},{name:"Logout",path:"/logout",description:"Sign out securely"}]:[...e,{name:"Login",path:"/login",description:"Sign in to your account"},{name:"Register",path:"/register",description:"Create a new account"}]},v=[{id:"menu",icon:M,label:"Menu",path:null,onClick:a},{id:"search",icon:w,label:"Search",path:null,onClick:y},{id:"theme",icon:c?L:C,label:c?"Light":"Dark",path:null,onClick:g},{id:"profile",icon:P,label:s?"Profile":"Login",path:s?"/profile":"/login",onClick:null}];return t.jsxs(t.Fragment,{children:[d&&t.jsx("div",{className:"position-fixed w-100 d-md-none",style:{top:0,left:0,bottom:"80px",zIndex:1100,background:"rgba(0, 0, 0, 0.5)",backdropFilter:"blur(10px)"},onClick:a,children:t.jsxs("div",{className:"position-absolute w-100 bg-white h-100",style:{top:0,overflowY:"auto",animation:"slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",transform:"translateY(0)"},onClick:e=>e.stopPropagation(),children:[t.jsxs("div",{className:"d-flex align-items-center justify-content-between p-4 border-bottom sticky-top",style:{background:"linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",zIndex:10},children:[t.jsx("h5",{className:"mb-0 fw-bold text-dark",children:"Navigation"}),t.jsx(j,{variant:"outline-secondary",size:"sm",onClick:a,style:{width:"32px",height:"32px",padding:0,borderRadius:"50%"},children:"×"})]}),t.jsx("div",{className:"pb-4",children:k().map((e,p)=>t.jsx(m,{href:e.path,className:"text-decoration-none",onClick:a,children:t.jsxs("div",{className:"d-flex align-items-center justify-content-between p-4 border-bottom hover-list-item",style:{background:o(e.path)?"#f0f9ff":"white",borderLeft:o(e.path)?"4px solid #3b82f6":"4px solid transparent",transition:"all 0.2s ease",cursor:"pointer"},children:[t.jsxs("div",{className:"flex-grow-1",children:[t.jsx("div",{className:"fw-semibold mb-1",style:{color:o(e.path)?"#1e40af":"#374151",fontSize:"16px",lineHeight:"1.2"},children:e.name}),t.jsx("div",{className:"text-muted",style:{fontSize:"13px",lineHeight:"1.3"},children:e.description})]}),t.jsx("div",{className:"ms-3",style:{color:o(e.path)?"#3b82f6":"#9ca3af",fontSize:"18px",transition:"transform 0.2s ease"},children:"→"})]})},e.path))}),s&&t.jsx("div",{className:"p-4 text-center border-top mt-auto",style:{background:"#f8fafc"},children:t.jsxs("small",{className:"text-muted",children:["Welcome back, ",x||"User","!"]})})]})}),t.jsx("div",{className:"d-md-none position-fixed w-100",style:{bottom:"0",left:"0",right:"0",zIndex:1e3,background:"rgba(255, 255, 255, 0.95)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(0, 0, 0, 0.1)",padding:"8px 0 20px 0",boxShadow:"0 -10px 30px rgba(0, 0, 0, 0.1)"},children:t.jsx("div",{className:"container-fluid px-4",children:t.jsx("div",{className:"row g-0",children:v.map(e=>{const p=e.icon,n=e.path?o(e.path):!1,h=t.jsxs("div",{className:"d-flex flex-column align-items-center justify-content-center h-100",children:[t.jsx("div",{className:"d-flex align-items-center justify-content-center rounded-circle transition-all",style:{width:"44px",height:"44px",background:n?"#e5e7eb":"transparent",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",transform:n?"scale(1.1)":"scale(1)"},children:t.jsx(p,{size:20,color:n?"#374151":"#6b7280",strokeWidth:2})}),t.jsx("span",{className:"mt-1",style:{fontSize:"10px",fontWeight:"500",color:n?"#374151":"#9ca3af",transition:"color 0.3s ease"},children:e.label})]});return t.jsx("div",{className:"col-3",children:e.path?t.jsx(m,{href:e.path,className:"btn border-0 p-0 w-100 bg-transparent",style:{height:"60px",textDecoration:"none"},children:h}):t.jsx("button",{onClick:e.onClick,className:"btn border-0 p-0 w-100 bg-transparent",style:{height:"60px"},children:h})},e.id)})})})}),t.jsx("div",{className:"d-md-none",style:{height:"80px"}}),t.jsx("style",{jsx:!0,children:`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .hover-list-item:hover {
          background: #f8fafc !important;
          transform: translateX(4px);
        }
        
        .hover-list-item:hover div:last-child {
          transform: translateX(4px);
        }
        
        .hover-list-item:active {
          background: #e2e8f0 !important;
          transform: scale(0.98) translateX(4px);
        }
      `})]})};export{U as F};
