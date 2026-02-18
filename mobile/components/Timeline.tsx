import React from 'react';
import { View, Text, FlatList } from 'react-native';

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

const SlotItem: React.FC<{ slot: ScheduleSlot }> = ({ slot }) => (
    <View style={{
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        borderColor: '#F3F4F6',
        borderWidth: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
    }}>

        {/* Time Column */}
        <View style={{ width: 64, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E5E7EB', paddingRight: 16, marginRight: 16 }}>
            <Text style={{ color: '#1F2937', fontWeight: 'bold', fontSize: 18 }}>{slot.time}</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{slot.duration}m</Text>
        </View>

        {/* Details Column */}
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>{slot.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 6,
                    backgroundColor: getCategoryColor(slot.category)
                }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'white', textTransform: 'uppercase' }}>{slot.category}</Text>
                </View>
            </View>
        </View>

    </View>
);

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'WORK': return '#3B82F6'; // blue-500
        case 'HEALTH': return '#10B981'; // green-500
        case 'DEEP_WORK': return '#9333EA'; // purple-600
        case 'CHORES': return '#F97316'; // orange-500
        case 'LEARNING': return '#EAB308'; // yellow-500
        case 'LEISURE': return '#EC4899'; // pink-500
        default: return '#6B7280'; // gray-500
    }
};

export const Timeline: React.FC<TimelineProps> = ({ slots }) => {
    return (
        <View style={{ flex: 1, width: '100%', paddingHorizontal: 16, marginTop: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>Your Plan</Text>
            <FlatList
                data={slots}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SlotItem slot={item} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};
