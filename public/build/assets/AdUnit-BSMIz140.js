import{S as t}from"./sweetalert2.esm.all-B0Dix5B2.js";import{b as N,r as m,j as d}from"./app-D5dNj94v.js";const x=(a={})=>{const{title:u="Subscribe",description:p="Get the latest updates delivered to your inbox",emailPlaceholder:o="Enter your email",successTitle:n="Successfully Subscribed!",successMessage:s="You'll receive the latest updates directly in your inbox.",submitButtonText:c="Subscribe Now",loadingText:g="Subscribing...",modalClass:w="subscription-modal-popup",endpoint:v="/subscribe",subscriptionType:S=null}=a;t.fire({title:"",html:`
            <div style="text-align: center; padding: 20px;">
                <h3 style="font-weight: bold; margin-bottom: 0.5rem; color: #1f2937; font-size: 1.25rem;">${u}</h3>
                <p style="margin-bottom: 20px; color: #6b7280; font-size: 14px; line-height: 1.4;">
                    ${p}
                </p>
                            
                <form id="subscription-form" style="display: flex; flex-direction: column; gap: 12px; max-width: 320px; margin: 0 auto;">
                    <input type="text" id="firstName" name="firstName" placeholder="First name" required
                           style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                           onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                    
                    <input type="text" id="lastName" name="lastName" placeholder="Last name" required
                           style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                           onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                    
                    <input type="email" id="email" name="email" placeholder="${o}" required
                           style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                           onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                    
                    <button type="submit" id="subscribe-btn"
                            style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; border-radius: 8px; padding: 0.75rem 1.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
                        ${c}
                    </button>
                </form>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                        🔒 Your email is safe with us. No spam, unsubscribe anytime.
                    </p>
                </div>
            </div>
        `,showConfirmButton:!1,showCloseButton:!0,width:"480px",padding:"0",background:"white",customClass:{popup:w,closeButton:"subscription-modal-close"},didOpen:()=>{const C=document.getElementById("subscription-form"),l=document.getElementById("subscribe-btn");C.addEventListener("submit",async T=>{var f,h;T.preventDefault();const B=document.getElementById("firstName").value,E=document.getElementById("lastName").value,k=document.getElementById("email").value;l.disabled=!0,l.innerHTML=g;try{(await N.post(v,{first_name:B,last_name:E,email:k,subscription_type:S})).data.success&&(t.close(),t.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:4e3,timerProgressBar:!0,didOpen:b=>{b.addEventListener("mouseenter",t.stopTimer),b.addEventListener("mouseleave",t.resumeTimer)}}).fire({icon:"success",title:n,text:s}))}catch(e){console.error("Subscription error:",e);let r="An error occurred. Please try again.";if(e.response&&e.response.status===422){const i=e.response.data.errors;i&&(r=e.response.data.first_error||Object.values(i)[0][0])}else e.response&&e.response.status===409?r=e.response.data.message||"This email is already subscribed.":(h=(f=e.response)==null?void 0:f.data)!=null&&h.message&&(r=e.response.data.message);t.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:4e3,timerProgressBar:!0,didOpen:i=>{i.addEventListener("mouseenter",t.stopTimer),i.addEventListener("mouseleave",t.resumeTimer)}}).fire({icon:"error",title:"Subscription Failed",text:r}),l.disabled=!1,l.innerHTML=c}})}})},j=()=>{x({description:"Get the latest tools delivered to your inbox",successMessage:"You'll receive the latest tools and updates directly in your inbox.",modalClass:"subscription-modal-popup",subscriptionType:"tools"})},R=()=>{x({description:"Get opportunities delivered to your inbox",successTitle:"Subscribed!",successMessage:"You'll receive opportunities in your inbox",submitButtonText:"Subscribe",modalClass:"auth-modal-popup",subscriptionType:"opportunities"})},z="ca-pub-7365396698208751",y={horizontal:{slot:"7889919728",format:"auto",fullWidthResponsive:!0},infeed:{slot:"7226228488",format:"fluid",layoutKey:"-h6+1+2-i+l"},square:{slot:"1848837203",format:"auto",fullWidthResponsive:!0}};function I({type:a="horizontal",className:u="",style:p={}}){const o=m.useRef(null),n=m.useRef(!1),s=y[a]||y.horizontal;return m.useEffect(()=>{if(!n.current)try{o.current&&o.current.childElementCount===0&&((window.adsbygoogle=window.adsbygoogle||[]).push({}),n.current=!0)}catch{}},[]),d.jsxs("div",{className:u,style:{background:"#fafafa",border:"1px solid #f0f0f0",borderRadius:"12px",padding:"16px",textAlign:"center",overflow:"hidden",...p},children:[d.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",marginBottom:"8px"},children:d.jsx("span",{style:{fontSize:"10px",fontWeight:500,color:"#b0b0b0",textTransform:"uppercase",letterSpacing:"0.1em"},children:"Sponsored"})}),d.jsx("ins",{ref:o,className:"adsbygoogle",style:{display:"block",...a==="infeed"?{}:{}},"data-ad-client":z,"data-ad-slot":s.slot,"data-ad-format":s.format,...s.layoutKey?{"data-ad-layout-key":s.layoutKey}:{},...s.fullWidthResponsive?{"data-full-width-responsive":"true"}:{}})]})}export{I as A,j as a,R as s};
