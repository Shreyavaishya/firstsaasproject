"use client"
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { UserButton } from "@clerk/nextjs"
import VideoCard from '@/components/VideoCard'
import ImageCard from '@/components/ImageCard'
import { Video } from '@/types/index'
import { Image as ImageRecord } from '@prisma/client'

type Tab = "videos" | "images"

function Home() {
    const [videos, setVideos] = useState<Video[]>([])
    const [images, setImages] = useState<ImageRecord[]>([])
    const [tab, setTab] = useState<Tab>("videos")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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
        } catch (err) {
            console.error(err)
            setError("Could not delete the image. Please try again.")
            throw err
        }
    }, [])

    // 🔹 Adaptive Theme Spinner Loader
    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-3">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-sm opacity-60 font-medium">Loading your Pixora workspace...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-base-100 text-base-content p-8 transition-colors duration-200">

            {/* 🔹 Top Header Area */}
            <header className="flex justify-between items-center border-b border-base-300 pb-4 mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Pixora
                </h1>
                <div className="flex items-center gap-4">
                    <UserButton />
                </div>
            </header>

            {/* 🔹 Tabs + action */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
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
                    className="btn btn-primary shadow-lg shadow-primary/20 flex items-center gap-2 normal-case text-sm"
                >
                    {tab === "videos" ? "Upload Video" : "New Image"}
                </Link>
            </div>

            {/* 🔹 Adaptive Alert View */}
            {error && (
                <div className="alert alert-error mb-6 shadow-md border border-error/20">
                    <span>{error}</span>
                </div>
            )}

            {/* 🔹 Library grids */}
            {tab === "videos" ? (
                videos.length === 0 ? (
                    <div className="border border-dashed border-base-300 bg-base-200/40 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                        <p className="text-base-content/60 text-lg font-medium mb-1">No videos yet</p>
                        <p className="text-base-content/40 text-sm">Click Upload Video to add your first one.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="border border-dashed border-base-300 bg-base-200/40 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                    <p className="text-base-content/60 text-lg font-medium mb-1">No images yet</p>
                    <p className="text-base-content/40 text-sm">Upload one in Social Studio and it will be saved here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image) => (
                        <ImageCard key={image.id} image={image} onDelete={handleDeleteImage} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
