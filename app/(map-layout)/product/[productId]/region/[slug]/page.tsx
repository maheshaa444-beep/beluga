import { notFound } from "next/navigation";
import { getProductRepository } from "@/features/products/memory-repository";
import { getRegionRepository } from "@/features/regions/memory-repository";
import { getCompanyRepository } from "@/features/company/memory-repository";
import { getMatchRepository } from "@/features/matching/memory-repository";
import { RegionWorkspaceView } from "@/features/company/region-workspace-view";

type PageProps = {
  params: Promise<{
    productId: string;
    slug: string;
  }>;
};

export default async function RegionWorkspacePage({ params }: PageProps) {
  const { productId, slug } = await params;

  const productRepo = getProductRepository();
  const regionRepo = getRegionRepository();
  const companyRepo = getCompanyRepository();
  const matchRepo = getMatchRepository();

  const product = await productRepo.get(productId);
  const region = await regionRepo.getBySlug(slug);

  if (!product || !region) {
    notFound();
  }

  const allProducts = await productRepo.list();
  const companies = await companyRepo.getCompaniesForRegion(region.id);
  const matches = await matchRepo.getMatchesForProductAndRegion(
    product.id,
    region.id,
    companies
  );

  return (
    <RegionWorkspaceView
      product={product}
      allProducts={allProducts}
      region={region}
      companies={companies}
      matches={matches}
    />
  );
}
