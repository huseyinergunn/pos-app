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
    <div className="flex flex-col h-[90%] w-[94%] max-w-[400px] mx-auto my-auto font-sans bg-white dark:bg-[#0f172a] rounded-[2rem] overflow-hidden transition-colors duration-200 border border-slate-100 dark:border-slate-800 shadow-2xl">
      <div className="shrink-0 px-4 py-3 flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-500/20">
            <ShoppingCartOutlined className="text-white text-[11px]" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-none">
              SİPARİŞ
            </h2>
            <span className="text-[8px] text-blue-500 font-bold uppercase tracking-widest mt-0.5">
              {cartItems.length} KALEM
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl"
        >
          <CloseOutlined className="text-[10px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar min-h-0 bg-transparent">
        {cartItems.length > 0 ? (
          [...cartItems].reverse().map((item) => (
            <div
              key={item._id}
              className="shrink-0 bg-white dark:bg-slate-900/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/40 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={item.img}
                    alt=""
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200/50 dark:border-slate-700/50"
                  />
                  <button
                    onClick={() => deleteItem(item)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <DeleteOutlined style={{ fontSize: "7px" }} />
                  </button>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase truncate w-20 sm:w-28 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-black text-[10px]">
                    {item.price.toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/30 dark:border-slate-700/30">
                <button
                  onClick={() => decreaseItem(item)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-700 transition-all"
                >
                  <MinusOutlined style={{ fontSize: "7px" }} />
                </button>
                <span className="w-5 text-center font-black text-[10px] text-slate-800 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => addItem(item)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all"
                >
                  <PlusOutlined style={{ fontSize: "7px" }} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-slate-400 py-10">
            <ShoppingCartOutlined className="text-4xl mb-2" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Sepet Boş</span>
          </div>
        )}
      </div>

      <div className="shrink-0 p-4 border-t border-slate-50 dark:border-slate-800/50 bg-white dark:bg-slate-900">
        <div className="flex justify-between items-end mb-3">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
              TOPLAM TUTAR
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
            className="text-[9px] font-black text-red-500 hover:underline transition-colors uppercase mb-0.5"
          >
            Sıfırla
          </button>
        </div>

        <Button
          type="primary"
          block
          disabled={cartItems.length === 0 || !isLoggedIn}
          onClick={() => setIsModalOpen(true)}
          className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-[10px] uppercase tracking-widest border-none shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
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
            /* Drawer'ın arkasındaki o gri/şeffaf kutuyu tamamen yok eder */
            .ant-drawer-content, .ant-drawer-wrapper-body, .ant-drawer-body { 
              background: transparent !important; 
              padding: 0 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .ant-drawer-mask { backdrop-blur: 4px; }
          `,
        }}
      />
    </div>
  );
};

export default CartTotals;
