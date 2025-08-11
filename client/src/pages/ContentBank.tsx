import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Content } from '../types';
import { contentAPI } from '../services/api';
import { Upload, Search, Image, Video, Calendar, Tag, DollarSign } from 'lucide-react';

const ContentBank: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'all', label: 'All Content' },
    { value: 'promo', label: 'Promo' },
    { value: 'tip', label: 'Tip' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'product', label: 'Product Showcase' },
  ];

  const loadContent = useCallback(async () => {
    try {
      const data = await contentAPI.getAll(selectedCategory);
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadContent();
  }, [selectedCategory, loadContent]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const contentData = {
        category: 'general',
        caption: '',
        hashtags: '',
        price: '',
        tags: '',
      };

      await contentAPI.upload(file, contentData);
      await loadContent();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleScheduleContent = async (contentId: number) => {
    const scheduledFor = new Date();
    scheduledFor.setMinutes(scheduledFor.getMinutes() + 5); // Schedule for 5 minutes from now
    
    try {
      await contentAPI.schedule(contentId, scheduledFor.toISOString());
      await loadContent();
    } catch (error) {
      console.error('Error scheduling content:', error);
    }
  };

  const filteredContent = content.filter(item =>
    item.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.hashtags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isImage = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  };

  const isVideo = (filename: string) => {
    return /\.(mp4|mov|avi|wmv|flv|webm)$/i.test(filename);
  };

  const getFileIcon = (filename: string) => {
    if (isImage(filename)) return <Image className="w-5 h-5" />;
    if (isVideo(filename)) return <Video className="w-5 h-5" />;
    return <Image className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gradient-start"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="container-mobile">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Content Bank</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </button>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white'
                    : 'btn-secondary'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredContent.length === 0 ? (
            <div className="card text-center py-8">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-light-blue/80 mb-4">
                No content found. Upload your first piece of content to get started!
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary"
              >
                Upload Content
              </button>
            </div>
          ) : (
            filteredContent.map((item) => (
              <div key={item.id} className="card">
                <div className="flex items-start space-x-4">
                  {/* Thumbnail/Icon */}
                  <div className="flex-shrink-0">
                    {isImage(item.filename) ? (
                      <img
                        src={`http://localhost:5000/uploads/${item.filename}`}
                        alt={item.original_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        {getFileIcon(item.filename)}
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{item.original_name}</h3>
                    
                    {item.caption && (
                      <p className="text-sm text-gray-600 dark:text-light-blue/80 mt-1 line-clamp-2">
                        {item.caption}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-light-blue/60">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{item.category}</span>
                      </div>
                      
                      {item.price && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{item.price}</span>
                        </div>
                      )}
                      
                      <span>
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        {item.posted_at ? (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                            Posted
                          </span>
                        ) : item.scheduled_for ? (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                            Scheduled
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                            Draft
                          </span>
                        )}
                      </div>

                      {!item.posted_at && !item.scheduled_for && (
                        <button
                          onClick={() => handleScheduleContent(item.id)}
                          className="flex items-center space-x-1 text-xs btn-secondary"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Schedule</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Content</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-brand-gradient-start transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-light-blue/80 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  Images, videos supported
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {uploading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-gradient-start mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-light-blue/80">
                    Uploading...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentBank;
