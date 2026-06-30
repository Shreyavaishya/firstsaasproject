"use client"
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { UserButton } from "@clerk/nextjs"
import VideoCard from '@/components/VideoCard'
import { Video } from '@/types/index'

function Home() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get("/api/videos")
            if (Array.isArray(response.data)) {
                setVideos(response.data)
            } else {
                throw new Error("Unexpected response format")
            }
        } catch (err) {
            console.error(err)
            setError("Failed to fetch videos")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchVideos()
    }, [fetchVideos])

    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Pixora
                </h1>
                <div className="flex items-center gap-4">
                    <UserButton />
                </div>
            </header>

            {/* 🔹 Action Bar Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Videos</h2>
                
                {/* 🚀 Dynamic DaisyUI Context Button */}
                <Link 
                    href="/video-upload" 
                    className="btn btn-primary shadow-lg shadow-primary/20 flex items-center gap-2 normal-case text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 12 12M12 3v13.5" />
                    </svg>
                    Upload Video
                </Link>
            </div>

            {/* 🔹 Adaptive Alert View */}
            {error && (
                <div className="alert alert-error mb-6 shadow-md border border-error/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            )}

            {/* 🔹 Videos Display Grid Logic */}
            {videos.length === 0 ? (
                <div className="border border-dashed border-base-300 bg-base-200/40 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                    <p className="text-base-content/60 text-lg font-medium mb-1">No videos available</p>
                    <p className="text-base-content/40 text-sm">Click the upload button above to add your first media asset.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;