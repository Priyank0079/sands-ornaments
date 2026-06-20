import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import WomenHeroCarousel from "../components/women/WomenHeroCarousel";
import WomenPriceRange from "../components/women/WomenPriceRange";
import WomenProductCategories from "../components/women/WomenProductCategories";
import WomenCategoriesGrid from "../components/women/WomenCategoriesGrid";
import LazySection from "../../../components/LazySection";

// Lazy loaded below-fold components
const WomenCuratedCollections = lazy(() => import("../components/women/WomenCuratedCollections"));
const WomenOccasionCarousel = lazy(() => import("../components/women/WomenOccasionCarousel"));
const WomenPersonalisedBanner = lazy(() => import("../components/women/WomenPersonalisedBanner"));
const WomenDiscoverHue = lazy(() => import("../components/women/WomenDiscoverHue"));
const WomenPromoBanners = lazy(() => import("../components/women/WomenPromoBanners"));
const WomenFeatureBanner = lazy(() => import("../components/women/WomenFeatureBanner"));
const WomenProductsListing = lazy(() => import("../components/women/WomenProductsListing"));

import Loader from "../../shared/components/Loader";
import { usePublicCmsPage } from "../hooks/usePublicCmsPage";

const ShopForWomen = () => {
  const {
    data: sections = [],
    isLoading: isCmsLoading,
    isError,
    error,
    refetch,
  } = usePublicCmsPage("shop-women");

  useEffect(() => {
    document.title = "Shop Women's Jewellery | Sands Jewels";
  }, []);

  const sectionMap = useMemo(
    () =>
      (sections || []).reduce((acc, section) => {
        const key = section.sectionKey || section.sectionId;
        if (key) acc[key] = section;
        return acc;
      }, {}),
    [sections],
  );

  if (isCmsLoading) return <Loader />;
  if (isError) {
    return (
      <div className="bg-[#FDF5F6] min-h-screen flex items-center justify-center px-6 py-14">
        <div className="max-w-xl w-full bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400">
            Shop for Women
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-gray-900">
            Unable to load page content
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            {error?.response?.data?.message ||
              error?.message ||
              "Please try again."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#3E2723] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:opacity-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF5F6] min-h-screen text-black font-sans overflow-x-hidden">
      <WomenHeroCarousel sectionData={sectionMap["hero-banners"]} />
      <WomenPriceRange sectionData={sectionMap["price-range-showcase"]} />
      <WomenProductCategories sectionData={sectionMap["product-categories"]} />
      <WomenCategoriesGrid sectionData={sectionMap["categories-grid"]} />
      
      <Suspense fallback={<div className="h-40" />}>
        <LazySection minHeight="300px">
          <WomenCuratedCollections sectionData={sectionMap["curated-collections"]} />
        </LazySection>
        <LazySection minHeight="300px">
          <WomenOccasionCarousel sectionData={sectionMap["occasion-carousel"]} />
        </LazySection>
        <LazySection minHeight="200px">
          <WomenPersonalisedBanner sectionData={sectionMap["personalized-banner"]} />
        </LazySection>
        <LazySection minHeight="300px">
          <WomenDiscoverHue sectionData={sectionMap["discover-hue"]} />
        </LazySection>
        <LazySection minHeight="300px">
          <WomenPromoBanners sectionData={sectionMap["promo-banners"]} />
        </LazySection>
        <LazySection minHeight="300px">
          <WomenFeatureBanner />
        </LazySection>
        <LazySection minHeight="300px">
          <WomenProductsListing sectionData={sectionMap["products-listing"]} />
        </LazySection>
      </Suspense>
    </div>
  );
};

export default ShopForWomen;
