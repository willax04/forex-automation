import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Image, Video, Edit2, Trash2 } from 'lucide-react';
import { Content } from '../types';
import api from '../services/api';

function ContentBank() {
  const [contents, setContents] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const categories = ['All', 'Promo', 'Tip', 'Engagement', 'Testimonial', 'Product Showcase'];

  useEffect(() => {
    fetchContent();
  }, [selectedCategory, searchTerm]);

  const fetchContent = async () => {
    try {
      const response = await api.get('/content', {
        params: {
          category: selectedCategory === 'All' ? '' : selectedCategory,
          search: searchTerm
        }
      });
      setContents(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('media', file);
    formData.append('title', `Upload ${new Date().toLocaleDateString()}`);
    formData.append('caption', '');
    formData.append('category', 'Promo');

    try {
      await api.post('/content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchContent();
    } catch (error) {
      console.error('Error uploading content:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteContent = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await api.delete(`/content/${id}`);
        fetchContent();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const ContentCard = ({ content }: { content: Content }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Media Preview */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        {content.media_url ? (
          content.media_type === 'image' ? (
            <img
              src={`http://localhost:5000${content.media_url}`}
              alt={content.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Video size={48} className="text-gray-400" />
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-brand-teal text-white text-xs font-medium rounded-full">
            {content.category}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {content.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {content.caption || 'No caption'}
        </p>
        
        {content.price && (
          <div className="mb-3">
            <span className="text-brand-teal font-semibold">${content.price}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-light-blue rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => deleteContent(content.id)}
              className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(content.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-mobile py-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`btn-primary flex items-center space-x-2 cursor-pointer ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Plus size={20} />
                <span>Add Content</span>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                (selectedCategory === category) || (selectedCategory === '' && category === 'All')
                  ? 'bg-brand-teal text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contents.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>

      {/* Empty State */}
      {contents.length === 0 && (
        <div className="text-center py-12">
          <Image size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No content found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start by uploading your first piece of content
          </p>
        </div>
      )}
    </div>
  );
}

export default ContentBank;
