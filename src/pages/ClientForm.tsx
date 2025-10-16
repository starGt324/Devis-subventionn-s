import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CategoryStep from "@/components/form-steps/CategoryStep";
import LocationStep from "@/components/form-steps/LocationStep";
import BudgetStep from "@/components/form-steps/BudgetStep";
import DetailsStep from "@/components/form-steps/DetailsStep";
import MediaStep from "@/components/form-steps/MediaStep";
import ContactStep from "@/components/form-steps/ContactStep";
import ReviewStep from "@/components/form-steps/ReviewStep";
import { toast } from "sonner";

export interface FormData {
  category: string;
  location: string;
  budget: string;
  details: string;
  images: File[];
  videos: File[];
  name: string;
  email: string;
  phone: string;
  surface?: string;
  categoryId: string;
}

const steps = [
  { id: 1, name: "Category", component: CategoryStep },
  { id: 2, name: "Location", component: LocationStep },
  { id: 3, name: "Budget", component: BudgetStep },
  { id: 4, name: "Details", component: DetailsStep },
  { id: 5, name: "Media", component: MediaStep },
  { id: 6, name: "Contact", component: ContactStep },
  { id: 7, name: "Review", component: ReviewStep },
];

const ClientForm = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    category: "",
    location: "",
    budget: "",
    details: "",
    images: [],
    videos: [],
    name: "",
    email: "",
    phone: "",
    categoryId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const uploadFiles = async (files: File[], type: 'image' | 'video'): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      try {
        // You'll need to create an upload endpoint in your backend
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/request-quotes/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        uploadedUrls.push(response.data.url);
      } catch (error) {
        console.error(`Failed to upload ${type}:`, error);
        throw new Error(`Failed to upload ${type}: ${file.name}`);
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (!isLoaded || !user) {
      toast.error("Please sign in to submit your request.");
      navigate("/sign-in", { replace: true });
      return;
    }

    // Validation
    if (!formData.category || !formData.location || !formData.name || !formData.email || !formData.phone) {
      toast.error("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload media files if any
      let imageUrls: string[] = [];
      let videoUrls: string[] = [];

      if (formData.images.length > 0) {
        toast.info("Uploading images...");
        imageUrls = await uploadFiles(formData.images, 'image');
      }

      if (formData.videos.length > 0) {
        toast.info("Uploading videos...");
        videoUrls = await uploadFiles(formData.videos, 'video');
      }

      // Submit quote request with correct field names matching backend DTO
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/request-quotes`, {
        clerk_id: user.id, // Match backend DTO field name
        category_id: formData.categoryId,
        canton: formData.location,
        projectType:formData.category,
        surface: formData.surface || formData.details?.match(/(\d+)/)?.[1] || "",
        budget: formData.budget,
        details: formData.details,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        imageUrls: imageUrls,
        videoUrls: videoUrls,
      });

      toast.success("Quote request submitted successfully!");
      navigate("/client/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Quote submit error:", err);
      toast.error(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Demander un devis
          </h1>
          <p className="text-muted-foreground">
            Étape {currentStep} sur {steps.length} : {steps[currentStep - 1].name}
          </p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-6 md:p-8 shadow-xl">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext} disabled={isSubmitting}>
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Soumettre la demande"}
              </Button>
            )}
          </div>
        </Card>

        <div className="mt-6 flex gap-2 justify-center flex-wrap">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-2 w-12 rounded-full transition-all ${
                step.id === currentStep
                  ? "bg-primary"
                  : step.id < currentStep
                  ? "bg-accent"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientForm;