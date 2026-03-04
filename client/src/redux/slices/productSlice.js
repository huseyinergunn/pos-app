import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  search: "",
  category: "Tümü", 
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCategory: (state, action) => { 
      state.category = action.payload;
    },
  },
});

export const { setProducts, setSearch, setCategory } = productSlice.actions;
export default productSlice.reducer;