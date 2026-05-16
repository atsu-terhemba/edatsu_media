import{V as h,r as c,j as e,U as y}from"./app-B-zBJ31K.js";import{C as j}from"./Header-HBZBeILC.js";import{R as k,C as v}from"./Row-pctleOfC.js";import{A as S,G as w}from"./GuestLayout-BsTibeCd.js";import{M as z}from"./Metadata-DWUb2voi.js";import{F as C}from"./FixedMobileNav-DR_EVg2E.js";import{A as _}from"./ArticleReaderModal-BHGaACvC.js";import"./AbstractModalHeader-Cp2-iSKb.js";import"./index-DOP4ANon.js";import"./createLucideIcon-IQiHpfbW.js";import"./download-DIX1LCg1.js";const N=({thread:t,onReadArticle:n})=>{var r,a;return e.jsxs("div",{style:{backgroundColor:"#fff",borderRadius:"16px",border:"1px solid #f0f0f0",padding:"24px",marginBottom:"12px",transition:"box-shadow 0.15s ease"},onMouseEnter:o=>o.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.06)",onMouseLeave:o=>o.currentTarget.style.boxShadow="none",children:[((r=t.categories)==null?void 0:r.length)>0&&e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"10px"},children:t.categories.map(o=>e.jsx("span",{style:{fontSize:"11px",fontWeight:500,color:"#f97316",background:"#fff7ed",border:"1px solid #fed7aa",padding:"3px 10px",borderRadius:"9999px"},children:o.name},o.id))}),e.jsx(y,{href:`/forum/${t.id}`,style:{textDecoration:"none"},children:e.jsx("h3",{style:{fontSize:"15px",fontWeight:600,color:"#000",margin:"0 0 8px",lineHeight:1.4},children:t.title})}),t.body&&e.jsx("p",{style:{fontSize:"13px",color:"#86868b",lineHeight:1.5,margin:"0 0 12px"},children:t.body.length>180?t.body.slice(0,180)+"…":t.body}),t.article_link&&e.jsxs("button",{type:"button",onClick:o=>{o.preventDefault(),o.stopPropagation(),n==null||n({title:t.article_title||t.article_link,link:t.article_link})},style:{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"12px",color:"#86868b",textDecoration:"none",background:"#f5f5f7",padding:"6px 12px",borderRadius:"8px",marginBottom:"12px",border:"none",cursor:"pointer",fontFamily:"'Poppins', sans-serif"},onMouseEnter:o=>{o.currentTarget.style.background="#ececf1"},onMouseLeave:o=>{o.currentTarget.style.background="#f5f5f7"},children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"14px"},children:"link"}),t.article_source?`${t.article_source}: `:"",t.article_title||t.article_link]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px",fontSize:"12px",color:"#b0b0b5"},children:[e.jsx("span",{children:((a=t.user)==null?void 0:a.name)||"Anonymous"}),e.jsx("span",{children:"·"}),e.jsx("span",{children:t.created_at}),e.jsx("span",{children:"·"}),e.jsxs("span",{children:[t.posts_count," ",t.posts_count===1?"reply":"replies"]})]})]})},E=()=>{var m;const{threads:t=[],auth:n}=h().props,r=c.useContext(S),a=!!r||!!(n!=null&&n.user),o=((m=n==null?void 0:n.user)==null?void 0:m.id)??(r==null?void 0:r.id)??null,[u,d]=c.useState(null),[l,b]=c.useState("all"),p=o?t.filter(s=>{var i;return((i=s.user)==null?void 0:i.id)===o}).length:0,x=l==="mine"&&o?t.filter(s=>{var i;return((i=s.user)==null?void 0:i.id)===o}):l==="others"&&o?t.filter(s=>{var i;return((i=s.user)==null?void 0:i.id)!==o}):t,g=[{id:"all",label:"All discussions",shortLabel:"All",count:t.length},...a?[{id:"mine",label:"My discussions",shortLabel:"Mine",count:p},{id:"others",label:"Others",shortLabel:"Others",count:t.length-p}]:[]],f=l==="mine"?{title:"You haven't started any discussions yet",body:e.jsxs(e.Fragment,{children:["Head to ",e.jsx("a",{href:"/feeds",style:{color:"#f97316",textDecoration:"none"},children:"/feeds"})," and start one from an article."]})}:l==="others"?{title:"No other discussions yet",body:"When others start discussions, they will appear here."}:{title:"No discussions yet",body:e.jsxs(e.Fragment,{children:["Head to ",e.jsx("a",{href:"/feeds",style:{color:"#f97316",textDecoration:"none"},children:"/feeds"})," and start one from an article."]})};return e.jsxs(w,{children:[e.jsx(z,{title:"Forum",description:"Community discussions from articles you read"}),e.jsx("style",{children:`
                .forum-tabs {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 20px;
                    padding: 4px;
                    background: #fff;
                    border: 1px solid #f0f0f0;
                    border-radius: 9999px;
                    width: fit-content;
                    max-width: 100%;
                }
                .forum-tab {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 7px 16px;
                    border-radius: 9999px;
                    font-size: 13px;
                    font-weight: 500;
                    background: transparent;
                    color: #86868b;
                    border: none;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    font-family: 'Poppins', sans-serif;
                    white-space: nowrap;
                    min-width: 0;
                }
                .forum-tab.is-active {
                    background: #000;
                    color: #fff;
                }
                .forum-tab-label-short { display: none; }
                .forum-tab-count {
                    font-size: 11px;
                    font-weight: 600;
                    padding: 1px 8px;
                    border-radius: 9999px;
                    background: #f5f5f7;
                    color: #86868b;
                }
                .forum-tab.is-active .forum-tab-count {
                    background: rgba(255,255,255,0.18);
                    color: #fff;
                }
                @media (max-width: 575.98px) {
                    .forum-tabs {
                        width: 100%;
                        padding: 3px;
                        gap: 2px;
                    }
                    .forum-tab {
                        flex: 1 1 0;
                        padding: 9px 8px;
                        font-size: 12px;
                        gap: 5px;
                    }
                    .forum-tab-label-long { display: none; }
                    .forum-tab-label-short { display: inline; }
                    .forum-tab-count {
                        font-size: 10px;
                        padding: 1px 6px;
                    }
                }
            `}),e.jsx("section",{style:{background:"#f5f5f7",minHeight:"90vh",padding:"96px 0 120px"},children:e.jsx(j,{children:e.jsx(k,{className:"justify-content-center",children:e.jsxs(v,{lg:8,children:[e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsx("div",{style:{fontSize:"11px",fontWeight:600,color:"#f97316",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"6px"},children:"Community"}),e.jsx("div",{style:{width:"24px",height:"2px",background:"#f97316",marginBottom:"16px"}}),e.jsx("h1",{style:{fontSize:"32px",fontWeight:600,color:"#000",margin:"0 0 8px",fontFamily:"'Poppins', sans-serif"},children:"Forum"}),e.jsx("p",{style:{fontSize:"14px",color:"#86868b",margin:0,fontFamily:"'Poppins', sans-serif"},children:"Discussions sparked from articles. Start one from any feed."})]}),a&&e.jsx("div",{className:"forum-tabs",children:g.map(s=>{const i=l===s.id;return e.jsxs("button",{onClick:()=>b(s.id),className:`forum-tab${i?" is-active":""}`,children:[e.jsx("span",{className:"forum-tab-label-long",children:s.label}),e.jsx("span",{className:"forum-tab-label-short",children:s.shortLabel}),e.jsx("span",{className:"forum-tab-count",children:s.count})]},s.id)})}),x.length===0?e.jsxs("div",{style:{background:"#fff",borderRadius:"16px",border:"1px solid #f0f0f0",padding:"48px 24px",textAlign:"center"},children:[e.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"40px",color:"#b0b0b5",marginBottom:"12px",display:"block"},children:"chat_bubble"}),e.jsx("h3",{style:{fontSize:"15px",fontWeight:600,color:"#000",margin:"0 0 6px"},children:f.title}),e.jsx("p",{style:{fontSize:"13px",color:"#86868b",margin:0},children:f.body})]}):x.map(s=>e.jsx(N,{thread:s,onReadArticle:d},s.id))]})})})}),e.jsx(_,{article:u,onClose:()=>d(null),isAuthenticated:a}),e.jsx(C,{isAuthenticated:a})]})};export{E as default};
