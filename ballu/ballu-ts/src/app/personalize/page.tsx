"use client";

import React, { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cormorant_Garamond, Cormorant_SC, Tenor_Sans } from "next/font/google";
import { FiStar, FiX, FiCheck } from "react-icons/fi";
import Button from "@/components/ui/Button";

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: ["400"],
});

export default function CommissionPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [pieceType, setPieceType] = useState("");
  const [customPieceType, setCustomPieceType] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [budget, setBudget] = useState(500000);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: cats = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const r = await fetch('/api/categories');
      return r.ok ? r.json() : [];
    },
  });

  const { data: mats = [] } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const r = await fetch('/api/materials');
      return r.ok ? r.json() : [];
    },
  });

  const { data: items = [] } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const r = await fetch('/api/items');
      return r.ok ? r.json() : [];
    },
  });

  if (cats.length > 0 && !selectedCategory) setSelectedCategory(cats[0]._id);
  if (mats.length > 0 && !selectedMaterial) setSelectedMaterial(mats[0]._id);

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  const uploadFiles = useCallback(async (files: File[]) => {
    setError("");
    setUploading(true);
    try {
      const remaining = 3 - images.length;
      const toUpload = files.filter((f) => f.type.startsWith("image/")).slice(0, remaining);
      if (toUpload.length === 0) return;
      const tooLarge = toUpload.find((f) => f.size > MAX_IMAGE_SIZE);
      if (tooLarge) {
        setError(`Image "${tooLarge.name}" exceeds 2MB limit. Please use a smaller image.`);
        return;
      }
      const urls: string[] = [];
      for (const file of toUpload) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsDataURL(file);
        });
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64 }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: "Upload failed" }));
          throw new Error(errData.error || "Upload failed");
        }
        const data = await res.json();
        urls.push(data.url);
      }
      setImages((prev) => [...prev, ...urls].slice(0, 3));
    } catch (e: any) {
      setError(e.message || "Something went wrong while uploading. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [images.length]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const remaining = 3 - images.length;
    if (remaining <= 0) return;
    const toUpload = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (toUpload.length === 0) return;
    uploadFiles(toUpload);
  }, [images.length, uploadFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !selectedCategory) {
      setError("Please fill in your name and phone number.");
      return;
    }
    const finalPieceType = pieceType === "other" ? customPieceType.trim() : pieceType;
    if (!finalPieceType) {
      setError("Please select or enter a piece type.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name.trim(),
          phoneNumber: phone.trim(),
          category: selectedCategory,
          material: selectedMaterial || undefined,
          pieceType: finalPieceType,
          budgetNrs: budget,
          description: description.trim() || undefined,
          images,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(errData.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bj-bg text-bj-text-alt p-6">
        <FiCheck className="text-[#cda274] mb-6" size={48} />
        <h1 className={`${cormorant.className} text-3xl text-bj-text-heading mb-3`}>Thank you</h1>
        <p className={`${tenorSans.className} text-xs tracking-widest text-bj-text-muted uppercase text-center max-w-md`}>
          Your commission request has been received. We will reach out within two working days.
        </p>
      </div>
    );
  }

  const formattedBudget = new Intl.NumberFormat("en-IN").format(budget);
  const minBudget = 50000;
  const maxBudget = 2000000;
  const sliderFillPercentage = ((budget - minBudget) / (maxBudget - minBudget)) * 100;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bj-bg text-bj-text-alt antialiased">
      <div className="w-full md:w-[45%] lg:w-[40%] relative flex flex-col justify-end p-6 sm:p-10 md:p-16 overflow-hidden min-h-[360px] sm:min-h-[450px] md:min-h-screen bg-[radial-gradient(circle_at_35%_35%,_#fbe4b5_0%,_#cda274_20%,_#6e5229_45%,_#16110a_100%)] shadow-[inset_0_-20px_40px_rgba(0,0,0,0.6)] md:shadow-[inset_-20px_0_40px_rgba(0,0,0,0.5)] border-b md:border-b-0 md:border-r border-bj-border-light">
        <div className="absolute top-[35%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] rounded-full border border-white/10 pointer-events-none"></div>
        <div className="absolute top-[35%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full border border-white/5 pointer-events-none"></div>
        <div className="absolute top-[35%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full border border-white/[0.02] pointer-events-none"></div>

        <div className="relative z-10 max-w-sm mt-auto pb-2">
          <FiStar className="text-[#cda274] mb-4 md:mb-6 opacity-80" size={16} />
          <h1 className={`${cormorant.className} text-[42px] sm:text-[56px] lg:text-[72px] leading-[1.1] md:leading-[1.05] text-bj-text-heading tracking-tight mb-2 font-light`}>
            Commission<br />a piece.
          </h1>
          <p className="italic font-serif text-[16px] sm:text-[18px] text-bj-text-body opacity-80 mb-4 md:mb-8 tracking-wide">
            विशेष अर्डर
          </p>
          <p className={`${tenorSans.className} text-[12px] sm:text-[13px] text-bj-text-gold opacity-70 leading-[1.6] md:leading-[1.7]`}>
            No template. Our karigar drafts a sketch within two working days. Pay only on approval.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-bj-bg-card to-transparent pointer-events-none" />
      </div>

      <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col justify-center px-4 py-10 sm:px-10 md:px-16 lg:px-24">
        <div className="max-w-2xl w-full mx-auto">
          <div className={`${tenorSans.className} flex justify-between items-center text-[9px] tracking-[0.3em] uppercase text-[#cda274] mb-4`}>
            <span className=" pieces-count">Step 01 of 02</span>
            <span className="opacity-60 pieces-count">Ref. BJ-2026-0148</span>
          </div>

          <h2 className={`${cormorant.className} text-[32px] sm:text-[40px] text-bj-text-heading font-light mb-8 md:mb-12`}>
            What shall we make?
          </h2>

          <div className="space-y-8 md:space-y-12">
            <div>
              <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase pieces-count mb-3`}>
                Type of Piece
              </label>
              <select
                value={pieceType}
                onChange={(e) => setPieceType(e.target.value)}
                className={`${tenorSans.className} w-full bg-bj-bg border border-bj-border px-3 py-2.5 text-sm text-bj-text-gold focus:outline-none focus:border-[#cda274] transition-colors rounded-none appearance-none cursor-pointer`}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238e897e' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                <option value="" disabled className="bg-bj-bg">Select a piece type</option>
                {items.map((item: any) => (
                  <option key={item._id} value={item.name?.en || ''} className="bg-bj-bg">{item.name?.en || 'Untitled'}</option>
                ))}
                <option value="other" className="bg-bj-bg">Other (custom)</option>
              </select>
              {pieceType === "other" && (
                <input
                  type="text"
                  value={customPieceType}
                  onChange={(e) => setCustomPieceType(e.target.value)}
                  placeholder="Describe the piece you want..."
                  className={`${cormorant.className} w-full bg-transparent border-b border-bj-border py-2.5 mt-3 text-base sm:text-lg text-bj-text-gold placeholder:text-bj-text-placeholder placeholder:italic focus:outline-none focus:border-[#cda274] transition-colors rounded-none`}
                />
              )}
            </div>

            <div>
              <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase pieces-count mb-3`}>
                Material
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {mats.map((mat: any) => (
                  <button
                    key={mat._id}
                    onClick={() => setSelectedMaterial(mat._id)}
                    className={`${tenorSans.className} px-3 py-2 sm:px-4 sm:py-2.5 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                      selectedMaterial === mat._id
                        ? "border-[#cda274] text-[#cda274] bg-[#cda274]/5"
                        : "border-bj-border text-bj-text-muted hover:bg-bj-bg-hover hover:text-bj-text-gold"
                    }`}
                  >
                    {mat.name?.en || "Material"}
                  </button>
                ))}
                {mats.length === 0 && (
                  <span className={`${tenorSans.className} text-[10px] text-bj-text-dim`}>Loading materials...</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-3 sm:mb-4">
                <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase text-bj-text-muted`}>
                  Budget
                </label>
                <div className={`${cormorant.className} text-xl sm:text-2xl text-[#cda274] tracking-wide`}>
                  Rs <span className="text-[22px] sm:text-[26px]">{formattedBudget}</span>
                </div>
              </div>
              
              <style>{`
                .bj-range::-webkit-slider-thumb {
                  -webkit-appearance: none; appearance: none;
                  width: 20px; height: 20px; border-radius: 9999px;
                  background: #fbe4b5; box-shadow: 0 0 10px rgba(205,162,116,0.5);
                  cursor: pointer;
                }
                .bj-range::-moz-range-thumb {
                  width: 20px; height: 20px; border-radius: 9999px;
                  border: none; background: #fbe4b5; cursor: pointer;
                }
              `}</style>
              <div className="relative w-full h-8 flex items-center">
                <input
                  type="range"
                  min={minBudget}
                  max={maxBudget}
                  step={10000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="bj-range absolute w-full appearance-none bg-transparent cursor-pointer z-20"
                />
                <div 
                  className="absolute w-full h-[3px] rounded-full z-10 pointer-events-none"
                  style={{
                    background: `linear-gradient(to right, #cda274 0%, #cda274 ${sliderFillPercentage}%, #2b2415 ${sliderFillPercentage}%, #2b2415 100%)`
                  }}
                />
              </div>
            </div>

            <div>
              <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase text-bj-text-muted mb-1`}>
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="So we know who to call"
                className={`${cormorant.className} w-full bg-transparent border-b border-bj-border py-2.5 text-base sm:text-lg text-bj-text-gold placeholder:text-bj-text-placeholder placeholder:italic focus:outline-none focus:border-[#cda274] transition-colors rounded-none`}
              />
            </div>

            <div>
              <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase text-bj-text-muted mb-1`}>
                Whatsapp / Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977 98..."
                className={`${cormorant.className} w-full bg-transparent border-b border-bj-border py-2.5 text-base sm:text-lg text-bj-text-gold placeholder:text-bj-text-placeholder placeholder:italic focus:outline-none focus:border-[#cda274] transition-colors rounded-none`}
              />
            </div>

            <div>
              <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase text-bj-text-muted mb-1`}>
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you have in mind..."
                rows={3}
                className={`${cormorant.className} w-full bg-transparent border-b border-bj-border py-2.5 text-base sm:text-lg text-bj-text-gold placeholder:text-bj-text-placeholder placeholder:italic focus:outline-none focus:border-[#cda274] transition-colors rounded-none resize-none`}
              />
            </div>

            <div>
              <label className={`${tenorSans.className} block text-[9px] tracking-[0.3em] uppercase text-bj-text-muted mb-3`}>
                Reference Images (Optional) · {images.length}/3
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {images.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-sm overflow-hidden border border-bj-border bg-bj-bg group">
                      <img src={src} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-bj-bg-ticker/70 text-bj-text-heading flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-bj-bg-ticker/90"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length < 3 && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    w-full border-2 border-dashed rounded-sm py-8 sm:py-10
                    flex items-center justify-center cursor-pointer
                    transition-all duration-300 bg-bj-bg px-4 text-center
                    ${isDragOver ? 'border-[#cda274] bg-[#cda274]/5' : 'border-bj-border hover:border-bj-gold-alt'}
                  `}
                >
                  <span className={`${tenorSans.className} text-[10px] sm:text-[11px] text-bj-text-muted transition-colors ${isDragOver ? 'text-[#cda274]' : ''}`}>
                    {uploading ? 'Uploading…' : isDragOver ? 'Drop your image here' : `${images.length === 0 ? 'Drop Image here - or click to upload' : `Add up to ${3 - images.length} more`}`}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className={`${tenorSans.className} text-[10px] tracking-widest text-red-400 mt-4`}>{error}</p>
          )}

          <div className="mt-10 md:mt-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-bj-border-light pt-8 md:pt-10">
            <span className={`${tenorSans.className} text-[8px] tracking-[0.4em] uppercase text-bj-text-dim text-center sm:text-left`}>
              No Obligation · No Advance
            </span>
            
            <Button
              variant="magnetic"
              size="md"
              magnetic
              className="w-full sm:w-auto py-4 px-7 justify-center text-[10px]"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "SUBMITTING..." : "CONTINUE"} <span>→</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
