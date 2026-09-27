import { VenueParkingLot, ParkingSlot, ParkingReservation } from '../types';

export const VENUE_PARKING_LOTS: VenueParkingLot[] = [
  {
    venueId: 'gmdc-ground',
    venueName: 'GMDC Ground - Vibrant Gujarat Garba Mahotsav',
    totalSpots4W: 2600,
    occupiedSpots4W: 2470, // 95% full -> OVERFLOW ACTIVE
    totalSpots2W: 3200,
    occupiedSpots2W: 2496, // 78% full
    valetAvailable: true,
    valetChargeInr: 250,
    baseRate4W: 150,
    baseRate2W: 50,
    evChargingAvailable: true,
    isOverflowTriggered: true,
    overflowThresholdPercent: 90,
    overflowLot: {
      name: 'AMC Gujarat University Ground Overflow Lot (Gate 4)',
      distanceMeters: 350,
      feederShuttleAvailable: true,
      shuttleFrequencyMinutes: 3,
      address: 'Near University Convention Centre, 132ft Ring Rd',
      availableSlots4W: 580,
      availableSlots2W: 900,
      rateInr: 100,
    },
    slots: generateVenueSlots('gmdc-ground'),
  },
  {
    venueId: 'karnavati-club',
    venueName: 'Karnavati Club - Golden Heritage Raas',
    totalSpots4W: 1200,
    occupiedSpots4W: 1104, // 92% full -> OVERFLOW ACTIVE
    totalSpots2W: 1800,
    occupiedSpots2W: 1332, // 74% full
    valetAvailable: true,
    valetChargeInr: 300,
    baseRate4W: 200,
    baseRate2W: 60,
    evChargingAvailable: true,
    isOverflowTriggered: true,
    overflowThresholdPercent: 90,
    overflowLot: {
      name: 'Bopal Crossroad Multi-Level Satellite Yard',
      distanceMeters: 450,
      feederShuttleAvailable: true,
      shuttleFrequencyMinutes: 4,
      address: 'Opposite Bopal Cross Flyover, SG Highway',
      availableSlots4W: 320,
      availableSlots2W: 500,
      rateInr: 120,
    },
    slots: generateVenueSlots('karnavati-club'),
  },
  {
    venueId: 'rajpath-club',
    venueName: 'Rajpath Club - Royal Heritage Garba',
    totalSpots4W: 1100,
    occupiedSpots4W: 880, // 80% full
    totalSpots2W: 1400,
    occupiedSpots2W: 980, // 70% full
    valetAvailable: true,
    valetChargeInr: 300,
    baseRate4W: 200,
    baseRate2W: 60,
    evChargingAvailable: true,
    isOverflowTriggered: false,
    overflowThresholdPercent: 90,
    overflowLot: {
      name: 'Bodakdev Garden Public Parking Deck',
      distanceMeters: 400,
      feederShuttleAvailable: true,
      shuttleFrequencyMinutes: 5,
      address: 'Pakwan Crossroad to Bodakdev Link Rd',
      availableSlots4W: 240,
      availableSlots2W: 400,
      rateInr: 100,
    },
    slots: generateVenueSlots('rajpath-club'),
  },
  {
    venueId: 'mirchi-rock-n-dhol',
    venueName: 'Mirchi Rock N Dhol - Aman Aakash Party Plot',
    totalSpots4W: 950,
    occupiedSpots4W: 912, // 96% full -> OVERFLOW ACTIVE
    totalSpots2W: 1300,
    occupiedSpots2W: 1066, // 82% full
    valetAvailable: true,
    valetChargeInr: 250,
    baseRate4W: 180,
    baseRate2W: 50,
    evChargingAvailable: true,
    isOverflowTriggered: true,
    overflowThresholdPercent: 90,
    overflowLot: {
      name: 'Sindhu Bhavan Road Central Overflow Staging Arena',
      distanceMeters: 300,
      feederShuttleAvailable: true,
      shuttleFrequencyMinutes: 3,
      address: 'Behind Taj Skyline, Sindhu Bhavan Road',
      availableSlots4W: 410,
      availableSlots2W: 600,
      rateInr: 120,
    },
    slots: generateVenueSlots('mirchi-rock-n-dhol'),
  },
  {
    venueId: 'shankus-dandiya',
    venueName: 'Shankus Dandiya - Royal Heritage Grounds',
    totalSpots4W: 1500,
    occupiedSpots4W: 1020, // 68% full
    totalSpots2W: 1800,
    occupiedSpots2W: 1044, // 58% full
    valetAvailable: true,
    valetChargeInr: 250,
    baseRate4W: 150,
    baseRate2W: 50,
    evChargingAvailable: true,
    isOverflowTriggered: false,
    overflowThresholdPercent: 90,
    slots: generateVenueSlots('shankus-dandiya'),
  },
  {
    venueId: 'mandvi-ni-pol',
    venueName: 'Mandvi Ni Pol - 200 Year Old Heritage Sheri Garba',
    totalSpots4W: 0, // No 4W allowed in narrow pols
    occupiedSpots4W: 0,
    totalSpots2W: 400,
    occupiedSpots2W: 352, // 88% full
    valetAvailable: false,
    valetChargeInr: 0,
    baseRate4W: 0,
    baseRate2W: 40,
    evChargingAvailable: false,
    isOverflowTriggered: true,
    overflowThresholdPercent: 85,
    overflowLot: {
      name: 'Kalupur Metro Station Multi-Level Car Parking (AMC)',
      distanceMeters: 750,
      feederShuttleAvailable: true,
      shuttleFrequencyMinutes: 5,
      address: 'Near Relief Road, Kalupur, Old City',
      availableSlots4W: 650,
      availableSlots2W: 800,
      rateInr: 80,
    },
    slots: generateVenueSlots('mandvi-ni-pol'),
  },
];

