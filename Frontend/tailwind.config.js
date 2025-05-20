// module.exports = {
//   content: [
//     './src/**/*.{js,jsx,ts,tsx}',  // Covers src directory
//     './features/**/*.{js,jsx,ts,tsx}',  // Covers features directory
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



// module.exports = {
//   content: [
//     './src/**/*.{js,jsx,ts,tsx}',
//     './features/**/*.{js,jsx,ts,tsx}',
//   ],
//   theme: {
//     extend: {
//       animation: {
//         'banner-fade': 'fade 3s ease-in-out', // slower and smoother
//       },
//       keyframes: {
//         fade: {
//           '0%': { opacity: '0.2' },
//           '50%': { opacity: '1' },
//           '100%': { opacity: '0.2' },
//         },
//       },
//     },
//   },
//   plugins: [],
// };



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',        // your main source folder
    './features/**/*.{js,jsx,ts,tsx}',   // your features if separate
    './components/**/*.{js,jsx,ts,tsx}', // <-- include this if using components
    './pages/**/*.{js,jsx,ts,tsx}',      // <-- for Next.js or SPA structure
  ],
  theme: {
    extend: {
      animation: {
        'banner-fade': 'fade 3s ease-in-out',
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0.2' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.2' },
        },
      },
    },
  },
  plugins: [],
};

