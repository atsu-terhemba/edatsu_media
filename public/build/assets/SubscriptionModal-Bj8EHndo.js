import{S as s}from"./sweetalert2.esm.all-B0Dix5B2.js";import{b as T}from"./app-BEbjaJ0j.js";const B=(d={})=>{const{title:u="Subscribe",description:b="Get the latest updates delivered to your inbox",emailPlaceholder:p="Enter your email",successTitle:m="Successfully Subscribed!",successMessage:c="You'll receive the latest updates directly in your inbox.",submitButtonText:a="Subscribe Now",loadingText:f="Subscribing...",modalClass:h="subscription-modal-popup",endpoint:y="/subscribe",subscriptionType:x=null}=d;s.fire({title:"",html:`
            <div style="text-align: center; padding: 20px;">
                <h3 style="font-weight: bold; margin-bottom: 0.5rem; color: #1f2937; font-size: 1.25rem;">${u}</h3>
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
                    
                    <input type="email" id="email" name="email" placeholder="${p}" required
                           style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: #fafbfc; transition: all 0.2s ease;"
                           onfocus="this.style.borderColor='#3b82f6'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.08)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafbfc'; this.style.boxShadow='none'">
                    
                    <button type="submit" id="subscribe-btn"
                            style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border: none; border-radius: 8px; padding: 0.75rem 1.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(59, 130, 246, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
                        ${a}
                    </button>
                </form>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">
                        🔒 Your email is safe with us. No spam, unsubscribe anytime.
                    </p>
                </div>
            </div>
        `,showConfirmButton:!1,showCloseButton:!0,width:"480px",padding:"0",background:"white",customClass:{popup:h,closeButton:"subscription-modal-close"},didOpen:()=>{const g=document.getElementById("subscription-form"),r=document.getElementById("subscribe-btn");g.addEventListener("submit",async w=>{var n,l;w.preventDefault();const v=document.getElementById("firstName").value,C=document.getElementById("lastName").value,S=document.getElementById("email").value;r.disabled=!0,r.innerHTML=f;try{(await T.post(y,{first_name:v,last_name:C,email:S,subscription_type:x})).data.success&&(s.close(),s.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:4e3,timerProgressBar:!0,didOpen:i=>{i.addEventListener("mouseenter",s.stopTimer),i.addEventListener("mouseleave",s.resumeTimer)}}).fire({icon:"success",title:m,text:c}))}catch(e){console.error("Subscription error:",e);let t="An error occurred. Please try again.";if(e.response&&e.response.status===422){const o=e.response.data.errors;o&&(t=e.response.data.first_error||Object.values(o)[0][0])}else e.response&&e.response.status===409?t=e.response.data.message||"This email is already subscribed.":(l=(n=e.response)==null?void 0:n.data)!=null&&l.message&&(t=e.response.data.message);s.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:4e3,timerProgressBar:!0,didOpen:o=>{o.addEventListener("mouseenter",s.stopTimer),o.addEventListener("mouseleave",s.resumeTimer)}}).fire({icon:"error",title:"Subscription Failed",text:t}),r.disabled=!1,r.innerHTML=a}})}})},N=()=>{B({description:"Get the latest tools delivered to your inbox",successMessage:"You'll receive the latest tools and updates directly in your inbox.",modalClass:"subscription-modal-popup",subscriptionType:"tools"})};export{N as s};
