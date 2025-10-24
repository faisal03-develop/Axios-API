import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';

/**
 * A reusable dialog component for creating or editing a blog post.
 * It dynamically changes its title and description based on whether a 'post' object is provided.
 *
 * @param {object} props - The component props.
 * @param {object | null} props.post - The post object to edit. If null, the dialog is in 'create' mode.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {function} props.onClose - Function to call when the dialog is requested to close.
 * @param {function} props.onPostSubmitted - Function to call when the form is submitted,
 * receives (postData, isEditing) as arguments.
 * @param {boolean} props.isSubmitting - Indicates if the form is currently in a submission state (e.g., API call).
 */
const PostFormDialog = ({ post, open, onClose, onPostSubmitted, isSubmitting }) => {
  // Determine if the component is in 'edit' mode based on the presence of a 'post' object
  const isEditing = !!post;
  const dialogTitle = isEditing ? 'Edit Post' : 'Add New Post';
  
  // State for the form fields, initialized with post data if editing, or empty for creating
  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');

  // Effect to reset form fields when the 'post' prop changes (e.g., when the dialog is opened/closed)
  // This ensures the form fields always reflect the current 'post' data or are empty for creation.
  useEffect(() => {
    setTitle(post?.title || '');
    setBody(post?.body || '');
  }, [post, open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const submissionData = {
      title,
      body,
      // Include the existing ID and userId if editing
      id: post?.id,
      userId: post?.userId || 1, // Default userId to 1 if creating a new post
    };
    
    // Call the parent's handler with the submission data and the determined mode
    onPostSubmitted(submissionData, isEditing);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="flex justify-between items-center pr-3">
        {dialogTitle}
        {/* Close icon for better user experience */}
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
          {/* Dynamically update button text based on mode and loading state */}
          {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Post' : 'Create Post')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostFormDialog; // ADDED DEFAULT EXPORT
