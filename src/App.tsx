import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Phone,
  Clock,
  Search,
  ShoppingCart,
  Plus,
  Pencil,
  Save,
  RotateCcw,
  Trash2,
  X,
  ExternalLink,
  ShieldCheck,
  Truck,
  HeartPulse,
  Send,
  Image as ImageIcon,
  Check,
  Pill,
  Sparkles,
  Stethoscope,
  Droplets,
  AlertCircle
} from 'lucide-react';
import { Product, ProductCategory, CartItem, SiteContent } from './types';
import { initialProducts, initialSiteContent } from './data';

const STORAGE_KEY_PRODUCTS = 'sreyNeang_products_v2';
const STORAGE_KEY_CONTENT = 'sreyNeang_site_content_v2';

export default function App() {
  // --- States ---
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTENT);
      if (saved) return { ...initialSiteContent, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
    return initialSiteContent;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialProducts;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Image editing modal state
  const [imageModalTarget, setImageModalTarget] = useState<{
    type: 'hero' | 'product';
    productId?: number | string;
    currentUrl: string;
  } | null>(null);
  const [inputImageUrl, setInputImageUrl] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New product form state
  const [newProd, setNewProd] = useState<{
    name: string;
    category: ProductCategory;
    price: string;
    image: string;
    description: string;
  }>({
    name: '',
    category: 'general',
    price: '',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: ''
  });

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to localStorage
  const saveAllChanges = () => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(siteContent));
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
      showToast('✅ បានរក្សាទុកការកែប្រែដោយជោគជ័យ!');
    } catch (e) {
      console.error(e);
      showToast('⚠️ បរាជ័យក្នុងការរក្សាទុក!');
    }
  };

  const resetAllData = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យឡើងវិញទៅជាទម្រង់ដើមទាំងអស់មែនទេ?')) {
      localStorage.removeItem(STORAGE_KEY_CONTENT);
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
      setSiteContent(initialSiteContent);
      setProducts(initialProducts);
      setIsEditMode(false);
      showToast('🔄 បានកំណត់ទិន្នន័យដើមឡើងវិញរួចរាល់!');
    }
  };

  // Content updater
  const updateContentField = (key: keyof SiteContent, value: string) => {
    setSiteContent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Product updating handlers
  const updateProductField = (
    id: number | string,
    field: keyof Product,
    value: any
  ) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const deleteProduct = (id: number | string, name: string) => {
    if (window.confirm(`តើអ្នកពិតជាចង់លុប "${name}" មែនទេ?`)) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
      setCart((prev) => prev.filter((item) => item.id !== id));
      showToast('🗑️ បានលុបផលិតផលជោគជ័យ!');
    }
  };

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`🛒 បានបន្ថែម "${product.name.slice(0, 20)}..." ទៅកន្ត្រក!`);
  };

  const updateCartQty = (id: number | string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (id: number | string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotalQty = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const cartTotalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  // Generate Telegram link with Cambodian order breakdown
  const telegramOrderUrl = useMemo(() => {
    if (cart.length === 0) {
      return `https://t.me/${siteContent.telegramPhone.replace(/\+/g, '')}?text=${encodeURIComponent(
        'ជំរាបសួរឱសថស្ថាន ស្រី នាង! ខ្ញុំមានបំណងសាកសួរព័ត៌មានអំពីថ្នាំពេទ្យ។'
      )}`;
    }
    let msg = `ជំរាបសួរ *ឱសថស្ថាន ស្រី នាង*!\nខ្ញុំចង់កុម្ម៉ង់ទិញឱសថ និងសម្ភារៈពេទ្យដូចខាងក្រោម៖\n\n`;
    cart.forEach((item, index) => {
      msg += `${index + 1}. *${item.name}*\n   - ចំនួន: ${item.qty}\n   - តម្លៃ: $${(
        item.price * item.qty
      ).toFixed(2)}\n`;
    });
    msg += `\n💵 *សរុបទាំងអស់: $${cartTotalPrice.toFixed(2)}* (~${(
      cartTotalPrice * 4100
    ).toLocaleString()} រៀល)\n\n📍 សូមជួយពិនិត្យ និងទាក់ទងមកខ្ញុំដើម្បីដឹកជញ្ជូន។ អរគុណ!`;

    const cleanPhone = siteContent.telegramPhone.replace(/[^\d+]/g, '');
    return `https://t.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  }, [cart, cartTotalPrice, siteContent.telegramPhone]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const matchCat = currentCategory === 'all' || p.category === currentCategory;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [products, currentCategory, searchQuery]);

  // Open Image modal
  const openImageEditor = (
    type: 'hero' | 'product',
    productId?: number | string,
    currentUrl = ''
  ) => {
    if (!isEditMode) return;
    setImageModalTarget({ type, productId, currentUrl });
    setInputImageUrl(currentUrl);
    setPreviewImage(currentUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
        setInputImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyImageChange = () => {
    if (!imageModalTarget || !previewImage) return;

    if (imageModalTarget.type === 'hero') {
      updateContentField('heroImg', previewImage);
      showToast('📷 បានផ្លាស់ប្តូររូបភាព Banner!');
    } else if (imageModalTarget.type === 'product' && imageModalTarget.productId) {
      updateProductField(imageModalTarget.productId, 'image', previewImage);
      showToast('📷 បានផ្លាស់ប្តូររូបភាពផលិតផល!');
    }

    setImageModalTarget(null);
    setInputImageUrl('');
    setPreviewImage('');
  };

  // Add Product form handler
  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newProd.price);
    if (!newProd.name.trim() || isNaN(priceNum) || priceNum < 0) {
      alert('សូមបញ្ចូលឈ្មោះ និងតម្លៃឲ្យបានត្រឹមត្រូវ!');
      return;
    }

    const created: Product = {
      id: Date.now(),
      name: newProd.name.trim(),
      category: newProd.category,
      price: priceNum,
      image:
        newProd.image.trim() ||
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      description:
        newProd.description.trim() ||
        'ឱសថមានគុណភាពខ្ពស់ ផ្តល់សុវត្ថិភាពដល់អ្នកជំងឺ។'
    };

    setProducts([created, ...products]);
    setIsAddModalOpen(false);
    setNewProd({
      name: '',
      category: 'general',
      price: '',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      description: ''
    });
    showToast(`✅ បានបន្ថែម "${created.name}" ទៅក្នុងបញ្ជីដោយជោគជ័យ!`);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 ${isEditMode ? 'editable-active' : ''}`}>
      {/* --- Toast Notification --- */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-sky-500/40 text-sm font-medium flex items-center gap-2.5 backdrop-blur-md animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- Admin Control Bar --- */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-2.5 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2 shadow-lg border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isEditMode ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isEditMode ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            ></span>
          </span>
          <span className="font-semibold tracking-wide flex items-center gap-1.5">
            ប្រព័ន្ធគ្រប់គ្រងការកែប្រែទំព័រ
            {isEditMode && (
              <span className="hidden md:inline-block bg-amber-500/20 text-amber-300 text-[11px] px-2 py-0.5 rounded-full border border-amber-400/30">
                (ចុចលើអត្ថបទ ឬរូបភាពដើម្បីកែផ្ទាល់)
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 shadow-sm ${
              isEditMode
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                : 'bg-sky-600 hover:bg-sky-500 text-white'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'បិទ Mode កែប្រែ' : 'បើក Mode កែប្រែ'}</span>
          </button>

          {isEditMode && (
            <>
              <button
                onClick={saveAllChanges}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>រក្សាទុក</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-sky-700 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>បន្ថែមថ្នាំថ្មី</span>
              </button>
            </>
          )}

          <button
            onClick={resetAllData}
            className="bg-rose-700 hover:bg-rose-600 text-white px-2.5 py-1.5 rounded-lg font-medium transition text-xs flex items-center gap-1"
            title="កំណត់ឡើងវិញទៅដើម"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">កំណត់ឡើងវិញ</span>
          </button>
        </div>
      </div>

      {/* --- Top Contact & Announcement Bar --- */}
      <div className="bg-sky-50 border-b border-sky-100 py-1.5 px-4 text-xs text-sky-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href={`tel:${siteContent.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-sky-700 transition font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => updateContentField('phone', e.currentTarget.innerText)}
              >
                {siteContent.phone}
              </span>
            </a>

            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => updateContentField('hours', e.currentTarget.innerText)}
              >
                {siteContent.hours}
              </span>
            </div>
          </div>

          <div
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => updateContentField('topNote', e.currentTarget.innerText)}
            className="text-sky-800 font-semibold text-center"
          >
            {siteContent.topNote}
          </div>
        </div>
      </div>

      {/* --- Main Sticky Header --- */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-[45px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-400 text-white flex items-center justify-center shadow-md shadow-sky-200 shrink-0">
              <Pill className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <h1
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => updateContentField('siteTitle', e.currentTarget.innerText)}
                className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight tracking-tight cursor-text"
              >
                {siteContent.siteTitle}
              </h1>
              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => updateContentField('siteSubtitle', e.currentTarget.innerText)}
                className="text-[11px] sm:text-xs text-sky-600 font-semibold uppercase tracking-wider"
              >
                {siteContent.siteSubtitle}
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកឈ្មោះថ្នាំ សេរ៉ូម ឬឧបករណ៍ពេទ្យ..."
              className="w-full bg-slate-100/90 border border-slate-200 rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cart & Quick Contact Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-sky-50 hover:bg-sky-100 text-sky-700 p-2.5 sm:px-3 sm:py-2 rounded-xl transition flex items-center gap-2 border border-sky-200/60"
            >
              <ShoppingCart className="w-5 h-5 text-sky-600" />
              <span className="hidden sm:inline text-xs font-bold text-slate-700">កន្ត្រក</span>
              {cartTotalQty > 0 && (
                <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {cartTotalQty}
                </span>
              )}
            </button>

            <a
              href={`tel:${siteContent.phone.replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>ទាក់ទងទិញ</span>
            </a>

            <a
              href={telegramOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white p-2.5 sm:px-3.5 sm:py-2 rounded-xl font-medium text-xs sm:text-sm transition shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden md:inline">Telegram</span>
            </a>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="p-2 px-4 md:hidden border-t border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកឈ្មោះថ្នាំ សេរ៉ូម ឬឧបករណ៍ពេទ្យ..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-10 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- Hero Banner --- */}
      <section className="bg-gradient-to-b from-sky-50/70 via-white to-slate-50 py-10 lg:py-16 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 bg-sky-100/90 text-sky-800 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-sky-200">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateContentField('heroBadge', e.currentTarget.innerText)}
                >
                  {siteContent.heroBadge}
                </span>
              </div>

              <h2
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => updateContentField('heroTitle', e.currentTarget.innerText)}
                className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight"
              >
                {siteContent.heroTitle}
              </h2>

              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => updateContentField('heroDesc', e.currentTarget.innerText)}
                className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                {siteContent.heroDesc}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href="#products-section"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-sky-200 transition flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <Pill className="w-5 h-5" />
                  <span>មើលផលិតផលទាំងអស់</span>
                </a>

                <a
                  href={`tel:${siteContent.phone.replace(/\s+/g, '')}`}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-sm"
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>{siteContent.phone}</span>
                </a>
              </div>

              {/* Service Badges */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200/80 max-w-xl mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">ដឹកជញ្ជូនរហ័ស</h5>
                    <p className="text-[10px] text-slate-500">24/7 គ្រប់ខេត្តក្រុង</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">ថ្នាំសុទ្ធ ១០០%</h5>
                    <p className="text-[10px] text-slate-500">ស្តង់ដារក្រសួង</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">ប្រឹក្សាឥតគិតថ្លៃ</h5>
                    <p className="text-[10px] text-slate-500">ឱសថការីជំនាញ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                className="image-editable-container relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white max-w-md w-full bg-slate-100"
                onClick={() => openImageEditor('hero', undefined, siteContent.heroImg)}
              >
                <img
                  src={siteContent.heroImg}
                  alt={siteContent.siteTitle}
                  className="w-full h-72 sm:h-96 object-cover hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                {isEditMode && (
                  <div className="absolute top-3 right-3 bg-sky-600 text-white p-2 rounded-xl shadow-lg flex items-center gap-1.5 text-xs font-semibold">
                    <ImageIcon className="w-4 h-4" />
                    <span>ប្តូររូបភាព</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Main Product Catalog Section --- */}
      <main id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {/* Header & Categories Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h3
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => updateContentField('catTitle', e.currentTarget.innerText)}
              className="text-2xl font-bold text-slate-900 flex items-center gap-2.5"
            >
              <Pill className="w-6 h-6 text-sky-600" />
              <span>{siteContent.catTitle}</span>
            </h3>
            <p
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => updateContentField('catSubtitle', e.currentTarget.innerText)}
              className="text-slate-500 text-sm mt-1"
            >
              {siteContent.catSubtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm ${
                currentCategory === 'all'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white hover:bg-sky-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>ទាំងអស់ ({products.length})</span>
            </button>

            <button
              onClick={() => setCurrentCategory('general')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm ${
                currentCategory === 'general'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white hover:bg-sky-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>💊 ថ្នាំពេទ្យព្យាបាលទូទៅ</span>
            </button>

            <button
              onClick={() => setCurrentCategory('serum')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm ${
                currentCategory === 'serum'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white hover:bg-sky-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>💧 សេរ៉ូមទឹក</span>
            </button>

            <button
              onClick={() => setCurrentCategory('equipment')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm ${
                currentCategory === 'equipment'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white hover:bg-sky-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>🩺 សម្ភារៈឧបករណ៍ពេទ្យទូទៅ</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Product Image */}
                  <div
                    className="image-editable-container h-48 bg-slate-100 overflow-hidden relative"
                    onClick={() => openImageEditor('product', p.id, p.image)}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80';
                      }}
                    />

                    {isEditMode && (
                      <div className="absolute top-2 right-2 bg-sky-600 text-white p-1.5 rounded-lg shadow-md flex items-center gap-1 text-[11px] font-semibold">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>ប្តូររូប</span>
                      </div>
                    )}
                  </div>

                  {/* Product Text info */}
                  <div className="p-4 space-y-2">
                    <h4
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        updateProductField(p.id, 'name', e.currentTarget.innerText)
                      }
                      className="font-bold text-slate-900 text-base leading-snug cursor-text"
                    >
                      {p.name}
                    </h4>
                    <p
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        updateProductField(p.id, 'description', e.currentTarget.innerText)
                      }
                      className="text-xs text-slate-500 line-clamp-2 leading-relaxed cursor-text"
                    >
                      {p.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Pricing & Actions */}
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                      {p.category === 'general' && '💊 ថ្នាំទូទៅ'}
                      {p.category === 'serum' && '💧 សេរ៉ូមទឹក'}
                      {p.category === 'equipment' && '🩺 ឧបករណ៍ពេទ្យ'}
                    </span>

                    <div className="text-lg font-black text-slate-900 flex items-center">
                      <span>$</span>
                      <span
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const val = parseFloat(e.currentTarget.innerText);
                          if (!isNaN(val)) updateProductField(p.id, 'price', val);
                        }}
                        className="cursor-text"
                      >
                        {p.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(p)}
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>កុម្ម៉ង់ទិញ</span>
                    </button>

                    {isEditMode && (
                      <button
                        onClick={() => deleteProduct(p.id, p.name)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2.5 rounded-xl transition border border-rose-200"
                        title="លុបថ្នាំនេះ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800">
              រកមិនឃើញផលិតផលដែលលោកអ្នកស្វែងរកទេ
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង ឬជ្រើសរើសប្រភេទផ្សេង
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentCategory('all');
              }}
              className="mt-4 bg-sky-100 hover:bg-sky-200 text-sky-800 px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              បង្ហាញផលិតផលទាំងអស់ឡើងវិញ
            </button>
          </div>
        )}
      </main>

      {/* --- Add Product Modal --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-600" />
                <span>បន្ថែមឱសថ ឬឧបករណ៍ពេទ្យថ្មី</span>
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ឈ្មោះផលិតផល / ថ្នាំ *
                </label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="ឧ. Paracetamol 500mg, Amoxicillin..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ប្រភេទឱសថ *
                  </label>
                  <select
                    value={newProd.category}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        category: e.target.value as ProductCategory
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                  >
                    <option value="general">ថ្នាំព្យាបាលទូទៅ</option>
                    <option value="serum">សេរ៉ូមទឹក</option>
                    <option value="equipment">សម្ភារៈឧបករណ៍ពេទ្យ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    តម្លៃគិតជា ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    placeholder="ឧ. 2.50"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  តំណភ្ជាប់រូបភាព (URL) *
                </label>
                <input
                  type="url"
                  required
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ការបរិយាយ / ផលប្រយោជន៍
                </label>
                <textarea
                  rows={2}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="ពិពណ៌នាពីគុណភាព និងការប្រើប្រាស់..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl text-sm font-semibold transition shadow-md shadow-sky-200"
                >
                  រក្សាទុកផលិតផល
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Image Swapping Modal --- */}
      {imageModalTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-sky-600" />
                <span>ផ្លាស់ប្តូររូបភាព</span>
              </h4>
              <button
                onClick={() => setImageModalTarget(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Image Preview */}
              {previewImage && (
                <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ជម្រើសទី ១: បិទភ្ជាប់ Image URL
                </label>
                <input
                  type="text"
                  value={inputImageUrl}
                  onChange={(e) => {
                    setInputImageUrl(e.target.value);
                    setPreviewImage(e.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-2 text-[10px] text-slate-400 uppercase">
                  ឬ ផ្ទុកឡើងពីទូរស័ព្ទ / កុំព្យូទ័រ
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setImageModalTarget(null)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition"
              >
                បោះបង់
              </button>
              <button
                onClick={applyImageChange}
                disabled={!previewImage}
                className="w-1/2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-semibold transition shadow-sm"
              >
                អនុវត្តការកែប្រែ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Cart Drawer / Modal --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          {/* Drawer Container */}
          <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 bg-sky-600 text-white flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5" />
                <h4 className="font-bold text-base">កន្ត្រកទំនិញរបស់អ្នក</h4>
                <span className="bg-sky-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartTotalQty} មុខ
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 hover:bg-sky-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-4 flex-grow overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <p className="font-semibold text-slate-600">មិនទាន់មានទំនិញក្នុងកន្ត្រកទេ</p>
                  <p className="text-xs text-slate-400 mt-1">សូមជ្រើសរើសឱសថដែលអ្នកត្រូវការខាងក្រោម</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-sky-300 transition"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-white shrink-0 border border-slate-100"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs text-slate-800 line-clamp-1">
                        {item.name}
                      </h5>
                      <p className="text-xs text-sky-600 font-bold mt-0.5">
                        ${item.price.toFixed(2)}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">/ ឯកតា</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-slate-200 shrink-0">
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-rose-600 font-bold text-sm rounded hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-5 text-center text-slate-800">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-sky-600 font-bold text-sm rounded hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeCartItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="លុបមុខទំនិញនេះ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Order Action */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/90 space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>ចំនួនសរុប:</span>
                  <span className="font-medium text-slate-700">{cartTotalQty} មុខ</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                  <span>តម្លៃសរុបទាំងអស់:</span>
                  <div className="text-right">
                    <span className="text-sky-600 text-lg">${cartTotalPrice.toFixed(2)}</span>
                    <p className="text-[11px] font-normal text-slate-400">
                      ~{(cartTotalPrice * 4100).toLocaleString()} រៀល
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={telegramOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition shadow-md shadow-sky-200 ${
                    cart.length === 0 ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>កុម្ម៉ង់តាម Telegram</span>
                </a>

                <a
                  href={`tel:${siteContent.phone.replace(/\s+/g, '')}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition shadow-md shadow-emerald-200"
                >
                  <Phone className="w-4 h-4" />
                  <span>ខលកុម្ម៉ង់ទិញ</span>
                </a>
              </div>

              <p className="text-[10px] text-center text-slate-500">
                ✨ សេវាដឹកជញ្ជូនរហ័សទាន់ចិត្ត ២៤ ម៉ោង ដល់ទីកន្លែងគ្រប់ខេត្តក្រុង
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- Floating Telegram & Phone Quick Assistance --- */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5">
        <a
          href={telegramOrderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition duration-300"
          title="ប្រឹក្សា ឬកុម្ម៉ង់តាម Telegram"
        >
          <Send className="w-5 h-5" />
        </a>

        <a
          href={`tel:${siteContent.phone.replace(/\s+/g, '')}`}
          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition duration-300"
          title="ខលទាក់ទងផ្ទាល់"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            {/* Col 1: Pharmacy Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg">
                  <Pill className="w-5 h-5 rotate-45" />
                </div>
                <h4
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateContentField('footerBrand', e.currentTarget.innerText)}
                  className="text-xl font-bold text-white cursor-text"
                >
                  {siteContent.footerBrand}
                </h4>
              </div>
              <p
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => updateContentField('footerAbout', e.currentTarget.innerText)}
                className="text-xs sm:text-sm text-slate-400 leading-relaxed cursor-text"
              >
                {siteContent.footerAbout}
              </p>
            </div>

            {/* Col 2: Categories */}
            <div className="space-y-2">
              <h5 className="text-white font-bold text-sm mb-3 border-l-4 border-sky-500 pl-2">
                ប្រភេទឱសថ និងផលិតផល
              </h5>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => {
                      setCurrentCategory('general');
                      document.getElementById('products-section')?.scrollIntoView();
                    }}
                    className="hover:text-sky-400 transition"
                  >
                    💊 ថ្នាំពេទ្យព្យាបាលទូទៅ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentCategory('serum');
                      document.getElementById('products-section')?.scrollIntoView();
                    }}
                    className="hover:text-sky-400 transition"
                  >
                    💧 សេរ៉ូមទឹកគ្រប់ប្រភេទ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentCategory('equipment');
                      document.getElementById('products-section')?.scrollIntoView();
                    }}
                    className="hover:text-sky-400 transition"
                  >
                    🩺 សម្ភារៈឧបករណ៍ពេទ្យស្តង់ដារ
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Contact Details */}
            <div className="space-y-3">
              <h5 className="text-white font-bold text-sm mb-3 border-l-4 border-sky-500 pl-2">
                ព័ត៌មានទំនាក់ទំនង
              </h5>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <a
                    href={`tel:${siteContent.phone.replace(/\s+/g, '')}`}
                    className="font-bold text-white hover:text-sky-300 transition"
                  >
                    {siteContent.phone}
                  </a>
                </p>

                <p className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-400 shrink-0" />
                  <a
                    href={telegramOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-300 hover:underline font-semibold"
                  >
                    {siteContent.telegramPhone} (Telegram Order)
                  </a>
                </p>

                <p className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{siteContent.hours}</span>
                </p>

                <p className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateContentField('footerAddress', e.currentTarget.innerText)}
                    className="cursor-text text-slate-400"
                  >
                    {siteContent.footerAddress}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
            <p>
              © {new Date().getFullYear()} {siteContent.siteTitle} ({siteContent.siteSubtitle}). រក្សាសិទ្ធិគ្រប់យ៉ាង។
            </p>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>សុខភាព និងសុវត្ថិភាពលោកអ្នកជាចម្បង</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
