import { useState, useRef, useCallback } from 'react';

export function useVideoRecorder(deviceLabel: string) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback((filenameSuffix: string = 'mockup') => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return false;

    chunksRef.current = [];
    const stream = canvas.captureStream(30);

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
      link.download = `${deviceLabel.replace(/\s/g, '-')}-${filenameSuffix}.${ext}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    };

    mr.start();
    setIsRecording(true);
    return true;
  }, [deviceLabel]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const startTemplateRecording = useCallback((durationMs: number, templateName: string) => {
    const started = startRecording(`intro-${templateName}`);
    if (started) {
      setTimeout(() => {
        stopRecording();
      }, durationMs);
    }
  }, [startRecording, stopRecording]);

  return { isRecording, toggleRecording, startTemplateRecording };
}
