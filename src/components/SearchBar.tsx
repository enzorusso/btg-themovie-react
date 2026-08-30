import SearchIcon from '@mui/icons-material/Search'
import { Button, InputAdornment, TextField } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export function SearchBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const isSearchPage = location.pathname === '/busca'
  const urlQuery = isSearchPage ? (searchParams.get('q') ?? '') : ''

  const [value, setValue] = useState(urlQuery)
  const [syncedQuery, setSyncedQuery] = useState(urlQuery)

  if (syncedQuery !== urlQuery) {
    setSyncedQuery(urlQuery)
    setValue(urlQuery)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      navigate(`/busca?q=${encodeURIComponent(trimmed)}`)
    } else {
      navigate('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 gap-3">
      <TextField
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar filmes..."
        size="small"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-white/60!" fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
            '&.Mui-focused fieldset': { borderColor: 'white' },
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disableElevation
        className="cursor-pointer! whitespace-nowrap!"
      >
        Buscar
      </Button>
    </form>
  )
}
