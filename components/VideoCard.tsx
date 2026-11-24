import React, { useState, useEffect, useCallback } from 'react'
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary"
import { Download, Clock, FileDown, FileUp, MoreVertical, Pencil, Trash2 } from "lucide-react";
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
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <figure className="aspect-video relative">
                {isHovered ? (
                    previewError ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <p className="text-red-500">Preview not available</p>
                        </div>
                    ) : (
                        <video
                            src={getPreviewVideoUrl(video.publicId)}
                            autoPlay
                            muted
                            loop
                            className="w-full h-full object-cover"
                            onError={() => setPreviewError(true)}
                        />
                    )
                ) : (
                    <img
                        src={getThumbnailUrl(video.publicId)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute bottom-2 right-2 bg-base-100 bg-opacity-70 px-2 py-1 rounded-lg text-sm flex items-center">
                    <Clock size={16} className="mr-1" />
                    {formatDuration(video.duration)}
                </div>
            </figure>
            <div className="card-body p-4">
                {mode === "edit" ? (
                    <div className="flex flex-col gap-2">
                        <input
                            className="input input-bordered w-full"
                            value={draftTitle}
                            maxLength={100}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            placeholder="Title"
                        />
                        <textarea
                            className="textarea textarea-bordered w-full"
                            value={draftDesc}
                            maxLength={500}
                            onChange={(e) => setDraftDesc(e.target.value)}
                            placeholder="Description (optional)"
                        />
                        <div className="flex justify-end gap-2">
                            <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => setMode("view")}>
                                Cancel
                            </button>
                            <button className="btn btn-primary btn-sm" disabled={busy || !draftTitle.trim()} onClick={saveEdit}>
                                {busy ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start justify-between gap-2">
                            <h2 className="card-title text-lg font-bold break-words">{video.title}</h2>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-square" aria-label="More options">
                                    <MoreVertical size={16} />
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-40 p-2 shadow">
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
                            <p className="text-sm text-base-content opacity-70">{video.description}</p>
                        )}
                        <p className="text-sm text-base-content opacity-70 mb-2">
                            Uploaded {dayjs(video.createdAt).fromNow()}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                                <FileUp size={18} className="mr-2 text-primary" />
                                <div>
                                    <div className="font-semibold">Original</div>
                                    <div>{formatSize(Number(video.originalSize))}</div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FileDown size={18} className="mr-2 text-secondary" />
                                <div>
                                    <div className="font-semibold">Compressed</div>
                                    <div>{formatSize(Number(video.compressedSize))}</div>
                                </div>
                            </div>
                        </div>
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
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm font-semibold">
                                    Compression:{" "}
                                    <span className="text-accent">{compressionPercentage}%</span>
                                </div>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => onDownload(getFullVideoUrl(video.publicId), video.title)}
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
