import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import { RequestData } from "@/pages/PrestatairePortal";

interface RequestListProps {
  requests: RequestData[];
  loading: boolean;
  onSelectRequest: (request: RequestData) => void;
}

const RequestList = ({ requests, loading, onSelectRequest }: RequestListProps) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-10 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Aucune demande correspondante disponible pour le moment.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Revenez plus tard pour de nouvelles opportunités.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {requests.map((request) => (
        <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                {request.category}
              </Badge>
              <h3 className="text-lg font-semibold">Demande #{request.id}</h3>
            </div>
            <span className="text-sm text-muted-foreground">{request.submittedAt}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {request.details}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{request.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{request.budget}</span>
            </div>
          </div>

          <Button onClick={() => onSelectRequest(request)} className="w-full">
            Voir les détails & Soumettre un devis
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default RequestList;
