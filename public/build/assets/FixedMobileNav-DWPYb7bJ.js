import{V as j,r as l,j as e,U as d}from"./app-xvdQQSge.js";import{F as y}from"./Header-DrzVB-Vl.js";const w=({isAuthenticated:t=!1,currentPath:h="/",toggleSearch:x})=>{var p,m;const{auth:o}=j().props,r=((p=o==null?void 0:o.user)==null?void 0:p.name)||((m=o==null?void 0:o.user)==null?void 0:m.username)||"";l.useState(!0);const[c,b]=l.useState(!1),i=()=>{b(!c)},u=()=>{x(),setTimeout(()=>{window.scrollTo({top:0,behavior:"smooth"})},100)},s=n=>h===n,g=()=>{const n=[{name:"Opportunities",path:"/opportunities",icon:"event",description:"Browse latest opportunities",isSeparator:!0},{name:"Toolshed",path:"/toolshed",icon:"handyman",description:"Discover useful tools"},{name:"Help",path:"/help",icon:"help",description:"Find answers and support"}];return t?[{name:"Dashboard",path:"/subscriber-dashboard",icon:"dashboard",description:"Your personal dashboard"},{name:"Profile",path:"/profile",icon:"person",description:"Edit your profile"},{name:"Saved Opportunities",path:"/bookmarked-opportunities",icon:"bookmark",description:"Your saved opportunities"},{name:"Saved Tools",path:"/bookmarked-tools",icon:"bookmark",description:"Your saved tools"},{name:"Notifications",path:"/notifications",icon:"notifications",description:"Your notifications"},...n]:[...n,{name:"Login",path:"/login",icon:"login",description:"Sign in to your account"},{name:"Register",path:"/register",icon:"person_add",description:"Create a new account"}]},v=[{id:"menu",icon:"menu",label:"Menu",path:null,onClick:i},{id:"search",icon:"search",label:"Search",path:null,onClick:u},{id:"toolshed",icon:"handyman",label:"Toolshed",path:"/toolshed",onClick:null},{id:"profile",icon:"person",label:t?"Profile":"Login",path:t?"/profile":"/login",onClick:null}];return e.jsxs(e.Fragment,{children:[c&&e.jsx("div",{className:"position-fixed w-100 d-md-none",style:{top:0,left:0,bottom:"80px",zIndex:1100,background:"rgba(0, 0, 0, 0.5)",backdropFilter:"blur(10px)"},onClick:i,children:e.jsxs("div",{className:"position-absolute w-100 bg-white h-100",style:{top:0,overflowY:"auto",animation:"slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",transform:"translateY(0)"},onClick:n=>n.stopPropagation(),children:[e.jsxs("div",{className:"d-flex align-items-center justify-content-between p-4 border-bottom sticky-top",style:{background:"linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",zIndex:10},children:[e.jsx("h5",{className:"mb-0 fw-bold text-dark",children:t?"My Account":"Navigation"}),e.jsx(y,{variant:"outline-secondary",size:"sm",onClick:i,style:{width:"32px",height:"32px",padding:0,borderRadius:"50%"},children:"×"})]}),t&&r&&e.jsx("div",{className:"p-4 border-bottom",style:{background:"linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"},children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"d-flex align-items-center justify-content-center me-3",style:{width:"50px",height:"50px",borderRadius:"50%",background:"linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",color:"white",fontSize:"20px",fontWeight:"bold"},children:r.charAt(0).toUpperCase()}),e.jsxs("div",{children:[e.jsx("div",{className:"fw-semibold text-dark",style:{fontSize:"16px"},children:r}),e.jsx("span",{className:"badge",style:{background:"#10b981",color:"white",fontSize:"10px",padding:"2px 8px",borderRadius:"12px",fontWeight:"500"},children:"Logged in"})]})]})}),e.jsxs("div",{className:"pb-4",children:[g().map(n=>e.jsxs(l.Fragment,{children:[n.isSeparator&&e.jsx("div",{className:"px-4 py-2 text-muted fw-semibold",style:{fontSize:"12px",background:"#f8fafc",textTransform:"uppercase",letterSpacing:"0.5px"},children:"Browse"}),e.jsx(d,{href:n.path,className:"text-decoration-none",onClick:i,children:e.jsxs("div",{className:"d-flex align-items-center justify-content-between p-4 border-bottom hover-list-item",style:{background:s(n.path)?"#f0f9ff":"white",borderLeft:s(n.path)?"4px solid #3b82f6":"4px solid transparent",transition:"all 0.2s ease",cursor:"pointer"},children:[e.jsxs("div",{className:"d-flex align-items-center flex-grow-1",children:[e.jsx("span",{className:"material-symbols-outlined me-3",style:{fontSize:"24px",color:s(n.path)?"#3b82f6":"#6b7280"},children:n.icon}),e.jsxs("div",{children:[e.jsx("div",{className:"fw-semibold",style:{color:s(n.path)?"#1e40af":"#374151",fontSize:"16px"},children:n.name}),e.jsx("div",{className:"text-muted",style:{fontSize:"13px"},children:n.description})]})]}),e.jsx("div",{className:"ms-3",style:{color:s(n.path)?"#3b82f6":"#9ca3af",fontSize:"18px"},children:"→"})]})})]},n.path)),t&&e.jsx(d,{href:"/logout",method:"post",as:"button",className:"text-decoration-none w-100 border-0 bg-transparent text-start",onClick:i,children:e.jsxs("div",{className:"d-flex align-items-center justify-content-between p-4 border-bottom hover-list-item",style:{background:"white",borderLeft:"4px solid transparent",transition:"all 0.2s ease",cursor:"pointer"},children:[e.jsxs("div",{className:"d-flex align-items-center flex-grow-1",children:[e.jsx("span",{className:"material-symbols-outlined me-3",style:{fontSize:"24px",color:"#ef4444"},children:"logout"}),e.jsxs("div",{children:[e.jsx("div",{className:"fw-semibold",style:{color:"#ef4444",fontSize:"16px"},children:"Logout"}),e.jsx("div",{className:"text-muted",style:{fontSize:"13px"},children:"Sign out of your account"})]})]}),e.jsx("div",{className:"ms-3",style:{color:"#9ca3af",fontSize:"18px"},children:"→"})]})})]})]})}),e.jsx("div",{className:"d-md-none position-fixed w-100",style:{bottom:"0",left:"0",right:"0",zIndex:1e3,background:"#212529",padding:"8px 0 20px 0"},children:e.jsx("div",{className:"container-fluid px-2",children:e.jsx("div",{className:"d-flex justify-content-between",children:v.map(n=>{const a=n.path?s(n.path):!1,f=e.jsxs("div",{className:"d-flex flex-column align-items-center justify-content-center h-100",children:[e.jsx("div",{className:"d-flex align-items-center justify-content-center rounded-circle transition-all",style:{width:"44px",height:"44px",background:a?"rgba(255, 255, 255, 0.15)":"transparent",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",transform:a?"scale(1.1)":"scale(1)"},children:e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"20px",color:a?"#ffffff":"rgba(255, 255, 255, 0.7)"},children:n.icon})}),e.jsx("span",{className:"mt-1",style:{fontSize:"10px",fontWeight:"500",color:a?"#ffffff":"rgba(255, 255, 255, 0.6)",transition:"color 0.3s ease"},children:n.label})]});return e.jsx("div",{className:"flex-fill text-center",children:n.path?e.jsx(d,{href:n.path,className:"btn p-0 w-100",style:{height:"60px",textDecoration:"none",border:"none",outline:"none",boxShadow:"none",background:"transparent"},children:f}):e.jsx("button",{onClick:n.onClick,className:"btn p-0 w-100",style:{height:"60px",border:"none",outline:"none",boxShadow:"none",background:"transparent"},children:f})},n.id)})})})}),e.jsx("div",{className:"d-md-none",style:{height:"80px"}}),e.jsx("style",{children:`
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
        
        /* Remove all button outlines and shadows in mobile nav */
        .d-md-none .btn,
        .d-md-none .btn:focus,
        .d-md-none .btn:active,
        .d-md-none .btn:hover,
        .d-md-none button,
        .d-md-none button:focus,
        .d-md-none button:active,
        .d-md-none a.btn,
        .d-md-none a.btn:focus,
        .d-md-none a.btn:active {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
      `})]})};export{w as F};
