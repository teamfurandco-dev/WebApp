import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MDEditor from '@uiw/react-md-editor';

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

                // Fetch blog categories
                const catRes = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/categories`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData.data || []);
                }

                // Fetch authors (admin users)
                const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setAuthors(userData.data || []);

                    // Auto-select current user if new blog
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

            // Set publishedAt if status is published and it's not already set
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
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    {blog ? 'Edit Blog' : 'Add Blog'}
                </h1>
                <button
                    onClick={onCancel}
                    className="text-gray-600 hover:text-gray-900"
                >
                    ← Back to Blogs
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Slug (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="auto-generated-if-empty"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Author *
                            </label>
                            <select
                                required
                                value={formData.authorId}
                                onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Author</option>
                                {authors
                                    .filter(user => user.role?.toLowerCase() === 'admin')
                                    .map(author => (
                                        <option key={author.id} value={author.id}>
                                            Fur&Co
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Excerpt / Summary
                        </label>
                        <textarea
                            rows={2}
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Description
                        </label>
                        <textarea
                            rows={3}
                            value={formData.metaDescription}
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Content Editor */}
                <div className="bg-white p-6 rounded-lg shadow" data-color-mode="light">
                    <h3 className="text-lg font-medium mb-4">Content (Markdown) *</h3>
                    <MDEditor
                        value={formData.content}
                        onChange={(val) => setFormData({ ...formData, content: val || '' })}
                        height={400}
                        preview="edit"
                    />
                </div>

                {/* Cover Image */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Cover Image</h3>

                    <div className="flex items-start space-x-6">
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alt Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.coverAltText}
                                    onChange={(e) => setFormData({ ...formData, coverAltText: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {previewCover && (
                            <div className="w-48 h-32 rounded-lg overflow-hidden border">
                                <img src={previewCover} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Settings & SEO</h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.publishStatus}
                                onChange={(e) => setFormData({ ...formData, publishStatus: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-4 pt-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="mr-2"
                                />
                                Featured
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Homepage Section
                            </label>
                            <input
                                type="text"
                                value={formData.homepageSection}
                                onChange={(e) => setFormData({ ...formData, homepageSection: e.target.value })}
                                placeholder="latest, featured-posts"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                value={formData.metaTitle}
                                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
                    </button>
                </div>
            </form>
        </div >
    );
}
