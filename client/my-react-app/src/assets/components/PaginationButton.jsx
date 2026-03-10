import { useNavigate, useSearchParams, Link } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

  .pg-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px 0 8px;
    font-family: 'Space Mono', monospace;
  }

  .pg-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #2a2a2a;
    background: transparent;
    color: #666;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s ease;
    outline: none;
  }

  .pg-btn:hover:not(:disabled):not(.pg-active) {
    border-color: #e0ff4f;
    color: #e0ff4f;
    background: rgba(224, 255, 79, 0.05);
  }

  .pg-btn.pg-active {
    border-color: #e0ff4f;
    background: #e0ff4f;
    color: #0a0a0a;
    font-weight: 700;
  }

  .pg-btn:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  .pg-btn.pg-arrow {
    font-size: 16px;
  }

  .pg-btn.pg-dots {
    cursor: default;
    border-color: transparent;
    color: #444;
  }

  .pg-btn.pg-dots:hover {
    border-color: transparent;
    background: transparent;
    color: #444;
  }

  .pg-info {
    text-align: center;
    color: #999;
    font-size: 11px;
    letter-spacing: 1px;
    font-family: 'Space Mono', monospace;
    padding-bottom: 8px;
  }

  .pg-info span {
    color: #e0ff4f;
  }
`;

export default function Pagination({ totalPages }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const createUrl = (page) => {
    if (page > 1) params.set("page", page);
    else {
      params.delete("page");
    }
    return params.toString();
  };
  const pages = [...Array(totalPages)].map((_, i) => i + 1);
  const currentPage = searchParams.get("page") || 1;

  if (totalPages <= 1) return null;

  return (
    <>
      <style>{style}</style>
      <div className="pg-container">
        <Link to={`?${createUrl(Number(currentPage) - 1)}`}>
          <button
            className="pg-btn pg-arrow"
            disabled={currentPage === 1}
            aria-label="Trang trước"
          >
            ‹
          </button>
        </Link>
        {pages.map((p, i) => (
          <Link to={`?${createUrl(p)}`} key={i}>
            <button
              className={`pg-btn${
                Number(currentPage) === p ? " pg-active" : ""
              }`}
              aria-label={`Trang ${p}`}
              aria-current={currentPage === p ? "page" : undefined}
            >
              {p}
            </button>
          </Link>
        ))}
        <Link to={`?${createUrl(Number(currentPage) + 1)} `}>
          <button
            className="pg-btn pg-arrow"
            disabled={Number(currentPage) === totalPages}
            aria-label="Trang sau"
          >
            ›
          </button>
        </Link>
      </div>
      <div className="pg-info">
        Trang <span>{currentPage}</span> / {totalPages}
      </div>
    </>
  );
}
