import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { getCroppedImg } from '../utils/cropImage';

interface ImageCropperModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    onCropComplete: (croppedFile: File) => void;
    aspectRatio?: number;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
    isOpen,
    onClose,
    imageUrl,
    onCropComplete,
    aspectRatio = 1,
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const handleCropComplete = useCallback(
        (_croppedArea: any, croppedAreaPixels: any) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const handleSave = async () => {
        try {
            setIsProcessing(true);
            const croppedFile = await getCroppedImg(imageUrl, croppedAreaPixels, rotation);
            if (croppedFile) {
                onCropComplete(croppedFile);
            }
            onClose();
        } catch (e) {
            console.error(e);
            alert('Failed to crop image');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200]"
                            />
                        </Dialog.Overlay>

                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-[210] w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
                            >
                                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                                    <Dialog.Title className="text-lg font-bold text-slate-800">
                                        Crop & Align Image
                                    </Dialog.Title>
                                    <Dialog.Close asChild>
                                        <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </Dialog.Close>
                                </div>

                                <div className="relative w-full h-[400px] bg-slate-900">
                                    <Cropper
                                        image={imageUrl}
                                        crop={crop}
                                        zoom={zoom}
                                        rotation={rotation}
                                        aspect={aspectRatio}
                                        onCropChange={onCropChange}
                                        onCropComplete={handleCropComplete}
                                        onZoomChange={onZoomChange}
                                        onRotationChange={setRotation}
                                    />
                                </div>

                                <div className="p-6 bg-slate-50 border-t border-slate-100">
                                    <div className="flex flex-col gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <label className="text-sm font-semibold text-slate-500 w-16">Zoom</label>
                                            <input
                                                type="range"
                                                value={zoom}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                aria-labelledby="Zoom"
                                                onChange={(e) => setZoom(Number(e.target.value))}
                                                className="flex-1 w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="text-sm font-semibold text-slate-500 w-16">Rotate</label>
                                            <input
                                                type="range"
                                                value={rotation}
                                                min={0}
                                                max={360}
                                                step={1}
                                                aria-labelledby="Rotation"
                                                onChange={(e) => setRotation(Number(e.target.value))}
                                                className="flex-1 w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <Dialog.Close asChild>
                                            <button type="button" className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                Cancel
                                            </button>
                                        </Dialog.Close>
                                        <button
                                            onClick={handleSave}
                                            disabled={isProcessing}
                                            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isProcessing ? 'Processing...' : <><Check size={16} /> Save Crop</>}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
};
