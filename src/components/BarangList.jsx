// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BarangList = () => {
    const [barangs, setBarangs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBarang, setEditingBarang] = useState(null);
    const [newBarangName, setNewBarangName] = useState('');
    const [newBarangCategory, setNewBarangCategory] = useState('');
    const [newHargaBeli, setNewHargaBeli] = useState('');
    const [newHargaJual, setNewHargaJual] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('nama_barang'); // Default sorting field
    const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order

    useEffect(() => {
        const fetchBarangs = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/barangs');
                setBarangs(response.data);
                setLoading(false);
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Terjadi kesalahan saat mengambil data barang.');
                setLoading(false);
            }
        };

        fetchBarangs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
            try {
                await axios.delete(`http://localhost:8000/api/barangs/${id}`);
                setBarangs(barangs.filter((barang) => barang.id !== id));
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Terjadi kesalahan saat menghapus barang.');
            }
        }
    };

    const handleEdit = (barang) => {
        setEditingBarang(barang);
        setNewBarangName(barang.nama_barang);
        setNewBarangCategory(barang.jenis_barang);
        setNewHargaBeli(barang.harga_beli);
        setNewHargaJual(barang.harga_jual);
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        if (newBarangName.trim() === '' || newBarangCategory.trim() === '' || newHargaBeli.trim() === '' || newHargaJual.trim() === '') return;

        try {
            const updatedBarang = await axios.put(`http://localhost:8000/api/barangs/${editingBarang.id}`, {
                nama_barang: newBarangName,
                jenis_barang: newBarangCategory,
                harga_beli: newHargaBeli,
                harga_jual: newHargaJual,
            });

            setBarangs(barangs.map((barang) => (barang.id === editingBarang.id ? updatedBarang.data : barang)));
            setEditingBarang(null);
            setNewBarangName('');
            setNewBarangCategory('');
            setNewHargaBeli('');
            setNewHargaJual('');
            setIsModalOpen(false);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Terjadi kesalahan saat memperbarui barang.');
        }
    };

    const handleCreate = async () => {
        if (newBarangName.trim() === '' || newBarangCategory.trim() === '' || newHargaBeli.trim() === '' || newHargaJual.trim() === '') return;

        try {
            const createdBarang = await axios.post('http://localhost:8000/api/barangs', {
                nama_barang: newBarangName,
                jenis_barang: newBarangCategory,
                harga_beli: newHargaBeli,
                harga_jual: newHargaJual,
            });

            setBarangs([...barangs, createdBarang.data]);
            setNewBarangName('');
            setNewBarangCategory('');
            setNewHargaBeli('');
            setNewHargaJual('');
            setIsModalOpen(false);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Terjadi kesalahan saat menambahkan barang.');
        }
    };

    const openModal = () => {
        setEditingBarang(null);
        setNewBarangName('');
        setNewBarangCategory('');
        setNewHargaBeli('');
        setNewHargaJual('');
        setIsModalOpen(true);
    };

    // Search and sort logic
    const filteredBarangs = barangs
        .filter((barang) => 
            barang.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
            barang.jenis_barang.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const aValue = sortField === 'harga_beli' || sortField === 'harga_jual' ? Number(a[sortField]) : a[sortField];
            const bValue = sortField === 'harga_beli' || sortField === 'harga_jual' ? Number(b[sortField]) : b[sortField];
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-4 sm:ml-64">
            <h2 className="mb-4 text-gray-400">Daftar Barang</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Cari Barang"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 mr-2"
                />
                <select 
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="border p-2 mr-2"
                >
                    <option value="nama_barang">Nama Barang</option>
                    <option value="harga_beli">Harga Beli</option>
                    <option value="harga_jual">Harga Jual</option>
                </select>
                <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border p-2"
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
            <button onClick={openModal} className="bg-green-500 text-white px-4 py-2 rounded mb-4">Tambah Barang</button>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 border">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Product ID</th>
                            <th scope="col" className="px-6 py-3">Product Name</th>
                            <th scope="col" className="px-6 py-3">Product Category</th>
                            <th scope="col" className="px-6 py-3">Purchase Price</th>
                            <th scope="col" className="px-6 py-3">Selling Price</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBarangs.map((barang) => (
                            <tr key={barang.id} className='bg-white border-b'>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{barang.id}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{barang.nama_barang}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{barang.jenis_barang}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">Rp.{barang.harga_beli}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">Rp.{barang.harga_jual}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">
                                    <button onClick={() => handleEdit(barang)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                                    <button onClick={() => handleDelete(barang.id)} className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-5 w-11/12 md:w-1/3">
                        <h3 className="text-xl mb-2">{editingBarang ? 'Edit Barang' : 'Tambah Barang'}</h3>
                        <input
                            type="text"
                            value={newBarangName}
                            onChange={(e) => setNewBarangName(e.target.value)}
                            placeholder="Nama Barang"
                            className="border p-2 mb-2 w-full"
                        />
                        <input
                            type="text"
                            value={newBarangCategory}
                            onChange={(e) => setNewBarangCategory(e.target.value)}
                            placeholder="Kategori Barang"
                            className="border p-2 mb-2 w-full"
                        />
                        <input
                            type="number"
                            value={newHargaBeli}
                            onChange={(e) => setNewHargaBeli(e.target.value)}
                            placeholder="Harga Beli"
                            className="border p-2 mb-2 w-full"
                        />
                        <input
                            type="number"
                            value={newHargaJual}
                            onChange={(e) => setNewHargaJual(e.target.value)}
                            placeholder="Harga Jual"
                            className="border p-2 mb-2 w-full"
                        />
                        <div className="flex justify-end">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">Batal</button>
                            <button onClick={editingBarang ? handleUpdate : handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">{editingBarang ? 'Simpan' : 'Tambah'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BarangList;
