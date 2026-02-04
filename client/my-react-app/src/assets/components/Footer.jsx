import "../style/Footer.css";
import visaImg from "../visa.png";
import master from "../mastercard.png";
import paypal from "../paypal.png";
import amex from "../amex.png";
import vnpay from "../vnpay.png";
import momo from "../momo.png";
import facebookIcon from "../Facebook.png";
import twitterIcon from "../twiter.png";
import youtubeIcon from "../youtube.png";
import instagramIcon from "../insta.png";
import pinterestIcon from "../pinter.png";

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-top">
        <div className="footer-col footer-brand">
          <div className="brand-logo">Nhóm4</div>
          <p className="brand-desc">
            Trang bán đồ điện tử chính hãng, uy tín chất lượng nhất
          </p>

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
            <li>
              <a href="/about">Giới thiệu</a>
            </li>
            <li>
              <a href="/blogs">Blogs</a>
            </li>
            <li>
              <a href="/contact">Liên hệ</a>
            </li>
            <li>
              <a href="/faq">Câu hỏi thường gặp</a>
            </li>
          </ul>
        </div>

        <div className="footer-col footer-links">
          <h4>TÀI KHOẢN</h4>
          <ul>
            <li>
              <a href="/account">Tài khoản của tôi</a>
            </li>
            <li>
              <a href="/orders">Theo dõi đơn hàng</a>
            </li>
            <li>
              <a href="/checkout">Thanh toán</a>
            </li>
            <li>
              <a href="/wishlist">Danh sách yêu thích</a>
            </li>
          </ul>
        </div>

        <div className="footer-col footer-newsletter">
          <h4>BẢN TIN</h4>
          <form
            className="newsletter-form"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Đăng ký nhận bản tin"
          >
            <label htmlFor="footer-email" className="sr-only">
              Email
            </label>
            <div className="newsletter-control">
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="Email"
                required
              />
              <button type="submit" className="subscribe-btn">
                ĐĂNG KÝ
              </button>
            </div>
          </form>

          <div className="socials" aria-label="Liên kết mạng xã hội">
            <a href="#" className="social" aria-label="Facebook">
              <img src={facebookIcon} alt="Facebook" className="social-icon" />
            </a>
            <a href="#" className="social" aria-label="Twitter">
              <img src={twitterIcon} alt="Twitter" className="social-icon" />
            </a>
            <a href="#" className="social" aria-label="YouTube">
              <img src={youtubeIcon} alt="YouTube" className="social-icon" />
            </a>
            <a href="#" className="social" aria-label="Instagram">
              <img
                src={instagramIcon}
                alt="Instagram"
                className="social-icon"
              />
            </a>
            <a href="#" className="social" aria-label="Pinterest">
              <img
                src={pinterestIcon}
                alt="Pinterest"
                className="social-icon"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Nhóm4. Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  );
}
