import { createSlice } from "@reduxjs/toolkit";

const getCartFromStorage = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : { cartItems: [] };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getCartFromStorage(),
  reducers: {
    addProduct: (state, action) => {
      const findCartItem = state.cartItems.find((item) => item._id === action.payload._id);
      if (findCartItem) {
        findCartItem.quantity += 1;
      } else {
        const { _id, title, price, img } = action.payload;
        state.cartItems.push({ _id, title, price, img, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },
    deleteCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item._id !== action.payload._id);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    increase: (state, action) => {
      const cartItem = state.cartItems.find((item) => item._id === action.payload._id);
      if (cartItem) {
        cartItem.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(state)); 
      }
    },
    decrease: (state, action) => {
      const cartItem = state.cartItems.find((item) => item._id === action.payload._id);
      if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity === 0) {
          state.cartItems = state.cartItems.filter((item) => item._id !== action.payload._id);
        }
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    reset: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart"); 
    },
  },
});

export const { addProduct, deleteCart, increase, decrease, reset } = cartSlice.actions;
export default cartSlice.reducer;