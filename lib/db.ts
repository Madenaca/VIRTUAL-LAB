import mysql, { Pool, PoolConnection } from "mysql2/promise";

// Global cache to prevent multiple connection pools during Next.js hot reload
declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: Pool | undefined;
}

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lab_kimia",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: Pool | null = null;
let isInitialized = false;

// Fallback in-memory store if MySQL server is not currently running
interface InMemoryData {
  guru: Array<{
    id: number;
    username: string;
    password_hash: string;
    nama: string;
    nip: string;
    role: string;
  }>;
  siswa: Array<{
    id: number;
    session_id: string;
    nama: string;
    kelas: string;
    skor_kuis: number;
    durasi_menit: number;
    status_selesai: number;
    created_at: string;
    updated_at: string;
    lembar_kerja?: {
      penyebab: string;
      dampak: string;
      solusi: string;
      pencegahan: string;
    };
    jawaban_kuis?: Array<{
      soal_id: number;
      pilihan_siswa: number;
      is_benar: number;
    }>;
    refleksi?: {
      hal_baru: string;
      hal_menarik: string;
      belum_paham: string;
      penerapan: string;
      kesan: string;
      skala_pemahaman: number;
    };
  }>;
}

export const inMemoryStore: InMemoryData = {
  guru: [
    {
      id: 1,
      username: "guru_kimia",
      password_hash: "kimia123",
      nama: "Fatma Alawiyah, S.Pd., Gr.",
      nip: "200103272025212017",
      role: "guru",
    },
    {
      id: 2,
      username: "admin",
      password_hash: "admin123",
      nama: "Fatma Alawiyah, S.Pd., Gr.",
      nip: "200103272025212017",
      role: "admin",
    },
    {
      id: 3,
      username: "fatma_alawiyah",
      password_hash: "fatmacantik",
      nama: "Fatma Alawiyah, S.Pd., Gr.",
      nip: "200103272025212017",
      role: "guru",
    },
  ],
  siswa: [
    {
      id: 1,
      session_id: "demo-siswa-1",
      nama: "Ahmad Fauzi",
      kelas: "X IPA 1",
      skor_kuis: 93,
      durasi_menit: 18,
      status_selesai: 1,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 3.7).toISOString(),
      lembar_kerja: {
        penyebab:
          "Siswa memanaskan larutan asam tanpa kacamata pelindung dan mulut tabung mengarah ke temannya.",
        dampak:
          "Terjadi bumping atau letupan larutan panas yang membahayakan mata dan kulit.",
        solusi:
          "Gunakan APD lengkap, tambahkan batu didih, dan arahkan tabung reaksi ke arah aman.",
        pencegahan:
          "Selalu cek SOP pemanasan dan kenakan kacamata pelindung sebelum menyalakan Bunsen.",
      },
      jawaban_kuis: [
        { soal_id: 1, pilihan_siswa: 2, is_benar: 1 },
        { soal_id: 2, pilihan_siswa: 2, is_benar: 1 },
      ],
      refleksi: {
        hal_baru:
          "Belajar 9 simbol GHS dan cara membaca meniskus bawah pada buret/gelas ukur.",
        hal_menarik:
          "Simulasi kesalahan kerja membantu memahami alasan di balik setiap aturan lab.",
        belum_paham:
          "Perbedaan fungsi presisi labu ukur vs buret pada analisis kuantitatif.",
        penerapan:
          "Akan selalu memakai jas lab dan sarung tangan saat praktikum sekolah nanti.",
        kesan: "Sangat interaktif dan seru!",
        skala_pemahaman: 5,
      },
    },
  ],
};

export function getPool(): Pool {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool(dbConfig);
  }
  return global.mysqlPool;
}

/**
 * Initializes database and tables if not exist when MySQL is available
 */
export async function initDatabase(): Promise<boolean> {
  if (isInitialized) return true;

  try {
    const rootPool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await rootPool.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await rootPool.end();

    pool = getPool();

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guru (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        nama VARCHAR(150) NOT NULL,
        nip VARCHAR(50) NOT NULL,
        role VARCHAR(20) DEFAULT 'guru',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS siswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100) NOT NULL UNIQUE,
        nama VARCHAR(150) NOT NULL,
        kelas VARCHAR(50) NOT NULL,
        skor_kuis INT DEFAULT 0,
        durasi_menit INT DEFAULT 0,
        status_selesai TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS lembar_kerja_siswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        siswa_id INT NOT NULL,
        penyebab TEXT,
        dampak TEXT,
        solusi TEXT,
        pencegahan TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_lembar_kerja_siswa FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS jawaban_kuis_siswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        siswa_id INT NOT NULL,
        soal_id INT NOT NULL,
        pilihan_siswa INT NOT NULL,
        is_benar TINYINT(1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_jawaban_kuis_siswa FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS refleksi_siswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        siswa_id INT NOT NULL,
        hal_baru TEXT,
        hal_menarik TEXT,
        belum_paham TEXT,
        penerapan TEXT,
        kesan TEXT,
        skala_pemahaman INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_refleksi_siswa FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Seed default guru
    await pool.query(`
      INSERT INTO guru (username, password_hash, nama, nip, role)
      VALUES 
        ('guru_kimia', 'kimia123', 'Fatma Alawiyah, S.Pd., Gr.', '200103272025212017', 'guru'),
        ('admin', 'admin123', 'Fatma Alawiyah, S.Pd., Gr.', '200103272025212017', 'admin')
      ON DUPLICATE KEY UPDATE nama = VALUES(nama), nip = VALUES(nip);
    `);

    isInitialized = true;
    return true;
  } catch (err) {
    console.warn("MySQL Database connection unavailable, utilizing active in-memory cache:", err);
    return false;
  }
}

/**
 * Execute query with automatic fallback to in-memory store if MySQL server is down
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const mysqlAvailable = await initDatabase();
  if (mysqlAvailable && pool) {
    const [results] = await pool.query(sql, params);
    return results as T;
  }
  throw new Error("MySQL offline - use store fallback");
}
