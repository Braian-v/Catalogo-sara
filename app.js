/* ============================================================
   CATÁLOGO — app.js
   Vanilla JS · Sin dependencias
   Estructura jerárquica: Categoría principal > Subcategoría
   Galería de producto con dots, swipe, flechas y miniaturas
   ============================================================ */

'use strict';


/* ------------------------------------------------------------
   1. CONFIGURACIÓN
   ------------------------------------------------------------ */
const CONFIG = {
  WHATSAPP: '5493515720537',
  INSTAGRAM: '',                 // ← vacío: el botón de IG se oculta. Poner handle cuando esté.
  IMAGE_PROXY: 'https://images.weserv.nl/?url=',
  IMAGE_RESIZE: true,
  CACHE_HOURS: 24,
  FETCH_TIMEOUT: 15000,

  /* ----------------------------------------------------------
     ÁRBOL DE CATEGORÍAS
     Estructura: principal > subcategoría.
     El orden de este array define el orden en la web.

     Reglas de clasificación:
       1) Si el producto trae "categoria_principal" y "subcategoria",
          se usan esos campos directamente.
       2) Si no, se deduce así:
          a) Por coincidencia exacta con "oldCats" (categoría heredada).
          b) Por palabras clave en el nombre ("keywords").
          c) Si nada coincide, va a "Varios > Otros".
     ---------------------------------------------------------- */
  CATEGORY_TREE: [
    {
      name: 'Belleza',
      subs: [
        { name: 'Maquillaje',              oldCats: [], keywords: ['labial', 'delineador', 'mascara', 'sombra', 'rubor', 'polvo', 'base', 'corrector', 'iluminador', 'lipgloss', 'lip gloss', 'gloss', 'lip oil', 'lip balm', 'perfilador', 'paleta'] },
        { name: 'Uñas',                    oldCats: [], keywords: ['esmalte', 'uña', 'unas', 'nail', 'alicate', 'lima', 'pegamento de uña'] },
        { name: 'Skincare',                oldCats: [], keywords: ['serum', 'mascarilla', 'crema facial', 'protector solar', 'tonico', 'ampoule', 'biodance', 'medicube', 'skin1004', 'beauty of joseon'] },
        { name: 'Perfumes',                oldCats: [], keywords: ['perfume'] },
        { name: 'Cabello',                 oldCats: [], keywords: ['colita', 'prensa', 'hebilla', 'vincha', 'moño', 'tictac', 'invisible', 'trenza', 'extension de pelo'] },
        { name: 'Brochas y Accesorios',    oldCats: [], keywords: ['brocha', 'esponja', 'beauty blender', 'aplicador'] },
        { name: 'Herramientas de Belleza', oldCats: [], keywords: ['pinza de depilar', 'tijera', 'depiladora', 'perfilador'] },
      ]
    },
    {
      name: 'Moda y Accesorios',
      subs: [
        { name: 'Carteras y Bolsos',       oldCats: [], keywords: ['cartera', 'bandolera', 'bolso', 'riñonera', 'rinonera', 'neceser', 'portacosmetico', 'porta cosmetico', 'portacelular', 'porta celular'] },
        { name: 'Bijouterie',              oldCats: [], keywords: ['aro', 'collar', 'pulsera', 'anillo', 'dije', 'pandora', 'cadena', 'choker', 'piercing', 'abridor'] },
        { name: 'Mochilas',                oldCats: [], keywords: ['mochila', 'morral'] },
        { name: 'Ropa',                    oldCats: [], keywords: ['campera', 'ropa'] },
        { name: 'Relojes',                 oldCats: [], keywords: ['reloj'] },
        { name: 'Lentes de Sol',           oldCats: [], keywords: ['anteojo', 'lente'] },
      ]
    },
    {
      name: 'Electrónica y Tecnología',
      subs: [
        { name: 'Audio',                   oldCats: [], keywords: ['auricular', 'parlante'] },
        { name: 'Cables y Cargadores',     oldCats: [], keywords: ['cable', 'cargador', 'usb'] },
        { name: 'Accesorios para Celular', oldCats: [], keywords: ['accesorio para celular', 'porta celular', 'portacelular', 'llavero para celular'] },
        { name: 'Iluminación y Linternas', oldCats: [], keywords: ['linterna', 'lampara', 'luz led', 'farol'] },
      ]
    },
    {
      name: 'Herramientas y Automotor',
      subs: [
        { name: 'Herramientas Manuales',   oldCats: [], keywords: ['destornillador', 'tenaza', 'pelacable', 'pistola de silicona', 'pinza', 'cutter', 'cinta aisladora', 'alicate', 'llave'] },
        { name: 'Automotor',               oldCats: [], keywords: ['inflador', 'compresor', 'gato hidraulico', 'linga', 'kit reparacion'] },
        { name: 'Seguridad',               oldCats: [], keywords: ['candado', 'alarma'] },
      ]
    },
    {
      name: 'Hogar y Bazar',
      subs: [
        { name: 'Espejos',                 oldCats: [], keywords: ['espejo', 'espejito'] },
        { name: 'Blanquería',              oldCats: [], keywords: ['toalla', 'almohada', 'sabana', 'blanqueria'] },
        { name: 'Electrodomésticos',       oldCats: [], keywords: ['plancha', 'ventilador', 'electrodomestico'] },
        { name: 'Mates y Termos',          oldCats: [], keywords: ['mate', 'termo', 'matero'] },
        { name: 'Climatización',           oldCats: [], keywords: ['ventilador', 'climatizacion'] },
        { name: 'Vajilla y Cristalería',   oldCats: [], keywords: ['vajilla', 'cristaleria', 'plato', 'vaso'] },
      ]
    },
    {
      name: 'Papelería y Oficina',
      subs: [
        { name: 'Escolar',                 oldCats: [], keywords: ['lapicera', 'lapiz', 'boligrafo', 'resaltador', 'libreta', 'escolar'] },
        { name: 'Stickers',                oldCats: [], keywords: ['sticker', 'calcomania'] },
        { name: 'Manualidades',            oldCats: [], keywords: ['pincel', 'manualidad'] },
      ]
    },
    {
      name: 'Juguetería y Aire Libre',
      subs: [
        { name: 'Juguetes',                oldCats: [], keywords: ['peluche', 'juguete', 'slime', 'pelota', 'inflable'] },
      ]
    },
    {
      name: 'Fiesta y Cotillón',
      subs: [
        { name: 'Globos y Decoración',     oldCats: [], keywords: ['globo', 'guirnalda', 'cotillon'] },
      ]
    },
    {
      name: 'Varios',
      subs: [
        { name: 'Otros',                   oldCats: [], keywords: [] },
      ]
    },
  ],

  FALLBACK: { principal: 'Varios', sub: 'Otros' },
  RAIL_SIZE: 12,
};


/* ------------------------------------------------------------
   2. ESTADO GLOBAL
   ------------------------------------------------------------ */
