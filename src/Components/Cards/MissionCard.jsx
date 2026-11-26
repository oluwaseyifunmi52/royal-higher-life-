export default function MissionCard({ id, title, actions, icon, children }) {
    return (
        <article id={id} className="mission-card">
            {icon && <span className="mission-mobile-icon" aria-hidden="true">{icon}</span>}
            <header>
                <h2>{title}</h2>
                {actions && <div className="mission-actions">{actions}</div>}
            </header>
            <div className="mission-content">{children}</div>
        </article>
    );
}
