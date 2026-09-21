"use client";

import { useMemo, useState, type ReactNode } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import { Textarea } from "@/components/ui/textarea";
import {
  companySizes,
  parseProductInput,
  productCategories,
  type CompanySize,
  type Product,
  type ProductCategory,
  type ProductValues,
} from "@/features/products/schema";

type FieldErrors = Partial<Record<keyof ProductValues, string>>;

const emptyForm: ProductValues = {
  name: "",
  description: "",
  category: "SaaS",
  targetIndustries: [],
  idealCustomer: "",
  painPoints: "",
  keyFeatures: [],
  pricingNotes: "",
  idealCompanySize: "mid-market",
  keywords: [],
};

function firstError(error: z.ZodError, key: keyof ProductValues) {
  const fields = error.flatten().fieldErrors;
  const messages = fields[key as keyof typeof fields];
  return messages?.[0];
}

export function ProductForm({
  product,
  onSave,
  onDelete,
  onCancel,
}: {
  product?: Product;
  onSave: (values: ProductValues) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ProductValues>(
    product ? toValues(product) : emptyForm,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const title = product ? "Edit product" : "Add product";

  const setField = <K extends keyof ProductValues>(key: K, value: ProductValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async () => {
    const parsed = parseProductInput(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      (Object.keys(emptyForm) as (keyof ProductValues)[]).forEach((key) => {
        const message = firstError(parsed.error, key);
        if (message) {
          next[key] = message;
        }
      });
      setErrors(next);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await onSave(parsed.data);
    } finally {
      setSaving(false);
    }
  };

  const sizeLabel = useMemo(
    () =>
      ({
        startup: "Startup",
        smb: "SMB",
        "mid-market": "Mid-market",
        enterprise: "Enterprise",
        any: "Any",
      }) satisfies Record<CompanySize, string>,
    [],
  );

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Close
        </Button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <Field label="Name" htmlFor="product-name" error={errors.name}>
          <Input
            id="product-name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            autoFocus
          />
        </Field>
        <Field
          label="Description"
          htmlFor="product-description"
          error={errors.description}
        >
          <Textarea
            id="product-description"
            value={values.description}
            onChange={(event) => setField("description", event.target.value)}
            aria-invalid={Boolean(errors.description)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category" htmlFor="product-category" error={errors.category}>
            <select
              id="product-category"
              className="h-9 w-full rounded-md border border-border bg-surface-1 px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              value={values.category}
              onChange={(event) =>
                setField("category", event.target.value as ProductCategory)
              }
            >
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Ideal company size"
            htmlFor="product-size"
            error={errors.idealCompanySize}
          >
            <select
              id="product-size"
              className="h-9 w-full rounded-md border border-border bg-surface-1 px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              value={values.idealCompanySize}
              onChange={(event) =>
                setField("idealCompanySize", event.target.value as CompanySize)
              }
            >
              {companySizes.map((size) => (
                <option key={size} value={size}>
                  {sizeLabel[size]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field
          label="Target industries"
          htmlFor="product-industries"
          error={errors.targetIndustries}
        >
          <TagInput
            id="product-industries"
            value={values.targetIndustries}
            onChange={(next) => setField("targetIndustries", next)}
            aria-invalid={Boolean(errors.targetIndustries)}
          />
        </Field>
        <Field
          label="Ideal customer profile"
          htmlFor="product-icp"
          error={errors.idealCustomer}
        >
          <Textarea
            id="product-icp"
            value={values.idealCustomer}
            onChange={(event) => setField("idealCustomer", event.target.value)}
          />
        </Field>
        <Field
          label="Pain points solved"
          htmlFor="product-pain"
          error={errors.painPoints}
        >
          <Textarea
            id="product-pain"
            value={values.painPoints}
            onChange={(event) => setField("painPoints", event.target.value)}
          />
        </Field>
        <Field
          label="Key features"
          htmlFor="product-features"
          error={errors.keyFeatures}
        >
          <TagInput
            id="product-features"
            value={values.keyFeatures}
            onChange={(next) => setField("keyFeatures", next)}
          />
        </Field>
        <Field
          label="Pricing notes"
          htmlFor="product-pricing"
          error={errors.pricingNotes}
        >
          <Textarea
            id="product-pricing"
            value={values.pricingNotes}
            onChange={(event) => setField("pricingNotes", event.target.value)}
          />
        </Field>
        <Field label="Keywords" htmlFor="product-keywords" error={errors.keywords}>
          <TagInput
            id="product-keywords"
            value={values.keywords}
            onChange={(next) => setField("keywords", next)}
          />
        </Field>
      </div>
      <div className="space-y-2 border-t border-border px-4 py-3">
        {confirmDelete && onDelete ? (
          <div className="rounded-md border border-border bg-surface-1 p-3">
            <p className="text-sm text-foreground">Delete this product?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              This cannot be undone in this session.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void onDelete()}
              >
                Confirm delete
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                Keep
              </Button>
            </div>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          {product && onDelete && !confirmDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function toValues(product: Product): ProductValues {
  return {
    name: product.name,
    description: product.description,
    category: product.category,
    targetIndustries: product.targetIndustries,
    idealCustomer: product.idealCustomer,
    painPoints: product.painPoints,
    keyFeatures: product.keyFeatures,
    pricingNotes: product.pricingNotes,
    idealCompanySize: product.idealCompanySize,
    keywords: product.keywords,
  };
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  const errorId = `${htmlFor}-error`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p id={errorId} className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
