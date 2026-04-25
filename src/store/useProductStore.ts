import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

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
        types?: { name: string; price: number; images?: string[]; colors?: ProductColor[] }[];
    };
    isNew: boolean;
    isTrending: boolean;
    editorNotes?: string;
    stock: number;
}

export type ColorImageMap = { [hex: string]: File[] };
export type TypeImageMap = { [name: string]: File[] };
export type TypeColorImageMap = { [typeName: string]: { [hex: string]: File[] } };

export function getAllProductImages(product: Product): string[] {
    const urls: string[] = [];
    if (product.images) urls.push(...product.images);
    if (product.variants?.colors) {
        product.variants.colors.forEach(c => {
            if (typeof c !== 'string' && c.images) urls.push(...c.images);
        });
    }
    if (product.variants?.types) {
        product.variants.types.forEach(t => {
            if (t.images) urls.push(...t.images);
            if (t.colors) {
                t.colors.forEach(tc => {
                    if (tc.images) urls.push(...tc.images);
                });
            }
        });
    }
    return urls;
}

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: (forceRefetch?: boolean) => Promise<void>;
    addProduct: (productPayload: Omit<Product, 'id'>, imageFiles?: File[], colorImageMap?: ColorImageMap, typeImageMap?: TypeImageMap, typeColorImageMap?: TypeColorImageMap) => Promise<boolean>;
    updateProduct: (id: string, productPayload: Partial<Product>, imageFiles?: File[], colorImageMap?: ColorImageMap, typeImageMap?: TypeImageMap, typeColorImageMap?: TypeColorImageMap) => Promise<boolean>;
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

    addProduct: async (productPayload, imageFiles, colorImageMap, typeImageMap, typeColorImageMap) => {
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

        // Handle type-specific images
        if (typeImageMap && payloadToInsert.variants.types) {
            for (const name of Object.keys(typeImageMap)) {
                const uploadedUrls: string[] = [];
                for (const file of typeImageMap[name]) {
                    try {
                        const secureUrl = await uploadToCloudinary(file);
                        uploadedUrls.push(secureUrl);
                    } catch (uploadError: any) {
                        set({ error: uploadError.message || 'Type image upload failed', loading: false });
                        return false;
                    }
                }

                payloadToInsert.variants.types = payloadToInsert.variants.types.map(t => {
                    if (t.name === name) {
                        return { ...t, images: [...(t.images || []), ...uploadedUrls] };
                    }
                    return t;
                });
            }
        }

        // Handle type-specific colors images
        if (typeColorImageMap && payloadToInsert.variants.types) {
            for (const typeName of Object.keys(typeColorImageMap)) {
                for (const hex of Object.keys(typeColorImageMap[typeName])) {
                    const uploadedUrls: string[] = [];
                    for (const file of typeColorImageMap[typeName][hex]) {
                        try {
                            const secureUrl = await uploadToCloudinary(file);
                            uploadedUrls.push(secureUrl);
                        } catch (uploadError: any) {
                            set({ error: uploadError.message || 'Type-Color image upload failed', loading: false });
                            return false;
                        }
                    }

                    payloadToInsert.variants.types = payloadToInsert.variants.types.map(t => {
                        if (t.name === typeName) {
                            const currentColors = t.colors || [];
                            const existingColorIdx = currentColors.findIndex(c => c.hex === hex);

                            let newColors = [...currentColors];
                            if (existingColorIdx >= 0) {
                                newColors[existingColorIdx] = {
                                    ...newColors[existingColorIdx],
                                    images: [...(newColors[existingColorIdx].images || []), ...uploadedUrls]
                                };
                            } else {
                                newColors.push({ hex, images: uploadedUrls });
                            }
                            return { ...t, colors: newColors };
                        }
                        return t;
                    });
                }
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

    updateProduct: async (id, productPayload, imageFiles, colorImageMap, typeImageMap, typeColorImageMap) => {
        set({ loading: true, error: null });

        const currentProduct = get().products.find(p => p.id === id);
        let finalImages = productPayload.images ? [...productPayload.images] : (currentProduct?.images || []);

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

        // Handle type-specific images
        if (typeImageMap && payloadToUpdate.variants?.types) {
            for (const name of Object.keys(typeImageMap)) {
                const uploadedUrls: string[] = [];
                for (const file of typeImageMap[name]) {
                    try {
                        const secureUrl = await uploadToCloudinary(file);
                        uploadedUrls.push(secureUrl);
                    } catch (uploadError: any) {
                        set({ error: uploadError.message || 'Type image upload failed', loading: false });
                        return false;
                    }
                }

                payloadToUpdate.variants.types = payloadToUpdate.variants.types.map(t => {
                    if (t.name === name) {
                        return { ...t, images: [...(t.images || []), ...uploadedUrls] };
                    }
                    return t;
                });
            }
        }

        // Handle type-specific colors images
        if (typeColorImageMap && payloadToUpdate.variants?.types) {
            for (const typeName of Object.keys(typeColorImageMap)) {
                for (const hex of Object.keys(typeColorImageMap[typeName])) {
                    const uploadedUrls: string[] = [];
                    for (const file of typeColorImageMap[typeName][hex]) {
                        try {
                            const secureUrl = await uploadToCloudinary(file);
                            uploadedUrls.push(secureUrl);
                        } catch (uploadError: any) {
                            set({ error: uploadError.message || 'Type-Color image upload failed', loading: false });
                            return false;
                        }
                    }

                    payloadToUpdate.variants.types = payloadToUpdate.variants.types.map(t => {
                        if (t.name === typeName) {
                            const currentColors = t.colors || [];
                            const existingColorIdx = currentColors.findIndex(c => c.hex === hex);

                            let newColors = [...currentColors];
                            if (existingColorIdx >= 0) {
                                newColors[existingColorIdx] = {
                                    ...newColors[existingColorIdx],
                                    images: [...(newColors[existingColorIdx].images || []), ...uploadedUrls]
                                };
                            } else {
                                newColors.push({ hex, images: uploadedUrls });
                            }
                            return { ...t, colors: newColors };
                        }
                        return t;
                    });
                }
            }
        }

        const { error } = await supabase.from('products').update(payloadToUpdate).eq('id', id);

        if (error) {
            set({ error: error.message, loading: false });
            return false;
        }

        if (currentProduct) {
            const oldUrls = getAllProductImages(currentProduct);
            const newUrls = getAllProductImages(payloadToUpdate as Product);
            const orphanedUrls = oldUrls.filter(url => !newUrls.includes(url));
            orphanedUrls.forEach(url => deleteFromCloudinary(url));
        }

        await get().fetchProducts(true);
        return true;
    }
}));
