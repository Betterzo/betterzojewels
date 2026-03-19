"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <Card className="border-2 border-purple-100 bg-white">
      <Skeleton className="aspect-square w-full rounded-t-xl" />
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-20 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Cart Item Skeleton
export function CartItemSkeleton() {
  return (
    <Card className="border-2 border-purple-100 bg-white">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-24 h-24 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Order Card Skeleton
export function OrderCardSkeleton() {
  return (
    <Card className="border-2 border-purple-100 bg-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
        <div className="flex justify-between pt-4 border-t border-purple-100">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-2 border-purple-100 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 h-20 rounded-t-lg">
              <Skeleton className="h-6 w-32 bg-white/20" />
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Category Header Skeleton
export function CategoryHeaderSkeleton() {
  return (
    <section className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-16 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center flex flex-col items-center">
          <Skeleton className="w-32 h-32 rounded-full mb-6 bg-white/20" />
          <Skeleton className="h-12 w-64 mb-4 bg-white/20" />
          <Skeleton className="h-6 w-96 mb-2 bg-white/20" />
        </div>
      </div>
    </section>
  );
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <Card className="border-2 border-purple-100 shadow-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 h-24 rounded-t-lg">
        <Skeleton className="h-8 w-48 bg-white/20 mx-auto" />
        <Skeleton className="h-4 w-64 bg-white/20 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-full mt-6" />
      </CardContent>
    </Card>
  );
}

// Page Skeleton with Header and Footer
export function PageSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
