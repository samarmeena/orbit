import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { useTheme } from "next-themes";

export default function ThemeSetting() {
  const { theme, setTheme } = useTheme();

  const active = (name: string) => {
    return name === theme;
  };

  return (
    <div className="space-y-2">
      <Label>Theme</Label>
      <div className="flex gap-4">
        <Button
          variant={active("system") ? "default" : "outline"}
          onClick={() => {
            setTheme("system");
          }}
          size="sm"
        >
          System
        </Button>
        <Button
          variant={active("dark") ? "default" : "outline"}
          onClick={() => {
            setTheme("dark");
          }}
          size="sm"
        >
          Dark
        </Button>
        <Button
          variant={active("light") ? "default" : "outline"}
          onClick={() => {
            setTheme("light");
          }}
          size="sm"
        >
          Light
        </Button>
      </div>
    </div>
  );
}
