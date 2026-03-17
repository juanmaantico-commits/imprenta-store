# 🖨️ PrintShop — Imprenta Digital

Tienda online para imprenta con catálogo, carrito, checkout multi-paso, panel admin y base de datos.

---

## 🚀 Instalación local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## 📦 Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para subir.

---

## ☁️ Subir a Cloudflare Pages

1. Subí este proyecto a GitHub (nuevo repositorio)
2. Entrá a **pages.cloudflare.com** → Create a project → Connect to Git
3. Elegí tu repo
4. Configurá:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy** → en 2 minutos tenés tu URL

---

## 🔧 Variables a configurar en `src/App.jsx`

### Cloudinary (subida de archivos de clientes)
```js
const CLD_CLOUD  = "djsmyi5xm";        // ✅ ya configurado
const CLD_PRESET = "TU_UPLOAD_PRESET"; // 🔧 reemplazá con tu preset
```

Para crear el preset:
1. cloudinary.com → Settings → Upload → Add upload preset
2. Signing Mode: **Unsigned**
3. Copiá el nombre del preset

### Supabase (base de datos)
```js
const SB_URL = "TU_SUPABASE_URL";       // 🔧 ej: https://xxxx.supabase.co
const SB_KEY = "TU_SUPABASE_ANON_KEY";  // 🔧 clave anon public
```

#### Tablas SQL a crear en Supabase (SQL Editor):
```sql
create table productos (
  id bigint primary key,
  nombre text,
  categoria text,
  precio numeric,
  unidad text,
  desc text,
  img text,
  opciones jsonb default '[]',
  medias jsonb default '[]'
);

create table pedidos (
  id bigserial primary key,
  fecha timestamptz default now(),
  contacto jsonb,
  items jsonb,
  archivos jsonb,
  total numeric
);

create table config (
  id int primary key default 1,
  banner jsonb
);
```

---

## 📱 Funcionalidades

- ✅ Catálogo de 9 categorías de productos de impresión
- ✅ Buscador y filtros por categoría
- ✅ Checkout multi-paso (resumen → diseños → contacto → confirmado)
- ✅ Subida de archivos hasta 500MB vía Cloudinary
- ✅ Opción "Diseño incluido sin costo"
- ✅ Panel Admin: editar productos, fotos, videos, precios
- ✅ Panel Pedidos: ver todos los pedidos recibidos
- ✅ Banner personalizable (título, colores, imagen de fondo)
- ✅ Base de datos Supabase (productos, pedidos, configuración)
- ✅ Modo demo sin credenciales
