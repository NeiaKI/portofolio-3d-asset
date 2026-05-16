# Next Steps — Serahkan Portfolio ke Teman

Panduan lengkap untuk memindahkan project ini ke teman kamu via GitHub Fork + Vercel baru.

---

## Gambaran Umum

```
Repo kamu (original)          Repo teman (fork)
NeiaKI/portofolio-3d-asset ──fork──▶ TEMAN/portofolio-3d-asset
                                              │
                                        import ke Vercel
                                              │
                                    portfolio-teman.vercel.app
```

---

## Langkah 1 — Teman Buat Akun GitHub

Jika belum punya:
1. Buka github.com → Sign up
2. Pilih username yang profesional (misal: nama atau inisial teman)
3. Verifikasi email

---

## Langkah 2 — Fork Repository

1. Teman login ke GitHub
2. Buka: `https://github.com/NeiaKI/portofolio-3d-asset`
3. Klik tombol **Fork** (pojok kanan atas)
4. Pilih akun teman sebagai owner
5. Nama repo bisa diganti atau dibiarkan sama
6. Klik **Create fork**

Setelah ini teman punya: `github.com/AKUN_TEMAN/portofolio-3d-asset`

---

## Langkah 3 — Update Konten ke Data Teman

Clone fork ke lokal terlebih dahulu:
```bash
git clone https://github.com/AKUN_TEMAN/portofolio-3d-asset.git
cd portofolio-3d-asset
npm install
```

### 3a. Update profil — `data/profile.json`

```json
{
  "name": "NAMA TEMAN",
  "roleTitle": "3D Environment & Creature Artist",
  "bioShort": "Bio singkat teman...",
  "bioLong": "Bio lengkap teman...",
  "location": "Kota, GMT+7",
  "email": "email@teman.com",
  "skills": ["Hard-surface modeling", "Creature sculpting", "PBR texturing"],
  "softwareList": ["Blender", "Substance Painter", "ZBrush"],
  "socialLinks": [
    { "label": "LinkedIn", "url": "https://linkedin.com/in/profil-teman" },
    { "label": "ArtStation", "url": "https://artstation.com/profil-teman" },
    { "label": "Behance", "url": "https://behance.net/profil-teman" },
    { "label": "Instagram", "url": "https://instagram.com/profil-teman" }
  ]
}
```

### 3b. Update metadata site — `src/app/layout.tsx`

Ganti semua yang hardcode nama "HILMI":
- `title: "HILMI 3D Portfolio"` → `title: "NAMA TEMAN 3D Portfolio"`
- Semua `description` yang sebut "Hilmi" → nama teman
- `name: "Hilmi"` di JSON-LD schema → nama teman

### 3c. Update commission page — `src/app/commission/page.tsx`

Ganti:
- `title: "Commission — HILMI 3D Lab"` → `title: "Commission — NAMA TEMAN 3D"`
- Harga paket (Basic/Standard/Premium) sesuai tarif teman
- Kontak WhatsApp/email di tombol CTA (jika ada)

### 3d. Update OG image — `src/app/opengraph-image.tsx`

Ganti:
- `"HILMI 3D Lab"` → nama teman

### 3e. Ganti file CV — `public/`

Taruh CV teman sebagai PDF di folder `public/`:
```
public/NamaTeman_CV.pdf
```

Lalu update path di `src/components/home-client.tsx`:
```tsx
// Cari baris:
href="/Hilmi_CV.pdf"
// Ganti menjadi:
href="/NamaTeman_CV.pdf"
```

### 3f. Commit semua perubahan
```bash
git add -A
git commit -m "chore: update profile and branding to [nama teman]"
git push origin master
```

---

## Langkah 4 — Setup Vercel untuk Teman

### 4a. Buat akun Vercel
1. Buka vercel.com → Sign up with GitHub (pakai akun GitHub teman)
2. Authorize Vercel untuk akses GitHub

### 4b. Buat Vercel Blob store dulu (sebelum import project)
> **Lakukan ini sebelum import project** agar token tersedia saat konfigurasi.

1. Vercel Dashboard → **Storage** → **Create Database** → pilih **Blob**
2. Nama: `portfolio-assets`
3. Klik **Create**
4. Copy nilai `BLOB_READ_WRITE_TOKEN` dari tab `.env.local`

> ⚠️ **Perhatian ukuran:** Vercel Blob **free tier hanya 500 MB**.
> Total asset portfolio ini ±1.4 GB — **melebihi free tier**.
> Opsi:
> - Upgrade ke **Vercel Pro** (~$20/bln, termasuk 5 GB Blob)
> - Upload hanya sebagian asset terkecil yang paling penting agar tetap < 500 MB
> - Gunakan CDN alternatif gratis: **Cloudflare R2** (free 10 GB)

### 4c. Import project dari fork
1. Vercel Dashboard → **Add New Project**
2. Pilih repository: `AKUN_TEMAN/portofolio-3d-asset`
3. Framework: **Next.js** (otomatis terdeteksi)
4. Root Directory: biarkan default
5. **Jangan deploy dulu** — set env vars terlebih dahulu

### 4d. Set Environment Variables
Di Vercel project settings → **Environment Variables**, tambahkan:

