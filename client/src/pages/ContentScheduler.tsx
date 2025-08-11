import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Send, Eye, Edit2, X } from 'lucide-react';
import { Content } from '../types';
import api from '../services/api';

function ContentScheduler() {
  const [scheduledContent, setScheduledContent] = useState<Content[]>([]);
  const [availableContent, setAvailableContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchScheduledContent();
    fetchAvailableContent();
  }, []);

  const fetchScheduledContent = async () => {
    try {
      const response = await api.get('/schedule/queue');
      setScheduledContent(response.data);
    } catch (error) {
      console.error('Error fetching scheduled content:', error);
    }
  };

  const fetchAvailableContent = async () => {
    try {
      const response = await api.get('/content');
      setAvailableContent(response.data.filter((content: Content) => !content.is_scheduled));
    } catch (error) {
      console.error('Error fetching available content:', error);
    }
  };

  const addToQueue = async (contentId: number) => {
    try {
      await api.post('/schedule/add', {
        contentId,
        scheduledTime: new Date().toISOString()
      });
      fetchScheduledContent();
      fetchAvailableContent();
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  };

  const removeFromQueue = async (contentId: number) => {
    try {
      await api.post('/schedule/remove', { contentId });
      fetchScheduledContent();
      fetchAvailableContent();
    } catch (error) {
      console.error('Error removing from queue:', error);
    }
  };

  const postAll = async () => {
    setIsLoading(true);
    try {
      await api.post('/schedule/post-all');
      fetchScheduledContent();
      fetchAvailableContent();
    } catch (error) {
      console.error('Error posting all:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ScheduledCard = ({ content }: { content: Content }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start space-x-3">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
          {content.media_url ? (
            content.media_type === 'image' ? (
              <img
                src={`http://localhost:5000${content.media_url}`}
                alt={content.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400">📹</div>
            )
          ) : (
            <div className="text-gray-400">📄</div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {content.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
            {content.caption || 'No caption'}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <span>Scheduled</span>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <button className="p-2 text-gray-500 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-light-blue rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Eye size={16} />
          </button>
          <button className="p-2 text-gray-500 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-light-blue rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => removeFromQueue(content.id)}
            className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const AvailableCard = ({ content }: { content: Content }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start space-x-3">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
          {content.media_url ? (
            content.media_type === 'image' ? (
              <img
                src={`http://localhost:5000${content.media_url}`}
                alt={content.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400">📹</div>
            )
          ) : (
            <div className="text-gray-400">📄</div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {content.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
            {content.caption || 'No caption'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {content.category}
            </span>
            <button
              onClick={() => addToQueue(content.id)}
              className="px-3 py-1 bg-brand-teal text-white text-xs font-medium rounded-full hover:bg-teal-600 transition-colors"
            >
              Add to Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-mobile py-6 space-y-6">
      {/* Post All Button */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Ready to Post
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {scheduledContent.length} items in your queue
          </p>
          <button
            onClick={postAll}
            disabled={isLoading || scheduledContent.length === 0}
            className="btn-primary flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Post All Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scheduled Queue */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock size={24} className="mr-2 text-brand-teal" />
          Scheduled Queue ({scheduledContent.length})
        </h2>
        
        {scheduledContent.length > 0 ? (
          <div className="space-y-3">
            {scheduledContent.map((content) => (
              <ScheduledCard key={content.id} content={content} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No content scheduled
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add content from your library below
            </p>
          </div>
        )}
      </div>

      {/* Available Content */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calendar size={24} className="mr-2 text-brand-teal" />
          Available Content ({availableContent.length})
        </h2>
        
        {availableContent.length > 0 ? (
          <div className="space-y-3">
            {availableContent.slice(0, 10).map((content) => (
              <AvailableCard key={content.id} content={content} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No available content
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Go to Content Bank to upload new content
            </p>
          </div>
        )}
      </div>

      {/* Posting Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Posting Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Staggered Posting</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Space out posts every 15 minutes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/25 dark:peer-focus:ring-brand-teal/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-teal"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Auto-retry Failed Posts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automatically retry if posting fails</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-teal/25 dark:peer-focus:ring-brand-teal/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-teal"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentScheduler;
