import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";

interface Quote {
  id: string;
  requestId: string;
  client: string;
  category: string;
  amount: string;
  status: "en attente" | "accepté" | "refusé";
  submittedAt: string;
  validUntil: string;
}

const getStatusColor = (status: Quote["status"]) => {
  switch (status) {
    case "en attente": return "secondary";
    case "accepté": return "default";
    case "refusé": return "destructive";
    default: return "secondary";
  }
};

const MyQuotes = () => {
  const { user, isLoaded } = useUser();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/devis/provider/${user.id}`);
        const data = res.data.data;

        // Map backend response to frontend Quote interface
        const mapped: Quote[] = data.map((d: any) => ({
          id: d.id,
          requestId: d.quote_id,
          client: d.client_name || d.name,
          category: d.project_type,
          amount: d.price ? `${d.price} €` : "-",
          status: d.status === 'pending' ? "en attente" : d.accepted ? "accepté" : "refusé",
          submittedAt: new Date(d.submitted_at).toLocaleDateString(),
          validUntil: new Date(d.expiration || new Date()).toLocaleDateString(),
        }));

        setQuotes(mapped);
      } catch (err) {
        console.error("Failed to fetch provider quotes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [isLoaded, user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mes devis soumis</CardTitle>
          <CardDescription>Suivez et gérez tous vos devis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID du devis</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Soumis le</TableHead>
                  <TableHead>Valable jusqu’au</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.client}</TableCell>
                    <TableCell>{quote.category}</TableCell>
                    <TableCell className="font-semibold">{quote.amount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(quote.status)}>{quote.status}</Badge>
                    </TableCell>
                    <TableCell>{quote.submittedAt}</TableCell>
                    <TableCell>{quote.validUntil}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {quote.status === "en attente" && (
                          <>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyQuotes;
