import { describe, it, expect } from 'vitest';
import { buildContinueExploringBookingDetails } from '../utils/bookingFlow';

describe('buildContinueExploringBookingDetails', () => {
  it('extracts hostel booking details for the continue-exploring flow', () => {
    const result = buildContinueExploringBookingDetails({
      booking: {
        _id: 'booking-123',
        totalPrice: 2000,
        checkIn: '2026-07-10',
        hostelId: { _id: 'hostel-123', name: 'Mountain Stay' },
      },
      bookingType: 'hostel',
      cityData: { _id: 'city-1', name: 'Manali' },
    });

    expect(result).toEqual(expect.objectContaining({
      bookingId: 'booking-123',
      type: 'hostel',
      serviceName: 'Mountain Stay',
      amount: 2000,
      checkIn: '2026-07-10',
      itemId: 'hostel-123',
    }));
  });
});
