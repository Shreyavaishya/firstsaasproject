// All free-plan limits live here, so they can be changed in one place.
// The size limits match Cloudinary's free plan; the rest are Pixora's own.
export const LIMITS = {
    maxImageBytes: 10 * 1024 * 1024, // 10 MB
    maxVideoBytes: 40 * 1024 * 1024, // 40 MB (Cloudinary video transformation limit)
    maxImagePixels: 25_000_000, // 25 megapixels
    exportsPerMonth: 10, // one upload = one export, however many formats it produces
    storageBytes: 300 * 1024 * 1024, // 300 MB per user
}
