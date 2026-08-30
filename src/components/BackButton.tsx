import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface BackButtonProps {
  onClick: () => void
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-6 flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-blue-400 hover:underline"
    >
      <ArrowBackIcon fontSize="small" />
      Voltar
    </button>
  )
}
