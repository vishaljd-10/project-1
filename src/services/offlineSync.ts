import { GarbaPass, DineoutBooking, ParkingReservation } from '../types';
import { INITIAL_PARKING_RESERVATIONS } from '../data/parkingData';

export interface SyncQueueAction {
  id: string;
  type: 'PASS_BOOKING' | 'DINEOUT_RESERVATION' | 'FEED_POST' | 'PARKING_RESERVATION';
  payload: any;
  timestamp: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}

const PASSES_STORAGE_KEY = 'navratri_amd_passes';
const DINING_STORAGE_KEY = 'navratri_amd_dining';
const PARKING_STORAGE_KEY = 'navratri_amd_parking';
const SYNC_QUEUE_KEY = 'navratri_amd_sync_queue';

export function getCachedPasses(): GarbaPass[] {
  try {
    const raw = localStorage.getItem(PASSES_STORAGE_KEY);
    if (!raw) {
      // Default sample pass for Karnavati Club
      const samplePass: GarbaPass = {
        id: 'PASS-AMD-78921',
        venueId: 'karnavati-club',
        venueName: 'Karnavati Club - Golden Heritage Raas',
        date: 'Day 5 - Panchami',
        tier: 'Gold Circle',
        pricePerPass: 750,
        quantity: 2,
        totalAmount: 1500,
        attendeeName: 'Aarav Mehta',
        attendeePhone: '+91 98251 44556',
        qrPayload: 'https://navratri-amd.gov.in/verify/PASS-AMD-78921-ENCRYPTED-SECURE',
        bookedAt: '2026-09-26 19:30',
        status: 'Confirmed',
        encryptedHash: 'SHA256-e9b4c10a7f...',
      };
      return [samplePass];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCachedPass(pass: GarbaPass): void {
  const current = getCachedPasses();
  current.unshift(pass);
  localStorage.setItem(PASSES_STORAGE_KEY, JSON.stringify(current));
}

export function getCachedReservations(): DineoutBooking[] {
  try {
    const raw = localStorage.getItem(DINING_STORAGE_KEY);
    if (!raw) {
      const sampleReservation: DineoutBooking = {
        id: 'DINE-AMD-4321',
        restaurantId: 'gwalia-sweets-lounge',
        restaurantName: 'Gwalia Midnight Rasotsav Dining Lounge',
        date: 'Tonight (Post-Garba)',
        timeSlot: '1:30 AM',
        guests: 4,
        customerName: 'Aarav Mehta',
        customerPhone: '+91 98251 44556',
        specialRequest: 'Corner table, midnight hot Jalebi Rabdi ready on arrival',
        bookedAt: '2026-09-26 20:15',
        status: 'Confirmed',
      };
      return [sampleReservation];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCachedReservation(res: DineoutBooking): void {
  const current = getCachedReservations();
  current.unshift(res);
  localStorage.setItem(DINING_STORAGE_KEY, JSON.stringify(current));
}

export function getCachedParkingReservations(): ParkingReservation[] {
  try {
    const raw = localStorage.getItem(PARKING_STORAGE_KEY);
    if (!raw) {
      return INITIAL_PARKING_RESERVATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PARKING_RESERVATIONS;
  }
}

export function saveCachedParkingReservation(res: ParkingReservation): void {
  const current = getCachedParkingReservations();
  current.unshift(res);
  localStorage.setItem(PARKING_STORAGE_KEY, JSON.stringify(current));
}

export function updateParkingReservationStatus(id: string, status: ParkingReservation['status']): void {
  const current = getCachedParkingReservations();
  const index = current.findIndex(p => p.id === id);
  if (index !== -1) {
    current[index].status = status;
    localStorage.setItem(PARKING_STORAGE_KEY, JSON.stringify(current));
  }
}

export function getSyncQueue(): SyncQueueAction[] {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToSyncQueue(action: Omit<SyncQueueAction, 'id' | 'status'>): void {
  const current = getSyncQueue();
  const newAction: SyncQueueAction = {
    ...action,
    id: 'SYNC-' + Math.random().toString(36).substring(2, 9),
    status: 'PENDING',
  };
  current.push(newAction);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(current));
}

export function flushSyncQueue(): number {
  const current = getSyncQueue();
  const count = current.filter((a) => a.status === 'PENDING').length;
  // Mark all pending as synced
  const updated = current.map((a) => ({ ...a, status: 'SYNCED' as const }));
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updated));
  return count;
}