const STATE = {
  products: [],
  filtered: [],
  categories: [],
  activePrincipal: 'all',
  activeSub: 'all',
  activeSort: 'relevance',
  searchTerm: '',
  cart: [],
  currentProduct: null,
  currentQty: 1,
  currentImageIdx: 0,
  viewHistory: ['view-home'],
  loaded: false,
};

const PAGE_SIZE    = 24;
const CARD_CACHE   = new Map();
const SEARCH_INDEX = new Map();
const COLLATOR     = new Intl.Collator('es');


/* ------------------------------------------------------------
   3. HELPERS
   ------------------------------------------------------------ */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const formatPrice = (n) => {
  const num = Math.round(Number(n) || 0);
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parsePrice = (raw) => {
  if (typeof raw === 'number') return raw;
  let str = String(raw == null ? '' : raw).replace(/[^\d.,]/g, '');
  if (!str) return 0;
  const lastDot = str.lastIndexOf('.');
  const lastComma = str.lastIndexOf(',');
  if (lastDot !== -1 && lastComma !== -1) {
    str = lastComma > lastDot
      ? str.replace(/\./g, '').replace(',', '.')
      : str.replace(/,/g, '');
  } else if (lastComma !== -1) {
    const parts = str.split(',');
    str = (parts.length === 2 && parts[1].length !== 3)
      ? parts[0] + '.' + parts[1]
      : str.replace(/,/g, '');
  } else if (lastDot !== -1) {
    const parts = str.split('.');
    str = (parts.length === 2 && parts[1].length !== 3)
      ? str
      : str.replace(/\./g, '');
  }
  return parseFloat(str) || 0;
};

const normalize = (str) =>
  String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const proxiedImage = (url, width) => {
  if (!url) return '';
  const stripped = String(url).replace(/^https?:\/\//, '');
  const size = (CONFIG.IMAGE_RESIZE && width) ? `&w=${width}&we&q=80&output=webp` : '';
  return CONFIG.IMAGE_PROXY + encodeURIComponent(stripped) + size;
};

const debounce = (fn, wait = 200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

async function fetchWithTimeout(url, timeout) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Devuelve el array de imágenes de un producto (con fallback seguro) */
function getProductImages(product) {
  if (!product) return [];
  if (Array.isArray(product.images) && product.images.length) return product.images;
  if (product.image) return [product.image];
  return [];
}


/* ------------------------------------------------------------
   4. CLASIFICACIÓN DE PRODUCTOS
   ------------------------------------------------------------ */
function findSubInTree(principalName, subName) {
  const principal = CONFIG.CATEGORY_TREE.find(p => p.name === principalName);
  if (!principal) return null;
  return principal.subs.find(s => s.name === subName) || null;
}

function classifyProduct(product) {
  const rawPrincipal = String(product.rawPrincipal || '').trim();
  const rawSub       = String(product.rawSub || '').trim();

  if (rawPrincipal && rawSub && findSubInTree(rawPrincipal, rawSub)) {
    return { principal: rawPrincipal, sub: rawSub };
  }

  const catOld = normalize(product.category || '');
  const name   = normalize(product.name || '');

  for (const principal of CONFIG.CATEGORY_TREE) {
    for (const sub of principal.subs) {
      if (sub.oldCats.some(oc => normalize(oc) === catOld)) {
        return { principal: principal.name, sub: sub.name };
      }
    }
  }

  for (const principal of CONFIG.CATEGORY_TREE) {
    for (const sub of principal.subs) {
      if (sub.keywords.some(kw => name.includes(normalize(kw)))) {
        return { principal: principal.name, sub: sub.name };
      }
    }
  }

  return { principal: CONFIG.FALLBACK.principal, sub: CONFIG.FALLBACK.sub };
}


/* ------------------------------------------------------------
   5. CARGA DE DATOS
   ------------------------------------------------------------ */
const CACHE_KEY = 'catalog_cache_v8';
const CART_KEY  = 'cart_v2';
const DATA_URL  = 'productos.json';

function readCache() {
  try {
    [
      'meel_catalog_cache_v1', 'meel_catalog_cache_v2', 'meel_catalog_cache_v3',
      'meel_catalog_cache_v4', 'meel_catalog_cache_v5', 'meel_catalog_cache_v6',
      'meel_catalog_cache_v7', 'meel_cart_v1'
    ].forEach(k => localStorage.removeItem(k));
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const age = (Date.now() - data.timestamp) / (1000 * 60 * 60);
    if (age > CONFIG.CACHE_HOURS) return null;
    return data.products;
  } catch (err) {
    return null;
  }
}

function writeCache(products) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), products }));
  } catch (err) {
    console.warn('No se pudo guardar cache:', err);
  }
}

