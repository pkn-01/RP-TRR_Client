import { Suspense } from "react";
import LineOATicketListContent from "./content";

export default function LineOATicketListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LineOATicketListContent />
    </Suspense>
  );
}
