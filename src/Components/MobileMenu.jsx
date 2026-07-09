export default function MobileMenu({ isOpen, children }) {
    return (
        <div className={` mobile-menu ${isOpen ? "open" : "closed"}`}>
            {children}
        </div>
    );
}
