"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import RenderIfVisible from "react-render-if-visible";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SingleCard } from "@/components/SingleCard";
import { MuseumObjectSearchResult } from "@/museumAPI";

const ESTIMATED_ITEM_HEIGHT = 300;

export default function Home() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQueue] = useDebounce(search, 1000);
  const [artworkIds, setArtworkIds] = useState<number[]>([]);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await axios.post<{ error?: string, success: boolean, data: MuseumObjectSearchResult }>(
          "/api/search",
          { q: searchQueue },
          { signal: controller.signal }
        );
        setArtworkIds(response.data.data.objectIDs);
      } catch (e: unknown) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (searchQueue) {
      fetchArtworks();
    }

    return () => {
      controller.abort();
    };
  }, [searchQueue]);

  useEffect(() => {
    let animationFrameId: number;
    let lastUpdateTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime;

      if (deltaTime > 50) {
        setProgressValue((prevValue) => {
          const increment = Math.random() * 5;
          const newValue = prevValue + increment;
          return newValue > 100 ? 0 : newValue;
        });
        lastUpdateTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 mt-10">
      <header className="max-w-md mx-auto flex py-2 border-b flex-col mb-8">
        <div className="flex items-center">
          <span className="text-lg font-bold">Artworks</span>
        </div>
        <div>
          <Input
            value={search}
            className="mt-2"
            placeholder="Search for an artwork"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="flex flex-col gap-4 justify-center items-center">
        {loading ? (
          <Progress value={progressValue} color="white" />
        ) : (
          artworkIds?.map((id) => (
            <div key={id} className="w-3/6">
              <RenderIfVisible defaultHeight={ESTIMATED_ITEM_HEIGHT} stayRendered>
                <SingleCard artworkId={id} />
              </RenderIfVisible>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
