import type { CheckoutAction, CheckoutState } from "./types";

export const checkoutReducer = (state: CheckoutState, action: CheckoutAction): CheckoutState => {
  switch (action.type) {
    case "contacts/change":
      return { ...state, contacts: { ...state.contacts, ...action.changes } };

    case "consent/change":
      return { ...state, consent: action.value };

    case "step/open":
      return { ...state, step: action.step };

    default:
      return state;
  }
};
