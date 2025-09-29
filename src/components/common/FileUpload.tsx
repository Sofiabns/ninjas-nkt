import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fileToDataUrl } from "@/utils/validation";
import { Attachment } from "@/types";

interface FileUploadProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ attachments, onChange, multiple = true }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await fileToDataUrl(file);
      newAttachments.push({
        id: `${Date.now()}-${i}`,
        name: file.name,
        url,
        type: file.type,
      });
    }

    onChange([...attachments, ...newAttachments]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.zip"
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="w-full border-border hover:bg-secondary"
      >
        <Upload className="mr-2 h-4 w-4" />
        Adicionar Anexos
      </Button>

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center gap-2 p-2 bg-card border border-border rounded">
              {attachment.type.startsWith("image/") ? (
                <img src={attachment.url} alt={attachment.name} className="w-12 h-12 object-cover rounded" />
              ) : (
                <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center text-xs">
                  {attachment.name.split(".").pop()?.toUpperCase()}
                </div>
              )}
              <span className="flex-1 text-sm truncate">{attachment.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(attachment.id)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
