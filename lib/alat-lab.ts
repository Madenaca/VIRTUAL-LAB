export interface AlatLab {
  id: string;
  nama: string;
  kategori: "gelas" | "non-gelas" | "pengukur" | "pemanas";
  emoji: string;
  gambar: string; // path relatif dari /public
  fungsi: string;
  cara: string;
  peringatan: string;
  warna: string;
}

export const alatLab: AlatLab[] = [
  // === ALAT GELAS ===
  {
    id: "gelas-beker",
    nama: "Gelas Beker (Beaker)",
    kategori: "gelas",
    emoji: "🥛",
    gambar: "/gambar/gelas_beaker.jpg",
    fungsi:
      "Menampung, memanaskan, dan mencampur larutan dalam jumlah besar. Memiliki skala volume namun tidak untuk pengukuran presisi.",
    cara:
      "Tuangkan larutan ke dalam gelas beker. Gunakan kaki tiga dan kasa jika dipanaskan. Aduk dengan batang pengaduk.",
    peringatan:
      "Jangan gunakan untuk mengukur volume secara presisi. Saat memanaskan, pastikan ada batu didih untuk mencegah bumping.",
    warna: "from-blue-400 to-blue-600",
  },
  {
    id: "erlenmeyer",
    nama: "Labu Erlenmeyer",
    kategori: "gelas",
    emoji: "⚗️",
    gambar: "/gambar/labu_erlenmeyer.jpg",
    fungsi:
      "Menampung larutan, titrasi, dan pemanasan. Bentuk kerucut memudahkan pengadukan tanpa tumpah.",
    cara:
      "Isi larutan hingga batas yang diinginkan. Putar perlahan saat titrasi. Pasang stopper jika diperlukan.",
    peringatan:
      "Tidak untuk pengukuran volume presisi. Periksa retak sebelum digunakan untuk tekanan.",
    warna: "from-green-400 to-green-600",
  },
  {
    id: "labu-ukur",
    nama: "Labu Ukur (Volumetric Flask)",
    kategori: "gelas",
    emoji: "🫙",
    gambar: "/gambar/labu_ukur.jpg",
    fungsi:
      "Membuat larutan dengan volume yang sangat presisi. Hanya memiliki satu tanda batas volume.",
    cara:
      "Masukkan zat terlarut, tambahkan aquades hingga mendekati tanda, lalu tambahkan tetes per tetes hingga tepat tanda batas.",
    peringatan:
      "Jangan dipanaskan! Jangan diisi melebihi tanda batas. Selalu kalibrasi sebelum digunakan.",
    warna: "from-purple-400 to-purple-600",
  },
  {
    id: "gelas-ukur",
    nama: "Gelas Ukur (Graduated Cylinder)",
    kategori: "gelas",
    emoji: "📏",
    gambar: "/gambar/gelas_ukur.jpg",
    fungsi:
      "Mengukur volume cairan dengan ketelitian sedang. Lebih presisi dari gelas beker.",
    cara:
      "Baca volume pada bagian bawah meniskus (untuk cairan bening) dengan mata sejajar skala.",
    peringatan:
      "Tidak untuk larutan yang bereaksi kuat. Jangan gunakan sebagai tempat reaksi kimia.",
    warna: "from-cyan-400 to-cyan-600",
  },
  {
    id: "pipet-tetes",
    nama: "Pipet Tetes",
    kategori: "gelas",
    emoji: "💧",
    gambar: "/gambar/pipet_tetes.jpg",
    fungsi:
      "Memindahkan cairan dalam jumlah kecil (beberapa tetes). Digunakan dalam analisis kualitatif.",
    cara:
      "Tekan bulb karet, celupkan ujung ke larutan, lepas tekanan untuk mengisap. Pindahkan dan teteskan perlahan.",
    peringatan:
      "Jangan menghisap dengan mulut! Bilas dengan aquades sebelum berpindah larutan.",
    warna: "from-teal-400 to-teal-600",
  },
  {
    id: "pipet-volume",
    nama: "Pipet Volume (Pipette Volumetric)",
    kategori: "gelas",
    emoji: "🔬",
    gambar: "/gambar/pipet_volume.jpg",
    fungsi:
      "Mengambil volume cairan yang sangat tepat (1 angka setelah koma). Digunakan dalam analisis kuantitatif.",
    cara:
      "Gunakan bulb pipet (rubber bulb) untuk mengisap. Baca meniskus bagian bawah. Alirkan perlahan ke wadah tujuan.",
    peringatan:
      "DILARANG KERAS menghisap dengan mulut! Selalu gunakan propipet/bulb.",
    warna: "from-indigo-400 to-indigo-600",
  },
  {
    id: "buret",
    nama: "Buret",
    kategori: "gelas",
    emoji: "🧪",
    gambar: "/gambar/buret.jpg",
    fungsi:
      "Mengalirkan larutan dengan volume terukur secara presisi dalam proses titrasi.",
    cara:
      "Isi buret lewat atas hingga melewati skala 0, buka kran sebentar untuk mengisi bagian bawah kran, baca skala awal.",
    peringatan:
      "Periksa kebocoran kran sebelum titrasi. Bilas 3× dengan larutan yang akan digunakan.",
    warna: "from-rose-400 to-rose-600",
  },
  {
    id: "corong",
    nama: "Corong (Funnel)",
    kategori: "gelas",
    emoji: "🔺",
    gambar: "/gambar/corong.jpg",
    fungsi:
      "Membantu menuang cairan ke dalam wadah bermulut sempit dan menyaring dengan kertas saring.",
    cara:
      "Letakkan di atas labu/erlenmeyer. Pasang kertas saring jika untuk filtrasi. Tuangkan larutan perlahan.",
    peringatan:
      "Jangan menekan kertas saring saat filtrasi. Pastikan corong tidak tersumbat.",
    warna: "from-orange-400 to-orange-600",
  },
  // === ALAT NON-GELAS ===
  {
    id: "bunsen",
    nama: "Pembakar Bunsen",
    kategori: "pemanas",
    emoji: "🔥",
    gambar: "/gambar/pembakaran_busen.jpg",
    fungsi:
      "Memanaskan larutan, sterilisasi, dan pembakaran zat dalam percobaan kimia.",
    cara:
      "Hubungkan selang gas, nyalakan korek sebelum membuka gas, atur udara dengan memutar cincin di bawah.",
    peringatan:
      "Jauhkan dari bahan mudah terbakar! Matikan segera setelah digunakan. Jangan tinggalkan menyala tanpa pengawasan.",
    warna: "from-red-400 to-red-600",
  },
  {
    id: "kaki-tiga",
    nama: "Kaki Tiga & Kasa",
    kategori: "non-gelas",
    emoji: "🏗️",
    gambar: "/gambar/kaki_tiga.jpg",
    fungsi:
      "Penyangga gelas saat dipanaskan di atas pembakar Bunsen. Kasa kawat mendistribusikan panas merata.",
    cara:
      "Letakkan kaki tiga di atas Bunsen, pasang kasa di atas kaki tiga, lalu letakkan wadah gelas di atas kasa.",
    peringatan:
      "Pastikan kaki tiga stabil sebelum meletakkan beban. Gunakan penjepit saat memindahkan kasa panas.",
    warna: "from-gray-400 to-gray-600",
  },
  {
    id: "neraca",
    nama: "Neraca Analitik",
    kategori: "non-gelas",
    emoji: "⚖️",
    gambar: "/gambar/neraca_analitik.jpg",
    fungsi:
      "Menimbang massa zat dengan ketelitian tinggi (0,001 g – 0,0001 g).",
    cara:
      "Kalibrasi (tare) sebelum menimbang. Letakkan wadah, tare, lalu tambahkan zat. Tutup pintu saat membaca.",
    peringatan:
      "Jangan meletakkan zat kimia langsung di piring timbang. Jauhkan dari getaran dan angin.",
    warna: "from-yellow-400 to-yellow-600",
  },
  {
    id: "batang-pengaduk",
    nama: "Batang Pengaduk",
    kategori: "gelas",
    emoji: "🥢",
    gambar: "/gambar/batang_pengaduk.jpg",
    fungsi:
      "Mengaduk larutan dan membantu proses pemanasan agar merata.",
    cara:
      "Pegang tegak, aduk dengan gerakan melingkar. Jangan mengetuk dinding gelas.",
    peringatan:
      "Bersihkan setelah digunakan. Periksa keretakan ujung yang dapat mencemari larutan.",
    warna: "from-lime-400 to-lime-600",
  },
  {
    id: "spatula",
    nama: "Spatula",
    kategori: "non-gelas",
    emoji: "🔧",
    gambar: "/gambar/spatula.jpg",
    fungsi:
      "Mengambil zat padat/serbuk kimia dalam jumlah kecil.",
    cara:
      "Gunakan ujung spatula yang bersih dan kering. Ambil sedikit demi sedikit.",
    peringatan:
      "Jangan menggunakan spatula yang sudah terkontaminasi. Bersihkan dan keringkan setelah setiap penggunaan.",
    warna: "from-amber-400 to-amber-600",
  },
  {
    id: "penjepit",
    nama: "Penjepit Tabung Reaksi",
    kategori: "non-gelas",
    emoji: "🔩",
    gambar: "/gambar/Gegep Kayu Penjepit Tabung Reaksi Parktikum Laboratorium.jpg",
    fungsi:
      "Memegang tabung reaksi saat dipanaskan agar tidak membakar tangan.",
    cara:
      "Kunci penjepit di bagian atas tabung (1/3 dari atas). Arahkan mulut tabung menjauhi diri dan orang lain saat memanaskan.",
    peringatan:
      "Selalu arahkan mulut tabung reaksi ke tempat yang aman. Jangan ke arah orang!",
    warna: "from-sky-400 to-sky-600",
  },
  {
    id: "tabung-reaksi",
    nama: "Tabung Reaksi",
    kategori: "gelas",
    emoji: "🧫",
    gambar: "/gambar/tabung_reaksi.jpg",
    fungsi:
      "Tempat mereaksikan zat kimia dalam jumlah kecil. Dapat dipanaskan langsung.",
    cara:
      "Isi maksimal 1/3 volume tabung. Pegang dengan penjepit saat memanaskan. Arahkan mulut menjauhi orang.",
    peringatan:
      "Isi tidak lebih dari 1/3! Jangan menutup mulut tabung saat dipanaskan karena bisa meledak.",
    warna: "from-emerald-400 to-emerald-600",
  },
];

