import { createSelector } from "@reduxjs/toolkit";
import { TAX_RATE } from "../../config/appConfig";

const selectCart = (state) => state.cart;

export const selectCartItems = createSelector([selectCart], (cart) => cart.cartItems);

export const selectCartGrandTotal = createSelector([selectCartItems], (items) =>
  items.reduce((acc, item) => acc + item.price * item.quantity, 0)
);


export const selectCartTotal = createSelector([selectCartGrandTotal], (grandTotal) =>
  grandTotal / (1 + TAX_RATE / 100)
);


export const selectCartTaxAmount = createSelector(
  [selectCartGrandTotal, selectCartTotal],
  (grandTotal, total) => grandTotal - total
);