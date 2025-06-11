"use client";
import { useEffect, useRef, useState } from "react";
import { useRole } from "../../../../hooks/RoleContext";
import ModernButton from "../../components/ModernButton";
import ModernCard from "../../components/ModernCard";
import SignupButton from "../../../components/SignUpButton";
import { GoTrash } from "react-icons/go";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import { initiateSocketConnection } from "@/hooks/socket";
import { Socket } from "socket.io-client"; // SOCKET: Import Socket type
import { ShowSwalAlert } from "@/app/dashboard/components/ShowSwalAlert";
import InfoButton from "../../components/InfoButton";

type ShiftType = {
  id: number;
  name: string;
  color: string;
};

type RoleType = {
  id: number;
  name: string;
  importance: number;
};

type RoleRequirement = {
  role: string;
  required: number;
};

type RolesPerShift = {
  [shiftName: string]: RoleRequirement[];
};

type Employee = {
  uid: string;
  name: string;
  roles: string[];
};

export default function ManagerSettingsPage() {
  // General Settings (max consecutive shifts; shifts per day is read-only and derived from shiftTypes)
  const [maxConsecutiveShifts, setMaxConsecutiveShifts] = useState(2);
  const [maxEmployees, setMaxEmployees] = useState(4);
  const [requiredShifts, setrequiredShifts] = useState(0);
  const { uid } = useRole();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [lastUpdateUID, setlastUpdateUID] = useState("");
  const [mounted, setMounted] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Define the options for days, hours, and minutes
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23
  const minutes = [0, 15, 30, 45]; // quarter-hour intervals

  // New state variables for Submission Start and End selections
  const [submissionStartDay, setSubmissionStartDay] =
    useState<string>("Sunday");
  const [submissionStartHour, setSubmissionStartHour] = useState<number>(2); // default start hour (e.g., 2 AM)
  const [submissionStartMinute, setSubmissionStartMinute] = useState<number>(0);

  const [submissionEndDay, setSubmissionEndDay] = useState<string>("Wednesday");
  const [submissionEndHour, setSubmissionEndHour] = useState<number>(23); // default end hour (e.g., 11 PM)
  const [submissionEndMinute, setSubmissionEndMinute] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    async function fetchSettings() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/manager-settings/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          // Update max consecutive shifts
          setMaxConsecutiveShifts(data.max_consecutive_shifts);
          setrequiredShifts(data.required_shifts);
          // Update max employees per shift from the document
          if (
            data.min_max_employees_per_shift &&
            data.min_max_employees_per_shift.max
          ) {
            setMaxEmployees(data.min_max_employees_per_shift.max);
          }
          // Update shift types: create an array from shift_names and assign colors
          const shiftNames: string[] = data.shift_names || [];
          const shiftColorsObj = data.shift_colors || {}; // optional field for UI colors
          const newShiftTypes: ShiftType[] = shiftNames.map((name, index) => ({
            id: index + 1,
            name,
            color:
              shiftColorsObj[name] ||
              colorOptions[index % colorOptions.length].value,
          }));
          setShiftTypes(newShiftTypes);
          setlastUpdateUID(data.uid);
          // Update role types: convert role_importance object to an array, converting importance to number
          const roleImportance = data.role_importance || {};
          const newRoleTypes: RoleType[] = Object.entries(roleImportance).map(
            ([role, importance], index) => ({
              id: index + 1,
              name: role,
              importance: Number(importance), // explicit conversion to number
            })
          );
          setRoleTypes(newRoleTypes);
          // Update roles per shift: convert roles_per_shift object to array format,
          // converting the required counts to numbers
          const rolesObj = data.roles_per_shift || {};
          const newRolesPerShift: RolesPerShift = {};
          for (const shiftName in rolesObj) {
            newRolesPerShift[shiftName] = Object.entries(
              rolesObj[shiftName]
            ).map(([role, required]) => ({
              role,
              required: Number(required), // explicit conversion to number
            }));
          }
          if (data.submissionStart) {
            const startDate = new Date(data.submissionStart); // This is in UTC
            // Convert to local time:
            // const localStart = new Date(
            //   startDate.getTime() - startDate.getTimezoneOffset() * 60000
            // );
            setSubmissionStartDay(daysOfWeek[startDate.getDay()]);
            setSubmissionStartHour(startDate.getHours());
            setSubmissionStartMinute(startDate.getMinutes());
          }
          if (data.submissionEnd) {
            const endDate = new Date(data.submissionEnd);
            // const localEnd = new Date(
            //   endDate.getTime() - endDate.getTimezoneOffset() * 60000
            // );
            setSubmissionEndDay(daysOfWeek[endDate.getDay()]);
            setSubmissionEndHour(endDate.getHours());
            setSubmissionEndMinute(endDate.getMinutes());
          }
          setRolesPerShift(newRolesPerShift);
          // Update work days
          setSelectedDays(data.work_days || weekDays);
          // setSubmissionStart(
          //   data.submissionStart ? new Date(data.submissionStart) : null
          // );
          // setSubmissionEnd(
          //   data.submissionEnd ? new Date(data.submissionEnd) : null
          // );
        } else {
          console.error("Failed to fetch settings:", res.status);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    }
    fetchSettings();
  }, []);
  useEffect(() => {
    if (!lastUpdateUID) return; // Only run if UID exists.
    async function fetchUserDetails() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/userdata/${lastUpdateUID}`
        );
        if (!res.ok) {
          throw new Error("Error fetching user data.");
        }
        const userdata = await res.json();

        if (userdata) {
          setfirstName(userdata.first_name);
          setlastName(userdata.last_name);
        }
      } catch (err: any) {
        // console.log(err.message);
      }
    }
    fetchUserDetails();
  }, [lastUpdateUID]); // This effect runs when `uid` changes
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/employees-management`
        );
        if (res.ok) {
          const data = await res.json();
          // Assuming API returns an object with { employees: Employee[] }
          setEmployees(data);
        } else {
          console.error("Failed to fetch employees:", res.status);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
    fetchEmployees();
  }, []);
  const colorOptions = [
    { name: "Blue", value: "#c5e9fa" },
    { name: "Light Green", value: "#c3e8db" },
    { name: "Lavender", value: "#d7d5e3" },
    { name: "Peach", value: "#f7dfd2" },
    { name: "Pink", value: "#f5e4f7" },
    { name: "Green", value: "#b6d6c3" },
    { name: "Yellow", value: "#fcf1d9" },
    { name: "Turquoise", value: "#daf5f5" },
    { name: "Purple", value: "#c4bacc" },
    { name: "Gray", value: "#E0E0E0" },
  ];

  // Shift Types (editable table with name and color)
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([
    { id: 1, name: "Morning", color: "#AEDFF7" },
    { id: 2, name: "Evening", color: "#AEDFF7" },
    { id: 3, name: "Night", color: "#AEDFF7" },
  ]);

  // Role Types (editable table)
  const [roleTypes, setRoleTypes] = useState<RoleType[]>([
    { id: 1, name: "manager", importance: 5 },
    { id: 2, name: "waiter", importance: 4 },
    { id: 3, name: "bartender", importance: 3 },
    { id: 4, name: "cleaner", importance: 2 },
  ]);

  // Roles per Shift: dynamically map shift type to an array of role requirements
  const [rolesPerShift, setRolesPerShift] = useState<RolesPerShift>({
    Morning: [
      { role: "manager", required: 1 },
      { role: "waiter", required: 2 },
    ],
    Evening: [
      { role: "manager", required: 1 },
      { role: "bartender", required: 1 },
    ],
    Night: [
      { role: "manager", required: 1 },
      { role: "cleaner", required: 1 },
    ],
  });
  const weekDaysOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Working Days state and list of all weekdays.
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [selectedDays, setSelectedDays] = useState<string[]>([...weekDays]);
  const [submissionStart, setSubmissionStart] = useState<Date | null>(null);
  const [submissionEnd, setSubmissionEnd] = useState<Date | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [updatedEmployeeUids, setUpdatedEmployeeUids] = useState<string[]>([]);

  // Handlers for Shift Types
  const addShiftType = () => {
    const newId =
      shiftTypes.length > 0
        ? Math.max(...shiftTypes.map((st) => st.id)) + 1
        : 1;
    setShiftTypes([...shiftTypes, { id: newId, name: "", color: "#000000" }]);
  };

  const updateShiftType = (id: number, field: keyof ShiftType, value: any) => {
    setShiftTypes(
      shiftTypes.map((st) => (st.id === id ? { ...st, [field]: value } : st))
    );
  };

  const deleteShiftType = (id: number) => {
    const toDelete = shiftTypes.find((st) => st.id === id);
    setShiftTypes(shiftTypes.filter((st) => st.id !== id));
    if (toDelete) {
      const updatedRoles = { ...rolesPerShift };
      delete updatedRoles[toDelete.name];
      setRolesPerShift(updatedRoles);
    }
  };

  // Handlers for Role Types
  const addRoleType = () => {
    const newId =
      roleTypes.length > 0 ? Math.max(...roleTypes.map((rt) => rt.id)) + 1 : 1;
    setRoleTypes([...roleTypes, { id: newId, name: "", importance: 1 }]);
  };

  const updateRoleType = (id: number, field: keyof RoleType, value: any) => {
    setRoleTypes(
      roleTypes.map((rt) => (rt.id === id ? { ...rt, [field]: value } : rt))
    );
  };

  const deleteRoleType = (id: number) => {
    setRoleTypes(roleTypes.filter((rt) => rt.id !== id));
  };

  // Handlers for Roles per Shift
  const addRoleRequirement = (shiftName: string) => {
    const current = rolesPerShift[shiftName] || [];
    setRolesPerShift({
      ...rolesPerShift,
      [shiftName]: [...current, { role: "", required: 1 }],
    });
  };

  const updateRoleRequirement = (
    shiftName: string,
    index: number,
    field: keyof RoleRequirement,
    value: any
  ) => {
    const current = rolesPerShift[shiftName];
    if (current) {
      current[index] = { ...current[index], [field]: value };
      setRolesPerShift({ ...rolesPerShift, [shiftName]: [...current] });
    }
  };

  const deleteRoleRequirement = (shiftName: string, index: number) => {
    const current = rolesPerShift[shiftName];
    if (current) {
      current.splice(index, 1);
      setRolesPerShift({ ...rolesPerShift, [shiftName]: [...current] });
    }
  };

  // Handlers for Working Days
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const updateEmployeeRoles = (uid: string, newRoles: string[]) => {
    setEmployees(
      employees.map((emp) =>
        emp.uid === uid ? { ...emp, roles: newRoles } : emp
      )
    );
    if (!updatedEmployeeUids.includes(uid)) {
      setUpdatedEmployeeUids([...updatedEmployeeUids, uid]);
    }
  };

  const deleteEmployee = async (uid: string) => {
    const result = await Swal.fire({
      title: "Delete Account",
      html: `
        <div class="mb-4">
          <p class="text-gray-600 mb-4">Are you sure you want to delete this account? This action is irreversible.</p>
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p class="text-md text-gray-500 mb-2">Please type <span class="font-medium text-gray-700">'Delete'</span> to confirm</p>
          </div>
        </div>
      `,
      input: "text",
      inputPlaceholder: "Type 'Delete' to confirm",
      inputAttributes: {
        autocapitalize: "off",
        class: "swal2-input focus:ring-blue-500 focus:border-blue-500",
      },
      showCancelButton: true,
      confirmButtonText: "Delete Account",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#4B5563",
      showLoaderOnConfirm: true,
      backdrop: `
        rgba(0,0,0,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `,
      customClass: {
        container: "font-sans",
        popup: "rounded-xl shadow-2xl border-0",
        title: "text-2xl font-semibold text-gray-800 border-b pb-4",
        htmlContainer: "text-base",
        input:
          "mt-2 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded-lg shadow-sm",
        actions: "border-t pt-4 gap-2",
        confirmButton:
          "rounded-lg px-6 py-2.5 font-medium text-sm transition-all duration-200 hover:bg-red-700",
        cancelButton:
          "rounded-lg px-6 py-2.5 font-medium text-sm transition-all duration-200 hover:bg-gray-600",
      },
      preConfirm: (inputValue) => {
        if (inputValue !== "Delete") {
          Swal.showValidationMessage(`
            <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
            Please type "Delete" exactly to confirm
          `);
          return false;
        }
        return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/delete/${uid}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(`
              <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
              Request failed: ${error}
            `);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      setEmployees(employees.filter((emp) => emp.uid !== uid));
      setUpdatedEmployeeUids(updatedEmployeeUids.filter((id) => id !== uid));
      ShowSwalAlert("success", "User has been deleted successfully");
    }
  };

  const addEmployeeRole = (uid: string, newRole: string) => {
    if (!newRole) return;
    setEmployees(
      employees.map((emp) => {
        if (emp.uid === uid && !emp.roles.includes(newRole)) {
          // Mark employee as updated if not already marked
          if (!updatedEmployeeUids.includes(uid)) {
            setUpdatedEmployeeUids([...updatedEmployeeUids, uid]);
          }
          return { ...emp, roles: [...emp.roles, newRole] };
        }
        return emp;
      })
    );
  };

  const removeEmployeeRole = (uid: string, roleToRemove: string) => {
    // Update the employees state
    setEmployees(
      employees.map((emp) => {
        if (emp.uid === uid) {
          return {
            ...emp,
            roles: emp.roles.filter((role) => role !== roleToRemove),
          };
        }
        return emp;
      })
    );
    // Mark the employee as updated if not already marked
    if (!updatedEmployeeUids.includes(uid)) {
      setUpdatedEmployeeUids([...updatedEmployeeUids, uid]);
    }
  };

  // Helper functions
  function getCurrentCycleOccurrence(
    dayName: string,
    hour: number,
    minute: number
  ): Date {
    const dayIndex = daysOfWeek.indexOf(dayName);
    if (dayIndex === -1) throw new Error("Invalid day name");

    const now = new Date();
    // Find the Sunday of the current week
    const sunday = new Date(now);
    sunday.setHours(0, 0, 0, 0);
    sunday.setDate(now.getDate() - now.getDay());

    // Compute the chosen day in this week by adding the day index to Sunday
    const candidate = new Date(sunday);
    candidate.setDate(sunday.getDate() + dayIndex);
    candidate.setHours(hour, minute, 0, 0);
    return candidate;
  }

  function toLocalISOString(date: Date): string {
    // Adjust the date by the local timezone offset
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - tzOffset);
    return localDate.toISOString().slice(0, 16);
  }
  function generateRandomVersion(length = 8): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  function convertRolesPerShift(rolesArray: RolesPerShift): {
    [shift: string]: { [role: string]: number };
  } {
    const result: { [shift: string]: { [role: string]: number } } = {};
    for (const shiftName in rolesArray) {
      result[shiftName] = {};
      rolesArray[shiftName].forEach(({ role, required }) => {
        if (role) {
          result[shiftName][role] = required;
        }
      });
    }
    return result;
  }

  function convertRoleTypes(roles: RoleType[]): { [role: string]: number } {
    const result: { [role: string]: number } = {};
    roles.forEach((role) => {
      if (role.name) result[role.name] = role.importance;
    });
    return result;
  }

  function getShiftColors(shiftTypes: ShiftType[]): {
    [shiftName: string]: string;
  } {
    // Create an object mapping each shift name to its chosen color.
    const colors: { [shiftName: string]: string } = {};
    shiftTypes.forEach((st) => {
      if (st.name) {
        colors[st.name] = st.color;
      }
    });
    return colors;
  }
  function sortDays(days: string[]): string[] {
    return days.sort(
      (a, b) => weekDaysOrder.indexOf(a) - weekDaysOrder.indexOf(b)
    );
  }
  async function saveSettings() {
    for (const st of shiftTypes) {
      const roles = rolesPerShift[st.name] || [];
      if (roles.length === 0) {
        // Swal.fire({
        //   title: "Invalid Settings",
        //   text: `Please add at least one role for the "${st.name}" shift.`,
        //   icon: "error",
        //   timer: 5000,
        //   showConfirmButton: false,
        //   width: "300px",
        //   position: "center",

        //   customClass: {
        //     popup: "rounded-lg shadow-md",
        //     title: "text-2xl font-sans font-semibold",
        //   },
        // });
        ShowSwalAlert(
          "error",
          `Please add at least one role for the "${st.name}" shift.`
        );
        return;
      }
      for (const req of roles) {
        if (!req.role || req.role.trim() === "") {
          // Swal.fire({
          //   title: "Invalid Settings",
          //   text: `Please fill in the role for one of the requirements in the "${st.name}" shift.`,
          //   icon: "error",
          //   timer: 2000,
          //   showConfirmButton: false,
          //   width: "300px",
          //   position: "center",
          //   customClass: {
          //     popup: "rounded-lg shadow-md",
          //     title: "text-2xl font-sans font-semibold",
          //   },
          // });
          ShowSwalAlert(
            "error",
            `Please fill in the role for one of the requirements in the "${st.name}" shift.`
          );
          return;
        }
      }
    }

    // Compute the full datetime for submission start and end
    const computedSubmissionStart = getCurrentCycleOccurrence(
      submissionStartDay,
      submissionStartHour,
      submissionStartMinute
      // true // isStart = true for start
    );
    const computedSubmissionEnd = getCurrentCycleOccurrence(
      submissionEndDay,
      submissionEndHour,
      submissionEndMinute
      // false // isStart = false for end
    );
    // Assume currentUserUid comes from your auth context
    const currentUserUid = uid; // Replace with your actual UID
    const newVersion = generateRandomVersion();
    const payload = {
      uid: currentUserUid,
      shifts_per_day: shiftTypes.length, // computed from shiftTypes
      shift_names: shiftTypes.map((st) => st.name),
      shift_colors: getShiftColors(shiftTypes), // extra field for UI
      roles_per_shift: convertRolesPerShift(rolesPerShift),
      max_consecutive_shifts: maxConsecutiveShifts,
      role_importance: convertRoleTypes(roleTypes),
      work_days: sortDays(selectedDays),
      min_max_employees_per_shift: { min: 2, max: maxEmployees },
      required_shifts: requiredShifts,
      activeVersion: newVersion,
      submissionStart: computedSubmissionStart.toISOString(),
      submissionEnd: computedSubmissionEnd.toISOString(),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/manager-settings/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        if (updatedEmployeeUids.length > 0) {
          const updatedEmployeePayload = employees
            .filter((emp) => updatedEmployeeUids.includes(emp.uid))
            .map((emp) => ({
              uid: emp.uid,
              roles: emp.roles,
            }));

          try {
            const empUpdateRes = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/user/employees-management`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ employees: updatedEmployeePayload }),
              }
            );

            if (empUpdateRes.ok) {
              setUpdatedEmployeeUids([]);
            } else {
              console.error("Employee update failed:", empUpdateRes.status);
            }
          } catch (error) {
            console.error("Error updating employees:", error);
          }
        }
        const data = await res.json();
        const socket = initiateSocketConnection();
        socketRef.current = socket;
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: socketRef.current?.id,
              message: "Manager settings have been updated",
              data: `${firstName} ${lastName} updated the settings.`,
            }),
          }
        );
        // Swal.fire({
        //   title: "Settings saved!",
        //   timer: 2000,
        //   showConfirmButton: false,
        //   width: "300px",
        //   position: "top",
        //   background: "#f0f9ff",
        //   iconColor: "#014DAE",
        //   customClass: {
        //     popup: "rounded-lg shadow-md",
        //     title: "text-2xl font-sans font-semibold text-blue-700",
        //   },
        // });
        ShowSwalAlert("success", `Settings saved successfully!`);
      } else {
        // Swal.fire({
        //   title: "Failed to save settings",
        //   text: "",
        //   confirmButtonText: "OK",
        //   timer: 3000,
        //   showConfirmButton: false,
        //   position: "top",
        //   width: "300px",
        //   background: "#fee2e2",
        //   iconColor: "#dc2626",
        //   customClass: {
        //     popup: "rounded-lg shadow-md",
        //     title: "text-2xl font-sans font-semibold text-red-700",
        //     htmlContainer: "font-sans text-gray-700",
        //   },
        // });
        ShowSwalAlert("error", `Failed to save settings!`);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }

  if (!mounted) {
    return <Loading />;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-[#f0f7ff] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Manager Settings
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Last updated by {firstName} {lastName}
        </p>
      </div>

      {/* General Settings Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">General Settings</h2>
          <InfoButton infoText="Configure basic scheduling parameters like maximum consecutive shifts, required shifts per employee, and submission time windows for shift preferences." />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Shifts per Day:
              </label>
              <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium">
                {shiftTypes.length}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Consecutive Shifts:
              </label>
              <input
                type="number"
                value={maxConsecutiveShifts}
                onChange={(e) =>
                  setMaxConsecutiveShifts(Number(e.target.value))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Minimum Required Shifts:
              </label>
              <input
                type="number"
                value={requiredShifts}
                onChange={(e) => setrequiredShifts(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Employees per Shift:
              </label>
              <input
                type="number"
                value={maxEmployees}
                onChange={(e) => setMaxEmployees(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* Submission Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                Submission Start Time
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-auto overflow-x-auto">
                  <select
                    value={submissionStartDay}
                    onChange={(e) => setSubmissionStartDay(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-700 bg-white transition-all duration-200 w-full"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center w-full sm:w-auto">
                  <select
                    value={submissionStartHour}
                    onChange={(e) =>
                      setSubmissionStartHour(Number(e.target.value))
                    }
                    className="w-24 min-w-[6rem] px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-700 bg-white transition-all duration-200"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-500 px-1">:</span>
                  <select
                    value={submissionStartMinute}
                    onChange={(e) =>
                      setSubmissionStartMinute(Number(e.target.value))
                    }
                    className="w-24 min-w-[6rem] px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-700 bg-white transition-all duration-200"
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                Submission End Time
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-auto overflow-x-auto">
                  <select
                    value={submissionEndDay}
                    onChange={(e) => setSubmissionEndDay(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-700 bg-white transition-all duration-200 w-full"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center w-full sm:w-auto">
                  <select
                    value={submissionEndHour}
                    onChange={(e) =>
                      setSubmissionEndHour(Number(e.target.value))
                    }
                    className="w-24 min-w-[6rem] px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-700 bg-white transition-all duration-200"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-500 px-1">:</span>
                  <select
                    value={submissionEndMinute}
                    onChange={(e) =>
                      setSubmissionEndMinute(Number(e.target.value))
                    }
                    className="w-24 min-w-[6rem] px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-700 bg-white transition-all duration-200"
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Working Days Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Working Days</h2>
          <InfoButton infoText="Select which days of the week your business operates. These are the only days that shifts can be scheduled on." />
        </div>
        <div className="p-6">
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800 font-medium">
              Working days:{" "}
              {selectedDays.length ? selectedDays.join(", ") : "None"}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 text-blue-700 font-medium border-b border-gray-200">
              Select Working Days
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white">
              {weekDays.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={() => toggleDay(day)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shift Types Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Shift Types</h2>
          <InfoButton infoText="Define different types of shifts (e.g., Morning, Evening, Night) and assign them distinct colors for easy visual identification in the schedule." />
        </div>
        <div className="p-6">
          <div
            className="overflow-x-auto"
            style={{ minWidth: "100%", WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full table-fixed divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-1/2 md:w-2/5">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-2/5">
                    Color
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-1/10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shiftTypes.map((shift) => (
                  <tr
                    key={shift.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={shift.name}
                        onChange={(e) =>
                          updateShiftType(shift.id, "name", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-sm transition-all duration-200"
                        placeholder="Shift name"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div
                          style={{ backgroundColor: shift.color }}
                          className="w-6 h-6 rounded-md shadow-inner border border-gray-200 flex-shrink-0"
                        ></div>
                        <select
                          value={shift.color}
                          onChange={(e) =>
                            updateShiftType(shift.id, "color", e.target.value)
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block shadow-sm text-sm w-full transition-all duration-200 text-ellipsis whitespace-nowrap"
                        >
                          {colorOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteShiftType(shift.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                        title="Delete shift type"
                      >
                        <GoTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={addShiftType}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Add Shift Type
          </button>
        </div>
      </div>

      {/* Role Types Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Role Types</h2>
          <InfoButton infoText="Create and manage different job roles in your organization. Assign importance levels to each role to help with shift scheduling prioritization." />
        </div>
        <div className="p-6">
          <div
            className="overflow-x-auto"
            style={{ minWidth: "100%", WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full table-fixed divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-3/5">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-1/4">
                    Importance
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-1/10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roleTypes.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={role.name}
                        onChange={(e) =>
                          updateRoleType(role.id, "name", e.target.value)
                        }
                        placeholder="Role name"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-sm transition-all duration-200"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={role.importance}
                        onChange={(e) =>
                          updateRoleType(
                            role.id,
                            "importance",
                            Number(e.target.value)
                          )
                        }
                        min="1"
                        max="10"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-sm transition-all duration-200"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteRoleType(role.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                        title="Delete role type"
                      >
                        <GoTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={addRoleType}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Add Role Type
          </button>
        </div>
      </div>

      {/* Roles per Shift Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Roles per Shift</h2>
          <InfoButton infoText="Specify which roles are required for each shift type and how many employees with each role are needed. This ensures proper staffing for every shift." />
        </div>
        <div className="p-6 space-y-6">
          {shiftTypes.map((shift) => (
            <div
              key={shift.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md"
            >
              <div
                className="px-4 py-3 border-b border-gray-200"
                style={{ backgroundColor: shift.color + "40" }} // Add transparency to the color
              >
                <h3 className="text-base font-medium text-gray-800 flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: shift.color }}
                  ></div>
                  {shift.name || "Unnamed Shift"} Roles
                </h3>
              </div>
              <div className="p-4">
                <div
                  className="overflow-x-auto"
                  style={{ minWidth: "100%", WebkitOverflowScrolling: "touch" }}
                >
                  <table className="w-full table-fixed divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-2/5"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-2/5"
                        >
                          Required Workers
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-1/5"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(rolesPerShift[shift.name] || []).map((req, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <select
                              value={req.role}
                              onChange={(e) =>
                                updateRoleRequirement(
                                  shift.name,
                                  idx,
                                  "role",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-sm transition-all duration-200 text-ellipsis"
                            >
                              <option value="">Select Role</option>
                              {roleTypes.map((role) => (
                                <option key={role.id} value={role.name}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={req.required}
                              min="1"
                              onChange={(e) =>
                                updateRoleRequirement(
                                  shift.name,
                                  idx,
                                  "required",
                                  Number(e.target.value)
                                )
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-sm transition-all duration-200"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() =>
                                deleteRoleRequirement(shift.name, idx)
                              }
                              className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                              title="Delete requirement"
                            >
                              <GoTrash className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(rolesPerShift[shift.name] || []).length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-3 text-center text-sm text-gray-500"
                          >
                            No roles assigned to this shift
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => addRoleRequirement(shift.name)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Add Role Requirement
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Employee Management Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            Employee Management
          </h2>
          <InfoButton infoText="Manage your employees and their assigned roles. Add or remove roles for each employee and control who can work which shifts based on their qualifications." />
        </div>
        <div className="p-6">
          <div
            className="overflow-x-auto"
            style={{ minWidth: "100%", WebkitOverflowScrolling: "touch" }}
          >
            <div
              style={{ maxHeight: "400px", overflowY: "auto" }}
              className="border border-gray-200 rounded-lg shadow-sm"
            >
              <table className="w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-1/4">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-3/5">
                      Roles
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-1/10">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr
                        key={emp.uid}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {emp.name}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  addEmployeeRole(emp.uid, e.target.value);
                                  e.target.selectedIndex = 0;
                                }
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm w-full md:w-auto transition-all duration-200 text-ellipsis"
                            >
                              <option value="">Add Role</option>
                              {roleTypes
                                .filter((rt) => !emp.roles.includes(rt.name))
                                .map((rt) => (
                                  <option key={rt.id} value={rt.name}>
                                    {rt.name}
                                  </option>
                                ))}
                            </select>

                            <div className="flex flex-wrap gap-2">
                              {emp.roles.length === 0 ? (
                                <span className="text-sm text-gray-500 italic">
                                  No roles assigned
                                </span>
                              ) : (
                                emp.roles.map((role, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                                  >
                                    <span>{role}</span>
                                    <button
                                      onClick={() =>
                                        removeEmployeeRole(emp.uid, role)
                                      }
                                      className="ml-2 text-blue-400 hover:text-blue-600 transition-colors"
                                      aria-label={`Remove ${role} role`}
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => deleteEmployee(emp.uid)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                            title="Remove employee"
                          >
                            <GoTrash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4">
            <SignupButton />
          </div>
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="text-center mt-8 mb-10">
        <button
          onClick={saveSettings}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-95"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
