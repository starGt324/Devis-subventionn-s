import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { RequestData } from "@/pages/PrestatairePortal";

interface RequestDetailProps {
  request: RequestData;
  onBack: () => void;
  onQuoteSubmitted: () => void;
}

const RequestDetail = ({ request, onBack, onQuoteSubmitted }: RequestDetailProps) => {
  const [quote, setQuote] = useState({
    price: "",
    deadline: "",
    description: "",
    document: null as File | null,
  });

  const handleSubmitQuote = async () => {
    if (!quote.price || !quote.deadline || !quote.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Placeholder for API call
    console.log("Submitting quote:", quote);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Quote submitted successfully!");
    onQuoteSubmitted();
  };

  return (
<div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
  <div className="max-w-4xl mx-auto">
    <Button
      variant="ghost"
      onClick={onBack}
      className="mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Retour aux demandes
    </Button>

    <div className="mb-6">
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-3xl font-bold">Demande #{request.id}</h1>
        <Badge variant="secondary">{request.category}</Badge>
      </div>
      <p className="text-muted-foreground">Soumis le {request.submittedAt}</p>
    </div>

    <div className="grid gap-6 mb-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Informations sur le client</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Nom du client</Label>
            <p className="font-medium">{request.clientName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Localisation</Label>
            <p className="font-medium">{request.location}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Fourchette de budget</Label>
            <p className="font-medium">{request.budget}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Catégorie</Label>
            <p className="font-medium">{request.category}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Détails du projet</h2>
        <p className="text-foreground whitespace-pre-wrap">{request.details}</p>
      </Card>

      {(request.images.length > 0 || request.videos.length > 0) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Médias téléchargés
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {request.images.length === 0 && request.videos.length === 0 && (
              <div className="text-muted-foreground text-sm">Aucun fichier média téléchargé</div>
            )}
            {/* Les vignettes des médias seraient affichées ici */}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Soumettre votre devis</h2>
        <div className="space-y-6">
          <div>
            <Label htmlFor="price">Prix *</Label>
            <Input
              id="price"
              type="text"
              placeholder="ex. : 7 500 €"
              value={quote.price}
              onChange={(e) => setQuote({ ...quote, price: e.target.value })}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="deadline">Délai estimé *</Label>
            <Input
              id="deadline"
              type="text"
              placeholder="ex. : 4 semaines"
              value={quote.deadline}
              onChange={(e) => setQuote({ ...quote, deadline: e.target.value })}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="description">Description du devis *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez ce qui est inclus dans votre devis..."
              value={quote.description}
              onChange={(e) => setQuote({ ...quote, description: e.target.value })}
              rows={5}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="document">Joindre PDF ou logo (optionnel)</Label>
            <div className="mt-1.5">
              <label
                htmlFor="document"
                className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {quote.document ? quote.document.name : "Cliquez pour télécharger un fichier"}
                </span>
              </label>
              <input
                id="document"
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) =>
                  setQuote({ ...quote, document: e.target.files?.[0] || null })
                }
              />
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full">
                Soumettre le devis
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la soumission du devis</DialogTitle>
                <DialogDescription className="space-y-4 pt-4">
                  <p>Êtes-vous sûr de vouloir soumettre ce devis ?</p>
                  <div className="bg-secondary rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix :</span>
                      <span className="font-medium">{quote.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Délai :</span>
                      <span className="font-medium">{quote.deadline}</span>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-3 mt-4">
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    Annuler
                  </Button>
                </DialogTrigger>
                <Button onClick={handleSubmitQuote} className="flex-1">
                  Confirmer la soumission
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  </div>
</div>

  );
};

export default RequestDetail;
