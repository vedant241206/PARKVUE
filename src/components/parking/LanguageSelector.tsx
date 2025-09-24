import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector = ({ currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-primary-foreground/70" />
      <Select value={currentLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-32 bg-primary text-primary-foreground border-primary-foreground/20 hover:bg-primary/90">
          <div className="flex items-center gap-2">
            <span>{currentLang?.flag}</span>
            <span className="text-primary-foreground font-medium">{currentLang?.name}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="z-[999] bg-background border border-border shadow-lg">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="hover:bg-accent focus:bg-accent">
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};