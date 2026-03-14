import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CommentComponent = ({ postId, totalComments, isAuthenticated, userId }) => {
  const [comments, setComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeReplyForm, setActiveReplyForm] = useState(null);
  const [total_comments, setTotalComments] = useState(totalComments);

  const Toast = Swal.mixin({
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

  // Load initial comments
  useEffect(() => {
    if (totalComments > 0) {
      loadComments();
    }
  }, []);

  // const loadComments = async (page) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`/comments/${postId}?page=${page}`);
  //       // If it's page 1, replace comments; otherwise append
  //       if (page === 1) {
  //         setComments(response.data.data);
  //       } else {
  //         setComments(prev => [...prev, ...response.data.data]);
  //       }
        
  //       setLastPage(response.data.last_page);
  //       setTotalComments(() => response.data.total);

  //       if(response.data.last_page > 1){
  //         setCurrentPage(page + 1);
  //       }
  //       //console.log(comments);
  //       console.log(currentPage)
  //       console.log(lastPage)
  //       //console.log(response.data.current_page);
  //       console.log(response);
  //       console.log(response.data.last_page);
  //   } catch (error) {
  //     Toast.fire({
  //       icon: "error",
  //       title: "Failed to load comments"
  //       }); 
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadComments = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`/comments/${postId}?page=${page}`);
      const { data, last_page, total } = response.data;
  
      // Replace or append comments based on page
      if (page === 1) {
        setComments(data);
      } else {
        setComments(prev => [...prev, ...data]);
      }
  
      // Update states
      setLastPage(last_page);
      setTotalComments(total);
  
      // Only update currentPage if there's more to load
      if (last_page > 1) {
        setCurrentPage(page + 1);
      }

      console.log(currentPage);
      console.log(lastPage);
  
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to load comments",
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      const formData = new FormData();
      formData.append('comment', commentContent);
      formData.append('commentable_id', postId);
      const response = await axios.post('/add-comment', formData);
      if (response.data.status === 'success') {
        setCommentContent('');
        setShowCommentBox(false);
        Toast.fire({
            icon: "success",
            title: response.data.message
            }); 
        //setComments(()=> []);
        //setCurrentPage(() => 1);
        setTotalComments((prevTotal) => prevTotal + 1);
        loadComments(currentPage);
      }
    } catch (error) {
      //toast.error(error.response?.data?.errors || 'Failed to add comment');
      Toast.fire({
        icon: "error",
        title: error.response?.data?.errors || 'Failed to add comment'
        }); 
    }
  };

  const handleAddReply = async (e, commentId, parentId = null) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const response = await axios.post('/comments/reply', {
        comment_id: commentId,
        post_id: postId,
        commentable_id: postId,
        commentable_type: 'opp',
        reply: replyContent,
        parent_id: parentId
      });

      if (response.data.status === 'success') {
        setReplyContent('');
        setActiveReplyForm(null);
        //toast.success('Reply added successfully');
        Toast.fire({
            icon: "success",
            title: 'Reply added successfully'
            }); 
        // Reload comments
        setComments([]);
        setCurrentPage(1);
        loadComments();
      }
    } catch (error) {
      //toast.error(error.response?.data?.errors || 'Failed to add reply');
      Toast.fire({
        icon: "error",
        title: error.response?.data?.errors || 'Failed to add comment'
        }); 
    }
  };

  const toggleReplyForm = (commentId, parentId = null) => {
    setActiveReplyForm(activeReplyForm === `${commentId}-${parentId}` ? null : `${commentId}-${parentId}`);
  };

  const renderComment = (comment) => {
    return (
      <div key={`comment-${comment.id}`} className="comment mb-3" data-commentid={comment.id}>
        <div className="comment-content">
          <span className="text-secondary fs-9 mb-1 d-block">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
          <strong>{comment.commenter_name || comment.replier_name || comment.user?.name}</strong>: {comment.comment}
        </div>
        <div className="comment-meta text-secondary">
          {isAuthenticated && (
            <button 
              className="btn btn-white fs-8 border reply-button"
              onClick={() => toggleReplyForm(comment.id)}
            >
              Reply
            </button>
          )}
        </div>

        {activeReplyForm === `${comment.id}-null` && (
          <form className="mt-2" onSubmit={(e) => handleAddReply(e, comment.id)}>
            <textarea 
              className="form-control" 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Enter your reply" 
              required
            />
            <button type="submit" className="btn fs-9 btn-light border mt-2">
              Submit Reply
            </button>
          </form>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="replies ms-4">
            {comment.replies.map(reply => renderReply(reply, comment.id))}
          </div>
        )}
      </div>
    );
  };

  const renderReply = (reply, commentId) => {
    return (
      <div key={`reply-${reply.id}`} className="reply mb-3" data-replyid={reply.id}>
        <div className="comment-content">
          <span className="text-secondary fs-9 d-block">
            {new Date(reply.created_at).toLocaleDateString()}
          </span>
          <strong>{reply.replier_name || reply.user?.name}</strong>: {reply.content}
        </div>
        <div className="comment-meta">
          {isAuthenticated && userId !== reply.user_id && (
            <button 
              className="btn btn-white fs-9 border"
              style={{color: '#2b9d8b'}}
              onClick={() => toggleReplyForm(commentId, reply.id)}
            >
              Reply
            </button>
          )}
        </div>

        {activeReplyForm === `${commentId}-${reply.id}` && (
          <form className="mt-2" onSubmit={(e) => handleAddReply(e, commentId, reply.id)}>
            <textarea 
              className="form-control" 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Enter your reply" 
              required
            />
            <button type="submit" className="btn fs-9 btn-light border mt-2">
              Submit Reply
            </button>
          </form>
        )}

        {reply.replies && reply.replies.length > 0 && (
          <div className="ms-4">
            {reply.replies.map(childReply => renderReply(childReply, commentId))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="comments border rounded px-3 py-3 my-3">
      <div className="row d-flex align-items-center">
        <div className="col-sm-4">
          <div className="fs-9">Comments <strong>{total_comments}</strong></div>
        </div>
        <div className="col-sm-4"></div>
        <div className="col-sm-4">
          <div className="text-end">
            <button 
              onClick={() => setShowCommentBox(!showCommentBox)}
              className="btn toggle-comment btn-lg text-decoration-none px-4 py-2 fs-9"
              >
              <span className="material-symbols-outlined align-middle">mode_comment</span>&nbsp;
              {showCommentBox ? 'Cancel' : 'Add Comments'}
            </button>
          </div>
        </div>
      </div>
      {showCommentBox && (
        <div id="comment-box" className="my-3">
          {!isAuthenticated ? (
            <Link href="/login" className="fs-9">Login to Comment</Link>
          ) : (
            <form id="comment-form" onSubmit={handleAddComment}>
              <div>
                <div className="form-floating">
                  <textarea 
                    className="form-control border-0 shadow-none p-0" 
                    style={{height: 'auto'}} 
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Comment" 
                    rows="4"
                  />
                  {/* <label htmlFor="floatingTextarea">Comment</label> */}
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div></div>
                <div>
                  <button className="btn btn-dark px-4 mt-3 fs-9">
                    Comment
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="fs-9 mt-3">
        {total_comments > 0 ? (
          <>
            <div id="comments-section">
              {loading && <div id="loader" className="mx-auto">Loading...</div>}
              {comments.map(comment => renderComment(comment))}
            </div>
            {currentPage < lastPage && (
              <button 
                id="load-more" 
                className="btn btn-warning shadow-none poppins-semibold px-4 border-0 fs-9"
                onClick={()=>loadComments(currentPage)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load Comments'}
              </button>
            )}
          </>
        ) : (
          <span className="text-secondary">
          Be the first to comment
          </span>
        )}
      </div>
    </div>
  );
};

export default CommentComponent;