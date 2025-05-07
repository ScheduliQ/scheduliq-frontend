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
      ShowSwalAlert(
        "error",
        "No Schedule Generated. Please generate the schedule first."
      );
      return;
    }

    Swal.fire({
      title: "Schedule Details",
      html: `
        <div class="relative">
          <button id="close-button" class="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div id="carousel-content" class="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-base text-gray-700 leading-relaxed">
            ${pages[currentPageIndex]}
          </div>
          <div class="flex justify-center gap-3 mt-4">
            <button id="prev-button" class="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 shadow-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button id="next-button" class="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 shadow-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: true,
      customClass: {
        popup: "rounded-2xl shadow-xl border border-gray-100",
        title: "text-xl font-semibold text-gray-800 mb-4",
        htmlContainer: "text-base",
      },
      didOpen: () => {
        const popup = Swal.getPopup();
        const prevButton = popup?.querySelector("#prev-button");
        const nextButton = popup?.querySelector("#next-button");
        const closeButton = popup?.querySelector("#close-button");
        const contentDiv = popup?.querySelector("#carousel-content");

        if (prevButton && nextButton && contentDiv && closeButton) {
          prevButton.addEventListener("click", () => {
            currentPageIndex =
              (currentPageIndex - 1 + pages.length) % pages.length;
            contentDiv.innerHTML = pages[currentPageIndex];
          });
          nextButton.addEventListener("click", () => {
            currentPageIndex = (currentPageIndex + 1) % pages.length;
            contentDiv.innerHTML = pages[currentPageIndex];
          });
          closeButton.addEventListener("click", () => {
            Swal.close();
          });
        }
      },
    });
  };

  return (
    <button
      className="px-6 py-3 rounded-xl text-[#014DAE] font-medium bg-white border border-[#014DAE] transition-all duration-200 hover:bg-[#F0F5FF] hover:border-[#014DAE] hover:text-[#014DAE] active:bg-[#014DAE] active:text-white focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:ring-offset-2 disabled:bg-blue-100 disabled:text-blue-300 disabled:border-blue-100 disabled:cursor-not-allowed shadow-sm"
      onClick={showCarousel}
    >
      Show Schedule Details
    </button>
  );
};

export default CarouselSwal;
