/**
 * Videos page - Browse and watch videos
 */

import VideoGallery from '@/components/VideoGallery';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Profiles | Resume Builder',
  description: 'Watch professional video introductions from talented professionals around the world.',
};

export default function VideosPage() {
  return <VideoGallery />;
}
