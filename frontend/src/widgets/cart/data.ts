import { DELIVERY_PATH, RETURNS_URL } from "@/shared/config/site";
import { PackageCheckIcon, RotateCcwIcon, ShieldCheckIcon } from "@/shared/ui/icons";

export const CHECKOUT_PATH = "/checkout";

export const TRUST_MESSAGES = [
  { Icon: ShieldCheckIcon, text: "Безопасная оплата", href: DELIVERY_PATH },
  { Icon: RotateCcwIcon, text: "Возврат в течение 14 дней", href: RETURNS_URL },
  { Icon: PackageCheckIcon, text: "Проверка перед отправкой" },
];
