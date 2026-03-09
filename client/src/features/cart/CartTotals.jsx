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
    <div className="flex flex-col h-full w-full font-sans bg-white dark:bg-[#0f172a] transition-colors duration-200">
      <div className="shrink-0 px-5 py-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShoppingCartOutlined className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter leading-none">
              SİPARİŞ DETAYI
            </h2>
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1 block">
              {cartItems.length} ÜRÜN LİSTELENDİ
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
        >
          <CloseOutlined className="text-base" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-slate-50/30 dark:bg-black/10">
        {cartItems.length > 0 ? (
          [...cartItems].reverse().map((item) => (
            <div
              key={item._id}
              className="shrink-0 bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 flex items-center justify-between group transition-all hover:border-blue-500/30 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={item.img}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200/50 dark:border-slate-700/50"
                  />
                  <button
                    onClick={() => deleteItem(item)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                  >
                    <DeleteOutlined style={{ fontSize: "10px" }} />
                  </button>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase truncate w-32 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-black text-xs mt-1">
                    {item.price.toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <button
                  onClick={() => decreaseItem(item)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-none"
                >
                  <MinusOutlined style={{ fontSize: "10px" }} />
                </button>
                <span className="w-8 text-center font-black text-xs text-slate-800 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => addItem(item)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                >
                  <PlusOutlined style={{ fontSize: "10px" }} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-slate-400">
            <ShoppingCartOutlined className="text-6xl mb-4" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">SEPETİNİZ BOŞ</span>
          </div>
        )}
      </div>

      <div className="shrink-0 p-6 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900/90 backdrop-blur-md">
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              ÖDENECEK TOPLAM
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              {Math.floor(grandTotal).toLocaleString("tr-TR")}
              <span className="text-lg opacity-40">
                .{(grandTotal % 1).toFixed(2).split(".")[1]}₺
              </span>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="text-[10px] font-black text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider mb-1"
          >
            SEPETİ SIFIRLA
          </button>
        </div>

        <Button
          type="primary"
          block
          disabled={cartItems.length === 0 || !isLoggedIn}
          onClick={() => setIsModalOpen(true)}
          className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-xs uppercase tracking-[0.1em] border-none shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
        >
          {!isLoggedIn ? "LÜTFEN OTURUM AÇIN" : "SİPARİŞİ TAMAMLA"}
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
            /* Ant Design Drawer'ın tüm varsayılan stillerini öldürür */
            .ant-drawer-content, .ant-drawer-wrapper-body, .ant-drawer-body { 
              background: #fff !important; 
              padding: 0 !important;
            }
            .dark .ant-drawer-content, .dark .ant-drawer-wrapper-body, .dark .ant-drawer-body { 
              background: #0f172a !important; 
            }
            .ant-drawer-header { display: none !important; }
          `,
        }}
      />
    </div>
  );
};

export default CartTotals;
