import{r as d,j as t,S as I}from"./app-G1ZAb7VJ.js";import{I as C,p as m,b as S,c as B}from"./Header-C-SXvDO4.js";import{S as E}from"./ShareButton-HWEjT0uq.js";import{A as _}from"./AdBanner-DBUe7j-D.js";import"./AbstractModalHeader-D-9_aU29.js";import"./index-DbHCV3Bk.js";const N=6,$=({data:p,isAuthenticated:x})=>{const[L,u]=d.useState({}),[c,g]=d.useState(p||[]);d.useEffect(()=>{g(p||[])},[p]);const h="/img/logo/main_2.png",y=()=>{I.fire({title:"",html:`
            <div style="text-align: center; padding: 20px;">
                <p style="margin-bottom: 20px; color: #000; font-size: 16px; font-weight: 600;">
                    Join thousands of entrepreneurs accessing exclusive features
                </p>

                <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px; margin: 0 auto;">
                    <a href="/auth/redirect/google"
                       style="display: flex; align-items: center; justify-content: center; gap: 12px;
                              padding: 12px 20px; background: #000; color: white; text-decoration: none;
                              border-radius: 9999px; font-weight: 500; font-size: 14px; transition: all 0.15s ease;"
                       onmouseover="this.style.background='#333'"
                       onmouseout="this.style.background='#000'">
                        <img src="https://developers.google.com/identity/images/g-logo.png"
                             width="18" height="18" style="background: white; padding: 2px; border-radius: 3px;">
                        Continue with Google
                    </a>

                    <a href="/auth/redirect/linkedin-openid"
                       style="display: flex; align-items: center; justify-content: center; gap: 12px;
                              padding: 12px 20px; border: 1px solid #e5e5e7; background: #fff; color: #000; text-decoration: none;
                              border-radius: 9999px; font-weight: 500; font-size: 14px; transition: all 0.15s ease;"
                       onmouseover="this.style.borderColor='#000'; this.style.background='#000'; this.style.color='#fff'"
                       onmouseout="this.style.borderColor='#e5e5e7'; this.style.background='#fff'; this.style.color='#000'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Continue with LinkedIn
                    </a>

                    <div style="margin: 12px 0; color: #86868b; font-size: 13px; font-weight: 400;">or use email</div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <a href="/login"
                           style="display: flex; align-items: center; justify-content: center;
                                  padding: 10px 16px; background: transparent; color: #000; text-decoration: none;
                                  border: 1px solid #e5e5e5; border-radius: 9999px; font-weight: 500; font-size: 13px; transition: all 0.15s ease;"
                           onmouseover="this.style.borderColor='#000'; this.style.backgroundColor='#000'; this.style.color='#fff'"
                           onmouseout="this.style.borderColor='#e5e5e5'; this.style.backgroundColor='transparent'; this.style.color='#000'">
                            Login
                        </a>

                        <a href="/register"
                           style="display: flex; align-items: center; justify-content: center;
                                  padding: 10px 16px; background: #000; color: white; text-decoration: none;
                                  border-radius: 9999px; font-weight: 500; font-size: 13px; transition: all 0.15s ease;"
                           onmouseover="this.style.background='#333'"
                           onmouseout="this.style.background='#000'">
                            Sign Up
                        </a>
                    </div>
                </div>

                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #f0f0f0;">
                    <p style="color: #86868b; font-size: 11px; margin: 0;">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        `,showConfirmButton:!1,showCloseButton:!0,width:"420px",padding:"0",background:"white",customClass:{popup:"auth-modal-popup",closeButton:"auth-modal-close"}})},b=async e=>{if(!x){e.preventDefault(),y();return}const o=e.currentTarget,a=Number(o.dataset.id);let l;g(r=>(l=r,r.map(n=>n.id===a?{...n,is_bookmarked:n.is_bookmarked===1?0:1}:n)));const s=await B(o);if(!s||!s.ok){if(s!=null&&s.quota)try{o.animate([{transform:"translateX(0)"},{transform:"translateX(-4px)"},{transform:"translateX(4px)"},{transform:"translateX(-3px)"},{transform:"translateX(3px)"},{transform:"translateX(0)"}],{duration:320,easing:"ease-in-out"})}catch{}g(l);return}const i=s.action==="added"?1:0;g(r=>r.map(n=>n.id===a?{...n,is_bookmarked:i}:n))},f=e=>{e.target.src=h};d.useEffect(()=>{u({})},[p]),d.useEffect(()=>{let e,o;const a=()=>{e&&e.disconnect(),e=new IntersectionObserver(s=>{s.forEach(i=>{if(i.isIntersecting){const r=i.target,n=r.dataset.src;n&&(r.src.includes("data:image")||r.src.includes("R0lGODlh"))&&(r.src=n,r.onload=()=>{r.classList.remove("lazy-load");const w=r.dataset.id;u(z=>({...z,[w]:!0}))},r.onerror=f),e.unobserve(r)}})},{rootMargin:"200px"}),document.querySelectorAll(".lazy-load").forEach(s=>{!s.src.includes("data:image")&&!s.src.includes("R0lGODlh")&&(s.src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"),e.observe(s)})};return o=setTimeout(()=>{a()},100),()=>{o&&clearTimeout(o),e&&e.disconnect()}},[p]);const A=e=>e&&typeof e=="string"&&e.trim()!=="";function v(e){return!e||typeof e!="string"?"":e.split(",").map((a,l)=>{let r=a.trim().split(/[\s_-]+/).map(n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()).join(" ");return t.jsx("span",{style:{display:"inline-block",padding:"2px 10px",borderRadius:"9999px",background:"#f5f5f7",fontSize:"11px",fontWeight:500,color:"#86868b",marginRight:"4px",marginBottom:"4px"},children:r},l)})}const k=(e,o=150)=>{const a=document.createElement("div");a.innerHTML=e;const l=a.textContent||a.innerText||"";return l.length>o?l.slice(0,o).trim()+"...":l},j=d.useCallback(e=>()=>{u(o=>({...o,[e]:!0}))},[]);return!c||c.length===0?t.jsx("div",{id:"results-container",children:t.jsxs("div",{className:"d-flex flex-column align-items-center justify-content-center",style:{padding:"64px 24px"},children:[t.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"48px",color:"#e5e5e5",marginBottom:"16px"},children:"search_off"}),t.jsx("h4",{style:{fontSize:"16px",fontWeight:600,color:"#000",marginBottom:"8px"},children:"No opportunities found"}),t.jsx("p",{style:{fontSize:"13px",color:"#86868b",margin:0,textAlign:"center"},children:"Try adjusting your filters or search keywords."})]})}):t.jsx("div",{id:"results-container",children:c==null?void 0:c.map((e,o)=>{const a=e.cover_img&&A(e.cover_img),l=`img-${e.id}-${o}`,s=(o+1)%N===0&&o!==c.length-1;return t.jsxs(d.Fragment,{children:[t.jsx("div",{style:{padding:"16px 0",borderBottom:"1px solid #f0f0f0",transition:"background-color 0.15s ease"},children:t.jsxs("div",{className:"d-flex align-items-start gap-3",children:[a&&t.jsx("div",{style:{flexShrink:0},children:t.jsx(C,{src:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7","data-src":`${"https://edatsu-media-storage.edatsu.com".replace(/\/$/,"")}/uploads/opp/${e.cover_img}`,"data-id":l,alt:`Cover image for ${e.title}`,className:"lazy-load",onError:f,onLoad:j(l),style:{width:"72px",height:"72px",objectFit:"cover",borderRadius:"12px",border:"1px solid #f0f0f0"}})}),t.jsxs("div",{className:"flex-grow-1",style:{minWidth:0},children:[t.jsxs("div",{className:"d-flex align-items-center gap-2 mb-1",children:[t.jsx("a",{target:"_blank",href:m("op",e.slug,e.id),style:{textDecoration:"none",color:"#000",fontSize:"14px",fontWeight:600,lineHeight:1.3,transition:"color 0.15s ease"},onMouseEnter:i=>i.currentTarget.style.color="#86868b",onMouseLeave:i=>i.currentTarget.style.color="#000",children:e.title}),e.is_trending&&t.jsx("span",{style:{display:"inline-flex",alignItems:"center",gap:"2px",padding:"2px 8px",borderRadius:"9999px",background:"#000",color:"#fff",fontSize:"10px",fontWeight:500,flexShrink:0},children:"Trending"})]}),e.continent_name&&t.jsx("div",{className:"mb-1",children:v(e.continent_name)}),t.jsx("p",{className:"d-none d-sm-block",style:{fontSize:"13px",color:"#86868b",lineHeight:1.5,margin:"4px 0"},children:k(e.description,150)}),t.jsxs("div",{className:"d-flex justify-content-between align-items-center mt-1",children:[t.jsx("span",{style:{fontSize:"12px",fontWeight:600,color:"#000"},children:S(e.deadline)}),t.jsxs("div",{className:"d-flex align-items-center gap-2",children:[t.jsx(E,{title:e.title,id:e.id,type:"opp",variant:"icon"}),t.jsx("button",{className:"btn p-0","data-id":e.id,"data-title":e.title,"data-type":"opp","data-url":m("op",e.id,e.slug),onClick:b,style:{display:"flex",alignItems:"center",justifyContent:"center",width:"32px",height:"32px",borderRadius:"50%",border:"none",background:"transparent",cursor:"pointer",transition:"background 0.15s ease"},onMouseEnter:i=>{i.currentTarget.style.background="#f5f5f7"},onMouseLeave:i=>{i.currentTarget.style.background="transparent"},children:t.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"18px",fontVariationSettings:'"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',color:e.is_bookmarked===1?"#f97316":"#86868b",transition:"color 0.15s ease"},children:"bookmark"})})]})]})]})]})}),s&&t.jsx("div",{style:{padding:"16px 0",borderBottom:"1px solid #f0f0f0"},children:t.jsx(_,{slot:"opportunities_in_feed",page:"opportunities",position:"in-feed",size:"responsive"})})]},`${e.id}-${o}`)})})};export{$ as default};
