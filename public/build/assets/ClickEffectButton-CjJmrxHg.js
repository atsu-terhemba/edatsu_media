import{r as c,R as h,j as n}from"./app-C0kMeFyk.js";const x=({children:i,className:u="",variant:l="primary",size:o,disabled:r,loading:e=!1,type:d=null,onClick:s,...f})=>{const[a,m]=c.useState(!1),p=c.useCallback(t=>{r||e||a||(m(!0),s==null||s(t),setTimeout(()=>{m(!1)},200))},[r,e,a,s]),b=["btn",`btn-${l}`,o&&`btn-${o}`,a&&"btn-pressed",e&&"disabled",u].filter(Boolean).join(" ");return h.useEffect(()=>{const t=document.createElement("style");return t.innerHTML=`
      .btn-pressed {
        transform: scale(0.95);
        transition: transform 0.2s ease;
      }
    `,document.head.appendChild(t),()=>{document.head.removeChild(t)}},[]),n.jsx("button",{type:d,className:b,disabled:r||e,onClick:p,...f,children:e?n.jsxs(n.Fragment,{children:[n.jsx("span",{className:"spinner-border spinner-border-sm me-2",role:"status","aria-hidden":"true"}),"Loading..."]}):i})};x.displayName="ClickEffectButton";export{x as C};
