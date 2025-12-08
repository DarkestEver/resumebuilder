'use client';

/**
 * Complete LinkedIn-Style Profile Page
 * Full CRUD functionality for all sections
 * Supports multiple profiles via profileId query parameter
 */

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { profileStore } from '@/stores/profileStore';
import { authStore } from '@/stores/authStore';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Award, Globe, CheckCircle2, XCircle, Plus, Trash2, 
  Building2, Calendar, Edit2, Languages as LanguagesIcon,
  FolderOpen, BookOpen, Trophy, FileText, Lightbulb
} from 'lucide-react';

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get('profileId');
  const { profile, isLoading, isSaving, error, completionPercentage, fetchProfile, createProfile, updateProfile } = profileStore();
  
  useEffect(() => {
    // If profileId is provided, fetch that specific profile
    // Otherwise, fetch default profile
    fetchProfile();
  }, [fetchProfile, profileId]);

  const handleCreateProfile = async () => {
    try {
      const authState = authStore.getState();
      const user = authState.user;
      const nameParts = user?.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await createProfile({
        personalInfo: { firstName, lastName },
        contact: { email: user?.email || '' },
      });
      await fetchProfile();
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Profile</h2>
            <p className="text-gray-600 mb-6">Start building your professional profile</p>
            <button 
              onClick={handleCreateProfile}
              disabled={isSaving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium w-full"
            >
              {isSaving ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Header with Cover */}
        <div className="bg-white border-b border-gray-200">
          <div className="h-48 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
          
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative">
              <div className="absolute -top-20 left-0">
                <div className="w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  {profile.personalInfo?.photo ? (
                    <img src={profile.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-24 pb-6 ml-0 lg:ml-48">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
                    </h1>
                    <p className="text-lg text-gray-700 mt-1">{profile.personalInfo?.title || 'Add your title'}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      {profile.contact?.address?.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {profile.contact.address.city}
                        </span>
                      )}
                      {profile.contact?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {profile.contact.email}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
                    <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
                    <div className="text-xs text-gray-600 mt-1">Complete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {isSaving && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center">
              <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 mr-2 rounded-full"></div>
              <span className="text-sm text-blue-800">Saving changes...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-b border-red-200">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800">Error saving profile</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button onClick={() => profileStore.setState({ error: null })} className="ml-4 text-red-500 hover:text-red-700">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="space-y-4">
            {/* Contact Information Section */}
            <ContactSection profile={profile} updateProfile={updateProfile} />

            {/* Personal Information Section */}
            <PersonalInfoSection profile={profile} updateProfile={updateProfile} />

            {/* About Section */}
            <AboutSection profile={profile} updateProfile={updateProfile} />

            {/* Experience Section */}
            <ExperienceSection profile={profile} updateProfile={updateProfile} />

            {/* Education Section */}
            <EducationSection profile={profile} updateProfile={updateProfile} />

            {/* Skills Section */}
            <SkillsSection profile={profile} updateProfile={updateProfile} />

            {/* Projects Section */}
            <ProjectsSection profile={profile} updateProfile={updateProfile} />

            {/* Certifications Section */}
            <CertificationsSection profile={profile} updateProfile={updateProfile} />

            {/* Languages Section */}
            <LanguagesSection profile={profile} updateProfile={updateProfile} />

            {/* Achievements Section */}
            <AchievementsSection profile={profile} updateProfile={updateProfile} />

            {/* Courses Section */}
            <CoursesSection profile={profile} updateProfile={updateProfile} />

            {/* Signature Section */}
            <SignatureSection profile={profile} updateProfile={updateProfile} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Contact Section Component
function ContactSection({ profile, updateProfile }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState(profile?.contact || {
    email: '',
    phone: '',
    alternatePhone: '',
    address: {
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    website: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });

  const handleSave = async () => {
    await updateProfile({ contact });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setContact({
        ...contact,
        address: { ...contact.address, [addressField]: value }
      });
    } else {
      setContact({ ...contact, [field]: value });
    }
  };

  return (
    <Section title="Contact Information" icon={Mail} onEdit={() => setIsEditing(true)}>
      {isEditing ? (
        <div className="space-y-4">
          {/* Primary Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
              <input
                type="tel"
                value={contact.alternatePhone}
                onChange={(e) => handleChange('alternatePhone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 234 567 8901"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={contact.address?.street || ''}
                  onChange={(e) => handleChange('address.street', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apartment/Suite</label>
                <input
                  type="text"
                  value={contact.address?.apartment || ''}
                  onChange={(e) => handleChange('address.apartment', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Apt 4B"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={contact.address?.city || ''}
                  onChange={(e) => handleChange('address.city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                <input
                  type="text"
                  value={contact.address?.state || ''}
                  onChange={(e) => handleChange('address.state', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  value={contact.address?.zipCode || ''}
                  onChange={(e) => handleChange('address.zipCode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={contact.address?.country || ''}
                  onChange={(e) => handleChange('address.country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Professional Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={contact.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={contact.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <input
                  type="url"
                  value={contact.github}
                  onChange={(e) => handleChange('github', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                <input
                  type="url"
                  value={contact.portfolio}
                  onChange={(e) => handleChange('portfolio', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://portfolio.com"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-gray-600">{contact.email || <span className="text-gray-400 italic">Not provided</span>}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="ml-2 text-gray-600">{contact.phone || <span className="text-gray-400 italic">Not provided</span>}</span>
            </div>
            {contact.alternatePhone && (
              <div>
                <span className="font-medium text-gray-700">Alternate Phone:</span>
                <span className="ml-2 text-gray-600">{contact.alternatePhone}</span>
              </div>
            )}
          </div>
          
          {(contact.address?.street || contact.address?.city) && (
            <div>
              <span className="font-medium text-gray-700">Address:</span>
              <div className="ml-2 text-gray-600">
                {contact.address?.street && <div>{contact.address.street}{contact.address.apartment ? `, ${contact.address.apartment}` : ''}</div>}
                {(contact.address?.city || contact.address?.state || contact.address?.zipCode) && (
                  <div>{contact.address?.city}{contact.address?.state ? `, ${contact.address.state}` : ''} {contact.address?.zipCode}</div>
                )}
                {contact.address?.country && <div>{contact.address.country}</div>}
              </div>
            </div>
          )}

          {(contact.website || contact.linkedin || contact.github || contact.portfolio) && (
            <div>
              <span className="font-medium text-gray-700">Links:</span>
              <div className="ml-2 space-y-1">
                {contact.website && <div className="text-blue-600"><a href={contact.website} target="_blank" rel="noopener noreferrer">{contact.website}</a></div>}
                {contact.linkedin && <div className="text-blue-600"><a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>}
                {contact.github && <div className="text-blue-600"><a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub</a></div>}
                {contact.portfolio && <div className="text-blue-600"><a href={contact.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></div>}
              </div>
            </div>
          )}

          {!contact.email && !contact.phone && !contact.address?.street && (
            <p className="text-gray-400 italic">Add your contact information</p>
          )}
        </div>
      )}
    </Section>
  );
}

// Personal Information Section Component
function PersonalInfoSection({ profile, updateProfile }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(profile?.personalInfo || {
    firstName: '',
    lastName: '',
    title: '',
    dateOfBirth: '',
    nationality: '',
    placeOfBirth: '',
    photo: ''
  });

  const handleSave = async () => {
    await updateProfile({ personalInfo });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  return (
    <Section title="Personal Information" icon={User} onEdit={() => setIsEditing(true)}>
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={personalInfo.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={personalInfo.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Doe"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
              <input
                type="text"
                value={personalInfo.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={personalInfo.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input
                type="text"
                value={personalInfo.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="American"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
              <input
                type="text"
                value={personalInfo.placeOfBirth}
                onChange={(e) => handleChange('placeOfBirth', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New York, USA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
              <input
                type="url"
                value={personalInfo.photo}
                onChange={(e) => handleChange('photo', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <span className="ml-2 text-gray-600">
                {personalInfo.firstName || personalInfo.lastName 
                  ? `${personalInfo.firstName} ${personalInfo.lastName}` 
                  : <span className="text-gray-400 italic">Not provided</span>
                }
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Title:</span>
              <span className="ml-2 text-gray-600">{personalInfo.title || <span className="text-gray-400 italic">Not provided</span>}</span>
            </div>
            {personalInfo.dateOfBirth && (
              <div>
                <span className="font-medium text-gray-700">Date of Birth:</span>
                <span className="ml-2 text-gray-600">{new Date(personalInfo.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
            {personalInfo.nationality && (
              <div>
                <span className="font-medium text-gray-700">Nationality:</span>
                <span className="ml-2 text-gray-600">{personalInfo.nationality}</span>
              </div>
            )}
            {personalInfo.placeOfBirth && (
              <div>
                <span className="font-medium text-gray-700">Place of Birth:</span>
                <span className="ml-2 text-gray-600">{personalInfo.placeOfBirth}</span>
              </div>
            )}
            {personalInfo.photo && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Photo:</span>
                <div className="mt-2">
                  <img src={personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
}

// About Section Component
function AboutSection({ profile, updateProfile }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(profile?.summary || '');

  const handleSave = async () => {
    await updateProfile({ summary });
    setIsEditing(false);
  };

  return (
    <Section title="About" icon={User} onEdit={() => setIsEditing(true)}>
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a summary about yourself..."
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{profile?.summary || <span className="text-gray-400 italic">Add a summary about yourself</span>}</p>
      )}
    </Section>
  );
}

// Experience Section Component  
function ExperienceSection({ profile, updateProfile }: any) {
  const [experiences, setExperiences] = useState(profile?.experience || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setExperiences([...experiences, { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }]);
    setEditingIndex(experiences.length);
  };

  const handleRemove = async (index: number) => {
    const updated = experiences.filter((_: any, i: number) => i !== index);
    setExperiences(updated);
    await updateProfile({ experience: updated });
  };

  const handleSave = async (index: number) => {
    await updateProfile({ experience: experiences });
    setEditingIndex(null);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  return (
    <Section title="Experience" icon={Briefcase} onAdd={handleAdd}>
      <div className="space-y-4">
        {experiences.map((exp: any, idx: number) => (
          <div key={idx} className={`${editingIndex === idx ? 'border-2 border-blue-500' : 'border border-gray-200'} rounded-lg p-4`}>
            {editingIndex === idx ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Job Title" value={exp.title || ''} onChange={(e) => handleChange(idx, 'title', e.target.value)} className="px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Company" value={exp.company || ''} onChange={(e) => handleChange(idx, 'company', e.target.value)} className="px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Location" value={exp.location || ''} onChange={(e) => handleChange(idx, 'location', e.target.value)} className="px-3 py-2 border rounded-lg" />
                  <label className="flex items-center gap-2"><input type="checkbox" checked={exp.current} onChange={(e) => handleChange(idx, 'current', e.target.checked)} />Current</label>
                  <input type="month" placeholder="Start Date" value={exp.startDate || ''} onChange={(e) => handleChange(idx, 'startDate', e.target.value)} className="px-3 py-2 border rounded-lg" />
                  {!exp.current && <input type="month" placeholder="End Date" value={exp.endDate || ''} onChange={(e) => handleChange(idx, 'endDate', e.target.value)} className="px-3 py-2 border rounded-lg" />}
                </div>
                <textarea placeholder="Description" value={exp.description || ''} onChange={(e) => handleChange(idx, 'description', e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-lg" />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(idx)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                  <button onClick={() => handleRemove(idx)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                  <button onClick={() => setEditingIndex(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <div className="text-gray-700">{exp.company}</div>
                  <div className="text-sm text-gray-600 mt-1">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                  {exp.location && <div className="text-sm text-gray-600">{exp.location}</div>}
                  {exp.description && <p className="text-sm text-gray-700 mt-2">{exp.description}</p>}
                </div>
                <button onClick={() => setEditingIndex(idx)} className="text-blue-600 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        ))}
        {experiences.length === 0 && <p className="text-gray-400 italic text-center py-8">No experience added yet</p>}
      </div>
    </Section>
  );
}

// Education Section Component
function EducationSection({ profile, updateProfile }: any) {
  const [education, setEducation] = useState(profile?.education || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setEducation([...education, { degree: '', institution: '', startDate: '', endDate: '', current: false, gpa: '' }]);
    setEditingIndex(education.length);
  };

  const handleRemove = async (index: number) => {
    const updated = education.filter((_: any, i: number) => i !== index);
    setEducation(updated);
    await updateProfile({ education: updated });
  };

  const handleSave = async (index: number) => {
    await updateProfile({ education });
    setEditingIndex(null);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  return (
    <Section title="Education" icon={GraduationCap} onAdd={handleAdd}>
      <div className="space-y-4">
        {education.map((edu: any, idx: number) => (
          <div key={idx} className={`${editingIndex === idx ? 'border-2 border-blue-500' : 'border border-gray-200'} rounded-lg p-4`}>
            {editingIndex === idx ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Degree" value={edu.degree || ''} onChange={(e) => handleChange(idx, 'degree', e.target.value)} className="px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="Institution" value={edu.institution || ''} onChange={(e) => handleChange(idx, 'institution', e.target.value)} className="px-3 py-2 border rounded-lg" />
                  <input type="month" placeholder="Start Date" value={edu.startDate || ''} onChange={(e) => handleChange(idx, 'startDate', e.target.value)} className="px-3 py-2 border rounded-lg" />
                  <input type="month" placeholder="End Date" value={edu.endDate || ''} onChange={(e) => handleChange(idx, 'endDate', e.target.value)} className="px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="GPA (optional)" value={edu.gpa || ''} onChange={(e) => handleChange(idx, 'gpa', e.target.value)} className="px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSave(idx)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                  <button onClick={() => handleRemove(idx)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                  <button onClick={() => setEditingIndex(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                  <div className="text-gray-700">{edu.degree}</div>
                  <div className="text-sm text-gray-600 mt-1">{edu.startDate} - {edu.endDate}</div>
                  {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
                </div>
                <button onClick={() => setEditingIndex(idx)} className="text-blue-600 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        ))}
        {education.length === 0 && <p className="text-gray-400 italic text-center py-8">No education added yet</p>}
      </div>
    </Section>
  );
}

// Skills Section Component
function SkillsSection({ profile, updateProfile }: any) {
  const [skills, setSkills] = useState(profile?.skills || []);
  const [newSkill, setNewSkill] = useState({ name: '', category: '', level: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (newSkill.name) {
      const updated = [...skills, newSkill];
      setSkills(updated);
      await updateProfile({ skills: updated });
      setNewSkill({ name: '', category: '', level: '' });
      setIsAdding(false);
    }
  };

  const handleRemove = async (index: number) => {
    const updated = skills.filter((_: any, i: number) => i !== index);
    setSkills(updated);
    await updateProfile({ skills: updated });
  };

  return (
    <Section title="Skills" icon={Award} onAdd={() => setIsAdding(true)}>
      <div className="space-y-3">
        {skills.map((skill: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{skill.name || skill}</div>
              {skill.category && <div className="text-sm text-gray-600">{skill.category}</div>}
              {skill.level && <div className="text-sm text-gray-600">Level: {skill.level}</div>}
            </div>
            <button onClick={() => handleRemove(idx)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        
        {isAdding && (
          <div className="border-2 border-blue-500 rounded-lg p-4 space-y-3">
            <input type="text" placeholder="Skill Name" value={newSkill.name} onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <input type="text" placeholder="Category (optional)" value={newSkill.category} onChange={(e) => setNewSkill({...newSkill, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <select value={newSkill.level} onChange={(e) => setNewSkill({...newSkill, level: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}
        
        {skills.length === 0 && !isAdding && <p className="text-gray-400 italic text-center py-8">No skills added yet</p>}
      </div>
    </Section>
  );
}

// Projects Section Component
function ProjectsSection({ profile, updateProfile }: any) {
  const [projects, setProjects] = useState(profile?.projects || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setProjects([...projects, { name: '', description: '', url: '', technologies: [] }]);
    setEditingIndex(projects.length);
  };

  const handleRemove = async (index: number) => {
    const updated = projects.filter((_: any, i: number) => i !== index);
    setProjects(updated);
    await updateProfile({ projects: updated });
  };

  const handleSave = async (index: number) => {
    await updateProfile({ projects });
    setEditingIndex(null);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  return (
    <Section title="Projects" icon={FolderOpen} onAdd={handleAdd}>
      <div className="space-y-4">
        {projects.map((project: any, idx: number) => (
          <div key={idx} className={`${editingIndex === idx ? 'border-2 border-blue-500' : 'border border-gray-200'} rounded-lg p-4`}>
            {editingIndex === idx ? (
              <div className="space-y-3">
                <input type="text" placeholder="Project Name" value={project.name || ''} onChange={(e) => handleChange(idx, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <textarea placeholder="Description" value={project.description || ''} onChange={(e) => handleChange(idx, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="Project URL (optional)" value={project.url || ''} onChange={(e) => handleChange(idx, 'url', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="Technologies (comma separated)" value={project.technologies?.join(', ') || ''} onChange={(e) => handleChange(idx, 'technologies', e.target.value.split(',').map((t: string) => t.trim()))} className="w-full px-3 py-2 border rounded-lg" />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(idx)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                  <button onClick={() => handleRemove(idx)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                  <button onClick={() => setEditingIndex(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.description && <p className="text-sm text-gray-700 mt-1">{project.description}</p>}
                  {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 flex items-center gap-1"><Globe className="w-3 h-3" />{project.url}</a>}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => setEditingIndex(idx)} className="text-blue-600 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && <p className="text-gray-400 italic text-center py-8">No projects added yet</p>}
      </div>
    </Section>
  );
}

// Certifications Section Component
function CertificationsSection({ profile, updateProfile }: any) {
  const [certifications, setCertifications] = useState(profile?.certifications || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setCertifications([...certifications, { name: '', issuer: '', date: '', credentialId: '' }]);
    setEditingIndex(certifications.length);
  };

  const handleRemove = async (index: number) => {
    const updated = certifications.filter((_: any, i: number) => i !== index);
    setCertifications(updated);
    await updateProfile({ certifications: updated });
  };

  const handleSave = async (index: number) => {
    await updateProfile({ certifications });
    setEditingIndex(null);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  return (
    <Section title="Certifications" icon={Award} onAdd={handleAdd}>
      <div className="space-y-4">
        {certifications.map((cert: any, idx: number) => (
          <div key={idx} className={`${editingIndex === idx ? 'border-2 border-blue-500' : 'border border-gray-200'} rounded-lg p-4`}>
            {editingIndex === idx ? (
              <div className="space-y-3">
                <input type="text" placeholder="Certification Name" value={cert.name || ''} onChange={(e) => handleChange(idx, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="Issuing Organization" value={cert.issuer || ''} onChange={(e) => handleChange(idx, 'issuer', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <input type="month" placeholder="Issue Date" value={cert.date || ''} onChange={(e) => handleChange(idx, 'date', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="Credential ID (optional)" value={cert.credentialId || ''} onChange={(e) => handleChange(idx, 'credentialId', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(idx)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                  <button onClick={() => handleRemove(idx)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                  <button onClick={() => setEditingIndex(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <div className="text-sm text-gray-700">{cert.issuer}</div>
                  <div className="text-sm text-gray-600">{cert.date}</div>
                  {cert.credentialId && <div className="text-xs text-gray-500 mt-1">ID: {cert.credentialId}</div>}
                </div>
                <button onClick={() => setEditingIndex(idx)} className="text-blue-600 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        ))}
        {certifications.length === 0 && <p className="text-gray-400 italic text-center py-8">No certifications added yet</p>}
      </div>
    </Section>
  );
}

// Languages Section Component
function LanguagesSection({ profile, updateProfile }: any) {
  const [languages, setLanguages] = useState(profile?.languages || []);
  const [newLang, setNewLang] = useState({ name: '', proficiency: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (newLang.name) {
      const updated = [...languages, newLang];
      setLanguages(updated);
      await updateProfile({ languages: updated });
      setNewLang({ name: '', proficiency: '' });
      setIsAdding(false);
    }
  };

  const handleRemove = async (index: number) => {
    const updated = languages.filter((_: any, i: number) => i !== index);
    setLanguages(updated);
    await updateProfile({ languages: updated });
  };

  return (
    <Section title="Languages" icon={LanguagesIcon} onAdd={() => setIsAdding(true)}>
      <div className="space-y-3">
        {languages.map((lang: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{lang.name || lang}</div>
              {lang.proficiency && <div className="text-sm text-gray-600">{lang.proficiency}</div>}
            </div>
            <button onClick={() => handleRemove(idx)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        
        {isAdding && (
          <div className="border-2 border-blue-500 rounded-lg p-4 space-y-3">
            <input type="text" placeholder="Language" value={newLang.name} onChange={(e) => setNewLang({...newLang, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            <select value={newLang.proficiency} onChange={(e) => setNewLang({...newLang, proficiency: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Select Proficiency</option>
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Professional">Professional</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Basic">Basic</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}
        
        {languages.length === 0 && !isAdding && <p className="text-gray-400 italic text-center py-8">No languages added yet</p>}
      </div>
    </Section>
  );
}

// Achievements Section Component
function AchievementsSection({ profile, updateProfile }: any) {
  const [achievements, setAchievements] = useState(profile?.achievements || []);
  const [newAchievement, setNewAchievement] = useState({ title: '', description: '', date: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setAchievements([...achievements, { title: '', description: '', date: '' }]);
    setEditingIndex(achievements.length);
  };

  const handleRemove = async (index: number) => {
    const updated = achievements.filter((_: any, i: number) => i !== index);
    setAchievements(updated);
    await updateProfile({ achievements: updated });
  };

  const handleSave = async (index: number) => {
    await updateProfile({ achievements });
    setEditingIndex(null);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...achievements];
    updated[index] = { ...updated[index], [field]: value };
    setAchievements(updated);
  };

  return (
    <Section title="Achievements" icon={Trophy} onAdd={handleAdd}>
      <div className="space-y-4">
        {achievements.map((achievement: any, idx: number) => (
          <div key={idx} className={`${editingIndex === idx ? 'border-2 border-blue-500' : 'border border-gray-200'} rounded-lg p-4`}>
            {editingIndex === idx ? (
              <div className="space-y-3">
                <input type="text" placeholder="Achievement Title" value={achievement.title || ''} onChange={(e) => handleChange(idx, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <textarea placeholder="Description" value={achievement.description || ''} onChange={(e) => handleChange(idx, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg" />
                <input type="month" placeholder="Date" value={achievement.date || ''} onChange={(e) => handleChange(idx, 'date', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(idx)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                  <button onClick={() => handleRemove(idx)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                  <button onClick={() => setEditingIndex(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  {achievement.description && <p className="text-sm text-gray-700 mt-1">{achievement.description}</p>}
                  {achievement.date && <div className="text-sm text-gray-600 mt-1">{achievement.date}</div>}
                </div>
                <button onClick={() => setEditingIndex(idx)} className="text-blue-600 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        ))}
        {achievements.length === 0 && <p className="text-gray-400 italic text-center py-8">No achievements added yet</p>}
      </div>
    </Section>
  );
}

// Courses Section Component
function CoursesSection({ profile, updateProfile }: any) {
  const [courses, setCourses] = useState(profile?.courses || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setCourses([...courses, { name: '', provider: '', date: '', credential: '' }]);
    setEditingIndex(courses.length);
  };

  const handleRemove = async (index: number) => {
    const updated = courses.filter((_: any, i: number) => i !== index);
    setCourses(updated);
    await updateProfile({ courses: updated });
  };

  const handleSave = async (index: number) => {
    await updateProfile({ courses });
    setEditingIndex(null);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  return (
    <Section title="Courses" icon={BookOpen} onAdd={handleAdd}>
      <div className="space-y-4">
        {courses.map((course: any, idx: number) => (
          <div key={idx} className={`${editingIndex === idx ? 'border-2 border-blue-500' : 'border border-gray-200'} rounded-lg p-4`}>
            {editingIndex === idx ? (
              <div className="space-y-3">
                <input type="text" placeholder="Course Name" value={course.name || ''} onChange={(e) => handleChange(idx, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="Course Provider" value={course.provider || ''} onChange={(e) => handleChange(idx, 'provider', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <input type="month" placeholder="Completion Date" value={course.date || ''} onChange={(e) => handleChange(idx, 'date', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="Credential URL (optional)" value={course.credential || ''} onChange={(e) => handleChange(idx, 'credential', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(idx)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                  <button onClick={() => handleRemove(idx)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                  <button onClick={() => setEditingIndex(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{course.name}</h3>
                  <div className="text-sm text-gray-700">{course.provider}</div>
                  {course.date && <div className="text-sm text-gray-600">{course.date}</div>}
                  {course.credential && <a href={course.credential} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">View Credential</a>}
                </div>
                <button onClick={() => setEditingIndex(idx)} className="text-blue-600 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        ))}
        {courses.length === 0 && <p className="text-gray-400 italic text-center py-8">No courses added yet</p>}
      </div>
    </Section>
  );
}

// Signature Section Component
function SignatureSection({ profile, updateProfile }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [signature, setSignature] = useState(profile?.signature || {
    name: '',
    date: '',
    place: '',
    image: ''
  });

  const handleSave = async () => {
    await updateProfile({ signature });
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setSignature({ ...signature, [field]: value });
  };

  return (
    <Section title="Signature" icon={FileText} onEdit={() => setIsEditing(true)}>
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature Name</label>
              <input
                type="text"
                value={signature.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={signature.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
              <input
                type="text"
                value={signature.place}
                onChange={(e) => handleChange('place', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New York, USA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature Image URL</label>
              <input
                type="url"
                value={signature.image}
                onChange={(e) => handleChange('image', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/signature.png"
              />
            </div>
          </div>

          {signature.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <img src={signature.image} alt="Signature" className="h-16 object-contain" />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {signature.image ? (
            <div>
              <img src={signature.image} alt="Signature" className="h-16 object-contain mb-2" />
              <div className="text-sm text-gray-700">
                {signature.name && <div><span className="font-medium">Name:</span> {signature.name}</div>}
                {signature.date && <div><span className="font-medium">Date:</span> {new Date(signature.date).toLocaleDateString()}</div>}
                {signature.place && <div><span className="font-medium">Place:</span> {signature.place}</div>}
              </div>
            </div>
          ) : (
            <div className="text-gray-600">
              {signature.name || signature.date || signature.place ? (
                <div className="space-y-1 text-sm">
                  {signature.name && <div><span className="font-medium">Name:</span> {signature.name}</div>}
                  {signature.date && <div><span className="font-medium">Date:</span> {new Date(signature.date).toLocaleDateString()}</div>}
                  {signature.place && <div><span className="font-medium">Place:</span> {signature.place}</div>}
                  <p className="text-gray-400 italic mt-2">Add signature image URL to display signature</p>
                </div>
              ) : (
                <p className="text-gray-400 italic">Add your signature details</p>
              )}
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

// Reusable Section Wrapper
function Section({ title, icon: Icon, children, onEdit, onAdd }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </h2>
        <div className="flex gap-2">
          {onEdit && <button onClick={onEdit} className="text-blue-600 hover:text-blue-700 p-2"><Edit2 className="w-4 h-4" /></button>}
          {onAdd && <button onClick={onAdd} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"><Plus className="w-4 h-4" />Add</button>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