async function fetchProducts() {
  const res = await fetchWithTimeout(DATA_URL + '?v=' + Date.now(), CONFIG.FETCH_TIMEOUT);
  if (!res.ok) throw new Error('No se pudo cargar ' + DATA_URL + ' (' + res.status + ')');

  const data = await res.json();
  if (!Array.isArray(data)) throw new Error(DATA_URL + ' no es un array');

  const normKey = (k) => normalize(k).replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  const pick = (row, keys) => {
    for (const k of keys) {
      const v = row[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') return v;
    }
    return '';
  };

  const products = data
    .map((rawRow, i) => {
      const row = {};
      Object.keys(rawRow).forEach(k => { row[normKey(k)] = rawRow[k]; });

      const name      = pick(row, ['nombre', 'name', 'titulo', 'title']);
      const category  = pick(row, ['categoria', 'category', 'rubro']) || 'Otros';
      const priceRaw  = pick(row, ['precio_venta', 'precio_de_venta', 'precio', 'pvp', 'price']);
      const active    = normalize(pick(row, ['activo', 'active']) || 'si');
      const rawPrin   = pick(row, ['categoria_principal', 'cat_principal', 'principal']);
      const rawSub    = pick(row, ['subcategoria', 'sub_categoria', 'subcat']);

      /* ----------------------------------------------------
         Recolectar imágenes:
         - Array "imagenes" / "images"  → expandir cada URL
         - Campos sueltos: imagen, imagen2, imagen_3, foto, img, etc.
         ---------------------------------------------------- */
      const imageKeys = Object.keys(row)
        .filter(k => /^(imagen|image|foto|img)(s|es)?(_?\d+)?$/.test(k))
        .sort((a, b) => {
          const na = parseInt((a.match(/\d+/) || [])[0] || '1', 10);
          const nb = parseInt((b.match(/\d+/) || [])[0] || '1', 10);
          if (na !== nb) return na - nb;
          return a.localeCompare(b);
        });

      const rawImages = [];
      imageKeys.forEach(k => {
        const val = row[k];
        if (Array.isArray(val)) {
          val.forEach(v => {
            const s = String(v || '').trim();
            if (s) rawImages.push(s);
          });
        } else {
          const s = String(val || '').trim();
          if (s) rawImages.push(s);
        }
      });

      const uniqueImages = Array.from(new Set(rawImages));

      return {
        id:            String(i + 1),
        name:          String(name).trim(),
        category:      String(category).trim() || 'Otros',
        price:         parsePrice(priceRaw),
        images:        uniqueImages,
        image:         uniqueImages[0] || '',
        active:        ['si', 'yes', 'true', '1', ''].includes(active),
        rawPrincipal:  String(rawPrin).trim(),
        rawSub:        String(rawSub).trim(),
      };
    })
    .filter(p => p.name && p.active && p.price > 0);

  if (data.length && !products.length) {
    console.warn(DATA_URL + ' respondió pero ningún producto es válido. Columnas detectadas:',
      Object.keys(data[0]));
  }
  return products;
}

function setProducts(list) {
  STATE.products = list;
  CARD_CACHE.clear();
  SEARCH_INDEX.clear();
  list.forEach(p => {
    const cls = classifyProduct(p);
    p.principal = cls.principal;
    p.sub       = cls.sub;
    SEARCH_INDEX.set(p.id, normalize(p.name + ' ' + p.category + ' ' + p.principal + ' ' + p.sub));
  });
}

async function loadProducts() {
  const cached = readCache();
  if (cached && cached.length) {
    setProducts(cached);
    return cached;
  }
  const fresh = await fetchProducts();
  writeCache(fresh);
  setProducts(fresh);
  return fresh;
}

async function refreshProducts() {
  const fresh = await fetchProducts();
  writeCache(fresh);
  return fresh;
}


/* ------------------------------------------------------------
   6. CATEGORÍAS
   ------------------------------------------------------------ */
function buildCategories(products) {
  const tree = CONFIG.CATEGORY_TREE.map(p => ({
    principal: p.name,
    count: 0,
    subs: p.subs.map(s => ({ name: s.name, count: 0 })),
  }));

  const index = new Map(tree.map(t => [t.principal, t]));

  products.forEach(prod => {
    let node = index.get(prod.principal);
    if (!node) {
      node = { principal: prod.principal, count: 0, subs: [] };
      index.set(prod.principal, node);
      tree.push(node);
    }
    node.count++;
    let subNode = node.subs.find(s => s.name === prod.sub);
    if (!subNode) {
      subNode = { name: prod.sub, count: 0 };
      node.subs.push(subNode);
    }
    subNode.count++;
  });

  const clean = tree
    .map(t => ({
      ...t,
      subs: t.subs.filter(s => s.count > 0),
    }))
    .filter(t => t.count > 0);

  STATE.categories = clean;
  return clean;
}


/* ------------------------------------------------------------
   7. FILTRADO Y ORDEN
   ------------------------------------------------------------ */
function applyFiltersAndSort() {
  const term = normalize(STATE.searchTerm);
  const prin = STATE.activePrincipal;
  const sub  = STATE.activeSub;
  const sort = STATE.activeSort;

  let list = STATE.products.slice();

  if (prin && prin !== 'all') {
    list = list.filter(p => p.principal === prin);
    if (sub && sub !== 'all') {
      list = list.filter(p => p.sub === sub);
    }
  }

  if (term) {
    list = list.filter(p => (SEARCH_INDEX.get(p.id) || '').includes(term));
  }

  switch (sort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name-asc':   list.sort((a, b) => COLLATOR.compare(a.name, b.name)); break;
    default: break;
  }

  STATE.filtered = list;
  return list;
}


/* ------------------------------------------------------------
   8. RENDER DE PRODUCTOS
   ------------------------------------------------------------ */
let renderedCount    = 0;
let sentinelEl       = null;
let sentinelObserver = null;

function getCard(p) {
  let card = CARD_CACHE.get(p.id);
  if (card) return card;

  card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.id = p.id;

  const safeName = escapeHtml(p.name);
  const safeCat  = escapeHtml(p.sub || p.category);

  card.innerHTML = `
    <div class="product-image">
      ${p.image ? `<img
        src="${proxiedImage(p.image, 480)}"
        alt=""
        loading="lazy"
        decoding="async"
        draggable="false"
        referrerpolicy="no-referrer"
      >` : ''}
    </div>
    <div class="product-info">
      <span class="product-category-tag">${safeCat}</span>
      <h3 class="product-name">${safeName}</h3>
      <div class="product-price-row">
        <span class="product-price">$${formatPrice(p.price)}</span>
      </div>
      <button type="button" class="product-add" data-add="${p.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Agregar
      </button>
    </div>
  `;

  CARD_CACHE.set(p.id, card);
  return card;
}

function ensureSentinel() {
  if (sentinelEl) return;
  sentinelEl = document.createElement('div');
  sentinelEl.id = 'load-more-sentinel';
  sentinelEl.setAttribute('aria-hidden', 'true');
  sentinelEl.style.height = '1px';
  $('#products-container').insertAdjacentElement('afterend', sentinelEl);

  if ('IntersectionObserver' in window) {
    sentinelObserver = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) appendNextPage();
    }, { rootMargin: '600px 0px' });
    sentinelObserver.observe(sentinelEl);
  }
}

function appendNextPage() {
  const pc = $('#products-container');
  if (!pc || pc.hidden) return;

  const list = STATE.filtered;
  if (renderedCount >= list.length) return;

  const pageSize = sentinelObserver ? PAGE_SIZE : Infinity;
  const end  = Math.min(renderedCount + pageSize, list.length);
  const frag = document.createDocumentFragment();

  for (let i = renderedCount; i < end; i++) {
    const card = getCard(list[i]);
    card.style.animationDelay = Math.min((i - renderedCount) * 20, 300) + 'ms';
    frag.appendChild(card);
  }
  renderedCount = end;
  pc.appendChild(frag);

  if (sentinelObserver && renderedCount < list.length) {
    sentinelObserver.unobserve(sentinelEl);
    sentinelObserver.observe(sentinelEl);
  }
}

