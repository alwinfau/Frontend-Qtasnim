// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StokBarangList = () => {
    const [stokBarangs, setStokBarangs] = useState([]);
    const [barangs, setBarangs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStokBarang, setEditingStokBarang] = useState(null);
    const [newStokAwal, setNewStokAwal] = useState('');
    const [newStokAkhir, setNewStokAkhir] = useState('');
    const [newBarangId, setNewBarangId] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // New state for search

    useEffect(() => {
        const fetchStokBarangs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/stok-barangs');
                setStokBarangs(response.data);
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Terjadi kesalahan saat mengambil data stok barang.');
            } finally {
                setLoading(false);
            }
        };

        const fetchBarangs = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/barangs');
                setBarangs(response.data);
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Terjadi kesalahan saat mengambil data barang.');
            }
        };

        fetchStokBarangs();
        fetchBarangs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus stok barang ini?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/stok-barangs/${id}`);
                setStokBarangs(stokBarangs.filter((stokBarang) => stokBarang.id !== id));
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError('Terjadi kesalahan saat menghapus stok barang.');
            }
        }
    };

    const handleEdit = (stokBarang) => {
        setEditingStokBarang(stokBarang);
        setNewStokAwal(stokBarang.stok_awal);
        setNewStokAkhir(stokBarang.stok_akhir);
        setNewBarangId(stokBarang.barang_id);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingStokBarang(null);
        resetFields();
        setModalOpen(true);
    };

    const handleUpdate = async () => {
        if (newStokAwal === '' || isNaN(newStokAwal)) {
            setError('Stok awal harus berupa angka dan tidak boleh kosong.');
            return;
        }

        const stokAkhirValue = newStokAkhir === '' ? 0 : Number(newStokAkhir);

        try {
            const response = await axios.put(`http://localhost:8000/api/stok-barangs/${editingStokBarang.id}`, {
                barang_id: newBarangId,
                stok_awal: Number(newStokAwal),
                stok_akhir: stokAkhirValue
            });

            setStokBarangs(stokBarangs.map((stokBarang) =>
                stokBarang.id === editingStokBarang.id ? response.data : stokBarang
            ));
            setModalOpen(false);
            resetFields();
        } catch (err) {
            setError('Terjadi kesalahan saat memperbarui stok barang.');
            console.error(err);
        }
    };

    const handleCreate = async () => {
        if (newStokAwal === '' || isNaN(newStokAwal)) {
            setError('Stok awal harus berupa angka dan tidak boleh kosong.');
            return;
        }

        const stokAkhirValue = newStokAkhir === '' ? 0 : Number(newStokAkhir);

        try {
            const response = await axios.post('http://localhost:8000/api/stok-barangs', {
                barang_id: newBarangId,
                stok_awal: Number(newStokAwal),
                stok_akhir: stokAkhirValue
            });

            setStokBarangs([...stokBarangs, response.data]);
            setModalOpen(false);
            resetFields();
        } catch (err) {
            setError('Terjadi kesalahan saat menambah stok barang.');
            console.error(err);
        }
    };

    const resetFields = () => {
        setEditingStokBarang(null);
        setNewStokAwal('');
        setNewStokAkhir('');
        setNewBarangId('');
    };

    const filteredStokBarangs = stokBarangs.filter((stokBarang) => 
        stokBarang.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-4 sm:ml-64">
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-gray-400">Daftar Stok Barang</h2>
                <button onClick={handleAdd} className="bg-emerald-500 text-white px-4 py-2 text-sm rounded flex items-center">
                    <svg className="w-5 h-5 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    Tambah Stok Barang
                </button>
            </div>
            <input
                type="text"
                placeholder="Cari Barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 mb-4 w-full"
            />

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 border">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID Stok</th>
                            <th scope="col" className="px-6 py-3">Nama Barang</th>
                            <th scope="col" className="px-6 py-3">Stok Awal</th>
                            <th scope="col" className="px-6 py-3">Stok Akhir</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStokBarangs.map((stokBarang) => (
                            <tr key={stokBarang.id} className='bg-white border-b'>
                                <td className="px-6 py-4 font-normal text-gray-700">{stokBarang.id}</td>
                                <td className="px-6 py-4 font-normal text-gray-700">{stokBarang.barang.nama_barang}</td>
                                <td className="px-6 py-4 font-normal text-gray-700">{stokBarang.stok_awal}</td>
                                <td className="px-6 py-4 font-normal text-gray-700">{stokBarang.stok_akhir}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 flex items-center">
                                    <button onClick={() => handleEdit(stokBarang)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(stokBarang.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit Stock */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-5">
                        <h3 className="text-lg font-semibold">{editingStokBarang ? 'Edit Stok Barang' : 'Tambah Stok Barang'}</h3>
                        <label className="block mt-4">Barang:</label>
                        <select value={newBarangId} onChange={(e) => setNewBarangId(e.target.value)} className="border p-2 w-full">
                            <option value="">Pilih Barang</option>
                            {barangs.map(barang => (
                                <option key={barang.id} value={barang.id}>{barang.nama_barang}</option>
                            ))}
                        </select>
                        <label className="block mt-4">Stok Awal:</label>
                        <input type="number" value={newStokAwal} onChange={(e) => setNewStokAwal(e.target.value)} className="border p-2 w-full" />
                        <label className="block mt-4">Stok Akhir:</label>
                        <input type="number" value={newStokAkhir} onChange={(e) => setNewStokAkhir(e.target.value)} className="border p-2 w-full" />
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setModalOpen(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">Batal</button>
                            <button onClick={editingStokBarang ? handleUpdate : handleCreate} className="bg-emerald-500 text-white px-4 py-2 rounded">
                                {editingStokBarang ? 'Perbarui' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StokBarangList;
