import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/slices/cartSlice";
import productReducer from "../redux/slices/productSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
  },
});

export default store;