// Helper to generate realistic visual parking bays for interactive grid
function generateVenueSlots(venueId: string): ParkingSlot[] {
  const isPol = venueId === 'mandvi-ni-pol';
  const slots: ParkingSlot[] = [];

  // Zone A: VIP & Royal Valet (Closest to Gate 1)
  if (!isPol) {
    for (let i = 1; i <= 8; i++) {
      const isOcc = [2, 3, 5, 7].includes(i);
      slots.push({
        id: `${venueId}-4W-A0${i}`,
        slotNumber: `4W-A0${i}`,
        zone: 'Zone A (Gate 1 / VIP & Valet)',
        vehicleType: '4-Wheeler',
        isValet: i <= 4,
        hasEVCharging: i === 1 || i === 2,
        isCovered: true,
        walkMinutesToArena: 1,
        status: isOcc ? 'Occupied' : 'Available',
        rateInr: i <= 4 ? 300 : 220,
      });
    }
  }

  // Zone B: Fast Exit & EV Charging bays (4W)
  if (!isPol) {
    for (let i = 1; i <= 8; i++) {
      const isOcc = [1, 2, 4, 6, 8].includes(i);
      slots.push({
        id: `${venueId}-4W-B0${i}`,
        slotNumber: `4W-B0${i}`,
        zone: 'Zone B (Fast Exit & EV Chargers)',
        vehicleType: '4-Wheeler',
        isValet: false,
        hasEVCharging: true,
        isCovered: true,
        walkMinutesToArena: 2,
        status: isOcc ? 'Occupied' : 'Available',
        rateInr: 180,
      });
    }
  }

  // Zone C: Main Deck (4W Standard)
  if (!isPol) {
    for (let i = 1; i <= 10; i++) {
      const isOcc = [1, 3, 4, 5, 7, 8, 9].includes(i);
      slots.push({
        id: `${venueId}-4W-C${i < 10 ? '0' + i : i}`,
        slotNumber: `4W-C${i < 10 ? '0' + i : i}`,
        zone: 'Zone C (Main Deck)',
        vehicleType: '4-Wheeler',
        isValet: false,
        hasEVCharging: false,
        isCovered: i % 2 === 0,
        walkMinutesToArena: 3,
        status: isOcc ? 'Occupied' : 'Available',
        rateInr: 150,
      });
    }
  }

  // Zone D: 2-Wheeler Staging Bay & Helmet Lockers
  const num2W = isPol ? 16 : 14;
  for (let i = 1; i <= num2W; i++) {
    const isOcc = [2, 3, 5, 6, 8, 9, 11, 12].includes(i);
    slots.push({
      id: `${venueId}-2W-D${i < 10 ? '0' + i : i}`,
      slotNumber: `2W-D${i < 10 ? '0' + i : i}`,
      zone: 'Zone D (2W Staging & Helmet Lockers)',
      vehicleType: '2-Wheeler',
      isValet: false,
      hasEVCharging: i <= 3, // EV 2-Wheeler charge points
      isCovered: true,
      walkMinutesToArena: 2,
      status: isOcc ? 'Occupied' : 'Available',
      rateInr: 50,
    });
  }

  return slots;
}

export const INITIAL_PARKING_RESERVATIONS: ParkingReservation[] = [
  {
    id: 'PARK-AMD-8841',
    venueId: 'karnavati-club',
    venueName: 'Karnavati Club - Golden Heritage Raas',
    vehicleType: '4-Wheeler',
    serviceType: 'Royal Valet',
    vehicleNumber: 'GJ-01-ET-9087',
    slotId: 'karnavati-club-4W-A02',
    slotNumber: '4W-A02 (Valet Deck)',
    zoneName: 'Zone A (Gate 1 / VIP & Valet)',
    driverName: 'Aarav Mehta',
    driverPhone: '+91 98251 44556',
    entryTime: '8:00 PM',
    validUntil: '4:30 AM',
    totalAmount: 300,
    status: 'Valet_Parked',
    bookedAt: '2026-09-26 19:45',
    qrPayload: 'https://navratri-amd.gov.in/parking/verify/PARK-AMD-8841',
    valetClaimToken: 'VALET-KEY-BAY-14',
    valetKeyBay: 'Kiosk Gate 1 - Bay 14',
    evPlugReserved: true,
  },
  {
    id: 'PARK-AMD-4219',
    venueId: 'gmdc-ground',
    venueName: 'GMDC Ground - Vibrant Gujarat Garba Mahotsav',
    vehicleType: '2-Wheeler',
    serviceType: 'Self Park',
    vehicleNumber: 'GJ-01-MZ-3312',
    slotId: 'gmdc-ground-2W-D04',
    slotNumber: '2W-D04',
    zoneName: 'Zone D (2W Staging & Helmet Lockers)',
    driverName: 'Pooja Patel',
    driverPhone: '+91 98250 11223',
    entryTime: '8:30 PM',
    validUntil: '4:00 AM',
    totalAmount: 70,
    status: 'Confirmed',
    bookedAt: '2026-09-26 18:20',
    qrPayload: 'https://navratri-amd.gov.in/parking/verify/PARK-AMD-4219',
    helmetLockerBooked: true,
  },
];
