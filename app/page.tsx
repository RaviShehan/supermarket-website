import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { search, category } = await searchParams;

  // Fetch all categories for filter chips
  const allCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // Query products based on search or category selection
  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category: { slug: category } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { name: 'asc' },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Search & Category Header */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <form method="GET" className="flex gap-2">
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Search bananas, milk, snacks..."
              className="flex-1 border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
            {category && <input type="hidden" name="category" value={category} />}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Search
            </button>
            {(search || category) && (
              <Link
                href="/"
                className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm flex items-center"
              >
                Clear
              </Link>
            )}
          </form>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                !category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Products
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.slug}${search ? `&search=${search}` : ''}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  category === cat.slug
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Display Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <p className="text-gray-500 text-lg">No products found matching your search.</p>
            <Link href="/" className="text-green-600 font-medium hover:underline mt-2 inline-block">
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description || ''}
                price={product.price}
                imageUrl={product.imageUrl || ''}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
