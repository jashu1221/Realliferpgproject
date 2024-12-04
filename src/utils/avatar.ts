import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { compressImage } from './imageCompression';

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const fileName = `avatars/${userId}/${Date.now()}.${fileExt}`;

    // Check file type
    const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!allowedTypes.includes(fileExt)) {
      throw new Error('Invalid file type. Only JPG, PNG, GIF and WebP files are allowed.');
    }

    // Check file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      throw new Error('File size must be less than 5MB');
    }

    // Compress image if needed
    let imageFile = file;
    if (file.size > 1024 * 1024) { // Compress if larger than 1MB
      imageFile = await compressImage(file);
    }

    // Create storage reference
    const storageRef = ref(storage, fileName);

    // Upload file with metadata
    const metadata = {
      contentType: `image/${fileExt}`,
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString()
      }
    };

    // Upload file
    const snapshot = await uploadBytes(storageRef, imageFile, metadata);
    console.log('Avatar uploaded successfully:', snapshot.metadata);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;

  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    throw new Error(error.message || 'Failed to upload avatar');
  }
}