import{r as p,j as e,M as $,U as P,h as x}from"./app-BBoIa_Yt.js";import{A as U}from"./AuthenticatedLayout-__BbqVS1.js";import H from"./SideNav-bB8GUjhF.js";import{C as M,I as O,B as Y}from"./Header-D_3UkLXk.js";import{R as u}from"./Row-BfSS8SHS.js";import{C as t}from"./Col-BicBp_ja.js";import{B as r}from"./Button-BcnVGAvM.js";import{D as G}from"./download-DU1IZN9S.js";import{P as w}from"./plus-CSh2nM_O.js";import{P as A}from"./package-8no-6Cow.js";import{T as K}from"./trending-up-DKtcJa-v.js";import{c as o}from"./createLucideIcon-RvaiaMyo.js";import{C as n}from"./Card-JA5avF0V.js";import{F as j}from"./Form-Ck0zorXy.js";import{I as J,S as Q,E as F}from"./search-DMwGW7ZD.js";import{O as g,T as v,P as L}from"./Pagination-DKtQbWJj.js";import{S as W}from"./square-pen-BPO1xD6z.js";import{T as X}from"./trash-2-BoIFsYUS.js";import"./ListGroup-F3VZ5v7E.js";import"./ThemeProvider-CX3OIfIx.js";import"./warning-xqPjWNas.js";import"./Nav-4fss9wif.js";import"./useMergedRefs-D6eVEGOV.js";import"./Button-CNfD2lw6.js";import"./sweetalert2.esm.all-B0Dix5B2.js";import"./AbstractModalHeader-UfYm0CTG.js";import"./index-Dir0O_cm.js";import"./ElementChildren-ytLIwyV3.js";import"./useWillUnmount-BBmbmA7X.js";/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],ee=o("chart-column",Z);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],te=o("external-link",se);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]],re=o("message-square",ae);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],le=o("rotate-ccw",ie);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],oe=o("star",ne);function qe({products:i,statistics:c,categories:ce,filters:f}){const[b,_]=p.useState(f.search||""),[N,D]=p.useState(f.per_page||12),[y,S]=p.useState(f.status||""),[k,l]=p.useState(!1),T=s=>{s.preventDefault(),l(!0),x.get(route("admin.all_products"),{search:b,per_page:N,status:y},{preserveState:!0,onFinish:()=>l(!1)})},z=(s,a)=>{l(!0);const h={search:b,per_page:N,status:y};h[s]=a,s==="status"?S(a):s==="per_page"&&D(a),x.get(route("admin.all_products"),h,{preserveState:!0,onFinish:()=>l(!1)})},B=()=>{_(""),S(""),l(!0),x.get(route("admin.all_products"),{},{preserveState:!0,onFinish:()=>l(!1)})},I=s=>new Date(s).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),V=s=>s>=1e6?(s/1e6).toFixed(1)+"M":s>=1e3?(s/1e3).toFixed(1)+"K":s,E=s=>s.deleted==1||s.deleted_at?"danger":"success",d=s=>s.deleted==1||s.deleted_at,m=({icon:s,title:a,value:h,color:R,subtitle:C,trend:de})=>e.jsx(n,{className:"stat-card h-100 border-0 shadow-sm",children:e.jsx(n.Body,{className:"p-4",children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:`stat-icon bg-${R} me-3`,children:e.jsx(s,{size:20,color:"white"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"stat-number mb-0",children:h.toLocaleString()}),e.jsx("h6",{className:"stat-title mb-0",children:a}),C&&e.jsx("small",{className:"text-muted",children:C})]})]})})}),q=()=>!i.links||i.links.length<=3?null:e.jsxs("div",{className:"d-flex justify-content-between align-items-center mt-4",children:[e.jsxs("div",{className:"text-muted",children:["Showing ",i.from," to ",i.to," of ",i.total," results"]}),e.jsx(L,{className:"mb-0",children:i.links.map((s,a)=>e.jsx(L.Item,{active:s.active,disabled:!s.url,onClick:()=>{s.url&&(l(!0),x.get(s.url,{},{preserveState:!0,onFinish:()=>l(!1)}))},children:e.jsx("span",{dangerouslySetInnerHTML:{__html:s.label}})},a))})]});return e.jsxs(U,{children:[e.jsx($,{title:"All Products - Admin"}),e.jsx("div",{className:"products-page",children:e.jsx(M,{fluid:!0,children:e.jsx(M,{children:e.jsxs(u,{children:[e.jsx(t,{sm:3,children:e.jsx("div",{className:"my-3 fs-9",children:e.jsx(H,{})})}),e.jsx(t,{sm:9,children:e.jsxs("div",{className:"my-3",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"poppins-bold mb-2",children:"All Products"}),e.jsx("p",{className:"text-muted",children:"Manage and monitor all products on the platform"})]}),e.jsxs("div",{className:"d-flex gap-2",children:[e.jsxs(r,{variant:"outline-success",size:"sm",children:[e.jsx(G,{size:16,className:"me-1"}),"Export"]}),e.jsxs(r,{variant:"primary",size:"sm",as:P,href:route("admin.products"),children:[e.jsx(w,{size:16,className:"me-1"}),"Add Product"]})]})]}),e.jsxs(u,{className:"mb-4",children:[e.jsx(t,{lg:3,md:6,className:"mb-3",children:e.jsx(m,{icon:A,title:"Total Products",value:c.total_products,color:"primary",subtitle:"All products (including deleted)"})}),e.jsx(t,{lg:3,md:6,className:"mb-3",children:e.jsx(m,{icon:K,title:"Active Products",value:c.active_products,color:"success",subtitle:"Currently published"})}),e.jsx(t,{lg:3,md:6,className:"mb-3",children:e.jsx(m,{icon:ee,title:"Total Views",value:c.total_views,color:"warning",subtitle:"All-time views"})}),e.jsx(t,{lg:3,md:6,className:"mb-3",children:e.jsx(m,{icon:w,title:"New (30d)",value:c.recent_products,color:"info",subtitle:"Recent additions"})})]}),e.jsx(n,{className:"border-0 shadow-sm mb-4",children:e.jsx(n.Body,{children:e.jsxs(u,{className:"align-items-end",children:[e.jsx(t,{md:4,children:e.jsx(j,{onSubmit:T,children:e.jsxs(J,{children:[e.jsx(j.Control,{type:"text",placeholder:"Search products...",value:b,onChange:s=>_(s.target.value)}),e.jsx(r,{variant:"outline-primary",type:"submit",disabled:k,children:e.jsx(Q,{size:16})})]})})}),e.jsx(t,{md:2,children:e.jsxs(j.Select,{value:y,onChange:s=>z("status",s.target.value),children:[e.jsx("option",{value:"",children:"All Status"}),e.jsx("option",{value:"active",children:"Active"}),e.jsx("option",{value:"deleted",children:"Deleted"})]})}),e.jsx(t,{md:2,children:e.jsxs(j.Select,{value:N,onChange:s=>z("per_page",s.target.value),children:[e.jsx("option",{value:"12",children:"12 per page"}),e.jsx("option",{value:"24",children:"24 per page"}),e.jsx("option",{value:"48",children:"48 per page"}),e.jsx("option",{value:"96",children:"96 per page"})]})}),e.jsx(t,{md:4,children:e.jsx("div",{className:"d-flex gap-2",children:e.jsx(r,{variant:"outline-secondary",onClick:B,size:"sm",children:"Clear Filters"})})})]})})}),k?e.jsx("div",{className:"text-center py-5",children:e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):i.data.length>0?e.jsx(u,{children:i.data.map(s=>e.jsx(t,{lg:4,md:6,className:"mb-4",children:e.jsxs(n,{className:"product-card h-100 border-0 shadow-sm",children:[e.jsxs("div",{className:"product-image-container",children:[e.jsx(O,{src:s.cover_img||"/img/default-product.jpg",alt:s.product_name,className:"product-image",onError:a=>{a.target.src="/img/default-product.jpg"}}),e.jsx("div",{className:"product-overlay",children:e.jsxs("div",{className:"product-actions",children:[e.jsx(g,{placement:"top",overlay:e.jsx(v,{children:"View Product"}),children:e.jsx(r,{variant:"light",size:"sm",className:"me-1",children:e.jsx(F,{size:14})})}),e.jsx(g,{placement:"top",overlay:e.jsx(v,{children:"Edit Product"}),children:e.jsx(r,{variant:"light",size:"sm",className:"me-1",children:e.jsx(W,{size:14})})}),s.source_url&&e.jsx(g,{placement:"top",overlay:e.jsx(v,{children:"Visit Source"}),children:e.jsx(r,{variant:"light",size:"sm",className:"me-1",onClick:()=>window.open(s.source_url,"_blank"),children:e.jsx(te,{size:14})})}),e.jsx(g,{placement:"top",overlay:e.jsx(v,{children:d(s)?"Restore":"Delete"}),children:e.jsx(r,{variant:d(s)?"warning":"danger",size:"sm",children:d(s)?e.jsx(le,{size:14}):e.jsx(X,{size:14})})})]})})]}),e.jsxs(n.Body,{className:"p-3",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-start mb-2",children:[e.jsx(Y,{bg:E(s),children:d(s)?"Deleted":"Active"}),e.jsxs("small",{className:"text-muted",children:["ID: ",s.id]})]}),e.jsx("h6",{className:"product-title mb-2",title:s.product_name,children:s.product_name}),e.jsx("p",{className:"product-description text-muted small mb-3",children:s.product_description?s.product_description.slice(0,100)+"...":"No description available"}),e.jsx("div",{className:"product-stats d-flex justify-content-between align-items-center mb-2",children:e.jsxs("div",{className:"d-flex gap-3",children:[e.jsxs("span",{className:"d-flex align-items-center gap-1 text-muted small",children:[e.jsx(F,{size:12}),V(s.views||0)]}),e.jsxs("span",{className:"d-flex align-items-center gap-1 text-muted small",children:[e.jsx(re,{size:12}),s.comments||0]}),e.jsxs("span",{className:"d-flex align-items-center gap-1 text-muted small",children:[e.jsx(oe,{size:12}),s.ratings||0]})]})}),e.jsxs("div",{className:"product-meta",children:[e.jsxs("small",{className:"text-muted",children:["Created: ",I(s.created_at)]}),s.user&&e.jsx("div",{children:e.jsxs("small",{className:"text-muted",children:["By: ",s.user.name]})})]})]})]})},s.id))}):e.jsx(n,{className:"border-0 shadow-sm",children:e.jsxs(n.Body,{className:"text-center py-5",children:[e.jsx(A,{size:48,className:"mb-3 opacity-50 text-muted"}),e.jsx("h5",{children:"No products found"}),e.jsx("p",{className:"text-muted",children:"Try adjusting your search criteria or add a new product."}),e.jsxs(r,{variant:"primary",as:P,href:route("admin.products"),children:[e.jsx(w,{size:16,className:"me-1"}),"Add New Product"]})]})}),q()]})})]})})})}),e.jsx("style",{jsx:!0,children:`
                .product-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    overflow: hidden;
                }
                
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
                }
                
                .product-image-container {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                }
                
                .product-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                
                .product-card:hover .product-image {
                    transform: scale(1.05);
                }
                
                .product-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .product-card:hover .product-overlay {
                    opacity: 1;
                }
                
                .product-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .product-title {
                    font-weight: 600;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    min-height: 2.6em;
                }
                
                .product-description {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    line-height: 1.4;
                    min-height: 4.2em;
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
            `})]})}export{qe as default};
