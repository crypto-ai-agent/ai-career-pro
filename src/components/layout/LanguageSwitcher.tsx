import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../config/i18n';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { clsx } from 'clsx';

const cn = clsx;

// Currently enabled languages
const ENABLED_LANGUAGES = ['en', 'es'];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="outline" 
        className="flex items-center text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Languages className="w-4 h-4 mr-2" />
        {SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language)?.name || 'Language'}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-50 border border-white/20">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Tooltip 
              key={lang.code}
              content={ENABLED_LANGUAGES.includes(lang.code) ? undefined : 'Coming Soon'}
              side="left"
            >
              <button
                onClick={() => {
                  if (ENABLED_LANGUAGES.includes(lang.code)) {
                    i18n.changeLanguage(lang.code);
                    setIsOpen(false);
                  }
                }}
                className={cn(
                  'block w-full text-left px-4 py-2 text-sm transition-colors',
                  !ENABLED_LANGUAGES.includes(lang.code)
                    ? 'opacity-50 cursor-not-allowed'
                    : i18n.language === lang.code
                    ? 'bg-primary/50 text-white'
                    : 'text-white/70 hover:bg-white/10'
                )}
              >
                <span className="mr-2">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}