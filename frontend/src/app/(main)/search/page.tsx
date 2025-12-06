/**
 * Search & Discovery Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import searchAPI, { SearchResult, SearchFilters } from '@/lib/api/search';

export default function SearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendingSkills, setTrendingSkills] = useState<Array<{ name: string; count: number }>>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load trending skills on mount
  useEffect(() => {
    loadTrendingSkills();
  }, []);

  const loadTrendingSkills = async () => {
    try {
      const response = await searchAPI.getTrendingSkills();
      setTrendingSkills(response.data.trendingSkills);
    } catch (error) {
      console.error('Error loading trending skills:', error);
    }
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setLoading(true);
    setSearchQuery(query);
    try {
      const response = await searchAPI.search(query, filters);
      setResults(response.data.results);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrendingSkillClick = (skill: string) => {
    handleSearch(skill, {});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Discover Top Talent</h1>
          <p className="text-lg text-blue-100">
            Search through hundreds of professional resumes and find the perfect candidate
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <SearchBar onSearch={handleSearch} showFilters={true} />
        </div>

        {/* Results or Trending */}
        {showResults ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-gray-600 mt-1">Found {results.length} resume(s)</p>
            </div>
            <SearchResults results={results} loading={loading} />
          </div>
        ) : (
          <div>
            {/* Trending Skills */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Skills</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {trendingSkills.slice(0, 12).map((skill) => (
                  <button
                    key={skill.name}
                    onClick={() => handleTrendingSkillClick(skill.name)}
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-600 hover:shadow transition-all"
                  >
                    <p className="font-semibold text-gray-900">{skill.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{skill.count} resumes</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Browse by Category */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Software Engineers',
                    icon: '💻',
                    query: 'engineer',
                  },
                  {
                    title: 'Data Scientists',
                    icon: '📊',
                    query: 'data science',
                  },
                  {
                    title: 'Product Managers',
                    icon: '📱',
                    query: 'product manager',
                  },
                  {
                    title: 'Designers',
                    icon: '🎨',
                    query: 'designer',
                  },
                  {
                    title: 'Sales Professionals',
                    icon: '📈',
                    query: 'sales',
                  },
                  {
                    title: 'Marketing Experts',
                    icon: '📢',
                    query: 'marketing',
                  },
                ].map((category) => (
                  <button
                    key={category.query}
                    onClick={() => handleSearch(category.query, {})}
                    className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all text-left"
                  >
                    <p className="text-3xl mb-2">{category.icon}</p>
                    <p className="font-semibold text-gray-900">{category.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
