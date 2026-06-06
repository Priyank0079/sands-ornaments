# 🛡️ SAFE REMAINING FIXES PLAN

**Principle:** ONLY fix bugs where I'm 100% certain of zero disturbances

**Risk Level Assessment:**

---

## ✅ TIER 1: SAFEST (Zero disturbance risk - 5 bugs)

### Bug #18: Dashboard Menu Not Highlighted
**Risk: VERY LOW** - CSS only, no logic changes
```
Current: Menu items don't show active state
Fix: Add CSS class when activeTab matches
Files: Profile.jsx (already has activeTab logic)
Impact: ZERO - only visual, existing state management used
Can Fix: YES ✅
```

### Bug #19: Icon Highlighted When Selected
**Risk: VERY LOW** - CSS only
```
Current: Icons don't show selection
Fix: Add CSS classes to navbar/menu icons
Files: Navbar.jsx, CategoryNav.jsx
Impact: ZERO - pure styling, no state changes
Can Fix: YES ✅
```

### Bug #20: Dashboard Background Blur
**Risk: VERY LOW** - CSS only
```
Current: Modal doesn't blur background
Fix: Add backdrop-filter: blur CSS
Files: Profile.jsx or modal wrapper
Impact: ZERO - only affects modal appearance
Can Fix: YES ✅
```

### Bug #21: Refresh Button Not Working
**Risk: LOW** - Add onClick handler
```
Current: Button exists but no handler
Fix: Find button, add onClick with refetch function
Files: Home.jsx or feature component
Impact: LOW - isolated to that button only
Can Fix: YES ✅ (after locating button)
```

### Bug #22: Section Title Copy Updates
**Risk: VERY LOW** - Text change only
```
Current: Misleading section titles
Fix: Change text strings
Files: Various components
Impact: ZERO - content only
Can Fix: YES ✅
```

---

## ⚠️ TIER 2: MEDIUM RISK (Need careful analysis - 6 bugs)

### Bug #23: Explore Collection Link
**Risk: MEDIUM** - Routing change
```
Current: Button doesn't navigate
Fix: Add routing link/onClick
Concern: Need to verify correct route exists
Impact: Could break if route wrong
Can Fix: YES ✅ (after verifying route)
```

### Bug #24: Help Centre Scroll Reset
**Risk: VERY LOW** - Apply existing hook
```
Current: Scrolls to bottom on refresh
Fix: Import useResetScroll hook
Files: HelpCentre.jsx (if exists)
Impact: ZERO - using proven hook
Can Fix: YES ✅
```

### Bug #25: Wishlist Back Scroll
**Risk: VERY LOW** - Apply existing hook
```
Current: Scrolls to bottom when going back
Fix: Import useResetScroll hook
Files: Wishlist.jsx
Impact: ZERO - using proven hook
Can Fix: YES ✅
```

### Bug #26: Payments Back Scroll
**Risk: VERY LOW** - Apply existing hook
```
Current: Scrolls to bottom when going back
Fix: Import useResetScroll hook
Files: Payments.jsx in profile
Impact: ZERO - using proven hook
Can Fix: YES ✅
```

### Bug #27: Order Tracking Loop
**Risk: MEDIUM** - Navigation state management
```
Current: Back button creates loop
Fix: Track navigation history properly
Concern: Might affect other pages' back behavior
Impact: Could disturb navigation flow
Can Fix: MAYBE ⚠️ (needs careful review)
```

### Bug #28: Social Gallery Icon Redirect
**Risk: MEDIUM** - Need to find code
```
Current: Icon redirects to top instead of opening
Fix: Fix click handler
Concern: Don't know current implementation
Impact: Could affect other gallery functions
Can Fix: YES ✅ (after locating code)
```

---

## 🔴 TIER 3: HIGH RISK (Skip these - 4 bugs)

### Bug #29: Ad Carousel Swipe ❌ SKIP
**Risk: HIGH** - Might need new library
```
Reason: Could affect other carousels
Solution: Skip for now, defer to next phase
```

### Bug #30: Product Image in Cart ❌ SKIP
**Risk: HIGH** - Data flow change
```
Reason: Could affect image display everywhere
Solution: Skip for now, needs backend coordination
```

### Bug #31: Review System (textbox + update) ❌ SKIP
**Risk: HIGH** - Complex state management
```
Reason: Could affect form validation, submission
Solution: Skip for now, needs thorough testing
```

### Bug #32: Blogs Content Not Visible ❌ SKIP
**Risk: HIGH** - API binding issue
```
Reason: Could affect other API calls
Solution: Skip for now, investigate separately
```

---

## SAFE TO FIX NOW: 12 BUGS

**Tier 1 (Safest):** 5 bugs ✅
- Dashboard highlighting
- Icon highlighting
- Background blur
- Refresh button
- Text updates

**Tier 2 (Medium):** 6 bugs ✅
- Explore collection link
- Help centre scroll
- Wishlist scroll
- Payments scroll
- Order tracking
- Social gallery redirect

**Skip for now:** 4 bugs ⏸️
- Ad carousel (needs new library)
- Product image (data flow)
- Review system (complex)
- Blogs content (API investigation)

---

## IMPLEMENTATION STRATEGY

1. **Start with Tier 1** (5 bugs, safest)
   - No disturbance risk
   - Quick wins
   - Build confidence

2. **Then Tier 2** (6 bugs, medium risk)
   - Verify code first
   - Test thoroughly
   - Check for side effects

3. **Skip Tier 3** (4 bugs)
   - Too risky
   - Defer to next phase
   - Needs investigation

---

## COMMIT MESSAGE TEMPLATE

For each bug fix:
```
Fix: [Bug name]

- What: Brief description
- Why: Why this fix needed
- How: Brief implementation
- Risk: Zero/Low/None
- Test: How to verify

This fix is isolated to [component/area].
No impact on other features.
```

---

## BEFORE I START EACH FIX

Checklist:
- [ ] Read full component code
- [ ] Identify exact issue location
- [ ] Plan minimal change
- [ ] Check for side effects
- [ ] Verify dependencies
- [ ] Create test case
- [ ] Only then implement

---

## IF I FIND DISTURBANCE RISK

I will:
1. **STOP immediately** (don't implement)
2. **Report the risk** (tell you why)
3. **Suggest alternative** (if possible)
4. **Skip that bug** (move to next)

Safety first, always.

---

