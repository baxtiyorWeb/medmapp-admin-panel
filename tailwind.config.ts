// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Make sure dark mode is enabled
  darkMode: "class",
  
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map the CSS variables to Tailwind color names
        background: 'var(--background-color)',
        card: 'var(--card-background)',
        textColor: 'var(--text-color)',
        textLight: 'var(--text-light)',
        borderColor: 'var(--border-color)',
        primaryLight: 'var(--primary-light)',
        secondary: 'var(--secondary-color)',
        dangerLight: 'var(--danger-light)',
        successLight: 'var(--success-light)',
        warningLight: 'var(--warning-light)',
        infoLight: 'var(--info-light)',
      }
    },
  },
  plugins: [],
}