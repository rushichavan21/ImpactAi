export type TaskCategory = 'WORK' | 'HEALTH' | 'DEEP_WORK' | 'CHORES' | 'LEARNING' | 'LEISURE';
export type SlotType = 'BENCHMARK' | 'ACTUAL';
export type SlotStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED' | 'SKIPPED';

export interface User {
  id: string;
  email: string;
  preferences: {
    morning_start?: string; // "07:00"
    work_blocks_duration?: number; // 90 mins
  };
}

export interface Day {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  summary?: string;
  day_score?: number;
}

export interface Task {
  id: string;
  day_id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  estimated_duration: number; // minutes
}

export interface ScheduleSlot {
  id: string;
  task_id: string;
  type: SlotType;
  start_time: string; // ISO String
  end_time: string; // ISO String
  status: SlotStatus;
  
  // Only for ACTUAL
  satisfaction_rating?: number; // 1-5
  notes?: string;
}

// API Payloads
export interface PlanDayRequest {
  user_id: string;
  voice_transcript: string;
  date: string;
  current_time: string;
}

export interface PlanDayResponse {
  day_id: string;
  summary: string;
  tasks: Task[];
  benchmark_slots: ScheduleSlot[];
}
