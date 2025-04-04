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
        console.log(err.message);
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
    { name: "Blue", value: "#AEDFF7" },
    { name: "Light Green", value: "#B5EAD7" },
    { name: "Lavender", value: "#C9C6E3" },
    { name: "Peach", value: "#FAD4C0" },
    { name: "Pink", value: "#F7CAC9" },
    { name: "Green", value: "#A8D5BA" },
    { name: "Yellow", value: "#FCECC9" },
    { name: "Turquoise", value: "#D1F0F0" },
    { name: "Purple", value: "#D5C6E0" },
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

  const deleteEmployee = (uid: string) => {
    setEmployees(employees.filter((emp) => emp.uid !== uid));
    setUpdatedEmployeeUids(updatedEmployeeUids.filter((id) => id !== uid));
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
        Swal.fire({
          title: "Invalid Settings",
          text: `Please add at least one role for the "${st.name}" shift.`,
          icon: "error",
          timer: 5000,
          showConfirmButton: false,
          width: "300px",
          position: "center",

          customClass: {
            popup: "rounded-lg shadow-md",
            title: "text-2xl font-sans font-semibold",
          },
        });
        return;
      }
      for (const req of roles) {
        if (!req.role || req.role.trim() === "") {
          Swal.fire({
            title: "Invalid Settings",
            text: `Please fill in the role for one of the requirements in the "${st.name}" shift.`,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            width: "300px",
            position: "center",
            customClass: {
              popup: "rounded-lg shadow-md",
              title: "text-2xl font-sans font-semibold",
            },
          });
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
          // Build a payload with the updated employees (each containing uid and roles)
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
                method: "PUT", // Or PATCH, depending on your backend implementation
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ employees: updatedEmployeePayload }),
              }
            );

            if (empUpdateRes.ok) {
              // If the update is successful, clear the tracking state.
              setUpdatedEmployeeUids([]);
            } else {
              console.error("Employee update failed:", empUpdateRes.status);
            }
          } catch (error) {
            console.error("Error updating employees:", error);
          }
        }
        const data = await res.json();
        const socket = initiateSocketConnection(); // SOCKET: Initiate connection
        socketRef.current = socket;
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: socketRef.current?.id,
              message: "Manager settings have been updated123123",
              data: `${firstName} ${lastName} updated the settings.`,
            }),
          }
        );
        Swal.fire({
          title: "Settings saved!",
          timer: 2000,
          showConfirmButton: false,
          width: "300px",
          position: "top",
          background: "#f0f9ff",
          iconColor: "#014DAE",
          customClass: {
            popup: "rounded-lg shadow-md",
            title: "text-2xl font-sans font-semibold text-blue-700",
          },
        });
      } else {
        Swal.fire({
          title: "Failed to save settings",
          text: "",
          confirmButtonText: "OK",
          timer: 3000,
          showConfirmButton: false,
          position: "top",
          width: "300px",
          background: "#fee2e2",
          iconColor: "#dc2626",
          customClass: {
            popup: "rounded-lg shadow-md",
            title: "text-2xl font-sans font-semibold text-red-700",
            htmlContainer: "font-sans text-gray-700",
          },
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }

  if (!mounted) {
    // עד שהקומפוננט עולה, מציגים תחליף או פשוט null
    return <Loading />;
  }
  return (
    <div className="p-6 w-[70%] mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-3 text-center">Manager Settings</h1>
      <p className="text-sm text-gray-500 text-center mt-1 mb-2">
        Last updated by {firstName} {lastName}
      </p>
      <ModernCard title="General Settings" className="mb-8">
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Shifts per Day:</label>
            <div className="p-2 border rounded bg-white">
              {shiftTypes.length}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Max Consecutive Shifts:</label>
            <input
              type="number"
              value={maxConsecutiveShifts}
              onChange={(e) => setMaxConsecutiveShifts(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Minimum required shifts:</label>
            <input
              type="number"
              value={requiredShifts}
              onChange={(e) => setrequiredShifts(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Max Employees per Shift:</label>
            <input
              type="number"
              value={maxEmployees}
              onChange={(e) => setMaxEmployees(Number(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
          {/* ////////////////////////////////////////////////////////////////// */}
          {/* Submission Start Selection */}
          <div className="flex flex-col mb-4">
            <label className="mb-1 font-medium">Submission Start:</label>
            <div className="flex items-center space-x-2">
              <select
                value={submissionStartDay}
                onChange={(e) => setSubmissionStartDay(e.target.value)}
                className="border p-2 rounded"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                value={submissionStartHour}
                onChange={(e) => setSubmissionStartHour(Number(e.target.value))}
                className="border p-2 rounded"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                value={submissionStartMinute}
                onChange={(e) =>
                  setSubmissionStartMinute(Number(e.target.value))
                }
                className="border p-2 rounded"
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submission End Selection */}
          <div className="flex flex-col mb-4">
            <label className="mb-1 font-medium">Submission End:</label>
            <div className="flex items-center space-x-2">
              <select
                value={submissionEndDay}
                onChange={(e) => setSubmissionEndDay(e.target.value)}
                className="border p-2 rounded"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                value={submissionEndHour}
                onChange={(e) => setSubmissionEndHour(Number(e.target.value))}
                className="border p-2 rounded"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                value={submissionEndMinute}
                onChange={(e) => setSubmissionEndMinute(Number(e.target.value))}
                className="border p-2 rounded"
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* <div className="flex flex-col mb-4">
            <label className="mb-1 font-medium">Submission Start:</label>
            <input
              type="datetime-local"
              value={submissionStart ? toLocalISOString(submissionStart) : ""}
              onChange={(e) => setSubmissionStart(new Date(e.target.value))}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-1 font-medium">Submission End:</label>
            <input
              type="datetime-local"
              value={submissionEnd ? toLocalISOString(submissionEnd) : ""}
              onChange={(e) => setSubmissionEnd(new Date(e.target.value))}
              className="border p-2 rounded"
            />
          </div> */}
          {/* ////////////////////////////////////////////////////////////////// */}
        </div>
      </ModernCard>

      {/* Working Days Section */}
      <ModernCard title="Working Days" className="mb-8">
        <p className="mb-4 text-sm text-gray-700">
          Selected: {selectedDays.length ? selectedDays.join(", ") : "None"}
        </p>
        <details className="border rounded">
          <summary className="p-2 bg-gray-500 text-white cursor-pointer">
            Select Working Days
          </summary>
          <div className="p-4 grid grid-cols-2 gap-2">
            {weekDays.map((day) => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => toggleDay(day)}
                  className="form-checkbox"
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </details>
      </ModernCard>

      {/* Shift Types */}
      <ModernCard title="Shift Types" className="mb-8">
        <table className="w-full bg-white border mt-2 rounded shadow mb-4">
          <thead>
            <tr className="bg-gray-500 text-white">
              <th className="border p-3">Name</th>
              <th className="border p-3">Color</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shiftTypes.map((shift) => (
              <tr key={shift.id} className="text-center">
                <td className="border p-2">
                  <input
                    type="text"
                    value={shift.name}
                    onChange={(e) =>
                      updateShiftType(shift.id, "name", e.target.value)
                    }
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border p-2">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      style={{ backgroundColor: shift.color }}
                      className="w-6 h-6 border rounded"
                    ></div>
                    <select
                      value={shift.color}
                      onChange={(e) =>
                        updateShiftType(shift.id, "color", e.target.value)
                      }
                      className="border p-1 rounded"
                    >
                      {colorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteShiftType(shift.id)}
                    className="text-red-500 font-medium"
                  >
                    <GoTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ModernButton color={"#3b4fbf"} onClick={addShiftType}>
          Add Shift Type
        </ModernButton>
      </ModernCard>

      {/* Role Types */}
      <ModernCard title="Role Types" className="mb-8">
        <table className="w-full bg-white border mt-2 mb-4 shadow">
          <thead>
            <tr className="bg-gray-500 text-white">
              <th className="border p-3">Name</th>
              <th className="border p-3">Importance</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roleTypes.map((role) => (
              <tr key={role.id} className="text-center">
                <td className="border p-2">
                  <input
                    type="text"
                    value={role.name}
                    onChange={(e) =>
                      updateRoleType(role.id, "name", e.target.value)
                    }
                    className="border p-1  w-full"
                  />
                </td>
                <td className="border p-2">
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
                    className="border p-1  w-full"
                  />
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteRoleType(role.id)}
                    className="text-red-500 font-medium"
                  >
                    <GoTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ModernButton onClick={addRoleType} color={"#3b4fbf"}>
          Add Role Type
        </ModernButton>
      </ModernCard>

      {/* Roles per Shift */}
      <ModernCard title="Roles per Shift" className="mb-8">
        {shiftTypes.map((shift) => (
          <div key={shift.id} className="border p-4 mb-6 ">
            <h3 className="text-xl font-bold mb-3">{shift.name} Roles</h3>
            <table className="w-full bg-white border mt-2  shadow">
              <thead>
                <tr className="bg-gray-500 text-white">
                  <th className="border p-3">Role</th>
                  <th className="border p-3">Required Workers</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(rolesPerShift[shift.name] || []).map((req, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border p-2">
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
                        className="border p-1  w-full"
                      >
                        <option value="">Select Role</option>
                        {roleTypes.map((role) => (
                          <option key={role.id} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={req.required}
                        onChange={(e) =>
                          updateRoleRequirement(
                            shift.name,
                            idx,
                            "required",
                            Number(e.target.value)
                          )
                        }
                        className="border p-1  w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => deleteRoleRequirement(shift.name, idx)}
                        className="text-red-500 font-medium"
                      >
                        <GoTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => addRoleRequirement(shift.name)}
              className="mt-4 bg-blue-600 text-white px-4 py-2  hover:bg-blue-700"
            >
              Add Role Requirement
            </button>
          </div>
        ))}
      </ModernCard>

      {/* Employee Management Section */}
      <ModernCard title="Employee Management" className="mb-8">
        <table className="w-full table-fixed bg-white border mt-2 mb-4 rounded shadow">
          <thead>
            <tr className="bg-gray-500 text-white">
              <th className="border p-3 w-[20%]">Name</th>
              <th className="border p-3 w-[60%]">Roles</th>
              <th className="border p-3 w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.uid} className="text-center">
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2 whitespace-normal">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div>
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          addEmployeeRole(emp.uid, e.target.value);
                          e.target.selectedIndex = 0;
                        }}
                        className="border p-1 rounded"
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
                    </div>
                    {emp.roles.map((role, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        <span>{role}</span>
                        <button
                          onClick={() => removeEmployeeRole(emp.uid, role)}
                          className="ml-1 text-red-500"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteEmployee(emp.uid)}
                    className="text-red-500 font-medium"
                  >
                    <GoTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <SignupButton />
      </ModernCard>

      {/* Save Settings Button */}
      <div className="text-center">
        <ModernButton onClick={saveSettings}>Save Settings</ModernButton>
      </div>
    </div>
  );
}
