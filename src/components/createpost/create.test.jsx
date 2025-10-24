import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const Create = ({ onPostCreated }) => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setBody('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const postData = { 
        title, 
        body, 
        userId: 1 
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) throw new Error('Failed to create post');

      const newPost = await response.json();
      
      newPost.id = Date.now();
      
      if (onPostCreated) {
        onPostCreated(newPost);
      }

      alert('Post created successfully!');
      
      handleClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + error.message);
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
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add the title and the description for the post you want to create.
          </DialogContentText>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="subscription-form" 
            disabled={loading || !title.trim() || !body.trim()}
            variant="contained"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Create;