import baseConfig from '@fur-co/config/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
}
