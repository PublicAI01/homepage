import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			zIndex: {
				'1': '1',
				'2': '2',
			},
			colors: {
				primary: '#4000C8',
				b1: '#020202',
				b2: '#0E100C',
				b3: '#0f0f0f',
				b4: '#4c4c4c',
				g1: '#e6e6e6',
				p1: '#B08BFF',
			},
			animation: {
				'card-flicker': 'card-flicker calc(var(--duration)*1s) 2 linear',
			},
			keyframes: {
				'card-flicker': {
					'0%': {
						'background-color': '#000',
					},
					'33%': {
						'background-color': 'rgba(255, 255, 255, 0.5)',
					},
					'100%': {
						'background-color': '#000',
					},
				},
			},
		},
	},
	plugins: [
		require('tailwind-scrollbar')({
			nocompatible: true,
			preferredStrategy: 'pseudoelements',
		}),
	],
};
export default config;
