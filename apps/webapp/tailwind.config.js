import baseConfig from '@fur-co/config/tailwind';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  plugins: [
    typography,
  ],
}
