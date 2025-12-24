import { Suspense } from "react";
import CreateLineOAContent from "./content";

export default function CreateLineOAPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateLineOAContent />
    </Suspense>
  );
}
