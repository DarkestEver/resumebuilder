'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resumeApi, type Resume } from '@/lib/api/resume';
import { useUser } from '@/stores/authStore';
import { Link as LinkIcon, Copy, ExternalLink, Check, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SlugManagerDialogProps {
  resume: Resume;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function SlugManagerDialog({ resume, isOpen, onClose, onUpdate }: SlugManagerDialogProps) {
  const user = useUser();
  const [slug, setSlug] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<'shortId' | 'slug' | null>(null);

  useEffect(() => {
    if (isOpen && resume) {
      setSlug(resume.slug || '');
      setValidationError(null);
    }
  }, [isOpen, resume]);

  const validateSlug = (value: string) => {
    if (!value) {
      setValidationError(null);
      return true;
    }

    // Check format: alphanumeric, hyphens, underscores only
    const slugPattern = /^[a-zA-Z0-9_-]+$/;
    if (!slugPattern.test(value)) {
      setValidationError('Only letters, numbers, hyphens, and underscores allowed');
      return false;
    }

    // Check length
    if (value.length < 3) {
      setValidationError('Slug must be at least 3 characters');
      return false;
    }

    if (value.length > 50) {
      setValidationError('Slug must be less than 50 characters');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSlugChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/\s+/g, '-');
    setSlug(sanitized);
    validateSlug(sanitized);
  };

  const generateSlugFromTitle = () => {
    const generated = resume.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
    
    setSlug(generated);
    validateSlug(generated);
    toast.success('Slug generated from title');
  };

  const handleSave = async () => {
    if (!validateSlug(slug)) return;

    setIsSaving(true);
    try {
      await resumeApi.updateResume(resume._id || resume.id || '', { 
        slug: slug || undefined 
      });
      toast.success(slug ? 'Custom slug saved!' : 'Custom slug removed');
      onUpdate();
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save slug';
      if (message.includes('duplicate') || message.includes('exists')) {
        setValidationError('This slug is already taken');
      } else {
        toast.error(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = (type: 'shortId' | 'slug') => {
    if (typeof window === 'undefined') return;
    
    let link = '';
    if (type === 'shortId' && resume.shortId) {
      link = `${window.location.origin}/r/${resume.shortId}`;
    } else if (type === 'slug' && user?.username && slug) {
      link = `${window.location.origin}/${user.username}/${slug}`;
    }

    if (link) {
      navigator.clipboard.writeText(link);
      setCopiedLink(type);
      setTimeout(() => setCopiedLink(null), 2000);
      toast.success('Link copied to clipboard!');
    }
  };

  const shortIdLink = (typeof window !== 'undefined' && resume.shortId) ? `${window.location.origin}/r/${resume.shortId}` : null;
  const slugLink = (typeof window !== 'undefined' && user?.username && slug) ? `${window.location.origin}/${user.username}/${slug}` : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Manage Resume Links
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Short ID Link (Always Available) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Short Link (Auto-generated)
            </Label>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 truncate">
                {shortIdLink || 'Not available'}
              </div>
              {shortIdLink && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyLink('shortId')}
                    className="shrink-0"
                  >
                    {copiedLink === 'shortId' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => typeof window !== 'undefined' && shortIdLink && window.open(shortIdLink, '_blank')}
                    className="shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">
              This link is automatically generated and cannot be changed
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Custom Slug */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                Custom Slug (Optional)
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateSlugFromTitle}
                className="text-xs"
              >
                Generate from title
              </Button>
            </div>
            
            {user?.username ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 shrink-0">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/{user.username}/
                  </span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSlugChange(e.target.value)}
                    placeholder="my-custom-resume"
                    className={validationError ? 'border-red-500' : ''}
                  />
                </div>
                {validationError && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {validationError}
                  </div>
                )}
                {slug && !validationError && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 truncate">
                        {slugLink}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink('slug')}
                        className="shrink-0"
                      >
                        {copiedLink === 'slug' ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      {resume.visibility === 'public' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => typeof window !== 'undefined' && slugLink && window.open(slugLink, '_blank')}
                          className="shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Create a memorable custom URL for your resume
                </p>
              </>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Username required:</strong> Please set your username in{' '}
                  <a href="/settings" className="underline hover:text-yellow-900">
                    Settings
                  </a>{' '}
                  to use custom slugs.
                </p>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for custom slugs:</h4>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Use descriptive names like "software-engineer-2024"</li>
              <li>Keep it short and memorable</li>
              <li>Only letters, numbers, hyphens, and underscores allowed</li>
              <li>Resume must be public for links to work</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !!validationError || (!!user?.username && slug === (resume.slug || ''))}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
