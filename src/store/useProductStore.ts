import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';
import { uploadToCloudinary } from '../utils/cloudinary';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    variants: {
        sizes: string[];
        colors: string[];
    };
    isNew: boolean;
    isTrending: boolean;
    editorNotes?: string;
    stock: number;
}

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (productPayload: Omit<Product, 'id'>, imageFiles?: File[]) => Promise<boolean>;
    updateProduct: (id: string, productPayload: Partial<Product>, imageFiles?: File[]) => Promise<boolean>;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async (forceRefetch = false) => {
        if (!forceRefetch && get().products.length > 0) return; // Prevent unnecessary Egress costs
        
        set({ loading: true, error: null });
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            set({ error: error.message, loading: false });
        } else {
            set({ products: data || [], loading: false });
        }
    },

    addProduct: async (productPayload, imageFiles) => {
        set({ loading: true, error: null });
        
        let finalImages = [...productPayload.images];

        if (imageFiles && imageFiles.length > 0) {
            for (const file of imageFiles) {
                try {
                    const secureUrl = await uploadToCloudinary(file);
                    finalImages.push(secureUrl);
                } catch (uploadError: any) {
                    set({ error: uploadError.message || 'Image upload failed', loading: false });
                    return false;
                }
            }
        }

        const payloadToInsert = {
            ...productPayload,
            images: finalImages
        };

        // Insert row to DB
        const { error } = await supabase
            .from('products')
            .insert([payloadToInsert]);

        if (error) {
            set({ error: error.message, loading: false });
            return false;
        }

        // Refresh global product state bypassing egress cache
        await get().fetchProducts(true);
        return true;
    },

    updateProduct: async (id, productPayload, imageFiles) => {
        set({ loading: true, error: null });
        
        const currentProduct = get().products.find(p => p.id === id);
        let finalImages = currentProduct?.images || [];

        if (imageFiles && imageFiles.length > 0) {
            finalImages = []; // Assuming we replace existing images or we can append. Let's replace for simplicity if they upload new ones.
            for (const file of imageFiles) {
                try {
                    const secureUrl = await uploadToCloudinary(file);
                    finalImages.push(secureUrl);
                } catch (uploadError: any) {
                    set({ error: uploadError.message || 'Image upload failed', loading: false });
                    return false;
                }
            }
        } else if (productPayload.images) {
            // allows manually passing images array over
            finalImages = productPayload.images;
        }

        const payloadToUpdate = {
            ...productPayload,
            images: finalImages
        };

        const { error } = await supabase.from('products').update(payloadToUpdate).eq('id', id);

        if (error) {
            set({ error: error.message, loading: false });
            return false;
        }

        await get().fetchProducts(true);
        return true;
    }
}));
