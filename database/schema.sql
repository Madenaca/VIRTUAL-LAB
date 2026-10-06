-- ============================================================
-- SKEMA DATABASE: LABORATORIUM KIMIA VIRTUAL (lab_kimia)
-- Sistem Manajemen Siswa & Guru Berbasis Problem-Based Learning
-- ============================================================

CREATE DATABASE IF NOT EXISTS lab_kimia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lab_kimia;

-- 1. Tabel Guru (Otentikasi & Profil Guru)
CREATE TABLE IF NOT EXISTS guru (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nama VARCHAR(150) NOT NULL,
    nip VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'guru',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel Siswa (Data Biodata & Progres Siswa)
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

-- 3. Tabel Lembar Kerja Siswa (Problem-Based Learning Simulasi)
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

-- 4. Tabel Jawaban Kuis Siswa
CREATE TABLE IF NOT EXISTS jawaban_kuis_siswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    siswa_id INT NOT NULL,
    soal_id INT NOT NULL,
    pilihan_siswa INT NOT NULL,
    is_benar TINYINT(1) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_jawaban_kuis_siswa FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Tabel Jurnal Refleksi Siswa
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

-- ============================================================
-- DATA AWAL (SEED): GURU KIMIA
-- ============================================================
INSERT INTO guru (username, password_hash, nama, nip, role)
VALUES 
    ('admin', 'admin123', 'Fatma Alawiyah, S.Pd., Gr.', '200103272025212017', 'admin')
ON DUPLICATE KEY UPDATE nama = VALUES(nama), nip = VALUES(nip);
