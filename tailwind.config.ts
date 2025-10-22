import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'var(--font-geist)', 'system-ui', 'sans-serif'],
  			mono: ['var(--font-geist-mono)', 'monospace']
  		},
  		screens: {
  			'toast-mobile': '600px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			// Base shadcn colors (using VeChain palette)
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
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
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
  			},

  			// VeChain AI Terminal Specific Colors
  			'vet-bg': '#0B0B0B',
  			'vet-surface': '#111111',
  			'vet-input': '#151515',
  			'vet-border': '#1F1F1F',
  			'vet-hover': '#151515',
  			'vet-text-primary': '#FFFFFF',
  			'vet-text-secondary': '#B0B0B0',
  			'vet-text-muted': '#6A6A6A',
  			'vet-accent': '#E2008C',
  			'vet-accent-hover': '#FF1FD6',
  			'vet-success': '#00C896',
  			'vet-error': '#FF3B5C',
  			'vet-warning': '#FFB100',
  			'vet-info': '#3B82F6',
  		},
  		backgroundImage: {
  			'vet-gradient': 'linear-gradient(90deg, #E2008C 0%, #FF1FD6 100%)',
  			'vet-glow': 'radial-gradient(circle at 50% 60%, rgba(226, 0, 140, 0.08) 0%, transparent 70%)',
  		},
  		boxShadow: {
  			'vet-glow': '0 0 24px rgba(226, 0, 140, 0.25)',
  			'vet-glow-subtle': '0 0 18px rgba(226, 0, 140, 0.15)',
  			'vet-modal': '0 0 40px rgba(0, 0, 0, 0.4)',
  			'vet-inset': 'inset 0 0 0 1px #1F1F1F',
  		},
  		animation: {
  			'vet-fade': 'vet-fade 0.3s ease-out',
  			'vet-slide': 'vet-slide 0.4s ease-out',
  			'vet-pulse': 'vet-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  		},
  		keyframes: {
  			'vet-fade': {
  				'0%': { opacity: '0' },
  				'100%': { opacity: '1' }
  			},
  			'vet-slide': {
  				'0%': { opacity: '0', transform: 'translateY(10px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'vet-pulse': {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0.5' }
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
