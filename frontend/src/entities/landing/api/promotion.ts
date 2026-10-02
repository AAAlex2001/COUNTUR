import { load } from "@/shared/api/server";
import type { Promotion } from "../model/types";

/** Рекламный блок главной или null, если он не заполнен или скрыт в админке. */
export const getPromotion = (): Promise<Promotion | null> => load("/v1/landing/promotion", null);
