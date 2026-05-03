import { useCMSStore } from '@/store/cmsStore'
import { cn } from '@/utils/cn'

interface PriceProps {
  amount: number | string
  className?: string
  currencySymbol?: string // Optional override
}

export function Price({ amount, className, currencySymbol: overrideSymbol }: PriceProps) {
  const { currencySymbol: storeSymbol } = useCMSStore()
  const symbol = overrideSymbol || storeSymbol
  
  const displayAmount = typeof amount === 'number' 
    ? amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) 
    : amount

  return (
    <span className={cn("font-bold", className)}>
      {symbol}{displayAmount}
    </span>
  )
}
