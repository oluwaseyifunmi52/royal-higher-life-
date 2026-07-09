export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>Royal Higher Life</h2>
          <p>Empowering lives through faith, outreach, and impact.</p>
        </div>
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: royalhigherlifeoutreach@gmail.com</p>
          <p>Phone: +234 9157754411</p>
          <p>Ibadan, Nigeria</p>
        </div>
      </div>
      <div className="footer-bottom">
       <p>
        © {new Date().getFullYear()} Royal Higher Life Christian Ministries. All rights reserved.
      </p>
      </div>
    </footer>
  );
}