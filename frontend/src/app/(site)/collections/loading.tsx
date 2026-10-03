import { CollectionsHeading } from "@/widgets/collections";
import Loader from "@/shared/ui/loader";

/** Показывается, пока сервер собирает список подборок: шапка на месте, вместо блоков лоадер. */
export default function Loading() {
  return (
    <main>
      <CollectionsHeading empty={false} />
      <Loader size="lg" />
    </main>
  );
}
