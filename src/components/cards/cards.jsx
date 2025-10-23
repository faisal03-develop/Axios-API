import * as React from 'react';
import { useState, useEffect } from 'react';
import Search from '../search/search.test';
import Create from '../createpost/create.test';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

const Cards = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  
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

  // Filter posts whenever searchTerm changes
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

  // Handle new post creation
  const handlePostCreated = (newPost) => {
    // Add the new post to the beginning of the posts array
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setFilteredPosts(prevFiltered => [newPost, ...prevFiltered]);
  };

  return (
    <>
      {/* Create Post Component */}
      <Create onPostCreated={handlePostCreated} />

      {/* Search Component */}
      <div className="p-6">
        <Search 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
      </div>

      {/* Posts Count */}
      <div className="px-6 pb-4">
        <p className="text-gray-600">
          Showing {filteredPosts.length} of {posts.length} posts
          {searchTerm && (
            <span className="text-blue-600"> for "{searchTerm}"</span>
          )}
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xs border border-gray-200 transition-all duration-300 hover:shadow-lg"
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
                </div>
              </div>
            </div>
            
              <div id="delt" className='ml-[67%] cursor-pointer absolute top-5'>
                <EditIcon className='mr-3' sx={{ color: 'greenyellow' }} />
              <DeleteForeverIcon sx={{ color: 'rosybrown' }}/>
              </div>
          </article>
        ))}
        
        {/* No results message */}
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

export default Cards;