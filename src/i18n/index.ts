import { en } from './en';
import { fr } from './fr';
import { useAppStore } from '@/stores/appStore';

const translations = { en, fr } as const;

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  return translations[language];
}
