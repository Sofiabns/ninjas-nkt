import React, { useRef, useState } from "react";
import { Upload, X, Download, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fileToDataUrl } from "@/utils/validation";
import { Attachment } from "@/types";

interface FileUploadProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  multiple?: boolean;
  allowUrl?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ attachments, onChange, multiple = true, allowUrl = true }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");

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

  const handleAddUrl = () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) return;
    
    // Check if it's a valid URL
    try {
      new URL(trimmedUrl);
    } catch {
      // If not a valid URL, still allow it but warn
      console.warn('URL may not be valid:', trimmedUrl);
    }
    
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmedUrl) || 
                    trimmedUrl.includes('imgur.com') || 
                    trimmedUrl.includes('cdn.') ||
                    trimmedUrl.startsWith('data:image/');
    
    onChange([...attachments, {
      id: `url-${Date.now()}`,
      name: trimmedUrl.split('/').pop() || 'URL Attachment',
      url: trimmedUrl,
      type: isImage ? 'image/url' : 'application/url',
    }]);
    setUrlInput("");
  };

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="flex-1 border-border hover:bg-secondary"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Arquivo
        </Button>
        {allowUrl && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddUrl}
            className="border-border hover:bg-secondary"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {allowUrl && (
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Ou cole uma URL de imagem..."
          className="bg-input border-border"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
        />
      )}

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
                onClick={() => handleDownload(attachment)}
                className="h-8 w-8"
              >
                <Download className="h-4 w-4" />
              </Button>
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
