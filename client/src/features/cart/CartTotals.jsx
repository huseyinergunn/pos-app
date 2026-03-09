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
    <div className="flex flex-col h-full font-sans bg-white dark:bg-[#0f172a] rounded-2xl overflow-hidden transition-colors duration-200 border border-slate-100 dark:border-slate-800 shadow-xl">
      <div className="shrink-0 px-3 py-2.5 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShoppingCartOutlined className="text-white text-[10px]" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[9px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight leading-none">
              SİPARİŞ
            </h2>
            <span className="text-[7px] text-blue-500 font-bold uppercase tracking-widest mt-0.5">
              {cartItems.length} KALEM
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg"
        >
          <CloseOutlined className="text-[10px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar min-h-0 bg-slate-50/30 dark:bg-black/10">
        {cartItems.length > 0 ? (
          [...cartItems].reverse().map((item) => (
            <div
              key={item._id}
              className="shrink-0 bg-white dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800/40 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={item.img}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200/50 dark:border-slate-700/50"
                  />
                  <button
                    onClick={() => deleteItem(item)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <DeleteOutlined style={{ fontSize: "6px" }} />
                  </button>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[9px] font-bold text-slate-800 dark:text-slate-200 uppercase truncate w-16 sm:w-20 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-black text-[9px]">
                    {item.price.toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/30 dark:border-slate-700/30 scale-90 origin-right">
                <button
                  onClick={() => decreaseItem(item)}
                  className="w-5 h-5 flex items-center justify-center rounded-md text-slate-500 hover:bg-white dark:hover:bg-slate-700 transition-all"
                >
                  <MinusOutlined style={{ fontSize: "6px" }} />
                </button>
                <span className="w-4 text-center font-black text-[9px] text-slate-800 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => addItem(item)}
                  className="w-5 h-5 flex items-center justify-center rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all"
                >
                  <PlusOutlined style={{ fontSize: "6px" }} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-slate-400 py-10">
            <ShoppingCartOutlined className="text-3xl mb-1" />
            <span className="text-[7px] font-black uppercase tracking-[0.2em]">Sepet Boş</span>
          </div>
        )}
      </div>

      <div className="shrink-0 p-3 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900/90 backdrop-blur-md">
        <div className="flex justify-between items-end mb-2.5">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
              TOPLAM TUTAR
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              {Math.floor(grandTotal).toLocaleString("tr-TR")}
              <span className="text-xs opacity-40">
                .{(grandTotal % 1).toFixed(2).split(".")[1]}₺
              </span>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="text-[8px] font-black text-red-500 hover:underline transition-colors uppercase mb-0.5"
          >
            Sıfırla
          </button>
        </div>

        <Button
          type="primary"
          block
          disabled={cartItems.length === 0 || !isLoggedIn}
          onClick={() => setIsModalOpen(true)}
          className="h-9 rounded-xl bg-blue-600 hover:bg-blue-700 font-black text-[9px] uppercase tracking-widest border-none shadow-md shadow-blue-500/20 active:scale-95 transition-transform"
        >
          {!isLoggedIn ? "OTURUM GEREKLİ" : "SİPARİŞİ ONAYLA"}
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
            .ant-drawer-content, .ant-drawer-wrapper-body { border-radius: 1rem 1rem 0 0 !important; overflow: hidden !important; }
          `,
        }}
      />
    </div>
  );
};

export default CartTotals;
