'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { cigaretteProducts } from '@/lib/products';
import { Trash2, Plus, Download } from 'lucide-react';

interface CartItem {
  id: number;
  product: string;
  price: number;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export default function Home() {
  // Estados (como variables que cambian)
  const [buyerName, setBuyerName] = useState('');
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [unitPrice, setUnitPrice] = useState(''); // <-- nuevo
  const [quantity, setQuantity] = useState('1');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [alert, setAlert] = useState<{ title: string; message: string; type: 'error' | 'success' } | null>(null);

  // Mostrar alerta
  const showAlert = (title: string, message: string, type: 'error' | 'success') => {
    setAlert({ title, message, type });
  };

  // Agregar producto al carrito
  const addProduct = () => {
    if (!buyerName.trim()) {
      showAlert("Error", "Por favor ingresa el nombre del comprador", "error");
      return;
    }
    if (!product) {
      showAlert("Error", "Selecciona un producto", "error");
      return;
    }
    if (!price || Number(price) <= 0) {
      showAlert("Error", "Ingresa un precio válido", "error");
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      showAlert("Error", "Ingresa una cantidad válida", "error");
      return;
    }

    const newItem: CartItem = {
      id: Date.now(),
      product,
      price: Number(price),
      unitPrice: Number(unitPrice),
      quantity: Number(quantity),
      subtotal: Number(price) * Number(quantity)
    };

    setCart([...cart, newItem]);
    setProduct('');
    setPrice('');
    setQuantity('1');
  };

  // Eliminar producto
  const removeProduct = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calcular total
  const total = cart.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2);

  // Generar PDF
  const generatePDF = () => {
    if (!buyerName.trim()) {
      showAlert("Error", "Ingresa el nombre del comprador", "error");
      return;
    }
    if (cart.length === 0) {
      showAlert("Error", "Agrega al menos un producto", "error");
      return;
    }

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('es-ES');

    // Título
    doc.setFontSize(20);
    doc.text("BOLETA DE COMPRA", 105, 20, { align: "center" });

    // Fecha y comprador
    doc.setFontSize(10);
    doc.text(`Fecha: ${date}`, 20, 35);
    doc.setFontSize(12);
    doc.text("Comprador:", 20, 45);
    doc.text(buyerName, 50, 45);

    // Tabla
let y = 60;
doc.setFontSize(10);

// Encabezados
const colX = {
  producto: 20,
  precio: 110,
  unitPrice: 135,
  cantidad: 155,
  subtotal: 175
};

doc.text("Producto", colX.producto, y); // texto a la izquierda
doc.text("Precio Atado", colX.precio, y, { align: "right" }); // alineado a la derecha
doc.text("Precio c/u", colX.unitPrice, y, { align: "right" });
doc.text("Cant.", colX.cantidad, y, { align: "right" });
doc.text("Subtotal", colX.subtotal, y, { align: "right" });
doc.line(20, y + 2, 190, y + 2);
y += 10;

// Datos del carrito
cart.forEach(item => {
  doc.text(item.product.substring(0, 25), colX.producto, y);
  doc.text(`$${item.price.toFixed(2)}`, colX.precio, y, { align: "right" });
  doc.text(`$${item.unitPrice.toFixed(2)}`, colX.unitPrice, y, { align: "right" });
  doc.text(item.quantity.toString(), colX.cantidad, y, { align: "right" });
  doc.text(`$${item.subtotal.toFixed(2)}`, colX.subtotal, y, { align: "right" });
  y += 8;
});

// Total
y += 5;
doc.line(20, y, 190, y);
y += 10;
doc.setFontSize(14);
doc.text("TOTAL:", 140, y, { align: "right" }); // TOTAL alineado a la derecha
doc.text(`$${total}`, 175, y, { align: "right" }); // monto total alineado a la derecha
    // Marca de agua centrada y diagonal
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const gState = (doc as any).GState ? (doc as any).GState({ opacity: 0.15 }) : null;
    if (gState) (doc as any).setGState(gState);
    
    doc.setFontSize(35);
    doc.setTextColor(130, 130, 130);
    
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    
    // Dos líneas de texto (centradas una sobre otra)
    doc.text("DOCUMENTO NO VÁLIDO", centerX, centerY - 10, {
      align: "center",
      angle: 45,
    });
    
    doc.text("COMO FACTURA", centerX, centerY + 20, {
      align: "center",
      angle: 45,
    });
    
    if (gState) (doc as any).setGState((doc as any).GState({ opacity: 0.6 }));
    
    // Pie de página
    doc.setFontSize(8);
    doc.text("Gracias por su compra", 105, 280, { align: "center" });

    // Guardar
    const dateStr = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
    const fileName = `Boleta_${buyerName.replace(/\s+/g, "_")}_${dateStr}.pdf`;
    doc.save(fileName);
    showAlert("¡Boleta Generada Con Exito!", `Boleta generada: ${fileName}`, "success");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        {/* Encabezado */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Generador de Boletas</h1>
          <p className="text-gray-600 mt-2">Sistema de facturación para Distribuidora Almaraz</p>
        </header>

        {/* Nombre del comprador */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <label className="block text-sm font-medium text-black mb-2">
            Nombre del Comprador
          </label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition"
            placeholder="Ej: Juan Pérez"
          />
        </div>

        {/* Agregar producto */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Agregar Producto</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
              >
                <option value="">Seleccione un producto</option>
                {cigaretteProducts.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio Por Atado ($)</label>
              <input
              type="number"
              value={price}
              onChange={(e) => {
                const valor = Number(e.target.value);
                setPrice(e.target.value);
                setUnitPrice(valor > 0 ? (valor / 10).toFixed(2) : '');
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
              <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
             />
            </div>
          </div>
          <button
            onClick={addProduct}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Agregar Producto
          </button>
        </div>

        {/* Carrito */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Productos Agregados</h2>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
              <p className="font-medium">No hay productos</p>
              <p className="text-sm">Agrega productos para comenzar</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm font-semibold text-black-600 uppercase border-b">
                      <th className="pb-3">Producto</th>
                      <th className="pb-3">Precio</th>
                      <th className="pb-3">Precio Unitario</th>
                      <th className="pb-3">Cant.</th>
                      <th className="pb-3">Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="py-3 font-medium">{item.product}</td>
                        <td className="py-3">${item.price.toFixed(2)}</td>
                        <td className="py-3">${item.unitPrice.toFixed(2)} c/u</td>
                        <td className="py-3">{item.quantity}</td>
                        <td className="py-3">${item.subtotal.toFixed(2)}</td>
                        <td className="py-3">
                          <button
                            onClick={() => removeProduct(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t-2">
                <span className="text-2xl font-bold">Total</span>
                <span className="text-3xl font-bold text-blue-600">${total}</span>
              </div>
            </>
          )}
        </div>

        {/* Botón generar PDF */}
        <button
          onClick={generatePDF}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition"
        >
          <Download className="w-6 h-6" />
          Generar Boleta PDF
        </button>
      </div>

      {/* Alerta */}
      {alert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${alert.type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
              {alert.type === 'error' ? (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{alert.title}</h3>
            <p className="text-gray-600 mb-6">{alert.message}</p>
            <button
              onClick={() => setAlert(null)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}