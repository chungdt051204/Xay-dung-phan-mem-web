import { forwardRef } from "react";

const ConfirmDialog = forwardRef(({ content, handleClick }, ref) => {
  return (
    <dialog ref={ref} className="confirm-dialog">
      <div className="confirm-box">
        <h4 className="confirm-title">Xác nhận</h4>

        <p className="confirm-text">{content}</p>

        <div className="confirm-actions">
          <button
            className="btn-cancel"
            onClick={() => ref?.current?.close()}
          >
            Hủy
          </button>

          <button
            className="btn-confirm"
            onClick={() => {
              handleClick();
              ref?.current?.close();
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default ConfirmDialog;
