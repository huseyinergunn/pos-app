import { useState } from "react";
import { Button, App } from "antd";
import { CloseOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { useCart } from "../../hooks/useCart";
import CreateBillModal from "../../components/cart/CreateBillModal";
import { TAX_RATE } from "../../config/appConfig";

const CartTotals = ({ onClose }) => {
  const { cartItems, grandTotal, addItem, decreaseItem, deleteItem, clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message, modal } = App.useApp();

  const taxDivider = 1 + TAX_RATE / 100;
  const subTotal = grandTotal / taxDivider;
  const taxAmount = grandTotal - subTotal;
  const user = JSON.parse(sessionStorage.getItem("posUser"));
  const isLoggedIn = Boolean(user?.token);

  const handleClear = () => {
    modal.confirm({
      title: "Sepeti Temizle",
      content: "Listedeki tüm ürünler silinecek. Onaylıyor musunuz?",
      okText: "Evet, Sil",
      okType: "danger",
      cancelText: "Hayır",
      centered: true,
      onOk: () => {
        clearCart();
        message.success("Sepet temizlendi.");
        onClose();
      },
    });
  };

  const handleSuccessOrder = () => {
    setIsModalOpen(false);
    onClose();
  };

  return (
    <div className="flex flex-col h-full font-sans bg-transparent rounded-t-[1.5rem] md:rounded-none overflow-hidden">
      <div className="shrink-0 px-4 py-3 md:px-6 md:py-4 pt-8 md:pt-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShoppingCartOutlined className="text-white text-sm" />
          </div>
          <div>
            <h2 className="text-[9px] md:text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">
              SİPARİŞİM
            </h2>
            <span className="text-[8px] md:text-[10px] text-blue-600 font-bold uppercase tracking-widest">
              {cartItems.length} Ürün
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-xl transition-all active:scale-90"
        >
          <CloseOutlined className="text-sm" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 no-scrollbar min-h-0">
        {cartItems.length > 0 ? (
          [...cartItems].reverse().map((item) => (
            <div
              key={item._id}
              className="shrink-0 bg-slate-50 dark:bg-slate-900/30 p-3 md:p-4 rounded-xl border border-slate-100 dark:border-slate-800/30 flex items-center justify-between group transition-all hover:bg-slate-100 dark:hover:bg-slate-900/50"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={item.img}
                    alt=""
                    className="w-10 h-10 md:w-11 md:h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    onClick={() => deleteItem(item)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                  >
                    <DeleteOutlined style={{ fontSize: "8px" }} />
                  </button>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[9px] md:text-[10px] font-black text-slate-800 dark:text-white uppercase truncate w-20 md:w-24 leading-none mb-1">
                    {item.title}
                  </h3>
                  <p className="text-blue-600 font-bold text-[10px] md:text-xs">
                    {item.price.toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => decreaseItem(item)}
                  className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <MinusOutlined style={{ fontSize: "8px" }} />
                </button>
                <span className="w-5 md:w-6 text-center font-black text-[10px] md:text-xs text-slate-800 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => addItem(item)}
                  className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition-transform active:scale-95"
                >
                  <PlusOutlined style={{ fontSize: "8px" }} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-slate-400">
            <ShoppingCartOutlined className="text-5xl md:text-6xl mb-3" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">
              SEPETİNİZ BOŞ
            </span>
          </div>
        )}
      </div>

      <div className="shrink-0 p-4 md:p-6 border-t border-slate-100 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg pb-20 md:pb-6">
        <div className="flex justify-between items-end mb-3 md:mb-4">
          <div className="space-y-1">
            <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest block">
              TOPLAM ÖDEME
            </span>
            <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              {Math.floor(grandTotal).toLocaleString("tr-TR")}
              <span className="text-sm md:text-base opacity-40">
                .{(grandTotal % 1).toFixed(2).split(".")[1]}₺
              </span>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            Temizle
          </button>
        </div>

        <Button
          type="primary"
          block
          disabled={cartItems.length === 0 || !isLoggedIn}
          onClick={() => setIsModalOpen(true)}
          className="h-12 md:h-14 rounded-xl bg-blue-600 hover:bg-blue-700 font-black text-[10px] md:text-xs uppercase tracking-widest border-none shadow-lg shadow-blue-600/20"
        >
          {!isLoggedIn ? "GİRİŞ YAPILMALI" : "SİPARİŞİ TAMAMLA"}
        </Button>
      </div>

      <CreateBillModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        cartItems={cartItems}
        total={subTotal}
        taxAmount={taxAmount}
        grandTotal={grandTotal}
        onSuccess={handleSuccessOrder}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            .ant-drawer-content { background-color: #0f172a !important; border-radius: 2rem 2rem 0 0 !important; }
            .ant-drawer-body { padding: 0 !important; }
          `,
        }}
      />
    </div>
  );
};

export default CartTotals;
