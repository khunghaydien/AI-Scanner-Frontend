'use client';
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FilesService } from "@/services/files.service";
import FileDetailHeader from "./file-detail-header";
import FileDetailFooter from "./file-detail-footer";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import AddFile from "./add-image";

export default function FileDetail() {
    const { fileId } = useParams();
    const { data: file } = useQuery({
        queryKey: ['file', fileId],
        queryFn: () => FilesService.getFileById(fileId as string),
    });
    const [currentImage, setCurrentImage] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer || !file?.fileUrls.length) return;

        const handleScroll = () => {
            const containerTop = scrollContainer.scrollTop;
            const containerHeight = scrollContainer.clientHeight;
            const containerCenter = containerTop + containerHeight / 2;

            let newCurrentImage = 0;
            let minDistance = Infinity;

            imageRefs.current.forEach((ref, index) => {
                if (ref) {
                    const rect = ref.getBoundingClientRect();
                    const containerRect = scrollContainer.getBoundingClientRect();
                    const imageTop = rect.top - containerRect.top + scrollContainer.scrollTop;
                    const imageBottom = imageTop + rect.height;
                    const imageCenter = (imageTop + imageBottom) / 2;

                    const distance = Math.abs(containerCenter - imageCenter);
                    if (distance < minDistance) {
                        minDistance = distance;
                        newCurrentImage = index;
                    }
                }
            });

            setCurrentImage(newCurrentImage);
        };

        scrollContainer.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, [file?.fileUrls.length]);

    return (
        <>
            <FileDetailHeader file={file} />
            <div className="fixed top-18 left-6 transform -translate-x-1/2 z-50 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-sm font-bold">
                    {currentImage + 1} / {file?.fileUrls.length || 0}
                </span>
            </div>
            <div
                ref={scrollContainerRef}
                className="h-[calc(100vh-124px)] overflow-y-auto pb-[50%] px-4 flex flex-col gap-4"
            >
                {file?.fileUrls.map((fileUrl, index) => (
                    <div
                        key={fileUrl}
                        ref={(el) => {
                            imageRefs.current[index] = el;
                        }}
                        className="relative w-full flex justify-center min-h-[50vh]"
                    >
                        <Image
                            src={fileUrl}
                            alt={`${file.fileName} - Page ${index + 1}`}
                            width={1200}
                            height={1600}
                            className="w-full h-auto object-contain"
                            sizes="100vw"
                        />
                    </div>
                ))}
                <AddFile />
            </div>
            <FileDetailFooter file={file} />
        </>
    );
}