export const simbolBahaya = [
  {
    id: "eksplosif",
    nama: "Eksplosif",
    kode: "GHS01",
    emoji: "💥",
    gambar: "/gambar/eksplosif.jpg",
    warna: "bg-red-100 border-red-400",
    teks: "Dapat meledak dengan benturan, gesekan, api, atau sumber energi lain.",
    contoh: "TNT, Asam pikrat, Kalium perklorat",
  },
  {
    id: "oksidator",
    nama: "Oksidator",
    kode: "GHS03",
    emoji: "🔥",
    gambar: "/gambar/oksidator.jpg",
    warna: "bg-orange-100 border-orange-400",
    teks: "Dapat menyebabkan atau memperparah kebakaran; bersifat pengoksidasi.",
    contoh: "Hidrogen peroksida, Kalium permanganat, Asam nitrat pekat",
  },
  {
    id: "mudah-terbakar",
    nama: "Mudah Terbakar",
    kode: "GHS02",
    emoji: "🚒",
    gambar: "/gambar/mudah_terbakar.jpg",
    warna: "bg-orange-100 border-orange-400",
    teks: "Gas, aerosol, cairan, atau padatan mudah terbakar.",
    contoh: "Etanol, Aseton, Metanol, Bensin",
  },
  {
    id: "gas-tertekan",
    nama: "Gas Bertekanan",
    kode: "GHS04",
    emoji: "🫧",
    gambar: "/gambar/gas_bertekanan.jpg",
    warna: "bg-blue-100 border-blue-400",
    teks: "Gas disimpan dalam tekanan tinggi; dapat meledak jika dipanaskan.",
    contoh: "Tabung O₂, CO₂, N₂ terkompresi",
  },
  {
    id: "korosif",
    nama: "Korosif",
    kode: "GHS05",
    emoji: "⚗️",
    gambar: "/gambar/korosif.jpg",
    warna: "bg-yellow-100 border-yellow-400",
    teks: "Dapat menyebabkan korosi logam dan kerusakan jaringan kulit/mata.",
    contoh: "HCl pekat, H₂SO₄ pekat, NaOH pekat",
  },
  {
    id: "beracun",
    nama: "Beracun",
    kode: "GHS06",
    emoji: "☠️",
    gambar: "/gambar/beracun.jpg",
    warna: "bg-gray-100 border-gray-500",
    teks: "Sangat beracun jika tertelan, terhirup, atau kontak kulit.",
    contoh: "Merkuri, Sianida, Kloroform",
  },
  {
    id: "berbahaya",
    nama: "Berbahaya",
    kode: "GHS07",
    emoji: "⚠️",
    gambar: "/gambar/berbahaya.jpg",
    warna: "bg-yellow-100 border-yellow-400",
    teks: "Berbahaya jika tertelan, terhirup, atau kontak kulit.",
    contoh: "Xilena, Asam asetat encer, Etil asetat",
  },
  {
    id: "bahaya-kesehatan",
    nama: "Bahaya Kesehatan",
    kode: "GHS08",
    emoji: "🫁",
    gambar: "/gambar/bahaya_kesehatan.jpg",
    warna: "bg-red-100 border-red-400",
    teks: "Dapat menyebabkan efek kesehatan serius (karsinogenik, mutagenik).",
    contoh: "Benzena, Formaldehida, Asbestos",
  },
  {
    id: "bahaya-lingkungan",
    nama: "Bahaya Lingkungan",
    kode: "GHS09",
    emoji: "🌊",
    gambar: "/gambar/bahaya_lingkungan.jpg",
    warna: "bg-green-100 border-green-400",
    teks: "Berbahaya bagi organisme akuatik dan lingkungan.",
    contoh: "Pestisida organofosfat, Tributiltin",
  },
];

