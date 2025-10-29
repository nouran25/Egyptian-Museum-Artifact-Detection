import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import { Artwork } from "@/museumAPI";
import { Skeleton } from "../ui/skeleton";
import { SingleCardProps } from "./types";
import { Card, CardContent, CardTitle } from "../ui/card";

export const SingleCard: FC<SingleCardProps> = ({
    artworkId
}) => {

    const [loading, setLoading] = useState(true);
    const [artwork, setArtwork] = useState<Artwork | null>(null);

    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                const response = await axios.post<{ error?: string, success: boolean, data: Artwork }>(
                    "/api/get-artwork",
                    { objectId: artworkId }
                );
                setArtwork(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtwork();
    }, [artworkId]);

    if (loading) {
        return <Skeleton className="h-[300px] w-full" />;
    }

    if (!artwork || !artwork.primaryImage) {
        return null;
    }

    return (
        <Card className="mb-6 min-h-[300px] p-4">
            <CardTitle>
                <Link href={`/single/${artwork.objectID}`}>
                    <h2 className="text-lg font-bold mb-4">{artwork.title}</h2>
                </Link>
            </CardTitle>
            <CardContent>
                <div className="flex items-center mb-4">
                    <img src={artwork.primaryImage} alt={artwork.title} />
                </div>
            </CardContent>
        </Card>
    )
}