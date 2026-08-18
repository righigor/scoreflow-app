import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SocialInputsProps {
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
}

const NETWORKS = [
  { key: "instagram", label: "Instagram" },
  { key: "x", label: "X (Twitter)" },
  { key: "facebook", label: "Facebook" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "site", label: "Site" },
];

export function SocialInputs({ value, onChange }: SocialInputsProps) {
  const change = (key: string, val: string) => onChange({ ...value, [key]: val });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {NETWORKS.map((net) => (
        <div key={net.key} className="flex flex-col gap-1.5">
          <Label htmlFor={net.key}>{net.label}</Label>
          <Input 
            id={net.key} 
            placeholder={`https://${net.key}.com/...`} 
            value={value[net.key] || ""} 
            onChange={(e) => change(net.key, e.target.value)} 
          />
        </div>
      ))}
    </div>
  );
}