function scrollResultsToTop() {
  if (window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function buildCategorySections() {
  return STATE.categories
    .map(cat => ({
      name: cat.principal,
      products: STATE.products.filter(p => p.principal === cat.principal),
    }))
    .filter(s => s.products.length > 0);
}

function renderCategorySections() {
  const container = $('#category-sections');
  if (!container) return;
  container.innerHTML = '';

  const sections = buildCategorySections();
  const frag = document.createDocumentFragment();

  sections.forEach(section => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'category-section';

    const header = document.createElement('div');
    header.className = 'category-section-header';
    header.innerHTML = `
      <h2>${escapeHtml(section.name)}</h2>
      <button type="button" class="category-section-more" data-principal-view="${escapeHtml(section.name)}">
        Ver todo
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    `;
    sectionEl.appendChild(header);

    const rail = document.createElement('div');
    rail.className = 'category-rail';

    const items = section.products.slice(0, CONFIG.RAIL_SIZE);
    items.forEach(p => {
      const card = getCard(p).cloneNode(true);
      rail.appendChild(card);
    });

    sectionEl.appendChild(rail);
    frag.appendChild(sectionEl);
  });

  container.appendChild(frag);
}

function isBrowsing() {
  return !STATE.searchTerm &&
         STATE.activePrincipal === 'all' &&
         STATE.activeSort === 'relevance';
}

function renderProducts() {
  const container   = $('#products-container');
  const sectionsEl  = $('#category-sections');
  const emptyState  = $('#empty-state');
  const loading     = $('#loading-state');
  const countEl     = $('#results-count');
  const labelEl     = $('#active-filter-label');

  if (!STATE.loaded) return;
  if (loading) loading.hidden = true;

  if (isBrowsing() && sectionsEl) {
    sectionsEl.hidden = false;
    if (container) { container.hidden = true; container.textContent = ''; }
    if (emptyState) emptyState.hidden = true;

    if (labelEl) labelEl.textContent = 'Todo el catálogo';
    if (countEl) countEl.textContent = `${STATE.products.length} productos`;

    renderCategorySections();
    return;
  }

  if (sectionsEl) sectionsEl.hidden = true;
  if (!container) return;
  container.hidden = false;
  ensureSentinel();

  const list = applyFiltersAndSort();

  let label = 'Resultados';
  if (STATE.activePrincipal !== 'all') {
    label = STATE.activePrincipal;
    if (STATE.activeSub !== 'all') label += ' › ' + STATE.activeSub;
  }
  else if (STATE.searchTerm) label = `Búsqueda: "${STATE.searchTerm}"`;
  if (labelEl) labelEl.textContent = label;
  if (countEl) countEl.textContent = `${list.length} producto${list.length === 1 ? '' : 's'}`;

  container.textContent = '';
  renderedCount = 0;

  if (!list.length) {
    if (emptyState) {
      emptyState.hidden = false;
      if (STATE.searchTerm) {
        $('#empty-title').textContent = 'Sin resultados';
        $('#empty-text').textContent = `No encontramos productos para "${STATE.searchTerm}".`;
      } else {
        $('#empty-title').textContent = 'Sin productos';
        $('#empty-text').textContent = 'No hay productos en esta categoría.';
      }
    }
    return;
  }

  if (emptyState) emptyState.hidden = true;
  appendNextPage();
}


/* ------------------------------------------------------------
   9. BUSCADOR
   ------------------------------------------------------------ */
const searchInput   = $('#search-input');
const searchClear   = $('#search-clear');
const suggestionsEl = $('#search-suggestions');

function showSuggestions(term) {
  suggestionsEl.innerHTML = '';
  if (!term || term.length < 2) { suggestionsEl.hidden = true; return; }

  const norm = normalize(term);
  const matches = [];
  for (const p of STATE.products) {
    if ((SEARCH_INDEX.get(p.id) || '').includes(norm)) {
      matches.push(p);
      if (matches.length === 8) break;
    }
  }

  if (!matches.length) {
    suggestionsEl.innerHTML = `<div class="suggestion-empty">No encontramos "${escapeHtml(term)}"</div>`;
    suggestionsEl.hidden = false;
    return;
  }

  matches.forEach(p => {
    const div = document.createElement('div');
    div.className = 'suggestion';
    div.dataset.id = p.id;
    div.innerHTML = `
      <span class="suggestion-name">${escapeHtml(p.name)}</span>
      <span class="suggestion-price">$${formatPrice(p.price)}</span>
    `;
    suggestionsEl.appendChild(div);
  });

  suggestionsEl.hidden = false;
}

function hideSuggestions() {
  suggestionsEl.hidden = true;
  suggestionsEl.innerHTML = '';
}

function handleSearchInput() {
  const val = searchInput.value;
  STATE.searchTerm = val;
  searchClear.hidden = val.length === 0;

  if (val.length > 0 && !$('#view-home').classList.contains('active')) {
    showView('view-home');
  }

  showSuggestions(val);
  scrollResultsToTop();
  renderProducts();
}

function clearSearch() {
  searchInput.value = '';
  STATE.searchTerm = '';
  searchClear.hidden = true;
  hideSuggestions();
  scrollResultsToTop();
  renderProducts();
  searchInput.focus();
}

searchInput.addEventListener('input', debounce(handleSearchInput, 150));
searchInput.addEventListener('focus', () => {
  if (searchInput.value.length >= 2) showSuggestions(searchInput.value);
});
searchClear.addEventListener('click', clearSearch);

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); hideSuggestions(); searchInput.blur(); }
  if (e.key === 'Escape') { clearSearch(); }
});

suggestionsEl.addEventListener('click', (e) => {
  const item = e.target.closest('.suggestion');
  if (!item) return;
  const id = item.dataset.id;
  const product = STATE.products.find(p => p.id === id);
  if (!product) return;

  searchInput.value = product.name;
  STATE.searchTerm = product.name;
  searchClear.hidden = false;
  hideSuggestions();
  renderProducts();
  openProductModal(product);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-box')) hideSuggestions();
});


/* ------------------------------------------------------------
   10. MODAL DE FILTROS — Jerárquico
   ------------------------------------------------------------ */
function renderFilterChips() {
  const catContainer  = $('#filter-categories');
  const sortContainer = $('#filter-sort');
  const crumb         = $('#filter-breadcrumb');
  const backBtn       = $('#filter-back');
  const catTitle      = $('#filter-cat-title');
  const subWrap       = $('#filter-subcategories-wrap');
  const subContainer  = $('#filter-subcategories');

  catContainer.innerHTML = '';

  const inPrincipal = STATE.activePrincipal !== 'all';
  const inSub       = STATE.activeSub !== 'all';

  /* ---------- Breadcrumb ---------- */
  if (crumb) {
    if (!inPrincipal) {
      crumb.hidden = true;
      crumb.innerHTML = '';
    } else {
      const parts = [];
      parts.push(`<span class="crumb" data-crumb="all">Todas</span>`);
      parts.push(`<span class="crumb-sep">›</span>`);
      if (inSub) {
        parts.push(`<span class="crumb" data-crumb="principal">${escapeHtml(STATE.activePrincipal)}</span>`);
        parts.push(`<span class="crumb-sep">›</span>`);
        parts.push(`<span class="crumb current">${escapeHtml(STATE.activeSub)}</span>`);
      } else {
        parts.push(`<span class="crumb current">${escapeHtml(STATE.activePrincipal)}</span>`);
      }
      crumb.innerHTML = parts.join('');
      crumb.hidden = false;
    }
  }

  /* ---------- Botón volver ---------- */
  if (backBtn) backBtn.hidden = !inPrincipal;

  /* ---------- Chips principales ---------- */
  if (catTitle) catTitle.textContent = 'Categoría';

  if (!inPrincipal) {
    const todasChip = document.createElement('button');
    todasChip.type = 'button';
    todasChip.className = 'chip active';
    todasChip.dataset.cat = 'todas';
    todasChip.textContent = 'Todas';
    catContainer.appendChild(todasChip);

    STATE.categories.forEach(c => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.dataset.cat = c.principal;
      btn.textContent = `${c.principal} (${c.count})`;
      catContainer.appendChild(btn);
    });
  } else {
    const activeCat = STATE.categories.find(c => c.principal === STATE.activePrincipal);
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip active';
    chip.dataset.cat = 'todas';
    chip.textContent = `${STATE.activePrincipal}${activeCat ? ` (${activeCat.count})` : ''}`;
    catContainer.appendChild(chip);
  }

  /* ---------- Subcategorías ---------- */
  if (subWrap && subContainer) {
    if (!inPrincipal) {
      subWrap.hidden = true;
      subContainer.innerHTML = '';
    } else {
      const principal = STATE.categories.find(c => c.principal === STATE.activePrincipal);
      subWrap.hidden = false;
      subContainer.innerHTML = '';

      const todasSub = document.createElement('button');
      todasSub.type = 'button';
      todasSub.className = 'chip' + (!inSub ? ' active' : '');
      todasSub.dataset.sub = 'all';
      todasSub.textContent = `Todas (${principal ? principal.count : 0})`;
      subContainer.appendChild(todasSub);

      if (principal) {
        principal.subs.forEach(s => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'chip' + (STATE.activeSub === s.name ? ' active' : '');
          btn.dataset.sub = s.name;
          btn.textContent = `${s.name} (${s.count})`;
          subContainer.appendChild(btn);
        });
      }
    }
  }

  /* ---------- Orden ---------- */
  $$('.chip', sortContainer).forEach(chip => {
    chip.classList.toggle('active', chip.dataset.sort === STATE.activeSort);
  });

  /* ---------- Contador del botón Filtros ---------- */
  const activeCount = (inPrincipal ? 1 : 0) +
                      (inSub ? 1 : 0) +
                      (STATE.activeSort !== 'relevance' ? 1 : 0);
  const filterCount = $('#filter-count');
  if (filterCount) {
    if (activeCount > 0) { filterCount.textContent = activeCount; filterCount.hidden = false; }
    else { filterCount.hidden = true; }
  }
}

