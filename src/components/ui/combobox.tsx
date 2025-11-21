import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export const Combobox = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found',
  disabled = false,
  className,
}: ComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(
    option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className={cn(
          'w-full justify-between',
          !selectedOption && 'text-muted-foreground'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          backgroundColor: '#0e1e27',
          borderColor: '#97fce4',
          color: '#97fce4',
          height: '50px',
        }}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full rounded-lg border shadow-lg"
          style={{
            backgroundColor: '#0e1e27',
            borderColor: '#97fce4',
            maxHeight: '300px',
            overflow: 'hidden',
          }}
        >
          <div className="p-2 border-b" style={{ borderColor: '#97fce4' }}>
            <div className="relative">
              <Search
                className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: '#97fce4' }}
              />
              <input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-2 rounded text-sm"
                style={{
                  backgroundColor: '#021e17',
                  borderColor: '#97fce4',
                  color: '#97fce4',
                }}
              />
            </div>
          </div>
          <div className="max-h-[250px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div
                className="py-6 text-center text-sm"
                style={{ color: '#97fce4' }}
              >
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    value === option.value && 'bg-accent'
                  )}
                  onClick={() => handleSelect(option.value)}
                  style={{
                    color: value === option.value ? '#0e1e27' : '#97fce4',
                    backgroundColor:
                      value === option.value ? '#97fce4' : 'transparent',
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex-1 text-left">
                    <div>{option.label}</div>
                    {option.description && (
                      <div className="text-xs opacity-70">
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
