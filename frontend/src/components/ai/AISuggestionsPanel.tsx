'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api/auth';
import { toast } from 'react-hot-toast';

interface Suggestion {
  section: string;
  issue: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

interface AISuggestionsPanelProps {
  resumeId: string;
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion?: (section: string, suggestion: string) => void;
}

export function AISuggestionsPanel({
  resumeId,
  isOpen,
  onClose,
  onApplySuggestion,
}: AISuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen && resumeId) {
      loadSuggestions();
    }
  }, [isOpen, resumeId]);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/advanced/${resumeId}/suggestions`);
      setSuggestions(response.data.suggestions || []);
    } catch (error: any) {
      toast.error('Failed to load AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = (index: number, section: string, suggestion: string) => {
    if (onApplySuggestion) {
      onApplySuggestion(section, suggestion);
    }
    setAppliedSuggestions((prev) => new Set(prev).add(index));
    toast.success('Suggestion applied!');
  };

  const handleDismiss = (index: number) => {
    setSuggestions((prev) => prev.filter((_, i) => i !== index));
    toast.success('Suggestion dismissed');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-amber-200 bg-amber-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Suggestions</h2>
                <p className="text-sm text-purple-100">
                  {loading ? 'Analyzing...' : `${suggestions.length} recommendations`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600">Analyzing your resume...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => {
                const isApplied = appliedSuggestions.has(index);

                return (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-5 transition-all ${getPriorityColor(
                      suggestion.priority
                    )} ${isApplied ? 'opacity-60' : ''}`}
                  >
                    {/* Section & Priority */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700 capitalize">
                          {suggestion.section}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityBadge(
                            suggestion.priority
                          )}`}
                        >
                          {suggestion.priority.toUpperCase()}
                        </span>
                      </div>
                      {isApplied && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>

                    {/* Issue */}
                    <div className="mb-3">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Issue
                          </p>
                          <p className="text-sm text-gray-800 mt-1">
                            {suggestion.issue}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Suggestion */}
                    <div className="mb-4">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Suggestion
                          </p>
                          <p className="text-sm text-gray-800 mt-1">
                            {suggestion.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {!isApplied && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleApplySuggestion(
                              index,
                              suggestion.section,
                              suggestion.suggestion
                            )
                          }
                          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => handleDismiss(index)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Looking Great!
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                Your resume is well-optimized. We'll notify you if we find any areas for improvement.
              </p>
            </div>
          )}

          {/* Refresh Button */}
          {!loading && (
            <button
              onClick={loadSuggestions}
              className="w-full mt-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Refresh Suggestions
            </button>
          )}
        </div>
      </div>
    </>
  );
}
