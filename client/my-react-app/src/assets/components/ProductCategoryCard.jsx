import { Link } from "react-router-dom";
import Pagination from "./PaginationButton";

export default function ProductCategoryCard({ data }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          padding: "16px",
        }}
      >
        {data?.length > 0 ? (
          data.map((value) => {
            const originalPrice = value.originalPrice || value.price * 1.2;

            return (
              <Link
                key={value._id}
                to={`/product/detail?productId=${value._id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "220px",
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.08)";
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: "relative",
                      padding: "16px",
                      backgroundColor: "#f8f8f8",
                    }}
                  >
                    <img
                      src={value.image}
                      alt={value.productName}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: "12px" }}>
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#333",
                        margin: "0 0 8px 0",
                        lineHeight: "1.4",
                        height: "40px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {value.productName}
                    </h3>

                    <div style={{ marginBottom: "8px" }}>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#E30019",
                          marginBottom: "4px",
                        }}
                      >
                        {value.price?.toLocaleString("vi-VN")}₫
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#999",
                          textDecoration: "line-through",
                        }}
                      >
                        {originalPrice?.toLocaleString("vi-VN")}₫
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#2673DD",
                        backgroundColor: "#E8F2FF",
                        padding: "6px 8px",
                        borderRadius: "4px",
                        marginBottom: "8px",
                      }}
                    >
                      Smember giảm đến{" "}
                      {(value.price * 0.01)?.toLocaleString("vi-VN")}₫
                    </div>

                    <div
                      style={{
                        fontSize: "11px",
                        color: "#666",
                        lineHeight: "1.4",
                      }}
                    >
                      Trả trước 0% - Gần bạn hoặc giao siêu tốc 2h
                    </div>

                    {value.brandId?.brandName && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#999",
                          marginTop: "8px",
                          paddingTop: "8px",
                          borderTop: "1px solid #f0f0f0",
                        }}
                      >
                        Thương hiệu: {value.brandId.brandName}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p
            style={{
              width: "100%",
              textAlign: "center",
              color: "#999",
              padding: "40px",
            }}
          >
            Không có sản phẩm để hiển thị
          </p>
        )}
      </div>
    </div>
  );
}
