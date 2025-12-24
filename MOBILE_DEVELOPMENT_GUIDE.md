# 📱 Mobile Development Best Practices for TRR-RP Team

## Key Principles

### 1. Mobile-First Approach
Always design for mobile first, then enhance for larger screens:

```tsx
// ❌ Bad: Desktop-first
<div className="p-8 hidden sm:block">
  Desktop version
</div>

// ✅ Good: Mobile-first
<div className="p-4 sm:p-8">
  Responsive content
</div>
```

### 2. Touch Target Standards
All interactive elements must be at least 44×44 pixels:

```tsx
// ❌ Bad: Too small for mobile
<button className="p-1 text-xs">Click</button>

// ✅ Good: Proper touch target
<button className="p-3 sm:p-2 min-h-[44px]">Click</button>
```

### 3. Font Size on Mobile
Always use 16px or larger for input fields to prevent auto-zoom:

```tsx
// ❌ Bad: Will trigger zoom on iOS
<input className="text-sm" />

// ✅ Good: Proper sizing
<input className="text-base min-h-[44px]" />
```

## Common Patterns

### Responsive Typography
```tsx
<h1 className="text-base sm:text-lg md:text-xl lg:text-2xl">
  Heading
</h1>
```

### Responsive Spacing
```tsx
<div className="p-4 sm:p-6 md:p-8 gap-3 sm:gap-4 md:gap-6">
  Content
</div>
```

### Responsive Grids
```tsx
// 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Responsive Tables (Card on Mobile)
```tsx
{/* Desktop Table */}
<div className="hidden md:block overflow-x-auto">
  <table>{/* table content */}</table>
</div>

{/* Mobile Cards */}
<div className="md:hidden space-y-3">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Safe Area Support (Notched Devices)
```tsx
<header className="pt-safe-top px-4 pb-4">
  <h1>Safe Area Header</h1>
</header>
```

### Responsive Visibility
```tsx
{/* Show only on desktop */}
<div className="hidden lg:block">Desktop Navigation</div>

{/* Show only on mobile */}
<div className="lg:hidden">Mobile Menu</div>
```

## Component Checklist

When creating new components, ensure:

- [ ] Minimum 44px height for buttons/inputs
- [ ] Test on 320px width (smallest phones)
- [ ] Test on tablet size (768px)
- [ ] Test on desktop (1024px+)
- [ ] No horizontal scrolling at any breakpoint
- [ ] Text is readable without zooming
- [ ] Forms are fully usable on mobile
- [ ] Proper safe area padding for notched devices
- [ ] Touch targets don't overlap
- [ ] Adequate spacing between interactive elements

## Breakpoint Guide

| Device | Width | Breakpoint | Use Case |
|--------|-------|-----------|----------|
| Small Phone | 320-374px | `xs`, `sm` | iPhone SE, older models |
| Large Phone | 375-639px | `sm` | Most smartphones |
| Tablet | 640-1023px | `md`, `lg` | iPad Mini, tablet devices |
| Small Desktop | 1024-1279px | `xl` | Laptop |
| Large Desktop | 1280px+ | `2xl` | Desktop monitors |

## Color & Contrast

Mobile considerations:
- Ensure sufficient contrast (WCAG AA minimum)
- Test colors with color blindness simulators
- Darker shadows work better on OLED screens
- Use system fonts for battery efficiency

## Performance Tips

1. **Reduce Motion**: Respect `prefers-reduced-motion`
2. **Lazy Loading**: Load images only when visible
3. **Minimize Repaints**: Use `transform` instead of `top`/`left`
4. **Touch Events**: Use `touch-manipulation` to avoid delays

## Accessibility on Mobile

```tsx
// Always include aria labels
<button 
  className="min-h-[44px]"
  aria-label="Open menu"
>
  <Menu size={20} />
</button>

// Proper semantic HTML
<nav className="space-y-2">
  <a href="#">Link 1</a>
  <a href="#">Link 2</a>
</nav>
```

## Testing Tools

### Browser DevTools
1. Chrome DevTools → Device Toolbar
2. Firefox Responsive Design Mode
3. Safari Develop → Enter Responsive Design Mode

### Device Testing
- [BrowserStack](https://www.browserstack.com/) - Real devices
- [Sauce Labs](https://saucelabs.com/) - Automated testing
- Physical devices (iPhones, Android phones)

### Validation
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Lighthouse (Chrome DevTools)

## Common Mistakes to Avoid

❌ **DON'T:**
- Use only hover states (mobile has no hover)
- Make text smaller than 14px
- Create touch targets smaller than 44px
- Forget safe area padding on notched devices
- Use fixed positioning without testing mobile
- Hide important content on mobile
- Use desktop-only designs

✅ **DO:**
- Test on real mobile devices
- Use both hover and active states
- Provide mobile-specific layouts
- Test on various screen sizes
- Optimize images for mobile
- Ensure proper touch feedback
- Support all device orientations

## Example: Complete Mobile-Optimized Component

```tsx
export default function MobileOptimizedCard({ title, description }) {
  return (
    <div className="rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 bg-white">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4">
        {description}
      </p>
      <button className="w-full px-4 py-3 sm:py-2 min-h-[44px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors">
        Action
      </button>
    </div>
  );
}
```

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Mobile-Friendly](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
- [Google Mobile Design](https://developers.google.com/search/mobile-sites)
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)

## Getting Help

For questions about mobile responsiveness:
1. Check this guide first
2. Review existing components in `/src/components`
3. Test using browser DevTools
4. Ask team lead or senior developer

---

**Last Updated:** December 2025
**Maintained By:** Development Team
