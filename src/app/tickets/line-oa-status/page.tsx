import { Suspense } from "react";
import LineOATicketStatusContent from "./content";

export default function LineOATicketStatusPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LineOATicketStatusContent />
    </Suspense>
  );
}
