// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BarangList from './components/BarangList';
import StokBarangList from './components/StokBarangList';
import TransaksiList from './components/TransaksiList';
// Import komponen lain untuk stok barang dan transaksi

const App = () => {
    return (
        <Router>
            <div className="flex">
                <Sidebar />
                <div className="flex-1">
                    <Navbar />
                    <Routes>
                        <Route path="/barangs" element={<BarangList />} />
                        <Route path="/stok-barangs" element={<StokBarangList />} />
                        <Route path="/transaksis" element={<TransaksiList />} />
                        {/* Tambahkan route untuk stok barang dan transaksi */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
