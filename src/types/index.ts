export type Language = 'en' | 'gu' | 'hi';

export type CrowdLevel = 'Chill' | 'Moderate' | 'High' | 'Packed';

export interface GarbaReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  outfitTag?: string;
  helpfulCount: number;
}

export interface GarbaVenue {
  id: string;
  name: string;
  gujaratiName: string;
  hindiName: string;
  category: 'Mega Ground' | 'Heritage Pol' | 'Premier Club' | 'Party Plot';
  zone: 'SG Highway' | 'Sindhu Bhavan' | 'Old City Heritage' | 'Bopal-Ambli' | 'Gandhinagar' | 'Satellite';
  address: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewsCount: number;
  timings: string;
  entryFee: number;
  seasonPassFee: number;
  image: string;
  lineupArtist: string;
  crowdLevel: CrowdLevel;
  crowdPercent: number; // 0 to 100
  parkingSpots: number;
  parkingAvailable: boolean;
  brtsNearby: string;
  sheTeamBoothNearby: boolean;
  highlight: string;
  dressCode: string;
  rules: string[];
  reviews: GarbaReview[];
}

export interface Restaurant {
  id: string;
  name: string;
  gujaratiName: string;
  hindiName: string;
  cuisine: string;
  zone: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  openTill: string;
  priceForTwo: number;
  signatureDishes: string[];
  image: string;
  crowdStatus: 'Walk-in available' | 'Short wait (10m)' | 'Reservation recommended';
  phone: string;
  address: string;
  tableSlots: string[];
}

export interface GarbaPass {
  id: string;
  venueId: string;
  venueName: string;
  date: string;
  tier: 'General Entry' | 'Gold Circle' | 'VIP Lounge' | 'Navratri Season Pass (9 Nights)';
  pricePerPass: number;
  quantity: number;
  totalAmount: number;
  attendeeName: string;
  attendeePhone: string;
  qrPayload: string;
  bookedAt: string;
  status: 'Confirmed' | 'Checked-in' | 'Cancelled';
  encryptedHash: string;
}

export interface DineoutBooking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  timeSlot: string;
  guests: number;
  customerName: string;
  customerPhone: string;
  specialRequest?: string;
  bookedAt: string;
  status: 'Confirmed' | 'Seated' | 'Cancelled';
}

export interface SocialPost {
  id: string;
  userName: string;
  userAvatar: string;
  venueName: string;
  image: string;
  caption: string;
  tags: string[];
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  timestamp: string;
  isLive: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'milestone' | 'emergency' | 'traffic';
  timestamp: string;
  read: boolean;
}

export interface EmergencyLog {
  id: string;
  venueName: string;
  emergencyType: string;
  timestamp: string;
  dispatchedUnit: string;
  status: 'RESOLVED' | 'DISPATCHED' | 'MONITORING';
}

export interface EncryptedVaultItem {
  id: string;
  title: string;
  type: 'Pass' | 'ID Proof' | 'Emergency Contact' | 'Medical Note';
  content: string;
  updatedAt: string;
}

export interface MetroFeederRoute {
  id: string;
  lineName: string;
  lineColor: string;
  fromStation: string;
  toStation: string;
  nearestStation: string;
  walkMinutesToGround: number;
  distanceKm: number;
  nextDepartureTime: string;
  countdownMinutes: number;
  lastTrainTime: string;
  feederBusesAvailable: boolean;
  feederBusLine: string;
  feederFrequencyMinutes: number;
  fareInr: number;
  crowdCapacity: 'Light' | 'Moderate' | 'Heavy Rush';
}

export interface FriendBeacon {
  id: string;
  name: string;
  avatar: string;
  batteryPercent: number;
  rssiSignalDbm: number; // e.g. -55dBm
  estimatedDistanceMeters: number;
  relativeBearingDegrees: number; // 0 to 360
  stageDirection: string; // e.g. 'North Stage Gate 2'
  lastSeenSecsAgo: number;
  status: 'Dancing in Dodhiya Ring' | 'Food Court' | 'Water Booth' | 'Entry Gate';
}

export interface RaasCircle {
  circleId: string;
  circleName: string;
  groundName: string;
  createdAt: string;
  friends: FriendBeacon[];
  beaconFrequency: string;
}

export type VehicleType = '2-Wheeler' | '4-Wheeler';
export type ParkingServiceType = 'Self Park' | 'Royal Valet';

export interface ParkingSlot {
  id: string; // e.g. "4W-A12", "2W-B05", "VALET-V01"
  slotNumber: string;
  zone: string; // e.g. "Zone A (Gate 1 / VIP & Valet)"
  vehicleType: VehicleType;
  isValet: boolean;
  hasEVCharging: boolean;
  isCovered: boolean;
  walkMinutesToArena: number;
  status: 'Available' | 'Occupied' | 'Reserved';
  rateInr: number;
}

export interface VenueParkingLot {
  venueId: string;
  venueName: string;
  totalSpots4W: number;
  occupiedSpots4W: number;
  totalSpots2W: number;
  occupiedSpots2W: number;
  valetAvailable: boolean;
  valetChargeInr: number;
  baseRate4W: number;
  baseRate2W: number;
  evChargingAvailable: boolean;
  isOverflowTriggered: boolean;
  overflowThresholdPercent: number;
  overflowLot?: {
    name: string;
    distanceMeters: number;
    feederShuttleAvailable: boolean;
    shuttleFrequencyMinutes: number;
    address: string;
    availableSlots4W: number;
    availableSlots2W: number;
    rateInr: number;
  };
  slots: ParkingSlot[];
}

export interface ParkingReservation {
  id: string;
  venueId: string;
  venueName: string;
  vehicleType: VehicleType;
  serviceType: ParkingServiceType;
  vehicleNumber: string;
  slotId?: string;
  slotNumber?: string;
  zoneName: string;
  driverName: string;
  driverPhone: string;
  entryTime: string;
  validUntil: string;
  totalAmount: number;
  status: 'Confirmed' | 'Parked' | 'Valet_Parked' | 'Retrieval_Requested' | 'Completed';
  bookedAt: string;
  qrPayload: string;
  valetClaimToken?: string;
  valetKeyBay?: string;
  isOverflowLot?: boolean;
  overflowLotName?: string;
  helmetLockerBooked?: boolean;
  evPlugReserved?: boolean;
}

