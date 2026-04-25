export async function uploadToCloudinary(file: File): Promise<string> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

    // Create timestamp
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Create signature string (parameters ordered alphabetically)
    const signatureStr = `timestamp=${timestamp}${apiSecret}`;

    // Hash it using SubtleCrypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureStr);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || 'Cloudinary upload failed: ' + response.statusText);
    }

    const json = await response.json();
    return json.secure_url;
}

export async function deleteFromCloudinary(url: string): Promise<void> {
    try {
        if (!url || !url.includes('cloudinary.com')) return;

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
        const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

        const parts = url.split('/upload/');
        if (parts.length < 2) return;

        let path = parts[1];
        if (path.match(/^v\d+\//)) {
            path = path.replace(/^v\d+\//, '');
        }
        const publicId = path.substring(0, path.lastIndexOf('.'));
        if (!publicId) return;

        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signatureStr = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

        const encoder = new TextEncoder();
        const data = encoder.encode(signatureStr);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error('Cloudinary delete failed:', response.statusText);
        }
    } catch (err) {
        console.error('Error deleting from Cloudinary:', err);
    }
}