function handleFilterCategoryClick(e) {
  const chip = e.target.closest('.chip[data-cat]');
  if (!chip) return;
  const cat = chip.dataset.cat;

  if (cat === 'todas') {
    STATE.activePrincipal = 'all';
    STATE.activeSub = 'all';
  } else if (cat === STATE.activePrincipal) {
    STATE.activePrincipal = 'all';
    STATE.activeSub = 'all';
  } else {
    STATE.activePrincipal = cat;
    STATE.activeSub = 'all';
  }

  renderFilterChips();
  scrollResultsToTop();
  renderProducts();
}

function handleFilterSubClick(e) {
  const chip = e.target.closest('.chip[data-sub]');
  if (!chip) return;
  STATE.activeSub = chip.dataset.sub;
  renderFilterChips();
  scrollResultsToTop();
  renderProducts();
}

function handleFilterSortClick(e) {
  const chip = e.target.closest('.chip[data-sort]');
  if (!chip) return;
  STATE.activeSort = chip.dataset.sort;
  renderFilterChips();
  scrollResultsToTop();
  renderProducts();
}

function handleFilterBack() {
  if (STATE.activeSub !== 'all') {
    STATE.activeSub = 'all';
  } else {
    STATE.activePrincipal = 'all';
    STATE.activeSub = 'all';
  }
  renderFilterChips();
  scrollResultsToTop();
  renderProducts();
}

function handleBreadcrumbClick(e) {
  const crumb = e.target.closest('[data-crumb]');
  if (!crumb) return;
  const target = crumb.dataset.crumb;
  if (target === 'all') {
    STATE.activePrincipal = 'all';
    STATE.activeSub = 'all';
  } else if (target === 'principal') {
    STATE.activeSub = 'all';
  }
  renderFilterChips();
  scrollResultsToTop();
  renderProducts();
}

function resetFilters() {
  STATE.activePrincipal = 'all';
  STATE.activeSub = 'all';
  STATE.activeSort = 'relevance';
  STATE.searchTerm = '';
  searchInput.value = '';
  searchClear.hidden = true;
  hideSuggestions();
  renderFilterChips();
  scrollResultsToTop();
  renderProducts();
}

function applyFilters() {
  closeModal('#modal-filters');
}

$('#btn-open-filters').addEventListener('click', () => {
  renderFilterChips();
  openModal('#modal-filters');
});
$('#filter-categories').addEventListener('click', handleFilterCategoryClick);
$('#filter-subcategories')?.addEventListener('click', handleFilterSubClick);
$('#filter-sort').addEventListener('click', handleFilterSortClick);
$('#filter-back')?.addEventListener('click', handleFilterBack);
$('#filter-breadcrumb')?.addEventListener('click', handleBreadcrumbClick);
$('#btn-reset-filters').addEventListener('click', resetFilters);
$('#btn-apply-filters').addEventListener('click', applyFilters);


/* ------------------------------------------------------------
   11. DRAWER — Categorías jerárquicas
   ------------------------------------------------------------ */
function renderDrawerCategories() {
  const container = $('#drawer-cats-list');
  if (!container) return;
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'drawer-cat-item all';
  allBtn.dataset.principal = 'all';
  allBtn.textContent = 'Ver todos los productos';
  container.appendChild(allBtn);

  STATE.categories.forEach(cat => {
    const group = document.createElement('div');
    group.className = 'drawer-cat-group-item';

    const principalBtn = document.createElement('button');
    principalBtn.type = 'button';
    principalBtn.className = 'drawer-cat-item principal';
    principalBtn.dataset.principal = cat.principal;
    principalBtn.innerHTML = `
      <span>${escapeHtml(cat.principal)} (${cat.count})</span>
      <svg class="drawer-sub-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    `;

    const subList = document.createElement('div');
    subList.className = 'drawer-sub-list';
    subList.hidden = true;

    cat.subs.forEach(sub => {
      const subBtn = document.createElement('button');
      subBtn.type = 'button';
      subBtn.className = 'drawer-cat-item sub';
      subBtn.dataset.principal = cat.principal;
      subBtn.dataset.sub = sub.name;
      subBtn.textContent = `${sub.name} (${sub.count})`;
      subList.appendChild(subBtn);
    });

    principalBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      subList.hidden = !subList.hidden;
      principalBtn.classList.toggle('open', !subList.hidden);
    });

    group.appendChild(principalBtn);
    group.appendChild(subList);
    container.appendChild(group);
  });
}

function selectFromDrawer(principal, sub) {
  STATE.activePrincipal = principal;
  STATE.activeSub = sub || 'all';
  STATE.activeSort = 'relevance';
  STATE.searchTerm = '';
  searchInput.value = '';
  searchClear.hidden = true;
  renderFilterChips();
  closeDrawer();
  showView('view-home');
  scrollResultsToTop();
  renderProducts();
}

const drawerCatsToggle = $('#btn-drawer-cats');
if (drawerCatsToggle) {
  drawerCatsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const list = $('#drawer-cats-list');
    const open = drawerCatsToggle.getAttribute('aria-expanded') === 'true';
    drawerCatsToggle.setAttribute('aria-expanded', String(!open));
    if (list) list.hidden = open;
  });
}

const drawerCatsList = $('#drawer-cats-list');
if (drawerCatsList) {
  drawerCatsList.addEventListener('click', (e) => {
    const btn = e.target.closest('.drawer-cat-item[data-principal]');
    if (!btn) return;
    const principal = btn.dataset.principal;
    const sub = btn.dataset.sub || 'all';
    selectFromDrawer(principal, sub);
  });
}


