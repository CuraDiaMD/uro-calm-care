import { useState, type FormEvent, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import curadiaLogo from "@/assets/curadia-logo.png";
import { useAppStore } from "@/stores/appStore";
import { useTranslation } from "@/i18n";

const DEMO_PASSWORD = "ESG2026";
const SESSION_KEY = "curadia-demo-access";

interface PasswordGateProps {
  children: ReactNode;
}

const PasswordGate = ({ children }: PasswordGateProps) => {
  const [granted, setGranted] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const t = useTranslation();

  if (granted) return <>{children}</>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setGranted(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(27 94% 54% / 0.08) 0%, hsl(220 30% 96%) 40%, hsl(221 100% 36% / 0.06) 100%)",
        }}
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex w-full max-w-xs flex-col items-center gap-6 px-6"
      >
        <div className="flex w-full justify-end">
          <button
            type="button"
            aria-label={t.passwordGate.languageToggle}
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            className="flex items-center gap-0.5 rounded-lg border border-border px-2 py-1 text-xs font-semibold transition-colors hover:bg-muted"
          >
            <span className={language === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
            <span className="text-muted-foreground">|</span>
            <span className={language === "fr" ? "text-primary" : "text-muted-foreground"}>FR</span>
          </button>
        </div>

        <p className="max-w-[22rem] text-center text-[10px] leading-relaxed text-muted-foreground">
          {t.passwordGate.disclaimer}
        </p>
        <img src={curadiaLogo} alt="CuraDia" className="mb-2 h-36" />
        <p className="text-center text-sm text-muted-foreground">
          {t.passwordGate.prompt}
        </p>
        <Input
          type="password"
          placeholder={t.passwordGate.placeholder}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          className={error ? "border-destructive" : ""}
          autoFocus
        />
        {error && (
          <p className="-mt-4 text-sm text-destructive">{t.passwordGate.incorrect}</p>
        )}
        <Button type="submit" className="w-full">
          {t.passwordGate.continue}
        </Button>
      </form>
    </div>
  );
};

export default PasswordGate;
