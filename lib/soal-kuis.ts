export interface Soal {
  id: number;
  soal: string;
  opsi: string[];
  kunci: number; // index opsi yang benar (0-3)
  penjelasan: string;
  kategori: "alat" | "keselamatan" | "simbol" | "prosedur";
}

export const soalKuis: Soal[] = [
  {
    id: 1,
    soal: "Alat laboratorium yang paling tepat digunakan untuk membuat larutan dengan volume yang sangat presisi adalah...",
    opsi: ["Gelas beker 250 mL", "Erlenmeyer 250 mL", "Labu ukur 250 mL", "Gelas ukur 250 mL"],
    kunci: 2,
    penjelasan: "Labu ukur (volumetric flask) dirancang khusus untuk membuat larutan dengan volume yang sangat presisi karena hanya memiliki satu tanda batas volume yang sangat akurat.",
    kategori: "alat",
  },
  {
    id: 2,
    soal: "Saat membaca volume cairan dalam gelas ukur, posisi mata yang benar adalah...",
    opsi: [
      "Lebih tinggi dari permukaan cairan",
      "Lebih rendah dari permukaan cairan",
      "Sejajar dengan bagian bawah meniskus",
      "Sejajar dengan bagian atas meniskus",
    ],
    kunci: 2,
    penjelasan: "Untuk cairan bening seperti air, pembacaan volume yang benar adalah pada bagian bawah meniskus dengan posisi mata sejajar (horizontal) agar tidak terjadi kesalahan paralaks.",
    kategori: "prosedur",
  },
  {
    id: 3,
    soal: "Simbol GHS dengan gambar tengkorak (☠️) menandakan bahan kimia tersebut bersifat...",
    opsi: ["Korosif", "Mudah terbakar", "Sangat beracun (toksik akut)", "Oksidator"],
    kunci: 2,
    penjelasan: "Simbol GHS06 (tengkorak dan tulang bersilang) menandakan bahan kimia sangat beracun dan berbahaya jika tertelan, terhirup, atau kontak dengan kulit.",
    kategori: "simbol",
  },
  {
    id: 4,
    soal: "Urutan APD (Alat Pelindung Diri) yang WAJIB digunakan saat praktikum kimia adalah...",
    opsi: [
      "Sarung tangan saja sudah cukup",
      "Jas lab, kacamata, sarung tangan, dan sepatu tertutup",
      "Hanya jas lab dan kacamata",
      "Masker dan sarung tangan",
    ],
    kunci: 1,
    penjelasan: "APD lengkap untuk praktikum kimia meliputi jas lab (melindungi tubuh dari percikan), kacamata (melindungi mata), sarung tangan (melindungi tangan), dan sepatu tertutup (melindungi kaki).",
    kategori: "keselamatan",
  },
  {
    id: 5,
    soal: "Cara yang benar untuk mencium bau suatu bahan kimia di laboratorium adalah...",
    opsi: [
      "Langsung mendekatkan hidung ke wadah dan mencium dalam-dalam",
      "Meminta teman untuk menciumnya",
      "Mengipaskan uap dari wadah ke arah hidung dengan tangan",
      "Membuka tutup wadah di tempat terbuka dan langsung mencium",
    ],
    kunci: 2,
    penjelasan: "Teknik yang benar adalah 'wafting' – mengipaskan uap bahan kimia ke arah hidung dengan gerakan tangan, bukan mencium langsung dari wadah karena dapat membahayakan pernapasan.",
    kategori: "prosedur",
  },
  {
    id: 6,
    soal: "Fungsi utama dari Labu Erlenmeyer dalam praktikum titrasi adalah...",
    opsi: [
      "Mengukur volume larutan dengan presisi tinggi",
      "Memanaskan larutan dalam jumlah besar",
      "Menampung larutan yang dititrasi dan memudahkan pengadukan",
      "Menyimpan larutan standar",
    ],
    kunci: 2,
    penjelasan: "Bentuk kerucut Erlenmeyer sangat ideal untuk titrasi karena mudah diputar tanpa tumpah, sehingga larutan tercampur sempurna saat tetes demi tetes titran ditambahkan.",
    kategori: "alat",
  },
  {
    id: 7,
    soal: "Saat memanaskan tabung reaksi, mulut tabung harus diarahkan ke...",
    opsi: [
      "Ke arah guru agar mudah dipantau",
      "Ke atas agar uap mudah keluar",
      "Ke arah sendiri agar mudah diamati",
      "Ke tempat yang tidak ada orang",
    ],
    kunci: 3,
    penjelasan: "Mulut tabung reaksi harus diarahkan ke tempat yang tidak ada orang untuk mencegah cedera jika terjadi percikan atau ejeksi cairan panas akibat pemanasan mendadak.",
    kategori: "keselamatan",
  },
  {
    id: 8,
    soal: "Pipet volume digunakan dengan cara mengisap larutan menggunakan...",
    opsi: [
      "Mulut secara langsung",
      "Propipet atau rubber bulb",
      "Spuit suntik",
      "Memompa dengan tangan",
    ],
    kunci: 1,
    penjelasan: "Propipet (rubber bulb/filler) adalah alat wajib untuk mengisap larutan ke dalam pipet. DILARANG KERAS mengisap dengan mulut karena sangat berbahaya jika bahan kimia masuk ke mulut.",
    kategori: "alat",
  },
  {
    id: 9,
    soal: "Label bahan kimia menunjukkan simbol GHS05 (gambar botol dengan cairan menetes ke tangan dan logam). Artinya bahan tersebut bersifat...",
    opsi: ["Mudah terbakar", "Korosif", "Beracun", "Oksidator"],
    kunci: 1,
    penjelasan: "GHS05 (korosif) menggambarkan bahan kimia yang dapat merusak jaringan kulit, mata, dan logam. Contohnya asam klorida (HCl) pekat dan asam sulfat (H₂SO₄) pekat.",
    kategori: "simbol",
  },
  {
    id: 10,
    soal: "Alat yang digunakan sebagai penyangga gelas beker saat dipanaskan di atas Bunsen adalah...",
    opsi: [
      "Statif dan klem",
      "Kaki tiga dan kasa kawat",
      "Tripod dan kertas saring",
      "Ring stand dan asbes",
    ],
    kunci: 1,
    penjelasan: "Kaki tiga berfungsi sebagai penyangga, sedangkan kasa kawat di atasnya mendistribusikan panas secara merata ke dasar gelas, mencegah pecah akibat panas yang tidak merata.",
    kategori: "alat",
  },
  {
    id: 11,
    soal: "Jika terjadi tumpahan bahan kimia korosif di kulit, tindakan pertama yang harus dilakukan adalah...",
    opsi: [
      "Langsung mengoleskan penetral (basa/asam)",
      "Menetralisasi dengan larutan garam dapur",
      "Segera membilas dengan air mengalir selama minimal 15-20 menit",
      "Mengeringkan dengan tisu/kain bersih",
    ],
    kunci: 2,
    penjelasan: "Tindakan pertama adalah membilas dengan air mengalir sebanyak-banyaknya (15-20 menit) untuk mengencerkan dan menghilangkan bahan kimia. Jangan langsung mengoleskan penetral tanpa instruksi dokter.",
    kategori: "keselamatan",
  },
  {
    id: 12,
    soal: "Buret yang akan digunakan untuk titrasi harus dibilas terlebih dahulu dengan...",
    opsi: [
      "Aquades saja",
      "Larutan yang akan digunakan (titran)",
      "Larutan sabun lalu aquades",
      "Alkohol 70%",
    ],
    kunci: 1,
    penjelasan: "Buret harus dibilas dengan larutan titran yang akan digunakan (bukan aquades) untuk mencegah pengenceran larutan yang dapat mengubah konsentrasi dan hasil titrasi.",
    kategori: "prosedur",
  },
  {
    id: 13,
    soal: "Fungsi neraca analitik di laboratorium adalah...",
    opsi: [
      "Mengukur volume zat cair dengan presisi tinggi",
      "Mengukur pH larutan",
      "Menimbang massa zat dengan ketelitian sangat tinggi (0,0001 g)",
      "Mengukur suhu larutan",
    ],
    kunci: 2,
    penjelasan: "Neraca analitik adalah alat timbang dengan ketelitian hingga 0,0001 gram (4 desimal). Digunakan untuk menimbang massa zat yang memerlukan presisi tinggi dalam analisis kimia.",
    kategori: "alat",
  },
  {
    id: 14,
    soal: "Larutan sisa hasil percobaan kimia di laboratorium harus dibuang ke...",
    opsi: [
      "Wastafel biasa karena akan diencerkan air",
      "Tempat sampah umum",
      "Wadah limbah kimia khusus yang telah disediakan",
      "Tanah di sekitar laboratorium",
    ],
    kunci: 2,
    penjelasan: "Limbah kimia harus dibuang ke wadah limbah khusus yang tersedia di laboratorium sesuai jenisnya (asam, basa, organik, dll) untuk mencegah pencemaran lingkungan dan bahaya kesehatan.",
    kategori: "keselamatan",
  },
  {
    id: 15,
    soal: "Isi tabung reaksi yang akan dipanaskan tidak boleh melebihi...",
    opsi: ["1/2 volume tabung", "3/4 volume tabung", "1/3 volume tabung", "2/3 volume tabung"],
    kunci: 2,
    penjelasan: "Tabung reaksi hanya boleh diisi maksimal 1/3 volumenya saat dipanaskan. Jika lebih, cairan dapat meletup keluar saat mendidih, membahayakan pengguna.",
    kategori: "prosedur",
  },
];