/* ------------------------------------------------------------
   12. MODAL DE PRODUCTO — con galería (dots, swipe, flechas)
   ------------------------------------------------------------ */
function openProductModal(product) {
  STATE.currentProduct = product;
  STATE.currentQty = 1;
  STATE.currentImageIdx = 0;

  const catText = product.sub && product.sub !== 'Sin clasificar'
    ? `${product.principal} › ${product.sub}`
    : product.category;

  $('#product-modal-category').textContent = catText;
  $('#product-modal-name').textContent = product.name;
  $('#product-modal-price').textContent = '$' + formatPrice(product.price);
  $('#product-modal-desc').textContent = '';
  $('#qty-value').textContent = '1';

  const imgWrap = $('#product-modal-image');
  imgWrap.innerHTML = '';

  const images = getProductImages(product);

  if (images.length) {
    const gallery = document.createElement('div');
    gallery.className = 'gallery';

    // ---- Imagen grande ----
    const main = document.createElement('div');
    main.className = 'gallery-main';

    const mainImg = document.createElement('img');
    mainImg.src = proxiedImage(images[0], 900);
    mainImg.draggable = false;
    mainImg.alt = '';
    mainImg.referrerPolicy = 'no-referrer';
    mainImg.loading = 'eager';
    mainImg.className = 'gallery-main-img';
    main.appendChild(mainImg);

    // Flechas (solo si hay más de 1)
    if (images.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'gallery-arrow prev';
      prevBtn.setAttribute('aria-label', 'Foto anterior');
      prevBtn.disabled = true;
      prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
      main.appendChild(prevBtn);

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'gallery-arrow next';
      nextBtn.setAttribute('aria-label', 'Foto siguiente');
      nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
      main.appendChild(nextBtn);

      // ---- Dots ----
      const dots = document.createElement('div');
      dots.className = 'gallery-dots';
      images.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'gallery-dot' + (idx === 0 ? ' active' : '');
        dot.dataset.idx = String(idx);
        dot.setAttribute('aria-label', `Ir a la foto ${idx + 1}`);
        dots.appendChild(dot);
      });
      main.appendChild(dots);
    }

    gallery.appendChild(main);

    // ---- Miniaturas (solo si hay más de 1) ----
    if (images.length > 1) {
      const thumbs = document.createElement('div');
      thumbs.className = 'gallery-thumbs';

      images.forEach((url, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gallery-thumb' + (idx === 0 ? ' active' : '');
        btn.dataset.idx = String(idx);
        btn.setAttribute('aria-label', `Ver imagen ${idx + 1}`);

        const thumbImg = document.createElement('img');
        thumbImg.src = proxiedImage(url, 160);
        thumbImg.alt = '';
        thumbImg.loading = 'lazy';
        thumbImg.decoding = 'async';
        thumbImg.draggable = false;
        thumbImg.referrerPolicy = 'no-referrer';
        btn.appendChild(thumbImg);

        thumbs.appendChild(btn);
      });

      gallery.appendChild(thumbs);
    }

    imgWrap.appendChild(gallery);
  }

  openModal('#modal-product');
}

/* Ir a una foto específica actualizando TODOS los indicadores */
function goToGalleryImage(idx) {
  const product = STATE.currentProduct;
  if (!product) return;
  const images = getProductImages(product);
  if (idx < 0 || idx >= images.length) return;

  STATE.currentImageIdx = idx;
  const url = images[idx];

  const mainImg = $('#product-modal-image .gallery-main-img');
  if (mainImg) mainImg.src = proxiedImage(url, 900);

  // Miniaturas
  $$('#product-modal-image .gallery-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });

  // Dots
  $$('#product-modal-image .gallery-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });

  // Flechas: atenuadas en los extremos
  const prev = $('#product-modal-image .gallery-arrow.prev');
  const next = $('#product-modal-image .gallery-arrow.next');
  if (prev) prev.disabled = (idx === 0);
  if (next) next.disabled = (idx === images.length - 1);

  // Miniaturas: scroll a la activa
  const activeThumb = $(`#product-modal-image .gallery-thumb[data-idx="${idx}"]`);
  if (activeThumb && activeThumb.scrollIntoView) {
    activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

/* Click: miniatura, flecha prev, flecha next, o dot */
$('#product-modal-image').addEventListener('click', (e) => {
  const thumb = e.target.closest('.gallery-thumb');
  if (thumb) { goToGalleryImage(Number(thumb.dataset.idx)); return; }

  const dot = e.target.closest('.gallery-dot');
  if (dot) { goToGalleryImage(Number(dot.dataset.idx)); return; }

  if (e.target.closest('.gallery-arrow.prev')) {
    goToGalleryImage(STATE.currentImageIdx - 1);
    return;
  }
  if (e.target.closest('.gallery-arrow.next')) {
    goToGalleryImage(STATE.currentImageIdx + 1);
    return;
  }
});

/* Swipe horizontal sobre la imagen grande */
(function setupGallerySwipe() {
  const wrap = $('#product-modal-image');
  let startX = 0;
  let startY = 0;
  let tracking = false;

  wrap.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.gallery-main')) return;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    tracking = true;
  }, { passive: true });

  wrap.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;

    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0) {
      goToGalleryImage(STATE.currentImageIdx + 1);
    } else {
      goToGalleryImage(STATE.currentImageIdx - 1);
    }
  }, { passive: true });
})();

/* Flechas del teclado en desktop */
document.addEventListener('keydown', (e) => {
  if (!$('#modal-product').classList.contains('open')) return;
  const product = STATE.currentProduct;
  if (!product) return;
  const images = getProductImages(product);
  if (images.length < 2) return;

  if (e.key === 'ArrowRight') { e.preventDefault(); goToGalleryImage(STATE.currentImageIdx + 1); }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); goToGalleryImage(STATE.currentImageIdx - 1); }
});

function closeProductModal() {
  closeModal('#modal-product');
  STATE.currentProduct = null;
  STATE.currentImageIdx = 0;
}

$('#qty-minus').addEventListener('click', () => {
  if (STATE.currentQty > 1) {
    STATE.currentQty--;
    $('#qty-value').textContent = STATE.currentQty;
  }
});

$('#qty-plus').addEventListener('click', () => {
  if (STATE.currentQty < 99) {
    STATE.currentQty++;
    $('#qty-value').textContent = STATE.currentQty;
  }
});

$('#btn-add-to-cart').addEventListener('click', () => {
  const product = STATE.currentProduct;
  if (!product) return;
  addToCart(product, STATE.currentQty);
  closeProductModal();
  showToast(`${product.name} agregado`, 'success');
});


/* ------------------------------------------------------------
   13. CARRITO
   ------------------------------------------------------------ */
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    STATE.cart = Array.isArray(parsed) ? parsed : [];
  } catch (err) { STATE.cart = []; }
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(STATE.cart)); }
  catch (err) { console.warn('No se pudo guardar el carrito:', err); }
}

function addToCart(product, qty = 1) {
  const existing = STATE.cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 99);
  } else {
    STATE.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty,
    });
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  STATE.cart = STATE.cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const item = STATE.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  if (item.qty > 99) item.qty = 99;
  saveCart();
  renderCart();
}

