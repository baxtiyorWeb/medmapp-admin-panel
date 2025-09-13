// components/steps/DocumentUploadStep.tsx
"use client";

import React, { memo } from "react";
import UploadedFileItem from "./upload-file";
import { DocumentFile, Errors } from "./main-application-modal";

interface DocumentUploadStepProps {
  documents: DocumentFile[];
  errors: Errors;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReplaceFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

const DocumentUploadStep = memo<DocumentUploadStepProps>(
  ({ documents, errors, onFileUpload, onReplaceFile, onDeleteFile }) => (
    <div className="bg-[var(--card-background)] p-3 md:p-5 rounded-2xl shadow-sm">
      <label
        htmlFor="file-upload-input"
        className="relative bg-[var(--input-bg)] block w-full border-2 border-dashed border-[var(--border-color)] rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
      >
        <i className="bi bi-cloud-arrow-up-fill text-5xl text-primary-500"></i>
        <p className="mt-3 text-lg font-semibold text-[var(--text-color)]">
          Fayl yuklash
        </p>
        <p className="text-sm text-slate-500">
          yoki fayllarni shu yerga tashlang
        </p>
      </label>
      <input
        id="file-upload-input"
        type="file"
        className="hidden"
        multiple
        onChange={onFileUpload}
        aria-hidden="true"
      />

      <div className="mt-0 space-y-4">
        {documents.map((doc) => (
          <UploadedFileItem
            key={doc.id}
            doc={doc}
            onReplace={onReplaceFile}
            onDelete={onDeleteFile}
          />
        ))}
        {errors.documents && (
          <div className="text-red-500 text-sm mt-2" role="alert">
            {errors.documents}
          </div>
        )}
      </div>
    </div>
  )
);

DocumentUploadStep.displayName = "DocumentUploadStep";

export default DocumentUploadStep;
