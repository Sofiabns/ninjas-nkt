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

    try {
      new URL(trimmedUrl);
    } catch {
      console.warn('URL may not be valid:', trimmedUrl);
    }

    const lower = trimmedUrl.toLowerCase();
    const extMatch = lower.match(/\.([a-z0-9]+)(?:\?|#|$)/);
    const ext = extMatch ? extMatch[1] : '';

    const imageExts = ['jpg','jpeg','png','gif','webp','svg','bmp','tiff'];
    const docExts = ['pdf','doc','docx','xls','xlsx','ppt','pptx','csv','txt'];

    let type = 'application/url';
    if (imageExts.includes(ext) || lower.includes('imgur.com') || lower.includes('cdn.') || lower.startsWith('data:image/') || lower.includes('googleusercontent.com') || lower.includes('githubusercontent.com')) {
      type = 'image/url';
    } else if (docExts.includes(ext)) {
      if (ext === 'pdf') type = 'application/pdf';
      else if (['doc','docx'].includes(ext)) type = 'application/msword';
      else if (['xls','xlsx'].includes(ext)) type = 'application/vnd.ms-excel';
      else if (['ppt','pptx'].includes(ext)) type = 'application/vnd.ms-powerpoint';
      else type = 'application/octet-stream';
    }

    onChange([
      ...attachments,
      {
        id: `url-${Date.now()}`,
        name: trimmedUrl.split('/').pop() || 'URL',
        url: trimmedUrl,
        type,
      },
    ]);
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
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
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
          placeholder="Ou cole uma URL (imagem ou arquivo)..."
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
                title="Baixar"
              >
                <Download className="h-4 w-4" />
              </Button>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-secondary"
                title="Abrir"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M5 12v7a2 2 0 0 0 2 2h7"/></svg>
              </a>
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
