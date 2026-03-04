import { addProduct } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { ShoppingCartOutlined, PlusOutlined } from "@ant-design/icons"; // PlusOutlined eklendi

const ProductItem = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartItem = cartItems.find((i) => i._id === item._id);

  const handleClick = (e) => {
    e.stopPropagation();
    message.success({
      content: (
        <span className="font-bold text-slate-700">
          {cartItem ? `${item.title} miktarı artırıldı` : `${item.title} sepete eklendi`}
        </span>
      ),
      icon: <ShoppingCartOutlined className="text-blue-500" />,
      duration: 1.5,
    });
    dispatch(addProduct(item));
  };

  return (
    <div
      className="group relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-slate-800/50 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full z-10 hover:z-20 overflow-visible"
      onClick={handleClick}
    >
      <div className="relative aspect-square m-2.5 overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-slate-50/50 to-slate-200/30 dark:from-slate-800/40 dark:to-slate-900/60 flex items-center justify-center p-4">
        <img
          src={item.img}
          alt={item.title}
          className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-110 pointer-events-none drop-shadow-2xl"
        />
        
        {/* Hover ve Aktif Durumda Çıkan "+" Katmanı */}
        <div className="absolute inset-0 bg-blue-600/30 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[4px]">
            <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-500">
                <PlusOutlined className="text-2xl font-bold" />
            </div>
        </div>
        
        <div className="absolute top-3 right-3">
          <span className="text-[8px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-black uppercase tracking-tighter border border-emerald-500/10 shadow-sm">
            STOKTA
          </span>
        </div>
      </div>

      <div className="px-5 pb-5 pt-1 flex flex-col flex-1 relative">
        <div className="mb-3">
          <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.2em]">Ürün Detayı</span>
          <h3 className="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-2 mt-1">
            {item.title}
          </h3>
        </div>

        <div className="mt-auto flex items-end justify-between relative">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Fiyat</span>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              {item.price?.toLocaleString("tr-TR")}<span className="text-sm ml-0.5">₺</span>
            </span>
          </div>
          
          {cartItem && (
            <div className="absolute -right-2 -bottom-1 bg-blue-600 text-white w-8 h-8 rounded-xl flex flex-col items-center justify-center shadow-lg shadow-blue-500/40 animate-in zoom-in duration-300">
              <ShoppingCartOutlined className="text-[8px] mb-0.5" />
              <span className="text-[10px] font-black leading-none">{cartItem.quantity}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;