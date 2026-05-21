import { useState, useRef } from "react";
import { API_BASE } from "../services/api";

function FileUpload({ onUploadComplete, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleChange = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      if (onError) onError("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      if (onUploadComplete) {
        onUploadComplete({
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          fileType: data.fileType,
        });
      }
    } catch (err) {
      if (onError) onError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
        isDragging
          ? "border-[#6366f1] bg-[#6366f1]/10"
          : "border-[#334155] bg-[#0f172a] hover:border-[#475569]"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
      />
      
      {uploading ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-[#94a3b8]">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg className="w-8 h-8 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm font-medium text-[#f1f5f9]">
            Click or drag and drop to upload
          </p>
          <p className="text-xs text-[#64748b]">
            Images (JPG, PNG, GIF), PDF, DOC up to 10MB
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
