# 🔍 CART DEBUG GUIDE

**Problem:** Products added to cart but not showing

---

## 📋 STEP-BY-STEP DEBUG

### Step 1: Open Browser Console
```
Press F12 → Click "Console" tab
```

### Step 2: Add Product to Cart
```
1. Go to any product page
2. Click "Add to Bag" button
3. Watch the console for messages
```

### Step 3: Check Console Output
You should see TWO messages:

**Message 1 (Should appear):**
```
🛒 Adding to cart: {productId: "...", variantId: "...", productName: "..."}
```

**Message 2 (Should appear):**
```
📦 Cart updated: [Array with your item]
```

**If you see these messages:** ✅ Cart logic is working, item was added

---

## 🧪 WHAT EACH RESULT MEANS

### Result 1: ✅ See BOTH messages
**Status:** Cart context is working  
**Next:** Cart page should show items  
**If not showing:** Check Cart.jsx display logic

### Result 2: ❌ NO messages appear
**Status:** addToCart function not being called  
**Problem:** Button click not firing  
**Next:** Check ProductCard.jsx onClick handler

### Result 3: ⚠️ See Message 1 only
**Status:** Function called but setCart failed  
**Problem:** State update issue  
**Next:** Check if productData is malformed

---

## 🔎 ADDITIONAL CHECKS

### Check 1: LocalStorage
```
1. F12 → Application tab
2. Left sidebar → Local Storage
3. Look for:
   - "guestCart" (if not logged in)
   - "user_cart_[userId]" (if logged in)
4. Click it to see cart data
```

**If key exists with data:** ✅ Cart is saving to localStorage

**If key is empty/missing:** ❌ localStorage not being updated

### Check 2: Network Tab
```
1. F12 → Network tab
2. Add product to cart
3. Look for API calls:
   - POST to /user/cart (if logged in)
   - Or localStorage write (if guest)
4. Check response:
   - Status 200 = Success
   - Status 400/500 = Error
```

### Check 3: Cart Page
```
1. After adding product
2. Go to /cart page
3. Look for:
   - Product card/item
   - Quantity selector
   - Price
4. If nothing: Cart display is broken
```

---

## 🛠️ QUICK TESTS TO RUN

### Test A: Guest User
1. Open Incognito/Private window
2. Add product to cart
3. Check console messages
4. Go to cart page
5. **Expected:** Item visible

### Test B: Logged-In User
1. Login
2. Add product to cart
3. Check console messages
4. Go to cart page
5. **Expected:** Item visible

### Test C: Multiple Items
1. Add 3-4 different products
2. Watch console for all messages
3. Go to cart
4. **Expected:** All items visible

### Test D: Refresh
1. Add product to cart
2. Note the item name
3. Press F5 to refresh
4. Go to cart
5. **Expected:** Item still there

---

## 📝 INFO TO SHARE IF STUCK

When reporting, share:

1. **Console output:**
   - Do you see the "🛒 Adding to cart" message?
   - Do you see the "📦 Cart updated" message?
   - Any error messages? (Copy them)

2. **LocalStorage status:**
   - Does "guestCart" or "user_cart_*" key exist?
   - What data is in it? (Screenshot)

3. **Cart page:**
   - Does it show "Your bag is empty"?
   - Or shows items?
   - Any error messages?

4. **Reproduction steps:**
   - Exactly what you did
   - What you expected
   - What actually happened

---

## ⚡ COMMON ISSUES & FIXES

### Issue 1: Button Not Responding
**Symptom:** No console messages at all  
**Cause:** onClick handler not wired  
**Fix:** Check ProductCard.jsx line 229

### Issue 2: Message Appears But Cart Empty
**Symptom:** See "🛒" message but cart shows empty  
**Cause:** Cart display logic broken  
**Fix:** Check Cart.jsx component

### Issue 3: Item Disappears After Refresh
**Symptom:** Item in cart, but gone after F5  
**Cause:** localStorage not saving  
**Fix:** Check localStorage in Application tab

### Issue 4: Multiple Adds Don't Combine
**Symptom:** Add same product twice, shows as 2 separate items  
**Cause:** variantId not matching  
**Fix:** Check if variantId is consistent

---

## 🎯 AFTER YOU TEST

**Please tell me:**
1. What console messages you saw (or didn't see)
2. Whether item appears in cart page
3. Whether item persists after F5 refresh
4. Any error messages in console

**Then I can fix the exact issue!** 🚀

