import * as React from 'react';
import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios';
import PostFormDialog from '../../components/Portal/portal'; 

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const Create = ({ onPostCreated }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePostSubmitted = async (submissionData, isEditing) => {
    setLoading(true);
    setError(null);

    try {
      const postData = { 
        title: submissionData.title, 
        body: submissionData.body, 
        userId: 1 
      };

      const response = await axios.post(API_URL, postData);
      const newPost = response.data;
      newPost.id = Date.now(); 
      
      if (onPostCreated) {
        onPostCreated(newPost);
      }
      
      console.log('Post created successfully!');
      handleClose();

    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div id="button" className='flex justify-center mb-6'>
        <Button 
          variant="text" 
          onClick={handleClickOpen}
        >
          Add New Post
        </Button>
      </div>
      
      <PostFormDialog
        open={open}
        onClose={handleClose}
        isSubmitting={loading}
        post={null}
        onPostSubmitted={handlePostSubmitted}
      />

      {error && (
        <p className="text-center text-red-500 mt-4 font-medium">{error}</p>
      )}
    </React.Fragment>
  );
};

export default Create;
