import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';
import { uploadToCloudinary } from '../utils/cloudinary';

export interface ProductColor {
    hex: string;
    images: string[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    variants: {
        sizes: string[];
        colors: (string | ProductColor)[];
    };
    isNew: boolean;
    isTrending: boolean;
    editorNotes?: string;
    stock: number;
}

export type ColorImageMap = { [hex: string]: File[] };

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: (forceRefetch?: boolean) => Promise<void>;
    addProduct: (productPayload: Omit<Product, 'id'>, imageFiles?: File[], colorImageMap?: ColorImageMap) => Promise<boolean>;
    updateProduct: (id: string, productPayload: Partial<Product>, imageFiles?: File[], colorImageMap?: ColorImageMap) => Promise<boolean>;
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

    addProduct: async (productPayload, imageFiles, colorImageMap) => {
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

        // Handle color-specific images
        if (colorImageMap) {
            for (const hex of Object.keys(colorImageMap)) {
                const uploadedUrls: string[] = [];
                for (const file of colorImageMap[hex]) {
                    try {
                        const secureUrl = await uploadToCloudinary(file);
                        uploadedUrls.push(secureUrl);
                    } catch (uploadError: any) {
                        set({ error: uploadError.message || 'Color image upload failed', loading: false });
                        return false;
                    }
                }
                
                // Assign uploaded URLs to the specific color object
                payloadToInsert.variants.colors = payloadToInsert.variants.colors.map(color => {
                    if (typeof color === 'object' && color.hex === hex) {
                        return { ...color, images: [...(color.images || []), ...uploadedUrls] };
                    }
                    return color;
                });
            }
        }

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

    updateProduct: async (id, productPayload, imageFiles, colorImageMap) => {
        set({ loading: true, error: null });
        
        const currentProduct = get().products.find(p => p.id === id);
        let finalImages = currentProduct?.images || [];

        if (imageFiles && imageFiles.length > 0) {
            finalImages = []; // Assuming we replace existing images
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

        // Handle color-specific images
        if (colorImageMap) {
            for (const hex of Object.keys(colorImageMap)) {
                const uploadedUrls: string[] = [];
                for (const file of colorImageMap[hex]) {
                    try {
                        const secureUrl = await uploadToCloudinary(file);
                        uploadedUrls.push(secureUrl);
                    } catch (uploadError: any) {
                        set({ error: uploadError.message || 'Color image upload failed', loading: false });
                        return false;
                    }
                }
                
                // Assign new uploaded URLs to the specific color object. 
                // We overwrite for simplicity as they represent the new state from the editor
                if (payloadToUpdate.variants?.colors) {
                    payloadToUpdate.variants.colors = payloadToUpdate.variants.colors.map(color => {
                        if (typeof color === 'object' && color.hex === hex) {
                            // If they just added new ones, we append to existing if applicable? Or replace?
                            // Let's replace the images with whatever we uploaded + what was kept (handled in UI)
                            // The UI will pass existing URLs inside the color object. We just append the newly uploaded ones.
                            return { ...color, images: [...(color.images || []), ...uploadedUrls] };
                        }
                        return color;
                    });
                }
            }
        }

        const { error } = await supabase.from('products').update(payloadToUpdate).eq('id', id);

        if (error) {
            set({ error: error.message, loading: false });
            return false;
        }

        await get().fetchProducts(true);
        return true;
    }
}));
