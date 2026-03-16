import { useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import curадiaLogo from "@/assets/curadia-logo.png";

const DEMO_PASSWORD = "DIA-84842486";
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

  if (granted) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
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
        className="relative z-10 flex flex-col items-center gap-6 w-full max-w-xs px-6"
      >
        <img src={curадiaLogo} alt="CuraDia" className="h-36 mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          Enter the demo password to continue
        </p>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          className={error ? "border-destructive" : ""}
          autoFocus
        />
        {error && (
          <p className="text-sm text-destructive -mt-4">Incorrect password</p>
        )}
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  );
};

export default PasswordGate;
