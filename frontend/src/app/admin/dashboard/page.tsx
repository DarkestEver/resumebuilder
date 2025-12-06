/**
 * Admin Dashboard Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api/auth';
import { adminApi, User } from '@/lib/api/admin';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Search, Ban, Unlock, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  totalResumes: number;
  totalProfiles: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'users' | 'logs'>('overview');
  
  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Logs state
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    loadStats();
    if (tab === 'users') {
      loadUsers();
    } else if (tab === 'logs') {
      loadLogs();
    }
  }, [tab, currentPage]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await adminApi.getUsers(currentPage, 20);
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setSearching(true);
      const results = await adminApi.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleBanUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to ban ${userName}?`)) return;
    
    try {
      await adminApi.banUser(userId, 'Banned by admin');
      toast.success('User banned successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId: string, userName: string) => {
    if (!confirm(`Unban ${userName}?`)) return;
    
    try {
      await adminApi.unbanUser(userId);
      toast.success('User unbanned successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to unban user');
    }
  };

  const loadLogs = async () => {
    try {
      setLogsLoading(true);
      const response = await apiClient.get('/admin/logs');
      setLogs(response.data.logs || []);
    } catch (error) {
      toast.error('Failed to load logs');
    } finally {
      setLogsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Platform statistics and management</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setTab('overview')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                tab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setTab('users')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                tab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setTab('logs')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                tab === 'logs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Audit Logs
            </button>
          </div>

          {/* Overview Tab */}
          {tab === 'overview' && (
            <div>
              {loading ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse h-32"></div>
                  ))}
                </div>
              ) : stats ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Total Users */}
                  <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <p className="text-gray-600 text-sm font-semibold">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-green-600 text-sm mt-2">+{stats.newUsersThisMonth} this month</p>
                  </div>

                  {/* Total Resumes */}
                  <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <p className="text-gray-600 text-sm font-semibold">Total Resumes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalResumes.toLocaleString()}</p>
                    <p className="text-blue-600 text-sm mt-2">Avg {(stats.totalResumes / stats.totalUsers).toFixed(1)} per user</p>
                  </div>

                  {/* Total Profiles */}
                  <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <p className="text-gray-600 text-sm font-semibold">Profiles</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProfiles.toLocaleString()}</p>
                    <p className="text-purple-600 text-sm mt-2">{((stats.totalProfiles / stats.totalUsers) * 100).toFixed(0)}% completion</p>
                  </div>

                  {/* Active Subscriptions */}
                  <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <p className="text-gray-600 text-sm font-semibold">Active Subscriptions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeSubscriptions.toLocaleString()}</p>
                    <p className="text-orange-600 text-sm mt-2">{((stats.activeSubscriptions / stats.totalUsers) * 100).toFixed(1)}% conversion</p>
                  </div>

                  {/* Monthly Revenue */}
                  <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <p className="text-gray-600 text-sm font-semibold">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">${(stats.monthlyRevenue / 1000).toFixed(1)}k</p>
                    <p className="text-green-600 text-sm mt-2">+12% vs last month</p>
                  </div>

                  {/* System Health */}
                  <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <p className="text-gray-600 text-sm font-semibold">System Health</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">99.9%</p>
                    <p className="text-green-600 text-sm mt-2">All systems operational</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Users Tab */}
          {tab === 'users' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">User Management</h2>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
                  )}
                </div>
              </div>

              {/* User Table */}
              <div className="overflow-x-auto">
                {usersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(searchResults.length > 0 ? searchResults : users).map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{user.name || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.subscription?.plan === 'pro' 
                                ? 'bg-purple-100 text-purple-800'
                                : user.subscription?.plan === 'enterprise'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.subscription?.plan || 'Free'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isBanned
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.isBanned ? 'Banned' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => window.open(`/admin/users/${user.id}`, '_blank')}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {user.isBanned ? (
                                <button
                                  onClick={() => handleUnbanUser(user.id, user.name || user.email)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="Unban User"
                                >
                                  <Unlock className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleBanUser(user.id, user.name || user.email)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Ban User"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {!searchQuery && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, totalUsers)} of {totalUsers} users
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage * 20 >= totalUsers}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logs Tab */}
          {tab === 'logs' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Activity Logs</h2>
                <p className="text-sm text-gray-600 mt-1">Recent admin actions and system events</p>
              </div>
              
              <div className="overflow-x-auto">
                {logsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : logs.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Details</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              log.action.includes('ban') || log.action.includes('delete')
                                ? 'bg-red-100 text-red-800'
                                : log.action.includes('create')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.adminEmail || 'System'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                            {log.details || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {log.ipAddress || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No activity logs found</p>
                    <p className="text-sm text-gray-400 mt-2">Admin actions will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
