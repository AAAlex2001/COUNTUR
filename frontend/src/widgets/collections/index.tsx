import type { Collection } from "@/entities/collection";
import CollectionSection from "./ui/collection-section";

export { default as CollectionsHeading } from "./ui/heading";

type CollectionsProps = {
  collections: Collection[];
};

/** Готовые подборки: по блоку со слайдером на каждую, как «Хиты продаж». */
const Collections = ({ collections }: CollectionsProps) =>
  collections.map((collection) => (
    <CollectionSection key={collection.id} collection={collection} />
  ));

export default Collections;
