import{S as s}from"./sweetalert2.esm.all-B0Dix5B2.js";import{b as B}from"./app-DRfOvO_v.js";const d=(u={})=>{const{title:p="Subscribe",description:b="Get the latest updates delivered to your inbox",emailPlaceholder:c="Enter your email",successTitle:m="Successfully Subscribed!",successMessage:f="You'll receive the latest updates directly in your inbox.",submitButtonText:n="Subscribe Now",loadingText:h="Subscribing...",modalClass:y="subscription-modal-popup",endpoint:x="/subscribe",subscriptionType:g=null}=u;s.fire({title:"",html:`
            <div style="text-align: center; padding: 20px;">
                <h3 style="font-weight: bold; margin-bottom: 0.5rem; color: #1f2937; font-size: 1.25rem;">${p}</h3>
                <p style="margin-bottom: 20px; color: #6b7280; font-size: 14px; line-height: 1.4;">
                    ${b}
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
                        ${n}
                    </button>
                </form>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                        🔒 Your email is safe with us. No spam, unsubscribe anytime.
                    </p>
                </div>
            </div>
        `,showConfirmButton:!1,showCloseButton:!0,width:"480px",padding:"0",background:"white",customClass:{popup:y,closeButton:"subscription-modal-close"},didOpen:()=>{const w=document.getElementById("subscription-form"),r=document.getElementById("subscribe-btn");w.addEventListener("submit",async v=>{var a,l;v.preventDefault();const S=document.getElementById("firstName").value,C=document.getElementById("lastName").value,T=document.getElementById("email").value;r.disabled=!0,r.innerHTML=h;try{(await B.post(x,{first_name:S,last_name:C,email:T,subscription_type:g})).data.success&&(s.close(),s.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:4e3,timerProgressBar:!0,didOpen:i=>{i.addEventListener("mouseenter",s.stopTimer),i.addEventListener("mouseleave",s.resumeTimer)}}).fire({icon:"success",title:m,text:f}))}catch(e){console.error("Subscription error:",e);let t="An error occurred. Please try again.";if(e.response&&e.response.status===422){const o=e.response.data.errors;o&&(t=e.response.data.first_error||Object.values(o)[0][0])}else e.response&&e.response.status===409?t=e.response.data.message||"This email is already subscribed.":(l=(a=e.response)==null?void 0:a.data)!=null&&l.message&&(t=e.response.data.message);s.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:4e3,timerProgressBar:!0,didOpen:o=>{o.addEventListener("mouseenter",s.stopTimer),o.addEventListener("mouseleave",s.resumeTimer)}}).fire({icon:"error",title:"Subscription Failed",text:t}),r.disabled=!1,r.innerHTML=n}})}})},N=()=>{d({description:"Get the latest tools delivered to your inbox",successMessage:"You'll receive the latest tools and updates directly in your inbox.",modalClass:"subscription-modal-popup",subscriptionType:"tools"})},M=()=>{d({description:"Get opportunities delivered to your inbox",successTitle:"Subscribed!",successMessage:"You'll receive opportunities in your inbox",submitButtonText:"Subscribe",modalClass:"auth-modal-popup",subscriptionType:"opportunities"})};export{N as a,M as s};
