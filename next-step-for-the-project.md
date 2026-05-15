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
                                    digital-teman.vercel.app
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

## Langkah 3 — Update Profil di Fork

Teman edit langsung di GitHub (atau clone ke lokal):

**File: `data/profile.json`**
```json
{
  "name": "NAMA TEMAN",
  "roleTitle": "3D Environment & Creature Artist",
  "bioShort": "Bio singkat teman...",
  "bioLong": "Bio lengkap teman...",
  "location": "Kota, GMT+7",
  "email": "email@teman.com",
  "skills": ["..."],
  "softwareList": ["Blender", "..."],
  "socialLinks": [
    { "label": "LinkedIn", "url": "https://linkedin.com/in/profil-teman" },
    { "label": "ArtStation", "url": "https://artstation.com/profil-teman" },
    { "label": "Instagram", "url": "https://instagram.com/profil-teman" }
  ]
}
```

Commit dan push ke fork setelah edit.

---

## Langkah 4 — Setup Vercel untuk Teman

### 4a. Buat akun Vercel
1. Buka vercel.com → Sign up with GitHub (pakai akun GitHub teman)
2. Authorize Vercel untuk akses GitHub

### 4b. Import project dari fork
1. Vercel Dashboard → **Add New Project**
2. Pilih repository: `AKUN_TEMAN/portofolio-3d-asset`
3. Framework: **Next.js** (otomatis terdeteksi)
4. Root Directory: biarkan default
5. **Jangan deploy dulu** — set env vars terlebih dahulu

### 4c. Set Environment Variables
Di Vercel project settings → **Environment Variables**, tambahkan:

| Key | Value | Keterangan |
|-----|-------|------------|
| `RESEND_API_KEY` | `re_xxxx...` | Dari resend.com (lihat langkah 5) |
| `CONTACT_EMAIL` | `email@teman.com` | Email penerima form kontak |
| `NEXT_PUBLIC_SITE_URL` | `https://nama-teman.vercel.app` | URL production teman |
| `BLOB_READ_WRITE_TOKEN` | `vercel_blob_...` | Dari Vercel Blob (lihat langkah 6) |

### 4d. Set branch production
Di Vercel project settings → **Git** → Production Branch: **`vercel-deploy`**

### 4e. Deploy
Klik **Deploy** — tunggu build selesai (~1-2 menit).

---

## Langkah 5 — Setup Resend (Email Form Kontak)

1. Buka resend.com → Sign up (gratis, 3000 email/bulan)
2. Dashboard → **API Keys** → **Create API Key**
3. Copy key → paste ke Vercel env var `RESEND_API_KEY`
4. (Opsional) Verifikasi domain sendiri agar email lebih profesional

---

## Langkah 6 — Setup Vercel Blob (untuk 3D Assets)

### 6a. Buat Blob store
1. Vercel Dashboard → **Storage** → **Create Database** → pilih **Blob**
2. Nama: `portfolio-assets` (atau bebas)
3. Klik **Create**

### 6b. Hubungkan ke project
1. Di Blob store → **Connect to Project** → pilih project portfolio teman
2. Ini otomatis menambah `BLOB_READ_WRITE_TOKEN` ke env vars

### 6c. Serahkan file 3D Asset ke teman
File GLB tidak ada di GitHub (sengaja dikeluarkan). Serahkan folder `3D-ASSET/` via:
- Google Drive / Dropbox
- Flash disk / hard disk eksternal
- WeTransfer (untuk file besar)

### 6d. Teman upload assets ke Blob-nya
Di komputer teman (setelah clone fork dan copy `3D-ASSET/`):
```bash
npm install
BLOB_READ_WRITE_TOKEN=token_dari_vercel node scripts/upload-blobs.mjs
```

Script otomatis update `data/assets-manifest.json` dengan URL Blob.

### 6e. Commit dan push manifest
```bash
git add data/assets-manifest.json
git commit -m "chore: add blob URLs to assets manifest"
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

---

## Checklist Serah Terima

- [ ] Teman punya akun GitHub
- [ ] Fork berhasil dibuat
- [ ] `data/profile.json` sudah diupdate dengan data teman
- [ ] Akun Vercel teman dibuat
- [ ] Project diimport ke Vercel dari fork
- [ ] Env vars sudah diset (Resend, email, site URL, Blob token)
- [ ] Production branch = `vercel-deploy`
- [ ] Akun Resend dibuat, API key diset
- [ ] Vercel Blob store dibuat dan terhubung ke project
- [ ] File `3D-ASSET/` diserahkan ke teman
- [ ] Blob upload dijalankan (`upload-blobs.mjs`)
- [ ] `assets-manifest.json` di-commit dan di-push ke `vercel-deploy`
- [ ] Site live dan 3D viewer berfungsi
- [ ] (Opsional) Custom domain terpasang
