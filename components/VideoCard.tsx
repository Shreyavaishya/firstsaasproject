import React, { useState, useEffect, useCallback } from 'react'
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary"
import { Download, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import dayjs from 'dayjs';
import realtiveTime from "dayjs/plugin/relativeTime"
import { filesize } from "filesize"
import { Video } from '@prisma/client';

dayjs.extend(realtiveTime)

interface VideoCardProps {
    video: Video;
    onDownload: (url: string, title: string) => void;
    onDelete: (id: string) => Promise<void>;
    onRename: (id: string, title: string, description: string) => Promise<void>;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload, onDelete, onRename }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [previewError, setPreviewError] = useState(false)
    const [mode, setMode] = useState<"view" | "edit" | "confirmDelete">("view")
    const [draftTitle, setDraftTitle] = useState("")
    const [draftDesc, setDraftDesc] = useState("")
    const [busy, setBusy] = useState(false)

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        })
    }, [])

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080,
        })
    }, [])

    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
            rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
        })
    }, [])

    const formatSize = useCallback((size: number) => {
        return filesize(size)
    }, [])

    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    const compressionPercentage = Math.round(
        (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
    );

    useEffect(() => {
        setPreviewError(false);
    }, [isHovered]);

    const closeMenu = () => (document.activeElement as HTMLElement | null)?.blur()

    const startEdit = () => {
        setDraftTitle(video.title)
        setDraftDesc(video.description ?? "")
        setMode("edit")
        closeMenu()
    }

    const saveEdit = async () => {
        if (!draftTitle.trim()) return
        setBusy(true)
        try {
            await onRename(video.id, draftTitle, draftDesc)
            setMode("view")
        } catch {
            // the parent shows the error message; stay in edit mode so nothing is lost
        } finally {
            setBusy(false)
        }
    }

    const confirmDelete = async () => {
        setBusy(true)
        try {
            await onDelete(video.id)
        } catch {
            // the parent shows the error message
        } finally {
            setBusy(false)
            setMode("view")
        }
    }

    return (
        <div
            className="overflow-hidden rounded-2xl border border-base-300 bg-base-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <figure className="relative aspect-video bg-base-200">
                {isHovered ? (
                    previewError ? (
                        <div className="flex h-full w-full items-center justify-center bg-base-200">
                            <p className="text-sm text-base-content/60">Preview not available</p>
                        </div>
                    ) : (
                        <video
                            src={getPreviewVideoUrl(video.publicId)}
                            autoPlay
                            muted
                            loop
                            className="h-full w-full object-cover"
                            onError={() => setPreviewError(true)}
                        />
                    )
                ) : (
                    <img
                        src={getThumbnailUrl(video.publicId)}
                        alt={video.title}
                        className="h-full w-full object-cover"
                    />
                )}
                <div className="absolute bottom-2 right-2 flex items-center rounded-md bg-base-100/85 px-2 py-1 text-xs font-medium tabular-nums backdrop-blur-sm">
                    <Clock size={14} className="mr-1" />
                    {formatDuration(video.duration)}
                </div>
            </figure>
            <div className="p-4">
                {mode === "edit" ? (
                    <div className="flex flex-col gap-2">
                        <input
                            className="input w-full"
                            value={draftTitle}
                            maxLength={100}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            placeholder="Title"
                        />
                        <textarea
                            className="textarea w-full"
                            value={draftDesc}
                            maxLength={500}
                            onChange={(e) => setDraftDesc(e.target.value)}
                            placeholder="Description (optional)"
                        />
                        <div className="flex justify-end gap-2">
                            <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => setMode("view")}>
                                Cancel
                            </button>
                            <button className="btn btn-neutral btn-sm" disabled={busy || !draftTitle.trim()} onClick={saveEdit}>
                                {busy ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start justify-between gap-2">
                            <h2 className="break-words text-base font-semibold tracking-tight">{video.title}</h2>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-square" aria-label="More options">
                                    <MoreVertical size={16} />
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu z-10 w-40 rounded-box border border-base-300 bg-base-100 p-2">
                                    <li>
                                        <button onClick={startEdit}><Pencil size={14} /> Rename</button>
                                    </li>
                                    <li>
                                        <button
                                            className="text-error"
                                            onClick={() => { setMode("confirmDelete"); closeMenu() }}
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {video.description && (
                            <p className="mt-1 text-sm text-base-content/70">{video.description}</p>
                        )}
                        <p className="mt-0.5 text-xs text-base-content/60">
                            Uploaded {dayjs(video.createdAt).fromNow()}
                        </p>

                        {/* Before and after, side by side, with the saving as a status pill */}
                        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-base-300 bg-base-300 text-sm">
                            <div className="bg-base-100 px-3 py-2">
                                <dt className="text-xs text-base-content/60">Original</dt>
                                <dd className="font-medium tabular-nums">{formatSize(Number(video.originalSize))}</dd>
                            </div>
                            <div className="bg-base-100 px-3 py-2">
                                <dt className="text-xs text-base-content/60">Compressed</dt>
                                <dd className="flex items-center gap-2 font-medium tabular-nums">
                                    {formatSize(Number(video.compressedSize))}
                                    <span className="rounded-md bg-success/15 px-1.5 py-0.5 text-xs font-medium text-success">
                                        {compressionPercentage}%
                                    </span>
                                </dd>
                            </div>
                        </dl>

                        {mode === "confirmDelete" ? (
                            <div className="mt-4 rounded-lg border border-error/30 bg-error/10 p-3">
                                <p className="text-sm font-medium">Delete this video? This can&apos;t be undone.</p>
                                <div className="mt-2 flex justify-end gap-2">
                                    <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => setMode("view")}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-error btn-sm" disabled={busy} onClick={confirmDelete}>
                                        {busy ? "Deleting…" : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 flex items-center justify-end">
                                <button
                                    className="btn btn-neutral btn-sm"
                                    onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
                                    aria-label="Download video"
                                >
                                    <Download size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default VideoCard
