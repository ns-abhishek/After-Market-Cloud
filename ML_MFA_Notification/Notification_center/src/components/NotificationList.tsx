import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectFilteredNotifications, 
  selectNotificationsLoading,
  selectActiveFilters,
  setSelectedNotification,
  markAsRead,
  markAsUnread,
  archiveNotification,
  deleteNotification,
  starNotification,
  unstarNotification,
  getNotifications,
  setFilters,
  clearFilters
} from '@/store/slices/notificationsSlice';
import { selectCompactView, selectGroupByCategory } from '@/store/slices/uiSlice';
import { Notification, NotificationCategory, NotificationStatus, NotificationPriority } from '@/models/Notification';
import NotificationItem from './NotificationItem';
import { AppDispatch } from '@/store';

const NotificationList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectFilteredNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const compactView = useSelector(selectCompactView);
  const groupByCategory = useSelector(selectGroupByCategory);
  const activeFilters = useSelector(selectActiveFilters);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(setFilters({ search: searchTerm }));
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);
  
  const handleSelectNotification = (notification: Notification) => {
    dispatch(setSelectedNotification(notification));
  };
  
  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };
  
  const handleMarkAsUnread = (id: string) => {
    dispatch(markAsUnread(id));
  };
  
  const handleArchive = (id: string) => {
    dispatch(archiveNotification(id));
  };
  
  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id));
  };
  
  const handleStar = (id: string) => {
    dispatch(starNotification(id));
  };
  
  const handleUnstar = (id: string) => {
    dispatch(unstarNotification(id));
  };
  
  const handleFilterChange = (filterType: string, value: any) => {
    switch (filterType) {
      case 'status':
        const statusFilters = activeFilters.status.includes(value)
          ? activeFilters.status.filter(status => status !== value)
          : [...activeFilters.status, value];
        dispatch(setFilters({ status: statusFilters }));
        break;
      case 'category':
        const categoryFilters = activeFilters.categories.includes(value)
          ? activeFilters.categories.filter(category => category !== value)
          : [...activeFilters.categories, value];
        dispatch(setFilters({ categories: categoryFilters }));
        break;
      case 'priority':
        const priorityFilters = activeFilters.priority.includes(value)
          ? activeFilters.priority.filter(priority => priority !== value)
          : [...activeFilters.priority, value];
        dispatch(setFilters({ priority: priorityFilters }));
        break;
      case 'starred':
        dispatch(setFilters({ isStarred: value }));
        break;
      default:
        break;
    }
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };
  
  const renderNotifications = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      );
    }
    
    if (notifications.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-64">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="mt-4 text-gray-500">No notifications found</p>
          {Object.values(activeFilters).some(filter => 
            Array.isArray(filter) ? filter.length > 0 : filter !== null && filter !== ''
          ) && (
            <button
              className="mt-2 text-primary-600 hover:text-primary-800"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      );
    }
    
    if (groupByCategory) {
      const categorizedNotifications: Record<string, Notification[]> = {};
      
      notifications.forEach(notification => {
        if (!categorizedNotifications[notification.category]) {
          categorizedNotifications[notification.category] = [];
        }
        categorizedNotifications[notification.category].push(notification);
      });
      
      return Object.entries(categorizedNotifications).map(([category, categoryNotifications]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">{category}</h3>
          {categoryNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onSelect={handleSelectNotification}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onStar={handleStar}
              onUnstar={handleUnstar}
              compact={compactView}
            />
          ))}
        </div>
      ));
    }
    
    return notifications.map(notification => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onSelect={handleSelectNotification}
        onMarkAsRead={handleMarkAsRead}
        onMarkAsUnread={handleMarkAsUnread}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onStar={handleStar}
        onUnstar={handleUnstar}
        compact={compactView}
      />
    ));
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-xs font-medium rounded-md ${
                activeFilters.status.includes(NotificationStatus.UNREAD)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('status', NotificationStatus.UNREAD)}
            >
              Unread
            </button>
            <button
              className={`px-3 py-1 text-xs font-medium rounded-md ${
                activeFilters.isStarred
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('starred', !activeFilters.isStarred)}
            >
              Starred
            </button>
            <button
              className={`px-3 py-1 text-xs font-medium rounded-md ${
                activeFilters.status.includes(NotificationStatus.ARCHIVED)
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange('status', NotificationStatus.ARCHIVED)}
            >
              Archived
            </button>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Priority:</span>
            {Object.values(NotificationPriority).map((priority) => (
              <button
                key={priority}
                className={`mr-2 px-2 py-1 text-xs font-medium rounded-md ${
                  activeFilters.priority.includes(priority)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleFilterChange('priority', priority)}
              >
                {priority}
              </button>
            ))}
          </div>
          
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Category:</span>
            {Object.values(NotificationCategory).map((category) => (
              <button
                key={category}
                className={`mr-2 px-2 py-1 text-xs font-medium rounded-md ${
                  activeFilters.categories.includes(category)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => handleFilterChange('category', category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto">
        {renderNotifications()}
      </div>
    </div>
  );
};

export default NotificationList;
