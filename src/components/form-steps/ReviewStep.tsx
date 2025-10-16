import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Video,
  User,
  Mail,
  Phone,
  Send,
} from "lucide-react";

interface ReviewStepProps {
  formData: {
    category: string;
    location: string;
    budget: string;
    details: string;
    images: File[];
    videos: File[];
    name: string;
    email: string;
    phone: string;
  };
  onSubmit: () => void;
}

const ReviewStep = ({ formData, onSubmit }: ReviewStepProps) => {
  const isFormValid =
    formData.category &&
    formData.location &&
    formData.budget &&
    formData.details &&
    formData.name &&
    formData.email;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review your request</h2>
        <p className="text-muted-foreground">
          Please review all information before submitting
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <p className="font-medium">{formData.category || "Not specified"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Location</p>
              <p className="font-medium">{formData.location || "Not specified"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Budget</p>
              <p className="font-medium">{formData.budget || "Not specified"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Project Details</p>
              <p className="text-sm line-clamp-3">{formData.details || "Not specified"}</p>
            </div>
          </div>
        </Card>

        {(formData.images.length > 0 || formData.videos.length > 0) && (
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <ImageIcon className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Media Files</p>
                <div className="flex gap-2">
                  {formData.images.length > 0 && (
                    <Badge variant="secondary">
                      {formData.images.length} image{formData.images.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                  {formData.videos.length > 0 && (
                    <Badge variant="secondary">
                      {formData.videos.length} video{formData.videos.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{formData.name || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{formData.email || "Not specified"}</p>
              </div>
            </div>
            {formData.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {!isFormValid && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">
            ⚠️ Please fill in all required fields before submitting
          </p>
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        onClick={onSubmit}
        disabled={!isFormValid}
      >
        <Send className="mr-2 h-5 w-5" />
        Submit Quote Request
      </Button>
    </div>
  );
};

export default ReviewStep;
