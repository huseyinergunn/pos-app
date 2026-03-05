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
  const user = JSON.parse(localStorage.getItem("posUser"));
  const isLoggedIn = Boolean(user?.token);

  const handleClear = () => {
    modal.confirm({
      title: "Sepeti Temizle",
      content: "Listedeki tüm ürünler silinecek. Onaylıyor musunuz?",
      okText: "Evet, Sil",
      okType: "danger",
      cancelText: "Hayır",
      cancelType: "default",
      centered: true,
      onOk: () => {
        clearCart();
        message.success("Sepet temizlendi.");
         onClose();
      },
    });
  };

  return (
    <div className="flex flex-col h-full font-sans p-2 md:p-4 pt-16 md:pt-4 pb-20 md:pb-6">
      <div className="flex flex-col h-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#0f172a] shadow-xl border border-black/5 dark:border-white/10">

        <div className="shrink-0 px-6 py-4 md:py-6 flex justify-between items-center border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingCartOutlined className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-[10px] md:text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight">
                SİPARİŞİM
              </h2>
              <span className="text-[9px] md:text-[10px] text-blue-600 font-bold uppercase tracking-widest">
                {cartItems.length} Ürün
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:text-red-500 rounded-xl transition"
          >
            <CloseOutlined />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 no-scrollbar min-h-0">
          {cartItems.length > 0 ? (
            [...cartItems].reverse().map((item) => (
              <div
                key={item._id}
                className="shrink-0 bg-gray-50 dark:bg-[#1e293b] p-3 md:p-4 rounded-2xl border border-black/5 dark:border-white/10 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative">
                    <img
                      src={item.img}
                      alt=""
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover border"
                    />
                    <button
                      onClick={() => deleteItem(item)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg scale-0 group-hover:scale-100 transition"
                    >
                      <DeleteOutlined style={{ fontSize: "8px" }} />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[10px] md:text-[11px] font-black text-gray-800 dark:text-white uppercase truncate w-20 md:w-28 leading-none mb-1">
                      {item.title}
                    </h3>
                    <p className="text-blue-600 font-bold text-[10px] md:text-xs">
                      {item.price.toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-gray-200 dark:bg-black/40 p-1 rounded-xl">
                  <button
                    onClick={() => decreaseItem(item)}
                    className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-300 hover:bg-white/30"
                  >
                    <MinusOutlined style={{ fontSize: "8px" }} />
                  </button>
                  <span className="w-6 md:w-8 text-center font-black text-[10px] md:text-xs text-gray-800 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-xl bg-blue-600 text-white"
                  >
                    <PlusOutlined style={{ fontSize: "8px" }} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-gray-400">
              <ShoppingCartOutlined className="text-6xl mb-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                SEPETİNİZ BOŞ
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0 p-5 md:p-8 border-t border-black/5 dark:border-white/10 bg-white dark:bg-[#0f172a]">
          <div className="flex justify-between items-end mb-4 md:mb-6">
            <div className="space-y-1">
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                ÖDENECEK
              </span>
              <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                {Math.floor(grandTotal).toLocaleString("tr-TR")}
                <span className="text-base md:text-lg opacity-40">
                  .{(grandTotal % 1).toFixed(2).split(".")[1]}₺
                </span>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="text-[9px] md:text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 mb-1"
            >
              Temizle
            </button>
          </div>

          <Button
            type="primary"
            block
            disabled={cartItems.length === 0 || !isLoggedIn}
            onClick={() => setIsModalOpen(true)}
            className="h-14 md:h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-[10px] md:text-xs uppercase tracking-widest border-none"
          >
            {!isLoggedIn ? "GİRİŞ YAPILMALI" : "SİPARİŞİ TAMAMLA"}
          </Button>
        </div>
      </div>

      <CreateBillModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        cartItems={cartItems}
        total={subTotal}
        taxAmount={taxAmount}
        grandTotal={grandTotal}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            .ant-drawer-body { background: transparent !important; padding: 0 !important; }
            .ant-drawer-content { background: transparent !important; }
            .ant-drawer-wrapper-body { background: transparent !important; }
          `,
        }}
      />
    </div>
  );
};

export default CartTotals;