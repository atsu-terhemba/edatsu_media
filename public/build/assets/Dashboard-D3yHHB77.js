import{r as k,j as e,M as B}from"./app-4wCrxnXP.js";import{A as I}from"./AuthenticatedLayout-kr1vtY-s.js";import T from"./SideNav-DlQLwWNj.js";import{C,a as _}from"./Header-DxZsnhO4.js";import{R as w,C as d}from"./Row-DPsvcYvS.js";import{U as S,A as q}from"./users-CUShLUDV.js";import{c as M}from"./createLucideIcon-Ce5412wp.js";import{C as r}from"./Card-DXXL6m_l.js";import{u as E,c as P}from"./Nav-CXQzwDUe.js";import{m as $}from"./ElementChildren-C9ATfWXE.js";import{T as D}from"./trending-up-DuQDZtVb.js";import"./ListGroup-DcTAeUm1.js";import"./index-CY6IMWrD.js";import"./index-CuXER6Vq.js";const U=1e3;function H(c,i,a){const t=(c-i)/(a-i)*100;return Math.round(t*U)/U}function A({min:c,now:i,max:a,label:t,visuallyHidden:N,striped:p,animated:u,className:g,style:b,variant:j,bsPrefix:n,...m},o){return e.jsx("div",{ref:o,...m,role:"progressbar",className:P(g,`${n}-bar`,{[`bg-${j}`]:j,[`${n}-bar-animated`]:u,[`${n}-bar-striped`]:u||p}),style:{width:`${H(i,c,a)}%`,...b},"aria-valuenow":i,"aria-valuemin":c,"aria-valuemax":a,children:N?e.jsx("span",{className:"visually-hidden",children:t}):t})}const R=k.forwardRef(({isChild:c=!1,...i},a)=>{const t={min:0,max:100,animated:!1,visuallyHidden:!1,striped:!1,...i};if(t.bsPrefix=E(t.bsPrefix,"progress"),c)return A(t,a);const{min:N,now:p,max:u,label:g,visuallyHidden:b,striped:j,animated:n,bsPrefix:m,variant:o,className:s,children:h,...x}=t;return e.jsx("div",{ref:a,...x,className:P(s,m),children:h?$(h,l=>k.cloneElement(l,{isChild:!0})):A({min:N,now:p,max:u,label:g,visuallyHidden:b,striped:j,animated:n,bsPrefix:m,variant:o},a)})});R.displayName="ProgressBar";/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],z=M("calendar",L);/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]],V=M("user-plus",O);function ie({total_events:c,total_oppty:i,total_users:a,total_admins:t,all_users_count:N,recent_users:p,weekly_users:u,daily_users:g,user_trend:b,recent_user_list:j}){const[n,m]=k.useState({total_users:0,total_events:0,total_oppty:0,recent_users:0});k.useEffect(()=>{const x=33.333333333333336,l={total_users:a,total_events:c,total_oppty:i,recent_users:p};let y=0;const v=setInterval(()=>{y++;const f=y/60;m({total_users:Math.floor(l.total_users*f),total_events:Math.floor(l.total_events*f),total_oppty:Math.floor(l.total_oppty*f),recent_users:Math.floor(l.recent_users*f)}),y>=60&&(clearInterval(v),m(l))},x);return()=>clearInterval(v)},[a,c,i,p]);const o=({icon:s,title:h,value:x,subtitle:l,color:y,trend:v,trendValue:f})=>e.jsx(r,{className:"stat-card h-100 border-0 shadow-sm",children:e.jsxs(r.Body,{className:"p-4",children:[e.jsxs("div",{className:"d-flex align-items-center justify-content-between mb-3",children:[e.jsx("div",{className:`stat-icon bg-${y}`,children:e.jsx(s,{size:24,color:"white"})}),v&&e.jsxs(_,{bg:v==="up"?"success":"danger",className:"d-flex align-items-center gap-1",children:[e.jsx(D,{size:12}),f,"%"]})]}),e.jsx("h2",{className:"stat-number mb-1",children:x.toLocaleString()}),e.jsx("h6",{className:"stat-title mb-2",children:h}),l&&e.jsx("small",{className:"text-muted",children:l})]})});return e.jsxs(I,{children:[e.jsx(B,{title:"Admin Dashboard"}),e.jsx(C,{fluid:!0,children:e.jsx(C,{children:e.jsxs(w,{children:[e.jsx(d,{sm:3,children:e.jsx("div",{className:"my-3 fs-9",children:e.jsx(T,{})})}),e.jsx(d,{sm:9,children:e.jsxs("div",{className:"my-3",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h1",{className:"poppins-bold mb-2",children:"Admin Dashboard"}),e.jsx("p",{className:"text-muted",children:"Overview of your platform's performance and user statistics"})]}),e.jsxs(w,{className:"mb-4",children:[e.jsx(d,{lg:3,md:6,className:"mb-3",children:e.jsx(o,{icon:S,title:"Total Users",value:n.total_users,subtitle:"Registered subscribers",color:"primary",trend:"up",trendValue:"12.5"})}),e.jsx(d,{lg:3,md:6,className:"mb-3",children:e.jsx(o,{icon:q,title:"Opportunities",value:n.total_oppty,subtitle:"Total opportunities posted",color:"success",trend:"up",trendValue:"8.3"})}),e.jsx(d,{lg:3,md:6,className:"mb-3",children:e.jsx(o,{icon:z,title:"Events",value:n.total_events,subtitle:"Total events created",color:"warning",trend:"up",trendValue:"15.2"})}),e.jsx(d,{lg:3,md:6,className:"mb-3",children:e.jsx(o,{icon:V,title:"New Users (30d)",value:n.recent_users,subtitle:"Recent registrations",color:"info",trend:"up",trendValue:"24.1"})})]}),e.jsxs(w,{className:"mb-4",children:[e.jsx(d,{lg:8,className:"mb-3",children:e.jsxs(r,{className:"h-100 border-0 shadow-sm",children:[e.jsxs(r.Header,{className:"bg-white border-0 pb-0",children:[e.jsx("h5",{className:"poppins-semibold mb-0",children:"User Registration Trend"}),e.jsx("small",{className:"text-muted",children:"Last 6 months"})]}),e.jsx(r.Body,{children:e.jsx("div",{className:"chart-container",children:b.map((s,h)=>e.jsxs("div",{className:"chart-bar-container mb-3",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-1",children:[e.jsx("small",{className:"text-muted",children:s.month}),e.jsx(_,{bg:"primary",children:s.count})]}),e.jsx(R,{now:s.count/Math.max(...b.map(x=>x.count))*100,className:"custom-progress",style:{height:"8px"}})]},h))})})]})}),e.jsx(d,{lg:4,className:"mb-3",children:e.jsxs(r,{className:"h-100 border-0 shadow-sm",children:[e.jsx(r.Header,{className:"bg-white border-0 pb-0",children:e.jsx("h5",{className:"poppins-semibold mb-0",children:"Quick Stats"})}),e.jsxs(r.Body,{children:[e.jsxs("div",{className:"quick-stat-item mb-3",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsx("span",{className:"text-muted",children:"Today"}),e.jsx("span",{className:"fw-bold text-success",children:g})]}),e.jsx("small",{className:"text-muted",children:"New registrations"})]}),e.jsxs("div",{className:"quick-stat-item mb-3",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsx("span",{className:"text-muted",children:"This Week"}),e.jsx("span",{className:"fw-bold text-info",children:u})]}),e.jsx("small",{className:"text-muted",children:"Weekly registrations"})]}),e.jsxs("div",{className:"quick-stat-item mb-3",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsx("span",{className:"text-muted",children:"Total Admins"}),e.jsx("span",{className:"fw-bold text-warning",children:t})]}),e.jsx("small",{className:"text-muted",children:"Platform administrators"})]}),e.jsxs("div",{className:"quick-stat-item",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsx("span",{className:"text-muted",children:"All Users"}),e.jsx("span",{className:"fw-bold text-primary",children:N})]}),e.jsx("small",{className:"text-muted",children:"Including admins"})]})]})]})})]}),e.jsx(w,{children:e.jsx(d,{children:e.jsxs(r,{className:"border-0 shadow-sm",children:[e.jsxs(r.Header,{className:"bg-white border-0 pb-0",children:[e.jsx("h5",{className:"poppins-semibold mb-0",children:"Recent Users"}),e.jsx("small",{className:"text-muted",children:"Latest registered subscribers"})]}),e.jsx(r.Body,{children:e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-hover",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"border-0 text-muted fw-normal",children:"Name"}),e.jsx("th",{className:"border-0 text-muted fw-normal",children:"Email"}),e.jsx("th",{className:"border-0 text-muted fw-normal",children:"Joined"}),e.jsx("th",{className:"border-0 text-muted fw-normal",children:"Status"})]})}),e.jsx("tbody",{children:j.map(s=>e.jsxs("tr",{children:[e.jsx("td",{className:"border-0",children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"user-avatar me-3",children:s.name.charAt(0).toUpperCase()}),e.jsx("span",{className:"fw-medium",children:s.name})]})}),e.jsx("td",{className:"border-0 text-muted",children:s.email}),e.jsx("td",{className:"border-0 text-muted",children:new Date(s.created_at).toLocaleDateString()}),e.jsx("td",{className:"border-0",children:e.jsx(_,{bg:"success",children:"Active"})})]},s.id))})]})})})]})})})]})})]})})}),e.jsx("style",{jsx:!0,children:`
                .stat-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border-radius: 12px !important;
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
                }
                
                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #2d3748;
                    line-height: 1;
                }
                
                .stat-title {
                    color: #4a5568;
                    font-weight: 600;
                }
                
                .chart-container {
                    padding: 1rem 0;
                }
                
                .chart-bar-container {
                    opacity: 0;
                    animation: fadeInUp 0.6s ease forwards;
                }
                
                .chart-bar-container:nth-child(1) { animation-delay: 0.1s; }
                .chart-bar-container:nth-child(2) { animation-delay: 0.2s; }
                .chart-bar-container:nth-child(3) { animation-delay: 0.3s; }
                .chart-bar-container:nth-child(4) { animation-delay: 0.4s; }
                .chart-bar-container:nth-child(5) { animation-delay: 0.5s; }
                .chart-bar-container:nth-child(6) { animation-delay: 0.6s; }
                
                .custom-progress .progress-bar {
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    border-radius: 4px;
                }
                
                .quick-stat-item {
                    padding: 0.75rem 0;
                    border-bottom: 1px solid #edf2f7;
                }
                
                .quick-stat-item:last-child {
                    border-bottom: none;
                }
                
                .user-avatar {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 0.875rem;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .table th {
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .table td {
                    vertical-align: middle;
                    padding: 1rem 0.75rem;
                }
                
                .card {
                    border-radius: 12px !important;
                }
                
                .bg-primary { background-color: #667eea !important; }
                .bg-success { background-color: #48bb78 !important; }
                .bg-warning { background-color: #ed8936 !important; }
                .bg-info { background-color: #4299e1 !important; }
            `})]})}export{ie as default};
