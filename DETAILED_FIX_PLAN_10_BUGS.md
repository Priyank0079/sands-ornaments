# 🔍 DETAILED FIX PLAN - 10 REMAINING BUGS

**Principle:** Fix with ZERO disturbances - deep analysis before each fix

---

## Bug #1: ICON HIGHLIGHTING WHEN SELECTED

**Current Situation:**
- Icons in navigation don't show which one is selected
- No visual feedback for active state

**Where to Look:**
- Navbar.jsx - navigation icons
- CategoryNav.jsx - category navigation icons

**Fix Plan:**
```
1. Find icon buttons in navbar
2. Add CSS class based on current route/activeTab
3. Use existing activeTab state if available
4. Test: Navigate between pages → Icon should highlight
```

**Risk Analysis:** MEDIUM
- Could affect other icon behaviors if not careful
- Need to verify activeTab tracking is correct

**Disturbance Risk:** LOW
- CSS class addition only
- No logic changes

**Status:** SAFE TO FIX ✅

---

## Bug #2: REFRESH BUTTON NOT WORKING

**Current Situation:**
- Button exists but onClick handler missing
- Clicking does nothing

**Where to Look:**
- HomePage selection section (likely in HomePageSelector or featured products)
- Button with RefreshCw icon or "Refresh" label

**Fix Plan:**
```
1. Find the refresh button in homepage section
2. Identify what data it should refresh
3. Get refetch function from useQuery hook
4. Add onClick={() => refetch()} 
5. Test: Click → Data refreshes
```

**Risk Analysis:** LOW
- Isolated to single button
- Only adds onClick handler

**Disturbance Risk:** VERY LOW
- No other components affected

**Status:** SAFE TO FIX ✅

---

## Bug #3: ORDER TRACKING LOOP

**Current Situation:**
- Clicking back in order tracking creates a loop
- Goes back to order tracking instead of My Orders

**Where to Look:**
- OrderTrack.jsx or order tracking components
- useNavigate(-1) calls

**Fix Plan:**
```
1. Find order tracking page/component
2. Track navigation history (not just -1)
3. When back button clicked:
   - If came from /profile/orders → go to /profile/orders
   - Else → go back one
4. Test: Track order → Click back → Goes to My Orders (not order)
```

**Risk Analysis:** MEDIUM
- Affects navigation state management
- Could affect other pages' back behavior

**Disturbance Risk:** MEDIUM
- Might impact other back button behaviors
- Need to test thoroughly

**Status:** CAREFUL FIX NEEDED ⚠️

---

## Bug #4: EXPLORE COLLECTION LINK

**Current Situation:**
- "Explore Collection" button doesn't navigate
- Button exists but no onClick or Link

**Where to Look:**
- Banner components
- Signature Curations section
- Collection showcase components

**Fix Plan:**
```
1. Find the button/link without onClick
2. Verify target route exists (likely /collections or /shop)
3. Add Link or onClick with navigate()
4. Test: Click → Navigates to collections
```

**Risk Analysis:** LOW
- Simple routing addition
- Isolated to single button

**Disturbance Risk:** VERY LOW
- Just adds missing navigation

**Status:** SAFE TO FIX ✅

---

## Bug #5: SOCIAL GALLERY REDIRECT

**Current Situation:**
- Clicking social gallery icon redirects to page top instead of opening gallery
- Wrong click handler or wrong target

**Where to Look:**
- Social links in footer
- Gallery icon in product page
- Social sharing components

**Fix Plan:**
```
1. Find the social gallery icon/link
2. Check current onClick handler
3. If it's navigate('/'), remove and add proper gallery handler
4. Or if it's link, change href to correct target
5. Test: Click → Opens gallery or social modal (not page top)
```

**Risk Analysis:** MEDIUM
- Need to identify correct behavior
- Could affect other social functions

**Disturbance Risk:** LOW
- Isolated to single icon

**Status:** NEEDS INVESTIGATION ⚠️

---

## Bug #6: AD CAROUSEL SWIPE

**Current Situation:**
- Carousel doesn't respond to swipe gestures on mobile
- Only works with arrows (if present)

**Where to Look:**
- PromoSlider.jsx or carousel components
- Framer Motion carousel implementations

**Fix Plan:**
```
Option A: Use Framer Motion drag prop (preferred)
1. Add drag="x" to carousel motion.div
2. Add dragConstraints
3. Add onDragEnd handler
4. Test: Swipe left/right on mobile → Carousel moves

Option B: Use touch event listeners
1. Add onTouchStart, onTouchEnd listeners
2. Calculate swipe distance
3. Call next/prev accordingly
4. Test: Swipe → Carousel moves
```

