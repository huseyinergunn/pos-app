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
    <div className="flex flex-col h-full font-sans bg-white dark:bg-[#0f172a] rounded-t-2xl md:rounded-none overflow-hidden transition-colors duration-200">
      <div className="shrink-0 px-4 py-3 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/20">
            <ShoppingCartOutlined className="text-white text-xs" />
          </div>
          <div>
            <h2 className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight leading-none">
              Sipariş
            </h2>
            <span className="text-[8px] text-blue-500 font-bold uppercase tracking-widest leading-none">
              {cartItems.length} Kalem
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <CloseOutlined className="text-sm" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar min-h-0 bg-slate-50/50 dark:bg-black/20">
        {cartItems.length > 0 ? (
          [...cartItems].reverse().map((item) => (
            <div
              key={item._id}
              className="shrink-0 bg-white dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={item.img}
                    alt=""
                    className="w-9 h-9 rounded-lg object-cover border border-slate-200/50 dark:border-slate-700/50"
                  />
                  <button
                    onClick={() => deleteItem(item)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <DeleteOutlined style={{ fontSize: "7px" }} />
                  </button>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase truncate w-20 sm:w-24 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-black text-[10px]">
                    {item.price.toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <button
                  onClick={() => decreaseItem(item)}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all"
                >
                  <MinusOutlined style={{ fontSize: "7px" }} />
                </button>
                <span className="w-5 text-center font-black text-[10px] text-slate-800 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => addItem(item)}
                  className="w-6 h-6 flex items-center justify-center rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all"
                >
                  <PlusOutlined style={{ fontSize: "7px" }} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-slate-400">
            <ShoppingCartOutlined className="text-4xl mb-2" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Sepet Boş</span>
          </div>
        )}
      </div>

      <div className="shrink-0 p-4 border-t border-slate-100 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md pb-6 md:pb-4">
        <div className="flex justify-between items-end mb-3">
          <div>
            <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">
              Toplam
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              {Math.floor(grandTotal).toLocaleString("tr-TR")}
              <span className="text-sm opacity-40">
                .{(grandTotal % 1).toFixed(2).split(".")[1]}₺
              </span>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="text-[9px] font-black text-red-500 hover:text-red-600 transition-colors uppercase"
          >
            Sıfırla
          </button>
        </div>

        <Button
          type="primary"
          block
          disabled={cartItems.length === 0 || !isLoggedIn}
          onClick={() => setIsModalOpen(true)}
          className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-black text-[10px] uppercase tracking-widest border-none shadow-md shadow-blue-500/20 active:scale-[0.98] transition-transform"
        >
          {!isLoggedIn ? "Oturum Açılmalı" : "Siparişi Onayla"}
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
            .ant-drawer-content { background-color: transparent !important; }
            .ant-drawer-body { padding: 0 !important; }
          `,
        }}
      />
    </div>
  );
};

export default CartTotals;
