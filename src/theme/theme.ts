import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2e3349',
      paper: '#2e3349',
    },
    primary: {
      main: '#1565c0',
    },
  },
  shape: {
    borderRadius: 8,
  },
})
