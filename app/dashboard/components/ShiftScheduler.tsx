import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaCheck } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";
import { useRef } from "react";

interface Employee {
  id: string;
  name: string;
  role: string;
  hours: string;
}

interface Shift {
  id: string;
  time: string;
  employees: Employee[];
  shortages?: { [role: string]: number };
}

interface Day {
  id: string;
  name: string;
  shifts: Shift[];
}
interface ManagerSettings {
  work_days: string[];
  shift_names: string[];
}
interface EmployeeDropdown {
  id: string;
  first_name: string;
  last_name: string;
  jobs: string[]; // מערך של תפקידים (מחרוזות)
}

const basicSchedule = [
  {
    id: "d0",
    name: "Sunday",
    shifts: [
      {
        id: "s0",
        time: "Morning",
        employees: [
          {
            id: "e0_s0",
            name: "Employee 1",
            role: "Role",
            hours: "8",
          },
        ],
      },
      {
        id: "s1",
        time: "Evening",
        employees: [],
      },
      {
        id: "s2",
        time: "Night",
        employees: [],
      },
    ],
  },
  {
    id: "d1",
    name: "Monday",
    shifts: [
      {
        id: "s3",
        time: "Morning",
        employees: [],
      },
      {
        id: "s4",
        time: "Evening",
        employees: [
          {
            id: "e0_s4",
            name: "Employee 2",
            role: "Role",
            hours: "8",
          },
        ],
      },
      {
        id: "s5",
        time: "Night",
        employees: [],
      },
    ],
  },
  {
    id: "d2",
    name: "Tuesday",
    shifts: [
      {
        id: "s6",
        time: "Morning",
        employees: [],
      },
      {
        id: "s7",
        time: "Evening",
        employees: [],
      },
      {
        id: "s8",
        time: "Night",
        employees: [
          {
            id: "e0_s8",
            name: "Employee 3",
            role: "Role",
            hours: "8",
          },
        ],
      },
    ],
  },
  {
    id: "d3",
    name: "Wednesday",
    shifts: [
      {
        id: "s9",
        time: "Morning",
        employees: [
          {
            id: "e0_s9",
            name: "Employee 4",
            role: "Role",
            hours: "8",
          },
        ],
      },
      {
        id: "s10",
        time: "Evening",
        employees: [],
      },
      {
        id: "s11",
        time: "Night",
        employees: [],
      },
    ],
  },
  {
    id: "d4",
    name: "Thursday",
    shifts: [
      {
        id: "s12",
        time: "Morning",
        employees: [],
      },
      {
        id: "s13",
        time: "Evening",
        employees: [
          {
            id: "e0_s13",
            name: "Employee 5",
            role: "Role",
            hours: "8",
          },
        ],
      },
      {
        id: "s14",
        time: "Night",
        employees: [],
      },
    ],
  },
  {
    id: "d5",
    name: "Friday",
    shifts: [
      {
        id: "s15",
        time: "Morning",
        employees: [],
      },
      {
        id: "s16",
        time: "Evening",
        employees: [],
      },
      {
        id: "s17",
        time: "Night",
        employees: [
          {
            id: "e0_s17",
            name: "Employee 6",
            role: "Role",
            hours: "8",
          },
        ],
      },
    ],
  },
  {
    id: "d6",
    name: "Saturday",
    shifts: [
      {
        id: "s18",
        time: "Morning",
        employees: [
          {
            id: "e0_s18",
            name: "Employee 7",
            role: "Role",
            hours: "8",
          },
        ],
      },
      {
        id: "s19",
        time: "Evening",
        employees: [],
      },
      {
        id: "s20",
        time: "Night",
        employees: [],
      },
    ],
  },
];
const ShiftScheduler = ({
  scheduleData,
  publishDays,
  setPublishDays,
}: {
  scheduleData: Day[] | null;
  publishDays: Day[];
  setPublishDays: React.Dispatch<React.SetStateAction<Day[]>>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [days, setDays] = useState<Day[]>(basicSchedule);
  const [employeeDropdown, setEmployeeDropdown] = useState<EmployeeDropdown[]>(
    []
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [availableJobs, setAvailableJobs] = useState<string[]>([]);
  const [editingAvailableJobs, setEditingAvailableJobs] = useState<string[]>(
    []
  );
  const [managerSettings, setManagerSettings] =
    useState<ManagerSettings | null>(null);

  useEffect(() => {
    if (scheduleData) {
      setDays(scheduleData);
    }
  }, [scheduleData]);

  useEffect(() => {
    if (days) {
      setPublishDays(days);
    }
  }, [days]);

  // Generates a basic schedule using manager settings
  const generateBasicSchedule = (settings: {
    work_days: string[];
    shift_names: string[];
  }) => {
    return settings.work_days.map((day, dayIndex) => ({
      id: `d${dayIndex}`,
      name: day,
      shifts: settings.shift_names.map((shift, shiftIndex) => ({
        id: `s${dayIndex * settings.shift_names.length + shiftIndex}`,
        time: shift,
        employees: [], // Start with an empty list for employees
      })),
    }));
  };

  // Fetch the manager settings from your API
  useEffect(() => {
    const fetchManagerSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/manager-settings/`
        );
        if (!response.ok) throw new Error("Failed to fetch manager settings");
        const settings = await response.json();
        setManagerSettings(settings);
      } catch (error) {
        console.error("Error fetching manager settings:", error);
      }
    };
    fetchManagerSettings();
  }, []);

  // Generate basic schedule using manager settings
  useEffect(() => {
    if (scheduleData) {
      setDays(scheduleData);
    } else if (managerSettings) {
      const basicSchedule = generateBasicSchedule(managerSettings);
      setDays(basicSchedule);
    }
  }, [managerSettings, scheduleData]);

  // useEffect לשליפת העובדים מה־API (/employees)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/employees`
        );
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        // וודא שלכל עובד יש מזהה ייחודי
        const employeesWithId = data.map((emp: any, index: number) => ({
          id: emp._id ? emp._id : `${emp.first_name}-${emp.last_name}-${index}`,
          ...emp,
        }));
        setEmployeeDropdown(employeesWithId);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // עדכון availableJobs עבור הוספת עובד כאשר נבחר עובד
  useEffect(() => {
    if (selectedEmployeeId) {
      const emp = employeeDropdown.find((emp) => emp.id === selectedEmployeeId);
      if (emp) {
        setAvailableJobs(emp.jobs || []);
        setNewEmployee((prev) => ({
          ...prev,
          name: `${emp.first_name} ${emp.last_name}`,
          role: "", // איפוס בחירת התפקיד
        }));
      } else {
        setAvailableJobs([]);
      }
    } else {
      setAvailableJobs([]);
      setNewEmployee((prev) => ({ ...prev, role: "" }));
    }
  }, [selectedEmployeeId, employeeDropdown]);

  const [selectedShift, setSelectedShift] = useState<{
    dayId: string;
    shiftId: string;
  } | null>(null);

  const [newEmployee, setNewEmployee] = useState<{
    id: string;
    name: string;
    role: string;
    hours: string;
  }>({ id: "", name: "", role: "", hours: "" });

  const [editingEmployee, setEditingEmployee] = useState<{
    dayId: string;
    shiftId: string;
    employeeId: string;
    employeeData: Employee;
  } | null>(null);

  useEffect(() => {
    if (editingEmployee) {
      const emp = employeeDropdown.find(
        (emp) => emp.id === editingEmployee.employeeData.id
      );
      if (emp) {
        setEditingAvailableJobs(emp.jobs || []);
      } else {
        setEditingAvailableJobs([]);
      }
    }
  }, [editingEmployee, employeeDropdown]);

  const handleEditEmployee = (
    dayId: string,
    shiftId: string,
    employeeId: string
  ) => {
    const day = days.find((d) => d.id === dayId);
    if (!day) return;

    const shift = day.shifts.find((s) => s.id === shiftId);
    if (!shift) return;

    const employee = shift.employees.find((e) => e.id === employeeId);
    if (!employee) return;

    setEditingEmployee({
      dayId,
      shiftId,
      employeeId,
      employeeData: { ...employee },
    });
  };

  const handleSaveEditedEmployee = () => {
    if (!editingEmployee) return;

    const { dayId, shiftId, employeeId, employeeData } = editingEmployee;

    const newDays = days.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          shifts: day.shifts.map((shift) => {
            if (shift.id === shiftId) {
              return {
                ...shift,
                employees: shift.employees.map((employee) =>
                  employee.id === employeeId ? employeeData : employee
                ),
              };
            }
            return shift;
          }),
        };
      }
      return day;
    });

    setDays(newDays);
    setEditingEmployee(null);
  };
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }
    const sourceDayIndex = days.findIndex((day) =>
      day.shifts.some((shift) => shift.id === result.source.droppableId)
    );
    const destDayIndex = days.findIndex((day) =>
      day.shifts.some((shift) => shift.id === result.destination.droppableId)
    );

    if (sourceDayIndex === -1 || destDayIndex === -1) return;

    const sourceShiftIndex = days[sourceDayIndex].shifts.findIndex(
      (s) => s.id === result.source.droppableId
    );
    const destShiftIndex = days[destDayIndex].shifts.findIndex(
      (s) => s.id === result.destination.droppableId
    );

    const newDays = [...days];
    const [movedEmployee] = newDays[sourceDayIndex].shifts[
      sourceShiftIndex
    ].employees.splice(result.source.index, 1);
    newDays[destDayIndex].shifts[destShiftIndex].employees.splice(
      result.destination.index,
      0,
      movedEmployee
    );

    setDays(newDays);
  };

  const handleDeleteEmployee = (
    dayId: string,
    shiftId: string,
    employeeId: string
  ) => {
    const newDays = days.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          shifts: day.shifts.map((shift) => {
            if (shift.id === shiftId) {
              return {
                ...shift,
                employees: shift.employees.filter(
                  (emp) => emp.id !== employeeId
                ),
              };
            }
            return shift;
          }),
        };
      }
      return day;
    });

    setDays(newDays);
  };

  const handleAddEmployee = (dayId: string, shiftId: string) => {
    setSelectedShift({ dayId, shiftId });
  };

  const handleSaveEmployee = () => {
    if (!selectedShift) return;

    const { dayId, shiftId } = selectedShift;

    const employeeWithId = {
      ...newEmployee,
      id: uuidv4(),
    };

    const newDays = days.map((day) => {
      if (day.id === dayId) {
        return {
          ...day,
          shifts: day.shifts.map((shift) => {
            if (shift.id === shiftId) {
              return {
                ...shift,
                employees: [...shift.employees, employeeWithId],
              };
            }
            return shift;
          }),
        };
      }
      return day;
    });

    setDays(newDays);
    setSelectedShift(null);
    setNewEmployee({ id: "", name: "", role: "", hours: "" });
  };

  const getDraggableStyle = (isDragging: boolean, draggableStyle: any) => ({
    ...draggableStyle,
    userSelect: "none",
    background: isDragging ? "rgba(147, 197, 253, 0.5)" : "white",
    transform: isDragging
      ? `${draggableStyle.transform} translate(-50%, -50%)`
      : draggableStyle.transform,
    position: "relative",
    top: "auto",
    left: "auto",
    zIndex: isDragging ? 1000 : 1,
  });

  return (
    <div
      className={`p-4 ${
        isEditing ? "border-2 border-dashed border-blue-700 rounded-3xl" : ""
      }`}
    >
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Shift Schedule</h1>
        {isEditing && (
          <div className="text-center text-blue-500 font-semibold mb-4">
            ✎ You are in edit mode. Drag and drop to rearrange shifts.
          </div>
        )}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isEditing ? "Done ✔" : "Edit ✎"}
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-w-[calc(200px*7+1.5rem*6)] mx-auto">
            {days.map((day) => (
              <div key={day.id} className="bg-gray-50 p-2 rounded-lg shadow-sm">
                <h3 className="text-center font-semibold mb-2 text-gray-700">
                  {day.name}
                </h3>
                {day.shifts.map((shift) => (
                  <Droppable key={shift.id} droppableId={shift.id}>
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-white p-2 rounded mb-2 shadow-sm min-h-[150px] ${
                          snapshot.isDraggingOver
                            ? "bg-blue-50 border-2 border-blue-200"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm text-gray-500 font-medium">
                            {shift.time}
                          </div>
                          {isEditing && (
                            <button
                              onClick={() =>
                                handleAddEmployee(day.id, shift.id)
                              }
                              className="text-green-500 hover:text-green-700 text-xl"
                            >
                              +
                            </button>
                          )}
                        </div>
                        {shift.employees.map((employee, index) => (
                          <Draggable
                            key={employee.id}
                            draggableId={employee.id}
                            index={index}
                            isDragDisabled={!isEditing}
                          >
                            {(provided: any, snapshot: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getDraggableStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                                className={`p-2 mb-1 rounded border cursor-move ${
                                  snapshot.isDragging
                                    ? "border-blue-300 bg-blue-100 shadow-lg transform scale-105"
                                    : "border-gray-200 bg-white hover:bg-gray-50"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium text-gray-800">
                                      {employee.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      <span className="font-medium">
                                        {employee.role} | {employee.hours}
                                      </span>{" "}
                                    </div>
                                  </div>
                                  {isEditing && (
                                    <div className="flex items-center space-x-0">
                                      <button
                                        onClick={() =>
                                          handleEditEmployee(
                                            day.id,
                                            shift.id,
                                            employee.id
                                          )
                                        }
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                      >
                                        ✎
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteEmployee(
                                            day.id,
                                            shift.id,
                                            employee.id
                                          )
                                        }
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {Object.keys(shift.shortages ?? {}).length > 0 && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded-lg shadow-sm">
                            <div className="flex items-center mb-1">
                              <FiAlertCircle
                                className="text-red-600 mr-2"
                                size={16}
                              />
                              <span className="text-sm font-semibold text-red-800">
                                Shortages
                              </span>
                            </div>
                            <ul className="list-disc ml-6">
                              {Object.entries(shift.shortages ?? {}).map(
                                ([role, count]) => (
                                  <li
                                    key={role}
                                    className="text-xs text-red-700"
                                  >
                                    {role}: missing {count}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

      {/* Modal for adding a new employee */}
      {selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Employee to Shift</h2>
            <div className="space-y-4">
              {/* Dropdown לבחירת העובד */}
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Employee</option>
                {employeeDropdown.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
              {/* Dropdown לבחירת התפקיד, תלוי בעובד שנבחר */}
              <select
                value={newEmployee.role}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, role: e.target.value })
                }
                className="w-full p-2 border rounded"
                disabled={!availableJobs.length}
              >
                <option value="">Select Role</option>
                {availableJobs.map((job, index) => (
                  <option key={`${job}-${index}`} value={job}>
                    {job}
                  </option>
                ))}
              </select>
              {/* שדות זמן */}
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Start Time:
                </label>
                <input
                  type="time"
                  value={newEmployee.hours.split("-")[0] || ""}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      hours: `${e.target.value}-${
                        newEmployee.hours.split("-")[1] || ""
                      }`,
                    })
                  }
                  className="p-2 border rounded"
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  End Time:
                </label>
                <input
                  type="time"
                  value={newEmployee.hours.split("-")[1] || ""}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      hours: `${newEmployee.hours.split("-")[0] || ""}-${
                        e.target.value
                      }`,
                    })
                  }
                  className="p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedShift(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEmployee}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
            <div className="space-y-4">
              {/* Dropdown לבחירת העובד */}
              <select
                value={editingEmployee.employeeData.id}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const emp = employeeDropdown.find(
                    (emp) => emp.id === selectedId
                  );
                  if (emp) {
                    setEditingEmployee((prev) =>
                      prev
                        ? {
                            ...prev,
                            employeeData: {
                              ...prev.employeeData,
                              id: selectedId,
                              name: `${emp.first_name} ${emp.last_name}`,
                              role: "", // איפוס תפקיד בעת שינוי העובד
                            },
                          }
                        : null
                    );
                    setEditingAvailableJobs(emp.jobs || []);
                  }
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Employee</option>
                {employeeDropdown.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
              {/* Dropdown לבחירת התפקיד */}
              <select
                value={editingEmployee.employeeData.role}
                onChange={(e) =>
                  setEditingEmployee((prev) =>
                    prev
                      ? {
                          ...prev,
                          employeeData: {
                            ...prev.employeeData,
                            role: e.target.value,
                          },
                        }
                      : null
                  )
                }
                className="w-full p-2 border rounded"
                disabled={!editingAvailableJobs.length}
              >
                <option value="">Select Role</option>
                {editingAvailableJobs.map((job, index) => (
                  <option key={`${job}-${index}`} value={job}>
                    {job}
                  </option>
                ))}
              </select>
              {/* שדות זמן */}
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Start Time:
                </label>
                <input
                  type="time"
                  value={editingEmployee.employeeData.hours.split("-")[0] || ""}
                  onChange={(e) =>
                    setEditingEmployee((prev) =>
                      prev
                        ? {
                            ...prev,
                            employeeData: {
                              ...prev.employeeData,
                              hours: `${e.target.value}-${
                                prev.employeeData.hours.split("-")[1] || ""
                              }`,
                            },
                          }
                        : null
                    )
                  }
                  className="p-2 border rounded"
                />
              </div>
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  End Time:
                </label>
                <input
                  type="time"
                  value={editingEmployee.employeeData.hours.split("-")[1] || ""}
                  onChange={(e) =>
                    setEditingEmployee((prev) =>
                      prev
                        ? {
                            ...prev,
                            employeeData: {
                              ...prev.employeeData,
                              hours: `${
                                prev.employeeData.hours.split("-")[0] || ""
                              }-${e.target.value}`,
                            },
                          }
                        : null
                    )
                  }
                  className="p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingEmployee(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditedEmployee}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftScheduler;
