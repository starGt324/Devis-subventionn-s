import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Phone, User } from "lucide-react";

interface ContactStepProps {
  formData: { name: string; email: string; phone: string };
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
}

const ContactStep = ({ formData, updateFormData }: ContactStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Comment les prestataires peuvent-ils vous contacter ?</h2>
        <p className="text-muted-foreground">
          Vos coordonnées ne seront partagées qu'avec les prestataires sélectionnés
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-base">
            Nom complet *
          </Label>
          <div className="relative mt-2">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="Jean Dupont"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className="pl-10 h-12 text-base"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-base">
            Adresse e-mail *
          </Label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="jean@example.com"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="pl-10 h-12 text-base"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-base">
            Numéro de téléphone (facultatif)
          </Label>
          <div className="relative mt-2">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </div>

      <div className="bg-secondary/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          🔒 <strong>Confidentialité :</strong> Vos informations sont sécurisées et ne seront utilisées que pour vous envoyer des devis pour ce projet.
        </p>
      </div>
    </div>
  );
};

export default ContactStep;
