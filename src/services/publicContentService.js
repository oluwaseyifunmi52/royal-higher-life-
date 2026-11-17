import api from "../api/axios";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

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

// Public reads use the public backend routes. The admin service remains scoped
// to authenticated editing routes for the dashboard.
export const getPublicSermons = () => getPublicContent("/api/sermons");
export const getPublicSermon = (id) => getPublicContent(`/api/sermons/${id}`);
export const getPublicEvents = () => getPublicContent("/api/events");
export const getPublicGallery = () => getPublicContent("/api/gallery");
export const getPublicReviews = () => getPublicContent("/api/reviews");

export const getPublicLeadership = () => getPublicContent("/api/leadership");
