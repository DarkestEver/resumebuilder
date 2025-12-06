'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api/auth';
import { toast } from 'react-hot-toast';

interface CompletenessData {
  percentage: number;
  missingSections: string[];
  tips: string[];
}

interface CompletenessCheckerProps {
  resumeId: string;
  className?: string;
}

export function CompletenessChecker({ resumeId, className = '' }: CompletenessCheckerProps) {
  const [data, setData] = useState<CompletenessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resumeId) {
      loadCompleteness();
    }
  }, [resumeId]);

  const loadCompleteness = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/advanced/${resumeId}/completeness`);
      setData(response.data);
    } catch (error: any) {
      toast.error('Failed to load completeness data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-600';
    if (percentage >= 70) return 'bg-blue-600';
    if (percentage >= 50) return 'bg-amber-600';
    return 'bg-red-600';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Resume Completeness</h3>
        <p className="text-sm text-gray-600">
          {data.percentage >= 90
            ? 'Excellent! Your resume is well-detailed.'
            : data.percentage >= 70
            ? 'Good progress! A few more details will help.'
            : 'Keep going! Add more information to improve.'}
        </p>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - data.percentage / 100)}`}
              className={`${getProgressColor(data.percentage)} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${getColorClass(data.percentage)}`}>
              {data.percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Missing Sections */}
      {data.missingSections && data.missingSections.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-semibold text-gray-800">Missing Sections</h4>
          </div>
          <div className="space-y-2">
            {data.missingSections.map((section, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
              >
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                <span className="capitalize">{section}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {data.tips && data.tips.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-semibold text-gray-800">Actionable Tips</h4>
          </div>
          <div className="space-y-2">
            {data.tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
              >
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={loadCompleteness}
        className="w-full mt-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        Refresh Analysis
      </button>
    </div>
  );
}
