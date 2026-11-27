import type { Collection } from "@/entities/collection";
import type { ProductActions } from "@/entities/product";
import CollectionSection from "./ui/collection-section";

export { default as CollectionsHeading } from "./ui/heading";

type CollectionsProps = {
  collections: Collection[];
  actions: ProductActions;
};

/** Показать готовые подборки. */
const Collections = ({ collections, actions }: CollectionsProps) =>
  collections.map((collection) => (
    <CollectionSection key={collection.id} collection={collection} actions={actions} />
  ));

export default Collections;
