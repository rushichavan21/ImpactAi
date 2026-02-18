import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export type VoiceRecorderState = {
  isRecording: boolean;
  recordingUri: string | null;
  hasPermission: boolean;
  durationMillis: number;
};

export const useVoiceRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    recordingUri: null,
    hasPermission: false,
    durationMillis: 0,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setState((prev) => ({ ...prev, hasPermission: status === 'granted' }));
    })();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isRecording && recording) {
        interval = setInterval(async () => {
            const status = await recording.getStatusAsync();
            if (status.canRecord) {
                setState((prev) => ({ ...prev, durationMillis: status.durationMillis }));
            }
        }, 500);
    }
    return () => clearInterval(interval);
  }, [state.isRecording, recording]);


  const startRecording = async () => {
    try {
      if (!state.hasPermission) {
         const { status } = await Audio.requestPermissionsAsync();
         if (status !== 'granted') return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setState((prev) => ({ ...prev, isRecording: true, recordingUri: null, durationMillis: 0 }));
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      setRecording(null);
      setState((prev) => ({ ...prev, isRecording: false, recordingUri: uri }));
      
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      return uri;
    } catch (err) {
        console.error('Failed to stop recording', err);
        return null;
    }
  };

  return {
    ...state,
    startRecording,
    stopRecording,
  };
};
