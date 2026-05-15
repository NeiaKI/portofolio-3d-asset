# Portofolio 3D Asset — HILMI

Personal portfolio website untuk memamerkan karya 3D secara interaktif langsung di browser. Dibangun untuk kebutuhan 3D artist yang ingin menampilkan aset-asetnya secara profesional kepada rekruter, klien, dan sesama artist.

## Fitur

- **3D Viewer Interaktif** — eksplorasi model `.glb` langsung di browser (rotate, zoom, pan, lighting preset)
- **Portfolio Grid** — galeri karya dengan filter kategori + skeleton loading
- **Project Detail** — informasi teknis tiap aset (polycount, texture, pipeline, software)
- **Commission Page** — halaman `/commission` dengan paket harga & alur kerja
- **About & Contact** — profil kreator dan form kontak (via Resend + toast notifikasi)
- **Dark/Light Theme** — toggle tema terang/gelap
- **Bilingual (ID/EN)** — toggle bahasa Indonesia dan Inggris
- **SEO** — OpenGraph dinamis, sitemap, robots.txt
- **Responsive** — tampilan optimal di desktop dan mobile

## Kategori Aset 3D

| Kategori | Contoh |
|----------|--------|
| Character | Makhluk laut, sea creatures |
| Environment | Rumah jamur, arsitektur fantasy |
| Props | Pedang, perisai, armor, potion |

## Tech Stack

- **Framework** — [Next.js](https://nextjs.org/) (App Router)
- **Styling** — [Tailwind CSS](https://tailwindcss.com/)
- **UI Components** — [shadcn/ui](https://ui.shadcn.com/)
- **3D Rendering** — [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org/)
- **Email** — [Resend](https://resend.com/)
- **Toast** — [Sonner](https://sonner.emilkowal.ski/)
- **Theme** — [next-themes](https://github.com/pacocoursey/next-themes)
- **Asset Storage** — [Git LFS](https://git-lfs.com/) + [Vercel Blob](https://vercel.com/storage/blob)
- **Language** — TypeScript

## Struktur Folder

```
├── src/
│   ├── app/              # Next.js App Router (pages & API routes)
│   ├── components/       # Komponen UI (navbar, viewer, portfolio, dll)
│   └── lib/              # Data layer, i18n, metadata helpers
├── 3D-ASSET/             # File .glb aset 3D (di-track via Git LFS)
├── data/
│   ├── profile.json      # Data profil kreator
│   └── assets-manifest.json  # Manifest aset dengan Blob URL
├── scripts/
│   └── upload-blobs.mjs  # Upload GLB ke Vercel Blob
└── public/               # Static assets
```

## Menambah Aset Baru

1. Taruh file `.glb` di folder yang sesuai dalam `3D-ASSET/`
2. (Opsional) Buat file `<nama-aset>.json` di folder yang sama untuk override metadata
3. Upload ke Vercel Blob: `BLOB_READ_WRITE_TOKEN=xxx node scripts/upload-blobs.mjs`
4. Commit dan push: `git lfs push origin master && git push origin master`

### Format sidecar JSON

```json
{
  "title": "Nama Aset",
  "category": "character",
  "isFeatured": true,
  "descriptionShort": "Deskripsi singkat.",
  "softwareUsed": ["Blender", "ZBrush"],
  "polycount": "~45k triangles",
  "textureResolution": "4K PBR set"
}
```

Kategori valid: `props`, `environment`, `character`, `vehicle`, `other`.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Buat file `.env.local`:

```
RESEND_API_KEY=your_key
CONTACT_EMAIL=your@email.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Build & Deploy

```bash
npm run build   # production build
vercel --prod   # deploy ke Vercel
```

### Branch Strategy

- **`master`** — development. Aset 3D dibaca dari `3D-ASSET/` via route handlers.
- **`vercel-deploy`** — production Vercel. Konfigurasi khusus deployment.

### Upload Aset ke Vercel Blob

```bash
# Dapatkan token dari: Vercel Dashboard → Storage → Blob → .env.local
BLOB_READ_WRITE_TOKEN=xxx node scripts/upload-blobs.mjs
```

Script akan mengupdate `data/assets-manifest.json` dengan Blob URL untuk setiap aset.

## Update Profil

Edit `data/profile.json` untuk mengubah nama, bio, sosial link, dan informasi kontak tanpa perlu ubah kode.
