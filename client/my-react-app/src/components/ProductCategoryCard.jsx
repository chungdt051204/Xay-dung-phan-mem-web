import React from "react";
import { Link } from "react-router-dom";
import "../style/ProductCategoryCard.css";

export default function ProductCategoryCard({ data }) {
  return (
    <section className="product-section-wrapper">
      <div className="product-grid-container">
        <div className="product-grid">
          {data?.length > 0 ? (
            data.map((value) => (
              <Link
                key={value._id}
                to={`/product/detail?productId=${value._id}`}
                className="product-card-link"
              >
                <div className="product-card">
                  <div className="product-image-wrapper">
                    <img
                      src={value.image}
                      alt={value.productName}
                      className="product-image"
                    />
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{value.productName}</h3>

                    <div className="product-price">
                      {value.price?.toLocaleString("vi-VN")}₫
                    </div>

                    {value.brandId?.brandName && (
                      <div className="product-brand">
                        Thương hiệu: {value.brandId.brandName}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-data-msg">Không có sản phẩm để hiển thị</p>
          )}
        </div>
      </div>
    </section>
  );
}
