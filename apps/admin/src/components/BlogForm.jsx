import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Upload, Image, FileText, Settings, X, Plus, Save } from 'lucide-react';

export default function BlogForm({ blog, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: blog?.title || '',
        slug: blog?.slug || '',
        excerpt: blog?.excerpt || '',
        content: blog?.content || '',
        coverBucketName: blog?.coverBucketName || 'blogs-images',
        coverFilePath: blog?.coverFilePath || '',
        coverAltText: blog?.coverAltText || '',
        publishStatus: blog?.publishStatus || 'draft',
        isFeatured: blog?.isFeatured || false,
        homepageSection: blog?.homepageSection || '',
        metaTitle: blog?.metaTitle || '',
        metaDescription: blog?.metaDescription || '',
        tags: blog?.tags?.join(', ') || '',
        categoryId: blog?.categoryId || '',
        authorId: blog?.authorId || '',
        displayOrder: blog?.displayOrder || 0,
    });

    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [previewCover, setPreviewCover] = useState(blog?.coverImageUrl || '');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = (await supabase.auth.getSession()).data.session?.access_token;

                const catRes = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/categories`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData.data || []);
                }

                const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setAuthors(userData.data || []);

                    if (!blog && !formData.authorId) {
                        const { data: { user } } = await supabase.auth.getUser();
                        const currentAdmin = userData.data?.find(u => u.supabaseId === user.id);
                        if (currentAdmin) {
                            setFormData(prev => ({ ...prev, authorId: currentAdmin.id }));
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching form data:', err);
            }
        };
        fetchData();
    }, []);

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = fileName;

            const { data, error } = await supabase.storage
                .from('blogs-images')
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('blogs-images')
                .getPublicUrl(filePath);

            setFormData({
                ...formData,
                coverFilePath: filePath,
                coverBucketName: 'blogs-images'
            });
            setPreviewCover(publicUrl);
        } catch (err) {
            setError(`Failed to upload cover image: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        if (!formData.content) {
            setError('Content is required');
            setSaving(false);
            return;
        }

        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;

            const blogData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                categoryId: formData.categoryId || undefined,
                authorId: formData.authorId || undefined,
                homepageSection: formData.homepageSection || undefined,
                metaTitle: formData.metaTitle || undefined,
                metaDescription: formData.metaDescription || undefined,
                excerpt: formData.excerpt || undefined,
            };

            if (formData.publishStatus === 'published' && !blog?.publishedAt) {
                blogData.publishedAt = new Date().toISOString();
            }

            const url = blog
                ? `${import.meta.env.VITE_API_URL}/api/blogs/${blog.id}`
                : `${import.meta.env.VITE_API_URL}/api/blogs`;

            const method = blog ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(blogData)
            });

            if (response.ok) {
                const data = await response.json();
                onSave(data.data);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to save blog');
            }
        } catch (err) {
            setError('Error saving blog');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {blog ? 'Edit Blog' : 'Add New Blog'}
                    </h1>
                    <p className="text-gray-500 mt-1">Create and publish your blog posts</p>
                </div>
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blogs
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}><X className="w-5 h-5" /></button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <FileText className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter blog title"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="auto-generated-if-empty"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all bg-white"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt / Summary
                            </label>
                            <textarea
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="Brief summary of the blog post..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-color-mode="light">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <FileText className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Content <span className="text-red-500">*</span></h3>
                    </div>
                    <MDEditor
                        value={formData.content}
                        onChange={(val) => setFormData({ ...formData, content: val || '' })}
                        height={400}
                        preview="edit"
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Image className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Cover Image</h3>
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="flex-1 w-full">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-amber-300 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverUpload}
                                    className="hidden"
                                    id="cover-upload"
                                />
                                <label htmlFor="cover-upload" className="cursor-pointer">
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                        <p className="text-sm font-medium text-gray-600">Click to upload cover image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </label>
                            </div>
                            {uploading && (
                                <p className="text-sm text-amber-600 mt-3 flex items-center gap-2">
                                    <Upload className="w-4 h-4 animate-pulse" /> Uploading...
                                </p>
                            )}

                            <div className="mt-5">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alt Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.coverAltText}
                                    onChange={(e) => setFormData({ ...formData, coverAltText: e.target.value })}
                                    placeholder="Describe the image for accessibility"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                />
                            </div>
                        </div>

                        {previewCover && (
                            <div className="w-full md:w-64">
                                <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200">
                                    <img src={previewCover} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setPreviewCover(''); setFormData({ ...formData, coverFilePath: '' }); }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Settings className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Settings & SEO</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.publishStatus}
                                onChange={(e) => setFormData({ ...formData, publishStatus: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all bg-white"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

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
                                placeholder="latest, featured-posts"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="tag1, tag2, tag3"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                placeholder="SEO title (defaults to blog title if empty)"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description
                            </label>
                            <textarea
                                rows={2}
                                value={formData.metaDescription}
                                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                placeholder="SEO description (defaults to excerpt if empty)"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
                            </label>
                        </div>
                    </div>
                </div>

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
                        {saving ? 'Saving...' : (blog ? 'Update Blog' : 'Publish Blog')}
                    </button>
                </div>
            </form>
        </div>
    );
}
