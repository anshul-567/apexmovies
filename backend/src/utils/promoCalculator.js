/**
 * Validates and calculates discount for supported promo codes.
 * @param {string} code - The promo code entered by user
 * @param {Array<{price: number|string}>} seats - The selected seats array with individual prices
 * @returns {{ valid: boolean, code: string, discountAmount: number, subtotal: number, finalAmount: number, message: string }}
 */
function calculatePromoDiscount(code, seats) {
  if (!Array.isArray(seats) || !seats.length) {
    return { valid: false, code: '', discountAmount: 0, subtotal: 0, finalAmount: 0, message: 'No seats selected' };
  }

  const subtotal = seats.reduce((sum, s) => sum + Number(s.price || 0), 0);
  const normalizedCode = (code || '').trim().toUpperCase();

  if (!normalizedCode) {
    return { valid: true, code: '', discountAmount: 0, subtotal, finalAmount: subtotal, message: '' };
  }

  let discountAmount = 0;
  let message = '';

  switch (normalizedCode) {
    case 'WELCOME100':
      if (subtotal < 200) {
        return { valid: false, code: normalizedCode, discountAmount: 0, subtotal, finalAmount: subtotal, message: 'WELCOME100 requires a minimum booking subtotal of ₹200' };
      }
      discountAmount = Math.min(100, subtotal);
      message = '₹100 first booking discount applied!';
      break;

    case 'WEEKEND3':
      if (seats.length < 3) {
        return { valid: false, code: normalizedCode, discountAmount: 0, subtotal, finalAmount: subtotal, message: 'WEEKEND3 (Buy 2 Get 1 Free) requires at least 3 seats' };
      }
      // 100% off on the lowest priced seat
      const sortedPrices = seats.map((s) => Number(s.price)).sort((a, b) => a - b);
      discountAmount = sortedPrices[0];
      message = `Buy 2 Get 1 Free applied! 1 seat discounted (-₹${discountAmount.toFixed(2)})`;
      break;

    case 'APEX15':
    case 'AUTO-APPLIED':
      discountAmount = Math.round(subtotal * 0.15 * 100) / 100;
      message = '15% Apex Card discount applied!';
      break;

    case 'FLAT50':
      if (seats.length < 2) {
        return { valid: false, code: normalizedCode, discountAmount: 0, subtotal, finalAmount: subtotal, message: 'FLAT50 requires at least 2 seats' };
      }
      discountAmount = Math.min(50, subtotal);
      message = '₹50 multi-ticket discount applied!';
      break;

    case 'CREDPAY':
      if (subtotal < 300) {
        return { valid: false, code: normalizedCode, discountAmount: 0, subtotal, finalAmount: subtotal, message: 'CREDPAY requires a minimum transaction of ₹300' };
      }
      discountAmount = Math.min(75, subtotal);
      message = '₹75 Cred Pay instant cashback discount applied!';
      break;

    case 'GPAY100':
      discountAmount = Math.min(100, Math.round(subtotal * 0.20 * 100) / 100);
      message = '20% Google Pay UPI discount applied!';
      break;

    case 'HDFCICICI':
      if (seats.length < 2) {
        return { valid: false, code: normalizedCode, discountAmount: 0, subtotal, finalAmount: subtotal, message: 'HDFCICICI requires at least 2 seats' };
      }
      const secondSeatPrice = Number(seats[1]?.price || seats[0].price);
      discountAmount = Math.min(150, Math.round(secondSeatPrice * 0.5 * 100) / 100);
      message = 'HDFC & ICICI Card partner discount applied!';
      break;

    case 'RUPAY20':
      discountAmount = Math.min(100, Math.round(subtotal * 0.20 * 100) / 100);
      message = '20% RuPay Platinum card discount applied!';
      break;

    case 'STUDENT25':
      discountAmount = Math.min(150, Math.round(subtotal * 0.25 * 100) / 100);
      message = '25% Student cinema discount applied!';
      break;

    case 'FAMILY4':
      if (seats.length < 4) {
        return { valid: false, code: normalizedCode, discountAmount: 0, subtotal, finalAmount: subtotal, message: 'FAMILY4 requires at least 4 seats' };
      }
      discountAmount = Math.min(200, subtotal);
      message = '₹200 Family Saver pack discount applied!';
      break;

    case 'POPCORN50':
      discountAmount = Math.min(50, subtotal);
      message = '₹50 F&B Cinema Combo discount applied!';
      break;

    default:
      return { valid: false, code: normalizedCode, discountAmount: 0, subtotal, finalAmount: subtotal, message: `Invalid promo code "${normalizedCode}"` };
  }

  const finalAmount = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

  return {
    valid: true,
    code: normalizedCode,
    discountAmount,
    subtotal,
    finalAmount,
    message,
  };
}

module.exports = { calculatePromoDiscount };
