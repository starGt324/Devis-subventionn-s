import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, QrCode } from "lucide-react";
import { toast } from "sonner";

interface Quote {
  id: string;
  provider: string;
  logo?: string;
  price: string;
  deadline: string;
  description: string;
}

const QuoteComparison = () => {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    // Simulate API call to fetch quotes
    const fetchQuotes = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock data
setQuotes([
  {
    id: "1",
    provider: "TechSolutions Inc.",
    price: "€7,500",
    deadline: "4 semaines",
    description: "Développement web complet avec stack technologique moderne",
  },
  {
    id: "2",
    provider: "Digital Craft Studio",
    price: "€6,200",
    deadline: "5 semaines",
    description: "Design et développement sur mesure avec optimisation SEO",
  },
  {
    id: "3",
    provider: "Code Masters",
    price: "€8,900",
    deadline: "3 semaines",
    description: "Livraison rapide avec package de support premium",
  },
]);


      setLoading(false);
    };

    fetchQuotes();
  }, []);

  const handleDownloadPDF = () => {
    // Placeholder for PDF generation
    toast.success("PDF download will be available soon!");
    console.log("Generating PDF comparison...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Card className="p-8">
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
  <div className="max-w-6xl mx-auto">
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Comparaison de Devis</h1>
      <p className="text-muted-foreground">
        Comparez les devis de {quotes.length} prestataires
      </p>
    </div>

    <Card className="p-6 md:p-8 mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-4 font-semibold">Prestataire</th>
              <th className="text-left py-4 px-4 font-semibold">Prix</th>
              <th className="text-left py-4 px-4 font-semibold">Délai</th>
              <th className="text-left py-4 px-4 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote, index) => (
              <tr
                key={quote.id}
                className={`border-b last:border-0 hover:bg-secondary/50 transition-colors ${
                  index === 0 ? "bg-accent/5" : ""
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {quote.provider.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{quote.provider}</p>
                      {index === 0 && (
                        <span className="text-xs text-accent font-medium">
                          Meilleur choix
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="font-semibold text-lg">{quote.price}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-foreground">{quote.deadline}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-muted-foreground max-w-md">
                    {quote.description}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    <div className="grid md:grid-cols-2 gap-4">
      <Button size="lg" onClick={handleDownloadPDF} className="w-full">
        <Download className="mr-2 h-5 w-5" />
        Télécharger le PDF
      </Button>

      <Button size="lg" variant="outline" className="w-full">
        <QrCode className="mr-2 h-5 w-5" />
        Générer un QR Code pour les vidéos
      </Button>
    </div>

    <div className="mt-8 grid md:grid-cols-3 gap-6">
      <Card className="p-6 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold mb-2">Détails Détaillés</h3>
        <p className="text-sm text-muted-foreground">
          Chaque devis inclut un détail complet des services et livrables
        </p>
      </Card>

      <Card className="p-6 text-center">
        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Download className="h-6 w-6 text-accent" />
        </div>
        <h3 className="font-semibold mb-2">Options d’Export</h3>
        <p className="text-sm text-muted-foreground">
          Téléchargez les comparaisons en PDF ou partagez via QR code
        </p>
      </Card>

      <Card className="p-6 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <QrCode className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold mb-2">Accès aux Vidéos</h3>
        <p className="text-sm text-muted-foreground">
          Les QR codes offrent un accès rapide aux vidéos de projet téléchargées
        </p>
      </Card>
    </div>
  </div>
</div>

  );
};

export default QuoteComparison;
