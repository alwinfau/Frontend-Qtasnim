// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Transaksi = () => {
    const [transaksis, setTransaksis] = useState([]);
    const [barangs, setBarangs] = useState([]); // Untuk menyimpan data barang
    const [formData, setFormData] = useState({
        barang_id: '',
        tanggal_transaksi: '',
        jumlah_terjual: '',
        harga_jual: '',
        sub_total: ''
    });
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTransaksis();
        fetchBarangs(); // Ambil data barang saat komponen pertama kali dimuat
    }, []);

    const fetchTransaksis = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/transaksis');
            console.log(response.data);
            setTransaksis(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchBarangs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/barangs'); // Ganti dengan endpoint yang sesuai
            setBarangs(response.data);
        } catch (error) {
            console.error('Error fetching barangs:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    
        // Jika input adalah jumlah terjual, hitung subtotal
        if (name === 'jumlah_terjual') {
            const subTotal = value * formData.harga_jual;
            setFormData((prevData) => ({ ...prevData, sub_total: subTotal }));
        }
    
        // Jika input adalah barang_id, ambil harga jual dari data barang
        if (name === 'barang_id') {
            const selectedBarang = barangs.find(barang => barang.id === Number(value)); // Ubah ke Number
            if (selectedBarang) {
                setFormData((prevData) => ({
                    ...prevData,
                    harga_jual: selectedBarang.harga_jual,
                    sub_total: prevData.jumlah_terjual * selectedBarang.harga_jual // Hitung sub_total jika jumlah sudah diisi
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    harga_jual: '', // Reset harga_jual jika barang tidak ditemukan
                    sub_total: 0 // Reset sub_total jika barang tidak ditemukan
                }));
            }
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data before submit:', formData);
        try {
            if (editing) {
                await axios.put(`http://localhost:8000/api/transaksis/${editId}`, formData);
                alert('Transaksi berhasil diperbarui.');
            } else {
                await axios.post('http://localhost:8000/api/transaksis', formData);
                alert('Transaksi berhasil ditambahkan.');
            }
            closeModal();
            fetchTransaksis();
        } catch (error) {
            // Periksa apakah error memiliki response dan data
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Terjadi kesalahan saat menyimpan transaksi.';
            console.error('Error saving transaction:', error);
            alert('Gagal menyimpan transaksi. ' + errorMessage);
        }
    };
    
    

    const handleEdit = (transaksi) => {
        setFormData(transaksi);
        setEditing(true);
        setEditId(transaksi.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            try {
                await axios.delete(`http://localhost:8000/api/transaksis/${id}`);
                alert('Transaksi berhasil dihapus.');
                fetchTransaksis();
            } catch (error) {
                console.error('Error deleting transaction:', error);
                alert('Gagal menghapus transaksi.');
            }
        }
    };

    const openModal = () => {
        setFormData({
            barang_id: '',
            tanggal_transaksi: '',
            jumlah_terjual: '',
            harga_jual: '',
            sub_total: ''
        });
        setEditing(false);
        setEditId(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            barang_id: '',
            tanggal_transaksi: '',
            jumlah_terjual: '',
            harga_jual: '',
            sub_total: ''
        });
        setEditing(false);
        setEditId(null);
    };

    return (
        <div className="p-4 sm:ml-64">
            <div className="flex justify-between items-center">
                <h1 className="text-lg text-gray-400 mb-4">Daftar Transaksi</h1>
                <button onClick={openModal} className="mb-4 bg-emerald-500 text-white rounded p-2 hover:bg-emerald-600 text-sm flex">
                    <svg className="w-5 h-5 me-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    Tambah Transaksi
                </button>
            </div>
            
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 border">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Nama Barang</th>
                            <th scope="col" className="px-6 py-3">Jenis Barang</th>
                            <th scope="col" className="px-6 py-3">Stok Awal</th>
                            <th scope="col" className="px-6 py-3">Sisa Stok</th>
                            <th scope="col" className="px-6 py-3">Jumlah Terjual</th>
                            <th scope="col" className="px-6 py-3">Harga Jual</th>
                            <th scope="col" className="px-6 py-3">Sub Total</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transaksis.map((transaksi) => (
                            <tr key={transaksi.id} className='bg-white border-b'>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{transaksi.id}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{transaksi.barang.nama_barang}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{transaksi.barang.jenis_barang}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{transaksi.barang.stokbarang.stok_awal}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{transaksi.barang.stokbarang.stok_akhir}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{transaksi.jumlah_terjual}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{transaksi.harga_jual}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap">{transaksi.sub_total}</td>
                                <td className="px-6 py-4 font-normal text-gray-700 whitespace-nowrap flex items-center">
                                    <button onClick={() => handleEdit(transaksi)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 flex items-center">
                                        <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                        </svg>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(transaksi.id)} className="bg-red-500 text-white px-2 py-1 rounded flex items-center">
                                        <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                        </svg>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded shadow-2xl p-6 w-96 border">
                        <h2 className="text-lg font-bold mb-4">{editing ? 'Edit Transaksi' : 'Tambah Transaksi'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4">
                                <select
                                    name="barang_id"
                                    value={formData.barang_id}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded p-2"
                                >
                                    <option value="">Pilih Barang</option>
                                    {barangs.map(barang => (
                                        <option key={barang.id} value={barang.id}>
                                            {barang.nama_barang} {/* Ganti dengan nama barang */}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    name="tanggal_transaksi"
                                    value={formData.tanggal_transaksi}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded p-2"
                                />
                                <input
                                    type="number"
                                    name="jumlah_terjual"
                                    value={formData.jumlah_terjual}
                                    onChange={handleChange}
                                    placeholder="Jumlah Terjual"
                                    required
                                    className="border border-gray-300 rounded p-2"
                                />
                                <input
                                    type="number"
                                    name="harga_jual"
                                    value={formData.harga_jual}
                                    onChange={handleChange}
                                    placeholder="Harga Jual"
                                    readOnly // Menonaktifkan input harga_jual agar tidak dapat diedit langsung
                                    className="border border-gray-300 rounded p-2"
                                />
                                <input
                                    type="number"
                                    name="sub_total"
                                    value={formData.sub_total}
                                    onChange={handleChange}
                                    placeholder="Sub Total"
                                    readOnly // Menonaktifkan input sub_total agar tidak dapat diedit langsung
                                    className="border border-gray-300 rounded p-2"
                                />
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="bg-gray-300 text-gray-700 rounded p-2 mr-2"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                                >
                                    {editing ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transaksi;
