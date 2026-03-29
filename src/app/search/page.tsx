import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20" />}>
      <SearchClient />
    </Suspense>
  );
}
