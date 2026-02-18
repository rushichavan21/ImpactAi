import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    cancelAnimation
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface VoiceOrbProps {
    isListening: boolean;
    onPress: () => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ isListening, onPress }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        if (isListening) {
            scale.value = withRepeat(withTiming(1.5, { duration: 1000 }), -1, true);
            opacity.value = withRepeat(withTiming(0.2, { duration: 1000 }), -1, true);
        } else {
            cancelAnimation(scale);
            cancelAnimation(opacity);
            scale.value = withTiming(1);
            opacity.value = withTiming(0.5);
        }
    }, [isListening]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={{
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    backgroundColor: '#3B82F6',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 8,
                    position: 'relative'
                }}
            >
                {/* Animated Pulse Ring */}
                {isListening && (
                    <Animated.View
                        style={[animatedStyle, {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: 48,
                            backgroundColor: '#60A5FA'
                        }]}
                    />
                )}

                {/* Icon */}
                <MaterialCommunityIcons
                    name={isListening ? "microphone" : "microphone-outline"}
                    size={40}
                    color="white"
                />
            </TouchableOpacity>

            <Text style={{ marginTop: 16, color: '#6B7280', fontWeight: '500' }}>
                {isListening ? "Listening..." : "Tap to Speak"}
            </Text>
        </View>
    );
};
