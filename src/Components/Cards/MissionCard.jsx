export default function MissionCard({ id, title, actions, children }) {
    return (
        <article id={id} className="mission-card">
            <header>
                <h2>{title}</h2>
                {actions && <div className="mission-actions">{actions}</div>}
            </header>
            <div className="mission-content">{children}</div>
        </article>
    );
}
