export default function ConfirmDialog({ ref, content, handleClick }) {
  return (
    <>
      <dialog ref={ref}>
        <div>
          <h4>{content}</h4>
          <button onClick={handleClick}>Xác nhận</button>
          <button
            onClick={() => {
              ref?.current?.close();
            }}
          >
            Hủy
          </button>
        </div>
      </dialog>
    </>
  );
}
