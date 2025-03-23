import React, { FC } from "react";
import Swal from "sweetalert2";

interface CarouselSwalProps {
  pages: string[];
}

const CarouselSwal: FC<CarouselSwalProps> = ({ pages }) => {
  let currentPageIndex: number = 0;

  const showCarousel = (): void => {
    if (!pages || pages.length === 0) {
      Swal.fire({
        title: "No Schedule Generated",
        text: "Please generate the schedule first.",
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-xl font-semibold",
          htmlContainer: "text-base",
        },
      });
      return;
    }
    Swal.fire({
      title: "Schedule Details",
      html: `
      <div id="carousel-content" style="text-align: left; white-space: pre-wrap;" class="mb-4 text-base text-gray-800">
        ${pages[currentPageIndex]}
      </div>
      <div class="flex justify-center gap-4">
        <button id="prev-button" class="swal2-styled bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
          &#8592;
        </button>
        <button id="next-button" class="swal2-styled bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
          &#8594;
        </button>
      </div>
    `,
      showConfirmButton: false,
      allowOutsideClick: true,
      didOpen: () => {
        const popup = Swal.getPopup();
        const prevButton = popup?.querySelector("#prev-button");
        const nextButton = popup?.querySelector("#next-button");
        const contentDiv = popup?.querySelector("#carousel-content");

        if (prevButton && nextButton && contentDiv) {
          prevButton.addEventListener("click", () => {
            currentPageIndex =
              (currentPageIndex - 1 + pages.length) % pages.length;
            contentDiv.innerHTML = pages[currentPageIndex];
          });
          nextButton.addEventListener("click", () => {
            currentPageIndex = (currentPageIndex + 1) % pages.length;
            contentDiv.innerHTML = pages[currentPageIndex];
          });
        }
      },
    });
  };

  return (
    <button
      onClick={showCarousel}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
    >
      Show Schedule Details
    </button>
  );
};

export default CarouselSwal;
