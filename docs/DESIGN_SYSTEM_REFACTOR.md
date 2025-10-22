# ChainPilot Design System Refactor - Complete Guide

## Overview

ChainPilot has been completely redesigned with a VeChain-inspired aesthetic featuring a professional, minimal OpenAI-style interface with signature pink accents (#E2008C).

## 🎨 Design Philosophy

The design draws inspiration from modern AI interfaces with:
- **Deep dark backgrounds** (#0B0B0B) for reduced eye strain
- **Pink gradient accents** (#E2008C to #FF1FD6) for brand identity
- **Glass morphism effects** for depth and sophistication
- **Smooth animations** using Framer Motion for polished interactions
- **Clear typography hierarchy** with proper contrast

---

## Color Palette

### Primary Colors
```css
--vet-bg: #0B0B0B          /* Main background */
--vet-surface: #111111      /* Cards and surfaces */
--vet-input: #151515        /* Input fields */
--vet-border: #1F1F1F       /* Subtle borders */
```

### Accent Colors
```css
--vet-accent: #E2008C       /* Primary pink */
--vet-accent-hover: #FF1FD6 /* Hover state */
--vet-success: #00C896      /* Success green */
--vet-error: #FF3B5C        /* Error red */
--vet-warning: #FFB100      /* Warning orange */
```

### Text Colors
```css
--vet-text-primary: #FFFFFF   /* Primary text */
--vet-text-secondary: #B0B0B0 /* Secondary text */
--vet-text-muted: #6A6A6A     /* Muted text */
```

---

## Component Library

### 1. Chat Message Bubbles

#### User Messages
```tsx
<div className="vet-chat-user">
  Your message here
</div>
```
- Background: `#1A1A1A` with border
- Max width: 80%
- Aligned: Right (ml-auto)
- Padding: `px-4 py-3`
- Border radius: `rounded-2xl`

#### AI Messages
```tsx
<div className="vet-chat-ai">
  AI response here
</div>
```
- Background: Gradient from `#80004B` to `#0D0010`
- Shadow: Pink glow `0_0_15px_rgba(226,0,140,0.2)`
- Max width: 80%
- Aligned: Left
- Padding: `px-4 py-3`

### 2. Buttons

#### Primary Button (with Shimmer)
```tsx
<Button className="vet-button-primary vet-button-shimmer">
  Action
</Button>
```
- Background: `#E2008C`
- Hover: `#FF1FD6`
- **Shimmer animation**: Automatic sheen effect
- Shadow: Pink glow
- Border radius: `rounded-xl`

#### Secondary Button
```tsx
<Button className="vet-button-secondary">
  Cancel
</Button>
```
- Background: Transparent
- Border: `border-vet-border`
- Hover: `bg-vet-hover`

### 3. Input Fields

#### Standard Input
```tsx
<input className="vet-input" placeholder="Type here..." />
```
- Background: `#111111`
- Border: `#2A2A2A`
- Focus: Pink border (`#E2008C`)
- Placeholder: `#B3B3B3`

#### Input Wrapper (Recommended)
```tsx
<div className="vet-input-wrapper">
  <input className="flex-1 bg-transparent" />
  <Button className="vet-button-primary vet-button-shimmer">
    Send
  </Button>
</div>
```
- Contains input + send button
- Unified styling

### 4. Cards

#### Glass Card (Main Cards)
```tsx
<div className="vet-glass-card">
  Card content
</div>
```
- Background: `bg-vet-surface/80` with `backdrop-blur-xl`
- Border: `border-vet-border`
- Rounded: `rounded-2xl`
- Shadow: Subtle glow

#### Info Card (Inner Cards)
```tsx
<div className="vet-info-card">
  <div className="vet-transaction-item">
    <span>Label:</span>
    <span className="vet-amount-positive">+200 ETH</span>
  </div>
</div>
```
- Background: `#151515`
- Border: `#2A2A2A`
- Used for transaction details, addresses, etc.

### 5. Loading States

#### Animated Dots
```tsx
<div className="vet-loading-dots">
  <span className="vet-loading-dot" />
  <span className="vet-loading-dot" />
  <span className="vet-loading-dot" />
</div>
```
- Three pulsing dots
- Staggered animation
- White/80 opacity

---

## Updated Components

### ✅ Completed Transformations

1. **Landing Page** (`app/page.tsx`)
   - VeChain hero section with ambient glow
   - Pink gradient CTAs
   - Glass morphism feature cards

2. **Chat Page** (`app/(chat)/page.tsx`)
   - Loading screen with pink accents
   - Welcome screen with smooth animations
   - Feature cards with hover effects

3. **Message Component** (`components/message.tsx`)
   - User/AI message bubbles matching mockup
   - Tool cards with VeChain styling
   - Loading indicators with animated dots

4. **All Alchemy Tool Cards**
   - BalanceCard
   - TokenMetadataCard
   - TokenPriceCard
   - GasPriceCard
   - NftsOwnedCard
   - And more...

5. **Sidebar Components**
   - Sidebar history with pink active states
   - Glass morphism background
   - Smooth hover transitions

6. **Chat Interface**
   - Multimodal input with mockup styling
   - Send button with shimmer effect
   - Input wrapper design

7. **Chat Header**
   - Frosted glass effect
   - Pink accent elements

---

## Design System Classes Reference

### Layout
- `.vet-hero` - Hero section (centered, padded)
- `.vet-nav` - Navigation bar (sticky, blurred)
- `.vet-glow-bg` - Ambient background glow

### Typography
- `.vet-heading` - Large headings (5xl-6xl)
- `.vet-subheading` - Section headings (3xl-4xl)
- `.vet-body` - Body text (lg, secondary color)
- `.vet-caption` - Small text (sm, muted color)

### State Classes
- `.vet-success` - Success state styling
- `.vet-error` - Error state styling
- `.vet-amount-positive` - Positive amounts (#00FF9D)
- `.vet-amount-negative` - Negative amounts (#FF3B5C)

---

## Animation Guidelines

### Entry Animations
```tsx
<motion.div
  initial={{ opacity: 0, y: 10, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  Content
</motion.div>
```

### Hover Effects
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Interactive element
</motion.div>
```

### Staggered Lists
```tsx
{items.map((item, idx) => (
  <motion.div
    key={idx}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: idx * 0.1 }}
  >
    {item}
  </motion.div>
))}
```

---

## Usage Examples

### Example 1: Transaction Card
```tsx
<div className="vet-chat-ai">
  <p>Here are your latest transfers:</p>
  <div className="vet-info-card mt-3 space-y-1">
    <div className="vet-transaction-item">
      <span>To: 0x34a...9F2b</span>
      <span className="vet-amount-positive">+200 ETH</span>
    </div>
    <div className="vet-transaction-item">
      <span>To: 0x81c...D5E9</span>
      <span className="vet-amount-negative">-50 ETH</span>
    </div>
  </div>
</div>
```

### Example 2: Confirmation Card
```tsx
<div className="vet-chat-ai">
  <p>Transaction preview:</p>
  <div className="vet-info-card mt-3">
    <div className="vet-transaction-item">
      <span>Recipient:</span>
      <span className="text-white">0x32...F9a4</span>
    </div>
  </div>
  <div className="vet-info-card mt-2">
    <div className="vet-transaction-item">
      <span>Amount:</span>
      <span className="vet-amount-negative">-50 ETH</span>
    </div>
  </div>
  <Button className="mt-4 w-full vet-button-primary">
    Confirm Transaction
  </Button>
</div>
```

---

## Development Server

The application is running at:
- **Local**: http://localhost:3001
- **Network**: Check terminal for network URL

---

## Testing Checklist

- [ ] Landing page displays correctly
- [ ] Chat page loads with proper styling
- [ ] Message bubbles have correct colors
- [ ] Send button has shimmer animation
- [ ] Input field styling matches mockup
- [ ] Tool cards display properly
- [ ] Sidebar has pink active states
- [ ] All animations are smooth
- [ ] Responsive on mobile devices
- [ ] Dark mode works correctly

---

## Future Enhancements

1. Add more subtle micro-interactions
2. Implement skeleton loading states with VeChain colors
3. Add toast notifications with pink accents
4. Create more tool-specific card designs
5. Add dark/light mode toggle (currently dark-only)

---

## Credits

Design inspired by VeChain AI Terminal mockups
Built for ChainPilot - Multi-chain blockchain AI assistant
Powered by ADK and Alchemy APIs

---

**Last Updated**: January 2025
**Version**: 2.0.0
