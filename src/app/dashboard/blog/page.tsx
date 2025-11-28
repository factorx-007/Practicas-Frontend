'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BookOpen, 
  Plus, 
  Filter, 
  ChevronLeft,
  Loader2
} from 'lucide-react';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { socialService } from '@/services/social.service';
import { Post, PostQueryParams } from '@/types/social.types';
import { useAuthStore } from '@/store/authStore';

import BlogCard from '@/components/blog/BlogCard'; 
import BlogFilterModal from '@/components/blog/BlogFilterModal';
import RightSidebar from '@/components/blog/RightSidebar';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PostQueryParams>({
    page: 1,
    limit: 10,
    busqueda: '',
    orderBy: 'createdAt',
    order: 'desc',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);

  const user = useAuthStore(state => state.user);
  const router = useRouter();

  const fetchPosts = useCallback(async (page: number, append = false) => {
    if (!append) {
      setIsLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    console.log('[BLOG_PAGE] 📥 Cargando posts con filtros:', { ...filters, page });
    try {
      const response = await socialService.getPosts({
        ...filters,
        page,
      });

      console.log('[BLOG_PAGE] ✅ Posts recibidos:', response);

      if (response) {
        if (append) {
          setPosts(prev => [...prev, ...response.posts]);
        } else {
          setPosts(response.posts);
        }
        // Removed unused totalPages state
        setHasMore(page < response.pagination.totalPages);
        console.log('[BLOG_PAGE] 📊 Estado actualizado - Total posts:', response.posts.length);
      }
    } catch (error) {
      console.error('[BLOG_PAGE] ❌ Error al cargar posts:', error);
      toast.error('Error al cargar posts');
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, loadingMore, hasMore]);

  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchPosts(currentPage, true);
    }
  }, [currentPage, fetchPosts]);

  const handleDeletePost = async (postId: string) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este post?');
    if (!confirmDelete) return;

    try {
      await socialService.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      toast.success('Post eliminado exitosamente');
    } catch (_error) {
      console.error('Error al eliminar post:', _error);
      toast.error('Error al eliminar post');
    }
  };

  console.log('[BLOG_PAGE] 🎨 Renderizando - isLoading:', isLoading, 'posts.length:', posts.length);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex">
        {/* Contenido principal: ajusta su margen para dejar espacio a la sidebar */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? '' : ''} min-w-0`}>
          <div className="grid grid-cols-1 gap-8">
            {/* Aquí irá el contenido de los posts y los filtros */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Feed Social</h1>
                </div>

                <div className="flex items-center space-x-4">
                  {user && (
                    <button 
                      onClick={() => router.push('/dashboard/blog/create')}
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2" /> Crear Post
                    </button>
                  )}

                  <button 
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Filter className="w-5 h-5 mr-2" /> Filtros
                  </button>

                  {/* Botón flotante para abrir el sidebar (visible solo si la sidebar está cerrada) */}
                  {!isSidebarOpen && (
                    <button 
                      onClick={() => setIsSidebarOpen(true)}
                      className="fixed right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* Aquí se cargarán los posts o el mensaje de no posts */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    No hay posts disponibles
                  </h2>
                  <p className="text-gray-500">
                    {user 
                      ? 'Crea tu primer post haciendo clic en "Crear Post"' 
                      : 'Inicia sesión para ver y crear posts'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {posts.map((post, index) => (
                    <div 
                      ref={index === posts.length - 1 ? lastPostElementRef : null}
                      key={post.id}
                    >
                      <BlogCard 
                        post={post}
                        onEdit={(postId) => {
                          router.push(`/dashboard/blog/edit/${postId}`);
                        }}
                        onDelete={handleDeletePost}
                        onView={(postId) => {
                          router.push(`/dashboard/blog/${postId}`);
                        }}
                      />
                    </div>
                  ))}
                  {loadingMore && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - como hermano del contenido principal */}
        <RightSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      <BlogFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          setFilters({ ...newFilters, page: 1, limit: filters.limit });
          setCurrentPage(1);
          setIsFilterModalOpen(false);
        }}
      />
    </div>
  );
}