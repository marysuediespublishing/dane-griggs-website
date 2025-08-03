# Reusable Card Component System

## Design Principles
- **Modular Design**: Components can be mixed and matched across pages
- **Consistent Branding**: All cards follow Dane's cosmic color palette
- **Scalable**: Components work across mobile, tablet, and desktop
- **Accessible**: Proper focus states, screen reader support
- **Performance**: Optimized for fast loading and smooth animations

---

## Book Card Component

### Standard Book Card
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │         Book Cover              │ │
│ │         (3D hover effect)       │ │
│ │                                 │ │
│ │        [New Release]            │ │ ← Optional badge
│ └─────────────────────────────────┘ │
│                                     │
│ Book Title (Playfair Display)       │
│ Series Name (Inter, smaller)        │
│                                     │
│ [Cerastean] [Space Station] [🌶️🌶️] │ ← Species & tags
│                                     │
│ ⭐⭐⭐⭐⭐ 4.8 (2,847 ratings)       │
│                                     │
│ ┌─────────────┐ ┌───────────────┐   │
│ │ Read on KU  │ │ Buy on Amazon │   │ ← CTA buttons
│ └─────────────┘ └───────────────┘   │
└─────────────────────────────────────┘
```

### Compact Book Card (for carousels)
```
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │   Book Cover    │ │
│ │   (smaller)     │ │
│ └─────────────────┘ │
│                     │
│ Book Title          │
│ [Species Badge]     │
│ ⭐⭐⭐⭐⭐           │
└─────────────────────┘
```

### Featured Book Card (hero sections)
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────┐                                             │
│ │             │   The Bride Program                         │
│ │   Book      │   Saving Ceraste Series #1                 │
│ │   Cover     │                                             │
│ │   (Large)   │   "When Maya volunteers for the medical     │
│ │             │    exchange program, she doesn't expect     │
│ │             │    to fall for her alien patient..."        │
│ └─────────────┘                                             │
│                     [Cerastean] [Space] [Medical] [🌶️🌶️🌶️] │
│                                                             │
│                     ⭐⭐⭐⭐⭐ 4.8 | 200M+ pages read        │
│                                                             │
│                     ┌─────────────┐ ┌─────────────────┐     │
│                     │ Read Free   │ │ Buy on Amazon   │     │
│                     │ on KU       │ │ $4.99           │     │
│                     └─────────────┘ └─────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

**Book Card Specifications:**
- **Aspect Ratio**: 2:3 for book covers (industry standard)
- **Hover Effects**: 3D lift, cosmic glow, species info overlay
- **Color Coding**: Species badges use distinct cosmic colors
- **Loading States**: Skeleton screens while images load
- **Error States**: Placeholder for missing covers

---

## Series Card Component

### Series Overview Card
```
┌─────────────────────────────────────────────────────────────┐
│                    Saving Ceraste                           │
│                  9-Book Complete Series                     │
│                                                             │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  [+5 more]                │
│ │ B1  │ │ B2  │ │ B3  │ │ B4  │                            │
│ │Cover│ │Cover│ │Cover│ │Cover│                            │
│ └─────┘ └─────┘ └─────┘ └─────┘                            │
│                                                             │
│ "Medical exchange program where human healers meet          │
│  their alien warrior mates on space stations..."           │
│                                                             │
│ ⭐⭐⭐⭐⭐ 4.8 avg | 200M+ pages read | ✅ Complete        │
│                                                             │
│ ┌─────────────────┐ ┌─────────────────────────────────┐     │
│ │ Start with      │ │ View Series Page                │     │
│ │ Book 1          │ │                                 │     │
│ └─────────────────┘ └─────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Series Progress Card (for readers)
```
┌─────────────────────────────────────────────────────────────┐
│                    Saving Ceraste                           │
│                  Your Reading Progress                      │
│                                                             │
│ ████████████████████████████████████████████████░░░░        │
│ 7 of 9 books completed (78%)                               │
│                                                             │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ ✓1  │ │ ✓2  │ │ ✓3  │ │ ✓4  │ │ ✓5  │ │ ✓6  │ │ ✓7  │   │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘   │
│                                                             │
│ ┌─────┐ ┌─────┐                                           │
│ │  8  │ │  9  │  ← Next to read                          │
│ │Next │ │Final│                                           │
│ └─────┘ └─────┘                                           │
│                                                             │
│ ┌─────────────────┐ ┌─────────────────────────────────┐     │
│ │ Continue with   │ │ Mark Book 8 as Read             │     │
│ │ Book 8          │ │                                 │     │
│ └─────────────────┘ └─────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Testimonial Card Component

### Standard Testimonial Card
```
┌─────────────────────────────────────────────────────────────┐
│ "The aliens are so sweet you can't help but love them.     │
│  No silly misunderstandings - just real chemistry that     │
│  builds naturally. Dane Griggs knows how to write          │
│  authentic relationships!"                                  │
│                                                             │
│ ⭐⭐⭐⭐⭐                                                    │
│                                                             │
│ Sarah M. - Amazon Verified Purchase                        │
│ The Bride Program                                           │
└─────────────────────────────────────────────────────────────┘
```

### Featured Testimonial Card
```
┌─────────────────────────────────────────────────────────────┐
│                        💫 Featured Review                   │
│                                                             │
│ "I've been reading alien romance for years, and Dane       │
│  Griggs is hands down my favorite author. Her characters   │
│  make smart choices, the world-building is incredible,     │
│  and the chemistry is off the charts. The Saving Ceraste   │
│  series changed my standards for sci-fi romance!"          │
│                                                             │
│ ⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐ ⭐⭐⭐⭐⭐                           │
│                                                             │
│ ┌─────────────┐                                           │
│ │ Profile     │ BookLover_2024 - Goodreads Top Reviewer    │
│ │ Avatar      │ "5-star rating for entire series"          │
│ └─────────────┘                                           │
│                                                             │
│ [View Full Review] [Share Review]                          │
└─────────────────────────────────────────────────────────────┘
```

### Testimonial Carousel Card
```
┌─────────────────────────────────────────────────────────────┐
│                            "..."                            │
│                                                             │
│ "Smart heroines, sexy aliens, zero manufactured drama.     │
│  This is what sci-fi romance should be!"                   │
│                                                             │
│               ⭐⭐⭐⭐⭐                                      │
│                                                             │
│             Jennifer K. - Amazon Review                    │
│                                                             │
│                        ● ○ ○ ○                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Blog Post Card Component