function clearCart() {
  if (!STATE.cart.length) return;
  if (!confirm('¿Vaciar todo el carrito?')) return;
  STATE.cart = [];
  saveCart();
  renderCart();
  showToast('Carrito vaciado');
}

function cartTotal() { return STATE.cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartCount() { return STATE.cart.reduce((s, i) => s + i.qty, 0); }

function renderCart() {
  const container = $('#cart-items');
  const emptyEl = $('#cart-empty');
  const totalEl = $('#cart-total');
  const btnCheckout = $('#btn-checkout');
  const btnClear = $('#btn-clear-cart');

  const total = cartTotal();
  const count = cartCount();

  [
    { el: $('#cart-count'), show: count > 0 },
    { el: $('#cart-count-mobile'), show: count > 0 },
  ].forEach(({ el, show }) => {
    if (!el) return;
    if (show) { el.textContent = count; el.hidden = false; }
    else { el.hidden = true; }
  });

  if (!STATE.cart.length) {
    container.innerHTML = '';
    emptyEl.hidden = false;
    totalEl.textContent = '$0';
    btnCheckout.disabled = true;
    btnClear.hidden = true;
    return;
  }

  emptyEl.hidden = true;
  btnCheckout.disabled = false;
  btnClear.hidden = false;

  container.innerHTML = STATE.cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-image">
        ${item.image ? `<img src="${proxiedImage(item.image, 160)}" alt="" loading="lazy" draggable="false" referrerpolicy="no-referrer">` : ''}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${escapeHtml(item.name)}</div>
        <div class="cart-item-price">$${formatPrice(item.price * item.qty)}</div>
        <div class="qty-controls" style="margin-top:6px;padding:2px 4px;gap:4px;">
          <button type="button" data-qty="-1" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button type="button" data-qty="1" data-id="${item.id}">+</button>
        </div>
      </div>
      <button type="button" class="cart-item-remove" data-remove="${item.id}" aria-label="Quitar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `).join('');

  totalEl.textContent = '$' + formatPrice(total);
}

$('#cart-items').addEventListener('click', (e) => {
  const removeBtn = e.target.closest('[data-remove]');
  if (removeBtn) { removeFromCart(removeBtn.dataset.remove); return; }

  const qtyBtn = e.target.closest('[data-qty]');
  if (qtyBtn) changeQty(qtyBtn.dataset.id, Number(qtyBtn.dataset.qty));
});

$('#btn-clear-cart').addEventListener('click', clearCart);


/* ------------------------------------------------------------
   14. CHECKOUT (WhatsApp)
   ------------------------------------------------------------ */
function openCheckout() {
  if (!STATE.cart.length) return;

  const summary = $('#checkout-summary');
  summary.innerHTML = STATE.cart.map(item => `
    <div class="order-summary-item">
      <span>${item.qty}× ${escapeHtml(item.name)}</span>
      <b>$${formatPrice(item.price * item.qty)}</b>
    </div>
  `).join('');

  $('#checkout-total').textContent = '$' + formatPrice(cartTotal());
  closeCart();
  openModal('#modal-checkout');
}

function handleCheckout(e) {
  e.preventDefault();

  const name    = $('#co-name').value.trim();
  const phone   = $('#co-phone').value.trim();
  const address = $('#co-address').value.trim();
  const notes   = $('#co-notes').value.trim();

  if (!name || !address) return;

  const lines = [
    `*Nuevo pedido — Catálogo*`, ``,
    `*Cliente:* ${name}`,
  ];
  if (phone) lines.push(`*Teléfono:* ${phone}`);
  lines.push(`*Dirección:* ${address}`);
  if (notes) lines.push(`*Notas:* ${notes}`);

  lines.push(``, `*Productos:*`);
  STATE.cart.forEach(item => {
    lines.push(`• ${item.qty}× ${item.name} — $${formatPrice(item.price * item.qty)}`);
  });
  lines.push(``, `*Total: $${formatPrice(cartTotal())}*`);

  const msg = lines.join('\n');
  const url = `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`;

  window.open(url, '_blank', 'noopener');

  STATE.cart = [];
  saveCart();
  renderCart();
  closeModal('#modal-checkout');
  $('#checkout-form').reset();

  showToast('Pedido enviado por WhatsApp', 'success');
}

$('#checkout-form').addEventListener('submit', handleCheckout);
$('#btn-checkout').addEventListener('click', openCheckout);


/* ------------------------------------------------------------
   15. MODALES — infraestructura
   ------------------------------------------------------------ */
function openModal(selector) {
  const modal = $(selector);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  $('#overlay').classList.add('active');
  document.body.classList.add('no-scroll');
  const focusable = modal.querySelector('input, textarea, button');
  if (focusable) setTimeout(() => focusable.focus(), 100);
}

function closeModal(selector) {
  const modal = $(selector);
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  syncOverlay();
}

function syncOverlay() {
  const anyOpen = $$('.modal.open').length > 0 ||
                  $('#cart-sidebar').classList.contains('open') ||
                  $('#drawer').classList.contains('open');
  $('#overlay').classList.toggle('active', anyOpen);
  document.body.classList.toggle('no-scroll', anyOpen);
}

function closeAllModals() {
  $$('.modal.open').forEach(m => {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  });
  closeDrawer();
  closeCart();
  syncOverlay();
}

document.addEventListener('click', (e) => {
  const closeTrigger = e.target.closest('[data-close]');
  if (closeTrigger) {
    const modal = closeTrigger.closest('.modal');
    if (modal) closeModal('#' + modal.id);
  }
});

$('#overlay').addEventListener('click', closeAllModals);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeAllModals(); hideSuggestions(); }
});


/* ------------------------------------------------------------
   16. DRAWER (menú lateral)
   ------------------------------------------------------------ */
function openDrawer() {
  $('#drawer').classList.add('open');
  $('#drawer').setAttribute('aria-hidden', 'false');
  $('#overlay').classList.add('active');
  document.body.classList.add('no-scroll');
}

function closeDrawer() {
  $('#drawer').classList.remove('open');
  $('#drawer').setAttribute('aria-hidden', 'true');
  syncOverlay();
}

$('#btn-menu').addEventListener('click', openDrawer);
$('#btn-close-drawer').addEventListener('click', closeDrawer);


/* ------------------------------------------------------------
   17. CARRITO SIDEBAR
   ------------------------------------------------------------ */
function openCart() {
  closeDrawer();
  $('#cart-sidebar').classList.add('open');
  $('#cart-sidebar').setAttribute('aria-hidden', 'false');
  $('#overlay').classList.add('active');
  document.body.classList.add('no-scroll');
}

function closeCart() {
  $('#cart-sidebar').classList.remove('open');
  $('#cart-sidebar').setAttribute('aria-hidden', 'true');
  syncOverlay();
}

$('#btn-cart').addEventListener('click', () => {
  if ($('#cart-sidebar').classList.contains('open')) closeAllModals();
  else openCart();
});
$('#btn-close-cart').addEventListener('click', closeCart);
$('#btn-bottom-cart')?.addEventListener('click', openCart);


