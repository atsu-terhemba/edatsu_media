import{r as b,j as e,M as G,h}from"./app-Ce1wRW_P.js";import{A as q}from"./AuthenticatedLayout-BzYDZ2nw.js";import V from"./SideNav-0yu-ilOA.js";import{C,B as o}from"./Header-D-DQt1ob.js";import{R as f}from"./Row-Bz-tL_UQ.js";import{C as a}from"./Col-boc2QWvH.js";import{B as l}from"./Button-f38eQ9-s.js";import{D as H}from"./download-D7apkG1c.js";import{c as j}from"./createLucideIcon-Cp3xJKNw.js";import{U as D,A as J}from"./users-fXbEWeTY.js";import{S as U}from"./smartphone-BADysySl.js";import{C as c}from"./Card-B7AWYQmG.js";import{F as y}from"./Form-CYJmD6XX.js";import{I as W,E as Y}from"./eye-U1diPTdY.js";import{S as K}from"./search-Ds6yWqZt.js";import{T as Q}from"./Table-Z9E9Jxe0.js";import{O as x,T as p,P as M}from"./Pagination-D2bf0dyk.js";import{S as X}from"./square-pen-DHf30Y-Q.js";import{T as Z}from"./trash-2-COAfAOOv.js";import{G as ee}from"./globe-DEy7_U3v.js";import"./ListGroup-CmYmyDH7.js";import"./ThemeProvider-Bcr76Ruy.js";import"./warning-DRLFsuAS.js";import"./Nav-EVPSTXpp.js";import"./useMergedRefs-mYwwFseH.js";import"./Button-Cmwx1V_1.js";import"./sweetalert2.esm.all-B0Dix5B2.js";import"./AbstractModalHeader-CsHbDvL7.js";import"./index-DEZTHdU3.js";import"./ElementChildren-BLxET22n.js";import"./useWillUnmount-ms5Iqo_-.js";/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]],ae=j("mail",se);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],A=j("monitor",re);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",ry:"2",key:"76otgf"}],["line",{x1:"12",x2:"12.01",y1:"18",y2:"18",key:"1dp563"}]],ie=j("tablet",te);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]],le=j("wifi",ne);function Oe({users:r,statistics:d,filters:v}){const[g,N]=b.useState(v.search||""),[w,T]=b.useState(v.per_page||10),[_,t]=b.useState(!1),I=s=>{s.preventDefault(),t(!0),h.get(route("admin.users"),{search:g,per_page:w},{preserveState:!0,onFinish:()=>t(!1)})},L=s=>{T(s),t(!0),h.get(route("admin.users"),{search:g,per_page:s},{preserveState:!0,onFinish:()=>t(!1)})},B=()=>{N(""),t(!0),h.get(route("admin.users"),{},{preserveState:!0,onFinish:()=>t(!1)})},E=s=>{switch(s){case"mobile":return e.jsx(U,{size:16});case"tablet":return e.jsx(ie,{size:16});case"desktop":default:return e.jsx(A,{size:16})}},F=s=>e.jsx(ee,{size:14}),O=(s,n)=>{if(n)return e.jsxs(o,{bg:"success",className:"d-flex align-items-center gap-1",children:[e.jsx(le,{size:12}),"Online"]});if(!s)return e.jsx(o,{bg:"secondary",children:"Never"});const u=new Date(s),i=Math.floor((new Date-u)/(1e3*60));return i<60?e.jsxs(o,{bg:"warning",children:[i,"m ago"]}):i<1440?e.jsxs(o,{bg:"info",children:[Math.floor(i/60),"h ago"]}):e.jsxs(o,{bg:"secondary",children:[Math.floor(i/1440),"d ago"]})},k=s=>s.is_online&&s.last_seen_at&&new Date-new Date(s.last_seen_at)<5*60*1e3,S=s=>new Date(s).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),P=s=>s.split(" ").map(n=>n.charAt(0)).join("").toUpperCase().slice(0,2),$=s=>{switch(s){case"admin":return"danger";case"subscriber":return"primary";default:return"secondary"}},m=({icon:s,title:n,value:u,color:z,subtitle:i})=>e.jsx(c,{className:"stat-card h-100 border-0 shadow-sm",children:e.jsx(c.Body,{className:"p-4",children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:`stat-icon bg-${z} me-3`,children:e.jsx(s,{size:20,color:"white"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"stat-number mb-0",children:u.toLocaleString()}),e.jsx("h6",{className:"stat-title mb-0",children:n}),i&&e.jsx("small",{className:"text-muted",children:i})]})]})})}),R=()=>!r.links||r.links.length<=3?null:e.jsxs("div",{className:"d-flex justify-content-between align-items-center mt-4",children:[e.jsxs("div",{className:"text-muted",children:["Showing ",r.from," to ",r.to," of ",r.total," results"]}),e.jsx(M,{className:"mb-0",children:r.links.map((s,n)=>e.jsx(M.Item,{active:s.active,disabled:!s.url,onClick:()=>{s.url&&(t(!0),h.get(s.url,{},{preserveState:!0,onFinish:()=>t(!1)}))},children:e.jsx("span",{dangerouslySetInnerHTML:{__html:s.label}})},n))})]});return e.jsxs(q,{children:[e.jsx(G,{title:"All Users - Admin"}),e.jsx("div",{className:"users-page",children:e.jsx(C,{fluid:!0,children:e.jsx(C,{children:e.jsxs(f,{children:[e.jsx(a,{sm:3,children:e.jsx("div",{className:"my-3 fs-9",children:e.jsx(V,{})})}),e.jsx(a,{sm:9,children:e.jsxs("div",{className:"my-3",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"poppins-bold mb-2",children:"All Users"}),e.jsx("p",{className:"text-muted",children:"Manage and monitor all platform users"})]}),e.jsxs("div",{className:"d-flex gap-2",children:[e.jsxs(l,{variant:"outline-success",size:"sm",children:[e.jsx(H,{size:16,className:"me-1"}),"Export"]}),e.jsxs(l,{variant:"primary",size:"sm",children:[e.jsx(ae,{size:16,className:"me-1"}),"Bulk Email"]})]})]}),e.jsxs(f,{className:"mb-4",children:[e.jsx(a,{lg:3,md:6,className:"mb-3",children:e.jsx(m,{icon:D,title:"Total Users",value:d.total_users,color:"primary",subtitle:"All registered users"})}),e.jsx(a,{lg:3,md:6,className:"mb-3",children:e.jsx(m,{icon:J,title:"Online Now",value:d.online_users,color:"success",subtitle:"Currently active"})}),e.jsx(a,{lg:3,md:6,className:"mb-3",children:e.jsx(m,{icon:U,title:"Mobile Users",value:d.mobile_users,color:"info",subtitle:"Online via mobile"})}),e.jsx(a,{lg:3,md:6,className:"mb-3",children:e.jsx(m,{icon:A,title:"Desktop Users",value:d.desktop_users,color:"warning",subtitle:"Online via desktop"})})]}),e.jsx(c,{className:"border-0 shadow-sm mb-4",children:e.jsx(c.Body,{children:e.jsxs(f,{className:"align-items-end",children:[e.jsx(a,{md:6,children:e.jsx(y,{onSubmit:I,children:e.jsxs(W,{children:[e.jsx(y.Control,{type:"text",placeholder:"Search by name, email, or role...",value:g,onChange:s=>N(s.target.value)}),e.jsx(l,{variant:"outline-primary",type:"submit",disabled:_,children:e.jsx(K,{size:16})})]})})}),e.jsx(a,{md:3,children:e.jsxs(y.Select,{value:w,onChange:s=>L(s.target.value),children:[e.jsx("option",{value:"10",children:"10 per page"}),e.jsx("option",{value:"25",children:"25 per page"}),e.jsx("option",{value:"50",children:"50 per page"}),e.jsx("option",{value:"100",children:"100 per page"})]})}),e.jsx(a,{md:3,children:e.jsx("div",{className:"d-flex gap-2",children:e.jsx(l,{variant:"outline-secondary",onClick:B,size:"sm",children:"Clear Filters"})})})]})})}),e.jsx(c,{className:"border-0 shadow-sm",children:e.jsx(c.Body,{className:"p-0",children:e.jsx("div",{className:"table-responsive",children:e.jsxs(Q,{className:"table-hover mb-0",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"border-0 text-muted fw-normal px-4 py-3",children:"User"}),e.jsx("th",{className:"border-0 text-muted fw-normal py-3",children:"Email"}),e.jsx("th",{className:"border-0 text-muted fw-normal py-3",children:"Status"}),e.jsx("th",{className:"border-0 text-muted fw-normal py-3",children:"Device"}),e.jsx("th",{className:"border-0 text-muted fw-normal py-3",children:"Last Seen"}),e.jsx("th",{className:"border-0 text-muted fw-normal py-3",children:"Role"}),e.jsx("th",{className:"border-0 text-muted fw-normal py-3",children:"Actions"})]})}),e.jsx("tbody",{children:_?e.jsx("tr",{children:e.jsx("td",{colSpan:"7",className:"text-center py-5",children:e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})})}):r.data.length>0?r.data.map(s=>e.jsxs("tr",{children:[e.jsx("td",{className:"border-0 px-4 py-3",children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsxs("div",{className:`user-avatar me-3 ${k(s)?"online":""}`,children:[P(s.name),k(s)&&e.jsx("div",{className:"online-indicator"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"fw-medium",children:s.name}),e.jsxs("small",{className:"text-muted",children:["ID: ",s.id]})]})]})}),e.jsx("td",{className:"border-0 py-3",children:e.jsx("span",{className:"text-break",children:s.email})}),e.jsx("td",{className:"border-0 py-3",children:O(s.last_seen_at,s.is_online)}),e.jsx("td",{className:"border-0 py-3",children:s.device_type?e.jsx(x,{placement:"top",overlay:e.jsx(p,{children:s.device_name||`${s.operating_system} - ${s.browser}`}),children:e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[E(s.device_type),e.jsx("small",{className:"text-muted",children:s.operating_system}),F(s.browser)]})}):e.jsx("span",{className:"text-muted",children:"-"})}),e.jsx("td",{className:"border-0 py-3",children:e.jsxs("div",{children:[e.jsx("div",{className:"small",children:s.last_seen_at?S(s.last_seen_at):"Never"}),e.jsxs("small",{className:"text-muted",children:["Joined: ",S(s.created_at)]})]})}),e.jsx("td",{className:"border-0 py-3",children:e.jsx(o,{bg:$(s.role),children:s.role.charAt(0).toUpperCase()+s.role.slice(1)})}),e.jsx("td",{className:"border-0 py-3",children:e.jsxs("div",{className:"d-flex gap-1",children:[e.jsx(x,{placement:"top",overlay:e.jsx(p,{children:"View Details"}),children:e.jsx(l,{variant:"outline-primary",size:"sm",children:e.jsx(Y,{size:14})})}),e.jsx(x,{placement:"top",overlay:e.jsx(p,{children:"Edit User"}),children:e.jsx(l,{variant:"outline-secondary",size:"sm",children:e.jsx(X,{size:14})})}),e.jsx(x,{placement:"top",overlay:e.jsx(p,{children:"Delete User"}),children:e.jsx(l,{variant:"outline-danger",size:"sm",children:e.jsx(Z,{size:14})})})]})})]},s.id)):e.jsx("tr",{children:e.jsx("td",{colSpan:"7",className:"text-center py-5",children:e.jsxs("div",{className:"text-muted",children:[e.jsx(D,{size:48,className:"mb-3 opacity-50"}),e.jsx("h5",{children:"No users found"}),e.jsx("p",{children:"Try adjusting your search criteria."})]})})})})]})})})}),R()]})})]})})})}),e.jsx("style",{jsx:!0,children:`
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 0.875rem;
                    position: relative;
                }
                
                .user-avatar.online {
                    border: 2px solid #48bb78;
                }
                
                .online-indicator {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 12px;
                    height: 12px;
                    background: #48bb78;
                    border: 2px solid white;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(72, 187, 120, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
                    }
                }
                
                .stat-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
                }
                
                .stat-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .stat-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #2d3748;
                    line-height: 1;
                }
                
                .stat-title {
                    color: #4a5568;
                    font-weight: 600;
                    font-size: 0.875rem;
                }
                
                .table th {
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 500;
                }
                
                .table td {
                    vertical-align: middle;
                }
                
                .text-break {
                    word-break: break-word;
                }
                
                .pagination .page-item .page-link {
                    border: none;
                    color: #667eea;
                    font-weight: 500;
                }
                
                .pagination .page-item.active .page-link {
                    background-color: #667eea;
                    border-color: #667eea;
                }
                
                .pagination .page-item:hover .page-link {
                    background-color: #f8f9fa;
                    color: #5a67d8;
                }
                
                .device-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .badge {
                    font-size: 0.75rem;
                }
            `})]})}export{Oe as default};
