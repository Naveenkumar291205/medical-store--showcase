import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  Clock,
  ShoppingBag,
  FileText,
  RefreshCw,
  Tag,
  ShieldAlert,
  Check,
  ArrowRight
} from 'lucide-react';
import { MotionDrawer } from './MotionDrawer';
import { useNotification, ActivityNotification } from '../../context/NotificationContext';

interface NotificationDrawerProps {
  onNavigateAction: (action: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onNavigateAction }) => {
  const {
    activities,
    isDrawerOpen,
    setIsDrawerOpen,
    markActivityAsRead,
    markAllActivitiesAsRead,
    unreadActivitiesCount
  } = useNotification();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const filteredActivities = activities.filter((a) => {
    if (activeFilter === 'unread') return !a.read;
    return true;
  });

  const getIcon = (type: ActivityNotification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-brand-blue" />;
      case 'prescription':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'refill':
        return <RefreshCw className="w-4 h-4 text-amber-600" />;
      case 'promo':
        return <Tag className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleActionClick = (activity: ActivityNotification) => {
    markActivityAsRead(activity.id);
    if (activity.linkAction) {
      setIsDrawerOpen(false);
      onNavigateAction(activity.linkAction);
    }
  };

  return (
    <MotionDrawer
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      title="Activity & Updates"
      subtitle={`${unreadActivitiesCount} unread alert${unreadActivitiesCount === 1 ? '' : 's'}`}
      width="md"
    >
      <div className="flex flex-col h-full justify-between space-y-4">
        
        {/* Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'all' ? 'bg-white text-brand-blue shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              All ({activities.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'unread' ? 'bg-white text-brand-blue shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Unread ({unreadActivitiesCount})
            </button>
          </div>

          {unreadActivitiesCount > 0 && (
            <button
              onClick={markAllActivitiesAsRead}
              className="text-xs font-bold text-brand-blue hover:text-brand-blue-dark flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-slate-100 flex-1 overflow-y-auto pr-1">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No notifications to display.
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => handleActionClick(act)}
                className={`py-3.5 first:pt-0 flex items-start gap-3 cursor-pointer p-2 rounded-2xl transition-colors ${
                  !act.read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(act.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className={`text-xs ${!act.read ? 'font-bold text-brand-text' : 'font-semibold text-slate-700'}`}>
                      {act.title}
                    </h5>
                    {!act.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-blue flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {act.message}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span>{act.timestamp}</span>
                    {act.linkAction && (
                      <span className="text-brand-blue font-bold flex items-center gap-0.5">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </MotionDrawer>
  );
};
