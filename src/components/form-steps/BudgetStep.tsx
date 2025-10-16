import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input"; // Ensure you have an Input component
import { useState } from "react";

interface BudgetStepProps {
  formData: { budget: string };
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
}

const budgetRanges = [
  { value: "0-1k", label: "Moins de 1 000 €", description: "Petits projets" },
  { value: "1k-5k", label: "1 000 € - 5 000 €", description: "Projets moyens" },
  { value: "5k-10k", label: "5 000 € - 10 000 €", description: "Grands projets" },
  { value: "10k-25k", label: "10 000 € - 25 000 €", description: "Projets d'entreprise" },
  { value: "25k+", label: "25 000 €+", description: "Solutions personnalisées" },
  { value: "not-sure", label: "Pas encore sûr(e)", description: "Laisser les prestataires me guider" },
  { value: "custom", label: "Budget personnalisé", description: "Entrez votre propre montant" },
];

const BudgetStep = ({ formData, updateFormData }: BudgetStepProps) => {
  const [customBudget, setCustomBudget] = useState("");

  const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomBudget(value);
    if (formData.budget === "custom") {
      updateFormData("budget", `custom:${value}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quelle est votre fourchette de budget ?</h2>
        <p className="text-muted-foreground">Cela aide les prestataires à adapter leurs devis à vos besoins</p>
      </div>

      <RadioGroup
        value={formData.budget.startsWith("custom:") ? "custom" : formData.budget}
        onValueChange={(value) => {
          if (value !== "custom") {
            updateFormData("budget", value);
          } else {
            updateFormData("budget", customBudget ? `custom:${customBudget}` : "custom");
          }
        }}
        className="space-y-3"
      >
        {budgetRanges.map((range) => (
          <div key={range.value}>
            <RadioGroupItem
              value={range.value}
              id={range.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={range.value}
              className="flex items-center justify-between rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{range.label}</p>
                  <p className="text-sm text-muted-foreground">{range.description}</p>
                </div>
              </div>
            </Label>
            {range.value === "custom" && formData.budget.startsWith("custom") && (
              <div className="mt-3 ml-12">
                <Input
                  type="number"
                  placeholder="Entrez votre budget (€)"
                  value={customBudget}
                  onChange={handleCustomBudgetChange}
                  className="max-w-xs"
                  min="0"
                  step="1"
                />
              </div>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default BudgetStep;