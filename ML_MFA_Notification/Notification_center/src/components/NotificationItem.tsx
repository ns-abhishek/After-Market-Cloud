import React from 'react';
import { Notification, NotificationStatus, NotificationPriority } from '@/models/Notification';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onSelect: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onStar: (id: string) => void;
  onUnstar: (id: string) => void;
  compact?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onSelect,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onDelete,
  onStar,
  onUnstar,
  compact = false,
}) => {
  const handleClick = () => {
    onSelect(notification);
    if (notification.status === NotificationStatus.UNREAD) {
      onMarkAsRead(notification.id);
    }
  };

  const getPriorityClass = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.LOW:
        return 'bg-gray-200 text-gray-800';
      case NotificationPriority.MEDIUM:
        return 'bg-blue-200 text-blue-800';
      case NotificationPriority.HIGH:
        return 'bg-orange-200 text-orange-800';
      case NotificationPriority.URGENT:
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getStatusClass = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.UNREAD:
        return 'border-l-4 border-blue-500 bg-blue-50';
      case NotificationStatus.READ:
        return 'border-l-4 border-transparent';
      case NotificationStatus.ARCHIVED:
        return 'border-l-4 border-transparent opacity-60';
      default:
        return 'border-l-4 border-transparent';
    }
  };

  return (
    <div 
      className={`${getStatusClass(notification.status)} p-4 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 ease-in-out`}
      onClick={handleClick}
    >
      <div className="flex items-start">
        {notification.iconUrl ? (
          <div className="mr-3 flex-shrink-0">
            <img 
              src={notification.iconUrl} 
              alt="" 
              className="h-10 w-10 rounded-full"
            />
          </div>
        ) : (
          <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              {notification.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <p className={`text-sm font-medium ${notification.status === NotificationStatus.UNREAD ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
              {notification.title}
            </p>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(notification.priority)}`}>
                {notification.priority}
              </span>
              <button 
                className={`ml-2 text-gray-400 hover:text-yellow-500 ${notification.isStarred ? 'text-yellow-500' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  notification.isStarred ? onUnstar(notification.id) : onStar(notification.id);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
          </div>
          
          {!compact && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {notification.body}
            </p>
          )}
          
          <div className="mt-2 flex justify-between items-center">
            <div className="flex space-x-2">
              {notification.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </p>
          </div>
          
          {notification.actions.length > 0 && !compact && (
            <div className="mt-3 flex space-x-2">
              {notification.actions.slice(0, 2).map((action) => (
                <button
                  key={action.id}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    action.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                  disabled={action.completed}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle action click
                  }}
                >
                  {action.label}
                </button>
              ))}
              {notification.actions.length > 2 && (
                <button
                  className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(notification);
                  }}
                >
                  +{notification.actions.length - 2} more
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 flex justify-end space-x-2">
        {notification.status === NotificationStatus.UNREAD ? (
          <button
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            Mark as read
          </button>
        ) : (
          <button
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsUnread(notification.id);
            }}
          >
            Mark as unread
          </button>
        )}
        
        <button
          className="text-xs text-gray-500 hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            onArchive(notification.id);
          }}
        >
          Archive
        </button>
        
        <button
          className="text-xs text-gray-500 hover:text-red-700"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
