# 🧪 COMPREHENSIVE MANUAL TEST SCRIPTS

**For Testing All 17 Fixes**  
**Platform:** Windows 11, Browser: Chrome/Firefox  
**Duration:** ~45 minutes

---

## 📋 PRE-TEST CHECKLIST

- [ ] Dev server running on http://localhost:3002 (or 3003)
- [ ] Database connected
- [ ] Browser DevTools open (F12)
- [ ] Console cleared (no errors initially)
- [ ] Test user logged in OR ready to login
- [ ] Mobile emulation available (for mobile tests)

---

## 🎯 TEST SUITE 1: CART PAGE TESTS (FIX #1-4)

### Test 1.1: Gift Wrap Feature - Basic Functionality

**Expected Result:** ✅ Gift wrap checkbox works, price updates

```
STEPS:
1. Open http://localhost:3002/shop
2. Add any product to cart (click product card → Add to Bag)
3. Click "View Cart" or navigate to /cart
4. LOCATE: Gift wrap checkbox on first product card
5. CHECK: Checkbox is UNCHECKED initially
6. VERIFY: "✓ Added" badge NOT visible
7. CHECK: Checkbox
8. OBSERVE: ✓ Added badge appears (green checkmark)
9. VERIFY: Total price increased by ₹50 (or ₹0 if no subtotal shown)
10. UNCHECK: Checkbox
11. VERIFY: ✓ Added badge disappears
12. VERIFY: Total price decreased by ₹50

EXPECTED VALUES:
- Before gift wrap: Total = ₹X
- After gift wrap: Total = ₹X + ₹50
- After remove gift wrap: Total = ₹X
```

**DISTURBANCE CHECK:**

- [ ] Product card data unchanged
- [ ] Other items in cart unaffected
- [ ] Quantity buttons still work
- [ ] Remove button still works

---

### Test 1.2: Gift Wrap - "Add to All Items"

**Expected Result:** ✅ Bulk gift wrap selection works

```
STEPS:
1. Add 2-3 products to cart (repeat if needed)
2. Scroll to "Order Summary" section (right side)
3. LOCATE: "Gift wrap all items" checkbox
4. CHECK: Checkbox
5. SCROLL UP: To product list
6. VERIFY: ALL products show "✓ Added" badge
7. VERIFY: Gift wrap charge = (Number of items) × ₹50
8. UNCHECK: "Gift wrap all" checkbox
9. VERIFY: ALL "✓ Added" badges disappear
10. VERIFY: Gift wrap charge = ₹0

EXPECTED CALCULATION:
- 2 items: ₹100 gift wrap
- 3 items: ₹150 gift wrap
- 5 items: ₹250 gift wrap
```

**DISTURBANCE CHECK:**

- [ ] Individual toggles still work
- [ ] Cart totals correct
- [ ] Checkout flow unaffected

---

### Test 1.3: Coupon Section Collapse/Expand

**Expected Result:** ✅ Coupon section toggles smoothly

```
STEPS:
1. Scroll to "Order Summary" section
2. LOCATE: "Available Coupons" header with chevron ↓
3. VERIFY: Section is EXPANDED initially (coupons visible)
4. CLICK: Chevron icon
5. OBSERVE: Smooth collapse animation
6. VERIFY: Coupons list DISAPPEARS
7. VERIFY: Chevron rotates 90° (now points →)
8. CLICK: Chevron again
9. OBSERVE: Smooth expand animation
10. VERIFY: Coupons list REAPPEARS
11. VERIFY: Chevron rotates back (now points ↓)

ANIMATION CHECK:
- Collapse takes ~300ms
- Expand takes ~300ms
- No lag or jank
```

**DISTURBANCE CHECK:**

- [ ] Coupon selection still works while expanded
- [ ] Other cart elements unaffected
- [ ] Mobile layout respects toggle

---

### Test 1.4: Coupon Pricing Breakdown

**Expected Result:** ✅ Shows actual charges (not ₹0)

```
STEPS:
1. In cart, locate a coupon
2. APPLY: Click on any coupon
3. WAIT: 1-2 seconds
4. SCROLL RIGHT: To "Order Summary" section
5. VERIFY: Under "Final Amount", see breakdown:
   - Green text: "Gift wrap: +₹X" (if selected)
   - Gray text: "Shipping: +₹X" (if applicable)
   - Pink/Red text: "Discount: -₹X" (from coupon)
6. VERIFY: Math is correct
   - Total = Subtotal + Shipping + Gift Wrap - Discount
7. WITHOUT coupon, see:
   - No discount line shown
   - Other charges visible

CALCULATION EXAMPLE:
- Subtotal: ₹500
- Shipping: ₹50
- Gift Wrap: ₹50
- Coupon Discount: -₹100
- Total: ₹500 + ₹50 + ₹50 - ₹100 = ₹500
```

