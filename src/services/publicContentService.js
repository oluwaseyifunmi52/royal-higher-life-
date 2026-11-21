import api from "../api/axios";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
const PUBLIC_SITE_CONTENT_CACHE_MS = 30_000;
let siteContentRequest;
let siteContentCachedAt = 0;
let siteContentCachedResponse;

async function getPublicContent(path) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            return await api.get(path);
        } catch (error) {
            const isTransient = !error.response || error.response.status >= 500;
            if (attempt === 1 || !isTransient) throw error;
            await wait(1200);
        }
    }
}

// Home and the shared footer request the same public document. Coalesce
// concurrent callers (including StrictMode's development replay) and retain
// the result briefly to avoid refetching during route transitions.
export function getPublicSiteContent() {
    if (siteContentRequest) return siteContentRequest;
    if (siteContentCachedResponse && Date.now() - siteContentCachedAt < PUBLIC_SITE_CONTENT_CACHE_MS) {
        return Promise.resolve(siteContentCachedResponse);
    }

    const request = getPublicContent("/api/site-content");
    siteContentRequest = request;
    request.then((response) => {
        siteContentCachedResponse = response;
        siteContentCachedAt = Date.now();
        if (siteContentRequest === request) siteContentRequest = undefined;
    }).catch(() => {
        if (siteContentRequest === request) siteContentRequest = undefined;
    });
    return request;
}

export function invalidatePublicSiteContentCache() {
    siteContentCachedResponse = undefined;
    siteContentCachedAt = 0;
}

// Public reads use the public backend routes. The admin service remains scoped
// to authenticated editing routes for the dashboard.
export const getPublicSermons = () => getPublicContent("/api/sermons");
export const getPublicSermon = (id) => getPublicContent(`/api/sermons/${id}`);
export const getPublicEvents = () => getPublicContent("/api/events");
export const getPublicGallery = () => getPublicContent("/api/gallery");
export const getPublicReviews = () => getPublicContent("/api/reviews");

export const getPublicLeadership = () => getPublicContent("/api/leadership");
export const getPublicAnnouncements = () => getPublicContent("/api/announcements");
export const getPublicMinistries = () => getPublicContent("/api/ministries");
