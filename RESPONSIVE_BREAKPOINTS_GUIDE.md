# Responsive Breakpoints Guide - CrickBuddy

## Tailwind CSS Breakpoints Used

```
Mobile:   < 640px   (default, no prefix)
Tablet:   ≥ 640px   (sm:)
Desktop:  ≥ 768px   (md:)
Large:    ≥ 1024px  (lg:)
XL:       ≥ 1280px  (xl:)
2XL:      ≥ 1536px  (2xl:)
```

## Visual Examples

### 📱 Mobile (< 640px)
```
┌─────────────────────┐
│   ☰  CrickBuddy    │  ← Hamburger menu
├─────────────────────┤
│                     │
│   [Full Width]      │  ← Hero section
│   Cricket           │
│   Live Central      │
│                     │
│   [Button 1]        │  ← Stacked buttons
│   [Button 2]        │
│                     │
├─────────────────────┤
│  [Stat] [Stat]      │  ← 2 columns
│  [Stat] [Stat]      │
├─────────────────────┤
│                     │
│  [Match Card]       │  ← Full width cards
│  Team 1  123/4      │
│  Team 2  145/6      │
│                     │
└─────────────────────┘
```

### 📱 Tablet (640px - 1023px)
```
┌────────────────────────────────┐
│  CB  Home  Live  Series  Teams │  ← Full navbar
├────────────────────────────────┤
│                                │
│     Cricket Live Central       │  ← Larger text
│                                │
│  [Button 1]  [Button 2]        │  ← Side by side
│                                │
├────────────────────────────────┤
│  [Stat] [Stat] [Stat] [Stat]   │  ← 4 columns
├────────────────────────────────┤
│                                │
│  [Match Card - Wider]          │
│  Team 1  123/4  (20 ov)        │
│  Team 2  145/6  (18.3 ov)      │
│                                │
└────────────────────────────────┘
```

### 💻 Desktop (≥ 1024px)
```
┌──────────────────────────────────────────────┐
│  CB  Home  Live  Series  Teams  Rankings  🔍 │
├──────────────────────────────────────────────┤
│                                              │
│        Cricket Live Central                  │
│     Real-time scores & analytics             │
│                                              │
│    [Button 1]        [Button 2]              │
│                                              │
├──────────────────────────────────────────────┤
│  [Stat]  [Stat]  [Stat]  [Stat]              │
├──────────────────────────────────────────────┤
│                                              │
│  [Match Card - Full Details]                 │
│  🏴 Team 1    123/4 (20 ov) RR: 6.15        │
│  🏴 Team 2    145/6 (18.3 ov) RR: 7.84      │
│  📍 Venue: MCG, Melbourne                    │
│                                              │
└──────────────────────────────────────────────┘
```

## Component-Specific Breakpoints

### Navbar
- **Mobile**: Hamburger menu, hidden search
- **Tablet+**: Full menu, visible search

### Hero Section
- **Mobile**: `text-3xl`, stacked buttons, `py-12`
- **Tablet**: `text-5xl`, side-by-side buttons, `py-20`
- **Desktop**: `text-7xl`, larger spacing, `py-32`

### Stats Cards
- **Mobile**: 2 columns (`grid-cols-2`)
- **Desktop**: 4 columns (`grid-cols-4`)

### Match Cards
- **Mobile**: 
  - Smaller team flags (40px)
  - Compact score boxes
  - Hidden run rate on small screens
  - Truncated team names
- **Tablet+**: 
  - Larger flags (48px)
  - Full score details
  - Visible run rates
  - Full team names

### Scorecard Tables
- **Mobile**: 
  - Horizontal scroll enabled
  - Sticky first column
  - Smaller text (`text-xs`)
  - Compact padding
- **Tablet+**: 
  - Full table width
  - Normal text size
  - Standard padding

### Match Header
- **Mobile**: 
  - Stacked layout
  - Smaller team circles (48px)
  - Compact info
- **Tablet+**: 
  - Side-by-side layout
  - Larger circles (64px)
  - Full details

## Testing Checklist

### Mobile (375px - iPhone SE)
- [ ] Navbar hamburger works
- [ ] All text is readable
- [ ] Buttons are tappable (min 44px)
- [ ] No horizontal overflow
- [ ] Images load properly
- [ ] Cards stack vertically
- [ ] Tables scroll horizontally

### Tablet (768px - iPad)
- [ ] Navbar shows all items
- [ ] 2-column layouts work
- [ ] Proper spacing between elements
- [ ] Touch targets are adequate
- [ ] No layout breaks

### Desktop (1280px+)
- [ ] Full layout displayed
- [ ] Proper max-width containers
- [ ] All features visible
- [ ] Hover states work
- [ ] Optimal reading width

## Quick Reference

### Common Responsive Classes
```css
/* Padding */
p-3 sm:p-4 md:p-6

/* Text Size */
text-sm sm:text-base md:text-lg lg:text-xl

/* Flex Direction */
flex-col sm:flex-row

/* Grid Columns */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

/* Width */
w-full sm:w-auto

/* Hide/Show */
hidden sm:block
sm:hidden

/* Spacing */
space-y-4 sm:space-y-6
gap-3 sm:gap-6

/* Margins */
mb-4 sm:mb-6 md:mb-8
```

## Pro Tips

1. **Always test on real devices** - Emulators don't show everything
2. **Use Chrome DevTools** - Toggle device toolbar (Ctrl+Shift+M)
3. **Check landscape mode** - Especially for tablets
4. **Test touch interactions** - Ensure all buttons are easily tappable
5. **Verify text readability** - Minimum 14px for body text on mobile
6. **Check image loading** - Optimize for mobile networks
7. **Test with slow 3G** - Ensure good performance

## Browser DevTools Shortcuts

- **Chrome**: F12 → Toggle Device Toolbar (Ctrl+Shift+M)
- **Firefox**: F12 → Responsive Design Mode (Ctrl+Shift+M)
- **Safari**: Develop → Enter Responsive Design Mode

## Common Viewport Sizes to Test

| Device | Width | Height | Notes |
|--------|-------|--------|-------|
| iPhone SE | 375px | 667px | Small mobile |
| iPhone 12/13 | 390px | 844px | Standard mobile |
| iPhone 14 Pro Max | 430px | 932px | Large mobile |
| iPad Mini | 768px | 1024px | Small tablet |
| iPad Air | 820px | 1180px | Standard tablet |
| iPad Pro 12.9" | 1024px | 1366px | Large tablet |
| Laptop | 1280px | 720px | Small laptop |
| Desktop | 1920px | 1080px | Standard desktop |

Happy responsive testing! 📱💻🖥️
