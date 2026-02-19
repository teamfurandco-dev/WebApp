import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MDEditor from '@uiw/react-md-editor';
import { Package, FileText, Plus, Save, ArrowLeft, Settings, Sparkles, Upload, Image, X } from 'lucide-react';
import Loading from '../components/Loading';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error loading products');
    }
  };

  const fetchCategories = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError('Error deleting product');
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setProducts(products.map(p =>
          p.id === productId ? { ...p, isActive: !currentStatus } : p
        ));
      } else {
        setError('Failed to update product status');
      }
    } catch (err) {
      setError('Error updating product status');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(cents / 100);
  };

  if (loading) {
    return <Loading text="Loading products..." />;
  }

  if (showAddForm || editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        categories={categories}
        onSave={(product) => {
          if (editingProduct) {
            setProducts(products.map(p => p.id === product.id ? product : p));
            setEditingProduct(null);
          } else {
            setProducts([product, ...products]);
            setShowAddForm(false);
          }
        }}
        onCancel={() => {
          setShowAddForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-5 py-2.5 rounded-xl hover:from-amber-600 hover:to-yellow-600 focus:ring-2 focus:ring-amber-500/50 font-medium shadow-md transition-all"
        >
          + Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
        />
        <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
          {filteredProducts.length} products
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price Range
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-16 w-16 rounded-xl object-cover shadow-sm"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.variants?.length || 0} variants
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.category?.name || 'No Category'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                  {product.variants?.length > 0 ? (
                    <>
                      {formatCurrency(Math.min(...product.variants.map(v => v.price)))}
                      {product.variants.length > 1 && (
                        <> - {formatCurrency(Math.max(...product.variants.map(v => v.price)))}</>
                      )}
                    </>
                  ) : (
                    'No variants'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleProductStatus(product.id, product.isActive)}
                    className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${product.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-2">
              {searchTerm || categoryFilter !== 'all'
                ? 'No products found matching your filters.'
                : 'No products found. Add your first product!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Product Form Component (Add/Edit)
function ProductForm({ product, categories, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    descriptionSections: product?.descriptionSections || [],
    categoryId: product?.categoryId || '',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured || false,
    homepageSection: product?.homepageSection || '',
    displayOrder: product?.displayOrder || 0,
    tags: product?.tags?.join(', ') || '',
    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || '',
    unlimitedFurEligible: product?.unlimitedFurEligible || false,
    unlimitedFurPetTypes: product?.unlimitedFurPetTypes?.join(', ') || '',
    unlimitedFurMinBudget: product?.unlimitedFurMinBudget || '',
    usageInstructions: product?.usageInstructions || '',
    ingredients: product?.ingredients || '',
    suitableFor: product?.suitableFor || '',
    safetyNotes: product?.safetyNotes || '',
    specifications: product?.specifications || '',
  });

  const [variants, setVariants] = useState(product?.variants?.map(v => ({ ...v, compareAtPrice: v.compareAtPrice || '' })) || [{ name: '', price: '', stock: '', sku: '', compareAtPrice: '' }]);
  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (files) => {
    setUploading(true);
    const uploadedImages = [];

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedImages.push({
          url: publicUrl,
          filePath: filePath,
          altText: formData.name
        });
      } catch (err) {
        setError(`Failed to upload image: ${file.name} - ${err.message}`);
      }
    }

    setImages([...images, ...uploadedImages]);
    setUploading(false);
  };

  const removeImage = async (index) => {
    const image = images[index];
    if (image.filePath) {
      try {
        await supabase.storage
          .from('product-images')
          .remove([image.filePath]);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', price: '', stock: '', sku: '' }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const templates = {
    food: `| Nutrient | Amount |\n|----------|--------|\n| Protein  | 25%    |\n| Fat      | 15%    |\n| Fiber    | 4%     |`,
    toys: `* **Material**: Durable Rubber\n* **Durability**: High\n* **Safety Rating**: 5/5`,
    accessories: `* **Material**: Genuine Leather\n* **Care**: Wipe clean with damp cloth\n* **Warranty**: 1 Year`
  };

  const applyTemplate = (type) => {
    if (confirm('This will overwrite the current specifications. Continue?')) {
      setFormData({ ...formData, specifications: templates[type] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      const productData = {
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : formData.tags,
        unlimitedFurPetTypes: typeof formData.unlimitedFurPetTypes === 'string' ? formData.unlimitedFurPetTypes.split(',').map(t => t.trim()).filter(Boolean) : formData.unlimitedFurPetTypes,
        unlimitedFurMinBudget: formData.unlimitedFurEligible && formData.unlimitedFurMinBudget ? Math.round(parseFloat(formData.unlimitedFurMinBudget) * 100) : null,
        variants: variants
          .filter(v => v.name && v.price)
          .map(v => ({
            ...v,
            price: typeof v.price === 'string' ? parseFloat(v.price) : v.price,
            compareAtPrice: v.compareAtPrice ? (typeof v.compareAtPrice === 'string' ? parseFloat(v.compareAtPrice) : v.compareAtPrice) : null,
            stock: typeof v.stock === 'string' ? parseInt(v.stock) : v.stock
          })),
        images: images
      };

      const url = product
        ? `${import.meta.env.VITE_API_URL}/api/admin/products/${product.id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/products`;

      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save product');
      }
    } catch (err) {
      setError('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          ← Back to Products
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all bg-white"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6" data-color-mode="light">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Description (Markdown)
            </label>
            <MDEditor
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val || '' })}
              height={300}
              preview="edit"
            />
          </div>
        </div>

        {/* Structured Sections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Structured Description Sections</h3>
          </div>
          
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setFormData({
                ...formData,
                descriptionSections: [...formData.descriptionSections, { title: '', content: '' }]
              })}
              className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl hover:bg-amber-100 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Section
            </button>
          </div>

          <div className="space-y-6">
            {formData.descriptionSections.map((section, idx) => (
              <div key={idx} className="p-5 border border-gray-100 rounded-xl bg-gray-50/50 shadow-sm">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <input
                    type="text"
                    placeholder="Section Title (e.g., Features, Ingredients)"
                    value={section.title}
                    onChange={(e) => {
                      const newSections = [...formData.descriptionSections];
                      newSections[idx].title = e.target.value;
                      setFormData({ ...formData, descriptionSections: newSections });
                    }}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSections = formData.descriptionSections.filter((_, i) => i !== idx);
                      setFormData({ ...formData, descriptionSections: newSections });
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <div data-color-mode="light">
                  <MDEditor
                    value={section.content}
                    onChange={(val) => {
                      const newSections = [...formData.descriptionSections];
                      newSections[idx].content = val || '';
                      setFormData({ ...formData, descriptionSections: newSections });
                    }}
                    height={200}
                    preview="edit"
                  />
                </div>
              </div>
            ))}
            {formData.descriptionSections.length === 0 && (
              <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p>No structured sections. Add sections for Features, Highlights, etc.</p>
              </div>
            )}
          </div>
        </div>

        {/* Rich Product Details (Markdown) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Rich Product Details</h3>
          </div>

          <div className="space-y-8">
            <div data-color-mode="light">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Usage Instructions</label>
              <MDEditor
                value={formData.usageInstructions}
                onChange={(val) => setFormData({ ...formData, usageInstructions: val || '' })}
                height={200}
                preview="edit"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-color-mode="light">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredients</label>
                <MDEditor
                  value={formData.ingredients}
                  onChange={(val) => setFormData({ ...formData, ingredients: val || '' })}
                  height={200}
                  preview="edit"
                />
              </div>
              <div data-color-mode="light">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Suitable For</label>
                <MDEditor
                  value={formData.suitableFor}
                  onChange={(val) => setFormData({ ...formData, suitableFor: val || '' })}
                  height={200}
                  preview="edit"
                />
              </div>
            </div>

            <div data-color-mode="light">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Safety Notes</label>
              <MDEditor
                value={formData.safetyNotes}
                onChange={(val) => setFormData({ ...formData, safetyNotes: val || '' })}
                height={150}
                preview="edit"
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">Category Specifications</h4>
                  <p className="text-sm text-gray-500">Add nutritional info, materials, or technical specs here.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-400 self-center uppercase mr-2">Quick Templates:</span>
                  <button type="button" onClick={() => applyTemplate('food')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-colors">Food</button>
                  <button type="button" onClick={() => applyTemplate('toys')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-colors">Toys</button>
                  <button type="button" onClick={() => applyTemplate('accessories')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-colors">Accessories</button>
                </div>
              </div>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.specifications}
                  onChange={(val) => setFormData({ ...formData, specifications: val || '' })}
                  height={250}
                  preview="edit"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settings & Unlimited Fur */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Settings className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Status & Display</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Homepage Section
                </label>
                <input
                  type="text"
                  value={formData.homepageSection}
                  onChange={(e) => setFormData({ ...formData, homepageSection: e.target.value })}
                  placeholder="featured, hot-picks"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Unlimited Fur Integration</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.unlimitedFurEligible}
                  onChange={(e) => setFormData({ ...formData, unlimitedFurEligible: e.target.checked, unlimitedFurMinBudget: e.target.checked ? formData.unlimitedFurMinBudget : '' })}
                  className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">Eligible for Unlimited Fur</span>
              </label>

              {formData.unlimitedFurEligible && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Types (e.g. dog, cat)
                    </label>
                    <input
                      type="text"
                      value={formData.unlimitedFurPetTypes}
                      onChange={(e) => setFormData({ ...formData, unlimitedFurPetTypes: e.target.value })}
                      placeholder="dog, cat"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.unlimitedFurMinBudget}
                      onChange={(e) => setFormData({ ...formData, unlimitedFurMinBudget: e.target.value })}
                      placeholder="500"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Image className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
          </div>
          <div className="mb-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(Array.from(e.target.files))}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            {uploading && <p className="mt-3 text-sm text-amber-600 flex items-center gap-2"><Upload className="w-4 h-4 animate-pulse" /> Uploading images...</p>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <img src={image.url} alt="" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded shadow font-medium">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
          </div>
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl hover:bg-green-100 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </button>
          </div>
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-5 border border-gray-100 rounded-xl bg-gray-50/50">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={variant.name}
                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                    placeholder="Small - 500g"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compare Price (₹)</label>
                  <input
                    type="number"
                    value={variant.compareAtPrice || ''}
                    onChange={(e) => updateVariant(index, 'compareAtPrice', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="w-full py-2.5 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors border border-red-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO & Tags */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Settings className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Metadata & SEO Settings</h3>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="dog food, premium, organic"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50 font-medium shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
}
