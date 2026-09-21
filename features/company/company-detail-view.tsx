"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Sparkles,
  Building2,
  FileText,
} from "lucide-react";
import type { Company } from "./schema";
import type { CompanyMatch } from "@/features/matching/schema";
import { PhotoGallery } from "./photo-gallery";

type CompanyDetailViewProps = {
  company: Company;
  match: CompanyMatch;
  onBackToPriorities: () => void;
};

export function CompanyDetailView({
  company,
  match,
  onBackToPriorities,
}: CompanyDetailViewProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyCallBrief = () => {
    const briefText = `CALL BRIEF: ${company.name}\n\nOPENING LINE:\n${match.callBrief.openingLine}\n\nTALKING POINTS:\n- ${match.callBrief.talkingPoints.join("\n- ")}\n\nOBJECTION HANDLING:\nObjection: ${match.callBrief.likelyObjection}\nReply: ${match.callBrief.objectionReply}`;
    copyToClipboard(briefText, "callBrief");
  };

  const [lng, lat] = company.coordinates;
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <aside className="fixed bottom-0 right-0 top-0 z-40 flex w-full max-w-md flex-col border-l border-border bg-surface-2/95 shadow-2xl backdrop-blur-xl transition-all sm:w-96 max-sm:h-[85vh] max-sm:top-auto max-sm:rounded-t-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
        <button
          onClick={onBackToPriorities}
          className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface-1/80 px-2.5 py-1.5 font-mono text-xs font-medium text-muted-foreground transition-colors hover:border-cyan-500/40 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-cyan-400" />
          <span>Priorities</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
              match.tier === "High"
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : match.tier === "Mid"
                ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border border-slate-500/30 bg-slate-500/10 text-slate-400"
            }`}
          >
            {match.tier} Tier
          </span>
          <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-xs font-bold text-cyan-400">
            {match.score}% Score
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {company.name}
          </h2>
          <p className="font-mono text-xs text-cyan-400">{company.industry}</p>
        </div>

        {/* Location Section */}
        <div className="space-y-2 rounded-xl border border-border/70 bg-surface-1/50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3 text-cyan-400" /> Location
            </span>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] text-cyan-400 hover:underline"
            >
              Open in Google Maps
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <p className="text-xs text-foreground font-medium">{company.hub}</p>
          <p className="text-[11px] text-muted-foreground">{company.address}</p>

          <div className="mt-2 flex items-center justify-between rounded-lg bg-surface-2 p-2 font-mono text-[11px] text-muted-foreground">
            <span>Coordinates: [{lng}, {lat}]</span>
            <button
              onClick={() => copyToClipboard(`[${lng}, ${lat}]`, "coords")}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
            >
              {copiedField === "coords" ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        <PhotoGallery companyName={company.name} industry={company.industry} />

        {/* Why this fits */}
        <div className="space-y-3 rounded-xl border border-cyan-500/30 bg-surface-1/40 p-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <h3 className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Why This Fits
            </h3>
            <span className="rounded bg-surface-1 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
              Sample Data
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Fit Reasoning</p>
              <p className="text-foreground mt-0.5">{match.fitReasoning}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Pitch Angle</p>
              <p className="text-foreground mt-0.5">{match.pitchAngle}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Likely Pain Point</p>
              <p className="text-foreground mt-0.5">{match.likelyPainPoint}</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="space-y-2 rounded-xl border border-border/70 bg-surface-1/50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-cyan-400" /> About Company
            </h3>
            <span className="rounded bg-surface-1 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
              Sample Data
            </span>
          </div>

          <p className="text-xs text-muted-foreground">{match.aboutSummary}</p>

          <div className="mt-2 grid grid-cols-2 gap-2 pt-2 border-t border-border/50 font-mono text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground">Headcount</span>
              <p className="font-semibold text-foreground">{company.employeeCount} employees</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground">Est Revenue</span>
              <p className="font-semibold text-foreground">{company.revenueEst}</p>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="space-y-3 rounded-xl border border-border/70 bg-surface-1/50 p-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <h3 className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-cyan-400" /> Prospect Contact Card
            </h3>
            <span className="rounded bg-surface-1 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
              Sample Data
            </span>
          </div>

          <div className="space-y-2.5">
            <div>
              <p className="text-xs font-bold text-foreground">{match.contact.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{match.contact.title}</p>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between rounded-lg bg-surface-2 p-2 font-mono text-xs">
              <a href={`tel:${match.contact.phone}`} className="flex items-center gap-2 text-cyan-400 hover:underline">
                <Phone className="h-3.5 w-3.5" />
                <span>{match.contact.phone}</span>
              </a>
              <button
                onClick={() => copyToClipboard(match.contact.phone, "phone")}
                className="text-muted-foreground hover:text-foreground"
              >
                {copiedField === "phone" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between rounded-lg bg-surface-2 p-2 font-mono text-xs">
              <a href={`mailto:${match.contact.email}`} className="flex items-center gap-2 text-cyan-400 hover:underline truncate mr-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{match.contact.email}</span>
              </a>
              <button
                onClick={() => copyToClipboard(match.contact.email, "email")}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                {copiedField === "email" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Website */}
            <div className="flex items-center justify-between rounded-lg bg-surface-2 p-2 font-mono text-xs">
              <a href={match.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyan-400 hover:underline truncate mr-2">
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{match.contact.website}</span>
              </a>
              <button
                onClick={() => copyToClipboard(match.contact.website, "website")}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                {copiedField === "website" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* AI Call Brief */}
        <div className="space-y-3 rounded-xl border border-cyan-500/30 bg-surface-1/40 p-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <h3 className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-cyan-400" /> AI Cold Call Brief
            </h3>
            <button
              onClick={copyCallBrief}
              className="flex items-center gap-1 rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-400 hover:bg-cyan-500/20"
            >
              {copiedField === "callBrief" ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span>Brief Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Brief</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Opening Line</p>
              <p className="text-foreground mt-0.5 bg-surface-2/60 p-2 rounded-lg italic">
                &ldquo;{match.callBrief.openingLine}&rdquo;
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Key Talking Points</p>
              <ul className="mt-1 space-y-1 text-muted-foreground list-disc list-inside">
                {match.callBrief.talkingPoints.map((tp, idx) => (
                  <li key={idx} className="text-foreground">{tp}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Likely Objection & Reply</p>
              <div className="mt-1 space-y-1 rounded-lg bg-surface-2/60 p-2">
                <p className="text-amber-400 font-medium">Objection: {match.callBrief.likelyObjection}</p>
                <p className="text-foreground">Reply: {match.callBrief.objectionReply}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
