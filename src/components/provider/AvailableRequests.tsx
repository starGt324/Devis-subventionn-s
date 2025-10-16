import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, DollarSign, Calendar, ArrowRight, CheckCircle2, X, Building2, Banknote, Maximize2, FileText, User, Mail, Phone } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

interface Request {
  id: string;
  canton: string;
  budget: string;
  details: string;
  submittedAt: string;
  clientName: string;
  project_type:string;
}

interface QuoteFormData {
  price: string;
  description: string;
  estimatedTime: string;
}

const AvailableRequests = ({ category_id }: { category_id: string }) => {
  const { user } = useUser();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>({
    price: "",
    description: "",
    estimatedTime: "",
  });

  const [mockRequests, setRequests] = useState<Request[]>([]);

  const [selectedDetails, setSelectedDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchRequestDetails = async (requestId: string) => {
    try {
      setLoadingDetails(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/request-quotes/${requestId}`
      );
      setSelectedDetails(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };



  useEffect(() => {
  if (!category_id) return;

  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/devis/available-for-provider/${user.id}/${category_id}`)
    .then(res => setRequests(res.data))
    .catch(console.error);
}, [category_id, user.id]);


const handleSubmitQuote = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedRequest) return;

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/devis/${selectedRequest.id}`,
      {
        providerClerkId: user.id,
        price: formData.price,
        timeline: formData.estimatedTime,
        notes: formData.description,
        subsidyEligible: false,
      }
    );
    console.log('Devis submitted:', res.data);
    setShowConfirmation(true);
    setSelectedRequest(null);
  } catch (err) {
    console.error('Error submitting devis:', err);
  }
};




  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit the form data to an API
    console.log("Quote submitted:", { ...formData, requestId: selectedRequest?.id });
    setShowConfirmation(true);
    setSelectedRequest(null);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <CardTitle>Devis envoyé !</CardTitle>
            <CardDescription>
              Votre devis a été envoyé à {selectedRequest?.clientName}. Ils vous contacteront bientôt.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <Button onClick={() => setShowConfirmation(false)} className="w-full">
              Retour aux demandes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  if (selectedRequest) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Submit Quote for {selectedRequest.project_type}</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCloseModal}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitQuote} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Votre Prix</Label>
                <Input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="ex. : 750 €"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Durée estimée</Label>
                <Input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="text"
                  placeholder="ex. : 2-3 jours"
                  value={formData.estimatedTime}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description du devis</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Décrivez votre offre, les matériaux et tous les détails supplémentaires..."
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Envoyer le devis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedDetails) {
    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Détails de la demande
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Demande #{selectedDetails.id}
              </p>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
              En attente
            </div>
          </div>

          {/* Project Info Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Informations du projet
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Catégorie
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {selectedDetails.project_type}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Lieu
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {selectedDetails.canton}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Budget
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    { selectedDetails.budget}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Surface
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {selectedDetails.surface} m²
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Description
            </h4>
            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedDetails.details}
              </p>
            </div>
          </div>

          {/* Client Info Section */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Informations client
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500">Nom</span>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDetails.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500">Email</span>
                  <a href={`mailto:${selectedDetails.email}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline block truncate">
                    {selectedDetails.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500">Téléphone</span>
                  <a href={`tel:${selectedDetails.phone}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline block">
                    {selectedDetails.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-500">Date de création</span>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(selectedDetails.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={() => setSelectedDetails(null)}
          >
            Retour
          </Button>
          <Button
            onClick={() => setSelectedRequest(selectedDetails)}
          >
            Soumettre un devis <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demandes disponibles</CardTitle>
          <CardDescription>Soumettez des devis pour les demandes correspondant à vos catégories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {mockRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{request.project_type}</Badge>
                    <span className="text-sm text-muted-foreground">{request.submittedAt}</span>
                    
                  </div>
                  <CardTitle className="text-lg">Demande #{request.id}</CardTitle>
                  <CardDescription className="line-clamp-2">{request.details}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{request.canton}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{request.budget}</span>
                    </div>
                    <div className="flex gap-2">
                      
                    <Button className="w-full mt-4" onClick={() => setSelectedRequest(request)}>
                      Soumettre un devis <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Button
                      className="w-full mt-4" variant="outline"
                      onClick={() => fetchRequestDetails(request.id)}
                    >
                      Voir les détails
                    </Button>
                    </div>
                    
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default AvailableRequests;