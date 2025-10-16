import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye, Bell, User, Upload, ArrowLeft, LogOut, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";

interface Quote {
  id: string;
  provider: string;
  price: string;
  deadline: string;
  submittedAt: string;
}

interface Request {
  id: string;
  clerk_id: string;
  project_type: string;
  canton: string;
  surface?: number;
  budget?: string;
  details: string;
  name: string;
  email: string;
  phone: string;
  image_urls?: string[];
  video_urls?: string[];
  created_at: string;
  status?: "en cours" | "devis_reçus" | "clôturé";
  quotesCount?: number;
  quotes?: Quote[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  // Fetch requests on component mount
  useEffect(() => {
    if (user?.id) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/request-quotes/clerk/${user?.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const result = await response.json();
      setRequests(result.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/request-quotes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete request');
      }

      // Remove from local state
      setRequests(requests.filter(req => req.id !== id));
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
      
      // If we're viewing this request, go back to dashboard
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Erreur lors de la suppression de la demande');
    }
  };

  const openDeleteDialog = (id: string) => {
    setRequestToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (request: Request) => {
    // Navigate to edit page with request data
    navigate('/client/request-quote', { state: { request } });
  };

  const getStatusBadge = (request: Request) => {
    // You can add logic here to determine status based on quotes count
    const quotesCount = request.quotesCount || 0;
    
    if (quotesCount === 0) {
      return <Badge variant="secondary">En cours</Badge>;
    } else if (quotesCount > 0) {
      return <Badge className="bg-accent text-accent-foreground">Reçu {quotesCount} devis</Badge>;
    }
    return <Badge variant="outline">Clôturé</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const fetchQuotes = async (requestId: string) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/devis/request/${requestId}`);
    setSelectedRequest(prev => prev ? { ...prev, quotes: res.data.data } : null);
  } catch (err) {
    console.error('Failed to fetch quotes:', err);
  }
};

const handleSelectRequest = (request) => {
  setSelectedRequest(request);
  fetchQuotes(request.id)
};


  if (selectedRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleEdit(selectedRequest)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={() => openDeleteDialog(selectedRequest.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedRequest.project_type}</h1>
                <p className="text-muted-foreground">{selectedRequest.canton}</p>
              </div>
              {getStatusBadge(selectedRequest)}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{selectedRequest.budget || 'Non spécifié'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Surface</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {selectedRequest.surface ? `${selectedRequest.surface} m²` : 'Non spécifié'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Soumis le</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {new Date(selectedRequest.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Détails du projet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{selectedRequest.details}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-semibold mb-1">Nom</p>
                  <p className="text-muted-foreground">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Email</p>
                  <p className="text-muted-foreground">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Téléphone</p>
                  <p className="text-muted-foreground">{selectedRequest.phone}</p>
                </div>
              </div>

              {selectedRequest.image_urls && selectedRequest.image_urls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Images</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {selectedRequest.image_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Project image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedRequest.quotes && selectedRequest.quotes.length > 0 ? (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Devis reçus</CardTitle>
                  <CardDescription>Comparez les devis des prestataires</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedRequest.quotes.map((quote) => (
                      <div
                        key={quote.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {quote.provider.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{quote.provider}</p>
                            <p className="text-sm text-muted-foreground">
                              Soumis le {new Date(quote.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-lg font-semibold">{quote.price}</p>
                            <p className="text-sm text-muted-foreground">{quote.deadline}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button size="lg" onClick={() => navigate("/comparison")} className="flex-1">
                  <Eye className="mr-2 h-5 w-5" />
                  Voir la comparaison
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  <Download className="mr-2 h-5 w-5" />
                  Télécharger PDF
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Pas encore de devis</p>
                <p className="text-muted-foreground">
                  Les prestataires examinent votre demande. Vous serez notifié(e) lorsque les devis arriveront.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tableau de bord Client
            </h1>
            <p className="text-muted-foreground">
              Gérez vos demandes de devis et comparez les prestataires
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="flex overflow-x-auto no-scrollbar gap-2">
            <TabsTrigger value="requests" className="whitespace-nowrap">
              <FileText className="mr-2 h-4 w-4" />
              Mes demandes
            </TabsTrigger>
            <TabsTrigger value="account" className="whitespace-nowrap">
              <User className="mr-2 h-4 w-4" />
              Compte
            </TabsTrigger>
            <TabsTrigger value="notifications" className="whitespace-nowrap">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Aucune demande</p>
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore créé de demande de devis
                  </p>
                  <Button onClick={() => navigate("/client/request-quote")}>
                    <Upload className="mr-2 h-5 w-5" />
                    Créer une demande
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {requests.map((request) => (
                    <Card key={request.id} className="hover:shadow-lg transition-shadow flex flex-col">
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                              <CardTitle className="text-xl">{request.project_type}</CardTitle>
                              {getStatusBadge(request)}
                            </div>
                            <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                              <span>{request.canton}</span>
                              {request.budget && (
                                <>
                                  <span>•</span>
                                  <span>{request.budget}</span>
                                </>
                              )}
                              <span>•</span>
                              <span>Soumis le {new Date(request.created_at).toLocaleDateString()}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col justify-between flex-1">
                        <p className="text-muted-foreground mb-4 line-clamp-3">{request.details}</p>
                        <div className="flex flex-col gap-2 mt-auto">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{request.quotesCount || 0} devis reçu{(request.quotesCount || 0) !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1" 
                              onClick={() => handleSelectRequest(request) }
                            >
                              Voir les détails
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(request)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => openDeleteDialog(request.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  size="lg"
                  onClick={() => navigate("/client/request-quote")}
                  className="w-full sm:w-auto mt-4"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Créer une nouvelle demande
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du compte</CardTitle>
                <CardDescription>Gérez votre profil et vos préférences</CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Gestion du compte bientôt disponible</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Restez informé(e) de vos demandes de devis</CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune nouvelle notification</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La demande de devis sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => requestToDelete && handleDelete(requestToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientDashboard;