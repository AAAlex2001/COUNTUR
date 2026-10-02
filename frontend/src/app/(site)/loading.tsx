import Loader from "@/shared/ui/loader";

/** Показывается, пока сервер собирает страницу. */
export default function Loading() {
  return (
    <main>
      <Loader size="lg" />
    </main>
  );
}
