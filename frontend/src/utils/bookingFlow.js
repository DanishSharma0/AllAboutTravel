export const buildContinueExploringBookingDetails = ({ booking, bookingType, cityData }) => {
  const bookingDetails = booking || {};
  const itemId =
    bookingDetails.hostelId?._id ||
    bookingDetails.hostelId?.id ||
    bookingDetails.rentalId?._id ||
    bookingDetails.rentalId?.id ||
    bookingDetails.guideId?._id ||
    bookingDetails.guideId?.id ||
    bookingDetails.productId?._id ||
    bookingDetails.productId?.id ||
    bookingDetails.serviceId ||
    bookingDetails.itemId ||
    null;

  return {
    bookingId: bookingDetails._id || bookingDetails.bookingId || null,
    type: bookingType || bookingDetails.type || null,
    serviceName:
      bookingDetails.serviceName ||
      bookingDetails.name ||
      bookingDetails.hostelId?.name ||
      bookingDetails.rentalId?.modelName ||
      bookingDetails.guideId?.name ||
      bookingDetails.productId?.name ||
      cityData?.name ||
      null,
    amount: bookingDetails.totalPrice || bookingDetails.amount || null,
    checkIn: bookingDetails.checkIn || bookingDetails.startDate || bookingDetails.date || null,
    startDate: bookingDetails.startDate || null,
    endDate: bookingDetails.endDate || null,
    itemId,
  };
};

export const buildSuccessRouteState = ({ paymentId, orderId, cityData, bookingType, booking }) => ({
  paymentId,
  orderId,
  cityData,
  bookingType,
  booking,
});
