import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Filter, Mail, Phone, UserPlus, MessageSquare } from 'lucide-react';
import { mockTasks, Task } from '../data/mockData';

export function TasksView() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTasks = mockTasks.filter((task) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && !task.completed) ||
      (statusFilter === 'completed' && task.completed);

    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by completed status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Then by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'thank_you':
        return Mail;
      case 'follow_up':
        return UserPlus;
      case 'call':
        return Phone;
      case 'email':
        return MessageSquare;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
    }
  };

  const isOverdue = (dueDate: string, completed: boolean) => {
    if (completed) return false;
    return new Date(dueDate) < new Date();
  };

  const pendingCount = mockTasks.filter((t) => !t.completed).length;
  const completedCount = mockTasks.filter((t) => t.completed).length;
  const overdueCount = mockTasks.filter(
    (t) => !t.completed && new Date(t.dueDate) < new Date()
  ).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tasks & Follow-ups</h1>
        <p className="text-gray-600 mt-2">Manage your donor engagement activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overdue</p>
              <p className="text-3xl font-bold text-gray-900">{overdueCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="text-sm text-gray-600 mr-2">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mr-2">Priority:</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {statusFilter === 'pending'
              ? 'Pending Tasks'
              : statusFilter === 'completed'
              ? 'Completed Tasks'
              : 'All Tasks'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        {sortedTasks.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {sortedTasks.map((task) => {
              const Icon = getTaskIcon(task.type);
              const overdue = isOverdue(task.dueDate, task.completed);
              
              return (
                <div
                  key={task.id}
                  className={`p-6 hover:bg-gray-50 transition ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          task.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            task.completed ? 'text-green-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p
                            className={`font-medium mb-1 ${
                              task.completed
                                ? 'text-gray-600 line-through'
                                : 'text-gray-900'
                            }`}
                          >
                            {task.description}
                          </p>
                          <Link
                            to={`/donors/${task.donorId}`}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            {task.donorName}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          {task.completed && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span
                          className={`flex items-center gap-1 ${
                            overdue ? 'text-red-600 font-medium' : 'text-gray-600'
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                          {overdue && ' (Overdue)'}
                        </span>
                        <span className="text-gray-600 capitalize">
                          {task.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-600">
            No tasks found matching your filters
          </div>
        )}
      </div>
    </div>
  );
}