export const aturanKeselamatan = {
  dos: [
    "Selalu kenakan APD lengkap (jas lab, kacamata, sarung tangan, sepatu tertutup)",
    "Baca label bahan kimia sebelum digunakan",
    "Bekerja di lemari asam saat menggunakan bahan volatil",
    "Cuci tangan dengan sabun setelah selesai praktikum",
    "Laporkan kecelakaan sekecil apapun kepada guru",
    "Ketahui lokasi APAR, kotak P3K, dan jalur evakuasi",
    "Buang limbah kimia ke tempat yang telah ditentukan",
    "Simpan bahan kimia pada tempatnya setelah digunakan",
  ],
  donts: [
    "DILARANG makan, minum, atau merokok di dalam laboratorium",
    "DILARANG mencium bahan kimia langsung – gunakan teknik kipas tangan",
    "DILARANG menghisap pipet dengan mulut – gunakan propipet/bulb",
    "DILARANG meninggalkan percobaan yang sedang berlangsung tanpa pengawasan",
    "DILARANG berlari atau bercanda di dalam laboratorium",
    "DILARANG membuang sisa bahan kimia ke wastafel sembarangan",
    "DILARANG menggunakan alat yang rusak atau retak",
    "DILARANG menyentuh wajah selama bekerja di laboratorium",
  ],
};
