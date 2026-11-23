import type { ContactsSettings } from "@/entities/contacts";
import Button from "@/shared/ui/button";
import { MapPinIcon } from "@/shared/ui/icons";
import styles from "../../style.module.scss";

type StoreLocationProps = {
  settings: ContactsSettings;
};

const StoreLocation = ({ settings }: StoreLocationProps) => {
  if (!settings.show_location) return null;

  const addressDetails = [
    { label: "Адрес", value: settings.store_address },
    { label: "Режим работы", value: settings.hours },
    { label: "Как добраться", value: settings.directions },
  ].filter(({ value }) => value);
  const mapUrl = settings.show_map ? settings.map_url : "";

  if (addressDetails.length === 0 && !mapUrl) return null;

  return (
    <div className={styles.visit}>
      {addressDetails.length > 0 && (
        <section className={styles.address}>
          {settings.location_title && <h2 className={styles.cardTitle}>{settings.location_title}</h2>}
          {addressDetails.map(({ label, value }) => (
            <div className={styles.visitItem} key={label}>
              <span className={styles.visitLabel}>{label}</span>
              <span className={styles.visitValue}>{value}</span>
            </div>
          ))}
        </section>
      )}
      {mapUrl && (
        <div className={styles.map}>
          <Button variant="outline" href={mapUrl} newTab>
            <MapPinIcon />
            Открыть карту
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoreLocation;
