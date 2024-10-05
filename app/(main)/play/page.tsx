"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";

const PlayPage = () => {
    const imageSrc = useQuery(api.levels.getImageSrc);
    const level = useQuery(api.levels.get);

    return ( 
        <div>
            {imageSrc && (
                <Image src={imageSrc} width="500" height="667" alt="Test" />
            )}
            <h1>Round: 1/5</h1>
            <h1>World Latitude and Longitude: ({level?.latitude}, {level?.longitude})</h1>
            <h1>Image Title: {level?.title}</h1>
        </div>
    );
}
 
export default PlayPage;