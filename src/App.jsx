import { useState, useRef, useEffect } from "react";

// ── DATOS FALLBACK (se usan solo la primera vez, luego Supabase) ──────────────
const CATEGORIAS = [
  "Todos","Folletos","Tarjetas","Troquelados","Talonarios",
  "Fotos","Impresiones","Stickers","Carpetas","Candy Bar"
];

const PRODUCTOS = [
  { id:1,  nombre:"Folleto A4 Full Color",      categoria:"Folletos",    seccion:"impresiones",  precio:1200, unidad:"x100 unid.",  precios:[], img:"https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",  desc:"Impresión full color doble faz, papel ilustración 115g.", opciones:["A4","A5","A3"] },
  { id:2,  nombre:"Folleto A5 Simple",           categoria:"Folletos",    seccion:"impresiones",  precio:800,  unidad:"x100 unid.",  precios:[], img:"https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80",  desc:"Ideal para publicidad, papel bond 90g.", opciones:["A5","A6"] },
  { id:3,  nombre:"Tarjetas Personales",         categoria:"Tarjetas",    seccion:"terminados",   precio:8000, unidad:"x100 unid.",  precios:[{cantidad:100,opcion:"Simple faz",precio:8000},{cantidad:100,opcion:"Doble faz",precio:11000},{cantidad:200,opcion:"Simple faz",precio:12500},{cantidad:200,opcion:"Doble faz",precio:17000},{cantidad:500,opcion:"Simple faz",precio:24000},{cantidad:500,opcion:"Doble faz",precio:35000}], img:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80", desc:"Tarjetas 9x5cm, plastificado mate o brillo.", opciones:["Simple faz","Doble faz"] },
  { id:4,  nombre:"Tarjetas de Visita Premium",  categoria:"Tarjetas",    seccion:"terminados",   precio:2200, unidad:"x250 unid.",  precios:[], img:"https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",  desc:"Con relieve o foil dorado, papel 350g.", opciones:["Foil Oro","Foil Plata","Relieve"] },
  { id:5,  nombre:"Stickers Troquelados",        categoria:"Stickers",    seccion:"terminados",   precio:950,  unidad:"x200 unid.",  precios:[], img:"https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&q=80",  desc:"Vinilo adherente, troquelado a medida, resistente al agua.", opciones:["Brillante","Mate","Transparente"] },
  { id:6,  nombre:"Sticker Sheet A4",            categoria:"Stickers",    seccion:"terminados",   precio:600,  unidad:"x50 planchas",precios:[], img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",  desc:"Planchas A4 con múltiples diseños, papel adhesivo.", opciones:["Brillante","Mate"] },
  { id:7,  nombre:"Talonario 50 hojas",          categoria:"Talonarios",  seccion:"terminados",   precio:1800, unidad:"x1 talonario",precios:[], img:"https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80",  desc:"Talonarios numerados, papel autocopiante o simple.", opciones:["Simple","Autocopiante 2 vías","Autocopiante 3 vías"] },
  { id:8,  nombre:"Foto 10x15cm",                categoria:"Fotos",       seccion:"impresiones",  precio:120,  unidad:"x unidad",    precios:[], img:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",  desc:"Revelado digital en papel fotográfico 260g.", opciones:["Brillante","Mate","Satinado"] },
  { id:9,  nombre:"Foto 20x30cm",                categoria:"Fotos",       seccion:"impresiones",  precio:450,  unidad:"x unidad",    precios:[], img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",  desc:"Gran formato fotográfico, papel 260g premium.", opciones:["Brillante","Mate"] },
  { id:10, nombre:"Impresión A4 Color",          categoria:"Impresiones", seccion:"impresiones",  precio:80,   unidad:"x hoja",      precios:[], img:"https://images.unsplash.com/photo-1612198790700-0d7ab9f23d72?w=600&q=80",  desc:"Impresión láser color alta resolución.", opciones:["Simple faz","Doble faz"] },
  { id:11, nombre:"Plotter A0 Banner",           categoria:"Impresiones", seccion:"impresiones",  precio:3500, unidad:"x unidad",    precios:[], img:"https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",  desc:"Gran formato para eventos, lona o papel.", opciones:["Lona","Paper","Vinilo"] },
  { id:12, nombre:"Troquelado Especial",         categoria:"Troquelados", seccion:"terminados",   precio:2800, unidad:"x100 unid.",  precios:[], img:"https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=600&q=80",  desc:"Formas personalizadas: corazón, estrella, packaging.", opciones:["Corazón","Estrella","Círculo","Custom"] },
  { id:13, nombre:"Carpeta A4 con Bolsillo",     categoria:"Carpetas",    seccion:"terminados",   precio:3200, unidad:"x50 unid.",   precios:[], img:"https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&q=80",  desc:"Carpeta presentación con bolsillo interior, full color.", opciones:["Mate","Brillante","Plastificado"] },
  { id:14, nombre:"Kit Candy Bar Completo",      categoria:"Candy Bar",   seccion:"terminados",   precio:8500, unidad:"x kit",       precios:[], img:"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80",  desc:"Toppers, etiquetas, cajas, banderines y centros de mesa personalizados.", opciones:["Temático","Clásico","Minimalista"] },
  { id:15, nombre:"Etiquetas Candy Bar",         categoria:"Candy Bar",   seccion:"terminados",   precio:1200, unidad:"x100 unid.",  precios:[], img:"https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&q=80",  desc:"Etiquetas redondas o rectangulares para golosinas.", opciones:["Redonda 4cm","Rect. 5x3cm","Rect. 8x4cm"] },
];

const fmt     = (n) => `$${n.toLocaleString("es-AR")}`;
const fmtSize = (b) => b < 1024*1024 ? (b/1024).toFixed(1)+" KB" : (b/(1024*1024)).toFixed(1)+" MB";

// ── CLOUDINARY ────────────────────────────────────────────────────────────────
const CLD_CLOUD  = "djsmyi5xm";
const CLD_PRESET = "imprenta_uploads"; // 🔧 reemplazá con tu preset unsigned

async function subirCLD(file, onProgress) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLD_PRESET);

  const isVideo = file.type.startsWith("video/");

  const endpoint = isVideo
    ? `https://api.cloudinary.com/v1_1/${CLD_CLOUD}/video/upload`
    : `https://api.cloudinary.com/v1_1/${CLD_CLOUD}/image/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = e => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        console.error("Cloudinary error:", xhr.responseText);
        reject(new Error("Error " + xhr.status));
      }
    };

    xhr.onerror = () => reject(new Error("Error de red"));
    xhr.send(fd);
  });
}

// ── SUPABASE CONFIG ───────────────────────────────────────────────────────────
// 🔧 Reemplazá con tus credenciales de supabase.com/dashboard → Settings → API
const SB_URL    = "https://fkgadtjlbdkuevewcibp.supabase.co";   // ej: https://xxxx.supabase.co
const SB_KEY    = "sb_publishable_kD8Mqzmlkf619HXT_VW0pw_NkkQbpVZ"; // clave "anon public"

const sbHeaders = { "Content-Type":"application/json", "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` };
const sbFetch   = (path, opts={}) => fetch(`${SB_URL}/rest/v1${path}`, { ...opts, headers: { ...sbHeaders, ...(opts.headers||{}) } });

// ── DB: PRODUCTOS ─────────────────────────────────────────────────────────────
const db = {
  async getProductos() {
  const r = await sbFetch("/productos?order=id");
  if (!r.ok) return null;
  const rows = await r.json();
  return rows.map(row => ({
    ...row,
    opciones: row.opciones||[],
    medias: row.medias||[],
    precios: row.precios||[],
    seccion: row.seccion||"impresiones"
  }));
},
  async upsertProducto(p) {
  const body = JSON.stringify({
    id: p.id, nombre: p.nombre, categoria: p.categoria, precio: p.precio,
    unidad: p.unidad, descripcion: p.descripcion, img: p.img,
    opciones: p.opciones, medias: p.medias, precios: p.precios||[],
    seccion: p.seccion||"impresiones"
  });
  return sbFetch("/productos", { method:"POST", body, headers:{ "Prefer":"resolution=merge-duplicates" } });
},
  async deleteProducto(id) {
    return sbFetch(`/productos?id=eq.${id}`, { method:"DELETE" });
  },
  async getConfig() {
    const r = await sbFetch("/config?id=eq.1");
    if (!r.ok) return null;
    const rows = await r.json();
    return rows[0] || null;
  },
  async saveConfig(data) {
    const body = JSON.stringify({ id:1, banner: data.banner });
    return sbFetch("/config", { method:"POST", body, headers:{ "Prefer":"resolution=merge-duplicates" } });
  },
  async savePedido(pedido) {
    const body = JSON.stringify({ ...pedido, fecha: new Date().toISOString() });
    return sbFetch("/pedidos", { method:"POST", body, headers:{ "Prefer":"return=representation" } });
  },
  async getPedidos() {
    const r = await sbFetch("/pedidos?order=fecha.desc");
    if (!r.ok) return [];
    return r.json();
  },
};

const DEMO_MODE = SB_URL === "TU_SUPABASE_URL";

// ── ICONS ─────────────────────────────────────────────────────────────────────
const Ico = ({d,s=20,sw=1.8,fill="none"}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);
const IcoCart    = () => <Ico d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>;
const IcoUp      = () => <Ico d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>;
const IcoX       = () => <Ico d="M18 6L6 18M6 6l12 12" s={18}/>;
const IcoPlus    = () => <Ico d="M12 5v14M5 12h14" s={16}/>;
const IcoMinus   = () => <Ico d="M5 12h14" s={16}/>;
const IcoTrash   = () => <Ico d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" s={16}/>;
const IcoEye     = () => <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z" s={15}/>;
const IcoPrint   = () => <Ico d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" s={18}/>;
const IcoCheck   = () => <Ico d="M20 6L9 17l-5-5" s={20} sw={2.5}/>;
const IcoSearch  = () => <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" s={18}/>;
const IcoPencil  = () => <Ico d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" s={17}/>;
const IcoRefresh = () => <Ico d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" s={16}/>;
const IcoArrow   = () => <Ico d="M5 12h14M12 5l7 7-7 7" s={17}/>;
const IcoBrush   = () => <Ico d="M20.84 4.61a5.5 5.5 0 00-7.78 0L3 14.67V21h6.33l10.06-10.06a5.5 5.5 0 000-7.78zM16 5l3 3" s={16}/>;
const IcoAdmin   = () => <Ico d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" s={17}/>;
const IcoVideo   = () => <Ico d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" s={15}/>;
const IcoImage   = () => <Ico d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" s={15}/>;
const IcoLock    = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" s={16}/>;
const IcoInbox   = () => <Ico d="M22 12h-6l-2 3H10l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" s={17}/>;

// ── PANEL PEDIDOS ─────────────────────────────────────────────────────────────
function PedidosPanel({ onClose }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel]         = useState(null);

  useEffect(()=>{
    (async()=>{
      if (DEMO_MODE) {
        setPedidos([
          { id:1, fecha:"2025-03-10T14:30:00", contacto:{nombre:"María García",telefono:"+54 11 1234-5678",email:"maria@mail.com",notas:"Para el viernes"}, items:[{nombre:"Folleto A4 Full Color",qty:2,precio:1200,opcionSeleccionada:"A4"}], archivos:[{modo:"propio",file:{nombre:"flyer.pdf"}}], total:2400 },
          { id:2, fecha:"2025-03-11T09:15:00", contacto:{nombre:"Juan López",telefono:"+54 11 8765-4321",email:"",notas:""}, items:[{nombre:"Tarjetas Personales",qty:1,precio:1500,opcionSeleccionada:"Mate"},{nombre:"Stickers Troquelados",qty:3,precio:950,opcionSeleccionada:"Brillante"}], archivos:[{modo:"diseño"},{modo:"propio",file:{nombre:"logo.ai"}}], total:4350 },
        ]);
      } else {
        const data = await db.getPedidos();
        setPedidos(data);
      }
      setLoading(false);
    })();
  },[]);

  const fmt2 = (d) => new Date(d).toLocaleString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:250,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(8px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0d0d10",border:"1px solid #1f2937",borderRadius:22,width:"100%",maxWidth:860,maxHeight:"92vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"18px 24px",borderBottom:"1px solid #1a1a24",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:"rgba(139,92,246,0.12)",borderRadius:9,padding:8,color:"#8b5cf6",display:"flex"}}><IcoInbox/></div>
            <div>
              <h2 style={{margin:0,color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:18}}>Pedidos recibidos</h2>
              <p style={{margin:0,color:"#374151",fontSize:11}}>{pedidos.length} pedido{pedidos.length!==1?"s":""}{DEMO_MODE?" · modo demo":""}</p>
            </div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#475569",cursor:"pointer"}}><IcoX/></button>
        </div>
        <div style={{flex:1,overflowY:"auto",display:"flex",minHeight:0}}>
          {/* Lista */}
          <div style={{width:sel?280:"100%",minWidth:220,borderRight:sel?"1px solid #1a1a24":"none",overflowY:"auto",padding:12}}>
            {loading && <p style={{color:"#374151",textAlign:"center",padding:"40px 0",fontSize:13}}>Cargando pedidos…</p>}
            {!loading && pedidos.length===0 && <p style={{color:"#374151",textAlign:"center",padding:"40px 0",fontSize:13}}>Sin pedidos aún.</p>}
            {pedidos.map((p,idx)=>{
              const tot = p.total || p.items?.reduce((s,i)=>s+i.precio*i.qty,0)||0;
              return (
                <div key={p.id||idx} onClick={()=>setSel(p)}
                  style={{padding:"12px 14px",borderRadius:12,cursor:"pointer",marginBottom:6,background:sel?.id===p.id?"rgba(139,92,246,0.1)":"#111118",border:`1px solid ${sel?.id===p.id?"#8b5cf6":"#1a1a24"}`,transition:"all 0.2s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{color:"#e2e8f0",fontSize:13,fontWeight:600}}>{p.contacto?.nombre||"Cliente"}</span>
                    <span style={{color:"#8b5cf6",fontSize:12,fontFamily:"monospace",fontWeight:700}}>${tot.toLocaleString()}</span>
                  </div>
                  <p style={{margin:"0 0 3px",color:"#475569",fontSize:11}}>{fmt2(p.fecha)}</p>
                  <p style={{margin:0,color:"#374151",fontSize:11}}>{p.items?.length||0} producto{p.items?.length!==1?"s":""}</p>
                </div>
              );
            })}
          </div>
          {/* Detalle pedido */}
          {sel && (
            <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
                <div>
                  <h3 style={{margin:"0 0 4px",color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:17}}>{sel.contacto?.nombre}</h3>
                  <p style={{margin:"0 0 2px",color:"#0ea5e9",fontSize:13}}>📱 {sel.contacto?.telefono}</p>
                  {sel.contacto?.email && <p style={{margin:"0 0 2px",color:"#475569",fontSize:12}}>✉ {sel.contacto.email}</p>}
                  {sel.contacto?.notas && <p style={{margin:"4px 0 0",color:"#64748b",fontSize:12,fontStyle:"italic"}}>"{sel.contacto.notas}"</p>}
                </div>
                <span style={{color:"#475569",fontSize:11,textAlign:"right"}}>{fmt2(sel.fecha)}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {(sel.items||[]).map((item,ii)=>{
                  const arch = (sel.archivos||[])[ii];
                  return (
                    <div key={ii} style={{background:"#111118",border:"1px solid #1a1a24",borderRadius:12,padding:"12px 14px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{color:"#e2e8f0",fontSize:13,fontWeight:600}}>{item.nombre}</span>
                        <span style={{color:"#0ea5e9",fontFamily:"monospace",fontSize:13,fontWeight:700}}>${(item.precio*item.qty).toLocaleString()}</span>
                      </div>
                      <p style={{margin:"0 0 4px",color:"#475569",fontSize:11}}>{item.opcionSeleccionada} · qty {item.qty}</p>
                      {arch && (
                        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:arch.modo==="diseño"?"rgba(167,139,250,0.08)":"rgba(34,197,94,0.06)",border:`1px solid ${arch.modo==="diseño"?"rgba(167,139,250,0.2)":"rgba(34,197,94,0.2)"}`,borderRadius:7,padding:"3px 10px"}}>
                          <span style={{fontSize:11,color:arch.modo==="diseño"?"#a78bfa":"#22c55e",fontWeight:600}}>
                            {arch.modo==="diseño"?"🎨 Diseño incluido":`📎 ${arch.file?.nombre||"Archivo adjunto"}`}
                          </span>
                          {arch.file?.url && arch.file.url!=="DEMO_URL" && (
                            <a href={arch.file.url} target="_blank" rel="noreferrer" style={{color:"#0ea5e9",fontSize:10,textDecoration:"none"}}>↗ ver</a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:16,background:"#111118",border:"1px solid #1a1a24",borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between"}}>
                <span style={{color:"#64748b",fontSize:14}}>Total del pedido</span>
                <span style={{color:"#f1f5f9",fontWeight:800,fontSize:18,fontFamily:"monospace"}}>${(sel.total||(sel.items||[]).reduce((s,i)=>s+i.precio*i.qty,0)).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
        {DEMO_MODE && (
          <div style={{padding:"10px 24px",borderTop:"1px solid #1a1a24",background:"rgba(245,158,11,0.05)"}}>
            <p style={{margin:0,color:"#f59e0b",fontSize:11,textAlign:"center"}}>⚠ Modo demo — conectá Supabase para ver pedidos reales</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MEDIA UPLOAD (para admin) ─────────────────────────────────────────────────
function MediaUpload({ label, accept, onFile, preview, tipo }) {
  const isVideo = tipo === "video";
  return (
    <div>
      <label style={{color:"#64748b",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>{label}</label>
      <label style={{display:"block",cursor:"pointer",borderRadius:10,overflow:"hidden",position:"relative"}}>
        {preview
          ? isVideo
            ? <video src={preview} style={{width:"100%",height:130,objectFit:"cover",display:"block",background:"#111"}} muted/>
            : <img src={preview} alt="" style={{width:"100%",height:130,objectFit:"cover",display:"block"}}/>
          : <div style={{width:"100%",height:130,background:"#0a0a0f",border:"2px dashed #1f2937",borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
              <div style={{color:"#374151"}}>{isVideo?<IcoVideo/>:<IcoImage/>}</div>
              <span style={{color:"#374151",fontSize:12}}>{isVideo?"Subir video":"Subir imagen"}</span>
              <span style={{color:"#2a3545",fontSize:10}}>click para elegir</span>
            </div>
        }
        {preview && (
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
            <span style={{color:"#fff",fontSize:12,background:"rgba(0,0,0,0.6)",padding:"6px 12px",borderRadius:8}}>Cambiar</span>
          </div>
        )}
        <input type="file" accept={accept} style={{display:"none"}} onChange={async e=>{
  const f=e.target.files[0];
  if(!f) return;
  onFile(f, URL.createObjectURL(f));
  if(CLD_PRESET !== "TU_UPLOAD_PRESET"){
    try{
      const res = await subirCLD(f, ()=>{});
      onFile(f, res.secure_url);
    } catch(e){ console.error("Error Cloudinary:", e); }
  }
}}/>
      </label>
    </div>
  );
}

// ── PANEL ADMINISTRACIÓN ──────────────────────────────────────────────────────
function AdminPanel({ productos, onSave, onClose }) {
  const [lista, setLista]       = useState(productos.map(p=>({...p, medias: p.medias||[{tipo:"image",src:p.img,principal:true}] })));
  const [editIdx, setEditIdx]   = useState(null);
  const [editData, setEditData] = useState(null);
  const [nuevaOpcion, setNuevaOpcion] = useState("");
  const [showNew, setShowNew]   = useState(false);
  const [newProd, setNewProd]   = useState({ nombre:"", categoria:"Folletos", precio:"", unidad:"x100 unid.", desc:"", opciones:[""], medias:[] });

  const abrirEditor = (idx) => {
    const p = lista[idx];
    setEditIdx(idx);
    setEditData({ ...p, medias: p.medias||[{tipo:"image",src:p.img,principal:true}] });
  };

  const set = (k,v) => setEditData(p=>({...p,[k]:v}));

  const guardarProducto = async () => {
    const mediasActualizadas = await Promise.all(
      editData.medias.map(async (m) => {
        if (m.src && m.src.startsWith("blob:") && m._file) {
          try {
            const res = await subirCLD(m._file, ()=>{});
            return { ...m, src: res.secure_url };
          } catch(e) { return m; }
        }
        return m;
      })
    );
    const editActualizado = { ...editData, medias: mediasActualizadas };
    const updated = lista.map((p,i)=>i===editIdx?{
      ...editActualizado,
      img: mediasActualizadas.find(m=>m.principal&&m.tipo==="image")?.src || mediasActualizadas.find(m=>m.tipo==="image")?.src || editData.img,
    }:p);
    setLista(updated);
    setEditIdx(null);
    setEditData(null);
  };

  const agregarMedia = (file, url, tipo) => {
    const nueva = { tipo, src: url, nombre: file.name, principal: editData.medias.length===0, _file: file };
    setEditData(p=>({...p, medias:[...p.medias, nueva]}));
  };

  const setPrincipal = (mIdx) => {
    setEditData(p=>({...p, medias: p.medias.map((m,i)=>({...m, principal: i===mIdx && m.tipo==="image"}))}));
  };

  const quitarMedia = (mIdx) => {
    setEditData(p=>({...p, medias: p.medias.filter((_,i)=>i!==mIdx)}));
  };

  const eliminarProducto = (idx) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    setLista(prev=>prev.filter((_,i)=>i!==idx));
  };

  const agregarProducto = () => {
    const id = Date.now();
    const p = { ...newProd, id, precio:+newProd.precio||0,
      img: newProd.medias[0]?.src || "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",
      opciones: newProd.opciones.filter(Boolean) };
    setLista(prev=>[...prev, p]);
    setShowNew(false);
    setNewProd({ nombre:"", categoria:"Folletos", precio:"", unidad:"x100 unid.", desc:"", opciones:[""], medias:[] });
  };

  const inp = (v, onChange, ph="", type="text") => ({
    value:v, onChange:e=>onChange(e.target.value), placeholder:ph, type,
    style:{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}
  });

  const lbl = (t) => <label style={{color:"#64748b",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>{t}</label>;

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:250,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(8px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0d0d10",border:"1px solid #1f2937",borderRadius:22,width:"100%",maxWidth:900,maxHeight:"95vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Header */}
        <div style={{padding:"18px 24px",borderBottom:"1px solid #1a1a24",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:"rgba(245,158,11,0.12)",borderRadius:9,padding:8,color:"#f59e0b",display:"flex"}}><IcoAdmin/></div>
            <div>
              <h2 style={{margin:0,color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:18}}>Panel de Administración</h2>
              <p style={{margin:0,color:"#374151",fontSize:11}}>{lista.length} productos · solo vos ves esto</p>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowNew(true)} style={{display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:9,padding:"8px 14px",color:"#fff",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:700}}>
              <IcoPlus/> Nuevo producto
            </button>
            <button onClick={()=>{onSave(lista);onClose();}} style={{background:"#22c55e",border:"none",borderRadius:9,padding:"8px 16px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
              Guardar todo
            </button>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#475569",cursor:"pointer"}}><IcoX/></button>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",display:"flex",minHeight:0}}>

          {/* Lista de productos */}
          <div style={{width:editIdx!==null?260:"100%",minWidth:220,borderRight:editIdx!==null?"1px solid #1a1a24":"none",overflowY:"auto",padding:"12px"}}>
            {lista.map((p,idx)=>(
              <div key={p.id} onClick={()=>abrirEditor(idx)}
                style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",borderRadius:12,cursor:"pointer",marginBottom:6,background:editIdx===idx?"rgba(14,165,233,0.1)":"#111118",border:`1px solid ${editIdx===idx?"#0ea5e9":"#1a1a24"}`,transition:"all 0.2s"}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <img src={p.img} alt={p.nombre} style={{width:44,height:44,objectFit:"cover",borderRadius:8}}/>
                  {p.medias?.some(m=>m.tipo==="video") && (
                    <div style={{position:"absolute",bottom:-2,right:-2,background:"#0ea5e9",borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><IcoVideo/></div>
                  )}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:"0 0 2px",color:"#e2e8f0",fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nombre}</p>
                  <p style={{margin:0,color:"#475569",fontSize:11}}>{p.categoria} · ${p.precio.toLocaleString()}</p>
                </div>
                <button onClick={e=>{e.stopPropagation();eliminarProducto(idx);}}
                  style={{background:"none",border:"none",color:"#374151",cursor:"pointer",padding:4,display:"flex",flexShrink:0}}>
                  <IcoTrash/>
                </button>
              </div>
            ))}
          </div>

          {/* Editor de producto */}
          {editIdx!==null && editData && (
            <div style={{flex:1,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h3 style={{margin:0,color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:16}}>Editando: {editData.nombre}</h3>
                <button onClick={guardarProducto} style={{background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:9,padding:"8px 18px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
                  Aplicar cambios
                </button>
              </div>

              {/* Medias */}
              <div>
                {lbl("Fotos y videos del producto")}
                {/* Galería existente */}
                {editData.medias.length > 0 && (
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                    {editData.medias.map((m,mi)=>(
                      <div key={mi} style={{position:"relative",width:90,height:90,borderRadius:10,overflow:"hidden",border:`2px solid ${m.principal?"#0ea5e9":"#1f2937"}`,flexShrink:0}}>
                        {m.tipo==="video"
                          ? <video src={m.src} style={{width:"100%",height:"100%",objectFit:"cover"}} muted/>
                          : <img src={m.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        }
                        {/* Overlay */}
                        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,opacity:0,transition:"opacity 0.2s"}}
                          onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
                          {m.tipo==="image" && !m.principal && (
                            <button onClick={()=>setPrincipal(mi)} style={{background:"#0ea5e9",border:"none",borderRadius:6,padding:"3px 8px",color:"#fff",cursor:"pointer",fontSize:10,fontWeight:700}}>★ Principal</button>
                          )}
                          <button onClick={()=>quitarMedia(mi)} style={{background:"#ef4444",border:"none",borderRadius:6,padding:"3px 8px",color:"#fff",cursor:"pointer",fontSize:10,fontWeight:700}}>Quitar</button>
                        </div>
                        {m.principal && <div style={{position:"absolute",top:4,left:4,background:"#0ea5e9",borderRadius:4,padding:"1px 5px",fontSize:9,color:"#fff",fontWeight:700}}>★</div>}
                        {m.tipo==="video" && <div style={{position:"absolute",bottom:4,right:4,color:"#fff"}}><IcoVideo/></div>}
                      </div>
                    ))}
                  </div>
                )}
                {/* Agregar medias */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <MediaUpload label="+ Agregar imagen" accept="image/*" tipo="image"
                    onFile={(f,url)=>agregarMedia(f,url,"image")}/>
                  <MediaUpload label="+ Agregar video" accept="video/*" tipo="video"
                    onFile={(f,url)=>agregarMedia(f,url,"video")}/>
                </div>
              </div>

              {/* Editor de precios por cantidad */}
<div>
  {lbl("Precios por cantidad y opción")}
  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:8}}>
    {(editData.precios||[]).map((pr,pi)=>(
      <div key={pi} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:8,alignItems:"center",background:"#0d0d10",border:"1px solid #1f2937",borderRadius:8,padding:"8px 10px"}}>
        <div>
          <label style={{color:"#475569",fontSize:10,display:"block",marginBottom:3}}>Cantidad</label>
          <input type="number" value={pr.cantidad}
            onChange={e=>set("precios",editData.precios.map((p,i)=>i===pi?{...p,cantidad:+e.target.value}:p))}
            style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:6,padding:"6px 8px",color:"#e2e8f0",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
        </div>
        <div>
          <label style={{color:"#475569",fontSize:10,display:"block",marginBottom:3}}>Opción</label>
          <input value={pr.opcion}
            onChange={e=>set("precios",editData.precios.map((p,i)=>i===pi?{...p,opcion:e.target.value}:p))}
            placeholder="Ej: Simple faz"
            style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:6,padding:"6px 8px",color:"#e2e8f0",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
        </div>
        <div>
          <label style={{color:"#475569",fontSize:10,display:"block",marginBottom:3}}>Precio $</label>
          <input type="number" value={pr.precio}
            onChange={e=>set("precios",editData.precios.map((p,i)=>i===pi?{...p,precio:+e.target.value}:p))}
            style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:6,padding:"6px 8px",color:"#e2e8f0",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
        </div>
        <button onClick={()=>set("precios",editData.precios.filter((_,i)=>i!==pi))}
          style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:"4px",display:"flex",alignSelf:"flex-end",marginBottom:2}}>
          <IcoTrash/>
        </button>
      </div>
    ))}
  </div>
  <button onClick={()=>set("precios",[...(editData.precios||[]),{cantidad:100,opcion:"Simple faz",precio:0}])}
    style={{background:"#111118",border:"1px dashed #1f2937",borderRadius:8,padding:"7px 14px",color:"#475569",cursor:"pointer",fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
    <IcoPlus/> Agregar precio
  </button>
</div>
              {/* Campos de texto */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{gridColumn:"1/-1"}}>{lbl("Nombre del producto")}<input {...inp(editData.nombre,v=>set("nombre",v),"Nombre")}/></div>
                <div>{lbl("Precio (ARS)")}<input {...inp(editData.precio,v=>set("precio",+v||0),"0","number")}/></div>
                <div>{lbl("Unidad")}<input {...inp(editData.unidad,v=>set("unidad",v),"x100 unid.")}/></div>
                <div>
                  {lbl("Categoría")}
                  <select value={editData.categoria} onChange={e=>set("categoria",e.target.value)}
                    style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit"}}>
                    {CATEGORIAS.filter(c=>c!=="Todos").map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{gridColumn:"1/-1"}}>
                  {lbl("Descripción")}
                  <textarea value={editData.desc} onChange={e=>set("desc",e.target.value)} rows={2}
                    style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/>
                </div>
                <div style={{gridColumn:"1/-1"}}>
                  {lbl("Opciones / Acabados")}
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                    {editData.opciones.map((op,oi)=>(
                      <div key={oi} style={{display:"flex",alignItems:"center",gap:4,background:"#1a1a24",border:"1px solid #1f2937",borderRadius:7,padding:"4px 8px 4px 10px"}}>
                        <input value={op} onChange={e=>set("opciones",editData.opciones.map((o,i)=>i===oi?e.target.value:o))}
                          style={{background:"none",border:"none",color:"#e2e8f0",fontSize:12,outline:"none",width:80,fontFamily:"inherit"}}/>
                        <button onClick={()=>set("opciones",editData.opciones.filter((_,i)=>i!==oi))}
                          style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:0,display:"flex",lineHeight:1}}>×</button>
                      </div>
                    ))}
                    <button onClick={()=>set("opciones",[...editData.opciones,""])}
                      style={{background:"#111118",border:"1px dashed #1f2937",borderRadius:7,padding:"4px 12px",color:"#475569",cursor:"pointer",fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                      <IcoPlus/> Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder cuando no hay selección */}
          {editIdx===null && !showNew && (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#2a3545",gap:12}}>
              <IcoPencil/>
              <p style={{fontSize:14,color:"#374151"}}>Seleccioná un producto para editarlo</p>
            </div>
          )}
        </div>

        {/* Modal nuevo producto */}
        {showNew && (
          <div onClick={()=>setShowNew(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.85)",borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",padding:20,zIndex:10}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#0f0f14",border:"1px solid #1f2937",borderRadius:18,maxWidth:520,width:"100%",maxHeight:"85vh",overflowY:"auto",padding:"22px 24px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                <h3 style={{margin:0,color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:17}}>Nuevo producto</h3>
                <button onClick={()=>setShowNew(false)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer"}}><IcoX/></button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <MediaUpload label="Imagen principal" accept="image/*" tipo="image"
                  preview={newProd.medias[0]?.src}
                  onFile={(f,url)=>setNewProd(p=>({...p,medias:[{tipo:"image",src:url,principal:true}]}))}/>
                <div>{lbl("Nombre")}<input {...inp(newProd.nombre,v=>setNewProd(p=>({...p,nombre:v})),"Ej: Folleto A4")}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div>{lbl("Precio")}<input {...inp(newProd.precio,v=>setNewProd(p=>({...p,precio:v})),"0","number")}/></div>
                  <div>{lbl("Unidad")}<input {...inp(newProd.unidad,v=>setNewProd(p=>({...p,unidad:v})),"x100 unid.")}/></div>
                </div>
                <div>
                  {lbl("Categoría")}
                  <select value={newProd.categoria} onChange={e=>setNewProd(p=>({...p,categoria:e.target.value}))}
                    style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit"}}>
                    {CATEGORIAS.filter(c=>c!=="Todos").map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  {lbl("Descripción")}
                  <textarea value={newProd.desc} onChange={e=>setNewProd(p=>({...p,desc:e.target.value}))} rows={2}
                    style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/>
                </div>
                <div>
                  {lbl("Opciones")}
                  {newProd.opciones.map((op,oi)=>(
                    <input key={oi} value={op} onChange={e=>setNewProd(p=>({...p,opciones:p.opciones.map((o,i)=>i===oi?e.target.value:o)}))}
                      placeholder={`Opción ${oi+1}`}
                      style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit",marginBottom:6,boxSizing:"border-box"}}/>
                  ))}
                  <button onClick={()=>setNewProd(p=>({...p,opciones:[...p.opciones,""]}))}
                    style={{background:"none",border:"1px dashed #1f2937",borderRadius:7,padding:"6px 14px",color:"#475569",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
                    + Agregar opción
                  </button>
                </div>
                <button onClick={agregarProducto} disabled={!newProd.nombre||!newProd.precio}
                  style={{background:(!newProd.nombre||!newProd.precio)?"#1a1a24":"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:10,padding:"12px",color:(!newProd.nombre||!newProd.precio)?"#374151":"#fff",fontWeight:800,cursor:(!newProd.nombre||!newProd.precio)?"not-allowed":"pointer",fontSize:14,fontFamily:"inherit"}}>
                  Crear producto
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  return (
    <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",color:"#fff",borderRadius:12,padding:"12px 22px",fontWeight:700,zIndex:400,display:"flex",gap:10,alignItems:"center",boxShadow:"0 8px 40px rgba(14,165,233,0.4)",fontSize:14,whiteSpace:"nowrap"}}>
      <IcoCheck/> {msg}
    </div>
  );
}

// ── UPLOAD WIDGET ─────────────────────────────────────────────────────────────
function UploadWidget({ value, onChange }) {
  const [estado, setEstado]   = useState(value ? "done" : "idle");
  const [progreso, setProg]   = useState(0);
  const [archivo, setArchivo] = useState(value || null);
  const [err, setErr]         = useState("");
  const accept=".jpg,.jpeg,.png,.pdf,.ai,.psd,.tiff,.eps,.svg,.zip,.rar,.mp4,.mov,.avi,.webm";

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > 500*1024*1024) { setErr("El archivo supera los 500MB"); setEstado("error"); return; }
    const info = { nombre: file.name, tamaño: file.size };
    setArchivo(info); setEstado("uploading"); setProg(0); setErr("");

    if (CLD_PRESET === "TU_UPLOAD_PRESET") {
      for (let i=0; i<=100; i+=10) { await new Promise(r=>setTimeout(r,100)); setProg(i); }
      const result = { ...info, url:"DEMO_URL" };
      setEstado("done"); onChange(result);
      return;
    }
    try {
      const res = await subirCLD(file, setProg);
      const result = { ...info, url: res.secure_url };
      setEstado("done"); onChange(result);
    } catch(e) { setErr(e.message); setEstado("error"); }
  };

  const reset = () => { setEstado("idle"); setArchivo(null); setProg(0); setErr(""); onChange(null); };

  return (
    <div>
      {estado==="idle" && (
        <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0]);}}
          style={{border:"2px dashed #1f2937",borderRadius:11,padding:"18px 14px",textAlign:"center",background:"#0a0a0f"}}>
          <div style={{color:"#374151",marginBottom:6,display:"flex",justifyContent:"center"}}><IcoUp/></div>
          <p style={{margin:"0 0 3px",color:"#475569",fontSize:12,fontWeight:600}}>Arrastrá tu archivo aquí</p>
          <p style={{margin:"0 0 12px",color:"#2a3545",fontSize:11}}>JPG · PNG · PDF · AI · PSD · EPS · ZIP — hasta 500MB</p>
          <label style={{display:"inline-flex",alignItems:"center",gap:6,background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"7px 16px",color:"#64748b",fontSize:12,cursor:"pointer"}}>
            <IcoUp/> Elegir archivo
            <input type="file" accept={ACCEPT} style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          </label>
          {CLD_PRESET==="TU_UPLOAD_PRESET" && <p style={{margin:"8px 0 0",color:"#2a3545",fontSize:10,fontStyle:"italic"}}>⚠ Modo demo activo</p>}
        </div>
      )}
      {estado==="uploading" && (
        <div style={{background:"#0a0a0f",border:"1px solid #1f2937",borderRadius:11,padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
            <span style={{color:"#94a3b8",fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{archivo?.nombre}</span>
            <span style={{color:"#0ea5e9",fontFamily:"monospace",fontSize:12,fontWeight:700}}>{progreso}%</span>
          </div>
          <div style={{background:"#1a1a24",borderRadius:5,height:5,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(90deg,#0ea5e9,#38bdf8)",height:"100%",width:`${progreso}%`,borderRadius:5,transition:"width 0.15s"}}/>
          </div>
          <p style={{margin:"6px 0 0",color:"#374151",fontSize:11}}>Subiendo… {fmtSize(archivo?.tamaño||0)}</p>
        </div>
      )}
      {estado==="done" && (
        <div style={{background:"rgba(34,197,94,0.05)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:11,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
          <div style={{minWidth:0}}>
            <p style={{margin:"0 0 1px",color:"#22c55e",fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>✓ {archivo?.nombre}</p>
            <p style={{margin:0,color:"#374151",fontSize:11}}>{fmtSize(archivo?.tamaño||0)} · {CLD_PRESET==="TU_UPLOAD_PRESET"?"Demo":"Cloudinary"}</p>
          </div>
          <button onClick={reset} style={{flexShrink:0,background:"none",border:"1px solid #1f2937",borderRadius:7,padding:"4px 10px",color:"#475569",cursor:"pointer",fontSize:11}}>Cambiar</button>
        </div>
      )}
      {estado==="error" && (
        <div style={{background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:11,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{margin:0,color:"#ef4444",fontSize:12}}>✕ {err}</p>
          <button onClick={reset} style={{background:"none",border:"1px solid #3a1a1a",borderRadius:7,padding:"4px 10px",color:"#ef4444",cursor:"pointer",fontSize:11}}>Reintentar</button>
        </div>
      )}
    </div>
  );
}

// ── CHECKOUT MULTI-PASO ───────────────────────────────────────────────────────
function CheckoutModal({ items, onClose, onDone, onUpdateQty, onRemove }) {
  const [paso, setPaso]         = useState(1);
  const [archivos, setArchivos] = useState(() => items.map(()=>({ modo:null, file:null })));
  const [contacto, setContacto] = useState({ nombre:"", telefono:"", email:"", notas:"" });
  const [errC, setErrC]         = useState({});

  const total       = items.reduce((s,i)=>s+i.precio*i.qty, 0);
  const PASOS       = ["Resumen","Diseños","Contacto","¡Listo!"];
  const todosListos = archivos.length > 0 && archivos.every(a=>a.modo!==null) &&
    archivos.every((a,i)=> i >= items.length || a.modo !== null) &&
    archivos.slice(0, items.length).every(a => a.modo !== null);

  const setArchivoIdx = (idx, data) =>
    setArchivos(prev => prev.map((a,i)=>i===idx?{...a,...data}:a));

  const validarContacto = () => {
    const e = {};
    if (!contacto.nombre.trim())   e.nombre   = "Requerido";
    if (!contacto.telefono.trim()) e.telefono = "Requerido";
    setErrC(e);
    return Object.keys(e).length === 0;
  };

  const inp = (k) => ({
    value: contacto[k],
    onChange: e => setContacto(p=>({...p,[k]:e.target.value})),
    style: {width:"100%",background:"#111118",border:`1px solid ${errC[k]?"#ef4444":"#1f2937"}`,borderRadius:9,padding:"10px 13px",color:"#e2e8f0",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}
  });

  const StepBar = () => (
    <div style={{display:"flex",alignItems:"flex-start",gap:0}}>
      {PASOS.map((lbl,i)=>{
        const num=i+1, activo=num===paso, hecho=num<paso;
        return (
          <div key={lbl} style={{display:"flex",alignItems:"center",flex:i<PASOS.length-1?1:"none"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,minWidth:56}}>
              <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,background:hecho?"#22c55e":activo?"linear-gradient(135deg,#0ea5e9,#38bdf8)":"#111118",border:`2px solid ${hecho?"#22c55e":activo?"#0ea5e9":"#1f2937"}`,color:(hecho||activo)?"#fff":"#374151",transition:"all 0.3s",flexShrink:0}}>
                {hecho?<IcoCheck/>:num}
              </div>
              <span style={{fontSize:9,color:activo?"#0ea5e9":hecho?"#22c55e":"#374151",fontWeight:activo?700:400,whiteSpace:"nowrap",letterSpacing:"0.05em",textTransform:"uppercase"}}>{lbl}</span>
            </div>
            {i<PASOS.length-1 && <div style={{flex:1,height:2,background:hecho?"#22c55e":"#1a1a24",margin:"14px 2px 0",transition:"background 0.3s"}}/>}
          </div>
        );
      })}
    </div>
  );

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0d0d10",border:"1px solid #1f2937",borderRadius:22,maxWidth:620,width:"100%",maxHeight:"94vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Header */}
        <div style={{padding:"20px 24px 16px",borderBottom:"1px solid #1a1a24",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:paso<4?16:0}}>
            <h2 style={{margin:0,color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:18}}>
              {paso===4?"¡Pedido enviado!":"Finalizar pedido"}
            </h2>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#475569",cursor:"pointer"}}><IcoX/></button>
          </div>
          {paso<4 && <StepBar/>}
        </div>

        {/* Cuerpo */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>

          {/* PASO 1 — RESUMEN */}
          {paso===1 && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <p style={{margin:"0 0 6px",color:"#64748b",fontSize:13}}>Revisá tu pedido. Podrás subir tus diseños en el siguiente paso.</p>
              {items.map((item,idx)=>(
                <div key={idx} style={{background:"#111118",border:"1px solid #1a1a24",borderRadius:14,padding:14,display:"flex",gap:12}}>
                  <img src={item.img} alt={item.nombre} style={{width:62,height:62,objectFit:"cover",borderRadius:10,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:"0 0 2px",color:"#e2e8f0",fontSize:14,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.nombre}</p>
                    <p style={{margin:"0 0 8px",color:"#475569",fontSize:12}}>{item.opcionSeleccionada} · {item.unidad}</p>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",background:"#0d0d10",border:"1px solid #1f2937",borderRadius:8,overflow:"hidden"}}>
                        <button onClick={()=>onUpdateQty(idx,-1)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",padding:"5px 11px",display:"flex"}}><IcoMinus/></button>
                        <span style={{color:"#f1f5f9",minWidth:24,textAlign:"center",fontSize:13,fontWeight:700}}>{item.qty}</span>
                        <button onClick={()=>onUpdateQty(idx,1)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",padding:"5px 11px",display:"flex"}}><IcoPlus/></button>
                      </div>
                      <span style={{color:"#0ea5e9",fontFamily:"monospace",fontWeight:700,fontSize:14,marginLeft:"auto"}}>{fmt(item.precio*item.qty)}</span>
                      <button onClick={()=>{onRemove(idx);setArchivos(p=>p.filter((_,i)=>i!==idx));}} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",display:"flex"}}><IcoTrash/></button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length===0 && <p style={{color:"#374151",textAlign:"center",padding:"40px 0",fontSize:14}}>No hay productos. Cerrá y agregá productos al catálogo.</p>}
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 2px 0",borderTop:"1px solid #1a1a24",marginTop:4}}>
                <span style={{color:"#64748b",fontSize:14}}>Total estimado</span>
                <span style={{color:"#f1f5f9",fontWeight:800,fontSize:20,fontFamily:"monospace"}}>{fmt(total)}</span>
              </div>
            </div>
          )}

          {/* PASO 2 — DISEÑOS */}
          {paso===2 && (
            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              <p style={{margin:"0 0 2px",color:"#64748b",fontSize:13}}>Para cada producto elegí cómo vas a proveer el diseño.</p>
              {items.map((item,idx)=>{
                const a = archivos[idx]||{modo:null,file:null};
                const listo = a.modo==="diseño" || (a.modo==="propio" && a.file);
                return (
                  <div key={idx} style={{background:"#111118",border:`1.5px solid ${listo?"rgba(14,165,233,0.3)":a.modo?"rgba(167,139,250,0.2)":"#1a1a24"}`,borderRadius:16,padding:16,transition:"border-color 0.25s"}}>
                    {/* Cabecera producto */}
                    <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}>
                      <img src={item.img} alt={item.nombre} style={{width:46,height:46,objectFit:"cover",borderRadius:8,flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{margin:"0 0 2px",color:"#e2e8f0",fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.nombre}</p>
                        <p style={{margin:0,color:"#475569",fontSize:11}}>{item.opcionSeleccionada} · qty {item.qty}</p>
                      </div>
                      {listo && (
                        <span style={{background:"rgba(34,197,94,0.1)",color:"#22c55e",border:"1px solid rgba(34,197,94,0.2)",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,flexShrink:0}}>✓ Listo</span>
                      )}
                    </div>

                    {/* Opciones */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:a.modo==="propio"?12:0}}>
                      {/* Opción A: Diseño propio */}
                      <button onClick={()=>setArchivoIdx(idx,{modo:"propio",file:null})}
                        style={{background:a.modo==="propio"?"rgba(14,165,233,0.1)":"#0d0d10",border:`1.5px solid ${a.modo==="propio"?"#0ea5e9":"#1f2937"}`,borderRadius:12,padding:"13px 10px",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                        <div style={{color:a.modo==="propio"?"#0ea5e9":"#374151",display:"flex",justifyContent:"center",marginBottom:6}}><IcoUp/></div>
                        <p style={{margin:"0 0 2px",color:a.modo==="propio"?"#e2e8f0":"#64748b",fontSize:13,fontWeight:600}}>Subir mi diseño</p>
                        <p style={{margin:0,color:"#374151",fontSize:11}}>PDF, AI, PSD, JPG…</p>
                      </button>
                      {/* Opción B: Diseño incluido */}
                      <button onClick={()=>setArchivoIdx(idx,{modo:"diseño",file:{tipo:"diseño-incluido",nombre:"Diseño a cargo de la imprenta"}})}
                        style={{background:a.modo==="diseño"?"rgba(167,139,250,0.1)":"#0d0d10",border:`1.5px solid ${a.modo==="diseño"?"#a78bfa":"#1f2937"}`,borderRadius:12,padding:"13px 10px",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                        <div style={{color:a.modo==="diseño"?"#a78bfa":"#374151",display:"flex",justifyContent:"center",marginBottom:6}}><IcoBrush/></div>
                        <p style={{margin:"0 0 2px",color:a.modo==="diseño"?"#e2e8f0":"#64748b",fontSize:13,fontWeight:600}}>Diseño incluido</p>
                        <p style={{margin:0,color:"#22c55e",fontSize:11,fontWeight:700}}>Sin costo adicional</p>
                      </button>
                    </div>

                    {/* Upload si eligió "propio" */}
                    {a.modo==="propio" && (
                      <UploadWidget value={a.file} onChange={f=>setArchivoIdx(idx,{file:f})}/>
                    )}

                    {/* Confirmación diseño incluido */}
                    {a.modo==="diseño" && (
                      <div style={{background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:9,padding:"9px 13px",marginTop:2}}>
                        <p style={{margin:0,color:"#a78bfa",fontSize:12,lineHeight:1.5}}>✓ El equipo de diseño se encargará. Te contactamos para coordinar los detalles.</p>
                      </div>
                    )}
                  </div>
                );
              })}
              {!todosListos && items.length>0 && (
                <p style={{margin:0,color:"#f59e0b",fontSize:12,textAlign:"center"}}>⚠ Seleccioná una opción para cada producto para continuar.</p>
              )}
            </div>
          )}

          {/* PASO 3 — CONTACTO */}
          {paso===3 && (
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <p style={{margin:"0 0 4px",color:"#64748b",fontSize:13}}>Dejanos tus datos para coordinar el pedido y la entrega.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={{color:"#64748b",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Nombre y apellido *</label>
                  <input {...inp("nombre")} placeholder="Ej: María García"/>
                  {errC.nombre && <p style={{margin:"4px 0 0",color:"#ef4444",fontSize:11}}>{errC.nombre}</p>}
                </div>
                <div>
                  <label style={{color:"#64748b",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Teléfono / WhatsApp *</label>
                  <input {...inp("telefono")} placeholder="+54 11 1234-5678"/>
                  {errC.telefono && <p style={{margin:"4px 0 0",color:"#ef4444",fontSize:11}}>{errC.telefono}</p>}
                </div>
                <div>
                  <label style={{color:"#64748b",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Email</label>
                  <input {...inp("email")} placeholder="tu@email.com" type="email"/>
                </div>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={{color:"#64748b",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Notas (medidas, colores, fecha de entrega…)</label>
                  <textarea {...inp("notas")} rows={3} placeholder="Ej: Necesito para el viernes 20, fondo azul marino..." style={{...inp("notas").style,resize:"vertical"}}/>
                </div>
              </div>

              {/* Resumen compacto */}
              <div style={{background:"#111118",border:"1px solid #1a1a24",borderRadius:12,padding:"14px 16px"}}>
                <p style={{margin:"0 0 10px",color:"#475569",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase"}}>Resumen del pedido</p>
                {items.map((item,idx)=>(
                  <div key={idx} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,gap:8}}>
                    <span style={{color:"#94a3b8",fontSize:13,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {item.nombre} ×{item.qty}
                    </span>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      <span style={{color:archivos[idx]?.modo==="diseño"?"#a78bfa":"#22c55e",fontSize:11}}>
                        {archivos[idx]?.modo==="diseño"?"🎨 Diseño incluido":"📎 Diseño propio"}
                      </span>
                      <span style={{color:"#0ea5e9",fontFamily:"monospace",fontSize:13,fontWeight:700}}>{fmt(item.precio*item.qty)}</span>
                    </div>
                  </div>
                ))}
                <div style={{borderTop:"1px solid #1a1a24",marginTop:10,paddingTop:10,display:"flex",justifyContent:"space-between"}}>
                  <span style={{color:"#64748b",fontSize:14}}>Total estimado</span>
                  <span style={{color:"#fff",fontWeight:800,fontSize:18,fontFamily:"monospace"}}>{fmt(total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4 — CONFIRMADO */}
          {paso===4 && (
            <div style={{textAlign:"center",padding:"16px 0 8px"}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(34,197,94,0.1)",border:"2px solid #22c55e",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",color:"#22c55e"}}>
                <IcoCheck/>
              </div>
              <h3 style={{margin:"0 0 10px",color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:22}}>¡Pedido recibido!</h3>
              <p style={{margin:"0 0 20px",color:"#64748b",fontSize:14,lineHeight:1.7}}>
                Gracias <strong style={{color:"#e2e8f0"}}>{contacto.nombre}</strong>.<br/>
                Nos comunicaremos al <strong style={{color:"#0ea5e9"}}>{contacto.telefono}</strong> para confirmar y coordinar la entrega.
              </p>
              <div style={{background:"#111118",border:"1px solid #1a1a24",borderRadius:12,padding:"14px",marginBottom:20,textAlign:"left"}}>
                {items.map((item,idx)=>(
                  <div key={idx} style={{display:"flex",alignItems:"center",gap:10,marginBottom:idx<items.length-1?10:0}}>
                    <img src={item.img} style={{width:36,height:36,borderRadius:6,objectFit:"cover",flexShrink:0}} alt=""/>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{margin:0,color:"#e2e8f0",fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.nombre} ×{item.qty}</p>
                      <p style={{margin:0,color:archivos[idx]?.modo==="diseño"?"#a78bfa":"#22c55e",fontSize:11}}>
                        {archivos[idx]?.modo==="diseño"?"✓ Diseño a cargo de la imprenta":`✓ ${archivos[idx]?.file?.nombre||"Diseño adjunto"}`}
                      </p>
                    </div>
                    <span style={{color:"#0ea5e9",fontFamily:"monospace",fontSize:13,fontWeight:700,flexShrink:0}}>{fmt(item.precio*item.qty)}</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>onDone({ contacto, items, archivos, total, fecha: new Date().toISOString() })} style={{background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:12,padding:"12px 28px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>
                Volver al catálogo
              </button>
            </div>
          )}
        </div>

        {/* Navegación */}
        {paso<4 && (
          <div style={{padding:"14px 24px",borderTop:"1px solid #1a1a24",display:"flex",justifyContent:"space-between",gap:10,flexShrink:0}}>
            {paso>1
              ? <button onClick={()=>setPaso(p=>p-1)} style={{background:"#111118",border:"1px solid #1f2937",borderRadius:11,padding:"10px 18px",color:"#64748b",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>← Atrás</button>
              : <div/>
            }
            {paso===1 && (
              <button disabled={items.length===0} onClick={()=>setPaso(2)}
                style={{display:"flex",alignItems:"center",gap:8,background:items.length===0?"#1a1a24":"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:11,padding:"10px 22px",color:items.length===0?"#374151":"#fff",cursor:items.length===0?"not-allowed":"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>
                Continuar <IcoArrow/>
              </button>
            )}
            {paso===2 && (
              <button disabled={!todosListos} onClick={()=>setPaso(3)}
                style={{display:"flex",alignItems:"center",gap:8,background:!todosListos?"#1a1a24":"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:11,padding:"10px 22px",color:!todosListos?"#374151":"#fff",cursor:!todosListos?"not-allowed":"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>
                Continuar <IcoArrow/>
              </button>
            )}
            {paso===3 && (
              <button onClick={()=>{ if(validarContacto()) setPaso(4); }}
                style={{display:"flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:11,padding:"10px 22px",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 18px rgba(14,165,233,0.3)"}}>
                Enviar pedido <IcoArrow/>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MODAL DETALLE PRODUCTO ────────────────────────────────────────────────────
function ModalDetalle({ producto, onClose, onAdd }) {
  const tienePrecios = producto.precios && producto.precios.length > 0;
  const cantidades   = tienePrecios ? [...new Set(producto.precios.map(p=>p.cantidad))] : [];
  const [cantidad, setCantidad] = useState(cantidades[0] || null);
  const [opcion, setOpcion]     = useState(producto.opciones[0]);
  const [qty, setQty]           = useState(1);

  const precioActual = tienePrecios
    ? (producto.precios.find(p=>p.cantidad===cantidad && p.opcion===opcion)?.precio || producto.precio)
    : producto.precio;

  const opcionesPorCantidad = tienePrecios && cantidad
    ? [...new Set(producto.precios.filter(p=>p.cantidad===cantidad).map(p=>p.opcion))]
    : producto.opciones;

  const medias = producto.medias && producto.medias.length > 0
    ? producto.medias
    : [{ tipo:"image", src: producto.img, principal: true }];
  const [mediaIdx, setMediaIdx] = useState(0);
  const media = medias[mediaIdx] || medias[0];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0d0d10",border:"1px solid #1f2937",borderRadius:20,maxWidth:700,width:"100%",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{display:"flex",flexWrap:"wrap"}}>
          <div style={{flex:"1 1 250px",minHeight:260,position:"relative",overflow:"hidden",borderRadius:"20px 0 0 0",background:"#0a0a0f"}}>
            {media.tipo==="video"
              ? <video src={media.src} controls style={{width:"100%",height:"100%",objectFit:"cover",display:"block",minHeight:260}}/>
              : <img src={media.src} alt={producto.nombre} style={{width:"100%",height:"100%",objectFit:"cover",display:"block",minHeight:260}}/>
            }
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.6),transparent 55%)",pointerEvents:"none"}}/>
            <span style={{position:"absolute",bottom: medias.length>1?54:14, left:14,background:"rgba(14,165,233,0.9)",color:"#fff",borderRadius:7,padding:"3px 11px",fontSize:12,fontWeight:700}}>{producto.categoria}</span>
            <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:"50%",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><IcoX/></button>
            {/* Thumbnails */}
            {medias.length > 1 && (
              <div style={{position:"absolute",bottom:10,left:10,right:10,display:"flex",gap:6,overflowX:"auto"}}>
                {medias.map((m,mi)=>(
                  <div key={mi} onClick={()=>setMediaIdx(mi)}
                    style={{width:40,height:40,flexShrink:0,borderRadius:7,overflow:"hidden",cursor:"pointer",border:`2px solid ${mi===mediaIdx?"#0ea5e9":"rgba(255,255,255,0.3)"}`,opacity:mi===mediaIdx?1:0.7,transition:"all 0.2s",background:"#0a0a0f"}}>
                    {m.tipo==="video"
                      ? <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#111",color:"#0ea5e9"}}><IcoVideo/></div>
                      : <img src={m.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{flex:"1 1 250px",padding:"24px 24px",display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <h2 style={{margin:"0 0 5px",color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:20}}>{producto.nombre}</h2>
              <p style={{margin:0,color:"#64748b",fontSize:13,lineHeight:1.6}}>{producto.desc}</p>
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span style={{fontSize:26,fontWeight:800,color:"#0ea5e9",fontFamily:"monospace"}}>{fmt(precioActual*qty)}</span>
              <span style={{color:"#374151",fontSize:12}}>{producto.unidad}</span>
            </div>
            {/* Cantidades si tiene precios variables */}
{tienePrecios && (
  <div>
    <p style={{margin:"0 0 8px",color:"#94a3b8",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase"}}>Cantidad</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {cantidades.map(c=>(
        <button key={c} onClick={()=>{setCantidad(c);setOpcion(producto.precios.filter(p=>p.cantidad===c)[0]?.opcion||opcion);}}
          style={{background:cantidad===c?"linear-gradient(135deg,#0ea5e9,#38bdf8)":"#161620",border:`1px solid ${cantidad===c?"transparent":"#1f2937"}`,borderRadius:8,padding:"7px 14px",color:cantidad===c?"#fff":"#64748b",cursor:"pointer",fontSize:13,fontFamily:"inherit",transition:"all 0.2s"}}>
          {c} unid.
        </button>
      ))}
    </div>
  </div>
)}

{/* Opciones / Acabado */}
<div>
  <p style={{margin:"0 0 8px",color:"#94a3b8",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase"}}>Acabado</p>
  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
    {(tienePrecios && cantidad
      ? [...new Set(producto.precios.filter(p=>p.cantidad===cantidad).map(p=>p.opcion))]
      : producto.opciones
    ).map(op=>(
      <button key={op} onClick={()=>setOpcion(op)}
        style={{background:opcion===op?"linear-gradient(135deg,#0ea5e9,#38bdf8)":"#161620",border:`1px solid ${opcion===op?"transparent":"#1f2937"}`,borderRadius:8,padding:"6px 13px",color:opcion===op?"#fff":"#64748b",cursor:"pointer",fontSize:13,fontFamily:"inherit",transition:"all 0.2s"}}>
        {op}
      </button>
    ))}
  </div>
</div>

{/* Multiplicador de pedidos (solo sin precios variables) */}
{!tienePrecios && (
  <div style={{display:"flex",alignItems:"center",gap:10}}>
    <p style={{margin:0,color:"#94a3b8",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase"}}>Cantidad</p>
    <div style={{display:"flex",alignItems:"center",background:"#161620",border:"1px solid #1f2937",borderRadius:9,overflow:"hidden"}}>
      <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:"7px 13px",display:"flex"}}><IcoMinus/></button>
      <span style={{color:"#f1f5f9",minWidth:28,textAlign:"center",fontWeight:700}}>{qty}</span>
      <button onClick={()=>setQty(q=>q+1)} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:"7px 13px",display:"flex"}}><IcoPlus/></button>
    </div>
  </div>
)}
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <p style={{margin:0,color:"#94a3b8",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase"}}>Cantidad</p>
              <div style={{display:"flex",alignItems:"center",background:"#161620",border:"1px solid #1f2937",borderRadius:9,overflow:"hidden"}}>
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:"7px 13px",display:"flex"}}><IcoMinus/></button>
                <span style={{color:"#f1f5f9",minWidth:28,textAlign:"center",fontWeight:700}}>{qty}</span>
                <button onClick={()=>setQty(q=>q+1)} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:"7px 13px",display:"flex"}}><IcoPlus/></button>
              </div>
            </div>
            {/* Aviso diseño */}
            <div style={{background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.15)",borderRadius:10,padding:"10px 13px",display:"flex",gap:8}}>
              <span style={{color:"#a78bfa",fontSize:13,flexShrink:0}}>🎨</span>
              <p style={{margin:0,color:"#64748b",fontSize:12,lineHeight:1.5}}>Al finalizar el pedido podrás <strong style={{color:"#a78bfa"}}>subir tu diseño</strong> o elegir <strong style={{color:"#22c55e"}}>diseño incluido sin costo</strong>.</p>
            </div>
            <button onClick={()=>{ onAdd({...producto, opcionSeleccionada:opcion, cantidadSeleccionada:cantidad, precioFinal:precioActual, qty:tienePrecios?1:qty}); onClose(); }}
              style={{background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:12,padding:"12px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:15,boxShadow:"0 4px 18px rgba(14,165,233,0.3)"}}>
              Agregar al presupuesto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CARRITO LATERAL ───────────────────────────────────────────────────────────
function CarritoPanel({ items, onClose, onUpdate, onRemove, onCheckout }) {
  const total = items.reduce((s,i)=>s+i.precio*i.qty, 0);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:90,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(2px)",display:"flex",justifyContent:"flex-end"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0d0d10",borderLeft:"1px solid #1f2937",width:"min(400px,100vw)",height:"100%",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 22px",borderBottom:"1px solid #1a1a24",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h2 style={{margin:0,color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:19}}>Presupuesto</h2>
            <p style={{margin:0,color:"#475569",fontSize:12}}>{items.reduce((s,i)=>s+i.qty,0)} ítem{items.reduce((s,i)=>s+i.qty,0)!==1?"s":""}</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#475569",cursor:"pointer"}}><IcoX/></button>
        </div>
        {items.length===0
          ? <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#374151",gap:10}}>
              <IcoPrint/>
              <span style={{fontSize:14}}>Sin productos aún</span>
            </div>
          : <>
            <div style={{flex:1,overflowY:"auto",padding:"12px 22px",display:"flex",flexDirection:"column",gap:10}}>
              {items.map((item,idx)=>(
                <div key={idx} style={{background:"#111118",border:"1px solid #1a1a24",borderRadius:12,padding:12,display:"flex",gap:10}}>
                  <img src={item.img} style={{width:54,height:54,objectFit:"cover",borderRadius:8,flexShrink:0}} alt=""/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:"0 0 2px",color:"#e2e8f0",fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.nombre}</p>
                    <p style={{margin:"0 0 6px",color:"#475569",fontSize:11}}>{item.opcionSeleccionada} · {item.unidad}</p>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{display:"flex",alignItems:"center",background:"#0d0d10",border:"1px solid #1f2937",borderRadius:7,overflow:"hidden"}}>
                        <button onClick={()=>onUpdate(idx,-1)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",padding:"4px 9px",display:"flex"}}><IcoMinus/></button>
                        <span style={{color:"#f1f5f9",minWidth:22,textAlign:"center",fontSize:12,fontWeight:700}}>{item.qty}</span>
                        <button onClick={()=>onUpdate(idx,1)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",padding:"4px 9px",display:"flex"}}><IcoPlus/></button>
                      </div>
                      <span style={{color:"#0ea5e9",fontFamily:"monospace",fontSize:13,fontWeight:700,marginLeft:"auto"}}>{fmt(item.precio*item.qty)}</span>
                      <button onClick={()=>onRemove(idx)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",display:"flex"}}><IcoTrash/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:"16px 22px",borderTop:"1px solid #1a1a24"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{color:"#64748b",fontSize:14}}>Total estimado</span>
                <span style={{color:"#fff",fontWeight:800,fontSize:20,fontFamily:"monospace"}}>{fmt(total)}</span>
              </div>
              <p style={{margin:"0 0 14px",color:"#2a3545",fontSize:11}}>* Podrás adjuntar tu diseño o elegir diseño incluido al finalizar.</p>
              <button onClick={onCheckout} style={{width:"100%",background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:12,padding:"13px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:15,boxShadow:"0 4px 20px rgba(14,165,233,0.25)"}}>
                Finalizar pedido →
              </button>
            </div>
          </>
        }
      </div>
    </div>
  );
}

// ── BANNER ────────────────────────────────────────────────────────────────────
const ADMIN_PASS = "Espectro4035@";
const BANNER_DEFAULT = {
  titulo:"Impresiones de calidad,", subtitulo:"a tu medida",
  slogan:"Folletos, tarjetas, stickers, talonarios, fotos, carpetas y candy bar. Subí tu diseño o elegí diseño incluido sin costo.",
  colorAcento:"#0ea5e9", colorBg1:"#080810", colorBg2:"#0a1628",
  bgImg:null, nombreLocal:"PrintShop",
};

function BannerEditor({ banner, onSave, onClose }) {
  const [b, setB] = useState({...banner});
  const set = (k,v) => setB(p=>({...p,[k]:v}));
  const handleImg = e => { const f=e.target.files[0]; if(f) set("bgImg",URL.createObjectURL(f)); };
  const campo = (lbl,key,type="text",ph="") => (
    <div>
      <label style={{color:"#64748b",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>{lbl}</label>
      <input type={type} value={b[key]} onChange={e=>set(key,e.target.value)} placeholder={ph}
        style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
    </div>
  );
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0d0d10",border:"1px solid #1f2937",borderRadius:20,maxWidth:560,width:"100%",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid #1a1a24",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:"rgba(14,165,233,0.12)",borderRadius:9,padding:8,color:"#0ea5e9",display:"flex"}}><IcoPencil/></div>
            <h2 style={{margin:0,color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:18}}>Personalizar Banner</h2>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#475569",cursor:"pointer"}}><IcoX/></button>
        </div>
        <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:16}}>
          {/* Preview */}
          <div style={{borderRadius:12,overflow:"hidden",height:110,position:"relative",background:`linear-gradient(135deg,${b.colorBg1},${b.colorBg2})`}}>
            {b.bgImg && <img src={b.bgImg} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.3}}/>}
            <div style={{position:"absolute",inset:0,padding:"12px 18px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <p style={{margin:"0 0 2px",color:"#475569",fontSize:9,letterSpacing:"0.15em",textTransform:"uppercase"}}>{b.nombreLocal}</p>
              <h3 style={{margin:"0 0 3px",color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:14,lineHeight:1.2}}>
                {b.titulo} <span style={{color:b.colorAcento}}>{b.subtitulo}</span>
              </h3>
              <p style={{margin:0,color:"#374151",fontSize:10}}>{b.slogan.slice(0,70)}…</p>
            </div>
          </div>
          {campo("Nombre del local","nombreLocal","text","PrintShop")}
          {campo("Título principal","titulo","text","Impresiones de calidad,")}
          {campo("Subtítulo destacado","subtitulo","text","a tu medida")}
          <div>
            <label style={{color:"#64748b",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Slogan</label>
            <textarea value={b.slogan} onChange={e=>set("slogan",e.target.value)} rows={2}
              style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[["Color acento","colorAcento"],["Fondo inicio","colorBg1"],["Fondo fin","colorBg2"]].map(([lbl,k])=>(
              <div key={k}>
                <label style={{color:"#64748b",fontSize:10,letterSpacing:"0.05em",textTransform:"uppercase",display:"block",marginBottom:5}}>{lbl}</label>
                <div style={{display:"flex",alignItems:"center",gap:6,background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"5px 8px"}}>
                  <input type="color" value={b[k]} onChange={e=>set(k,e.target.value)} style={{width:24,height:24,border:"none",background:"none",cursor:"pointer",padding:0}}/>
                  <span style={{color:"#374151",fontSize:10,fontFamily:"monospace"}}>{b[k]}</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <label style={{color:"#64748b",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:6}}>Imagen de fondo</label>
            <div style={{display:"flex",gap:8}}>
              <label style={{flex:1,display:"flex",alignItems:"center",gap:8,background:"#111118",border:"1px dashed #1f2937",borderRadius:9,padding:"9px 13px",cursor:"pointer",color:"#475569",fontSize:12}}>
                <IcoUp/>{b.bgImg?"✓ Cargada — click para cambiar":"Subir imagen JPG/PNG"}
                <input type="file" accept="image/*" style={{display:"none"}} onChange={handleImg}/>
              </label>
              {b.bgImg && <button onClick={()=>set("bgImg",null)} style={{background:"#1a1020",border:"1px solid #3a1a1a",borderRadius:8,padding:"9px 12px",color:"#ef4444",cursor:"pointer",display:"flex",alignItems:"center"}}><IcoTrash/></button>}
            </div>
          </div>
          <div style={{display:"flex",gap:10,paddingTop:2}}>
            <button onClick={()=>setB({...BANNER_DEFAULT})} style={{display:"flex",alignItems:"center",gap:6,background:"#111118",border:"1px solid #1f2937",borderRadius:10,padding:"10px 14px",color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}><IcoRefresh/> Reset</button>
            <button onClick={()=>{onSave(b);onClose();}} style={{flex:1,background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:10,padding:"11px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TARJETA ───────────────────────────────────────────────────────────────────
function Tarjeta({ producto, onVer, onAdd }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:"#0d0d10",borderRadius:16,overflow:"hidden",border:`1px solid ${hov?"#1e3a4a":"#1a1a24"}`,transition:"all 0.25s",transform:hov?"translateY(-5px)":"none",boxShadow:hov?"0 20px 50px rgba(14,165,233,0.1)":"none",display:"flex",flexDirection:"column",cursor:"pointer"}}
      onClick={()=>onVer(producto)}>
      <div style={{position:"relative",overflow:"hidden"}}>
        <img src={producto.img} alt={producto.nombre} style={{width:"100%",height:190,objectFit:"cover",display:"block",transition:"transform 0.5s",transform:hov?"scale(1.07)":"scale(1)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(13,13,16,0.7),transparent 60%)"}}/>
        <span style={{position:"absolute",top:12,left:12,background:"rgba(14,165,233,0.85)",backdropFilter:"blur(4px)",color:"#fff",borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700}}>{producto.categoria}</span>
        {hov && (
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.3)"}}>
            <span style={{background:"rgba(14,165,233,0.9)",color:"#fff",borderRadius:10,padding:"8px 18px",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}><IcoEye/> Ver opciones</span>
          </div>
        )}
      </div>
      <div style={{padding:"15px",flex:1,display:"flex",flexDirection:"column",gap:7}}>
        <h3 style={{margin:0,color:"#e2e8f0",fontSize:15,fontFamily:"'DM Serif Display',serif",lineHeight:1.3}}>{producto.nombre}</h3>
        <p style={{margin:0,color:"#374151",fontSize:12,lineHeight:1.5,flex:1}}>{producto.desc}</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:4}}>
          <div>
            <span style={{color:"#0ea5e9",fontWeight:800,fontSize:17,fontFamily:"monospace"}}>{fmt(producto.precio)}</span>
            <span style={{color:"#374151",fontSize:11,marginLeft:4}}>{producto.unidad}</span>
          </div>
          <button onClick={e=>{e.stopPropagation();onAdd({...producto,opcionSeleccionada:producto.opciones[0],qty:1});}}
            style={{background:"#111118",border:"1px solid #1f2937",borderRadius:8,padding:"7px 12px",color:"#94a3b8",cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:5}}>
            <IcoPlus/> Agregar
          </button>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {producto.opciones.slice(0,3).map(op=>(
            <span key={op} style={{background:"#111118",border:"1px solid #1a1a24",borderRadius:5,padding:"2px 7px",fontSize:10,color:"#475569"}}>{op}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [cat, setCat]               = useState("Todos");
  const [search, setSearch]         = useState("");
  const [carrito, setCarrito]       = useState([]);
  const [showCart, setShowCart]     = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [detalle, setDetalle]       = useState(null);
  const [toast, setToast]           = useState(null);
  const [banner, setBanner]         = useState({...BANNER_DEFAULT});
  const [showBannerEd, setShowBannerEd] = useState(false);
  const [productos, setProductos]   = useState(PRODUCTOS);
  const [esAdmin, setEsAdmin] = useState(false);
const [showLoginAdmin, setShowLoginAdmin] = useState(false);
  const [showAdmin, setShowAdmin]   = useState(false);
  const [showPedidos, setShowPedidos] = useState(false);
  const [dbLoading, setDbLoading]   = useState(!DEMO_MODE);
  const [dbStatus, setDbStatus]     = useState(DEMO_MODE ? "demo" : "loading"); // demo|loading|ok|error

  // ── CARGA INICIAL DESDE SUPABASE ──
  useEffect(()=>{
    if (DEMO_MODE) return;
    (async()=>{
      try {
        const [prods, cfg] = await Promise.all([db.getProductos(), db.getConfig()]);
        if (prods && prods.length > 0) setProductos(prods);
        if (cfg?.banner) setBanner(cfg.banner);
        setDbStatus("ok");
      } catch(e) {
        console.error("Supabase error:", e);
        setDbStatus("error");
      } finally {
        setDbLoading(false);
      }
    })();
  },[]);
const handleLoginAdmin = (pass) => {
  if (pass === ADMIN_PASS) {
    setEsAdmin(true);
    setShowLoginAdmin(false);
    showToast("Bienvenido 👋");
  } else {
    showToast("Contraseña incorrecta");
  }
};
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 2800); };

  const agregarAlCarrito = (producto) => {
    setCarrito(prev=>[...prev, producto]);
    showToast(`"${producto.nombre}" añadido al presupuesto`);
  };

  const actualizarQty = (idx, delta) =>
    setCarrito(prev=>prev.map((item,i)=>i===idx?{...item,qty:Math.max(1,item.qty+delta)}:item));

  const eliminarItem = (idx) => setCarrito(prev=>prev.filter((_,i)=>i!==idx));

  // ── GUARDAR BANNER EN SUPABASE ──
  const handleSaveBanner = async (b) => {
    setBanner(b);
    if (!DEMO_MODE) {
      try { await db.saveConfig({ banner: b }); showToast("Banner guardado ✓"); }
      catch(e) { showToast("Error al guardar banner"); }
    } else {
      showToast("Banner actualizado (demo)");
    }
  };

  // ── GUARDAR PRODUCTOS EN SUPABASE ──
  const handleSaveProductos = async (lista) => {
    setProductos(lista);
    if (!DEMO_MODE) {
      try {
        await Promise.all(lista.map(p => db.upsertProducto(p)));
        showToast("Productos guardados en Supabase ✓");
      } catch(e) { showToast("Error al guardar productos"); }
    } else {
      showToast("Productos actualizados (demo)");
    }
  };

  // ── GUARDAR PEDIDO EN SUPABASE ──
  const handleCheckoutDone = async (pedidoData) => {
    if (!DEMO_MODE && pedidoData) {
      try { await db.savePedido(pedidoData); } catch(e) { console.error("Error al guardar pedido:", e); }
    }
    setCarrito([]);
    setShowCheckout(false);
    showToast("¡Pedido enviado! Nos contactamos pronto 🖨️");
  };

  const filtrados = productos.filter(p=>
    (cat==="Todos"||p.categoria===cat) &&
    (p.nombre.toLowerCase().includes(search.toLowerCase())||p.categoria.toLowerCase().includes(search.toLowerCase()))
  );

  const totalItems = carrito.reduce((s,i)=>s+i.qty,0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=IBM+Plex+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#08080b;font-family:'Syne',sans-serif}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0d0d10}::-webkit-scrollbar-thumb{background:#1f2937;border-radius:3px}
        input::placeholder,textarea::placeholder{color:#2a3545}
        @media(max-width:768px){
  .hero-content{flex-direction:column!important;gap:20px!important;}
  .hero-stats{justify-content:center!important;flex-wrap:wrap!important;align-items:center!important;}
  .header-actions{gap:6px!important;}
  .header-actions span{display:none!important;}
}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        .card-appear{animation:fadeUp 0.4s ease both}
      `}</style>

      <div style={{minHeight:"100vh",background:"#08080b"}}>
        {/* HEADER */}
        <header style={{borderBottom:"1px solid #111118",padding:"0 clamp(16px,5vw,60px)",position:"sticky",top:0,background:"rgba(8,8,11,0.96)",backdropFilter:"blur(16px)",zIndex:60}}>
          <div style={{maxWidth:1320,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:70}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:38,height:38,background:`linear-gradient(135deg,${banner.colorAcento},${banner.colorAcento}cc)`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><IcoPrint/></div>
              <div>
                <h1 style={{color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:"clamp(16px,2.5vw,22px)",letterSpacing:"-0.02em",lineHeight:1}}>{banner.nombreLocal}</h1>
                <p style={{color:"#374151",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",lineHeight:1,marginTop:3}}>Imprenta Digital</p>
              </div>
            </div>
            <div className="header-actions" style={{display:"flex",gap:10,alignItems:"center"}}>
              {/* Estado DB */}
              {!DEMO_MODE && (
                <div style={{display:"flex",alignItems:"center",gap:5,background:"#111118",border:"1px solid #1a1a24",borderRadius:8,padding:"5px 10px"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:dbStatus==="ok"?"#22c55e":dbStatus==="error"?"#ef4444":"#f59e0b",flexShrink:0}}/>
                  <span style={{fontSize:10,color:"#475569",fontFamily:"monospace"}}>{dbStatus==="ok"?"Supabase OK":dbStatus==="error"?"Sin conexión":"Conectando…"}</span>
                </div>
              )}
              {DEMO_MODE && (
                <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:8,padding:"5px 10px"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"#f59e0b"}}/>
                  <span style={{fontSize:10,color:"#f59e0b",fontFamily:"monospace"}}>Demo</span>
                </div>
              )}
              {esAdmin ? (
  <>
    {esAdmin && (
  <button onClick={()=>setShowBannerEd(true)} style={{position:"absolute",top:16,right:16,display:"flex",alignItems:"center",gap:7,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 14px",color:"#94a3b8",cursor:"pointer",fontSize:12,fontFamily:"inherit",zIndex:2}}>
    <IcoPencil/> Editar banner
  </button>
)}
    <button onClick={()=>setShowPedidos(true)} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.25)",borderRadius:11,padding:"9px 15px",color:"#8b5cf6",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:700}}>
      <IcoInbox/> Pedidos
    </button>
    <button onClick={()=>setShowAdmin(true)} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:11,padding:"9px 15px",color:"#f59e0b",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:700}}>
      <IcoAdmin/> Admin
    </button>
  </>
) : (
  <button onClick={()=>setShowLoginAdmin(true)} style={{display:"flex",alignItems:"center",gap:7,background:"#111118",border:"1px solid #1f2937",borderRadius:11,padding:"9px 15px",color:"#64748b",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600}}>
    <IcoLock/> Acceso
  </button>
)}
              <button onClick={()=>setShowCart(true)} style={{position:"relative",display:"flex",alignItems:"center",gap:8,background:totalItems>0?"linear-gradient(135deg,#0ea5e9,#38bdf8)":"#111118",border:`1px solid ${totalItems>0?"transparent":"#1f2937"}`,borderRadius:11,padding:"9px 18px",color:totalItems>0?"#fff":"#64748b",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600,transition:"all 0.2s"}}>
                <IcoCart/> Presupuesto
                {totalItems>0 && <span style={{background:"#fff",color:"#0ea5e9",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{totalItems}</span>}
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <div style={{position:"relative",overflow:"hidden",background:`linear-gradient(135deg,${banner.colorBg1} 0%,${banner.colorBg2} 50%,${banner.colorBg1} 100%)`,borderBottom:"1px solid #111118",padding:"clamp(40px,6vw,80px) clamp(16px,5vw,60px)"}}>
          {banner.bgImg && <img src={banner.bgImg} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.22,pointerEvents:"none"}}/>}
          {esAdmin && (
  <button onClick={()=>setShowBannerEd(true)} style={{position:"absolute",top:16,right:16,display:"flex",alignItems:"center",gap:7,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"8px 14px",color:"#94a3b8",cursor:"pointer",fontSize:12,fontFamily:"inherit",zIndex:2}}>
    <IcoPencil/> Editar banner
  </button>
)}
          <div className="hero-stats" style={{display:"flex",flexDirection:"column",gap:14,alignItems:"flex-end"}}>
  {/* Stats */}
  <div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"flex-end"}}>
    {[["¿Sin Diseño?","NOSOTROS LO ARMAMOS"],["Envios","TODO ZONA SUR"],["Presupuestos","SIN CARGO"]].map(([n,l])=>(
      <div key={l} style={{background:"rgba(14,165,233,0.05)",border:"1px solid rgba(14,165,233,0.1)",borderRadius:14,padding:"18px 22px",textAlign:"center",minWidth:88}}>
        <p style={{margin:0,color:banner.colorAcento,fontFamily:"'IBM Plex Mono',monospace",fontSize:22,fontWeight:700}}>{n}</p>
        <p style={{margin:"3px 0 0",color:"#374151",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase"}}>{l}</p>
      </div>
    ))}
  </div>
  {/* Teléfono */}
  <a href="tel:1128468594" style={{display:"flex",alignItems:"center",gap:10,background:"rgba(14,165,233,0.08)",border:"1px solid rgba(14,165,233,0.2)",borderRadius:14,padding:"14px 24px",textDecoration:"none",width:"100%",justifyContent:"center"}}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
    <span style={{color:"#0ea5e9",fontSize:26,fontWeight:800,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.05em"}}>11 2846-8594</span>
  </a>
  {/* Redes sociales */}
  <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"flex-end"}}>
    <a href="https://wa.me/5491128468594" target="_blank" rel="noreferrer"
      style={{display:"flex",alignItems:"center",gap:8,background:"rgba(37,211,102,0.1)",border:"1px solid rgba(37,211,102,0.25)",borderRadius:11,padding:"10px 18px",color:"#25d366",textDecoration:"none",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp
    </a>
    <a href="#" onClick={e=>{e.preventDefault();alert("Instagram — Próximamente 🚧");}}
      style={{display:"flex",alignItems:"center",gap:8,background:"rgba(225,48,108,0.1)",border:"1px solid rgba(225,48,108,0.25)",borderRadius:11,padding:"10px 18px",color:"#e1306c",textDecoration:"none",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      Instagram
    </a>
    <a href="#" onClick={e=>{e.preventDefault();alert("Tienda Nube — Próximamente 🚧");}}
      style={{display:"flex",alignItems:"center",gap:8,background:"rgba(0,105,255,0.1)",border:"1px solid rgba(0,105,255,0.25)",borderRadius:11,padding:"10px 18px",color:"#0069ff",textDecoration:"none",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>
      Tienda Nube
    </a>
  </div>
</div>
          </div>
        </div>

        {/* MAIN */}
        <main style={{maxWidth:1320,margin:"0 auto",padding:"36px clamp(16px,5vw,60px)"}}>
          <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
            <div style={{position:"relative",flex:"1 1 200px",minWidth:180}}>
              <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#374151",display:"flex"}}><IcoSearch/></span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar producto..."
                style={{width:"100%",background:"#0d0d10",border:"1px solid #1a1a24",borderRadius:11,padding:"11px 14px 11px 40px",color:"#e2e8f0",fontSize:14,outline:"none",fontFamily:"inherit"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:26,overflowX:"auto",paddingBottom:4}}>
            {CATEGORIAS.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{flexShrink:0,background:cat===c?"linear-gradient(135deg,#0ea5e9,#38bdf8)":"#0d0d10",border:`1px solid ${cat===c?"transparent":"#1a1a24"}`,borderRadius:8,padding:"7px 16px",color:cat===c?"#fff":"#475569",cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:cat===c?700:400,transition:"all 0.2s",whiteSpace:"nowrap"}}>
                {c}
              </button>
            ))}
          </div>
          <p style={{color:"#2a3545",fontSize:13,marginBottom:18,fontFamily:"'IBM Plex Mono',monospace"}}>
            {filtrados.length} producto{filtrados.length!==1?"s":""} · <span style={{color:"#0ea5e9"}}>{cat}</span>
          </p>
          {dbLoading
  ? (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:18}}>
      {[1,2,3,4,5,6].map(i=>(
        <div key={i} style={{background:"#0d0d10",borderRadius:16,overflow:"hidden",border:"1px solid #1a1a24",height:320}}>
          <div style={{height:190,background:"linear-gradient(90deg,#111118 25%,#1a1a24 50%,#111118 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}/>
          <div style={{padding:15,display:"flex",flexDirection:"column",gap:8}}>
            <div style={{height:16,background:"#1a1a24",borderRadius:6,width:"70%"}}/>
            <div style={{height:12,background:"#111118",borderRadius:6,width:"90%"}}/>
            <div style={{height:12,background:"#111118",borderRadius:6,width:"60%"}}/>
          </div>
        </div>
      ))}
    </div>
  )
  : filtrados.length===0
    ? <div style={{textAlign:"center",color:"#1f2937",padding:"80px 0",fontSize:15}}>Sin resultados para "{search}"</div>
    : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:18}}>
        {filtrados.map((p,i)=>(
          <div key={p.id} className="card-appear" style={{animationDelay:`${i*40}ms`}}>
            <Tarjeta producto={p} onVer={setDetalle} onAdd={agregarAlCarrito}/>
          </div>
        ))}
      </div>
}

          {/* Llamada a la acción */}
          <div style={{marginTop:56,background:"linear-gradient(135deg,#0a1628,#0f1f35)",border:"1px solid rgba(14,165,233,0.2)",borderRadius:20,padding:"clamp(24px,4vw,44px)",display:"flex",flexWrap:"wrap",gap:24,alignItems:"center",justifyContent:"space-between"}}>
            <div style={{maxWidth:460}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{color:"#0ea5e9",background:"rgba(14,165,233,0.1)",borderRadius:10,padding:8,display:"flex"}}><IcoBrush/></div>
                <h3 style={{color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:20}}>Diseño incluido sin costo</h3>
              </div>
              <p style={{color:"#475569",fontSize:14,lineHeight:1.7,marginBottom:14}}>
                ¿No tenés diseño propio? Sin problema. Al hacer el pedido podés elegir que nuestro equipo se encargue del diseño <strong style={{color:"#22c55e"}}>sin costo adicional</strong>. O subí tu propio archivo (hasta 500MB).
              </p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {["PDF · AI · PSD","JPG · PNG · EPS","hasta 500MB"].map(f=>(
                  <span key={f} style={{background:"rgba(14,165,233,0.08)",border:"1px solid rgba(14,165,233,0.15)",borderRadius:7,padding:"4px 11px",fontSize:11,color:"#38bdf8",fontFamily:"'IBM Plex Mono',monospace"}}>{f}</span>
                ))}
              </div>
            </div>
            <button onClick={()=>setDetalle(PRODUCTOS[0])} style={{background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:13,padding:"13px 26px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:15,boxShadow:"0 4px 24px rgba(14,165,233,0.3)",whiteSpace:"nowrap"}}>
              Ver productos →
            </button>
          </div>
        </main>

        <footer style={{borderTop:"1px solid #111118",padding:"24px clamp(16px,5vw,60px)",marginTop:40}}>
          <div style={{maxWidth:1320,margin:"0 auto",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:26,height:26,background:`linear-gradient(135deg,${banner.colorAcento},${banner.colorAcento}cc)`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><IcoPrint/></div>
              <span style={{color:"#1f2937",fontFamily:"'DM Serif Display',serif",fontSize:14}}>{banner.nombreLocal}</span>
            </div>
            <p style={{color:"#1a2535",fontSize:11,fontFamily:"'IBM Plex Mono',monospace"}}>© {new Date().getFullYear()} — Imprenta Digital</p>
          </div>
        </footer>

      {/* MODALES */}
      {detalle && <ModalDetalle producto={detalle} onClose={()=>setDetalle(null)} onAdd={agregarAlCarrito}/>}
      {showCart && <CarritoPanel items={carrito} onClose={()=>setShowCart(false)} onUpdate={actualizarQty} onRemove={eliminarItem} onCheckout={()=>{setShowCart(false);setShowCheckout(true);}}/>}
      {showCheckout && <CheckoutModal items={carrito} onClose={()=>setShowCheckout(false)} onDone={handleCheckoutDone} onUpdateQty={actualizarQty} onRemove={eliminarItem}/>}
      {showLoginAdmin && (
  <div onClick={()=>setShowLoginAdmin(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#0d0d10",border:"1px solid #1f2937",borderRadius:20,padding:"32px",width:320}}>
      <h2 style={{margin:"0 0 6px",color:"#f1f5f9",fontFamily:"'DM Serif Display',serif",fontSize:20,textAlign:"center"}}>Acceso Admin</h2>
      <p style={{margin:"0 0 20px",color:"#475569",fontSize:13,textAlign:"center"}}>Solo para el administrador</p>
      <input
        type="password"
        placeholder="Contraseña"
        autoFocus
        onKeyDown={e=>{ if(e.key==="Enter") handleLoginAdmin(e.target.value); }}
        style={{width:"100%",background:"#111118",border:"1px solid #1f2937",borderRadius:9,padding:"11px 14px",color:"#e2e8f0",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:12}}
      />
      <button
        onClick={e=>{ const inp = e.target.previousSibling; handleLoginAdmin(inp.value); }}
        style={{width:"100%",background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:9,padding:"11px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>
        Entrar
      </button>
    </div>
  </div>
)}
      {showBannerEd && <BannerEditor banner={banner} onSave={handleSaveBanner} onClose={()=>setShowBannerEd(false)}/>}
      {showAdmin && <AdminPanel productos={productos} onSave={handleSaveProductos} onClose={()=>setShowAdmin(false)}/>}
      {showPedidos && <PedidosPanel onClose={()=>setShowPedidos(false)}/>}
      {toast && <Toast msg={toast}/>}
    </>
  );
}
