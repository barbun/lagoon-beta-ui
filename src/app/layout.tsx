import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';

import RefreshTokenHandler from '@/components/auth/RefreshTokenHandler';
import Plugins from '@/components/plugins/plugins';
import ProgressProvider from '@/contexts/ProgressProvider';
import PublicRuntimeEnvProvider from '@/contexts/PublicRuntimeEnvProvider';
import { ApolloClientComponentWrapper } from '@/lib/apollo-client-components';

import ClientSessionWrapper from '../components/auth/ClientSessionWrapper';
import AppProvider from '../contexts/AppContext';
import AuthProvider from '../contexts/AuthProvider';
import LinkProvider from '../contexts/LinkProvider';
import './globals.css';
import fs from 'fs';
import {OverrideProvider} from "@/contexts/OverrideContext";
import * as process from "node:process";
import { validateOverrides, type Overrides } from '@uselagoon/ui-library/schemas';
import { ExtensionProvider } from '@/contexts/ExtensionContext';
import { loadExtensions } from '@/lib/extensions/loader';

type Branding = {
  logo?: string;
  logoDark?: string;
  appName?: string;
};

type ThemeColors = {
  sidebar?: string;
  sidebarForeground?: string;
  sidebarAccent?: string;
  primary?: string;
  accent?: string;
};

type Theme = ThemeColors & {
  light?: ThemeColors;
  dark?: ThemeColors;
};

type OverridesWithBranding = {
  overrides: Overrides;
  branding?: Branding;
  theme?: Theme;
};

function loadOverridesWithBranding(): OverridesWithBranding {
  try {
    if (fs.existsSync('overrides.json')) {
      const raw = JSON.parse(fs.readFileSync('overrides.json', 'utf-8'));
      const { valid, errors } = validateOverrides(raw);

      if (errors.length > 0) {
        console.log('Invalid overrides detected:\n');
        errors.forEach(err => {
          console.log(`- ${err.key}: ${err.message}`);
        });
      } else {
        console.log('Overrides loaded successfully');
      }

      return {
        overrides: valid,
        branding: raw.branding,
        theme: raw.theme,
      };
    }
  } catch (error) {
    console.log('Error loading overrides:', error);
  }
  return { overrides: {} };
}

function generateBrandingCSS(branding?: Branding): string {
  if (!branding?.logo) return '';

  const lightLogo = branding.logo;
  const darkLogo = branding.logoDark || branding.logo;

  if (lightLogo === darkLogo) {
    return `img[alt="Logo"] { content: url('${lightLogo}') !important; max-height: 40px; width: auto; }`;
  }

  return `
    img[alt="Logo"] { content: url('${lightLogo}') !important; max-height: 40px; width: auto; }
    .dark img[alt="Logo"] { content: url('${darkLogo}') !important; }
  `;
}

function generateThemeVars(colors: ThemeColors): string[] {
  const vars: string[] = [];
  if (colors.sidebar) vars.push(`--sidebar: ${colors.sidebar}`);
  if (colors.sidebarForeground) vars.push(`--sidebar-foreground: ${colors.sidebarForeground}`);
  if (colors.sidebarAccent) vars.push(`--sidebar-accent: ${colors.sidebarAccent}`);
  if (colors.primary) vars.push(`--primary: ${colors.primary}`);
  if (colors.accent) vars.push(`--accent: ${colors.accent}`);
  return vars;
}

function generateSidebarStyles(colors: ThemeColors, selector: string = ''): string {
  const prefix = selector ? `${selector} ` : '';
  const styles: string[] = [];

  if (colors.sidebar) {
    styles.push(`${prefix}[data-slot="sidebar"] { background-color: ${colors.sidebar} !important; }`);
  }
  if (colors.sidebarForeground) {
    styles.push(`${prefix}.text-sidebar-foreground { color: ${colors.sidebarForeground} !important; }`);
    styles.push(`${prefix}[data-sidebar="menu-button"] { color: ${colors.sidebarForeground} !important; }`);
    styles.push(`${prefix}[data-sidebar="group-label"] { color: ${colors.sidebarForeground}99 !important; }`);
    styles.push(`${prefix}[data-slot="sidebar"] svg { color: ${colors.sidebarForeground} !important; }`);
  }
  if (colors.sidebarAccent) {
    styles.push(`${prefix}[data-sidebar="menu-button"]:hover { background-color: ${colors.sidebarAccent} !important; }`);
  }
  if (colors.primary) {
    styles.push(`${prefix}[data-sidebar="menu-button"][data-active="true"] { background-color: ${colors.primary} !important; }`);
  }

  return styles.join('\n    ');
}

function generateThemeCSS(theme?: Theme): string {
  if (!theme) return '';

  const hasLightDark = theme.light || theme.dark;

  if (hasLightDark) {
    const sections: string[] = [];

    if (theme.light) {
      const lightVars = generateThemeVars(theme.light);
      if (lightVars.length > 0) {
        sections.push(`:root { ${lightVars.join('; ')}; }`);
        sections.push(generateSidebarStyles(theme.light));
      }
    }

    if (theme.dark) {
      const darkVars = generateThemeVars(theme.dark);
      if (darkVars.length > 0) {
        sections.push(`.dark { ${darkVars.join('; ')}; }`);
        sections.push(generateSidebarStyles(theme.dark, '.dark'));
      }
    }

    return sections.length > 0 ? `\n    ${sections.join('\n    ')}\n  ` : '';
  }

  const vars = generateThemeVars(theme);
  if (vars.length === 0) return '';

  return `
    :root { ${vars.join('; ')}; }
    ${generateSidebarStyles(theme)}
  `;
}

export const metadata: Metadata = {
  title: 'Lagoon UI',
  icons: {
    icon: [
      { url: '/favicons/favicon.ico' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png' }],
  },
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { overrides, branding, theme } = loadOverridesWithBranding();
  const extensions = loadExtensions();
  const brandingCSS = generateBrandingCSS(branding);
  const themeCSS = generateThemeCSS(theme);
  const customCSS = [brandingCSS, themeCSS].filter(Boolean).join('\n');
  // ref for exposing custom variables at runtime: https://github.com/expatfile/next-runtime-env/blob/development/docs/EXPOSING_CUSTOM_ENV.md
  noStore();
  return (
    <html lang="en" suppressHydrationWarning>
      <PublicRuntimeEnvProvider>
        <head>
          <Plugins hook="head" />
        </head>
        <body>
        <OverrideProvider overrides={overrides}>
          <ProgressProvider>
            <LinkProvider>
              <AuthProvider>
                <ExtensionProvider extensions={extensions}>
                  <RefreshTokenHandler />
                  <ClientSessionWrapper>
                    <ApolloClientComponentWrapper>
                      <AppProvider
                        kcUrl={process.env.AUTH_KEYCLOAK_ISSUER!}
                        logo={branding?.logo ? <img src={branding.logo} alt={branding.appName || 'Logo'} className="icon logo h-8 w-auto" /> : undefined}
                      >{children}</AppProvider>
                    </ApolloClientComponentWrapper>
                  </ClientSessionWrapper>
                </ExtensionProvider>
              </AuthProvider>
            </LinkProvider>
            <Plugins hook="body" />
          </ProgressProvider>
        </OverrideProvider>
        {customCSS && <style dangerouslySetInnerHTML={{ __html: customCSS }} />}
        </body>
      </PublicRuntimeEnvProvider>
    </html>
  );
}
