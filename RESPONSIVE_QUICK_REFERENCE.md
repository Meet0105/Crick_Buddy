# Responsive Design Quick Reference Card

## 🎯 Quick Tailwind Responsive Patterns

### Spacing
```tsx
// Padding
p-3 sm:p-4 md:p-6 lg:p-8

// Margin
m-2 sm:m-4 md:m-6

// Gap
gap-3 sm:gap-4 md:gap-6

// Space Between
space-y-4 sm:space-y-6
space-x-2 sm:space-x-4
```

### Typography
```tsx
// Font Size
text-sm sm:text-base md:text-lg lg:text-xl

// Font Weight
font-medium sm:font-semibold md:font-bold

// Line Height
leading-tight sm:leading-normal
```

### Layout
```tsx
// Flex Direction
flex-col sm:flex-row

// Grid Columns
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Width
w-full sm:w-auto md:w-1/2

// Max Width
max-w-sm sm:max-w-md lg:max-w-4xl
```

### Display
```tsx
// Hide on mobile, show on desktop
hidden sm:block

// Show on mobile, hide on desktop
block sm:hidden

// Inline on desktop only
hidden sm:inline
```

### Sizing
```tsx
// Width & Height
w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16

// Min/Max Height
min-h-screen sm:min-h-0
max-h-80 sm:max-h-96
```

### Borders & Radius
```tsx
// Border Radius
rounded-lg sm:rounded-xl md:rounded-2xl

// Border Width
border sm:border-2 md:border-4
```

## 📱 Common Mobile Patterns

### Full Width Buttons
```tsx
<button className="w-full sm:w-auto px-6 py-3">
  Click Me
</button>
```

### Stacked to Side-by-Side
```tsx
<div className="flex flex-col sm:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Truncate Long Text
```tsx
<span className="truncate max-w-[120px] sm:max-w-none">
  Long Team Name Here
</span>
```

### Horizontal Scroll Table
```tsx
<div className="overflow-x-auto -mx-3 sm:mx-0">
  <table className="min-w-full">
    {/* table content */}
  </table>
</div>
```

### Sticky Column
```tsx
<th className="sticky left-0 bg-slate-800 z-10">
  Name
</th>
```

## 🎨 Component Patterns

### Card Component
```tsx
<div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg">
  <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-4">
    Title
  </h3>
  <p className="text-sm sm:text-base text-gray-600">
    Content
  </p>
</div>
```

### Hero Section
```tsx
<section className="py-12 sm:py-20 md:py-32 px-4">
  <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6">
    Hero Title
  </h1>
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
    <button className="w-full sm:w-auto">CTA 1</button>
    <button className="w-full sm:w-auto">CTA 2</button>
  </div>
</section>
```

### Navigation
```tsx
{/* Desktop */}
<nav className="hidden md:flex items-center space-x-4">
  <Link href="/">Home</Link>
  <Link href="/about">About</Link>
</nav>

{/* Mobile */}
<button className="md:hidden" onClick={toggleMenu}>
  ☰
</button>
```

### Stats Grid
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
  <div className="p-4 sm:p-8 text-center">
    <h3 className="text-2xl sm:text-3xl font-bold">12</h3>
    <p className="text-sm sm:text-base">Label</p>
  </div>
</div>
```

## 🔧 Utility Combinations

### Responsive Container
```tsx
<div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
  {/* content */}
</div>
```

### Responsive Image
```tsx
<img 
  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full object-cover"
  src={imageUrl}
  alt="Description"
/>
```

### Responsive Text Block
```tsx
<div className="text-sm sm:text-base md:text-lg leading-relaxed">
  <p className="mb-3 sm:mb-4">Paragraph text</p>
</div>
```

## 📊 Breakpoint Reference

| Prefix | Min Width | Device |
|--------|-----------|--------|
| (none) | 0px | Mobile |
| sm: | 640px | Tablet |
| md: | 768px | Desktop |
| lg: | 1024px | Large Desktop |
| xl: | 1280px | XL Desktop |
| 2xl: | 1536px | 2XL Desktop |

## ⚡ Performance Tips

1. **Use `hidden` instead of `display: none`** for better performance
2. **Minimize breakpoint changes** - stick to 2-3 breakpoints
3. **Use `flex-shrink-0`** to prevent image squishing
4. **Add `min-w-0`** to flex items for proper truncation
5. **Use `truncate`** for single-line text overflow

## 🎯 Touch Target Sizes

```tsx
// Minimum 44x44px for touch targets
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  Tap Me
</button>
```

## 🚀 Common Mistakes to Avoid

❌ **Don't:**
```tsx
<div className="w-[500px]">Fixed width</div>
<p className="text-[24px]">Fixed size</p>
```

✅ **Do:**
```tsx
<div className="w-full sm:w-auto">Responsive width</div>
<p className="text-lg sm:text-xl">Responsive size</p>
```

## 📝 Testing Checklist

- [ ] Test on iPhone SE (375px)
- [ ] Test on iPhone 12 (390px)
- [ ] Test on iPad (768px)
- [ ] Test on Desktop (1280px)
- [ ] Check landscape mode
- [ ] Verify touch targets
- [ ] Test horizontal scroll
- [ ] Check text readability

## 🎨 Color & Contrast

Maintain proper contrast ratios:
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **Interactive elements**: Clear focus states

## 💡 Pro Tips

1. **Mobile First**: Start with mobile styles, add larger breakpoints
2. **Test Early**: Check responsive design as you build
3. **Use DevTools**: Chrome/Firefox responsive mode is your friend
4. **Real Devices**: Always test on actual phones/tablets
5. **Consistent Spacing**: Use Tailwind's spacing scale (4, 8, 12, 16, etc.)

## 🔗 Useful Resources

- Tailwind Docs: https://tailwindcss.com/docs/responsive-design
- Can I Use: https://caniuse.com/
- Chrome DevTools: F12 → Toggle Device Toolbar
- Responsive Checker: https://responsivedesignchecker.com/

---

**Remember**: Mobile users are often your largest audience. Design for them first! 📱✨
