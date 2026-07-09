export default function BeliefCard({ title, reference, children }) {
    return (
        <article className="belief-card">
            <video
                className="belief-bg-video"
                src="/faith.mp4"
                autoPlay
                muted
                loop
                playsInline
            />
            <div className="belief-overlay" />

            <div className="belief-content">
                <h3>{title}</h3>
                <p>{children}</p>
                <small>{reference}</small>
            </div>
        </article>
    );
}


