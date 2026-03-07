import "../style/FAQ.css";
import { useState } from "react";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";

export default function FAQ() {
  const [activeId, setActiveId] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "Tôi có thể trả lại sản phẩm trong bao lâu?",
      answer:
        "Bạn có thể trả lại sản phẩm trong vòng 30 ngày kể từ ngày mua, miễn là sản phẩm còn trong điều kiện tốt và có hóa đơn.",
    },
    {
      id: 2,
      question: "Bạn chấp nhận những phương thức thanh toán nào?",
      answer:
        "Chúng tôi chấp nhận thanh toán qua VISA, Mastercard, PayPal, VNPAY, MoMo, American Express và thanh toán khi nhận hàng.",
    },
    {
      id: 3,
      question: "Giao hàng mất bao lâu?",
      answer:
        "Giao hàng thường mất từ 2-5 ngày làm việc tùy vào khoảng cách. Đơn hàng sẽ được giao qua các dịch vụ chuyển phát nhanh uy tín.",
    },
    {
      id: 4,
      question: "Làm cách nào để theo dõi đơn hàng của tôi?",
      answer:
        "Bạn có thể theo dõi đơn hàng trong tài khoản của bạn hoặc qua email xác nhận. Chúng tôi sẽ gửi mã vận đơn cho bạn.",
    },
    {
      id: 5,
      question: "Sản phẩm có bảo hành không?",
      answer:
        "Các sản phẩm của chúng tôi đều có bảo hành từ nhà sản xuất. Thời gian bảo hành tùy thuộc vào loại sản phẩm (thường từ 12-24 tháng).",
    },
    {
      id: 6,
      question: "Tôi có thể hủy bỏ đơn hàng không?",
      answer:
        "Bạn có thể hủy bỏ đơn hàng trong vòng 24 giờ kể từ lúc đặt hàng. Sau đó, đơn hàng sẽ được khóa và không thể hủy.",
    },
    {
      id: 7,
      question: "Có phí giao hàng không?",
      answer:
        "Phí giao hàng tùy thuộc vào địa điểm của bạn. Chúng tôi cung cấp giao hàng miễn phí cho đơn hàng trên 500.000 VNĐ.",
    },
    {
      id: 8,
      question: "Làm cách nào để liên hệ với dịch vụ khách hàng?",
      answer:
        "Bạn có thể liên hệ với chúng tôi qua email support@nhom4.com, điện thoại 1900-1234, hoặc chat trực tuyến trên website.",
    },
  ];

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <>
      <Navbar />
      <div className="faq-page">
        <div className="faq-container">
          <div className="faq-hero">
            <h1>Câu Hỏi Thường Gặp</h1>
            <p className="hero-subtitle">
              Tìm kiếm câu trả lời cho những câu hỏi của bạn
            </p>
          </div>

          <div className="faq-content">
            <div className="faq-search">
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                className="faq-search-input"
              />
            </div>

            <div className="faq-list">
              {faqItems.map((item) => (
                <div
                  key={item.id}
                  className={`faq-item ${activeId === item.id ? "active" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => toggleFAQ(item.id)}
                  >
                    <span className="question-text">{item.question}</span>
                    <span className="toggle-icon">
                      {activeId === item.id ? "−" : "+"}
                    </span>
                  </button>
                  {activeId === item.id && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="faq-cta">
              <h3>Không tìm thấy câu trả lời?</h3>
              <p>Hãy liên hệ với chúng tôi qua email hoặc điện thoại</p>
              <a href="/contact" className="contact-btn">
                Liên Hệ Ngay
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
