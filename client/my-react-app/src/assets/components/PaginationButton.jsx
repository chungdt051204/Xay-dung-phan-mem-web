import { useState } from "react";

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

function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function Pagination({ current: controlledCurrent, totalPages = 20, onChange }) {
  const [internalPage, setInternalPage] = useState(1);

  const isControlled = controlledCurrent !== undefined && onChange !== undefined;
  const current = isControlled ? controlledCurrent : internalPage;
  const handleChange = isControlled ? onChange : setInternalPage;

  const pages = getPages(current, totalPages);

  if (totalPages <= 1) return null;

  return (
    <>
      <style>{style}</style>
      <div className="pg-container">
        <button
          className="pg-btn pg-arrow"
          disabled={current === 1}
          onClick={() => handleChange(current - 1)}
          aria-label="Trang trước"
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <button key={`dot-${i}`} className="pg-btn pg-dots" disabled>
              ···
            </button>
          ) : (
            <button
              key={p}
              className={`pg-btn${current === p ? " pg-active" : ""}`}
              onClick={() => handleChange(p)}
              aria-label={`Trang ${p}`}
              aria-current={current === p ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          className="pg-btn pg-arrow"
          disabled={current === totalPages}
          onClick={() => handleChange(current + 1)}
          aria-label="Trang sau"
        >
          ›
        </button>
      </div>
      <div className="pg-info">
        Trang <span>{current}</span> / {totalPages}
      </div>
    </>
  );
}