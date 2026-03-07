import "../style/About.css";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="about-page">
        <div className="about-container">
          <div className="about-hero">
            <h1>Giới Thiệu Về Chúng Tôi</h1>
            <p className="hero-subtitle">
              Đối tác tin cậy cho các sản phẩm điện tử chất lượng cao
            </p>
          </div>

          <div className="about-content">
            <section className="about-section">
              <h2>Giới Thiệu Nhóm 4</h2>
              <p>
                <strong>Nhóm 4</strong> là một đội ngũ các lập trình viên, thiết
                kế và quản lý tổng hợp tài năng, với mục tiêu xây dựng một nền
                tảng thương mại điện tử hiện đại và thân thiện với người dùng.
                Chúng tôi bao gồm:
              </p>
              <ul className="team-info">
                <li>
                  <strong>Lập trình viên Frontend:</strong> Chuyên phát triển
                  frontend. Gồm có Lư Anh Hào, Trần Tấn Phát, Nguyễn Phan Trường Huy
                </li>
                <li>
                  <strong>Lập trình viên Backend:</strong> Chuyên phát triển
                  backend. Gồm có Đỗ Thành Chung, Phạm Thái Duy, Diệp Thế Huy
                </li>
                <li>
                  <strong>Nhà thiết kế UI/UX:</strong> Tạo ra giao diện đẹp và
                  dễ sử dụng
                </li>
                <li>
                  <strong>Quản lý dự án:</strong> Đảm bảo chất lượng và tiến độ
                  phát triển
                </li>
                <li>
                  <strong>Chuyên gia bán hàng:</strong> Tư vấn về trải nghiệm
                  khách hàng
                </li>
              </ul>
              <p style={{ marginTop: "15px" }}>
                Với sự kết hợp giữa kỹ thuật và kinh doanh, Nhóm 4 tự hào mang
                lại một giải pháp thương mại điện tử toàn diện cho cộng đồng.
              </p>
            </section>

            <section className="about-section">
              <h2>Giới Thiệu Tổng Quan Website</h2>
              <p>
                <strong>Nền tảng Nhóm 4</strong> là một website bán hàng điện tử
                chuyên biệt trong lĩnh vực các sản phẩm công nghệ và thiết bị
                điện tử. Chúng tôi cung cấp một thị trường trực tuyến an toàn,
                tiện lợi và đáng tin cậy cho hàng nghìn khách hàng trên khắp
                Việt Nam.
              </p>
              <h3 style={{ marginTop: "20px", color: "#667eea" }}>
                Các Tính Năng Chính:
              </h3>
              <ul className="features-list">
                <li>
                  📱 <strong>Kho Sản Phẩm Đa Dạng:</strong> Điện thoại, Laptop,
                  Máy tính bảng, Headphone, TV, v.v.
                </li>
                <li>
                  🔍 <strong>Tìm Kiếm Thông Minh:</strong> Lọc sản phẩm theo
                  giá, hiệu suất, thương hiệu
                </li>
                <li>
                  🛒 <strong>Giỏ Hàng Dễ Sử Dụng:</strong> Quản lý sản phẩm một
                  cách đơn giản
                </li>
                <li>
                  💳 <strong>Thanh Toán An Toàn:</strong> Hỗ trợ VISA,
                  Mastercard, PayPal, VNPAY, MoMo, COD
                </li>
                <li>
                  📦 <strong>Giao Hàng Nhanh:</strong> Giao hàng toàn quốc trong
                  2-5 ngày
                </li>
                <li>
                  ⭐ <strong>Đánh Giá & Nhận Xét:</strong> Từ những khách hàng
                  thực tế
                </li>
                <li>
                  🎁 <strong>Chương Trình Khuyến Mãi:</strong> Giảm giá định kỳ
                  và mã giảm giá
                </li>
                <li>
                  ❤️ <strong>Danh Sách Yêu Thích:</strong> Lưu sản phẩm để mua
                  sau
                </li>
                <li>
                  📋 <strong>Quản Lý Đơn Hàng:</strong> Theo dõi trạng thái đơn
                  hàng của bạn
                </li>
              </ul>
            </section>

            <section className="about-section">
              <h2>Tầm Nhìn & Giá Trị</h2>
              <div className="vision-grid">
                <div className="vision-item">
                  <h4>🎯 Tầm Nhìn</h4>
                  <p>
                    Trở thành nền tảng thương mại điện tử hàng đầu Việt Nam, nơi
                    mọi khách hàng có thể mua sắm các sản phẩm công nghệ chất
                    lượng cao với giá tốt nhất.
                  </p>
                </div>
                <div className="vision-item">
                  <h4>💪 Sứ Mệnh</h4>
                  <p>
                    Cung cấp các sản phẩm điện tử chính hãng, chất lượng cao với
                    dịch vụ khách hàng tuyệt vời, giúp người dùng tiếp cận công
                    nghệ dễ dàng hơn.
                  </p>
                </div>
                <div className="vision-item">
                  <h4>✨ Giá Trị Cốt Lõi</h4>
                  <p>
                    • Uy tín và minh bạch
                    <br />
                    • Chất lượng và độ tin cậy
                    <br />
                    • Sáng tạo và cải tiến
                    <br />• Khách hàng lên hàng đầu
                  </p>
                </div>
              </div>
            </section>

            <section className="about-section">
              <h2>Tại Sao Chọn Nhóm 4?</h2>
              <ul className="features-list">
                <li>✓ Sản phẩm chính hãng 100%, được kiểm định kỹ lưỡng</li>
                <li>✓ Giá cả cạnh tranh, thường xuyên có khuyến mãi hấp dẫn</li>
                <li>✓ Giao hàng nhanh chóng trên toàn quốc</li>
                <li>✓ Hỗ trợ khách hàng 24/7, tận tâm và chuyên nghiệp</li>
                <li>✓ Chính sách đổi trả dễ dàng, không phiền hà (30 ngày)</li>
                <li>✓ Nhiều phương thức thanh toán an toàn và tiện lợi</li>
                <li>✓ Bảo hành chính hãng và dịch vụ sau bán hàng tốt</li>
                <li>✓ Giao diện website user-friendly, dễ sử dụng</li>
              </ul>
            </section>

            <section className="about-section">
              <h2>Các Sản Phẩm Chúng Tôi Cung Cấp</h2>
              <div className="products-grid">
                <div className="product-category">
                  <h4>📱 Điện Thoại Di Động</h4>
                  <p>iPhone, Samsung, Xiaomi, OPPO, Vivo</p>
                </div>
                <div className="product-category">
                  <h4>💻 Laptop & PC</h4>
                  <p>Dell, HP, Lenovo, ASUS, MacBook</p>
                </div>
                <div className="product-category">
                  <h4>⌚ Máy Tính Bảng</h4>
                  <p>iPad, Samsung Tab, Xiaomi Pad</p>
                </div>
                <div className="product-category">
                  <h4>🎧 Headphone & Loa</h4>
                  <p>Sony, Bose, JBL, AirPods, SoundMax</p>
                </div>
                <div className="product-category">
                  <h4>📺 Tivi & Màn Hình</h4>
                  <p>Samsung, LG, Sony, TCL</p>
                </div>
                <div className="product-category">
                  <h4>⌨️ Phụ Kiện</h4>
                  <p>Pin, Sạc, Cáp, Case, Kính cường lực</p>
                </div>
              </div>
            </section>

            <section className="about-section">
              <h2>Công Nghệ & Nền Tảng</h2>
              <p>
                Website của Nhóm 4 được xây dựng với các công nghệ hiện đại
                nhất:
              </p>
              <ul className="tech-list">
                <li>
                  <strong>Frontend:</strong> React.js - Giao diện nhanh, mượt mà
                  và responsive
                </li>
                <li>
                  <strong>Backend:</strong> Node.js - Xử lý dữ liệu mạnh mẽ và
                  an toàn
                </li>
                <li>
                  <strong>Database:</strong> MongoDB - Lưu trữ dữ liệu linh hoạt
                  và hiệu quả
                </li>
                <li>
                  <strong>Deployment:</strong> Cloud hosting - Đảm bảo tốc độ và
                  độ ổn định 24/7
                </li>
                <li>
                  <strong>Security:</strong> SSL/HTTPS - Bảo mật dữ liệu khách
                  hàng
                </li>
              </ul>
            </section>

            <section className="about-section">
              <h2>Lịch Sử Phát Triển</h2>
              <p>
                Nhóm 4 được thành lập với mục tiêu tạo ra một nền tảng thương
                mại điện tử hiện đại cho thị trường Việt Nam. Từ những ngày đầu
                với một đội nhỏ gồm các lập trình viên tài năng, chúng tôi đã
                phát triển thành một sàn giao dịch đáng tin cậy phục vụ hàng
                nghìn khách hàng.
              </p>
              <p style={{ marginTop: "15px" }}>
                Chúng tôi liên tục cải tiến dịch vụ, mở rộng danh mục sản phẩm,
                và tối ưu hóa trải nghiệm người dùng để đáp ứng nhu cầu ngày
                càng tăng của khách hàng.
              </p>
            </section>

            <section className="about-section contact-section">
              <h2>Liên Hệ Với Chúng Tôi</h2>
              <p>
                Chúng tôi luôn sẵn sàng lắng nghe ý kiến, đề xuất và thắc mắc
                của bạn:
              </p>
              <ul className="contact-info">
                <li>
                  <strong>📧 Email:</strong>{" "}
                  <a href="mailto:support@nhom4.com">support@nhom4.com</a>
                </li>
                <li>
                  <strong>📱 Điện thoại:</strong>{" "}
                  <a href="tel:1900-1234">1900-1234</a>
                </li>
                <li>
                  <strong>📍 Địa chỉ:</strong> 123 Đường ABC, Phường XYZ, Thành
                  phố Hồ Chí Minh
                </li>
                <li>
                  <strong>⏰ Giờ Làm Việc:</strong> Thứ 2 - Chủ Nhật: 8:00 -
                  20:00
                </li>
              </ul>
            </section>

            <section className="about-section">
              <h2>Cảm Ơn Bạn</h2>
              <p>
                Cảm ơn bạn đã ghé thăm và tin tưởng Nhóm 4. Chúng tôi cam kết sẽ
                không ngừng nỗ lực để mang lại những sản phẩm tốt nhất và dịch
                vụ xuất sắc nhất cho bạn. Nếu có bất kỳ câu hỏi nào, đừng ngần
                ngại liên hệ với chúng tôi!
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
