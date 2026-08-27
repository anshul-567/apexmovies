const API_URL = 'http://localhost:5000/api';

async function testAllNewPromos() {
  console.log('=== VERIFYING ALL 11 DISCOUNT OFFERS & PARTNER CODES ===\n');

  // Authenticate
  const authRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `promotester_${Date.now()}@apexmovies.com`,
      password: 'Password123!',
      name: 'Promo Tester',
    }),
  });
  const authData = await authRes.json();
  const token = authData.accessToken || authData.token;

  // Helper function to test promo against backend endpoint
  async function testCode(code, seats) {
    try {
      const response = await fetch(`${API_URL}/bookings/validate-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ promoCode: code, seats }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Validation failed');
      }
      console.log(`✓ [${code.padEnd(10)}] Valid! Subtotal: ₹${data.subtotal}, Discount: -₹${data.discountAmount}, Final: ₹${data.finalAmount} -> ${data.message}`);
      return data;
    } catch (err) {
      console.error(`✗ [${code}] Failed:`, err.message);
      throw err;
    }
  }

  // 1. WELCOME100
  await testCode('WELCOME100', [{ price: 250 }]);

  // 2. WEEKEND3 (Buy 2 Get 1 Free)
  await testCode('WEEKEND3', [{ price: 300 }, { price: 300 }, { price: 250 }]);

  // 3. FAMILY4 (Flat ₹200 off on 4+ seats)
  await testCode('FAMILY4', [{ price: 250 }, { price: 250 }, { price: 250 }, { price: 250 }]);

  // 4. STUDENT25 (25% off up to ₹150)
  await testCode('STUDENT25', [{ price: 400 }]);

  // 5. APEX15 (15% instant off)
  await testCode('APEX15', [{ price: 500 }]);

  // 6. CREDPAY (Flat ₹75 off on >= ₹300)
  await testCode('CREDPAY', [{ price: 350 }]);

  // 7. GPAY100 (20% off up to ₹100)
  await testCode('GPAY100', [{ price: 450 }]);

  // 8. HDFCICICI (50% off on 2nd seat)
  await testCode('HDFCICICI', [{ price: 300 }, { price: 300 }]);

  // 9. RUPAY20 (20% off up to ₹100)
  await testCode('RUPAY20', [{ price: 300 }]);

  // 10. FLAT50 (Flat ₹50 on 2+ seats)
  await testCode('FLAT50', [{ price: 200 }, { price: 200 }]);

  // 11. POPCORN50 (Flat ₹50 snack voucher)
  await testCode('POPCORN50', [{ price: 250 }]);

  console.log('\n=== ALL 11 DISCOUNT OFFERS VERIFIED SUCCESSFULLY & WORKING! ===\n');
}

testAllNewPromos().catch(console.error);
