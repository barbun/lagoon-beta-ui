'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import LagoonIcon from '../../icons/sidebar/logo-dark.svg';
import { useLinkComponent } from '@/providers/NextLinkProvider';
import { useSyncTheme } from '@/hooks/useSyncTheme';


export default function SidenavLogo() {
	const { theme } = useTheme();

	useSyncTheme();

	const Link = useLinkComponent();

	const getLogos = () => {
		const iconFolder = '/sidebar-icons';
		return `${iconFolder}/logo-${theme}.svg`;
	};

	const renderLogo = () => {
		const logoPath = getLogos();

			return (
				<img
					src={!logoPath.includes('undefined') ? logoPath : LagoonIcon}
					alt="Logo"
					onError={(e) => {
						// Sets the lagoon logo as a fallback if no sidebar-icons defined
						const targetLogo = e.currentTarget;
						targetLogo.src = LagoonIcon;
					}}
				/>
			);
	};

	return (
		<>
			<section className="flex items-center gap-1 pl-1">
				<div className={`aspect-square min-w-[280px] max-h-[50px] rounded-lg text-sidebar-primary-foreground size-16 p-2 mb-2`}>
					<Link href="/projects" className="w-auto h-auto">{renderLogo()}</Link>
				</div>
			</section>
		</>
	);
}
