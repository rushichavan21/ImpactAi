import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

export type ScheduleSlot = {
    id: string;
    time: string;
    title: string;
    duration: number;
    type: 'BENCHMARK';
    category: string;
};

interface TimelineProps {
    slots: ScheduleSlot[];
}

const SlotItem: React.FC<{ slot: ScheduleSlot; index: number }> = ({ slot, index }) => (
    <Animated.View
        entering={FadeInDown.delay(index * 100).springify()}
        style={{ marginBottom: 16, overflow: 'hidden', borderRadius: 16 }}
    >
        <BlurView intensity={20} tint="dark" style={{
            flexDirection: 'row',
            padding: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            alignItems: 'center',
        }}>

            {/* Time Column */}
            <View style={{ width: 64, alignItems: 'center', borderRightWidth: 1, borderRightColor: 'rgba(255, 255, 255, 0.1)', paddingRight: 16, marginRight: 16 }}>
                <Text style={{ color: '#fafafa', fontWeight: 'bold', fontSize: 18 }}>{slot.time}</Text>
                <Text style={{ color: '#a1a1aa', fontSize: 12 }}>{slot.duration}m</Text>
            </View>

            {/* Details Column */}
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#fafafa' }}>{slot.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                    <View style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                        backgroundColor: getCategoryColor(slot.category, 0.2),
                        borderWidth: 1,
                        borderColor: getCategoryColor(slot.category, 0.5)
                    }}>
                        <Text style={{
                            fontSize: 10,
                            fontWeight: 'bold',
                            color: getCategoryColor(slot.category, 1),
                            textTransform: 'uppercase',
                            letterSpacing: 0.5
                        }}>
                            {slot.category}
                        </Text>
                    </View>
                </View>
            </View>

        </BlurView>
    </Animated.View>
);

const getCategoryColor = (category: string, opacity: number = 1) => {
    let color = '';
    switch (category) {
        case 'WORK': color = '59, 130, 246'; break; // blue-500
        case 'HEALTH': color = '16, 185, 129'; break; // green-500
        case 'DEEP_WORK': color = '147, 51, 234'; break; // purple-600
        case 'CHORES': color = '249, 115, 22'; break; // orange-500
        case 'LEARNING': color = '234, 179, 8'; break; // yellow-500
        case 'LEISURE': color = '236, 72, 153'; break; // pink-500
        default: color = '107, 114, 128'; break; // gray-500
    }
    return `rgba(${color}, ${opacity})`;
};

export const Timeline: React.FC<TimelineProps> = ({ slots }) => {
    return (
        <View style={{ flex: 1, width: '100%', paddingHorizontal: 16, marginTop: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fafafa', marginBottom: 16 }}>Your Plan</Text>
            <FlatList
                data={slots}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <SlotItem slot={item} index={index} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};
