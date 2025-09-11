// components/UploadedFileItem.tsx
"use client";

import React, { memo } from "react";

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
}

interface UploadedFileItemProps {
  doc: DocumentFile;
  onReplace: (id: string) => void;
  onDelete: (id: string) => void;
}

const UploadedFileItem = memo<UploadedFileItemProps>(({ doc, onReplace, onDelete }) => (
  <div className="bg-[var(--card-background)] border border-[var(--border-color)] mt-6 rounded-xl p-4 flex items-center gap-4 shadow-sm">
    <div className="file-card-preview">
      <img
        src={doc.dataUrl}
        alt={doc.name}
        className="w-16 h-16 object-cover rounded"
      />
    </div>
    <div className="flex-grow overflow-hidden">
      <p className="font-semibold text-[var(--text-color)] truncate" title={doc.name}>
        {doc.name}
      </p>
      <p className="text-sm text-slate-500">
        {(doc.size / 1024).toFixed(1)} KB
      </p>
    </div>
    <div className="flex-shrink-0 flex items-center gap-2">
      <button
        type="button"
        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
        onClick={() => onReplace(doc.id)}
        aria-label="Faylni almashtirish"
        title="Almashtirish"
      >
        <i className="bi bi-arrow-repeat text-slate-600 dark:text-slate-300"></i>
      </button>
      <button
        type="button"
        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
        onClick={() => onDelete(doc.id)}
        aria-label="Faylni o'chirish"
        title="O'chirish"
      >
        <i className="bi bi-trash3-fill text-slate-600 dark:text-slate-300"></i>
      </button>
    </div>
  </div>
));

UploadedFileItem.displayName = "UploadedFileItem";

export default UploadedFileItem;