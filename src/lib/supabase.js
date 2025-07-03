import { supabase } from '../supabaseClient';

// Product-related functions
export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("clothes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("clothes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from("clothes")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const getProductsByType = async (type) => {
  try {
    const { data, error } = await supabase
      .from("clothes")
      .select("*")
      .eq("type", type)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching products by type:", error);
    throw error;
  }
};

export const searchProducts = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from("clothes")
      .select("*")
      .or(`name.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%`)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getProductsWithFilters = async (filters) => {
  try {
    let query = supabase.from("clothes").select("*");

    // Apply filters
    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    if (filters.type) {
      query = query.eq("type", filters.type);
    }
    if (filters.minPrice) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }
    if (filters.brand) {
      query = query.eq("brand", filters.brand);
    }
    if (filters.inStock === true) {
      // Check if any size has quantity > 0
      query = query.not("size_inventory", "eq", "{}");
    }
    if (filters.onSale === true) {
      query = query.eq("is_on_sale", true);
    }
    if (filters.size) {
      // Check if the specified size exists and has quantity > 0
      query = query.contains("size_inventory", { [filters.size]: { quantity: filters.size } });
    }

    // Order by created_at by default
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Additional filtering for size availability if needed
    if (filters.size) {
      return data.filter(product => {
        const sizeData = product.size_inventory[filters.size];
        return sizeData && sizeData.quantity > 0;
      });
    }

    return data;
  } catch (error) {
    console.error("Error fetching products with filters:", error);
    throw error;
  }
};

export const updateProductInventory = async (productId, size, quantity) => {
  try {
    const { data: product, error: fetchError } = await supabase
      .from("clothes")
      .select("size_inventory")
      .eq("id", productId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const updatedSizeInventory = {
      ...product.size_inventory,
      [size]: {
        ...product.size_inventory[size],
        quantity: quantity
      }
    };

    const { error: updateError } = await supabase
      .from("clothes")
      .update({ size_inventory: updatedSizeInventory })
      .eq("id", productId);

    if (updateError) {
      throw updateError;
    }

    return true;
  } catch (error) {
    console.error("Error updating product inventory:", error);
    throw error;
  }
}; 