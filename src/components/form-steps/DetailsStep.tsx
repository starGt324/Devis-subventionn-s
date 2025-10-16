import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface DetailsStepProps {
  formData: { details: string };
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
}

const DetailsStep = ({ formData, updateFormData }: DetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Parlez-nous de votre projet</h2>
        <p className="text-muted-foreground">
          Fournissez autant de détails que possible pour recevoir des devis précis
        </p>
      </div>

      <div>
        <Label htmlFor="details" className="text-base">
          Description du projet *
        </Label>
        <Textarea
          id="details"
          placeholder="Décrivez les besoins de votre projet, vos objectifs, le calendrier et toutes les fonctionnalités spécifiques dont vous avez besoin..."
          value={formData.details}
          onChange={(e) => updateFormData("details", e.target.value)}
          rows={10}
          className="mt-2 resize-none"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {formData.details.length} / 2000 caractères
        </p>
      </div>

      <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
        <div className="flex items-start gap-2">
          <FileText className="h-5 w-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-sm">Incluez ces détails :</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Objectifs du projet et résultats attendus</li>
              <li>Calendrier et échéances critiques</li>
              <li>Fonctionnalités ou exigences spécifiques</li>
              <li>Public cible ou utilisateurs</li>
              <li>Contraintes ou préférences techniques éventuelles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
