import { useState, useEffect } from "react";
import {
  Plus, Trash2, ShoppingCart, AlertCircle, Package,
  TrendingUp, TrendingDown, Edit2, Check, X, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

export default function InventoryPage() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Mock data for initial display
  const MOCK_STOCKS = [
    {
      id: 1,
      item_name: "Bags of Rice (50kg)",
      category: "Grains",
      quantity: 12,
      unit_price: 1500,
      selling_price: 2000,
      minimum_quantity: 5,
      status: "in_stock",
      total_value: 18000,
      date_added: new Date().toISOString(),
      notes: "Premium quality white rice"
    },
    {
      id: 2,
      item_name: "Cooking Oil (5L)",
      category: "Oils",
      quantity: 3,
      unit_price: 450,
      selling_price: 600,
      minimum_quantity: 5,
      status: "low_stock",
      total_value: 1350,
      date_added: new Date().toISOString(),
      notes: "Sunflower oil - needs reorder soon"
    },
    {
      id: 3,
      item_name: "Sugar (1kg bags)",
      category: "Grains",
      quantity: 0,
      unit_price: 120,
      selling_price: 150,
      minimum_quantity: 10,
      status: "out_of_stock",
      total_value: 0,
      date_added: new Date().toISOString(),
      notes: "Granulated sugar"
    },
    {
      id: 4,
      item_name: "Wheat Flour (1kg)",
      category: "Grains",
      quantity: 25,
      unit_price: 80,
      selling_price: 120,
      minimum_quantity: 10,
      status: "in_stock",
      total_value: 2000,
      date_added: new Date().toISOString(),
      notes: "All-purpose flour"
    },
    {
      id: 5,
      item_name: "Tea Leaves (250g)",
      category: "Beverages",
      quantity: 18,
      unit_price: 200,
      selling_price: 300,
      minimum_quantity: 8,
      status: "in_stock",
      total_value: 3600,
      date_added: new Date().toISOString(),
      notes: "Premium black tea"
    },
    {
      id: 6,
      item_name: "Salt (500g)",
      category: "Condiments",
      quantity: 2,
      unit_price: 50,
      selling_price: 80,
      minimum_quantity: 8,
      status: "low_stock",
      total_value: 100,
      date_added: new Date().toISOString(),
      notes: "Iodized salt - consider reordering"
    },
    {
      id: 7,
      item_name: "Beans (1kg)",
      category: "Legumes",
      quantity: 20,
      unit_price: 150,
      selling_price: 200,
      minimum_quantity: 10,
      status: "in_stock",
      total_value: 3000,
      date_added: new Date().toISOString(),
      notes: "Assorted dried beans"
    },
    {
      id: 8,
      item_name: "Canned Tomatoes",
      category: "Canned Goods",
      quantity: 8,
      unit_price: 100,
      selling_price: 150,
      minimum_quantity: 5,
      status: "in_stock",
      total_value: 800,
      date_added: new Date().toISOString(),
      notes: "Ready to use tomatoes"
    },
  ];

  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    quantity: "",
    unit_price: "",
    selling_price: "",
    minimum_quantity: "5",
    notes: "",
  });

  // Fetch stocks on mount
  useEffect(() => {
    if (user?.business?.id) {
      fetchStocks();
    } else {
      // Use mock data if no business ID
      setStocks(MOCK_STOCKS);
    }
  }, [user?.business?.id]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stock/');
      setStocks(response.data.length > 0 ? response.data : MOCK_STOCKS);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
      // Fallback to mock data on error
      setStocks(MOCK_STOCKS);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async () => {
    if (!formData.item_name || !formData.quantity || !formData.unit_price) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        // Update existing stock
        await api.put(`/stock/${editingId}/`, formData);
      } else {
        // Add new stock
        await api.post('/stock/', formData);
      }
      
      setFormData({
        item_name: "",
        category: "",
        quantity: "",
        unit_price: "",
        selling_price: "",
        minimum_quantity: "5",
        notes: "",
      });
      setShowForm(false);
      setEditingId(null);
      fetchStocks();
    } catch (error) {
      console.error("Failed to save stock:", error);
      alert("Failed to save stock item");
    }
  };

  const handleSellStock = async (stockId, currentQuantity) => {
    const quantityToSell = prompt(`How many units of this item were sold? (Available: ${currentQuantity})`);
    
    if (quantityToSell && !isNaN(quantityToSell)) {
      try {
        await api.post(`/stock/${stockId}/sell/`, {
          quantity_sold: parseInt(quantityToSell),
        });
        fetchStocks();
      } catch (error) {
        console.error("Failed to mark stock as sold:", error);
        alert(error.response?.data?.error || "Failed to mark items as sold");
      }
    }
  };

  const handleDeleteStock = async (stockId) => {
    if (confirm("Are you sure you want to delete this stock item?")) {
      try {
        await api.delete(`/stock/${stockId}/`);
        fetchStocks();
      } catch (error) {
        console.error("Failed to delete stock:", error);
      }
    }
  };

  const handleEditStock = (stock) => {
    setFormData({
      item_name: stock.item_name,
      category: stock.category,
      quantity: stock.quantity.toString(),
      unit_price: stock.unit_price.toString(),
      selling_price: stock.selling_price.toString(),
      minimum_quantity: stock.minimum_quantity.toString(),
      notes: stock.notes,
    });
    setEditingId(stock.id);
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_stock":
        return darkMode ? "bg-success-900/20 text-success-300" : "bg-success-50 text-success-700";
      case "low_stock":
        return darkMode ? "bg-yellow-900/20 text-yellow-300" : "bg-yellow-50 text-yellow-700";
      case "out_of_stock":
        return darkMode ? "bg-rose-900/20 text-rose-300" : "bg-rose-50 text-rose-700";
      case "sold":
        return darkMode ? "bg-slate-900/20 text-slate-300" : "bg-slate-50 text-slate-700";
      default:
        return darkMode ? "bg-slate-700" : "bg-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "in_stock":
        return <TrendingUp className="w-4 h-4" />;
      case "low_stock":
        return <AlertCircle className="w-4 h-4" />;
      case "out_of_stock":
        return <TrendingDown className="w-4 h-4" />;
      case "sold":
        return <Check className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const totalValue = stocks.reduce((sum, stock) => sum + (stock.total_value || 0), 0);
  const itemsAtRisk = stocks.filter((s) => s.status === "low_stock" || s.status === "out_of_stock").length;
  const profitMargin = stocks.reduce((sum, stock) => {
    if (stock.unit_price > 0) {
      return sum + ((stock.selling_price - stock.unit_price) * stock.quantity);
    }
    return sum;
  }, 0);

  return (
    <DashboardLayout>
    <div className="space-y-6 animate-in pb-10">
      {/* Header Section */}
      <div className={`rounded-3xl p-8 overflow-hidden relative ${
        darkMode 
          ? "bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900" 
          : "bg-gradient-to-br from-brand-600 via-brand-500 to-brand-600"
      } shadow-xl`}>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Header content */}
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl backdrop-blur ${darkMode ? "bg-white/10" : "bg-white/20"}`}>
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Inventory Manager</h1>
                <p className="text-brand-100 mt-1">Track stock, monitor inventory, and plan restocks</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              >
                Dashboard
              </Link>
              <Link
                to="/ledger"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              >
                Ledger
              </Link>
              <Link
                to="/forecast"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              >
                Forecast
              </Link>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                item_name: "",
                category: "",
                quantity: "",
                unit_price: "",
                selling_price: "",
                minimum_quantity: "5",
                notes: "",
              });
              setShowForm(!showForm);
            }}
            className="px-8 py-3 bg-white text-brand-700 rounded-xl font-bold flex items-center gap-2 transition-all hover:shadow-lg hover:scale-105 hover:bg-brand-50"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <div className={`p-4 rounded-xl backdrop-blur ${darkMode ? "bg-white/10" : "bg-white/15"} border ${darkMode ? "border-white/10" : "border-white/20"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-brand-100/80 text-sm font-semibold">Total Items</span>
              <Package className="w-4 h-4 text-white/60" />
            </div>
            <div className="text-3xl font-bold text-white">{stocks.length}</div>
            <p className="text-xs text-brand-100/60 mt-1">products in stock</p>
          </div>

          <div className={`p-4 rounded-xl backdrop-blur ${darkMode ? "bg-white/10" : "bg-white/15"} border ${darkMode ? "border-white/10" : "border-white/20"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-brand-100/80 text-sm font-semibold">Total Value</span>
              <TrendingUp className="w-4 h-4 text-white/60" />
            </div>
            <div className="text-3xl font-bold text-white">KES {(totalValue / 1000).toFixed(1)}K</div>
            <p className="text-xs text-brand-100/60 mt-1">inventory worth</p>
          </div>

          <div className={`p-4 rounded-xl backdrop-blur ${darkMode ? "bg-white/10" : "bg-white/15"} border ${darkMode ? "border-white/10" : "border-white/20"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-brand-100/80 text-sm font-semibold">Profit Margin</span>
              <Sparkles className="w-4 h-4 text-white/60" />
            </div>
            <div className="text-3xl font-bold text-white">KES {(profitMargin / 1000).toFixed(1)}K</div>
            <p className="text-xs text-brand-100/60 mt-1">potential profit</p>
          </div>

          <div className={`p-4 rounded-xl ${itemsAtRisk > 0 ? "bg-rose-500/20 border border-rose-400/30" : "bg-white/10 border border-white/10"} backdrop-blur`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${itemsAtRisk > 0 ? "text-rose-100" : "text-brand-100/80"}`}>
                At Risk
              </span>
              <AlertCircle className={`w-4 h-4 ${itemsAtRisk > 0 ? "text-rose-300" : "text-white/60"}`} />
            </div>
            <div className={`text-3xl font-bold ${itemsAtRisk > 0 ? "text-rose-200" : "text-white"}`}>
              {itemsAtRisk}
            </div>
            <p className={`text-xs ${itemsAtRisk > 0 ? "text-rose-100/60" : "text-brand-100/60"}`} >
              items need attention
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className={`p-8 rounded-2xl border ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
          <h3 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}>
            {editingId ? "Edit Stock Item" : "Add New Stock Item"}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Item Name *
              </label>
              <input
                type="text"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                placeholder="e.g., Rice, Cooking Oil"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-dark-surface border-dark-border text-white"
                    : "bg-white border-slate-200 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Groceries, Electronics"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-dark-surface border-dark-border text-white"
                    : "bg-white border-slate-200 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-dark-surface border-dark-border text-white"
                    : "bg-white border-slate-200 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Minimum Quantity
              </label>
              <input
                type="number"
                value={formData.minimum_quantity}
                onChange={(e) => setFormData({ ...formData, minimum_quantity: e.target.value })}
                placeholder="5"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-dark-surface border-dark-border text-white"
                    : "bg-white border-slate-200 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Cost per Unit (KES) *
              </label>
              <input
                type="number"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                placeholder="0.00"
                step="0.01"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-dark-surface border-dark-border text-white"
                    : "bg-white border-slate-200 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Selling Price (KES)
              </label>
              <input
                type="number"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                placeholder="0.00"
                step="0.01"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-dark-surface border-dark-border text-white"
                    : "bg-white border-slate-200 text-slate-900"
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this item..."
              rows="3"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-dark-surface border-dark-border text-white"
                  : "bg-white border-slate-200 text-slate-900"
              } focus:outline-none focus:ring-2 focus:ring-brand-500`}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddStock}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              {editingId ? "Update" : "Add"} Item
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                darkMode
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-900"
              }`}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stock List */}
      {loading ? (
        <div className="text-center py-12">
          <div className={`inline-block p-3 rounded-full ${darkMode ? "bg-brand-900/20" : "bg-brand-100"} mb-3`}>
            <Package className={`w-8 h-8 animate-spin ${darkMode ? "text-brand-400" : "text-brand-600"}`} />
          </div>
          <p className={darkMode ? "text-slate-400" : "text-slate-600"}>Loading inventory...</p>
        </div>
      ) : stocks.length === 0 ? (
        <div className={`p-12 rounded-2xl border-2 border-dashed text-center ${
          darkMode ? "bg-dark-surface border-dark-border" : "bg-slate-50 border-slate-200"
        }`}>
          <Package className={`w-12 h-12 mx-auto mb-3 ${darkMode ? "text-slate-600" : "text-slate-400"}`} />
          <p className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
            No stock items yet
          </p>
          <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
            Click "Add Item" to start tracking your inventory
          </p>
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${darkMode ? "bg-dark-surface border-dark-border" : "bg-slate-50 border-slate-200"}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Item
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Category
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Qty
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Unit Cost
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Total Value
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr
                    key={stock.id}
                    className={`border-b transition-colors hover:${darkMode ? "bg-dark-surface" : "bg-slate-50"} ${
                      darkMode ? "border-dark-border" : "border-slate-100"
                    }`}
                  >
                    <td className={`px-6 py-4 font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {stock.item_name}
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {stock.category || "—"}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {stock.quantity}
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      KES {parseFloat(stock.unit_price).toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                      KES {stock.total_value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(stock.status)}`}>
                        {getStatusIcon(stock.status)}
                        {stock.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSellStock(stock.id, stock.quantity)}
                          title="Mark as sold"
                          className={`p-2 rounded-lg transition-all ${
                            darkMode
                              ? "bg-success-900/20 hover:bg-success-900/30 text-success-400"
                              : "bg-success-50 hover:bg-success-100 text-success-700"
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditStock(stock)}
                          title="Edit"
                          className={`p-2 rounded-lg transition-all ${
                            darkMode
                              ? "bg-brand-900/20 hover:bg-brand-900/30 text-brand-400"
                              : "bg-brand-50 hover:bg-brand-100 text-brand-700"
                          }`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStock(stock.id)}
                          title="Delete"
                          className={`p-2 rounded-lg transition-all ${
                            darkMode
                              ? "bg-rose-900/20 hover:bg-rose-900/30 text-rose-400"
                              : "bg-rose-50 hover:bg-rose-100 text-rose-700"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}
