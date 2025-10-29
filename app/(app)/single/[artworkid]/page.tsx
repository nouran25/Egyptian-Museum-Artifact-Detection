"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'


import { Artwork } from '@/museumAPI'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

export default function Page() {
    const { artworkid } = useParams()
    const [error, setError] = useState<string>();
    const [artwork, setArtwork] = useState<Artwork>();
    const [analysis, setAnalysis] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                setLoading(true);
                const response = await axios.post<{ error?: string, success: boolean, data: Artwork }>(
                    "/api/get-artwork",
                    { objectId: artworkid },
                );
                setArtwork(response.data.data);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError('An unknown error occurred');
                }
                if (axios.isCancel(e)) {
                    console.log('Request canceled:', axios.isCancel(e) ? e.message : 'Unknown reason');
                } else {
                    console.error(e);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchArtwork();
    }, [artworkid]);

    const handleAnalyse = async () => {
        try {
            setAnalysisLoading(true);
            const response = await axios.post<{ error?: string, success: boolean, data: string }>(
                "/api/analyse",
                { artwork },
            );
            setAnalysis(response.data.data);
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setAnalysisLoading(false);
        }
    }

    if (error) {
        return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <Card className="w-full p-4">
                    <CardContent className="flex flex-col md:flex-row gap-8">
                        <Skeleton className="h-[400px] w-full md:w-1/2" />
                        <div className="w-full md:w-1/2 space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>
                    </CardContent>
                </Card>
            ) : artwork ? (
                <Card className="w-full p-4">
                    <div>
                        <Link href="/">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                    </div>
                    <CardContent className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/2">
                            <div className="aspect-square relative">
                                <img
                                    src={artwork.primaryImage || '/placeholder-image.jpg'}
                                    alt={artwork.title}
                                    className="object-contain rounded-lg w-full h-full"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-4">
                            <CardTitle className="text-2xl font-bold">{artwork.title}</CardTitle>
                            <div className="space-y-2">
                                <p><span className="font-semibold">Artist:</span> {artwork.artistDisplayName || 'Unknown'}</p>
                                <p><span className="font-semibold">Date:</span> {artwork.objectDate || 'Unknown'}</p>
                                <p><span className="font-semibold">Medium:</span> {artwork.medium || 'Not specified'}</p>
                                <p><span className="font-semibold">Dimensions:</span> {artwork.dimensions || 'Not specified'}</p>
                                <p><span className="font-semibold">Department:</span> {artwork.department || 'Not specified'}</p>
                                {artwork.culture && <p><span className="font-semibold">Culture:</span> {artwork.culture}</p>}
                                {artwork.period && <p><span className="font-semibold">Period:</span> {artwork.period}</p>}
                                {artwork.classification && <p><span className="font-semibold">Classification:</span> {artwork.classification}</p>}
                                {
                                    artwork.tags && artwork.tags.length > 0 && (
                                        <div className="mt-4">
                                            <span className="font-semibold">Tags:</span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {artwork.tags?.map((tag, index) => (
                                                    <Badge key={index}>{tag.term}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div>
                                {
                                    !analysis && <Button onClick={handleAnalyse}>Analyse</Button>
                                }
                                {
                                    analysisLoading ? (
                                        <Skeleton className="h-4 w-full mt-4" />
                                    ) : analysis && (
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold">Description</h3>
                                            {
                                                analysis && (
                                                    analysis.split('\n').filter((item) => item.trim() !== '').map((item, index) => (
                                                        <p key={index} className={index % 2 === 0 ? 'text-lg' : 'text-sm'}>{item}</p>
                                                    ))
                                                )
                                            }

                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center">No artwork found.</div>
            )}
        </div>
    )
}