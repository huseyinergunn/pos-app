import { useSelector, useDispatch } from "react-redux";
import { addProduct, deleteCart, increase, decrease, reset } from "../redux/slices/cartSlice";
import { 
  selectCartItems, 
  selectCartTotal, 
  selectCartTaxAmount, 
  selectCartGrandTotal 
} from "../features/cart/cartSelectors";

export const useCart = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const taxAmount = useSelector(selectCartTaxAmount);
  const grandTotal = useSelector(selectCartGrandTotal);

  return {
    cartItems,
    total,
    taxAmount,
    grandTotal,
    addItem: (product) => dispatch(addProduct(product)),
    increaseItem: (product) => dispatch(increase(product)),
    decreaseItem: (product) => dispatch(decrease(product)),
    deleteItem: (product) => dispatch(deleteCart(product)),
    clearCart: () => dispatch(reset()),
  };
};