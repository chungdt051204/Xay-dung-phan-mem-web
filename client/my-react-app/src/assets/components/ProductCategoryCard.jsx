import { Link } from "react-router-dom";
import { useState } from "react";
import Pagination from "./PaginationButton";

const ITEMS_PER_PAGE = 5;

const styles = {
  wrapper: {
    width: "100%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    padding: "8px 0 24px 0",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    height: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#ffffff",
    border: "1px solid #ebebeb",
    borderRadius: "14px",
    overflow: "hidden",
    transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
    cursor: "pointer",
  },
  imageWrap: {
    width: "100%",
    aspectRatio: "1 / 1",
    background: "#f7f7f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "transform 0.3s ease",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: "16px",
    gap: "6px",
  },
  name: {
    fontSize: "0.92rem",
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: "1.45",
    margin: "0 0 4px 0",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "2.6em",
  },
  priceNew: {
    fontSize: "1.15rem",
    fontWeight: "700",
    color: "#cc0000",
    letterSpacing: "-0.3px",
  },
  priceOld: {
    fontSize: "0.82rem",
    color: "#aaa",
    textDecoration: "line-through",
  },
  badge: {
    display: "inline-block",
    width: "fit-content",
    padding: "5px 10px",
    background: "#eef3ff",
    color: "#2563eb",
    fontSize: "0.78rem",
    fontWeight: "500",
    borderRadius: "6px",
    border: "1px solid #c7d9ff",
    marginTop: "2px",
  },
  shipping: {
    fontSize: "0.78rem",
    color: "#666",
    marginTop: "4px",
  },
  brand: {
    fontSize: "0.76rem",
    color: "#bbb",
    marginTop: "auto",
    paddingTop: "10px",
    borderTop: "1px solid #f2f2f2",
  },
  empty: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#bbb",
    padding: "60px 0",
    fontSize: "0.95rem",
  },
};

export default function ProductCategoryCard({ data }) {
  const [page, setPage] = useState(1);
  const [hoveredId, setHoveredId] = useState(null);

  const totalPages = Math.ceil((data?.length || 0) / ITEMS_PER_PAGE);
  const paginated = data?.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div style={styles.wrapper}>
      <div style={styles.grid}>
        {paginated?.length > 0 ? (
          paginated.map((value) => {
            const originalPrice = value.originalPrice || value.price * 1.2;
            const smemberDiscount = Math.round(value.price * 0.01);
            const isHovered = hoveredId === value._id;

            return (
              <Link
                key={value._id}
                to={`/product/detail?productId=${value._id}`}
                style={styles.link}
              >
                <div
                  style={{
                    ...styles.card,
                    transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                    boxShadow: isHovered
                      ? "0 16px 40px rgba(0,0,0,0.10)"
                      : "0 2px 10px rgba(0,0,0,0.06)",
                    borderColor: isHovered ? "#d0d0d0" : "#ebebeb",
                  }}
                  onMouseEnter={() => setHoveredId(value._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Ảnh */}
                  <div style={styles.imageWrap}>
                    <img
                      src={value.image}
                      alt={value.productName}
                      style={{
                        ...styles.image,
                        transform: isHovered ? "scale(1.06)" : "scale(1)",
                      }}
                    />
                  </div>

                  {/* Nội dung */}
                  <div style={styles.body}>
                    <h3 style={styles.name}>{value.productName}</h3>

                    <div style={styles.priceNew}>
                      {value.price?.toLocaleString("vi-VN")}₫
                    </div>
                    <div style={styles.priceOld}>
                      {originalPrice?.toLocaleString("vi-VN")}₫
                    </div>

                    <div style={styles.badge}>
                      Smember giảm đến {smemberDiscount?.toLocaleString("vi-VN")}₫
                    </div>

                    <div style={styles.shipping}>
                      Trả trước 0% · Giao siêu tốc 2h
                    </div>

                    {value.brandId?.brandName && (
                      <div style={styles.brand}>
                        Thương hiệu: {value.brandId.brandName}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p style={styles.empty}>Không có sản phẩm để hiển thị</p>
        )}
      </div>

      <Pagination current={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}