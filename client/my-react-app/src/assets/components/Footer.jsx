import './Footer.css';
import visaImg from '../visa.png';
import master from '../mastercard.png';
import paypal from '../paypal.png';
import amex from '../amex.png';
import vnpay from '../vnpay.png';
import momo from '../momo.png';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-top">
        <div className="footer-col footer-brand">
          <div className="brand-logo">Nhóm4</div>
          <p className="brand-desc">Trang bán đồ điện tử chính hãng, uy tín chất lưjợng nhất</p>

          <div className="payments" aria-label="Phương thức thanh toán">
            <img src={visaImg} alt="VISA" className="payment-icon" />
            <img src={master} alt="Mastercard" className="payment-icon" />
            <img src={paypal} alt="PayPal" className="payment-icon" />
            <img src={amex} alt="American Express" className="payment-icon" />
            <img src={vnpay} alt="VNPAY" className="payment-icon" />
            <img src={momo} alt="MoMo" className="payment-icon" />
          </div>
        </div>

        <div className="footer-col footer-links">
          <h4>LIÊN KẾT NHANH</h4>
          <ul>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/blogs">Blogs</a></li>
            <li><a href="/contact">Liên hệ</a></li>
            <li><a href="/faq">Câu hỏi thường gặp</a></li>
          </ul>
        </div>

        <div className="footer-col footer-links">
          <h4>TÀI KHOẢN</h4>
          <ul>
            <li><a href="/account">Tài khoản của tôi</a></li>
            <li><a href="/orders">Theo dõi đơn hàng</a></li>
            <li><a href="/checkout">Thanh toán</a></li>
            <li><a href="/wishlist">Danh sách yêu thích</a></li>
          </ul>
        </div>

        <div className="footer-col footer-newsletter">
          <h4>BẢN TIN</h4>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()} aria-label="Đăng ký nhận bản tin">
            <label htmlFor="footer-email" className="sr-only">Email</label>
            <div className="newsletter-control">
              <input id="footer-email" name="email" type="email" placeholder="Email" required />
              <button type="submit" className="subscribe-btn">ĐĂNG KÝ</button>
            </div>
          </form>

          <div className="socials" aria-label="Liên kết mạng xã hội">
            <a href="#" className="social" aria-label="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.76l-.44 2.9h-2.32V22C18.34 21.25 22 17.09 22 12.07z"/></svg></a>
            <a href="#" className="social" aria-label="Twitter"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.2 4.2 0 0 0 1.85-2.32 8.3 8.3 0 0 1-2.63 1 4.15 4.15 0 0 0-7.07 3.78A11.77 11.77 0 0 1 3.15 4.6a4.14 4.14 0 0 0 1.28 5.54c-.64-.02-1.24-.2-1.77-.5v.05a4.15 4.15 0 0 0 3.33 4.07c-.3.08-.62.12-.95.12-.23 0-.47-.02-.69-.07a4.16 4.16 0 0 0 3.88 2.88A8.33 8.33 0 0 1 2 19.54 11.74 11.74 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68v-.53A8.18 8.18 0 0 0 22.46 6z"/></svg></a>
            <a href="#" className="social" aria-label="YouTube"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 15l5.19-3L10 9v6zM21.8 8.01s-.2-1.41-.83-2.03c-.79-.83-1.68-.84-2.09-.89C15.58 4.9 12 4.9 12 4.9h-.01s-3.58 0-6.88.2c-.41.05-1.3.06-2.09.89C2.4 6.6 2.2 8.01 2.2 8.01S2 9.78 2 11.55v.9c0 1.77.2 3.54.2 3.54s.2 1.41.83 2.03c.79.83 1.83.8 2.29.89 1.66.24 7.06.22 7.06.22s3.57 0 6.88-.2c.41-.05 1.3-.06 2.09-.89.63-.62.83-2.03.83-2.03s.2-1.77.2-3.54v-.9c0-1.77-.2-3.54-.2-3.54z"/></svg></a>
            <a href="#" className="social" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zM18.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg></a>
            <a href="#" className="social" aria-label="Pinterest"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.04 2.45 7.46 5.92 9.01-.08-.77-.15-1.95.03-2.79.17-.76 1.09-4.85 1.09-4.85s-.28-.56-.28-1.38c0-1.29.75-2.26 1.69-2.26.8 0 1.19.6 1.19 1.32 0 .8-.51 1.99-.77 3.09-.22.94.46 1.71 1.37 1.71 1.65 0 2.92-1.74 2.92-4.25 0-2.22-1.6-3.78-3.88-3.78-2.64 0-4.19 1.98-4.19 4.04 0 .8.31 1.66.69 2.12.08.09.09.17.07.26-.08.29-.26.94-.3 1.07-.05.17-.16.21-.37.12-1.37-.64-2.23-2.62-2.23-4.2 0-3.4 2.47-6.53 7.12-6.53 3.73 0 6.63 2.66 6.63 6.19 0 3.69-2.33 6.66-5.56 6.66-1.09 0-2.12-.57-2.47-1.23l-.67 2.57c-.24.97-.87 1.94-1.29 2.6C10.63 22.9 11.31 23 12 23c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Nhóm4. Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  );
}
