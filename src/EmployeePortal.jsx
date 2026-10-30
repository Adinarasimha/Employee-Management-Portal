
import { useState } from "react";
import "./EmployeePortal.css";

function EmployeePortal({ onLogout }) {
  // STATES
  const [employees, setEmployees] = useState([]);

  const [employee, setEmployee] = useState({
    Firstname: "",
    Lastname: "",
    age: "",
    city: "",
    salary: "",
  });

  const [searchId, setSearchId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // CLEAR FORM
  const clearForm = () => {
    setEmployee({
      Firstname: "",
      Lastname: "",
      age: "",
      city: "",
      salary: "",
    });
  };

  // GET ALL EMPLOYEES
  const getEmployees = async () => {
    try {
      const response = await fetch(
        "http://localhost:3232/employee/getAllemployees"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // HANDLE INPUT CHANGES
  const handleChange = (event) => {
    setEmployee({
      ...employee,
      [event.target.name]: event.target.value,
    });
  };

  // ADD EMPLOYEE
  const addEmployee = async () => {
    try {
      const response = await fetch(
        "http://localhost:3232/employee/se",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Firstname: employee.Firstname,
            Lastname: employee.Lastname,
            age: Number(employee.age),
            city: employee.city,
            salary: Number(employee.salary),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      alert("Employee added successfully!");
      clearForm();
      await getEmployees();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // GET ONE EMPLOYEE
  const getEmployee = async () => {
    if (!searchId.trim()) {
      alert("Please enter Employee ID");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3232/employee/getEmployee/${searchId}`
      );

      if (!response.ok) {
        throw new Error("Employee not found");
      }

      const data = await response.json();

      setSelectedEmployee(data);

      setEmployee({
        Firstname: data.Firstname ?? "",
        Lastname: data.Lastname ?? "",
        age: data.age ?? "",
        city: data.city ?? "",
        salary: data.salary ?? "",
      });
    } catch (error) {
      setSelectedEmployee(null);
      alert("Error: " + error.message);
    }
  };

  // UPDATE EMPLOYEE
  const updateEmployee = async () => {
    if (!searchId.trim()) {
      alert("Please enter Employee ID");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3232/employee/updateEmployee/${searchId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Firstname: employee.Firstname,
            Lastname: employee.Lastname,
            age: Number(employee.age),
            city: employee.city,
            salary: Number(employee.salary),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      const data = await response.json();

      alert("Employee updated successfully!");
      setSelectedEmployee(data);
      await getEmployees();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // DELETE EMPLOYEE
  const deleteEmployee = async () => {
    if (!searchId.trim()) {
      alert("Please enter Employee ID");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3232/employee/deleteemployee/${searchId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      const message = await response.text();

      alert(message || "Employee deleted successfully!");

      setSelectedEmployee(null);
      setSearchId("");
      clearForm();

      await getEmployees();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // UI
  return (
    <div className="portal-container">
      <header className="portal-header">
        <div>
          <h1>Employee Portal</h1>
          <p>Manage your employees in one place</p>
        </div>

        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <hr />

      {/* DASHBOARD ACTIONS */}
      <section className="dashboard-actions">
        <div className="action-card">
          <h3>Employees</h3>
          <p>View all employee records</p>
          <button type="button" onClick={getEmployees}>
            Get All Employees
          </button>
        </div>

        <div className="action-card">
          <h3>Add Employee</h3>
          <p>Register a new employee</p>
          <button
            type="button"
            onClick={addEmployee}
            className="add-btn"
          >
            Add Employee
          </button>
        </div>

        <div className="action-card">
          <h3>Find Employee</h3>
          <p>Search using employee ID</p>
          <button type="button" onClick={getEmployee}>
            Search Employee
          </button>
        </div>
      </section>

      <hr />

      {/* ADD / UPDATE FORM */}
      <section className="form-section">
        <h2>Add / Update Employee</h2>

        <div className="employee-form">
          <input
            type="text"
            name="Firstname"
            placeholder="First name"
            value={employee.Firstname}
            onChange={handleChange}
          />

          <input
            type="text"
            name="Lastname"
            placeholder="Last name"
            value={employee.Lastname}
            onChange={handleChange}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={employee.age}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={employee.city}
            onChange={handleChange}
          />

          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={employee.salary}
            onChange={handleChange}
          />
        </div>

        <div className="button-group">
          <button type="button" onClick={addEmployee}>
            Add Employee
          </button>

          <button
            type="button"
            className="update-btn"
            onClick={updateEmployee}
          >
            Update Employee
          </button>

          <button
            type="button"
            className="clear-btn"
            onClick={clearForm}
          >
            Clear Form
          </button>
        </div>
      </section>

      <hr />

      {/* SEARCH / DELETE */}
      <section className="form-section">
        <h2>Employee Operations</h2>

        <div className="search-row">
          <input
            type="number"
            placeholder="Enter Employee ID"
            value={searchId}
            onChange={(event) => setSearchId(event.target.value)}
          />

          <button type="button" onClick={getEmployee}>
            Get Employee
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={deleteEmployee}
          >
            Delete Employee
          </button>
        </div>
      </section>

      {/* SELECTED EMPLOYEE */}
      
<button
  type="button"
  onClick={() => {
    setSearchId(String(emp.eid));
    setSelectedEmployee(emp);

    setEmployee({
      Firstname: emp.Firstname ?? "",
      Lastname: emp.Lastname ?? "",
      age: emp.age ?? "",
      city: emp.city ?? "",
      salary: emp.salary ?? "",
    });

    alert(`${emp.Firstname} selected successfully!`);
  }}
>
  Select Employee
</button>

      <hr />

      {/* ALL EMPLOYEES */}
      <section className="employees-section">
        <h2>Employees List</h2>

        {employees.length === 0 ? (
          <p className="empty-message">
            No employees loaded. Click "Get All Employees".
          </p>
        ) : (
          <div className="employee-list">
            {employees.map((emp) => (
              <div className="employee-card" key={emp.eid}>
                <h3>
                  {emp.Firstname} {emp.Lastname}
                </h3>

                <p><strong>ID:</strong> {emp.eid}</p>
                <p><strong>Age:</strong> {emp.age}</p>
                <p><strong>City:</strong> {emp.city}</p>
                <p><strong>Salary:</strong> {emp.salary}</p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchId(String(emp.eid));
                    setSelectedEmployee(emp);
                    setEmployee({
                      Firstname: emp.Firstname ?? "",
                      Lastname: emp.Lastname ?? "",
                      age: emp.age ?? "",
                      city: emp.city ?? "",
                      salary: emp.salary ?? "",
                    });
                  }}
                >
                  Select Employee
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EmployeePortal;
