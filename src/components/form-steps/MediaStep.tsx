import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Video, Link } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface MediaStepProps {
  formData: { images?: File[]; videos?: File[]; imagePaths?: string[]; videoPaths?: string[] };
  updateFormData: (field: string, value: any) => void;
  onNext: () => void;
}

const MediaStep = ({ formData, updateFormData }: MediaStepProps) => {
  const [imagePathInput, setImagePathInput] = useState("");
  const [videoPathInput, setVideoPathInput] = useState("");
  const [showImagePathInput, setShowImagePathInput] = useState(false);
  const [showVideoPathInput, setShowVideoPathInput] = useState(false);

  // Initialize defaults to avoid undefined
  const images = formData.images || [];
  const videos = formData.videos || [];
  const imagePaths = formData.imagePaths || [];
  const videoPaths = formData.videoPaths || [];

  // Basic URL validation
  const isValidUrl = (url: string) => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
    return urlPattern.test(url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      return true;
    });
    updateFormData("images", [...images, ...validFiles]);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("video/")) {
        toast.error(`${file.name} is not a valid video file`);
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 100MB limit`);
        return false;
      }
      return true;
    });
    updateFormData("videos", [...videos, ...validFiles]);
  };

  const handleImagePathAdd = () => {
    if (!imagePathInput) {
      toast.error("Please enter a valid image URL or path");
      return;
    }
    if (!isValidUrl(imagePathInput)) {
      toast.error("Invalid URL format for image path");
      return;
    }
    updateFormData("imagePaths", [...imagePaths, imagePathInput]);
    setImagePathInput("");
    setShowImagePathInput(false);
  };

  const handleVideoPathAdd = () => {
    if (!videoPathInput) {
      toast.error("Please enter a valid video URL or path");
      return;
    }
    if (!isValidUrl(videoPathInput)) {
      toast.error("Invalid URL format for video path");
      return;
    }
    updateFormData("videoPaths", [...videoPaths, videoPathInput]);
    setVideoPathInput("");
    setShowVideoPathInput(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    updateFormData("images", newImages);
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    updateFormData("videos", newVideos);
  };

  const removeImagePath = (index: number) => {
    const newImagePaths = imagePaths.filter((_, i) => i !== index);
    updateFormData("imagePaths", newImagePaths);
  };

  const removeVideoPath = (index: number) => {
    const newVideoPaths = videoPaths.filter((_, i) => i !== index);
    updateFormData("videoPaths", newVideoPaths);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Téléchargez des médias (optionnel)</h2>
        <p className="text-muted-foreground">
          Ajoutez des images, vidéos ou leurs chemins (URLs) pour aider les prestataires à mieux comprendre vos besoins
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base mb-3 block">Images (JPG, PNG ou URL)</Label>
          <div className="space-y-4">
            {/* File Upload */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="font-medium mb-1">Cliquez pour télécharger des images</p>
                <p className="text-sm text-muted-foreground">Fichiers JPG ou PNG</p>
              </label>
            </div>

            {/* Path Input Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowImagePathInput(!showImagePathInput)}
              className="w-full"
            >
              <Link className="h-5 w-5 mr-2" />
              {showImagePathInput ? "Annuler" : "Ajouter une URL d'image"}
            </Button>

            {/* Path Input */}
            {showImagePathInput && (
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Entrez l'URL de l'image (ex: https://example.com/image.jpg)"
                  value={imagePathInput}
                  onChange={(e) => setImagePathInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleImagePathAdd}>Ajouter</Button>
              </div>
            )}

            {/* Display Uploaded Images */}
            {images.length > 0 && (
              <div className=" Thick grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {images.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg border-2 border-border overflow-hidden bg-muted">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Display Image Paths */}
            {imagePaths.length > 0 && (
              <div className="space-y-3 mt-4">
                {imagePaths.map((path, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground truncate">{path}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeImagePath(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className="text-base mb-3 block">Vidéos (MP4, max 30s ou URL)</Label>
          <div className="space-y-4">
            {/* File Upload */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="video/mp4"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <Video className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="font-medium mb-1">Cliquez pour télécharger des vidéos</p>
                <p className="text-sm text-muted-foreground">Fichiers MP4, max 30 secondes</p>
              </label>
            </div>

            {/* Path Input Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowVideoPathInput(!showVideoPathInput)}
              className="w-full"
            >
              <Link className="h-5 w-5 mr-2" />
              {showVideoPathInput ? "Annuler" : "Ajouter une URL de vidéo"}
            </Button>

            {/* Path Input */}
            {showVideoPathInput && (
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Entrez l'URL de la vidéo (ex: https://example.com/video.mp4)"
                  value={videoPathInput}
                  onChange={(e) => setVideoPathInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleVideoPathAdd}>Ajouter</Button>
              </div>
            )}

            {/* Display Uploaded Videos */}
            {videos.length > 0 && (
              <div className="space-y-3 mt-4">
                {videos.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} Mo
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeVideo(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Display Video Paths */}
            {videoPaths.length > 0 && (
              <div className="space-y-3 mt-4">
                {videoPaths.map((path, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground truncate">{path}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeVideoPath(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-secondary/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          📸 <strong>Optionnel :</strong> Les fichiers médias ou URLs aident les prestataires à mieux comprendre votre vision, mais ils ne sont pas nécessaires pour soumettre votre demande.
        </p>
      </div>
    </div>
  );
};

export default MediaStep;