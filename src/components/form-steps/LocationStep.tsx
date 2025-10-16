import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface LocationStepProps {
  formData: { location: string };
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
}

const LocationStep = ({ formData, updateFormData }: LocationStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Où se situe votre projet ?</h2>
        <p className="text-muted-foreground">
          Cela nous aide à vous mettre en relation avec les bons prestataires
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="location" className="text-base">
            Ville ou région
          </Label>
          <div className="relative mt-2">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="location"
              type="text"
              placeholder="ex. : Paris, France"
              value={formData.location}
              onChange={(e) => updateFormData("location", e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Conseil :</strong> Soyez aussi précis que possible pour obtenir des devis plus précis de la part des prestataires locaux.
          </p>
        </div>
      </div>
    </div>

  );
};

export default LocationStep;
