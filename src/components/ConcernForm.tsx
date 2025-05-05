import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Paperclip, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ConcernFormProps {
  onSubmit?: (data: ConcernFormData) => void;
  isSubmitting?: boolean;
  submissionCount?: number;
  maxSubmissions?: number;
}

export interface ConcernFormData {
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  attachments?: File[];
}

const ConcernForm: React.FC<ConcernFormProps> = ({
  onSubmit = () => {},
  isSubmitting = false,
  submissionCount = 0,
  maxSubmissions = Infinity,
}) => {
  const [formData, setFormData] = useState<ConcernFormData>({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    attachments: [],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...newFiles],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      setError("Please provide a title for your concern");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please provide a description of your concern");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    setError(null);
    onSubmit(formData);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    setFormData((prev) => ({
      ...prev,
      attachments: newFiles,
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-background">
      <CardHeader>
        <CardTitle>Submit a Concern</CardTitle>
        <CardDescription>
          Fill out the form below to submit your concern to the Student Affairs
          Office.
          {maxSubmissions !== Infinity && (
            <span className="block text-xs mt-1">
              {submissionCount}/{maxSubmissions} submissions used
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Brief title of your concern"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide details about your concern"
              rows={5}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value) =>
                handleSelectChange(
                  "priority",
                  value as "low" | "medium" | "high",
                )
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="flex items-center gap-2"
              >
                <Paperclip className="h-4 w-4" />
                Add Files
              </Button>
              <Input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Attached Files:</p>
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-sm bg-muted p-2 rounded"
                    >
                      <span className="truncate max-w-[250px]">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting || submissionCount >= maxSubmissions}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {isSubmitting
            ? "Submitting..."
            : submissionCount >= maxSubmissions
              ? "Limit Reached"
              : "Submit Concern"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConcernForm;
