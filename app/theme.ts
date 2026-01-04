// app/theme.ts
import { createTheme } from '@mui/material/styles'

/**
 * Replace these hex values with whatever your CSS variables resolve to.
 * (MUI palette cannot use var(--token) strings.)
 */
export const tokens = {
    primary: {
        100: '#E6EFEA',
        200: '#C9DDD1',
        300: '#A7C5B3',
        400: '#7FA88E',
        500: '#5E8F73',
        600: '#48765C',
        700: '#365E49',
        800: '#264636',
        900: '#182E23',
    },
    secondary: {
        100: '#F6E9E2',
        200: '#EACFC2',
        300: '#D9AF99',
        400: '#C88F73',
        500: '#B06A4B',
        600: '#945339',
        700: '#7A3E2A',
        800: '#613024',
        900: '#4A241B',
    },
    neutral: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
    },
} as const

declare module '@mui/material/styles' {
    interface Theme {
        tokens: typeof tokens
    }
    interface ThemeOptions {
        tokens?: typeof tokens
    }
}

export const theme = createTheme({
    tokens,

    typography: {
        fontFamily: [
            'Inter',
            'ui-sans-serif',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'Noto Sans',
            'sans-serif',
        ].join(','),
    },

    shape: {
        borderRadius: 8, // close to Tailwind rounded-lg
    },

    palette: {
        mode: 'light',

        primary: {
            light: tokens.primary[400],
            main: tokens.primary[600],
            dark: tokens.primary[700],
            contrastText: '#fff',
        },

        secondary: {
            light: tokens.secondary[400],
            main: tokens.secondary[500],
            dark: tokens.secondary[600],
            contrastText: '#fff',
        },

        background: {
            default: tokens.neutral[100],
            paper: tokens.neutral[50],
        },

        text: {
            primary: tokens.neutral[900],
            secondary: tokens.neutral[600],
        },

        divider: tokens.neutral[200],

        // Map your neutral scale to MUI grey
        grey: {
            50: tokens.neutral[50],
            100: tokens.neutral[100],
            200: tokens.neutral[200],
            300: tokens.neutral[300],
            400: tokens.neutral[400],
            500: tokens.neutral[500],
            600: tokens.neutral[600],
            700: tokens.neutral[700],
            800: tokens.neutral[800],
            900: tokens.neutral[900],
        },
    },

    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                // Helps match your Tailwind "background-neutral-100" pages
                body: {
                    backgroundColor: tokens.neutral[100],
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                },
            },
        },

        MuiCard: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundImage: 'none',
                },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: 48,
                },
            },
        },

        MuiAppBar: {
            defaultProps: {
                color: 'default',
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${tokens.neutral[200]}`,
                },
            },
        },
    },
})
