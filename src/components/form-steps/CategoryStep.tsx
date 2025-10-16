import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Category {
  id: string;
  name: string; // Or `name` depending on your DB
  value: string; // Or `slug`
  icon?: string; // Optional icon field
}

interface CategoryStepProps {
  formData: { category: string, categoryId: string };
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
}

const CategoryStep = ({ formData, updateFormData }: CategoryStepProps) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/categories`
        );

        // ✅ Extract the real array
        const list = res.data?.data;

        if (!Array.isArray(list)) {
          throw new Error("Expected 'data' to be an array");
        }

        setCategories(list);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleBack = () => navigate(-1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">What service do you need?</h2>
          <p className="text-muted-foreground">
            Select the category that best matches your project
          </p>
        </div>
      </div>

      <RadioGroup
        value={formData.categoryId}
        onValueChange={(value) => {
          const selected = categories.find((c) => c.id === value);
          updateFormData("category", selected?.name || "");
          updateFormData("categoryId", value);
        }}
        className="grid grid-cols-1 md-grid-cols-2 gap-4"
      >
        {categories.map((category) => (
            <div key={category.id}>
              <RadioGroupItem
                value={category.id}
                id={category.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={category.id}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
              >
                {/* You can assign icons based on category.name, or add `icon` in DB */}
                <span className="font-medium">{category.name}</span>
              </Label>
            </div>
          ))}
      </RadioGroup>
    </div>
  );
};

export default CategoryStep;