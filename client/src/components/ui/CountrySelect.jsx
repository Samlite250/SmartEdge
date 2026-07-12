import { useState, useRef, useEffect } from 'react'
import { Globe, Search, ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { countries, getCountryFlag } from '../../lib/countries'

export function CountrySelect({ value, onChange, className }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)
  const searchRef = useRef(null)

  const selected = countries.find(c => c.name === value)
  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus()
    }
  }, [open])

  const handleSelect = (country) => {
    onChange(country.name)
    setOpen(false)
    setSearch('')
  }

  const flag = selected ? getCountryFlag(selected.name) : null

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-secondary">Country</label>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center gap-2 px-4 py-3 bg-white border-2 border-border rounded-xl text-sm text-left transition-all duration-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10',
            !selected && 'text-text-muted',
            className
          )}
        >
          <Globe className="w-5 h-5 text-text-muted flex-shrink-0" />
          {flag && <span className="text-lg leading-none">{flag}</span>}
          <span className="flex-1 truncate" style={{ color: selected ? '#1A1D2A' : undefined }}>
            {selected ? selected.name : 'Select your country'}
          </span>
          <ChevronDown className={cn('w-4 h-4 text-text-muted transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white border-2 border-border rounded-xl shadow-lg overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search countries..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ color: '#1A1D2A', WebkitTextFillColor: '#1A1D2A' }}
                  className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary placeholder:text-text-muted"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-surface transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-text-muted" />
                  </button>
                )}
              </div>
            </div>
            <ul className="max-h-60 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-text-muted text-center">No countries found</li>
              ) : (
                filtered.map(country => {
                  const isSelected = country.name === value
                  const cFlag = getCountryFlag(country.name)
                  return (
                    <li key={country.code}>
                      <button
                        type="button"
                        onClick={() => handleSelect(country)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors',
                          isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-surface text-text-primary'
                        )}
                      >
                        {cFlag && <span className="text-lg leading-none">{cFlag}</span>}
                        <span className="flex-1" style={{ color: isSelected ? undefined : '#1A1D2A' }}>{country.name}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        )}

        <input type="hidden" name="country" value={value || ''} />
      </div>
    </div>
  )
}
