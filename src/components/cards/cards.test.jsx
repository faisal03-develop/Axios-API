import * as React from 'react';
import { useState, useEffect } from 'react';
import Search from '../search/search.test';
import Create from '../createpost/create.test';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const Cards = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
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

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handlePostCreated = (newPost) => {
    
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setFilteredPosts(prevFiltered => [newPost, ...prevFiltered]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
    setFilteredPosts(prevFiltered => 
      prevFiltered.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
    setIsEditDialogOpen(false);
    setEditingPost(null);
  };


  const handleEditClick = (post) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEditingPost(null);
  };

  const handleDeleteClick = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        
        await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
          method: 'DELETE',
        });
        
        
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        setFilteredPosts(prevFiltered => prevFiltered.filter(post => post.id !== postId));
        
        alert('Post deleted successfully!');
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Error deleting post');
      }
    }
  };

  return (
    <>
    
      <Create onPostCreated={handlePostCreated} />


      {isEditDialogOpen && (
        <EditDialog 
          post={editingPost}
          onClose={handleEditClose}
          onPostUpdated={handlePostUpdated}
        />
      )}


      <div className="p-6">
        <Search 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
      </div>


      <div className="px-6 pb-4">
        <p className="text-gray-600">
          Showing {filteredPosts.length} of {posts.length} posts
          {searchTerm && (
            <span className="text-blue-600"> for "{searchTerm}"</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group relative bg-linear-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xs border border-gray-200 transition-all duration-300 hover:shadow-lg"
          > 
            <div className="ml-4">
              <div className="inline-block bg-blue-200 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                Post #{post.id}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 pr-4">
                {post.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                {post.body}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">User ID: {post.userId}</span>
                </div>
              </div>
            </div>
            
            <div className='ml-[67%] cursor-pointer absolute top-5'>
              <EditIcon 
                className='mr-3' 
                sx={{ color: 'green' }} 
                onClick={() => handleEditClick(post)}
              />
              <DeleteForeverIcon 
                sx={{ color: 'red' }}
                onClick={() => handleDeleteClick(post.id)}
              />
            </div>
          </article>
        ))}
        
        {filteredPosts.length === 0 && searchTerm && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              No posts found matching "<span className="font-semibold">{searchTerm}</span>"
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </>
  );
};



const EditDialog = ({ post, onClose, onPostUpdated }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const postData = { 
        title, 
        body, 
        userId: post.userId,
        id: post.id
      };

      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) throw new Error('Failed to update post');

      const updatedPost = await response.json();
      
      if (onPostUpdated) {
        onPostUpdated(updatedPost);
      }

      alert('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the title and description for this post.
        </DialogContentText>
        <form onSubmit={handleSubmit} id="edit-form">
          <TextField
            autoFocus
            required
            margin="dense"
            id="edit-title"
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
            id="edit-body"
            name="body"
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
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          form="edit-form" 
          disabled={loading || !title.trim() || !body.trim()}
          variant="contained"
        >
          {loading ? 'Updating...' : 'Update Post'}
        </Button>
      </DialogActions>
    </Dialog>
  );

};
export default Cards;