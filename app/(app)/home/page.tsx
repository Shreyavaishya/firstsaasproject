"use client"
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Upload, Image as ImageIcon } from "lucide-react"
import VideoCard from '@/components/VideoCard'
import ImageCard from '@/components/ImageCard'
import UsageMeter from '@/components/UsageMeter'
import { Video } from '@/types/index'
import { Image as ImageRecord } from '@prisma/client'

type Tab = "videos" | "images"

function Home() {
    const [videos, setVideos] = useState<Video[]>([])
    const [images, setImages] = useState<ImageRecord[]>([])
    const [tab, setTab] = useState<Tab>("videos")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [usageKey, setUsageKey] = useState(0)

    const fetchLibrary = useCallback(async () => {
        try {
            const [videoRes, imageRes] = await Promise.all([
                axios.get("/api/videos"),
                axios.get("/api/images"),
            ])
            if (!Array.isArray(videoRes.data) || !Array.isArray(imageRes.data)) {
                throw new Error("Unexpected response format")
            }
            setVideos(videoRes.data)
            setImages(imageRes.data)
        } catch (err) {
            console.error(err)
            setError("Failed to load your library")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchLibrary()
    }, [fetchLibrary])

    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [])

    const handleDeleteVideo = useCallback(async (id: string) => {
        setError(null)
        try {
            await axios.delete(`/api/videos/${id}`)
            setVideos((prev) => prev.filter((v) => v.id !== id))
            setUsageKey((k) => k + 1)
        } catch (err) {
            console.error(err)
            setError("Could not delete the video. Please try again.")
            throw err
        }
    }, [])

    const handleRenameVideo = useCallback(async (id: string, title: string, description: string) => {
        setError(null)
        try {
            const res = await axios.patch(`/api/videos/${id}`, { title, description })
            setVideos((prev) => prev.map((v) => (v.id === id ? res.data : v)))
        } catch (err) {
            console.error(err)
            setError("Could not save your changes. Please try again.")
            throw err
        }
    }, [])

    const handleDeleteImage = useCallback(async (id: string) => {
        setError(null)
        try {
            await axios.delete(`/api/images/${id}`)
            setImages((prev) => prev.filter((i) => i.id !== id))
            setUsageKey((k) => k + 1)
        } catch (err) {
            console.error(err)
            setError("Could not delete the image. Please try again.")
            throw err
        }
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-sm font-medium text-base-content/60">Loading your Pixora workspace...</p>
            </div>
        )
    }

    return (
        <div className="mx-auto min-h-screen max-w-6xl px-6 py-8">

            <header className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
                <p className="mt-0.5 text-sm text-base-content/60">Your videos and images, saved to your account.</p>
            </header>

            <UsageMeter refreshKey={usageKey} />

            {/* Tabs + action */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div role="tablist" className="tabs tabs-box">
                    <button
                        role="tab"
                        className={`tab ${tab === "videos" ? "tab-active" : ""}`}
                        onClick={() => setTab("videos")}
                    >
                        Videos ({videos.length})
                    </button>
                    <button
                        role="tab"
                        className={`tab ${tab === "images" ? "tab-active" : ""}`}
                        onClick={() => setTab("images")}
                    >
                        Images ({images.length})
                    </button>
                </div>

                <Link
                    href={tab === "videos" ? "/video-upload" : "/social-share"}
                    className="btn btn-neutral text-sm"
                >
                    {tab === "videos" ? "Upload Video" : "New Image"}
                </Link>
            </div>

            {error && (
                <div className="alert alert-error mb-6">
                    <span>{error}</span>
                </div>
            )}

            {/* Library grids */}
            {tab === "videos" ? (
                videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100 p-16 text-center">
                        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Upload className="h-5 w-5" />
                        </span>
                        <p className="text-base font-medium">No videos yet</p>
                        <p className="mt-1 text-sm text-base-content/60">Click Upload Video to add your first one.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {videos.map((video) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                onDownload={handleDownload}
                                onDelete={handleDeleteVideo}
                                onRename={handleRenameVideo}
                            />
                        ))}
                    </div>
                )
            ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100 p-16 text-center">
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ImageIcon className="h-5 w-5" />
                    </span>
                    <p className="text-base font-medium">No images yet</p>
                    <p className="mt-1 text-sm text-base-content/60">Upload one in Social Studio and it will be saved here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((image) => (
                        <ImageCard key={image.id} image={image} onDelete={handleDeleteImage} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
