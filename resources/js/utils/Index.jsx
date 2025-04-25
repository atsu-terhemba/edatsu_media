import Swal from 'sweetalert2';

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


  export function createSharingLinks(postId, postTitle) {
    const sluggedTitle = postTitle.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const postUrl = encodeURIComponent(`https://media.edatsu.com/op/${postId}/${sluggedTitle}`);

    const sharingPlatforms = [
        {
            name: 'WhatsApp',
            url: `https://api.whatsapp.com/send?text=${postUrl}`,
            icon: '/img/gif/icons8-whatsapp-50.png'
        },
        {
            name: 'Telegram',
            url: `https://t.me/share/url?url=${postUrl}`,
            icon: '/img/gif/icons8-telegram-50.png'
        },
        {
            name: 'LinkedIn',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`,
            icon: '/img/gif/icons8-linkedin-50.png'
        },
        {
            name: 'Twitter',
            url: `https://twitter.com/intent/tweet?url=${postUrl}`,
            icon: '/img/gif/icons8-twitter-50.png'
        },
        {
          name: 'Facebook',
          url: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
          icon: '/img/gif/icons8-facebook-50.png'
      }
    ];
    
      const ul = document.createElement('ul');
      sharingPlatforms.forEach(platform => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.className = 'text-decoration-none text-dark';
          a.href = platform.url;
          a.target = '_blank';

          const img = document.createElement('img');
          img.width = 30;
          img.src = platform.icon;
          img.alt = platform.name.toLowerCase();

          a.appendChild(img);
          a.appendChild(document.createTextNode(` ${platform.name}`));
          li.appendChild(a);
          ul.appendChild(li);
      });

      return ul;
  }


    // Toggle share function as provided
   export const toggleShare = (obj) => {
      const title = obj.dataset.title;
      const id = obj.dataset.id;
      obj.previousElementSibling.classList.toggle('d-none');
      const sharingLinksContainer = obj.previousElementSibling;
      sharingLinksContainer.innerHTML = '';
      const sharingLinks = createSharingLinks(id, title);
      sharingLinksContainer.appendChild(sharingLinks);
    };

  export function bookmark(obj){
    let id      = obj.dataset.id;
    let type    = obj.dataset.type;
    let url     = obj.dataset.url;
    axios.post('/bookmark-opportunity',  {
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
    .catch((e)=> console.log(e));
}

export const pageLink = (slug, id) => {
  return `/op/${id}/${slug}`;
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