/* ------------------------------------------------------------
   18. NAVEGACIÓN ENTRE VISTAS
   ------------------------------------------------------------ */
function showView(viewId, pushHistory = true) {
  if (!viewId) return;

  $$('.view').forEach(v => v.classList.toggle('active', v.id === viewId));

  $$('[data-view]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeDrawer();

  if (pushHistory) {
    const slug = viewId.replace('view-', '');
    const hash = slug === 'home' ? '' : '#' + slug;
    try {
      history.pushState({ view: viewId }, '', window.location.pathname + hash);
    } catch (err) { /* file:// o iframe */ }
  }

  STATE.viewHistory.push(viewId);
}

document.querySelectorAll('.drawer-links button[data-view]').forEach(btn => {
  btn.addEventListener('click', () => showView(btn.dataset.view));
});

document.querySelectorAll('.bottom-nav-btn[data-view]').forEach(btn => {
  btn.addEventListener('click', () => showView(btn.dataset.view));
});

$('#brand-home').addEventListener('click', (e) => {
  e.preventDefault();
  if ($('#view-home').classList.contains('active')) {
    resetFilters();
  } else {
    showView('view-home');
  }
});

$('#btn-bottom-search')?.addEventListener('click', () => {
  showView('view-home');
  setTimeout(() => {
    searchInput.focus();
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 200);
});

$('#btn-empty-reset').addEventListener('click', () => {
  resetFilters();
});

window.addEventListener('popstate', (e) => {
  if (e.state && e.state.view) showView(e.state.view, false);
  else showView('view-home', false);
});


/* ------------------------------------------------------------
   19. FAQ
   ------------------------------------------------------------ */
const FAQS = [
  { q: '¿Cómo hago un pedido?', a: 'Agregá productos al carrito, tocá "Finalizar por WhatsApp" y completá tus datos. Te llegará un mensaje prearmado con el detalle del pedido.' },
  { q: '¿Cuánto tarda el envío?', a: 'Coordinamos la entrega por WhatsApp después de confirmar el pedido. Generalmente se entrega en 24-72 hs hábiles según la zona.' },
  { q: '¿Cómo se paga?', a: 'El pago se coordina por WhatsApp. Aceptamos transferencia, efectivo y otros métodos según la zona.' },
  { q: '¿Los precios incluyen envío?', a: 'No, el envío se coordina aparte según la dirección de entrega.' },
  { q: '¿Puedo cambiar o devolver un producto?', a: 'Los cambios y devoluciones se manejan caso por caso. Escribinos por WhatsApp y lo resolvemos.' },
];

function renderFAQs() {
  const container = $('#faq-list');
  container.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item" data-faq="${i}">
      <button type="button" class="faq-question">
        <span>${escapeHtml(f.q)}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div class="faq-answer"><p>${escapeHtml(f.a)}</p></div>
    </div>
  `).join('');

  container.addEventListener('click', (e) => {
    const q = e.target.closest('.faq-question');
    if (!q) return;
    q.closest('.faq-item').classList.toggle('open');
  });
}


/* ------------------------------------------------------------
   20. CONTACTO
   ------------------------------------------------------------ */
function setupContactLinks() {
  const waLink = $('#contact-wa-link');
  const igLink = $('#contact-ig-link');

  if (waLink) waLink.href = `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent('Hola! Quiero hacer una consulta.')}`;
  if (igLink) {
    if (CONFIG.INSTAGRAM) {
      igLink.href = `https://instagram.com/${CONFIG.INSTAGRAM}`;
    } else {
      igLink.style.display = 'none';
    }
  }
}


/* ------------------------------------------------------------
   21. PROTECCIONES
   ------------------------------------------------------------ */
function setupImageProtections() {
  document.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'IMG') e.target.style.display = 'none';
  }, true);

  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('drop', (e) => e.preventDefault());
  document.addEventListener('dragover', (e) => e.preventDefault());
}

function setupCartDelegation() {
  const root = $('#view-home');
  if (!root) return;

  root.addEventListener('click', (e) => {
    const principalBtn = e.target.closest('[data-principal-view]');
    if (principalBtn) {
      STATE.activePrincipal = principalBtn.dataset.principalView;
      STATE.activeSub = 'all';
      STATE.activeSort = 'relevance';
      STATE.searchTerm = '';
      searchInput.value = '';
      searchClear.hidden = true;
      renderFilterChips();
      scrollResultsToTop();
      renderProducts();
      return;
    }

    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      e.stopPropagation();
      const id = addBtn.dataset.add;
      const product = STATE.products.find(p => p.id === id);
      if (product) {
        addToCart(product, 1);
        showToast(`${product.name} agregado`, 'success');
      }
      return;
    }

    const card = e.target.closest('.product-card');
    if (card) {
      const id = card.dataset.id;
      const product = STATE.products.find(p => p.id === id);
      if (product) openProductModal(product);
    }
  });
}


/* ------------------------------------------------------------
   22. TOASTS
   ------------------------------------------------------------ */
function showToast(message, type = '') {
  let container = $('#toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast' + (type ? ' ' + type : '');
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}


/* ------------------------------------------------------------
   23. INIT
   ------------------------------------------------------------ */
async function init() {
  loadCart();
  renderCart();

  renderFAQs();
  setupContactLinks();

  setupImageProtections();
  setupCartDelegation();

  if (window.location.hash) {
    const slug = window.location.hash.slice(1);
    const target = 'view-' + slug;
    if (document.getElementById(target)) showView(target, false);
  }

  searchClear.hidden = true;

  await bootProducts();
}

async function bootProducts() {
  const loading = $('#loading-state');
  if (loading) {
    loading.hidden = false;
    loading.innerHTML = '<span class="spinner" aria-hidden="true"></span><p>Cargando catálogo...</p>';
  }

  try {
    const products = await loadProducts();
    STATE.loaded = true;
    buildCategories(products);
    renderFilterChips();
    renderDrawerCategories();
    renderProducts();

    setTimeout(() => {
      refreshProducts().then(fresh => {
        const current = STATE.products.map(p => ({
          id: p.id, name: p.name, category: p.category, price: p.price, image: p.image, active: p.active
        }));
        if (JSON.stringify(fresh) !== JSON.stringify(current)) {
          setProducts(fresh);
          buildCategories(fresh);
          renderFilterChips();
          renderDrawerCategories();
          renderProducts();
        }
      }).catch(() => {});
    }, 5000);

  } catch (err) {
    console.error('Error cargando productos:', err);
    if (loading) {
      loading.hidden = false;
      loading.innerHTML = `
        <p style="color:var(--danger);font-weight:600;">No pudimos cargar el catálogo</p>
        <p class="footer-muted">${escapeHtml(err.message || 'Revisá tu conexión e intentá de nuevo.')}</p>
        <button type="button" id="btn-retry" class="btn-ghost" style="margin-top:12px;">Reintentar</button>
      `;
      $('#btn-retry').addEventListener('click', bootProducts);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}