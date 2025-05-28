import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectSelectedNotification,
  setSelectedNotification,
  markAsRead,
  markAsUnread,
  archiveNotification,
  deleteNotification,
  starNotification,
  unstarNotification
} from '@/store/slices/notificationsSlice';
import { NotificationStatus, NotificationPriority, ActionType } from '@/models/Notification';
import { formatDistanceToNow, format } from 'date-fns';

const NotificationDetail: React.FC = () => {
  const dispatch = useDispatch();
  const notification = useSelector(selectSelectedNotification);
  
  if (!notification) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p className="mt-4 text-gray-500">Select a notification to view details</p>
      </div>
    );
  }
  
  const handleClose = () => {
    dispatch(setSelectedNotification(null));
  };
  
  const handleMarkAsRead = () => {
    dispatch(markAsRead(notification.id));
  };
  
  const handleMarkAsUnread = () => {
    dispatch(markAsUnread(notification.id));
  };
  
  const handleArchive = () => {
    dispatch(archiveNotification(notification.id));
  };
  
  const handleDelete = () => {
    dispatch(deleteNotification(notification.id));
    dispatch(setSelectedNotification(null));
  };
  
  const handleStar = () => {
    dispatch(starNotification(notification.id));
  };
  
  const handleUnstar = () => {
    dispatch(unstarNotification(notification.id));
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
  
  const getActionButtonClass = (type: ActionType) => {
    switch (type) {
      case ActionType.APPROVE:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case ActionType.DECLINE:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case ActionType.SCHEDULE:
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Notification Details</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-start mb-4">
          {notification.iconUrl ? (
            <div className="mr-3 flex-shrink-0">
              <img 
                src={notification.iconUrl} 
                alt="" 
                className="h-12 w-12 rounded-full"
              />
            </div>
          ) : (
            <div className="mr-3 flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-lg">
                {notification.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900">{notification.title}</h3>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(notification.priority)}`}>
                  {notification.priority}
                </span>
                <button 
                  className={`ml-2 text-gray-400 hover:text-yellow-500 ${notification.isStarred ? 'text-yellow-500' : ''}`}
                  onClick={notification.isStarred ? handleUnstar : handleStar}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span>
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </span>
              <span className="mx-1">•</span>
              <span className="capitalize">{notification.category}</span>
              {notification.sourceApp && (
                <>
                  <span className="mx-1">•</span>
                  <span>{notification.sourceApp}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none mt-4">
          <p className="text-gray-700 whitespace-pre-line">{notification.body}</p>
        </div>
        
        {notification.imageUrl && (
          <div className="mt-4">
            <img 
              src={notification.imageUrl} 
              alt="" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        
        {notification.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {notification.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {notification.actions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
            <div className="flex flex-wrap gap-2">
              {notification.actions.map((action) => (
                <button
                  key={action.id}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    action.completed
                      ? 'bg-green-100 text-green-800 cursor-default'
                      : getActionButtonClass(action.type)
                  }`}
                  disabled={action.completed}
                >
                  {action.label}
                  {action.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {notification.relatedNotifications && notification.relatedNotifications.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Related Notifications</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">
                This notification has {notification.relatedNotifications.length} related notifications.
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Details</h4>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd className="font-medium text-gray-900 capitalize">{notification.status}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Created</dt>
              <dd className="font-medium text-gray-900">{format(new Date(notification.createdAt), 'PPpp')}</dd>
            </div>
            {notification.readAt && (
              <div>
                <dt className="text-gray-500">Read</dt>
                <dd className="font-medium text-gray-900">{format(new Date(notification.readAt), 'PPpp')}</dd>
              </div>
            )}
            {notification.archivedAt && (
              <div>
                <dt className="text-gray-500">Archived</dt>
                <dd className="font-medium text-gray-900">{format(new Date(notification.archivedAt), 'PPpp')}</dd>
              </div>
            )}
            {notification.expiresAt && (
              <div>
                <dt className="text-gray-500">Expires</dt>
                <dd className="font-medium text-gray-900">{format(new Date(notification.expiresAt), 'PPpp')}</dd>
              </div>
            )}
            {notification.scheduledFor && (
              <div>
                <dt className="text-gray-500">Scheduled For</dt>
                <dd className="font-medium text-gray-900">{format(new Date(notification.scheduledFor), 'PPpp')}</dd>
              </div>
            )}
            {notification.reminderTime && (
              <div>
                <dt className="text-gray-500">Reminder</dt>
                <dd className="font-medium text-gray-900">{format(new Date(notification.reminderTime), 'PPpp')}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between">
          <div>
            {notification.status === NotificationStatus.UNREAD ? (
              <button
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                onClick={handleMarkAsRead}
              >
                Mark as read
              </button>
            ) : (
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={handleMarkAsUnread}
              >
                Mark as unread
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={handleArchive}
            >
              Archive
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
