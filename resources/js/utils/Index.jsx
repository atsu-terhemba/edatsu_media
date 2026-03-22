import Swal from 'sweetalert2';
import axios from 'axios';

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export function truncateText(text, char) {
    if (text.length > 30) {
        const truncatedText = text.substring(0, char);
        return truncatedText + '...';
    } else {
        return text;
    }
}


export const swalConfig = {
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer:3000
 };
 

 export const getDaysLeft = (deadline) => {
    if (!deadline) return 'Unspecified';
  
    let diffDays;
  
    // Assuming deadline is in days or can be parsed as a date
    if (isNaN(deadline)) {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      const diffTime = deadlineDate - today;
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      diffDays = parseInt(deadline, 10);
    }
  
    if (diffDays <= 0) {
      return <span className="text-danger">Expired</span>;
    } else if (diffDays <= 7) {
      return <span className="text-danger">{diffDays} days left</span>;
    } else {
      return <span className="text-success">{diffDays} days left</span>;
    }
  };

  // Helper function to get days left as text (for conditional checks)
  export const getDaysLeftText = (deadline) => {
    if (!deadline) return 'Unspecified';
  
    let diffDays;
  
    // Assuming deadline is in days or can be parsed as a date
    if (isNaN(deadline)) {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      const diffTime = deadlineDate - today;
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      diffDays = parseInt(deadline, 10);
    }
  
    if (diffDays <= 0) {
      return 'Expired';
    } else if (diffDays <= 7) {
      return `${diffDays} days left`;
    } else {
      return `${diffDays} days left`;
    }
  };


  export function createSharingLinks(postId, postTitle) {
    const sluggedTitle = postTitle.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    
    // Determine the URL based on current path or context
    let postUrl;
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/product/') || currentPath.includes('/toolshed')) {
        // Tool/Product sharing
        postUrl = encodeURIComponent(`https://media.edatsu.com/product/${postId}/${sluggedTitle}`);
    } else {
        // Opportunity sharing (default)
        postUrl = encodeURIComponent(`https://media.edatsu.com/op/${postId}/${sluggedTitle}`);
    }

    const sharingPlatforms = [
        {
            name: 'WhatsApp',
            url: `https://api.whatsapp.com/send?text=${postUrl}`,
            icon: '/img/gif/icons8-whatsapp-50.png',
            color: '#25D366'
        },
        {
            name: 'Telegram',
            url: `https://t.me/share/url?url=${postUrl}`,
            icon: '/img/gif/icons8-telegram-50.png',
            color: '#0088cc'
        },
        {
            name: 'LinkedIn',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`,
            icon: '/img/gif/icons8-linkedin-50.png',
            color: '#0077b5'
        },
        {
            name: 'Twitter',
            url: `https://twitter.com/intent/tweet?url=${postUrl}`,
            icon: '/img/gif/icons8-twitter-50.png',
            color: '#1da1f2'
        },
        {
          name: 'Facebook',
          url: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
          icon: '/img/gif/icons8-facebook-50.png',
          color: '#1877f2'
      }
    ];
    
    const container = document.createElement('div');
    container.className = 'share-modal animate__animated animate__fadeInUp';
    container.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        border: 1px solid #e2e8f0;
        min-width: 280px;
        position: relative;
        z-index: 1050;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f1f5f9;
    `;
    
    const title = document.createElement('h6');
    title.textContent = 'Share this opportunity';
    title.style.cssText = `
        margin: 0;
        font-weight: 600;
        color: #1e293b;
        font-size: 14px;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 20px;
        color: #64748b;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
    `;
    closeBtn.onmouseover = () => {
        closeBtn.style.backgroundColor = '#f1f5f9';
        closeBtn.style.color = '#374151';
    };
    closeBtn.onmouseout = () => {
        closeBtn.style.backgroundColor = 'transparent';
        closeBtn.style.color = '#64748b';
    };
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        container.classList.remove('animate__fadeInUp');
        container.classList.add('animate__fadeOutDown');
        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.classList.add('d-none');
                container.remove();
                // Remove the click outside handler
                if (container._clickHandler) {
                    document.removeEventListener('click', container._clickHandler);
                }
            }
        }, 300);
    };
    
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Social platforms grid
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
        gap: 12px;
    `;

    sharingPlatforms.forEach((platform, index) => {
        const item = document.createElement('a');
        item.href = platform.url;
        item.target = '_blank';
        item.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            padding: 12px 8px;
            border-radius: 12px;
            transition: all 0.3s ease;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            animation-delay: ${index * 50}ms;
        `;
        item.className = 'animate__animated animate__zoomIn';
        
        item.onmouseover = () => {
            item.style.transform = 'translateY(-2px) scale(1.02)';
            item.style.boxShadow = `0 8px 25px ${platform.color}20`;
            item.style.borderColor = platform.color;
            item.style.backgroundColor = `${platform.color}08`;
        };
        item.onmouseout = () => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            item.style.borderColor = '#e2e8f0';
            item.style.backgroundColor = '#f8fafc';
        };

        const iconContainer = document.createElement('div');
        iconContainer.style.cssText = `
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 6px;
            background: ${platform.color}15;
        `;

        const icon = document.createElement('img');
        icon.src = platform.icon;
        icon.alt = platform.name.toLowerCase();
        icon.style.cssText = `
            width: 24px;
            height: 24px;
            object-fit: contain;
        `;

        const label = document.createElement('span');
        label.textContent = platform.name;
        label.style.cssText = `
            font-size: 11px;
            font-weight: 500;
            color: #374151;
            text-align: center;
            line-height: 1.2;
        `;

        iconContainer.appendChild(icon);
        item.appendChild(iconContainer);
        item.appendChild(label);
        grid.appendChild(item);
    });

    container.appendChild(header);
    container.appendChild(grid);

    // Add click outside handler
    setTimeout(() => {
        const handleClickOutside = (e) => {
            if (container.parentNode && !container.contains(e.target)) {
                // Find the share button that triggered this modal
                const shareButton = container.parentNode.nextElementSibling;
                if (shareButton && !shareButton.contains(e.target)) {
                    container.classList.remove('animate__fadeInUp');
                    container.classList.add('animate__fadeOutDown');
                    setTimeout(() => {
                        if (container.parentNode) {
                            container.parentNode.classList.add('d-none');
                            container.remove();
                            document.removeEventListener('click', handleClickOutside);
                        }
                    }, 300);
                }
            }
        };
        document.addEventListener('click', handleClickOutside);
        
        // Store the handler for cleanup
        container._clickHandler = handleClickOutside;
    }, 100);

    return container;
  }


    // Toggle share function with modern modal
   export const toggleShare = (obj) => {
      const title = obj.dataset.title;
      const id = obj.dataset.id;
      const sharingContainer = obj.previousElementSibling;
      
      // Check if modal is currently visible
      const isVisible = !sharingContainer.classList.contains('d-none');
      
      if (isVisible) {
        // Hide modal with animation
        const modal = sharingContainer.querySelector('.share-modal');
        if (modal) {
          modal.classList.remove('animate__fadeInUp');
          modal.classList.add('animate__fadeOutDown');
          setTimeout(() => {
            sharingContainer.classList.add('d-none');
            sharingContainer.innerHTML = '';
          }, 300);
        }
      } else {
        // Show modal with animation
        sharingContainer.classList.remove('d-none');
        sharingContainer.innerHTML = '';
        
        const sharingLinks = createSharingLinks(id, title);
        sharingContainer.appendChild(sharingLinks);
        
        // Add click outside functionality using a global listener
        const closeModal = () => {
          const modal = sharingContainer.querySelector('.share-modal');
          if (modal && !sharingContainer.classList.contains('d-none')) {
            modal.classList.remove('animate__fadeInUp');
            modal.classList.add('animate__fadeOutDown');
            setTimeout(() => {
              sharingContainer.classList.add('d-none');
              sharingContainer.innerHTML = '';
            }, 300);
          }
        };
        
        // Store the close function on the container for easy access
        sharingContainer._closeModal = closeModal;
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
          if (!sharingContainer.classList.contains('d-none')) {
            closeModal();
          }
        }, 10000);
      }
    };

  export function bookmark(obj){
    let id      = obj.dataset.id;
    let type    = obj.dataset.type;
    let url     = obj.dataset.url;
    
    axios.post('/bookmark',  {
      id: id,
      type: type,
      url: url
    })
    .then((d)=>{
        if(d?.data?.status == 'success'){
            Toast.fire({
            icon: "success",
            title: d?.data?.message
            }); 
        }else if(d?.data?.status == 'warning'){
            Toast.fire({
            icon: "warning",
            title: d?.data?.message
            }); 
        }else{
            Toast.fire({
            icon: "error",
            title:  d?.data?.message
            }); 
        }
    })
    .catch((error)=> {
        console.log('Bookmark error:', error);
        console.log('Error status:', error.response?.status);
        console.log('Error message:', error.response?.data?.message);
        
        // Handle authentication error - check multiple conditions
        if (error.response?.status === 401 || 
            error.response?.data?.message === "Unauthenticated." ||
            error.response?.data?.message?.toLowerCase().includes('unauthenticated') ||
            error.response?.statusText === 'Unauthorized') {
            showAuthModal();
        } else if (error.response?.status === 419) {
            // CSRF token mismatch - also require authentication
            showAuthModal();
        } else {
            Toast.fire({
                icon: "error",
                title: "Failed to bookmark. Please try again."
            });
        }
    });
}

// Function to show authentication modal
function showAuthModal() {
    Swal.fire({
        title: '',
        html: `
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
                                  border: 1px solid #e5e5e7; border-radius: 9999px; font-weight: 500; font-size: 13px; transition: all 0.15s ease;"
                           onmouseover="this.style.borderColor='#000'; this.style.backgroundColor='#000'; this.style.color='#fff'"
                           onmouseout="this.style.borderColor='#e5e5e7'; this.style.backgroundColor='transparent'; this.style.color='#000'">
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
        `,
        showConfirmButton: false,
        showCloseButton: true,
        width: '420px',
        padding: '0',
        background: 'white',
        customClass: {
            popup: 'auth-modal-popup',
            closeButton: 'auth-modal-close'
        }
    });
}

export const pageLink = (path, slug, id) => {
  return `/${path}/${id}/${slug}`;
};


export const renderLabels = (data, title) => {
  if (!data) return null;
  const items = data.split(',').map((item, index) => (
    <span key={index} className="data-labels poppins-regular text-secondary me-1">
      {item}
    </span>
  ));
  return items;
};

export function dateStringFormat(dateString) {
  const date = new Date(dateString);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}, ${month} ${year}`;
}


export function ActiveLink(path = '') {
  const currentUrl = new URL(window.location.href);
  const currentPath = currentUrl.pathname;
  if (path == currentPath) {
    return "active-link";
  }
}