| Key | Value | Keterangan |
|-----|-------|------------|
| `RESEND_API_KEY` | `re_xxxx...` | Dari resend.com (lihat langkah 5) |
| `CONTACT_EMAIL` | `email@teman.com` | Email penerima form kontak |
| `NEXT_PUBLIC_SITE_URL` | `https://nama-teman.vercel.app` | URL production teman |
| `BLOB_READ_WRITE_TOKEN` | `vercel_blob_...` | Token dari langkah 4b |

### 4e. Set branch production
Di Vercel project settings → **Git** → Production Branch: **`vercel-deploy`**

### 4f. Deploy
Klik **Deploy** — tunggu build selesai (~1-2 menit).

---

## Langkah 5 — Setup Resend (Email Form Kontak)

1. Buka resend.com → Sign up (gratis, 3.000 email/bulan)
2. Dashboard → **API Keys** → **Create API Key**
3. Copy key → paste ke Vercel env var `RESEND_API_KEY`
4. (Opsional) Verifikasi domain sendiri agar email tidak masuk spam

---

## Langkah 6 — Upload 3D Assets ke Vercel Blob

### 6a. Serahkan file 3D Asset ke teman
File GLB tidak ada di GitHub (sengaja dikeluarkan dari git).
Serahkan folder `3D-ASSET/` via:
- Google Drive / Dropbox
- Flash disk / hard disk eksternal
- WeTransfer (untuk file besar)

Struktur folder yang diserahkan:
```
3D-ASSET/
  Animal/Sea/
  Building/
  Equipment/
  item/useable/
```

### 6b. Teman copy folder ke dalam repo fork
Letakkan folder `3D-ASSET/` di root folder repo (bukan dalam `src/`):
```
portofolio-3d-asset/
  3D-ASSET/       ← taruh di sini
  src/
  data/
  ...
```

### 6c. Pull env var dari Vercel (agar token tersedia lokal)
```bash
npx vercel link        # link ke project Vercel teman
npx vercel env pull .env.local
```

### 6d. Jalankan upload script
```bash
node scripts/upload-blobs.mjs
```

Script otomatis:
- Upload semua `.glb` dari `3D-ASSET/` ke Blob store
- Update `data/assets-manifest.json` dengan URL Blob

### 6e. Commit dan push manifest
```bash
git add data/assets-manifest.json
git commit -m "chore: add Vercel Blob URLs to assets manifest"
git push origin master
git checkout vercel-deploy
git merge master
git push origin vercel-deploy
```

Vercel otomatis redeploy dan 3D assets akan tampil.

---

## Langkah 7 — Custom Domain (Opsional)

Jika teman punya domain sendiri (misal: `namateman.com`):
1. Vercel project → **Settings** → **Domains**
2. Add domain → ikuti instruksi DNS

---

## Cara Teman Dapat Update dari Repo Aslimu

Jika kamu improve fitur di repo aslimu, teman bisa sync:

1. Di GitHub fork teman → klik **"Sync fork"** → **Update branch**
2. Atau via terminal:
```bash
git remote add upstream https://github.com/NeiaKI/portofolio-3d-asset.git
git fetch upstream
git merge upstream/master
git push origin master
```

> Setelah sync, teman perlu cek ulang apakah ada file yang perlu disesuaikan
> (profil, CV, pricing) karena merge bisa overwrite perubahan lokal.

---

## Checklist Serah Terima

### Konten & Branding
- [ ] `data/profile.json` — nama, bio, email, social links teman
- [ ] `src/app/layout.tsx` — metadata title/description (ganti "HILMI")
- [ ] `src/app/commission/page.tsx` — judul dan harga paket teman
- [ ] `src/app/opengraph-image.tsx` — nama di OG image
- [ ] `src/components/home-client.tsx` — path CV (`/Hilmi_CV.pdf` → path baru)
- [ ] `public/NamaTeman_CV.pdf` — file CV teman sudah di-upload

### Infrastruktur
- [ ] Teman punya akun GitHub dan fork sudah dibuat
- [ ] Akun Vercel teman dibuat (sign up via GitHub)
- [ ] Vercel Blob store dibuat, ukuran dipertimbangkan (free 500 MB)
- [ ] Project diimport ke Vercel dari fork
- [ ] Env vars sudah diset: `RESEND_API_KEY`, `CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`, `BLOB_READ_WRITE_TOKEN`
- [ ] Production branch = `vercel-deploy`
- [ ] Akun Resend dibuat dan API key diset

### 3D Assets
- [ ] Folder `3D-ASSET/` diserahkan ke teman
- [ ] Teman copy folder ke root repo fork
- [ ] `vercel env pull .env.local` dijalankan (untuk token lokal)
- [ ] `node scripts/upload-blobs.mjs` berhasil dijalankan
- [ ] `assets-manifest.json` sudah punya `blobUrl` untuk semua asset
- [ ] Manifest di-commit dan di-push ke `vercel-deploy`

### Final Check
- [ ] Site live di `*.vercel.app`
- [ ] 3D viewer berfungsi (model bisa diputar)
- [ ] Form kontak berfungsi (email terkirim ke teman)
- [ ] Download CV berfungsi
- [ ] (Opsional) Custom domain terpasang
