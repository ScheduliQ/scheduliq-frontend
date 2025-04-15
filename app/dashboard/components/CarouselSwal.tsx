import React, { FC } from "react";
import Swal from "sweetalert2";
import { ShowSwalAlert } from "@/app/dashboard/components/ShowSwalAlert";

interface CarouselSwalProps {
  pages: string[];
}

const CarouselSwal: FC<CarouselSwalProps> = ({ pages }) => {
  let currentPageIndex: number = 0;

  const showCarousel = (): void => {
    if (!pages || pages.length === 0) {
      // Swal.fire({
      //   title: "No Schedule Generated",
      //   text: "Please generate the schedule first.",
      //   icon: "info",
      //   timer: 2000,
      //   showConfirmButton: false,
      //   customClass: {
      //     popup: "rounded-lg shadow-md",
      //     title: "text-xl font-semibold",
      //     htmlContainer: "text-base",
      //   },
      // });
      ShowSwalAlert(
        "error",
        "No Schedule Generated. Please generate the schedule first."
      );
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
      className="px-6 py-3 rounded-lg text-[#014DAE] font-sans bg-white border border-[#014DAE] transition-colors duration-200 hover:bg-[#F0F5FF] hover:border-[#014DAE] hover:text-[#014DAE] active:bg-[#014DAE] active:text-white focus:outline-none disabled:bg-blue-200 disabled:text-blue-300 disabled:border-blue-200 disabled:cursor-not-allowed"
      onClick={showCarousel}
    >
      Show Schedule Details
    </button>
  );
};

export default CarouselSwal;
