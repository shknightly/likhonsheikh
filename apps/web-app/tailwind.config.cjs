const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/utils/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'bangla-headline': ['"Noto Sans Bengali"', ...fontFamily.sans],
        'bangla-body': ['"Noto Sans Bengali"', ...fontFamily.serif],
        'english-ui': ['"Geist Sans"', ...fontFamily.sans],
        code: ['"Geist Mono"', ...fontFamily.mono]
      },
      colors: {
        primary: '#0B7285',
        accent: '#F59E0B',
        neutral: '#1F2933'
      },
      spacing: {
        18: '4.5rem'
      },
      borderRadius: {
        xl: '1.25rem'
      }
    }
  },
  plugins: []
};
