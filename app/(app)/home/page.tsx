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

    // 🔹 FIX: Removed the dead anonymous inner function wrapper so click triggers execution
    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-purple-500"></span>
                <p className="ml-3 text-neutral-400">Loading your Pixora...</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white p-8">
            {/* 🔹 Top Header Area */}
            <header className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Pixora
                </h1>
                <div className="flex items-center gap-4">
                    <UserButton />
                </div>
            </header>

            {/* 🔹 Action Bar Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Videos</h2>
                
                {/* 🚀 Integrated Upload Button */}
                <Link 
                    href="/video-upload" 
                    className="bg-linear-to-r from-purple-500 to-blue-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg hover:opacity-90 transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 12 12M12 3v13.5" />
                    </svg>
                    Upload Video
                </Link>
            </div>

            {error && (
                <div className="alert alert-error mb-6 bg-red-950/40 border border-red-800 text-red-200 p-4 rounded-xl">
                    <span>{error}</span>
                </div>
            )}

            {/* 🔹 Videos Display Grid Logic */}
            {videos.length === 0 ? (
                <div className="border border-dashed border-neutral-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-neutral-900/30">
                    <p className="text-neutral-500 text-lg font-medium mb-1">No videos available</p>
                    <p className="text-neutral-600 text-sm">Click the upload button above to add your first media asset.</p>
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
        </main>
    );
}

export default Home;