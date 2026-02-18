import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BlogForm from '../components/BlogForm';
import Loading from '../components/Loading';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    const fetchBlogs = async () => {
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/blogs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBlogs(data.data || []);
            } else {
                setError('Failed to fetch blogs');
            }
        } catch (err) {
            setError('Error loading blogs');
        }
    };

    const deleteBlog = async (blogId) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setBlogs(blogs.filter(b => b.id !== blogId));
            } else {
                setError('Failed to delete blog');
            }
        } catch (err) {
            setError('Error deleting blog');
        }
    };

    const toggleBlogStatus = async (blogId, currentStatus) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${blogId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ publishStatus: newStatus })
            });

            if (response.ok) {
                setBlogs(blogs.map(b =>
                    b.id === blogId ? { ...b, publishStatus: newStatus } : b
                ));
            } else {
                setError('Failed to update blog status');
            }
        } catch (err) {
            setError('Error updating blog status');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchBlogs();
            setLoading(false);
        };
        loadData();
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <Loading text="Loading blogs..." />;
    }

    if (showAddForm || editingBlog) {
        return (
            <BlogForm
                blog={editingBlog}
                onSave={(updatedBlog) => {
                    if (editingBlog) {
                        setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b));
                        setEditingBlog(null);
                    } else {
                        setBlogs([updatedBlog, ...blogs]);
                        setShowAddForm(false);
                    }
                }}
                onCancel={() => {
                    setShowAddForm(false);
                    setEditingBlog(null);
                }}
            />
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
                    <p className="text-gray-500 mt-1">Manage your blog posts</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-5 py-2.5 rounded-xl hover:from-amber-600 hover:to-yellow-600 focus:ring-2 focus:ring-amber-500/50 font-medium shadow-md transition-all"
                >
                    + Add Blog
                </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
                <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
                    {filteredBlogs.length} blogs
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
                                Blog
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Author
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredBlogs.map((blog) => (
                            <tr key={blog.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-16 w-16">
                                            {blog.coverImageUrl ? (
                                                <img
                                                    src={blog.coverImageUrl}
                                                    alt={blog.title}
                                                    className="h-16 w-16 rounded-xl object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-gray-400 text-xs">No Cover</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {blog.title}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {blog.slug}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {blog.author?.name || 'Anonymous'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleBlogStatus(blog.id, blog.publishStatus)}
                                        className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${blog.publishStatus === 'published'
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            }`}
                                    >
                                        {blog.publishStatus === 'published' ? 'Published' : 'Draft'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setEditingBlog(blog)}
                                            className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteBlog(blog.id)}
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

                {filteredBlogs.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-lg mb-2">
                            {searchTerm
                                ? 'No blogs found matching your search.'
                                : 'No blogs found. Add your first blog!'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
