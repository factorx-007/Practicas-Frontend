'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Users, Briefcase, FileText, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'offer' | 'user' | 'company' | 'document' | 'page';
  url: string;
  icon?: React.ElementType;
}

interface GlobalSearchProps {
  placeholder?: string;
  className?: string;
  onResultClick?: (result: SearchResult) => void;
}

export default function GlobalSearch({
  placeholder = "Buscar ofertas, usuarios, empresas...",
  className = "",
  onResultClick
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { user } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock trending searches based on user role
  const getTrendingSearches = () => {
    const common = ['Desarrollador Frontend', 'Marketing Digital', 'Data Science'];

    if (user?.rol === 'ESTUDIANTE') {
      return ['Prácticas profesionales', 'Empleo remoto', 'Becas', ...common];
    } else if (user?.rol === 'EMPRESA') {
      return ['Talentos junior', 'Candidatos activos', 'Perfiles técnicos', ...common];
    }

    return common;
  };

  // Mock search function - in real app would call API
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock results based on query
    const allResults: SearchResult[] = [
      {
        id: '1',
        title: 'Desarrollador React Senior',
        subtitle: 'TechCorp - Lima, Perú',
        type: 'offer',
        url: '/offers/1',
        icon: Briefcase
      },
      {
        id: '2',
        title: 'María González',
        subtitle: 'Desarrolladora Full Stack',
        type: 'user',
        url: '/users/maria-gonzalez',
        icon: Users
      },
      {
        id: '3',
        title: 'StartupXYZ',
        subtitle: 'Empresa de tecnología',
        type: 'company',
        url: '/companies/startupxyz',
        icon: Building
      },
      {
        id: '4',
        title: 'Guía de entrevistas técnicas',
        subtitle: 'Documento • Actualizado hace 2 días',
        type: 'document',
        url: '/resources/interview-guide',
        icon: FileText
      }
    ];

    const mockResults: SearchResult[] = allResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
    setIsLoading(false);
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        performSearch(query);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
  };

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });

    setIsOpen(false);
    setQuery('');

    if (onResultClick) {
      onResultClick(result);
    } else {
      window.location.href = result.url;
    }
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'offer': return Briefcase;
      case 'user': return Users;
      case 'company': return Building;
      case 'document': return FileText;
      default: return Search;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'offer': return 'text-blue-600 bg-blue-50';
      case 'user': return 'text-green-600 bg-green-50';
      case 'company': return 'text-purple-600 bg-purple-50';
      case 'document': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="
            block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm placeholder:text-gray-400
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200
          "
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-600"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="animate-spin inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <p className="text-sm text-gray-500 mt-2">Buscando...</p>
            </div>
          )}

          {/* Results */}
          {!isLoading && query && results.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Resultados ({results.length})
              </div>
              {results.map((result) => {
                const IconComponent = result.icon || getTypeIcon(result.type);
                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className={`flex-shrink-0 p-2 rounded-lg ${getTypeColor(result.type)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-gray-900">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-xs text-gray-500">{result.subtitle}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query && results.length === 0 && (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No se encontraron resultados para &quot;{query}&quot;</p>
              <p className="text-xs text-gray-400 mt-1">Intenta con otros términos de búsqueda</p>
            </div>
          )}

          {/* Recent Searches & Trending (when no query) */}
          {!query && (
            <div className="py-2">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <Clock className="w-3 h-3 inline-block mr-1" />
                    Búsquedas recientes
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(search)}
                      className="w-full flex items-center px-4 py-2 hover:bg-gray-50 transition-colors duration-150 text-left"
                    >
                      <Clock className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              <div>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <TrendingUp className="w-3 h-3 inline-block mr-1" />
                  Tendencias
                </div>
                {getTrendingSearches().slice(0, 5).map((trend, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrendingClick(trend)}
                    className="w-full flex items-center px-4 py-2 hover:bg-gray-50 transition-colors duration-150 text-left"
                  >
                    <TrendingUp className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">{trend}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}