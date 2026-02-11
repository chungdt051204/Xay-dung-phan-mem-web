export default function ProductCategoryCard({ data }) {
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {data?.length > 0 ? (
          data?.map((value) => {
            return (
              <div
                key={value._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "300px",
                  height: "450px",
                }}
              >
                <img src={value.image} alt="" width={200} height={250} />
                <h2>{value.productName}</h2>
                <p>{value.price + "VNĐ"}</p>
                <p>{"Thương hiệu" + " " + value.brandId.brandName}</p>
              </div>
            );
          })
        ) : (
          <p>Không có sản phẩm để hiển thị</p>
        )}
      </div>
    </>
  );
}
