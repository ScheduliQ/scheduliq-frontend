import Swal from "sweetalert2";

type AlertType = "success" | "error";

export const ShowSwalAlert = (alertType: AlertType, message: string): void => {
  let htmlContent: string = "";

  if (alertType === "success") {
    htmlContent = `
      <div style="
        background-color: #dff0d8;
        border: 1px solid #d6e9c6;
        color: #3c763d;
        padding: 15px;
        border-radius: 8px;
        position: relative;
        font-family: 'Open Sans', sans-serif;">
        
        <strong style="display: flex; align-items: center;">
          <span style="font-size: 18px; margin-right: 8px;">✔</span> Success!
        </strong>
        
        <hr style="margin: 10px 0; border: none; border-top: 1px solid #d6e9c6;">
        
        <p style="margin: 10px 0 0;">${message}</p>
        
        <button id="closeAlert" style="
          position: absolute;
          right: 8px;
          top: 8px;
          background: transparent;
          border: none;
          color: #3c763d;
          font-size: 20px;
          cursor: pointer;">×</button>
      </div>
    `;
  } else {
    htmlContent = `
      <div style="
        background-color: #f2dede;
        border: 1px solid #ebccd1;
        color: #a94442;
        padding: 15px;
        border-radius: 8px;
        position: relative;
        font-family: 'Open Sans', sans-serif;">
        
        <strong style="display: flex; align-items: center;">
          <span style="font-size: 18px; margin-right: 8px;">✖</span> Error!
        </strong>
        
        <hr style="margin: 10px 0; border: none; border-top: 1px solid #ebccd1;">
        
        <p style="margin: 10px 0 0;">${message}</p>
        
        <button id="closeAlert" style="
          position: absolute;
          right: 8px;
          top: 8px;
          background: transparent;
          border: none;
          color: #a94442;
          font-size: 20px;
          cursor: pointer;">×</button>
      </div>
    `;
  }

  Swal.fire({
    position: "top",
    html: htmlContent,
    background: "transparent",
    showConfirmButton: false,
    didOpen: () => {
      document.getElementById("closeAlert")?.addEventListener("click", () => {
        Swal.close();
      });
    },
  });
};
