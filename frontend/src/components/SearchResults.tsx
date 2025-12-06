/**
 * Search Results Component
 * Displays search results with detailed resume cards
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { SearchResult } from '@/lib/api/search';

interface SearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
  onViewResume?: (id: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  onViewResume,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="mt-4 text-lg font-semibold text-gray-900">No results found</p>
        <p className="mt-2 text-gray-600">Try adjusting your search filters or query</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result._id}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {result.profile.personalInfo?.firstName} {result.profile.personalInfo?.lastName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {result.profile.personalInfo?.title || 'Professional'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Resume: {result.title}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{result.viewCount}</p>
                <p className="text-xs text-gray-600">views</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{result.downloadCount}</p>
                <p className="text-xs text-gray-600">downloads</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          {result.profile.summary && (
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {result.profile.summary}
            </p>
          )}

          {/* Experience */}
          {result.experience && result.experience.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">EXPERIENCE</p>
              <div className="space-y-1">
                {result.experience.slice(0, 2).map((exp, idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    {exp.title} at {exp.company}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {result.skills && result.skills.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">SKILLS</p>
              <div className="flex flex-wrap gap-2">
                {result.skills.slice(0, 5).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
                {result.skills.length > 5 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    +{result.skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
            <Link
              href={`/public/${result._id}`}
              className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
              onClick={() => onViewResume?.(result._id)}
            >
              View Resume
            </Link>
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Save
            </button>
          </div>

          {/* Date */}
          <p className="text-xs text-gray-400 mt-3">
            Posted {new Date(result.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
