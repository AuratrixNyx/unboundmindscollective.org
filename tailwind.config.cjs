module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Jost', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#1a1614',
        surface: '#241f1c',
        raised: '#2e2824',
        border: '#3d3530',
        accent: '#c4956a',
        'accent-hover': '#d4a87a',
        sage: '#7fa892',
        'text-primary': '#f0ebe5',
        'text-secondary': '#b5a99e',
        'text-muted': '#7a6f68',
        danger: '#c47a6a',
      },
    },
  },
  plugins: [],
}
