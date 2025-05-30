import React, { useEffect, useState } from 'react';
import { getUserProducts } from '../../utils/ApiServices';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBoxOpen, FaSignOutAlt, FaCube, FaSearch, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SideBar = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productRes = await getUserProducts();
        setProducts(productRes.products || []);
      } catch (error) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const filteredProducts = products.filter(product => 
    product.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-gray-900 via-black to-gray-900 border-r border-white/10 flex flex-col justify-between fixed left-0 top-0 z-40 overflow-hidden shadow-2xl">
      {/* Top: Logo and User */}
      <div className="flex flex-col">
        <div 
          to="/" 
          className="flex items-center justify-center gap-2 py-6 px-4 border-b border-white/10"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.7 }}
          >
            <FaCube className="text-blue-400 text-2xl" />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent select-none"
          >
            VeriOwn
          </motion.span>
        </div>
      </div>

      {/* Middle: Search and Products */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Search */}
        <div className="relative mb-4 group">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Search your products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
          />
        </div>
        
        {/* Products Header */}
        <div 
          className="flex items-center justify-between mb-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Products
          </h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown className="text-gray-400" />
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center text-gray-400 py-8">
                  <FaBoxOpen className="text-3xl mb-2" />
                  <span>{searchTerm ? "No matching products" : "No products found"}</span>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-xs bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white font-semibold rounded-full px-3 py-1 hover:from-blue-700 hover:to-indigo-700 transition"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <ul className="space-y-2 pr-1">
                  {filteredProducts.map((product) => {
                    const isActive = location.pathname === `/products/${product.id}`;
                    return (
                      <motion.li 
                        key={product.id}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to={`/products/${product.id}`}
                          className={`block px-4 py-3 rounded-lg transition relative overflow-hidden group font-semibold ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-600/90 to-green-400/90 text-white' 
                              : 'bg-white/5 hover:bg-gradient-to-r hover:from-blue-600/80 hover:to-green-400/80 text-gray-100'
                          }`}
                          title={product.model}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative z-10 flex items-center">
                            <div className="mr-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400/20 to-green-300/20 flex items-center justify-center">
                                <FaCube className="text-blue-400" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium truncate max-w-[160px] bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                                {product.model}
                              </div>
                              <div className="text-xs bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                {product.serial_number}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: Logout */}
      <div className="p-5 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition"
        >
          <FaSignOutAlt /> Logout
        </motion.button>
      </div>
    </div>
  );
};

export default SideBar;
