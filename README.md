# ⏳ Kairos: Memory to Meaning

Kairos adalah aplikasi berbasis web yang membantu Anda mengubah catatan acak, jurnal harian, atau bahkan riwayat chat WhatsApp Anda menjadi wawasan (insight) yang bermakna. Aplikasi ini mengekstrak tema, emosi, dan momen penting dari narasi mentah Anda dan merangkumnya dalam antarmuka garis waktu (timeline) yang estetik. Selain itu, Kairos mengintegrasikan jaringan blockchain Monad untuk memberikan fitur "Seal on Monad" yang memungkinkan Anda mengabadikan jejak ingatan secara permanen (Proof of Existence).

## ✨ Fitur Utama

- **📝 Ekstraksi Makna**: Masukkan teks panjang (jurnal, chat, dsb.), dan Kairos akan menganalisis teks tersebut untuk mengelompokkan acara, mendeteksi emosi dominan, dan menyajikan satu ringkasan wawasan yang tajam (sharp one-liner insight).
- **🎙️ Input Suara (Voice Input)**: Dukungan untuk merekam cerita Anda secara langsung melalui suara, baik dalam bahasa Indonesia maupun Inggris (berkat integrasi Speech Recognition bawaan browser).
- **📊 Timeline & Clustering Estetik**: Narasi divisualisasikan dalam bentuk antarmuka timeline dan kartu memori yang dikelompokkan berdasarkan tema spesifik dengan warna-warna yang dinamis.
- **🔗 Monad Blockchain Sealing**: Amankan dan abadikan analisis memori Anda selamanya! Fitur "Seal on Monad" menggunakan `viem` untuk mengirimkan hash konten Anda (Proof of Existence) ke Monad Testnet.
- **📤 Export & Share (Social Media Ready)**: Simpan analisis narasi Anda menjadi format gambar (PNG) yang cantik menggunakan `html2canvas` dan bagikan langsung ke media sosial (Twitter/X, Instagram, Facebook).
- **🌐 Bilingual Support**: Tersedia sepenuhnya dalam Bahasa Indonesia dan Bahasa Inggris, dengan pergantian bahasa yang mulus tanpa memuat ulang halaman.
- **💾 History & Persistence**: Semua riwayat ingatan Anda tersimpan rapi menggunakan `localStorage` browser. Anda bisa melihat kembali atau menghapus ingatan masa lalu kapan saja.

## 🛠️ Tech Stack

Kairos dibangun menggunakan teknologi modern untuk memastikan performa yang cepat dan pengalaman pengguna yang luar biasa:

- **Framework Core**: [React 18](https://react.dev/) dengan [TypeScript](https://www.typescriptlang.org/) dan [Vite](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) dengan palet warna kustom bernuansa *dark mode* (ink, amber, teal, coral) yang sangat estetik.
- **Animasi**: [Framer Motion](https://www.framer.com/motion/) untuk transisi halaman yang *smooth* dan mikro-interaksi yang elegan.
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Blockchain/Web3**: [viem](https://viem.sh/) untuk berinteraksi secara mulus dengan RPC jaringan Monad Testnet.
- **Exporting Tools**: `html2canvas` untuk mengonversi DOM Node menjadi gambar berkualitas tinggi yang bisa diunduh.

## 🚀 Cara Menjalankan Secara Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan Kairos di perangkat lokal Anda:

1. **Clone Repository**
   ```bash
   git clone https://github.com/SanjayaCF/Kairos.git
   cd Kairos/memory-to-meaning
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**
   Buat file `.env` di direktori *root* proyek (yaitu di dalam folder `memory-to-meaning`) dan tambahkan parameter yang diperlukan untuk integrasi Monad Testnet:
   ```env
   VITE_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
   VITE_MONAD_PRIVATE_KEY=your_private_key_here
   # Catatan: Jangan pernah melakukan komit private key asli Anda ke GitHub!
   ```

4. **Jalankan Server Development**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`.

5. **Build untuk Production**
   ```bash
   npm run build
   ```
   Aplikasi ini telah dikonfigurasi dan dioptimalkan agar dapat dideploy dengan mulus di platform seperti Vercel tanpa adanya error TypeScript (setelah perbaikan terakhir).

## 📁 Struktur Direktori

- `src/components/`: Kumpulan komponen UI reaktif (InputArea, Timeline, ResultScreen, ShareModal, dll).
- `src/lib/`: Fungsi utilitas logika utama, termasuk `monad.ts` yang menangani transaksi interaksi Web3.
- `src/i18n.ts`: Pusat konfigurasi kamus translasi untuk fitur Bilingual (EN/ID).
- `src/types.ts`: Kumpulan tipe deklarasi TypeScript yang mendefinisikan struktur data `MemoryEvent`, `MemoryCluster`, dan `ParsedMemory`.

---
*Dibangun dengan dedikasi tinggi untuk mengubah setiap ingatan menjadi bermakna.* ⏳
