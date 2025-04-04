import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRole } from "../../../hooks/RoleContext";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import Swal from "sweetalert2";

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
}

interface Day {
  id: string;
  name: string;
  shifts: Shift[];
}

interface EmployeeDropdown {
  id: string;
  first_name: string;
  last_name: string;
  jobs: string[]; // מערך של תפקידים (מחרוזות)
}

const ShiftScheduler = () => {
  const { role } = useRole();
  const [schedules, setSchedules] = useState<Day[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [daysId, setDaysId] = useState<string[]>([]);
  const [editingAvailableJobs, setEditingAvailableJobs] = useState<string[]>(
    []
  );

  // States עבור בחירת עובד והוספת עובד ידנית למשמרת
  const [employeeDropdown, setEmployeeDropdown] = useState<EmployeeDropdown[]>(
    []
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [availableJobs, setAvailableJobs] = useState<string[]>([]);
  const [newEmployee, setNewEmployee] = useState<{
    id: string;
    name: string;
    role: string;
    hours: string;
  }>({
    id: "",
    name: "",
    role: "",
    hours: "",
  });

  const [selectedShift, setSelectedShift] = useState<{
    dayId: string;
    shiftId: string;
  } | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<{
    dayId: string;
    shiftId: string;
    employeeId: string;
    employeeData: Employee;
  } | null>(null);

  const goBack = () => {
    if (currentIndex < schedules.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setDays(schedules[newIndex]);
    }
  };

  const goForward = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setDays(schedules[newIndex]);
    }
  };

  const goToLatest = () => {
    setCurrentIndex(0);
    setDays(schedules[0]);
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/all`
        );
        if (!response.ok) throw new Error("Failed to fetch schedules");

        const result = await response.json();
        setDaysId(result.map((schedule: any) => schedule._id));
        setSchedules(result.map((schedule: any) => schedule.days)); // שולח רק את ה-"days"
        setCurrentIndex(0);
        setDays(result[0].days);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
    fetchSchedules();
  }, []);

  // שליפת העובדים - הנתיב הוא /employees (לפי ה-API שסיפקת)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/employees`
        );
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        // במידה ואין שדה id, נייצר מזהה על בסיס השם ואינדקס (אפשר לשפר בהתאם לצורך)
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

  // עדכון רשימת התפקידים ושם העובד כאשר המשתמש בוחר עובד
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

  const updateSchedule = async () => {
    try {
      const scheduleId = daysId[currentIndex];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/update/${scheduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ days }),
        }
      );
      if (!response.ok) throw new Error("Failed to update schedule");
      Swal.fire({
        title: "Schedule Updated!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        width: "300px",
        position: "center",
        background: "#f0f9ff",
        iconColor: "#014DAE",
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-2xl font-sans font-semibold text-blue-700",
        },
      });
    } catch (error: any) {
      Swal.fire({
        text: "Schedule not found or no changes made",
        icon: "info",
        confirmButtonText: "OK",
        timer: 3000,
        showConfirmButton: false,
        position: "center",
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
  };

  const handleToggleEdit = async () => {
    if (isEditing) {
      await updateSchedule();
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

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
    )
      return;
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
    // Reset הבחירות במודאל
    setSelectedEmployeeId("");
    setNewEmployee({ id: "", name: "", role: "", hours: "" });
    setAvailableJobs([]);
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
    // איפוס שדות העובד לאחר שמירה
    setNewEmployee({ id: "", name: "", role: "", hours: "" });
    setSelectedEmployeeId("");
    setAvailableJobs([]);
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
        <div className="flex gap-x-1">
          {!isEditing && (
            <>
              <button
                onClick={goBack}
                disabled={currentIndex >= schedules.length - 1}
                className={`px-4 py-2 rounded ${
                  currentIndex >= schedules.length - 1
                    ? "bg-gray-300"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={goToLatest}
                disabled={currentIndex === 0}
                className={`px-4 py-2 font-sans rounded ${
                  currentIndex === 0
                    ? "bg-gray-300"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Current
              </button>
              <button
                onClick={goForward}
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded ${
                  currentIndex === 0
                    ? "bg-gray-300"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <FaArrowRight />
              </button>
            </>
          )}
          {role === "manager" && currentIndex == 0 && (
            <button
              onClick={handleToggleEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white ml-5 px-4 py-2 rounded-lg transition-colors"
            >
              {isEditing ? "Done ✔" : "Edit ✎"}
            </button>
          )}
        </div>
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
                                      </span>
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
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
      {/* Modal להוספת עובד ידנית עם dropdown */}
      {selectedShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Employee to Shift</h2>
            <div className="space-y-4">
              {/* Dropdown לבחירת עובד */}
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
              {/* Dropdown לבחירת תפקיד, תלוי בעובד שנבחר */}
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
              {/* Time inputs */}
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
      {/* Modal לעריכת עובד */}
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

              {/* Dropdown לבחירת התפקיד, תלוי בעובד שנבחר */}
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

              {/* Time Inputs */}
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
