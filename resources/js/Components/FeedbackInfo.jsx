import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { AuthContext } from "@/Layouts/GuestLayout";
import { useContext } from "react";

const FeedbackPanel = ({ isActive }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const authUser = useContext(AuthContext);

  
  useEffect(() => {
  // console.log(id)
  // Only proceed if the user is active
  // fix the feedback method to store the user id and check if it matches 
  // this is because ...
  // if(authUser){
  //   const {id, role} = authUser;
  //   if (id) {
      // Properly access cookies using document.cookie
      const hasClosed = document.cookie
        .split('; ')
        .find(row => row.startsWith('cls_feedback='));
      // If cookie doesn't exist or is not set to "true", show the feedback form
      if (!hasClosed || hasClosed.split('=')[1] !== "true") {
        setShowFeedbackForm(true);
      }
  //   }
  // }else{}
  }, []); // Add isActive as a dependency

  // Implement the hideFeedBackPanel function
  function hideFeedBackPanel() {
    // Set cookie to remember that user closed the feedback panel
    // Expires in 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    document.cookie = `cls_feedback=true; expires=${expiryDate.toUTCString()}; path=/`;
    
    // Hide the panel
    setShowFeedbackForm(false);
  }

  return (
    <>
      {showFeedbackForm && (
        <div className="px-3 py-3 border rounded position-relative">
          <div 
            style={{ width: 50 }} 
            className="px-3 py-2 position-absolute end-0 top-0 cursor-pointer" 
            onClick={hideFeedBackPanel}
          >
            <span className="material-symbols-outlined  align-middle mx-1 fw-bold text-danger">
              close
            </span>
          </div>
          <p className="poppins-semibold m-0 p-0 mb-2">
            Hi,
            <span className="material-symbols-outlined  align-middle mx-1">
              waving_hand
            </span>
          </p>
          <p className="p-0 m-0 fs-8 mb-2">
          Tell us what you love, what could be better, and any cool features you’d like to see. 
          Let’s make Edatsu Media even more awesome together!
          </p>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLScxI0lzMomnkHklK2Yi3i_9BsqK8BQcQ0Dt3JA-K6fruNsKSQ/viewform?usp=sf_link" 
            className=" border-0 btn btn-dark fs-8 px-4 text-decoration-none"
            target="_blank"
          >
            Feedback
          </a>
        </div>
      )}
    </>
  );
};

export default FeedbackPanel;