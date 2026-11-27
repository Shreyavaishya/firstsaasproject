import React, { useState } from "react"
import Link from "next/link"
import { getCldImageUrl } from "next-cloudinary"
import { Trash2, Sparkles } from "lucide-react"
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
        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100">
            <figure className="aspect-video bg-base-200">
                <img src={thumb} alt={image.title} className="h-full w-full object-cover" />
            </figure>
            <div className="p-4">
                <h2 className="break-words text-base font-semibold tracking-tight">{image.title}</h2>
                <p className="mt-0.5 text-xs text-base-content/60">
                    Uploaded {dayjs(image.createdAt).fromNow()}
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-base-300 bg-base-300 text-sm">
                    <div className="bg-base-100 px-3 py-2">
                        <dt className="text-xs text-base-content/60">File size</dt>
                        <dd className="font-medium tabular-nums">{filesize(Number(image.originalSize))}</dd>
                    </div>
                    <div className="bg-base-100 px-3 py-2">
                        <dt className="text-xs text-base-content/60">Dimensions</dt>
                        <dd className="font-medium tabular-nums">{image.width}×{image.height}</dd>
                    </div>
                </dl>

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
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            className="btn btn-ghost btn-sm text-error"
                            onClick={() => setConfirming(true)}
                            aria-label="Delete image"
                        >
                            <Trash2 size={16} />
                        </button>
                        <Link href={`/social-share?img=${image.id}`} className="btn btn-neutral btn-sm gap-2">
                            <Sparkles size={16} /> Open in Studio
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImageCard
