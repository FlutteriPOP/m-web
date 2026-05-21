import { useState, useRef, useCallback } from 'react';

export function useVideoRecorder(deviceLabel: string) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toggleRecording = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    chunksRef.current = [];
    const stream = canvas.captureStream(30);

    // Prefer MP4, fallback to WebM
    const mimeType = MediaRecorder.isTypeSupported('video/mp4')
      ? 'video/mp4'
      : 'video/webm';
    const ext = mimeType === 'video/mp4' ? 'mp4' : 'webm';

    const mr = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${deviceLabel.replace(/\s/g, '-')}-mockup.${ext}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    };

    mr.start();
    setIsRecording(true);
  }, [isRecording, deviceLabel]);

  return { isRecording, toggleRecording };
}
