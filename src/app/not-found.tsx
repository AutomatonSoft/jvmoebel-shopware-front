import { ErrorExperience } from "@/components/storefront/error-experience";

export default function NotFound() {
  return (
    <ErrorExperience
      code="404"
      eyebrow="Seite nicht gefunden"
      title="Diese Seite ist gerade nicht auffindbar."
      description="Der Link ist möglicherweise veraltet oder die gewünschte Seite wurde verschoben. Entdecken Sie stattdessen unseren Shop oder kehren Sie zur Startseite zurück."
    />
  );
}
