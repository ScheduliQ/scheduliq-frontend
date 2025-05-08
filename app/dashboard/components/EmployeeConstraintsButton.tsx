import Loading from "@/app/components/Loading";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

interface EmployeeConstraint {
  first_name: string;
  last_name: string;
  constraints: string;
}

const EmployeeConstraintsButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchConstraints = async () => {
    setIsLoading(true);

    try {
      // The Flask route is @constraints_api.route("/employees-constraints", methods=["GET"])
      // So the full endpoint should be:
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/constraints/employees-constraints`
      );

      if (!response.ok) {
        console.error(
          `Error response: ${response.status} ${response.statusText}`
        );

        // Show detailed error information for debugging
        const errorText = await response
          .text()
          .catch(() => "No error details available");
        console.error("Response body:", errorText);

        throw new Error(
          `Failed to fetch employee constraints: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Constraints data received:", data);
      return data;
    } catch (err) {
      console.error("Error fetching constraints:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSwal = async () => {
    // Show loading state
    // Swal.fire({
    //   title: "Loading employee constraints...",
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    <Loading />;

    try {
      const constraints = await fetchConstraints();

      if (!constraints || constraints.length === 0) {
        Swal.fire({
          title: "Employee Constraints",
          text: "No employee constraints found.",
          icon: "info",
          confirmButtonText: "OK",
          confirmButtonColor: "#4f46e5",
        });
        return;
      }

      // Create HTML content for constraints
      const constraintsHTML = constraints
        .map(
          (employee: EmployeeConstraint) => `
        <div class="border border-gray-200 rounded-lg p-4 mb-3 text-left hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
          <h3 class="font-medium text-gray-800 mb-2">${employee.first_name} ${
            employee.last_name
          }</h3>
          <p class="text-gray-600 whitespace-pre-wrap text-sm">
            ${employee.constraints || "No specific constraints provided."}
          </p>
        </div>
      `
        )
        .join("");

      Swal.fire({
        title: "Employee Constraints",
        html: `
          <div class="overflow-y-auto max-h-[60vh] px-1 py-3">
            ${constraintsHTML}
          </div>
        `,
        width: "42em",
        showConfirmButton: true,
        confirmButtonText: "Close",
        confirmButtonColor: "#4f46e5",
        customClass: {
          container: "employee-constraints-swal",
          popup: "rounded-xl",
          title: "text-xl font-semibold text-gray-800",
        },
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        html: `Could not load employee constraints.<br><span class="text-xs text-gray-500">Error details: ${
          error instanceof Error ? error.message : "Unknown error"
        }</span>`,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  return (
    <button
      onClick={handleOpenSwal}
      className="px-6 py-3 rounded-xl text-[#014DAE] font-medium bg-white border border-[#014DAE] transition-all duration-200 hover:bg-[#F0F5FF] hover:border-[#014DAE] hover:text-[#014DAE] active:bg-[#014DAE] active:text-white focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:ring-offset-2 disabled:bg-blue-100 disabled:text-blue-300 disabled:border-blue-100 disabled:cursor-not-allowed shadow-sm"
      aria-label="View employee constraints"
      disabled={isLoading}
    >
      <span>View Constraints</span>
    </button>
  );
};

export default EmployeeConstraintsButton;
