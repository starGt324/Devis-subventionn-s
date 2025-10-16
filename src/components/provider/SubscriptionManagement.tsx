import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";

const SubscriptionManagement = () => {
  const [currentPlan] = useState<"basic" | "professional" | "enterprise">("basic");

  return (
<div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Abonnement actuel</CardTitle>
      <CardDescription>Gérez votre plan et votre facturation</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">Plan Basic</h3>
            <Badge variant="secondary">Actif</Badge>
          </div>
          <p className="text-sm text-muted-foreground">10 soumissions de devis par mois</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">29€</p>
          <p className="text-sm text-muted-foreground">/mois</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Devis utilisés</span>
          <span className="text-sm text-muted-foreground">7 / 10</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: "70%" }}></div>
        </div>
      </div>
    </CardContent>
  </Card>

  <div className="grid gap-6 md:grid-cols-3">
    <Card className={currentPlan === "basic" ? "border-primary" : ""}>
      <CardHeader>
        <CardTitle>Basic</CardTitle>
        <CardDescription>Parfait pour commencer</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">29€</span>
          <span className="text-muted-foreground">/mois</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">10 devis/mois</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">Support basique</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">Notifications par e-mail</span>
          </li>
        </ul>
        <Button variant="outline" className="w-full" disabled>
          Plan actuel
        </Button>
      </CardContent>
    </Card>

    <Card className={currentPlan === "professional" ? "border-primary" : ""}>
      <CardHeader>
        <CardTitle>Professional</CardTitle>
        <CardDescription>Le choix le plus populaire</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">79€</span>
          <span className="text-muted-foreground">/mois</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">50 devis/mois</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">Support prioritaire</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">Analyses avancées</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">Marque personnalisée</span>
          </li>
        </ul>
        <Button className="w-full">
          Passer au plan supérieur
        </Button>
      </CardContent>
    </Card>

    <Card className={currentPlan === "enterprise" ? "border-primary" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Enterprise
          <Zap className="h-4 w-4 text-primary" />
        </CardTitle>
        <CardDescription>Pour les fournisseurs à volume élevé</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">199€</span>
          <span className="text-muted-foreground">/mois</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">Devis illimités</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">Support Premium 24/7</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">Accès API</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm">Gestionnaire de compte dédié</span>
          </li>
        </ul>
        <Button className="w-full">
          Passer au plan supérieur
        </Button>
      </CardContent>
    </Card>
  </div>
</div>

  );
};

export default SubscriptionManagement;
