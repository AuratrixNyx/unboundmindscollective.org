module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Jost', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#f5f0eb',
        surface: '#ede5db',
        raised: '#e4d9ce',
        border: '#c9b8a8',
        accent: '#a06b3c',
        'accent-hover': '#8a5a30',
        sage: '#4a7a66',
        'text-primary': '#1e1714',
        'text-secondary': '#4a3e38',
        'text-muted': '#7a6a60',
        danger: '#9e3a2a',
      },
    },
  },
  plugins: [],
}