**Risk Analysis:** MEDIUM-HIGH
- Might need new code/library
- Could conflict with existing gesture handlers
- Touch event conflicts possible

**Disturbance Risk:** MEDIUM
- Could affect other drag interactions

**Status:** REQUIRES CARE ⚠️

---

## Bug #7: PRODUCT IMAGE IN CART

**Current Situation:**
- Product shows image on product page
- Image missing in cart (shows "No Image")

**Where to Look:**
- addToCart function in ShopContext
- Cart.jsx item display
- How product data is passed to cart

**Fix Plan:**
```
1. Check what data is stored when adding to cart
2. Verify product.image is included
3. If not, update addToCart() to include image
4. Test: Add product → See image in cart
```

**Risk Analysis:** MEDIUM
- Data flow between pages
- Could affect other cart features

**Disturbance Risk:** MEDIUM
- Changes to addToCart function
- Need to ensure backward compatibility

**Status:** REQUIRES CAREFUL ANALYSIS ⚠️

---

## Bug #8: REVIEW SYSTEM (Textbox + Update)

**Current Situation:**
- No textbox to write review
- Reviews don't update when scrolled back to

**Where to Look:**
- ProductDetails.jsx review section
- Review form/modal
- useEffect for review fetching

**Fix Plan:**
```
1. Find review submission area
2. Check if textarea exists for writing
3. If missing: Add textarea input
4. Add reviewComment state management
5. For update issue:
   - Add useEffect to refetch reviews
   - Or add manual refresh button
6. Test: Write review → Submit → See it in list
```

**Risk Analysis:** HIGH
- Complex state management
- Multiple components affected
- Form validation needed

**Disturbance Risk:** HIGH
- Could affect review display everywhere
- Need extensive testing

**Status:** RISKY - SKIP FOR NOW ❌

---

## Bug #9: BLOGS CONTENT NOT VISIBLE

**Current Situation:**
- Blogs page shows no content
- API call failing or data not displaying

**Where to Look:**
- Blogs.jsx or BlogsPage.jsx
- useQuery or API call for blogs
- Check if data is loading but not rendering

**Fix Plan:**
```
1. Check API endpoint being called
2. Verify data structure in response
3. Check if rendering logic exists
4. If data not rendering: Add mapping over blogs array
5. If API failing: Check endpoint, auth, params
6. Test: Blogs page → Shows content
```

**Risk Analysis:** MEDIUM-HIGH
- API issue could be backend
- Data binding could be complex

**Disturbance Risk:** LOW
- Isolated to blogs page

**Status:** NEEDS INVESTIGATION ⚠️

---

## Bug #10: SECTION TITLE COPY

**Current Situation:**
- Section title misleading: "Created for your loved ones" vs "Not curated for loved ones"
- Text source unclear (hardcoded vs CMS)

**Where to Look:**
- Home components (PerfectGift.jsx, ShopByBond sections)
- Check if text is hardcoded or from CMS

**Fix Plan:**
```
1. Find the section with text
2. Check if from CMS settings or hardcoded
3. If CMS: Update admin settings
4. If hardcoded: Update text string
5. Test: Section shows correct text
```

**Risk Analysis:** VERY LOW
- Just text change
- No logic involved

**Disturbance Risk:** VERY LOW
- Isolated to display text

**Status:** SAFE TO FIX ✅

---

## 📊 SUMMARY - WHICH TO FIX NOW

### SAFE TO FIX ✅ (4 bugs)
1. Icon highlighting - Navigate added
2. Refresh button - Find & add onClick
4. Explore Collection - Add missing link
10. Section title - Change text

### REQUIRES CAREFUL ANALYSIS ⚠️ (4 bugs)
3. Order tracking loop - Navigation logic
5. Social gallery redirect - Identify current behavior
7. Product image in cart - Data flow
9. Blogs content - API investigation

### SKIP FOR NOW ❌ (2 bugs)
6. Ad carousel swipe - Complex gesture handling
8. Review system - High disturbance risk

---

## RECOMMENDATION

**Fix first:** 4 safe bugs (30 minutes)
**Then investigate:** 4 medium bugs (1 hour)
**Skip for now:** 2 high-risk bugs (next phase)

Should I proceed with the 4 safe ones first?

