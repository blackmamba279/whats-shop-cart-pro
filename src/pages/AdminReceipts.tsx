
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Send, Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ReceiptItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface StoreSettings {
  id: string;
  store_name: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  tax_id?: string;
}

const AdminReceipts = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadStoreSettings();
  }, []);

  const loadStoreSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (error) throw error;
      setStoreSettings(data);
    } catch (error) {
      console.error('Error loading store settings:', error);
      toast.error('Error al cargar configuración de la tienda');
    }
  };

  const addItem = () => {
    if (!newItemName || newItemQuantity <= 0 || newItemPrice <= 0) {
      toast.error('Por favor complete todos los campos del producto');
      return;
    }

    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      product_name: newItemName,
      quantity: newItemQuantity,
      unit_price: newItemPrice,
      total_price: newItemQuantity * newItemPrice
    };

    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemPrice(0);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total_price, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.15; // 15% tax
    return subtotal + tax;
  };

  const generateReceipt = async () => {
    if (!customerName || items.length === 0) {
      toast.error('Por favor complete el nombre del cliente y agregue al menos un producto');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate receipt number
      const { data: receiptNumberData, error: receiptNumberError } = await supabase
        .rpc('generate_receipt_number');

      if (receiptNumberError) throw receiptNumberError;

      const subtotal = calculateSubtotal();
      const taxAmount = subtotal * 0.15;
      const total = calculateTotal();

      // Create receipt
      const { data: receipt, error: receiptError } = await supabase
        .from('receipts')
        .insert({
          receipt_number: receiptNumberData,
          customer_name: customerName,
          customer_phone: customerPhone || null,
          customer_email: customerEmail || null,
          subtotal,
          tax_amount: taxAmount,
          total_amount: total,
          notes: notes || null
        })
        .select()
        .single();

      if (receiptError) throw receiptError;

      // Create receipt items
      const receiptItems = items.map(item => ({
        receipt_id: receipt.id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: itemsError } = await supabase
        .from('receipt_items')
        .insert(receiptItems);

      if (itemsError) throw itemsError;

      toast.success('Recibo generado exitosamente');
      
      // Send via WhatsApp
      sendReceiptViaWhatsApp(receipt, items);
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Error al generar el recibo');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendReceiptViaWhatsApp = (receipt: any, receiptItems: ReceiptItem[]) => {
    if (!customerPhone) {
      toast.error('No se puede enviar por WhatsApp: número de teléfono no proporcionado');
      return;
    }

    const receiptText = formatReceiptForWhatsApp(receipt, receiptItems);
    const encodedMessage = encodeURIComponent(receiptText);
    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Abriendo WhatsApp para enviar el recibo');
  };

  const formatReceiptForWhatsApp = (receipt: any, receiptItems: ReceiptItem[]) => {
    let message = `🧾 *RECIBO DE COMPRA*\n\n`;
    message += `🏪 *${storeSettings?.store_name || 'BoutiqueMG Whatsapp Shop'}*\n`;
    if (storeSettings?.address) message += `📍 ${storeSettings.address}\n`;
    if (storeSettings?.phone) message += `📞 ${storeSettings.phone}\n`;
    if (storeSettings?.email) message += `📧 ${storeSettings.email}\n`;
    message += `\n📄 *Recibo #:* ${receipt.receipt_number}\n`;
    message += `👤 *Cliente:* ${receipt.customer_name}\n`;
    message += `📅 *Fecha:* ${new Date(receipt.created_at).toLocaleDateString()}\n\n`;
    
    message += `📦 *PRODUCTOS:*\n`;
    receiptItems.forEach(item => {
      message += `• ${item.product_name}\n`;
      message += `  Cant: ${item.quantity} x $${item.unit_price.toFixed(2)} = $${item.total_price.toFixed(2)}\n`;
    });
    
    message += `\n💰 *RESUMEN:*\n`;
    message += `Subtotal: $${receipt.subtotal.toFixed(2)}\n`;
    message += `Impuesto (15%): $${receipt.tax_amount.toFixed(2)}\n`;
    message += `*TOTAL: $${receipt.total_amount.toFixed(2)}*\n\n`;
    
    if (receipt.notes) {
      message += `📝 *Notas:* ${receipt.notes}\n\n`;
    }
    
    message += `¡Gracias por su compra! 🛍️`;
    
    return message;
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setNotes('');
    setItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Receipt className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Emitir Recibos</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nombre del Cliente *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Teléfono</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Número de WhatsApp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas adicionales..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Products */}
        <Card>
          <CardHeader>
            <CardTitle>Agregar Productos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Nombre del Producto</Label>
              <Input
                id="productName"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Nombre del producto"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio Unitario</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            <Button onClick={addItem} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Productos en el Recibo</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unit.</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell>${item.total_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 space-y-2 text-right">
              <div>Subtotal: ${calculateSubtotal().toFixed(2)}</div>
              <div>Impuesto (15%): ${(calculateSubtotal() * 0.15).toFixed(2)}</div>
              <div className="text-lg font-bold">Total: ${calculateTotal().toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Receipt Button */}
      <div className="flex justify-end">
        <Button
          onClick={generateReceipt}
          disabled={isGenerating || !customerName || items.length === 0}
          className="bg-whatsapp hover:bg-whatsapp-dark"
        >
          <Send className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generando...' : 'Generar y Enviar Recibo'}
        </Button>
      </div>
    </div>
  );
};

export default AdminReceipts;
