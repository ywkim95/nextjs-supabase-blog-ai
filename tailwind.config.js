/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 'class' 전략 활성화
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tomorrow Night Blue 테마 색상
        dark: {
          background: '#002451',
          text: '#ffffff',
          primary: '#ffc600',
          secondary: '#a1f7f2',
          accent: '#ff9d00',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
