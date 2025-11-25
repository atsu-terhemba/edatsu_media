import{c as C}from"./createLucideIcon-Ce5412wp.js";import{S as r}from"./Header-DxZsnhO4.js";import{b as h}from"./app-4wCrxnXP.js";/**
 * @license lucide-react v0.484.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],E=C("funnel",B),k=(l={})=>{const{title:o="Subscribe",description:d="Get the latest updates delivered to your inbox",emailPlaceholder:c="Enter your email",successTitle:p="Successfully Subscribed!",successMessage:b="You'll receive the latest updates directly in your inbox.",submitButtonText:e="Subscribe Now",loadingText:s="Subscribing...",modalClass:i="subscription-modal-popup",endpoint:y="/subscribe"}=l;r.fire({title:"",html:`
            <div style="text-align: center; padding: 20px;">
                <h3 style="font-weight: bold; margin-bottom: 0.5rem; color: #1f2937; font-size: 1.25rem;">${o}</h3>
                <p style="margin-bottom: 20px; color: #6b7280; font-size: 14px; line-height: 1.4;">
                    ${d}
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
                    
                    <input type="email" id="email" name="email" placeholder="${c}" required
                           style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                           onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                    
                    <button type="submit" id="subscribe-btn"
                            style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; border-radius: 8px; padding: 0.75rem 1.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
                        ${e}
                    </button>
                </form>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                        🔒 Your email is safe with us. No spam, unsubscribe anytime.
                    </p>
                </div>
            </div>
        `,showConfirmButton:!1,showCloseButton:!0,width:"480px",padding:"0",background:"white",customClass:{popup:i,closeButton:"subscription-modal-close"},didOpen:()=>{const g=document.getElementById("subscription-form"),a=document.getElementById("subscribe-btn");g.addEventListener("submit",async x=>{var u,m;x.preventDefault();const w=document.getElementById("firstName").value,S=document.getElementById("lastName").value,v=document.getElementById("email").value;a.disabled=!0,a.innerHTML=s;try{(await h.post(y,{first_name:w,last_name:S,email:v})).data.success&&r.fire({title:p,text:b,icon:"success",confirmButtonText:"Great!",confirmButtonColor:"#3b82f6",buttonsStyling:!1,customClass:{popup:"compact-swal-popup",title:"compact-swal-title",content:"compact-swal-content",confirmButton:"compact-swal-button compact-swal-button-success"}})}catch(t){console.error("Subscription error:",t);let n="An error occurred. Please try again.";if(t.response&&t.response.status===422){const f=t.response.data.errors;f&&(n=t.response.data.first_error||Object.values(f)[0][0])}else t.response&&t.response.status===409?n=t.response.data.message||"This email is already subscribed.":(m=(u=t.response)==null?void 0:u.data)!=null&&m.message&&(n=t.response.data.message);r.fire({title:"Subscription Failed",text:n,icon:"error",confirmButtonText:"Try Again",confirmButtonColor:"#ef4444",buttonsStyling:!1,customClass:{popup:"compact-swal-popup",title:"compact-swal-title",content:"compact-swal-content",confirmButton:"compact-swal-button compact-swal-button-error"}}),a.disabled=!1,a.innerHTML=e}})}})},I=()=>{k({description:"Get the latest tools delivered to your inbox",successMessage:"You'll receive the latest tools and updates directly in your inbox.",modalClass:"subscription-modal-popup"})},M=()=>{r.fire({title:"",html:`
            <div style="text-align: center; padding: 20px;">
                <h3 style="font-weight: bold; margin-bottom: 0.5rem; color: #1f2937; font-size: 1.25rem;">Subscribe</h3>
                <p style="margin-bottom: 20px; color: #6b7280; font-size: 14px; line-height: 1.4;">
                    Get opportunities delivered to your inbox
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
                    
                    <input type="email" id="email" name="email" placeholder="your@email.com" required
                           style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                           onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                    
                    <button type="submit" id="subscribe-btn"
                            style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; border-radius: 8px; padding: 0.625rem 1rem; font-weight: 600; font-size: 0.875rem; transition: all 0.2s ease; cursor: pointer;"
                            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        Subscribe
                    </button>
                </form>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                        Secure •  Free Forever • Instant Access
                    </p>
                    <p style="color: #9ca3af; font-size: 11px; margin: 8px 0 0 0;">
                        By subscribing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        `,showConfirmButton:!1,showCloseButton:!0,width:"480px",padding:"0",background:"white",customClass:{popup:"auth-modal-popup",closeButton:"auth-modal-close"},didOpen:()=>{const l=document.getElementById("subscription-form"),o=document.getElementById("subscribe-btn");l.addEventListener("submit",async d=>{d.preventDefault();const c=document.getElementById("firstName").value,p=document.getElementById("lastName").value,b=document.getElementById("email").value;o.disabled=!0,o.innerHTML='<div style="display: flex; align-items: center; justify-content: center; gap: 8px;"><div style="width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>Subscribing...</div>';try{(await h.post("/subscribe",{first_name:c,last_name:p,email:b})).data.success&&r.fire({title:"Subscribed!",text:"You'll receive opportunities in your inbox",iconHtml:'<div style="width: 32px; height: 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold; margin: 0;">✓</div>',confirmButtonText:"Perfect!",confirmButtonColor:"#10b981",buttonsStyling:!1,customClass:{popup:"compact-swal-popup",title:"compact-swal-title",content:"compact-swal-content",confirmButton:"compact-swal-button"},timer:3e3,timerProgressBar:!0})}catch(e){console.error("Subscription error:",e);let s="Something went wrong. Please try again.";if(e.response&&e.response.status===422){const i=e.response.data.errors;i&&(s=e.response.data.first_error||Object.values(i)[0][0])}else e.response&&e.response.status===409?s=e.response.data.message||"This email is already subscribed.":e.response&&e.response.data&&e.response.data.message&&(s=e.response.data.message);r.fire({text:s,iconHtml:'<div style="width: 32px; height: 32px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold; margin: 0;">✕</div>',confirmButtonText:"Retry",confirmButtonColor:"#ef4444",buttonsStyling:!1,customClass:{popup:"compact-swal-popup",title:"compact-swal-title",content:"compact-swal-content",confirmButton:"compact-swal-button compact-swal-button-error"}}),o.disabled=!1,o.innerHTML="Subscribe"}})}})};export{E as F,I as a,M as s};
