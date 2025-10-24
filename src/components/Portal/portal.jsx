import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';

const PostFormDialog = ({ post, open, onClose, onPostSubmitted, isSubmitting }) => {
  const isEditing = !!post;
  const dialogTitle = isEditing ? 'Edit Post' : 'Add New Post';
  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');

  useEffect(() => {
    setTitle(post?.title || '');
    setBody(post?.body || '');
  }, [post, open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const submissionData = {
      title,
      body,
      id: post?.id,
      userId: post?.userId || 1,
    };
    onPostSubmitted(submissionData, isEditing);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center pr-3">
        {dialogTitle}
        <CloseIcon className="cursor-pointer text-gray-400 hover:text-gray-700" onClick={onClose} />
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText className="mb-4">
          {isEditing 
            ? 'Update the title and description for this post.' 
            : 'Add the title and the description for the post you want to create.'}
        </DialogContentText>
        <form onSubmit={handleSubmit} id="post-form">
          <TextField
            autoFocus
            required
            margin="dense"
            id="title-field"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
            disabled={isSubmitting}
          />
          <TextField
            required
            margin="dense"
            id="body-field"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={isSubmitting}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          form="post-form"
          disabled={isSubmitting || !title.trim() || !body.trim()}
          variant="contained"
        >
          {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Post' : 'Create Post')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostFormDialog;
