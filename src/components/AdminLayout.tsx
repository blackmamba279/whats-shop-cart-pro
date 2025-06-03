import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LogOut, Package, FolderOpen, ArrowLeft, MessageSquare, CreditCard, Receipt } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-whatsapp text-white shadow-md py-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-bold">BMG Shop Pro Admin</h1>
          <div className="flex items-center gap-2">
            <Link to="/products">
              <Button variant="ghost" className="text-white hover:text-white/80">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-white hover:text-white/80">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row flex-1">
        <aside className="w-full md:w-64 bg-gray-100 p-4">
          <nav className="space-y-2">
            <Link to="/admin/products">
              <Button variant="ghost" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="ghost" className="w-full justify-start">
                <FolderOpen className="mr-2 h-4 w-4" />
                Categories
              </Button>
            </Link>
            <Link to="/admin/receipts">
              <Button variant="ghost" className="w-full justify-start">
                <Receipt className="mr-2 h-4 w-4" />
                Emitir Recibos
              </Button>
            </Link>
            <Link to="/admin/whatsapp">
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                WhatsApp Settings
              </Button>
            </Link>
            <Link to="/admin/pagadito">
              <Button variant="ghost" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Pagadito Payments
              </Button>
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
