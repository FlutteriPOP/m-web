import { useCallback, useRef } from 'react';
import type { AppState } from '../types';

export function useMediaUpload(
  setState: React.Dispatch<React.SetStateAction<AppState>>
) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setState(prev => {
        if (prev.mediaUrl) URL.revokeObjectURL(prev.mediaUrl);
        return {
          ...prev,
          mediaUrl: URL.createObjectURL(file),
          mediaType: file.type.startsWith('video/') ? 'video' : 'image',
          mediaFileName: file.name,
        };
      });
    },
    [setState]
  );

  return { fileInputRef, openFilePicker, handleFileChange };
}
