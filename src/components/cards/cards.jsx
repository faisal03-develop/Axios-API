import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Search from '../search/search.test';
import Create from '../createpost/create.test';
import PostFormDialog from '../../components/Portal/portal.test';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => (
  <Dialog open={open} onClose={onClose} aria-labelledby="confirm-dialog-title">
    <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

const MessageDisplay = ({ message, type, onClose }) => {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div 
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${isError ? 'bg-red-600' : 'bg-green-600'}`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <CloseIcon className="ml-4 cursor-pointer" onClick={onClose} aria-label="Close message" />
      </div>
    </div>
  );
};

const Cards = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data.slice(0, 20); 
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        handleShowMessage(`Error fetching posts: ${err.message}`, 'error');
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  const handleShowMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
    setIsEditDialogOpen(false);
    setEditingPost(null);
    handleShowMessage('Post updated successfully!', 'success');
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEditingPost(null);
  };

  const handleUpdateSubmit = async (postData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(`${API_URL}/${postData.id}`, postData);
      const updatedPost = response.data;
      handlePostUpdated(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
      handleShowMessage(`Error updating post: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      try {
        await axios.delete(`${API_URL}/${postToDelete}`);
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete));
        handleShowMessage('Post deleted successfully!');
      } catch (err) {
        console.error('Error deleting post:', err);
        handleShowMessage(`Error deleting post: ${err.message}`, 'error');
      }
    }
    setIsConfirmOpen(false);
    setPostToDelete(null);
  };

  return (
    <>
      <Create onPostCreated={handlePostCreated} onMessage={handleShowMessage} />

      <PostFormDialog
        open={isEditDialogOpen}
        onClose={handleEditClose}
        post={editingPost}
        onPostSubmitted={handleUpdateSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post?"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />

      <MessageDisplay 
        message={message} 
        type={messageType} 
        onClose={() => setMessage('')} 
      />

      <div className="p-6 max-w-7xl mx-auto">
        <Search 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
      </div>

      <div className="px-6 pb-4 max-w-7xl mx-auto">
        <p className="text-gray-600">
          Showing {filteredPosts.length} of {posts.length} posts
          {searchTerm && (
            <span className="text-blue-600"> for "{searchTerm}"</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg flex flex-col"
          >
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Post #{post.id}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 pr-16 capitalize">
                {post.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 first-letter:capitalize">
                {post.body}
              </p>
            </div>
            
            <div className='absolute top-4 right-4 flex space-x-2'>
              <Button 
                variant="text" 
                size="small"
                className="!p-2 !min-w-0 !border-gray-300 !text-gray-600 hover:!bg-gray-100"
                onClick={() => handleEditClick(post)}
                aria-label={`Edit post ${post.id}`}
              >
                <EditIcon sx={{ color: 'green', fontSize: 20 }} />
              </Button>
              <Button 
                variant="text" 
                size="small"
                className="!p-2 !min-w-0 !border-gray-300 !text-gray-600 hover:!bg-gray-100"
                onClick={() => handleDeleteClick(post.id)}
                aria-label={`Delete post ${post.id}`}
              >
                <DeleteForeverIcon sx={{ color: 'red', fontSize: 20 }} />
              </Button>
            </div>
          </article>
        ))}
        
        {filteredPosts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm 
                ? `No posts found matching "${searchTerm}"`
                : "No posts to display."
              }
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Cards;
