import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, DollarSign, Calendar } from "lucide-react";
import RequestList from "@/components/prestataire/RequestList";
import RequestDetail from "@/components/prestataire/RequestDetail";

export interface RequestData {
  id: string;
  category: string;
  location: string;
  budget: string;
  details: string;
  images: string[];
  videos: string[];
  clientName: string;
  submittedAt: string;
}

const PrestatairePortal = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Simulate API call to verify token and fetch matching requests
    const fetchRequests = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock data - multiple requests matching provider's categories/location
      setRequests([
        {
          id: "REQ-001",
          category: "Web Development",
          location: "Paris, France",
          budget: "€5,000 - €10,000",
          details: "Need a modern e-commerce website with payment integration, user authentication, and product catalog. Should support multiple payment methods and be mobile-responsive.",
          images: [],
          videos: [],
          clientName: "John Doe",
          submittedAt: "2024-01-15",
        },
        {
          id: "REQ-002",
          category: "Web Development",
          location: "Lyon, France",
          budget: "€2,000 - €5,000",
          details: "Looking for a portfolio website with modern design, smooth animations, and contact form integration.",
          images: [],
          videos: [],
          clientName: "Marie Laurent",
          submittedAt: "2024-01-16",
        },
        {
          id: "REQ-003",
          category: "Mobile App",
          location: "Paris, France",
          budget: "€10,000+",
          details: "Need a cross-platform mobile app for fitness tracking with social features, workout plans, and progress analytics.",
          images: [],
          videos: [],
          clientName: "Pierre Martin",
          submittedAt: "2024-01-14",
        },
      ]);
      
      setLoading(false);
    };

    if (token) {
      fetchRequests();
    }
  }, [token]);

  const handleQuoteSubmitted = () => {
    setShowConfirmation(true);
    setSelectedRequest(null);
  };

  // if (!token) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
  //       <Card className="p-8 max-w-md text-center">
  //         <h1 className="text-2xl font-bold mb-4 text-destructive">Invalid Access</h1>
  //         <p className="text-muted-foreground">
  //           Please use the link provided in your email to access this request.
  //         </p>
  //       </Card>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Card className="p-8 space-y-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4">
        <Card className="p-8 max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-accent" />
          <h1 className="text-2xl font-bold mb-4">Quote Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Your quote has been successfully submitted to the client. They will review it and contact you soon.
          </p>
          <Button onClick={() => setShowConfirmation(false)} className="w-full">
            Back to Requests
          </Button>
        </Card>
      </div>
    );
  }

  if (selectedRequest) {
    return (
      <RequestDetail
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        onQuoteSubmitted={handleQuoteSubmitted}
      />
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
  <div className="max-w-6xl mx-auto">
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Demandes Disponibles</h1>
      <p className="text-muted-foreground">
        Parcourez et répondez aux demandes correspondant à votre expertise
      </p>
    </div>

    <RequestList
      requests={requests}
      loading={loading}
      onSelectRequest={setSelectedRequest}
    />
  </div>
</div>

  );
};

export default PrestatairePortal;
