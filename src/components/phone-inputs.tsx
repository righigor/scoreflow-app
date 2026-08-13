import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface PhoneInputsProps {
  value: string[];
  onChange: (val: string[]) => void;
}

export function PhoneInputs({ value, onChange }: PhoneInputsProps) {
  const addPhone = () => onChange([...value, ""]);
  const removePhone = (index: number) => onChange(value.filter((_, i) => i !== index));
  const changePhone = (index: number, val: string) => {
    const updated = [...value];
    updated[index] = val;
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {value.map((phone, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input 
            placeholder="(00) 00000-0000" 
            value={phone} 
            onChange={(e) => changePhone(i, e.target.value)} 
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="shrink-0 text-destructive hover:text-destructive cursor-pointer" 
            onClick={() => removePhone(i)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="w-full cursor-pointer" 
        onClick={addPhone}
      >
        <Plus className="h-4 w-4 mr-2" /> Adicionar Telefone
      </Button>
    </div>
  );
}