import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

const SignUpPage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"client" | "provider" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [phone, setPhone] = useState("");

  // Wait until user is fully loaded
  useEffect(() => {
    if (isLoaded && user) setLoadingUser(false);
  }, [isLoaded, user]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`);
        setCategories(res.data.data); // assuming your endpoint returns { data: [...] }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    if (selectedRole === "provider") {
      fetchCategories();
    }
  }, [selectedRole]);

  const handleSubmit = async () => {
    if (!selectedRole || !user) return;

    setIsSubmitting(true);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0].emailAddress,
        role: selectedRole,
        ...(selectedRole === "provider" && {
          categoryId: selectedCategoryId, // send selected category id
          companyName,
          phone,
        }),
      });

      if (selectedRole === "provider") navigate("/provider/dashboard");
      else navigate("/client/dashboard");
    } catch (err) {
      console.error("Failed to save role:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingUser)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading user...</span>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Complétez votre inscription
        </h2>

        <label className="block mb-2 font-medium">Sélectionnez votre rôle</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as "client" | "provider")}
          className="w-full p-3 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Choisir un rôle</option>
          <option value="client">Client</option>
          <option value="provider">Prestataire</option>
        </select>

        {selectedRole === "provider" && (
          <div className="space-y-4 mb-6">
            <label className="block">
              Secteur d'activité
              <select
                value=""
                onChange={e => setSelectedCategoryId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choisir un secteur</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              Nom de l’entreprise (optionnel)
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded mt-1"
                placeholder="Ex: BatiPro SARL"
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </label>

            <label className="block">
              Téléphone (optionnel)
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded mt-1"
                placeholder="Ex: +212 6 12 34 56 78"
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedRole || (selectedRole === "provider" && !selectedCategoryId) || isSubmitting}
          className="w-full p-3 bg-primary text-white font-medium rounded hover:bg-primary/90 transition"
        >
          {isSubmitting ? "Enregistrement..." : "Continuer"}
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
