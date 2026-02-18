import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    cancelAnimation,
    withSequence,
    Easing
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface VoiceOrbProps {
    isListening: boolean;
    onPress: () => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ isListening, onPress }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.5);
    const glowOpacity = useSharedValue(0);

    useEffect(() => {
        if (isListening) {
            // Pulse animation
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.4, { duration: 1000 }),
                    withTiming(0.1, { duration: 1000 })
                ),
                -1,
                true
            );
            glowOpacity.value = withTiming(0.6, { duration: 500 });
        } else {
            cancelAnimation(scale);
            cancelAnimation(opacity);
            scale.value = withTiming(1);
            opacity.value = withTiming(0.5);
            glowOpacity.value = withTiming(0, { duration: 300 });
        }
    }, [isListening]);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    return (
        <View className="items-center justify-center p-8">
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.9}
                className="relative items-center justify-center"
            >
                {/* Glow Effect */}
                <Animated.View
                    style={[
                        glowStyle,
                        {
                            position: 'absolute',
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            backgroundColor: '#8b5cf6', // purple-500
                            filter: 'blur(20px)', // Web/likely ignored on native without logic, using shadow instead below
                        }
                    ]}
                    className="absolute w-32 h-32 rounded-full bg-purple-500/30 blur-xl"
                />

                {/* Animated Pulse Ring */}
                {isListening && (
                    <Animated.View
                        style={[pulseStyle, {
                            position: 'absolute',
                            width: 96,
                            height: 96,
                            borderRadius: 48,
                        }]}
                    >
                        <LinearGradient
                            colors={['#8b5cf6', '#3b82f6']} // Purple to Blue
                            style={{ flex: 1, borderRadius: 48 }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                    </Animated.View>
                )}

                {/* Orb Core */}
                <View
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: 48,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#8b5cf6',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: isListening ? 0.6 : 0.3,
                        shadowRadius: 20,
                        elevation: 10,
                    }}
                >
                    <LinearGradient
                        colors={isListening ? ['#8b5cf6', '#3b82f6'] : ['#27272a', '#18181b']} // Active: Purple->Blue, Inactive: Zinc-800->900
                        style={{ width: '100%', height: '100%', borderRadius: 48, justifyContent: 'center', alignItems: 'center' }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <MaterialCommunityIcons
                            name={isListening ? "microphone" : "microphone-outline"}
                            size={40}
                            color="#fafafa" // Off-white
                        />
                    </LinearGradient>
                </View>
            </TouchableOpacity>

            <Text className="mt-4 text-zinc-400 font-medium text-base">
                {isListening ? "Listening..." : "Tap to Speak"}
            </Text>
        </View>
    );
};
