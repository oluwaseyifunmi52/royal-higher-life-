import { useState, useEffect, useRef, useCallback } from "react";
import { getPublicGallery } from "../services/publicContentService";

const asset = (path) => new URL(`../assets/${path}`, import.meta.url).href;

// These are the ministry photos already bundled with the site. Use them when
// the public API has not been populated yet, as well as when it is unavailable.
const getBundledGalleryImages = () => [
    { _id: "local-1", title: "Worship Session", image: asset("royal12.jpeg"), category: "Worship" },
    { _id: "local-2", title: "Evangelism Outreach", image: asset("royal11.jpeg"), category: "Outreach" },
    { _id: "local-3", title: "Alagbede Village Service ", image: asset("royal10.jpeg"), category: "Events" },
    { _id: "local-4", title: "Alasise Village Evangelism ", image: asset("royal8.jpeg"), category: "Community" },
    { _id: "local-5", title: "Irolu Town Crusade Ijebu Remo", image: asset("royal7.jpeg"), category: "Outreach" },
    { _id: "local-6", title: "Evangelism Outreach", image: asset("royal5.jpeg"), category: "Outreach" },
    { _id: "local-7", title: "Asaaba Rep.Of Bennin Village Group", image: asset("royal4.jpeg"), category: "Community" },
    { _id: "local-8", title: "Jago Village Evangelism ", image: asset("royal3.jpeg"), category: "Outreach" },
    { _id: "local-9", title: "Another Group Service Jago ", image: asset("royal2.jpeg"), category: "Events" },
    { _id: "local-10", title: "Agoua Service Rep.Bennin  ", image: asset("rolay1.jpeg"), category: "Outreach" },
    { _id: "local-11", title: "Ogere Town Semina ijebu ", image: asset("oba.jpeg"), category: "Community" },
    { _id: "local-12", title: "To Gubi Town Togo", image: asset("new1.jpeg"), category: "Events" },
    { _id: "local-13", title: "New Outreach", image: asset("new2.jpeg"), category: "Outreach" },
    { _id: "local-14", title: "Going to Interior Villages Benin.Rep", image: asset("new3.jpeg"), category: "Events" },
    { _id: "local-15", title: "Preaching At Kaboli Church Togo", image: asset("new4.jpeg"), category: "Testimonies" },
    { _id: "local-16", title: "Worshipping Center Save Town Rep. Of Benin", image: asset("new5.jpeg"), category: "Worship" },
    { _id: "local-17", title: "Royal Higherlife Evangelical Team ", image: asset("new6.jpeg"), category: "Prayer" },
    { _id: "local-18", title: "Royal Higherlife Mission School", image: asset("school 5.jpeg"), category: "School" },
    { _id: "local-19", title: " ", image: asset("school 4.jpeg"), category: "School" },
    {_id:  "local-20", title: "Agodi Correctional service Oyo state Nigeria", image: asset("royal1.jpeg"),category:"Correctional Home" },
    {_id:  "local-21", title: "Agoue Benin.Rep", image: asset("royal3 (1).jpeg"),category:"Correctional Home" },
    {_id:  "local-22", title: "Some Member At Agoua", image: asset("RoyalLove.jpeg"),category:"Royal Workers" },
]

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [categories, setCategories] = useState([]);
    const [touchStartX, setTouchStartX] = useState(null);
    const lightboxImgRef = useRef(null);
    const previousActiveElement = useRef(null);

    // Fetch gallery images from API
    const fetchImages = async () => {
        try {
            const res = await getPublicGallery();
            const data = Array.isArray(res?.data?.data) ? res.data.data : [];
            const imageData = data.filter((item) => !item.mediaType || item.mediaType === "image");
            const displayedImages = imageData.length > 0 ? imageData : getBundledGalleryImages();
            setImages(displayedImages);
            
            // Extract unique categories
            const uniqueCategories = [...new Set(displayedImages.map(img => img.category).filter(Boolean))];
            setCategories(uniqueCategories);
        } catch (err) {
            console.error("Failed to fetch gallery images:", err);
            const bundledImages = getBundledGalleryImages();
            setImages(bundledImages);
            setCategories([...new Set(bundledImages.map((image) => image.category))]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // Filter images by category - single declaration
    const filteredImages = activeCategory === "all" 
        ? images 
        : images.filter(img => img.category === activeCategory);

    // Lightbox navigation
    const openLightbox = useCallback((index) => {
        previousActiveElement.current = document.activeElement;
        setLightboxIndex(index);
        setLightboxOpen(true);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
        if (previousActiveElement.current) {
            previousActiveElement.current.focus();
        }
    }, []);

    const navigateLightboxDirection = useCallback((direction) => {
        setLightboxIndex(prev => {
            const newIndex = prev + direction;
            if (newIndex < 0) return filteredImages.length - 1;
            if (newIndex >= filteredImages.length) return 0;
            return newIndex;
        });
    }, [filteredImages.length]);

    // Zoom controls removed: every photo opens fitted to the screen.

    const handleKeyDown = useCallback((e) => {
        if (!lightboxOpen) return;
        if (e.key === "ArrowLeft") navigateLightboxDirection(-1);
        if (e.key === "ArrowRight") navigateLightboxDirection(1);
        if (e.key === "Escape") closeLightbox();
    }, [lightboxOpen, closeLightbox, navigateLightboxDirection]);

    // Touch swipe handling
    const handleTouchStart = useCallback((e) => {
        setTouchStartX(e.touches[0].clientX);
    }, []);

    const handleTouchEnd = useCallback((e) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                navigateLightboxDirection(1); // Swipe left - next
            } else {
                navigateLightboxDirection(-1); // Swipe right - previous
            }
        }
        setTouchStartX(null);
    }, [touchStartX, navigateLightboxDirection]);

    // Focus management and keyboard handling
    useEffect(() => {
        if (lightboxOpen) {
            previousActiveElement.current = document.activeElement;
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
            // Focus the close button initially
            setTimeout(() => {
                const closeBtn = document.querySelector('.lightbox-close');
                closeBtn?.focus();
            }, 100);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [lightboxOpen, handleKeyDown]);

    // Restore focus when lightbox closes
    useEffect(() => {
        if (!lightboxOpen && previousActiveElement.current) {
            previousActiveElement.current.focus();
        }
    }, [lightboxOpen]);

    // Get the full-size image URL (backend returns 'image' field)
    const getFullImageUrl = (image) => {
        return image.image || image.imageUrl || asset("royal3.jpeg");
    };

    // Get thumbnail URL (same as full image for now, but could be different)
    const getThumbnailUrl = (image) => {
        return image.image || image.imageUrl || asset("royal3.jpeg");
    };

    return (
        <section className="gallery-section" id="gallery">
            <div className="container">
                <div className="page-header">
                    <h1 className="section-title">Photo Gallery</h1>
                    <p className="section-subtitle">
                        Moments of worship, outreach, and community from Royal Higher Life Ministries.
                    </p>
                </div>

                {/* Category Filters */}
                <div
                    className="gallery-filters grid grid-cols-4 gap-2 px-3! max-[360px]:gap-1.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 sm:px-4!"
                    role="tablist"
                >
                    <button
                        role="tab"
                        aria-selected={activeCategory === "all"}
                        onClick={() => setActiveCategory("all")}
                        className={`filter-btn min-w-0! whitespace-nowrap px-0.5! py-[10px]! text-[11px] max-[360px]:text-[10px] sm:px-1! sm:py-[0.6rem]! sm:text-[0.85rem] md:px-[1.3rem]! md:py-[0.7rem]! md:text-[0.9rem] ${activeCategory === "all" ? "active" : ""}`}
                    >
                        All Photos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            role="tab"
                            aria-selected={activeCategory === cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`filter-btn min-w-0! whitespace-nowrap px-0.5! py-[10px]! text-[11px] max-[360px]:text-[10px] sm:px-1! sm:py-[0.6rem]! sm:text-[0.85rem] md:px-[1.3rem]! md:py-[0.7rem]! md:text-[0.9rem] ${activeCategory === cat ? "active" : ""}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Image Grid */}
                <div
                    className="gallery-grid grid grid-cols-2 gap-[10px]! px-3! min-[641px]:gap-4! min-[769px]:px-4! min-[901px]:grid-cols-3 min-[901px]:gap-6!"
                    role="list"
                >
                    {loading ? (
                        [...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="gallery-skeleton min-w-0! rounded-[14px]! p-[10px]! min-[641px]:rounded-[18px]! min-[641px]:p-0!"
                                aria-hidden="true"
                            >
                                <div className="skeleton-image aspect-square! min-[641px]:aspect-[4/3]!"></div>
                                <div className="skeleton-text"></div>
                            </div>
                        ))
                    ) : filteredImages.length === 0 ? (
                        <div className="no-images">
                            <div className="no-images-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3>No Photos Available Yet</h3>
                            <p>There are currently no photos in this category. Check back soon for beautiful moments, memories and highlights from our ministry.</p>
                        </div>
                    ) : (
                        filteredImages.map((image, index) => (
                            <article 
                                key={image._id || index} 
                                className="gallery-item min-w-0! rounded-[14px]! p-[10px]! min-[641px]:rounded-[18px]! min-[641px]:p-0!"
                                role="listitem"
                                tabIndex={0}
                                onClick={() => openLightbox(index)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        openLightbox(index);
                                    }
                                }}
                            >
                                <div className="gallery-image-wrapper aspect-square! min-[641px]:aspect-[4/3]!">
                                    <img
                                        className="h-full! w-full! object-cover!"
                                        src={getThumbnailUrl(image)} 
                                        alt={image.title}
                                        loading="lazy"
                                        onError={(event) => {
                                            event.currentTarget.onerror = null;
                                            event.currentTarget.src = asset("royal3.jpeg");
                                        }}
                                    />
                                    <div className="gallery-overlay">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="gallery-info min-w-0! p-0! min-[641px]:px-[1.2rem]! min-[641px]:py-4!">
                                    <h4 className="gallery-title text-[14px]! min-[641px]:text-base!">{image.title}</h4>
                                    {image.category && (
                                        <span className="gallery-category px-[6px]! py-[2px]! text-[10px]! min-[641px]:px-[0.6rem]! min-[641px]:py-[0.2rem]! min-[641px]:text-[0.7rem]!">{image.category}</span>
                                    )}
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>

            {/* Full-screen Lightbox Modal */}
            {lightboxOpen && filteredImages.length > 0 && (
                <div 
                    className="lightbox-overlay" 
                    onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
                    role="dialog" 
                    aria-modal="true" 
                    aria-label="Image gallery"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <button 
                        className="lightbox-close" 
                        onClick={closeLightbox}
                        aria-label="Close lightbox"
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button 
                        className="lightbox-nav lightbox-prev" 
                        onClick={(e) => { e.stopPropagation(); navigateLightboxDirection(-1); }}
                        aria-label="Previous image"
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button 
                        className="lightbox-nav lightbox-next" 
                        onClick={(e) => { e.stopPropagation(); navigateLightboxDirection(1); }}
                        aria-label="Next image"
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="lightbox-content" ref={lightboxImgRef}>
                        <img 
                            src={getFullImageUrl(filteredImages[lightboxIndex])} 
                            alt={filteredImages[lightboxIndex].title}
                            onLoad={() => {
                                // Image loaded successfully
                            }}
                            onError={(e) => {
                                // Handle broken image
                                e.target.src = asset("royal3.jpeg");
                            }}
                        />
                        <div className="lightbox-info">
                            <h3>{filteredImages[lightboxIndex].title}</h3>
                            {filteredImages[lightboxIndex].category && (
                                <span className="lightbox-category">{filteredImages[lightboxIndex].category}</span>
                            )}
                            <p className="lightbox-counter">
                                {lightboxIndex + 1} of {filteredImages.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
