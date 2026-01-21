'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchCarros } from '@/lib/carros';
import { Carro } from '@/types';
import { slugify } from '@/lib/utils';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Carro[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const carros = await searchCarros(query);
        setResults(carros);
        setIsOpen(true);
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (carro: Carro) => {
    const marcaSlug = slugify(carro.marca);
    const modeloSlug = slugify(carro.modelo);
    router.push(`/carro/${marcaSlug}/${modeloSlug}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquise por marca ou modelo..."
          className="w-full px-6 py-4 text-lg bg-slate-800 border-2 border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
          {results.map((carro) => (
            <button
              key={carro.id}
              onClick={() => handleSelect(carro)}
              className="w-full px-6 py-4 text-left hover:bg-slate-700 transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden">
                {carro.imagemUrl ? (
                  <img src={carro.imagemUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🚗</div>
                )}
              </div>
              <div>
                <p className="font-semibold text-white">{carro.marca} {carro.modelo}</p>
                <p className="text-sm text-slate-400">{carro.anos[0]} - {carro.anos[carro.anos.length - 1]}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
