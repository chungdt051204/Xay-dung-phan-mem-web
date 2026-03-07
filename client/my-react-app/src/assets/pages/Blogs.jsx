import "../style/Blogs.css";
import { useState } from "react";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "Hướng Dẫn Chọn Laptop Phù Hợp Cho Công Việc",
      category: "tipsandtricks",
      date: "2024-03-01",
      author: "Admin Nhóm 4",
      excerpt:
        "Khám phá cách chọn laptop hoàn hảo cho nhu cầu công việc của bạn...",
      content:
        "Lựa chọn laptop phù hợp rất quan trọng. Hãy xem xét nhu cầu của bạn về hiệu năng, pin, và giá cả.",
    },
    {
      id: 2,
      title: "Bảo Dưỡng Điện Thoại Di Động Đúng Cách",
      category: "guides",
      date: "2024-02-28",
      author: "Admin Nhóm 4",
      excerpt: "Những mẹo giúp điện thoại của bạn kéo dài tuổi thọ...",
      content:
        "Bảo dưỡng điện thoại đúng cách sẽ giúp thiết bị của bạn hoạt động lâu dài và hiệu quả.",
    },
    {
      id: 3,
      title: "Những Công Nghệ Mới Nhất Năm 2024",
      category: "news",
      date: "2024-02-25",
      author: "Admin Nhóm 4",
      excerpt: "Cập nhật các xu hướng công nghệ mới nhất...",
      content:
        "Năm 2024 sẽ chứng kiến sự phát triển của AI, 5G, và công nghệ IoT.",
    },
    {
      id: 4,
      title: "So Sánh Tai Nghe: Có Dây vs Không Dây",
      category: "reviews",
      date: "2024-02-20",
      author: "Admin Nhóm 4",
      excerpt: "Ưu và nhược điểm của mỗi loại tai nghe...",
      content:
        "Tai nghe không dây tiện dụng nhưng tai nghe có dây có chất lượng âm thanh tốt hơn.",
    },
  ];

  const categories = [
    { value: "all", label: "Tất Cả" },
    { value: "news", label: "Tin Tức" },
    { value: "guides", label: "Hướng Dẫn" },
    { value: "reviews", label: "Đánh Giá" },
    { value: "tipsandtricks", label: "Mẹo & Thủ Thuật" },
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <>
      <Navbar />
      <div className="blogs-page">
        <div className="blogs-container">
          <div className="blogs-hero">
            <h1>Blog Của Nhóm 4</h1>
            <p className="hero-subtitle">
              Cập nhật tin tức, hướng dẫn, và mẹo công nghệ
            </p>
          </div>

          <div className="blogs-content">
            <aside className="blogs-sidebar">
              <div className="category-filter">
                <h3>Danh Mục</h3>
                <div className="category-options">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      className={`category-btn ${selectedCategory === cat.value ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <main className="blogs-main">
              <div className="blog-posts">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <article key={post.id} className="blog-card">
                      <div className="blog-header">
                        <h2>{post.title}</h2>
                        <div className="blog-meta">
                          <span className="blog-date">
                            📅 {new Date(post.date).toLocaleDateString("vi-VN")}
                          </span>
                          <span className="blog-author">✍️ {post.author}</span>
                        </div>
                      </div>
                      <p className="blog-excerpt">{post.excerpt}</p>
                      <button className="read-more-btn">Đọc Thêm →</button>
                    </article>
                  ))
                ) : (
                  <p className="no-posts">
                    Không có bài viết nào trong danh mục này.
                  </p>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
