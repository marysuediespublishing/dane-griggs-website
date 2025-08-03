/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        'deep-space-navy': '#1a1a2e',
        'cosmic-rose': '#d4336a',
        'stellar-gold': '#f4a261',
        
        // Secondary Colors
        'nebula-purple': '#6a4c93',
        'starlight-silver': '#e9ecef',
        'solar-white': '#ffffff',
        
        // Accent Colors
        'mars-red': '#e63946',
        'ocean-teal': '#2a9d8f',
        
        // Dark mode colors (preserving existing)
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-border': '#334155',
        'dark-text': '#f8fafc',
        'dark-text-muted': '#cbd5e1',
        
        // Semantic Colors
        text: {
          primary: '#1a1a2e',
          secondary: '#4a5568',
          muted: '#718096',
          inverse: '#ffffff',
        },
        bg: {
          primary: '#ffffff',
          secondary: '#f7fafc',
          tertiary: '#edf2f7',
          dark: '#1a1a2e',
        },
        border: {
          light: '#e2e8f0',
          medium: '#cbd5e0',
          accent: '#d4336a',
        },
        
        // Species Colors
        species: {
          cerastean: '#d4336a',
          kraken: '#6a4c93',
          dulci: '#f4a261',
          human: '#2a9d8f',
        },
        
        // Heat Level Colors
        heat: {
          mild: '#10b981',
          medium: '#f59e0b',
          spicy: '#ef4444',
        }
      },
      fontFamily: {
        primary: ['Playfair Display', 'Georgia', 'serif'],
        secondary: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        accent: ['Orbitron', 'Courier New', 'monospace'],
      },
      boxShadow: {
        // Cosmic Glow Effects
        'cosmic': '0 0 20px rgba(212, 51, 106, 0.3)',
        'stellar': '0 0 15px rgba(244, 162, 97, 0.4)',
        'nebula': '0 0 25px rgba(106, 76, 147, 0.2)',
      },
      backgroundImage: {
        // Cosmic Gradients
        'gradient-cosmic': 'linear-gradient(135deg, #1a1a2e 0%, #6a4c93 50%, #d4336a 100%)',
        'gradient-starfield': 'radial-gradient(circle at 50% 50%, rgba(244, 162, 97, 0.1) 0%, transparent 50%)',
        'gradient-aurora': 'linear-gradient(45deg, #d4336a 0%, #f4a261 50%, #6a4c93 100%)',
      },
      animation: {
        // Cosmic Animations
        'cosmic-glow': 'cosmic-glow 2s ease-in-out infinite',
        'stellar-pulse': 'stellar-pulse 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'starfield': 'starfield 20s linear infinite',
      },
      keyframes: {
        'cosmic-glow': {
          '0%': { boxShadow: '0 0 5px rgba(212, 51, 106, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 51, 106, 0.6)' },
          '100%': { boxShadow: '0 0 5px rgba(212, 51, 106, 0.3)' },
        },
        'stellar-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'starfield': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '100%': { transform: 'scale(1.1) rotate(360deg)' },
        },
      },
      aspectRatio: {
        'book': '2/3',
      },
    },
  },
  plugins: [
    // Custom component classes
    function({ addComponents, theme }) {
      addComponents({
        // Button Components
        '.btn': {
          '@apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2': {},
        },
        '.btn-primary': {
          '@apply bg-cosmic-rose text-solar-white border-2 border-cosmic-rose hover:bg-[#c12d5e] hover:shadow-cosmic hover:-translate-y-0.5 focus:ring-cosmic-rose': {},
        },
        '.btn-secondary': {
          '@apply bg-stellar-gold text-deep-space-navy border-2 border-stellar-gold hover:bg-[#f39651] hover:shadow-stellar focus:ring-stellar-gold': {},
        },
        '.btn-outline': {
          '@apply bg-transparent text-cosmic-rose border-2 border-cosmic-rose hover:bg-cosmic-rose hover:text-solar-white focus:ring-cosmic-rose': {},
        },
        
        // Card Components
        '.card': {
          '@apply bg-bg-primary rounded-xl overflow-hidden transition-all duration-300': {},
        },
        '.card-cosmic': {
          '@apply bg-gradient-starfield border border-cosmic-rose/20 hover:shadow-cosmic': {},
        },
        
        // Input Components
        '.input-cosmic': {
          '@apply w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-base bg-white transition-all duration-200 focus:outline-none focus:border-cosmic-rose focus:shadow-cosmic': {},
        },
        
        // Badge Components
        '.badge': {
          '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': {},
        },
        '.badge-cerastean': {
          '@apply bg-cosmic-rose/10 text-cosmic-rose border border-cosmic-rose/30': {},
        },
        '.badge-kraken': {
          '@apply bg-nebula-purple/10 text-nebula-purple border border-nebula-purple/30': {},
        },
        '.badge-dulci': {
          '@apply bg-stellar-gold/10 text-stellar-gold border border-stellar-gold/30': {},
        },
        '.badge-human': {
          '@apply bg-ocean-teal/10 text-ocean-teal border border-ocean-teal/30': {},
        },
      })
    }
  ],
};