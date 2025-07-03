import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clothes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match the expected format
        const transformedProducts = data.map((product) => ({
          id: product.id,
          title: product.name,
          price: parseFloat(product.price),
          imageSrc: product.images[0], // Use first image as main image
          type: product.item_type,
          category: product.category,
          details: product.description,
          discount: product.discount_percentage,
          is_on_sale: product.is_on_sale,
          is_new: product.is_new,
          is_bestseller: product.is_bestseller,
          brand: product.brand,
          colors: product.colors,
          materials: product.materials,
          sizes_available: product.sizes_available,
          stock_by_size: product.stock_by_size,
          original_price: parseFloat(product.original_price),
          created_at: product.created_at,
          updated_at: product.updated_at,
        }));

        setProducts(transformedProducts);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, fetchProducts };
}

// Hook for getting sale items (products with discount > 0)
export const useSaleProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  const fetchSaleProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clothes")
        .select("*")
        .eq('is_on_sale', true)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const transformedProducts = data.map((product) => ({
          id: product.id,
          title: product.name,
          price: parseFloat(product.price),
          imageSrc: product.images[0],
          type: product.item_type,
          category: product.category,
          details: product.description,
          discount: product.discount_percentage,
          is_on_sale: product.is_on_sale,
          is_new: product.is_new,
          is_bestseller: product.is_bestseller,
          brand: product.brand,
          colors: product.colors,
          materials: product.materials,
          sizes_available: product.sizes_available,
          stock_by_size: product.stock_by_size,
          original_price: parseFloat(product.original_price),
          created_at: product.created_at,
          updated_at: product.updated_at,
        }));

        setProducts(transformedProducts);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error };
};

// Hook for getting bestseller products
export const useBestsellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBestsellerProducts();
  }, []);

  const fetchBestsellerProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clothes")
        .select("*")
        .eq('is_bestseller', true)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const transformedProducts = data.map((product) => ({
          id: product.id,
          title: product.name,
          price: parseFloat(product.price),
          imageSrc: product.images[0],
          type: product.item_type,
          category: product.category,
          details: product.description,
          discount: product.discount_percentage,
          is_on_sale: product.is_on_sale,
          is_new: product.is_new,
          is_bestseller: product.is_bestseller,
          brand: product.brand,
          colors: product.colors,
          materials: product.materials,
          sizes_available: product.sizes_available,
          stock_by_size: product.stock_by_size,
          original_price: parseFloat(product.original_price),
          created_at: product.created_at,
          updated_at: product.updated_at,
        }));

        setProducts(transformedProducts);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error };
};

// Hook for getting new products
export const useNewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewProducts();
  }, []);

  const fetchNewProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clothes")
        .select("*")
        .eq('is_new', true)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const transformedProducts = data.map((product) => ({
          id: product.id,
          title: product.name,
          price: parseFloat(product.price),
          imageSrc: product.images[0],
          type: product.item_type,
          category: product.category,
          details: product.description,
          discount: product.discount_percentage,
          is_on_sale: product.is_on_sale,
          is_new: product.is_new,
          is_bestseller: product.is_bestseller,
          brand: product.brand,
          colors: product.colors,
          materials: product.materials,
          sizes_available: product.sizes_available,
          stock_by_size: product.stock_by_size,
          original_price: parseFloat(product.original_price),
          created_at: product.created_at,
          updated_at: product.updated_at,
        }));

        setProducts(transformedProducts);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error };
}; 