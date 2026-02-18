import React, { useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { uploadAudio } from '../services/api';
import { VoiceOrb } from '../components/VoiceOrb';
import { Timeline, ScheduleSlot } from '../components/Timeline';

export default function HomeScreen() {
    const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
    const [isLoading, setIsLoading] = useState(false);
    const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);

    const handleVoiceInteraction = async () => {
        if (isRecording) {
            // Stop and Process
            const uri = await stopRecording();
            if (uri) {
                setIsLoading(true);
                try {
                    const result = await uploadAudio(uri);
                    console.log("API Result:", result);
                    if (result.benchmark_slots) {
                        setSchedule(result.benchmark_slots);
                    } else {
                        Alert.alert("No Plan Generated", "The AI couldn't generate a plan from your audio.");
                    }
                } catch (error) {
                    Alert.alert("Error", "Failed to upload audio or generate plan.");
                } finally {
                    setIsLoading(false);
                }
            }
        } else {
            // Start Recording
            await startRecording();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, alignItems: 'center', paddingTop: 40 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>ImpactAi</Text>
                <Text style={{ color: '#6B7280', marginBottom: 32 }}>Plan your day with your voice</Text>

                <View style={{ height: 256, justifyContent: 'center', alignItems: 'center' }}>
                    {isLoading ? (
                        <View style={{ alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#3B82F6" />
                            <Text style={{ marginTop: 16, color: '#3B82F6', fontWeight: '500' }}>Generating Plan...</Text>
                        </View>
                    ) : (
                        <VoiceOrb
                            isListening={isRecording}
                            onPress={handleVoiceInteraction}
                        />
                    )}
                </View>

                {schedule.length > 0 && (
                    <Timeline slots={schedule} />
                )}
            </View>
        </SafeAreaView>
    );
}
