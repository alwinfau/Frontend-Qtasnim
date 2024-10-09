import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Sesuaikan dengan URL API Laravel Anda

// Fungsi untuk mengakses API barang
export const fetchBarang = () => {
    return axios.get(`${API_URL}/barang`);
};

export const createBarang = (barang) => {
    return axios.post(`${API_URL}/barang`, barang);
};

export const updateBarang = (id, barang) => {
    return axios.put(`${API_URL}/barang/${id}`, barang);
};

export const deleteBarang = (id) => {
    return axios.delete(`${API_URL}/barang/${id}`);
};

// Fungsi untuk mengakses API stok barang
export const fetchStokBarang = () => {
    return axios.get(`${API_URL}/stokbarang`);
};

export const createStokBarang = (stokBarang) => {
    return axios.post(`${API_URL}/stokbarang`, stokBarang);
};

export const updateStokBarang = (id, stokBarang) => {
    return axios.put(`${API_URL}/stokbarang/${id}`, stokBarang);
};

export const deleteStokBarang = (id) => {
    return axios.delete(`${API_URL}/stokbarang/${id}`);
};

// Fungsi untuk mengakses API transaksi
export const fetchTransaksi = () => {
    return axios.get(`${API_URL}/transaksi`);
};

export const createTransaksi = (transaksi) => {
    return axios.post(`${API_URL}/transaksi`, transaksi);
};

export const updateTransaksi = (id, transaksi) => {
    return axios.put(`${API_URL}/transaksi/${id}`, transaksi);
};

export const deleteTransaksi = (id) => {
    return axios.delete(`${API_URL}/transaksi/${id}`);
};