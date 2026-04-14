import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {product.image && (
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {}
        {product.category && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mb-2">
            {product.category}
          </span>
        )}

        {}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
            <span className="text-xs text-gray-600">({product.reviews || 0})</span>
          </div>
        )}

        {}
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>

        {}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-indigo-600">
              ₹{product.price}
            </span>
            {product.stock && (
              <p className="text-xs text-gray-600">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            )}
          </div>
          <button
            disabled={product.stock === 0}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
