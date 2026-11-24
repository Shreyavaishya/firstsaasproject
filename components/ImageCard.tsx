import React, { useState } from "react"
import Link from "next/link"
import { getCldImageUrl } from "next-cloudinary"
import { Trash2, Sparkles, FileUp } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { filesize } from "filesize"
import { Image as ImageRecord } from "@prisma/client"

dayjs.extend(relativeTime)

interface ImageCardProps {
    image: ImageRecord
    onDelete: (id: string) => Promise<void>
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete }) => {
    const [confirming, setConfirming] = useState(false)
    const [busy, setBusy] = useState(false)

    const thumb = getCldImageUrl({
        src: image.publicId,
        width: 400,
        height: 225,
        crop: "fill",
        gravity: "auto",
        format: "jpg",
        quality: "auto",
    })

    const confirmDelete = async () => {
        setBusy(true)
        try {
            await onDelete(image.id)
        } catch {
            // the parent shows the error message
        } finally {
            setBusy(false)
            setConfirming(false)
        }
    }

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <figure className="aspect-video">
                <img src={thumb} alt={image.title} className="w-full h-full object-cover" />
            </figure>
            <div className="card-body p-4">
                <h2 className="card-title text-lg font-bold break-words">{image.title}</h2>
                <p className="text-sm text-base-content opacity-70">
                    Uploaded {dayjs(image.createdAt).fromNow()}
                </p>
                <div className="flex items-center text-sm mt-1">
                    <FileUp size={18} className="mr-2 text-primary" />
                    <span>
                        {filesize(Number(image.originalSize))} · {image.width}×{image.height}
                    </span>
                </div>

                {confirming ? (
                    <div className="mt-4 rounded-lg border border-error/30 bg-error/10 p-3">
                        <p className="text-sm font-medium">Delete this image? This can&apos;t be undone.</p>
                        <div className="mt-2 flex justify-end gap-2">
                            <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => setConfirming(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-error btn-sm" disabled={busy} onClick={confirmDelete}>
                                {busy ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="btn btn-ghost btn-sm text-error"
                            onClick={() => setConfirming(true)}
                            aria-label="Delete image"
                        >
                            <Trash2 size={16} />
                        </button>
                        <Link href={`/social-share?img=${image.id}`} className="btn btn-primary btn-sm gap-2">
                            <Sparkles size={16} /> Open in Studio
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImageCard
