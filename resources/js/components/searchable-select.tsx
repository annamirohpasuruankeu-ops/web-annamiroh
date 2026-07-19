import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    searchPlaceholder?: string;
    className?: string;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder,
    searchPlaceholder = 'Cari...',
    className = '',
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    setSearchQuery('');
                }}
                className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-left text-sm font-bold text-slate-700 shadow-sm transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`ml-2 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 left-0 z-50 mt-1 animate-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl duration-150 fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 p-2">
                        <Search
                            size={14}
                            className="flex-shrink-0 text-slate-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full border-none bg-transparent p-1 text-xs font-medium text-slate-700 focus:ring-0 focus:outline-none"
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-60 divide-y divide-slate-50 overflow-y-auto p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value === value;
                                return (
                                    <li key={opt.value}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.value);
                                                setIsOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                                                isSelected
                                                    ? 'bg-emerald-50 text-emerald-800'
                                                    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            <span className="truncate">
                                                {opt.label}
                                            </span>
                                            {isSelected && (
                                                <Check
                                                    size={14}
                                                    className="flex-shrink-0 text-emerald-600"
                                                />
                                            )}
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-3 py-4 text-center text-xs font-bold text-slate-400">
                                Tidak ada data
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
