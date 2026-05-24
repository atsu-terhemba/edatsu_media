import{S as s,b as B}from"./app-Br0H0__a.js";const d=(u={})=>{const{title:p="Subscribe",description:c="Get the latest updates delivered to your inbox",emailPlaceholder:m="Enter your email",successTitle:b="Successfully Subscribed!",successMessage:f="You'll receive the latest updates directly in your inbox.",submitButtonText:n="Subscribe Now",loadingText:y="Subscribing...",modalClass:h="subscription-modal-popup",endpoint:g="/subscribe",subscriptionType:x=null}=u;s.fire({title:"",html:`
            <div style="text-align: center; padding: 20px;">
                <h3 style="font-weight: 600; margin-bottom: 0.5rem; color: #000; font-size: 1.25rem; font-family: 'Poppins', sans-serif;">${p}</h3>
                <p style="margin-bottom: 20px; color: #86868b; font-size: 14px; line-height: 1.4;">
                    ${c}
                </p>

                <form id="subscription-form" style="display: flex; flex-direction: column; gap: 12px; max-width: 320px; margin: 0 auto;">
                    <input type="text" id="firstName" name="firstName" placeholder="First name" required
                           style="border: 1px solid #e5e5e7; border-radius: 9999px; padding: 0.625rem 1rem; font-size: 0.875rem; background: #f5f5f7; transition: all 0.15s ease; font-family: 'Poppins', sans-serif;"
                           onfocus="this.style.borderColor='#000'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.05)'"
                           onblur="this.style.borderColor='#e5e5e7'; this.style.backgroundColor='#f5f5f7'; this.style.boxShadow='none'">

                    <input type="text" id="lastName" name="lastName" placeholder="Last name" required
                           style="border: 1px solid #e5e5e7; border-radius: 9999px; padding: 0.625rem 1rem; font-size: 0.875rem; background: #f5f5f7; transition: all 0.15s ease; font-family: 'Poppins', sans-serif;"
                           onfocus="this.style.borderColor='#000'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.05)'"
                           onblur="this.style.borderColor='#e5e5e7'; this.style.backgroundColor='#f5f5f7'; this.style.boxShadow='none'">

                    <input type="email" id="email" name="email" placeholder="${m}" required
                           style="border: 1px solid #e5e5e7; border-radius: 9999px; padding: 0.625rem 1rem; font-size: 0.875rem; background: #f5f5f7; transition: all 0.15s ease; font-family: 'Poppins', sans-serif;"
                           onfocus="this.style.borderColor='#000'; this.style.backgroundColor='white'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.05)'"
                           onblur="this.style.borderColor='#e5e5e7'; this.style.backgroundColor='#f5f5f7'; this.style.boxShadow='none'">

                    <button type="submit" id="subscribe-btn"
                            style="background: #000; color: white; border: none; border-radius: 9999px; padding: 0.75rem 1.5rem; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.15s ease; font-family: 'Poppins', sans-serif;"
                            onmouseover="this.style.background='#333'"
                            onmouseout="this.style.background='#000'">
                        ${n}
                    </button>
                </form>

                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #f0f0f0;">
                    <p style="color: #86868b; font-size: 11px; margin: 0;">
                        Your email is safe with us. No spam, unsubscribe anytime.
                    </p>
                </div>
            </div>
        `,showConfirmButton:!1,showCloseButton:!0,width:"480px",padding:"0",background:"white",customClass:{popup:h,closeButton:"subscription-modal-close"},didOpen:()=>{const w=document.getElementById("subscription-form"),r=document.getElementById("subscribe-btn");w.addEventListener("submit",async v=>{var a,l;v.preventDefault();const C=document.getElementById("firstName").value,S=document.getElementById("lastName").value,T=document.getElementById("email").value;r.disabled=!0,r.innerHTML=y;try{(await B.post(g,{first_name:C,last_name:S,email:T,subscription_type:x})).data.success&&(s.close(),s.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:4e3,timerProgressBar:!0,didOpen:i=>{i.addEventListener("mouseenter",s.stopTimer),i.addEventListener("mouseleave",s.resumeTimer)}}).fire({icon:"success",title:b,text:f}))}catch(e){console.error("Subscription error:",e);let t="An error occurred. Please try again.";if(e.response&&e.response.status===422){const o=e.response.data.errors;o&&(t=e.response.data.first_error||Object.values(o)[0][0])}else e.response&&e.response.status===409?t=e.response.data.message||"This email is already subscribed.":(l=(a=e.response)==null?void 0:a.data)!=null&&l.message&&(t=e.response.data.message);s.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:4e3,timerProgressBar:!0,didOpen:o=>{o.addEventListener("mouseenter",s.stopTimer),o.addEventListener("mouseleave",s.resumeTimer)}}).fire({icon:"error",title:"Subscription Failed",text:t}),r.disabled=!1,r.innerHTML=n}})}})},E=()=>{d({description:"Get the latest tools delivered to your inbox",successMessage:"You'll receive the latest tools and updates directly in your inbox.",modalClass:"subscription-modal-popup",subscriptionType:"tools"})},N=()=>{d({description:"Get opportunities delivered to your inbox",successTitle:"Subscribed!",successMessage:"You'll receive opportunities in your inbox",submitButtonText:"Subscribe",modalClass:"auth-modal-popup",subscriptionType:"opportunities"})};export{E as a,N as s};
