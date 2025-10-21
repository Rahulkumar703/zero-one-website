/** @type {import('tailwindcss').Config} */

import { withUt } from "uploadthing/tw";

export default withUt({
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		boxShadow: {
  			btn: '4px 6px 10px #000, inset 4px 6px 10px #0d0d0d',
  			'btn-lg': '4px 6px 10px #0000006b, inset 4px 6px 10px #232222',
  			cus: '17px 20px 40px #000, inset 17px 20px 50px #0d0d0d'
  		},
  		colors: {
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				light: 'hsl(var(--accent-light))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				light: 'hsl(var(--primary-foreground))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
  	screens: {
  		'3xl': {
  			min: '1800px'
  		},
  		m2xl: {
  			min: '1500px'
  		},
  		'2xl': {
  			min: '1500px'
  		},
  		xl: {
  			min: '1200px'
  		},
  		'2lg': {
  			min: '1024px'
  		},
  		m2lg: {
  			min: '1024px'
  		},
  		lg: {
  			min: '920px'
  		},
  		md: {
  			min: '768px'
  		},
  		sm: {
  			min: '600px'
  		},
  		xs: {
  			min: '450px'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
});
