export type SignData = {
    signature: string;
    timestamp: number;
    folder: string;
    eager?: string;
    apiKey: string;
    cloudName: string;
    resourceType: "image" | "video";
};

// Uploads a file straight from the browser to Cloudinary, reporting progress (0-100).
export function uploadToCloudinary(
    file: File,
    sign: SignData,
    onProgress: (percent: number) => void
) {
    return new Promise<{ public_id: string; duration?: number }>((resolve, reject) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", sign.apiKey);
        fd.append("timestamp", String(sign.timestamp));
        fd.append("signature", sign.signature);
        fd.append("folder", sign.folder);
        if (sign.eager) fd.append("eager", sign.eager);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/${sign.resourceType}/upload`);
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
            try {
                const body = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) resolve(body);
                else reject(new Error(body?.error?.message || "Upload failed"));
            } catch {
                reject(new Error("Upload failed"));
            }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(fd);
    });
}
