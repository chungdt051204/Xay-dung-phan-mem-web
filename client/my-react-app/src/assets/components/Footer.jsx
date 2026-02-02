import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-copy">&copy; {new Date().getFullYear()} My React App. All rights reserved.</p>
        <nav className="footer-nav">
          <ul>
            <li><a href="/about" className="footer-link">About</a></li>
            <li><a href="/contact" className="footer-link">Contact</a></li>
            <li><a href="/privacy" className="footer-link">Privacy</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}