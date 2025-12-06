/**
 * SearchBar Component
 * Provides search with autocomplete and filters
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import searchAPI from '@/lib/api/search';

interface SearchBarProps {
  onSearch?: (query: string, filters: any) => void;
  onSuggestionSelect?: (suggestion: string) => void;
  showFilters?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSuggestionSelect,
  showFilters = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: '',
    sortBy: 'recent' as const,
  });
  const [loading, setLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions on input change
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          setLoading(true);
          const response = await searchAPI.getSuggestions(query, 'skills');
          setSuggestions(response.data.suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, filters);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative">
        {/* Search Input */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for resumes, skills, locations..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
              >
                {loading && (
                  <div className="p-3 text-center text-gray-500">Loading...</div>
                )}

                {!loading && suggestions.length === 0 && (
                  <div className="p-3 text-center text-gray-500">No suggestions found</div>
                )}

                {!loading && suggestions.length > 0 && (
                  <>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-gray-800">{suggestion}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., New York"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Viewed</option>
                <option value="relevance">Most Relevant</option>
              </select>
            </div>

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Required Skills
              </label>
              <input
                type="text"
                placeholder="e.g., React, Python"
                value={filters.skills?.join(', ') || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    skills: e.target.value.split(',').map(s => s.trim()).filter(s => s),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
