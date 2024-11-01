import { TimeSlot } from 'src/app/core/model/entities/time-slot';

export function inRange(timeInMinutes: number, [startTime, endTime]: [number, number]): boolean {
  return timeInMinutes >= startTime && timeInMinutes <= endTime;
}

// TODO: put that to util
// Converting [01:15] to 75
export function timeToMinutes(time: [number, number], duration: number = 0): number {
  return time[0] * 60 + time[1] + duration;
}

export function getTimeSlotRangeInMinutes(startTime: [number, number], duration: number): [number, number] {
  return [timeToMinutes(startTime), timeToMinutes(startTime, duration)];
}

export function timeSlotsOverlap(timeSlot1: TimeSlot, timeSlot2: TimeSlot): boolean {
  return inRange(
    timeToMinutes(timeSlot1.startTime),
    getTimeSlotRangeInMinutes(timeSlot2.startTime, timeSlot2.duration)
  );
}