**DISTURBANCE CHECK:**

- [ ] Prices always correct
- [ ] Multiple coupons don't break math
- [ ] Gift wrap + coupon works together

---

## 🎯 TEST SUITE 2: PAGE SCROLL RESET (FIX #7-11)

### Test 2.1: Home Page Scroll Reset

**Expected Result:** ✅ Loads at top, doesn't jump to bottom

```
STEPS:
1. Open http://localhost:3002 (Home page)
2. WAIT: Page fully loads
3. VERIFY: Page starts at TOP (not bottom)
4. SCROLL DOWN: To ~80% of page height
5. NOTE: Current scroll position (scroll bar on right)
6. PRESS: F5 (refresh)
7. WAIT: Page reloads
8. VERIFY: Page is at TOP (scroll bar at top)
9. VERIFY: No jump to bottom

REPEAT FOR:
- http://localhost:3002/cart
- http://localhost:3002/checkout
- http://localhost:3002/product/[any-id]
- http://localhost:3002/profile
```

**DISTURBANCE CHECK:**

- [ ] Scroll wheel works normally
- [ ] Touch scroll works (mobile)
- [ ] Keyboard (Page Down) still works
- [ ] Anchor links still work (#sections)

---

### Test 2.2: Normal Scroll Behavior Unaffected

**Expected Result:** ✅ Scrolling works naturally

```
STEPS:
1. Load Home page (should be at top)
2. SCROLL DOWN: Manually with wheel/touch
3. VERIFY: Scroll is smooth (60fps)
4. VERIFY: Page scrolls DOWN (not jumping)
5. SCROLL UP: Back to top
6. VERIFY: No lag or jank
7. SCROLL DOWN: To middle
8. VERIFY: Elements load/render correctly
9. CLICK: Any link on page
10. NAVIGATE: To new page
11. WAIT: New page loads
12. VERIFY: New page is at TOP (scroll reset)
13. NAVIGATE: Back (browser back button)
14. VERIFY: Goes back to previous page
15. VERIFY: Scroll position is at TOP (not preserved)

PERFORMANCE CHECK:
- No frame drops during scroll
- Smooth animations
- No console errors
```

**DISTURBANCE CHECK:**

- [ ] Lazy loading works
- [ ] Images load on scroll
- [ ] Infinite scroll (if any) works
- [ ] Modals still overlay correctly

---

## 🎯 TEST SUITE 3: FORM VALIDATION (FIX #12-16)

### Test 3.1: Checkout First/Last Name Validation

**Expected Result:** ✅ Accepts names with spaces, hyphens, apostrophes

```
STEPS:
1. Go to /checkout
2. LOGIN: Use test account
3. SCROLL: To "Shipping Details" section
4. LOCATE: "First Name" input field
5. CLEAR: Field (if has value)
6. TYPE: "Jean-Paul"
7. TAB: To next field
8. VERIFY: Accepted ✓ (no red border)
9. CLEAR: Field
10. TYPE: "John"
11. VERIFY: Accepted ✓
12. CLEAR: Field
13. TYPE: "O'Brien"
14. VERIFY: Accepted ✓
15. CLEAR: Field
16. TYPE: "Dr."
17. VERIFY: REJECTED ✗ (red border, error message)
18. CLEAR: Field
19. TYPE: "Mary123"
20. VERIFY: REJECTED ✗

REPEAT: For "Last Name" field

VALID NAMES TO TEST:
- John ✅
- Jean-Paul ✅
- O'Brien ✅
- D'Silva ✅
- Mary-Anne ✅
- José (might fail - accents not supported) ❌

INVALID NAMES TO TEST:
- John123 ❌
- Mary@home ❌
- Name#1 ❌
```

**BROWSER VALIDATION MESSAGE:**

- Should show: "Please use letters, spaces, hyphens, or apostrophes only"

**DISTURBANCE CHECK:**

- [ ] Other form fields unaffected
- [ ] Form can still be submitted
- [ ] Mobile form validation works

---

### Test 3.2: Address Tab Validation (Mobile Form)

**Expected Result:** ✅ Validation works on address form

```
STEPS:
1. Go to /profile/addresses
2. MOBILE MODE: Use DevTools (F12 → Toggle device toolbar)
3. CLICK: "Add New" button
4. LOCATE: "Full Name" input field
5. TYPE: "John-Paul O'Brien"
6. TAB: To next field
7. VERIFY: Accepted ✓
8. TYPE: "John@123"
9. VERIFY: REJECTED ✗
10. CLEAR: Continue with valid name
11. TEST: City field
    - Valid: "New York" ✅
    - Valid: "Los Angeles" ✅
    - Invalid: "City123" ❌
12. TEST: State field
    - Valid: "Maharashtra" ✅
    - Valid: "Tamil Nadu" ✅
    - Invalid: "State#1" ❌
13. COMPLETE: Form with all valid data
14. SUBMIT: Click "Save Address"
15. VERIFY: Address saved successfully
16. VERIFY: Appears in saved addresses list
```

**DISTURBANCE CHECK:**

- [ ] Mobile form layout correct
- [ ] Keyboard appears (mobile)
- [ ] Other address fields work
- [ ] Form submission works

---

### Test 3.3: Address Tab Validation (Desktop Form)

**Expected Result:** ✅ Same validation on desktop

```
STEPS:
1. Go to /profile/addresses (DESKTOP MODE)
2. CLICK: "Add New" button
3. DESKTOP FORM: Appears in grid layout
4. FILL: Name field with "Jean-Paul"
5. VERIFY: Accepted ✓
6. FILL: City field with "Los Angeles"
7. VERIFY: Accepted ✓
8. FILL: State field with "California"
9. VERIFY: Accepted ✓
10. FILL: Rest of form (flatNo, area, pincode)
11. SUBMIT: Click "Save Address"
12. VERIFY: Success message
13. VERIFY: Address appears in list below
14. REPEAT: Test invalid entries to confirm rejection
```

**DISTURBANCE CHECK:**

- [ ] Desktop layout unaffected
- [ ] Form submission works
- [ ] Validation consistent across mobile/desktop

---

## 🎯 TEST SUITE 4: ROUTING & NAVIGATION (FIX #5)

### Test 4.1: Replacement Policy Navigation

**Expected Result:** ✅ Navigates to correct page (/replacements)

```
STEPS:
1. Go to /profile
2. LOCATE: Profile sidebar (left side on desktop)
3. SCROLL DOWN: In sidebar to find policies
4. LOCATE: "Replacement Policy" button
5. CLICK: Button
6. WAIT: Navigation completes
7. VERIFY: URL changed to /replacements (not /replacement-policy or /)
8. VERIFY: Page shows replacement-related content
9. VERIFY: Page is NOT home page
10. NO ERRORS: Check console (F12 → Console tab)
    - Should have NO red errors
    - Only yellow warnings (if any) are OK
```

**URL VERIFICATION:**

- Before click: /profile or /profile/addresses/... etc
- After click: /replacements

**DISTURBANCE CHECK:**

- [ ] Other profile menu items still work
- [ ] Return policy link still works
- [ ] No broken routes

---

## 🎯 TEST SUITE 5: ANIMATIONS & UI (FIX #6)

### Test 5.1: WhatsApp Icon Animation

**Expected Result:** ✅ Subtle pulse, not frantic blinking

```
STEPS:
1. Open http://localhost:3002
2. LOCATE: WhatsApp floating button (bottom-right corner)
3. OBSERVE: Animation quality
   - ✅ CORRECT: Gentle pulsing (like breathing)
   - ✅ CORRECT: Opacity fades smoothly (subtle)
   - ❌ WRONG: Frantic rapid blinking (if still broken)
   - ❌ WRONG: No animation at all (if removed)
4. WATCH: For ~5 seconds
5. VERIFY: Animation is smooth (not jerky)
6. HOVER: Over button
7. VERIFY: Pulsing effect hides on hover
8. VERIFY: Button highlights (pink background)
9. MOVE AWAY: Mouse
10. VERIFY: Pulsing resumes
11. CLICK: Button
12. VERIFY: Share dialog/action opens

DISTURBANCE CHECK:
- [ ] Button is clickable
- [ ] Animation doesn't prevent interaction
- [ ] Works on mobile (no hover animation)
```

**ANIMATION METRICS:**

- Pulse frequency: Once every 2 seconds (calm)
- Opacity: 20% max (subtle)
- Transition: Smooth (not stepped)

---

## 🎯 TEST SUITE 6: PRODUCT SHARING (FIX #17)

### Test 6.1: Share Button - Mobile

**Expected Result:** ✅ Opens native share dialog

```
STEPS:
1. MOBILE MODE: Use Android or iOS device/emulator
2. Go to any product page
3. LOCATE: Product image section (top)
4. LOCATE: Share icon (top-right of image, white circular button)
5. CLICK: Share button
6. WAIT: 1 second
7. VERIFY: Native share sheet/dialog appears
   - iOS: Share menu with options (Messages, Mail, WhatsApp, etc.)
   - Android: Share menu with installed apps
8. SELECT: "Messages" or similar
9. VERIFY: Pre-filled message with product name
10. VERIFY: Product URL included
11. VERIFY: Send works
12. NAVIGATE: Back to product page
13. VERIFY: Page still functional

EXAMPLE MESSAGE:
"I found this beautiful [Product Name] on Sands Jewels! [URL]"
```

**DISTURBANCE CHECK:**

- [ ] Product page loads correctly
- [ ] Other product features work
- [ ] Share only shares current product

---

### Test 6.2: Share Button - Desktop (Chrome)

**Expected Result:** ✅ Copies link to clipboard with toast confirmation

```
STEPS:
1. DESKTOP: Use Chrome or Firefox
2. Go to any product page
3. LOCATE: Share icon (top-right of product image)
4. CLICK: Share button
5. WAIT: 1 second
6. VERIFY: Toast notification appears (top/bottom)
   - Message: "Link copied to clipboard!"
   - Duration: 2-3 seconds then fades
7. OPEN: Text editor (Notepad, Notes, or chat)
8. PASTE: Ctrl+V (or Cmd+V on Mac)
9. VERIFY: Product URL appears
   - Example: https://sands-ornaments.com/product/123...
10. VERIFY: URL is valid and opens correct product

DISTURBANCE CHECK:
- [ ] Other product buttons unaffected
- [ ] No page reload
- [ ] Share works multiple times
```

---

### Test 6.3: Share Button - Error Handling

**Expected Result:** ✅ Handles errors gracefully

```
STEPS:
1. Open product page
2. OPEN: DevTools (F12)
3. NETWORK TAB: Inspect requests
4. CLICK: Share button
5. VERIFY: No network errors
6. VERIFY: No JavaScript errors in Console
7. VERIFY: Action completes (toast or dialog)
8. REPEAT: Click share multiple times
9. VERIFY: Works every time (idempotent)
```

**DISTURBANCE CHECK:**

- [ ] No console errors
- [ ] No network requests (it's local)
- [ ] Function is pure (no side effects)

---

## 📊 FINAL VERIFICATION CHECKLIST

### All Tests Passed?

- [ ] Test Suite 1: Cart (4 tests) ✅
- [ ] Test Suite 2: Scroll (2 tests) ✅
- [ ] Test Suite 3: Validation (3 tests) ✅
- [ ] Test Suite 4: Routing (1 test) ✅
- [ ] Test Suite 5: Animation (1 test) ✅
- [ ] Test Suite 6: Sharing (3 tests) ✅

**Total Tests:** 14  
**Duration:** ~45 minutes

---

### No Disturbances?

- [ ] Cart still works normally
- [ ] Checkout still works
- [ ] Profile still works
- [ ] Product pages still work
- [ ] Navigation still works
- [ ] Forms still submit
- [ ] No console errors
- [ ] No broken links
- [ ] No missing images
- [ ] No layout shifts

---

### Browser Compatibility

Test on:

- [ ] Chrome (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

### Performance Check

- [ ] No lag during interactions
- [ ] Animations smooth (60fps)
- [ ] Forms responsive
- [ ] Navigation instant
- [ ] No memory leaks

---

## 🎉 SIGN-OFF

**Tester Name:** ******\_\_\_******  
**Date:** ******\_\_\_******  
**Status:** ✅ ALL TESTS PASSED / ❌ ISSUES FOUND

**Issues Found (if any):**

```
[List any failures here]
```

**Comments:**

```
[Add any observations]
```

---

**READY FOR PRODUCTION DEPLOYMENT?**  
☑️ YES - All 17 fixes verified, no disturbances  
☐ NO - Issues must be fixed before deployment