### Standard Blog Card
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ │
│ │             Featured Image                              │ │
│ │         (cosmic/writing theme)                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Understanding Cerastean Biology: A Writer's Research       │
│                                                             │
│ "Ever wondered how I develop the alien species in my       │
│  books? Here's a deep dive into the medical aspects        │
│  of Cerastean physiology and why it matters for..."        │
│                                                             │
│ March 15, 2024 | 8 min read | Writing Process              │
│                                                             │
│ [Alien Cultures] [World Building] [Behind the Scenes]      │
│                                                             │
│ [Read More →]                                               │
└─────────────────────────────────────────────────────────────┘
```

### Compact Blog Card
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────┐  Writing Realistic Alien Romance                │
│ │ Thumb   │                                                 │
│ │ Image   │  "The key to believable alien romance          │
│ │(100px)  │   isn't just the biology—it's the..."         │
│ └─────────┘                                                 │
│             March 10, 2024 | 5 min read                    │
│             [World Building]                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Author Card Component

### Author Bio Card
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────┐                                             │
│ │             │    Dane Griggs                              │
│ │   Author    │    Sci-Fi Romance Author                    │
│ │   Photo     │                                             │
│ │ (circular)  │    "Florida mom living her sci-fi dreams   │
│ │             │     one alien warrior at a time"           │
│ └─────────────┘                                             │
│                                                             │
│ 📚 47 Published Books | ⭐ 200M+ Pages Read                │
│ 🏠 Based in Florida | 🐕 Dachshund Mom                     │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐     │
│ │ Facebook    │ │ Goodreads   │ │ Newsletter Signup   │     │
│ └─────────────┘ └─────────────┘ └─────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Newsletter Card Component

### Newsletter Signup Card
```
┌─────────────────────────────────────────────────────────────┐
│                 [Cosmic background pattern]                 │
│                                                             │
│           📧 Get Your Free Alien Romance Pack               │
│                                                             │
│ "Join 10,000+ readers and get exclusive excerpts,          │
│  early release news, and your free starter pack with       │
│  bonus alien species guides!"                              │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📧 Enter your email address                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │             Get Your Free Books                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│        No spam. Unsubscribe anytime. GDPR compliant.       │
└─────────────────────────────────────────────────────────────┘
```

### Newsletter Success Card
```
┌─────────────────────────────────────────────────────────────┐
│                           ✅                               │
│                                                             │
│              Welcome to the Cosmic Circle!                 │
│                                                             │
│ "Check your email for your free alien romance starter      │
│  pack. Your first exclusive content is on its way!"        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │              Follow on Social Media                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [📘 Facebook] [📖 Goodreads] [🌐 Website]                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Statistics Card Component

### Author Stats Card
```
┌─────────────────────────────────────────────────────────────┐
│                    Author Statistics                        │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │     47      │ │   200M+     │ │   9,339+    │             │
│ │             │ │             │ │             │             │
│ │   Books     │ │Pages Read   │ │  Ratings    │             │
│ │ Published   │ │             │ │             │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │      2      │ │     4.8     │ │   10,000+   │             │
│ │             │ │             │ │             │             │
│ │  Complete   │ │   Average   │ │Newsletter   │             │
│ │   Series    │ │   Rating    │ │Subscribers  │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

---

## Card System Specifications

### Color System
- **Card Backgrounds**: Solar White with subtle cosmic patterns
- **Borders**: Nebula Purple or Cosmic Rose for emphasis
- **Hover States**: Stellar Gold glow effects
- **Text Hierarchy**: Deep Space Navy for headings, darker grays for body

### Typography
- **Card Titles**: Playfair Display, 18-24px
- **Body Text**: Inter, 14-16px
- **Metadata**: Inter, 12-14px, reduced opacity
- **CTAs**: Inter Medium, 14-16px

### Spacing System
- **Card Padding**: 24px desktop, 16px mobile
- **Element Spacing**: 16px between major elements, 8px between related items
- **Card Gaps**: 24px in grids, 16px in lists

### Animation Guidelines
- **Hover Transitions**: 200ms ease-out
- **Loading States**: Subtle pulse animations
- **State Changes**: 150ms smooth transitions
- **3D Effects**: CSS transforms, hardware accelerated

### Responsive Behavior
- **Desktop**: Full detail, hover effects active
- **Tablet**: Slightly condensed, touch-friendly targets
- **Mobile**: Stacked layouts, simplified interactions
- **Touch Targets**: Minimum 44px for accessibility

### Accessibility Features
- **Focus Indicators**: Cosmic-themed focus rings
- **Screen Readers**: Proper ARIA labels and descriptions
- **Keyboard Navigation**: Tab order and Enter/Space activation
- **High Contrast**: Alternative color schemes available

This card component system provides a consistent, scalable foundation for all content types across Dane's website while maintaining the cosmic sci-fi romance branding.