import { PackageCheckIcon, RotateCcwIcon, ShieldCheckIcon } from "@/shared/ui/icons";

export const CHECKOUT_PATH = "/checkout";

export const TRUST_MESSAGES = [
  { Icon: ShieldCheckIcon, text: "Безопасная оплата", linkToSupport: true },
  { Icon: RotateCcwIcon, text: "Возврат в течение 14 дней", linkToSupport: true },
  { Icon: PackageCheckIcon, text: "Проверка перед отправкой" },
];
