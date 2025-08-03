# Books & Series Pages Wireframes

## Books Library Page

### Header with Search & Filters
```
┌─────────────────────────────────────────────────────────────────┐
│                           All Books                             │
│                                                                 │
│  ┌─────────────────────────────────────────┐ [Advanced Filters] │
│  │ 🔍 Search by title, alien species...    │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                 │
│  [All] [Series] [Standalones] [Free Books] [New Releases]      │
│                                                                 │
│  [Alien Species ▼] [Heat Level ▼] [Setting ▼] [Sort: Newest ▼] │
└─────────────────────────────────────────────────────────────────┘
```

### Book Grid Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│ │  Book   │ │  Book   │ │  Book   │ │  Book   │ │  Book   │     │
│ │  Cover  │ │  Cover  │ │  Cover  │ │  Cover  │ │  Cover  │     │
│ │   3D    │ │   3D    │ │   3D    │ │   3D    │ │   3D    │     │
│ │         │ │         │ │         │ │         │ │         │     │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│ Title       Title       Title       Title       Title           │
│ [Cerastean] [Kraken]    [Dulci]     [Cerastean] [Human]        │
│ ⭐⭐⭐⭐⭐   ⭐⭐⭐⭐⭐    ⭐⭐⭐⭐    ⭐⭐⭐⭐⭐   ⭐⭐⭐⭐       │
│ Series #1   Standalone  Series #3   Series #2   Standalone     │
│                                                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│ │  Book   │ │  Book   │ │  Book   │ │  Book   │ │  Book   │     │
│ │  Cover  │ │  Cover  │ │  Cover  │ │  Cover  │ │  Cover  │     │
│ │   3D    │ │   3D    │ │   3D    │ │   3D    │ │   3D    │     │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│                                                                 │
│               [Load More Books] [Back to Top]                   │
└─────────────────────────────────────────────────────────────────┘
```

**Books Page Specifications:**
- **Grid**: 5 columns desktop, 3 tablet, 2 mobile
- **Hover Effects**: 3D book lift, cosmic glow, species info overlay
- **Filtering**: Real-time with Fuse.js, smooth transitions
- **Pagination**: Infinite scroll with load more button
- **Performance**: Lazy loading, image optimization

---

## Individual Book Detail Page

### Book Hero Section
```
┌─────────────────────────────────────────────────────────────────┐
│  [← Back to Books]                        [Share] [♡ Wishlist]  │
│                                                                 │
│  ┌─────────────┐                                               │
│  │             │   The Bride Program                           │
│  │    Book     │   Saving Ceraste Series #1                   │
│  │   Cover     │                                               │
│  │    3D       │   ⭐⭐⭐⭐⭐ 4.8 (2,847 ratings)               │
│  │  (300px)    │                                               │
│  │             │   [Cerastean] [Space Station] [🌶️🌶️🌶️]     │
│  └─────────────┘                                               │
│                     [Read Free on KU] [Buy on Amazon]          │
│                     [Add to Goodreads] [Gift This Book]        │
│                                                                 │
│  "When Maya volunteers for the medical exchange program,        │
│   she doesn't expect to fall for her alien patient..."         │
└─────────────────────────────────────────────────────────────────┘
```

### Book Details Tabs
```
┌─────────────────────────────────────────────────────────────────┐
│  [Synopsis] [Series Info] [Reviews] [Author Notes] [World Building] │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Synopsis Tab Content:                                       │ │
│  │                                                             │ │
│  │ Maya Chen thought volunteering for the medical exchange     │ │
│  │ program would advance her career. She didn't expect to      │ │
│  │ find herself caring for wounded Cerastean warriors on       │ │
│  │ a space station orbiting their homeworld...                 │ │
│  │                                                             │ │
│  │ "No silly misunderstandings. No Mary Sue moments.          │ │
│  │  Just smart people making smart choices while falling      │ │
│  │  in love across the galaxy."                               │ │
│  │                                                             │ │
│  │ Content Warnings: [Explicit scenes] [Medical procedures]   │ │
│  │ [Alien biology discussions]                                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Related Books Section
```
┌─────────────────────────────────────────────────────────────────┐
│                      More from This Series                      │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Book 2  │ │ Book 3  │ │ Book 4  │ │ Book 5  │               │
│  │ Cover   │ │ Cover   │ │ Cover   │ │ Cover   │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│  Next →     Available   Available   Available                   │
│                                                                 │
│                     [View Full Series]                          │
│                                                                 │
│                    Readers Also Enjoyed                         │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │Similar  │ │Similar  │ │Similar  │ │Similar  │               │
│  │ Book    │ │ Book    │ │ Book    │ │ Book    │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

**Book Detail Specifications:**
- **Cover**: High-res 3D presentation with zoom capability
- **Metadata**: Structured data for search engines
- **CTAs**: Multiple purchase/read options with tracking
- **Tabs**: Smooth transitions, deep-linkable sections
- **Recommendations**: Algorithmic similar books

---

## Series Landing Pages

### Series Hero (Saving Ceraste Example)
```
┌─────────────────────────────────────────────────────────────────┐
│                    [Starfield Background]                       │
│                                                                 │
│                       Saving Ceraste                            │
│                    Complete 9-Book Series                       │
│                                                                 │
│    "Experience the complete medical exchange program saga       │
│     where human healers meet their alien warrior mates         │
│     on space stations orbiting the Cerastean homeworld"        │
│                                                                 │
│              [Start with Book 1] [Read Order Guide]             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 📊 Series Stats: 200M+ pages read | ⭐ 4.8 avg rating     │ │
│  │ 🌟 Complete series | 📖 9 books | 👥 10,000+ readers     │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### World Building Section
```
┌─────────────────────────────────────────────────────────────────┐
│                       The Cerastean World                       │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Species   │  │   Setting   │  │   Culture   │             │
│  │             │  │             │  │             │             │
│  │ Cerasteans  │  │Space Station│  │Medical      │             │
│  │ are tall,   │  │ orbiting    │  │Exchange     │             │
│  │ horned      │  │ their home  │  │Program      │             │
│  │ warriors    │  │ planet with │  │brings       │             │
│  │ with regen- │  │ advanced    │  │humans &     │             │
│  │ erative     │  │ medical     │  │aliens       │             │
│  │ abilities   │  │ facilities  │  │together     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### Books in Series Grid
```
┌─────────────────────────────────────────────────────────────────┐
│                       Reading Order                             │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Book 1  │ │ Book 2  │ │ Book 3  │ │ Book 4  │ │ Book 5  │   │
│  │ Cover   │ │ Cover   │ │ Cover   │ │ Cover   │ │ Cover   │   │
│  │[START]  │ │[NEXT]   │ │         │ │         │ │         │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│  The Bride  Healing     Bonded      Savage      Claimed        │
│  Program    Hearts      Healer      Healer      Healer         │
│  Maya &     Zara &      Kira &      Tess &      Jordan &       │
│  D'Avii     Roark       Thane       Varus       Xander         │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Book 6  │ │ Book 7  │ │ Book 8  │ │ Book 9  │               │
│  │ Cover   │ │ Cover   │ │ Cover   │ │ Cover   │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│  Stolen     Protected   Tempted     Forever     [COMPLETE]      │
│  Healer     Healer      Healer      Healer                     │
│                                                                 │
│            [Get All Books Bundle] [Reading Checklist]           │
└─────────────────────────────────────────────────────────────────┘
```

### Character Guide Section
```
┌─────────────────────────────────────────────────────────────────┐
│                      Meet the Characters                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Main Couples                                                │ │
│  │                                                             │ │
│  │ ┌───────────┐ Maya Chen & D'Avii                           │ │
│  │ │Character  │ Human surgeon meets Cerastean High Commander │ │
│  │ │Portrait   │ "The foundation couple of the series"       │ │
│  │ └───────────┘ [Read Their Story]                           │ │
│  │                                                             │ │
│  │ ┌───────────┐ Zara Mills & Roark                          │ │
│  │ │Character  │ Nurse practitioner & wounded warrior        │ │
│  │ │Portrait   │ "Healing comes in many forms"               │ │
│  │ └───────────┘ [Read Their Story]                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                [View Full Character Guide]                      │
└─────────────────────────────────────────────────────────────────┘
```

**Series Page Specifications:**
- **Hero Section**: Compelling series premise with clear value props
- **World Building**: Expandable cards with rich lore
- **Reading Order**: Visual progress tracking, clear start point
- **Character Guide**: Searchable, filterable character database
- **Bundle Options**: Series packages with discount pricing

---

## Mobile Responsive Adaptations

### Mobile Books Grid (320px - 768px)
```
┌─────────────────────────────┐
│ 🔍 [Search Box]           │
│                           │
│ [Filters ▼]  [Sort ▼]    │
│                           │
│ ┌─────────┐ ┌─────────┐   │
│ │  Book   │ │  Book   │   │
│ │  Cover  │ │  Cover  │   │
│ └─────────┘ └─────────┘   │
│ Title       Title         │
│ [Species]   [Species]     │
│ ⭐⭐⭐⭐⭐    ⭐⭐⭐⭐       │
│                           │
│ ┌─────────┐ ┌─────────┐   │
│ │  Book   │ │  Book   │   │
│ │  Cover  │ │  Cover  │   │
│ └─────────┘ └─────────┘   │
└─────────────────────────────┘
```

### Mobile Book Detail
```
┌─────────────────────────────┐
│ [← Back]          [Share ⋯] │
│                           │
│      ┌─────────────┐      │
│      │    Book     │      │
│      │   Cover     │      │
│      │   (250px)   │      │
│      └─────────────┘      │
│                           │
│    The Bride Program      │
│  Saving Ceraste Series #1 │
│                           │
│  ⭐⭐⭐⭐⭐ 4.8 (2,847)      │
│                           │
│ [Cerastean] [Space] [🌶️🌶️] │
│                           │
│     [Read Free on KU]     │
│     [Buy on Amazon]       │
│                           │
│ "When Maya volunteers..." │
│                           │
│ [Synopsis] [Reviews] [More] │
└─────────────────────────────┘
```

### Mobile Series Page
```
┌─────────────────────────────┐
│     Saving Ceraste          │
│   Complete 9-Book Series    │
│                           │
│ "Experience the complete  │
│  medical exchange..."     │
│                           │
│   [Start with Book 1]     │
│   [Reading Order]         │
│                           │
│ ┌─────────────────────────┐ │
│ │ 📊 200M+ pages read    │ │
│ │ ⭐ 4.8 avg rating      │ │ 
│ │ ✅ Complete series     │ │
│ └─────────────────────────┘ │
│                           │
│ [World Building] [Characters] │
│                           │
│      Reading Order        │
│                           │
│    ┌─────────────┐       │
│    │   Book 1    │       │
│    │  [START]    │       │
│    └─────────────┘       │
│    The Bride Program     │
│                           │
│    ┌─────────────┐       │
│    │   Book 2    │       │
│    │   [NEXT]    │       │
│    └─────────────┘       │
│    Healing Hearts        │
│                           │
│        [View All]        │
└─────────────────────────────┘
```

---

## Performance & Accessibility

### Image Optimization
- **Book Covers**: WebP/AVIF with optimized sizes
- **Lazy Loading**: Below-the-fold content
- **Preloading**: Critical book covers
- **Responsive Images**: Multiple breakpoint sizes

### Search & Filter Performance
- **Debounced Search**: 300ms delay to avoid excessive API calls
- **Client-Side Filtering**: For small datasets
- **Virtual Scrolling**: For large book collections
- **State Management**: URL-based filter persistence

### Accessibility Features
- **Focus Management**: Proper tab order through grids
- **Screen Reader**: Alternative text for book covers
- **Keyboard Navigation**: Arrow keys for carousel movement
- **High Contrast**: Ensure brand colors meet WCAG standards

### Progressive Enhancement
- **Core Functionality**: Works without JavaScript
- **3D Effects**: Graceful fallback to CSS transforms
- **Search**: Server-side fallback for JavaScript failures
- **Offline**: Service worker for previously viewed books

This wireframe system provides a comprehensive foundation for all book and series-related pages while maintaining Dane's brand identity and optimizing for conversion.