/* =========================================
   STUDENT MANAGEMENT SYSTEM
   Frontend Application
========================================= */


/* =========================================
   DEFAULT STUDENT DATA
========================================= */

const defaultStudents = [
    {
        id: 1,
        name: "Rahul Kumar",
        roll: "24A91A0501",
        email: "rahul@example.com",
        phone: "9876543210",
        gender: "Male",
        dob: "2006-05-12",
        department: "CSE",
        year: "2nd Year",
        marks: 87,
        attendance: 92
    },

    {
        id: 2,
        name: "Priya Reddy",
        roll: "24A91A0502",
        email: "priya@example.com",
        phone: "9876543211",
        gender: "Female",
        dob: "2006-08-21",
        department: "AIML",
        year: "2nd Year",
        marks: 91,
        attendance: 95
    },

    {
        id: 3,
        name: "Arjun Sai",
        roll: "24A91A0503",
        email: "arjun@example.com",
        phone: "9876543212",
        gender: "Male",
        dob: "2006-02-15",
        department: "ECE",
        year: "2nd Year",
        marks: 78,
        attendance: 86
    }
];


/* =========================================
   APPLICATION STATE
========================================= */

let students = [];

let editingStudentId = null;


/* =========================================
   DOM ELEMENTS
========================================= */

const studentForm =
    document.getElementById("studentForm");

const editForm =
    document.getElementById("editForm");

const studentTableBody =
    document.getElementById("studentTableBody");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const departmentFilter =
    document.getElementById("departmentFilter");

const editModal =
    document.getElementById("editModal");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const toastIcon =
    document.getElementById("toastIcon");


/* =========================================
   INITIALIZE APPLICATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadStudents();

        setupNavigation();

        setupForms();

        setupSearch();

        setupTheme();

        setupMobileMenu();

        renderAll();

    }
);


/* =========================================
   LOCAL STORAGE
========================================= */

function loadStudents() {

    const savedStudents =
        localStorage.getItem(
            "eduManageStudents"
        );


    if (savedStudents) {

        try {

            students =
                JSON.parse(savedStudents);

        } catch (error) {

            console.error(
                "Could not load students:",
                error
            );

            students =
                [...defaultStudents];

        }

    } else {

        students =
            [...defaultStudents];

    }

}


function saveStudents() {

    localStorage.setItem(
        "eduManageStudents",
        JSON.stringify(students)
    );

}


/* =========================================
   NAVIGATION
========================================= */

function setupNavigation() {

    const navigationButtons =
        document.querySelectorAll(
            "[data-section]"
        );


    navigationButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;

                    showSection(section);

                }
            );

        }
    );

}


function showSection(sectionId) {

    const sections =
        document.querySelectorAll(
            ".section"
        );


    sections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(
            sectionId
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    const navigationItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navigationItems.forEach(
        item => {

            item.classList.toggle(
                "active",
                item.dataset.section ===
                sectionId
            );

        }
    );


    const titles = {

        dashboard: [
            "Dashboard",
            "Manage your students efficiently"
        ],

        students: [
            "Students",
            "View and manage all student records"
        ],

        "add-student": [
            "Add Student",
            "Create a new student record"
        ]

    };


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );

    const pageSubtitle =
        document.getElementById(
            "pageSubtitle"
        );


    if (titles[sectionId]) {

        pageTitle.textContent =
            titles[sectionId][0];

        pageSubtitle.textContent =
            titles[sectionId][1];

    }


    document
        .getElementById("sidebar")
        .classList.remove("open");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   FORM SETUP
========================================= */

function setupForms() {

    studentForm.addEventListener(
        "submit",
        handleAddStudent
    );


    editForm.addEventListener(
        "submit",
        handleEditStudent
    );


    document
        .getElementById("cancelEdit")
        .addEventListener(
            "click",
            closeEditModal
        );


    document
        .getElementById("closeModal")
        .addEventListener(
            "click",
            closeEditModal
        );


    editModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                editModal
            ) {

                closeEditModal();

            }

        }
    );

}


/* =========================================
   ADD STUDENT
========================================= */

function handleAddStudent(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("studentName")
            .value
            .trim();

    const roll =
        document
            .getElementById("rollNumber")
            .value
            .trim();

    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const phone =
        document
            .getElementById("phone")
            .value
            .trim();

    const gender =
        document
            .getElementById("gender")
            .value;

    const dob =
        document
            .getElementById("dob")
            .value;

    const department =
        document
            .getElementById("department")
            .value;

    const year =
        document
            .getElementById("year")
            .value;

    const marks =
        Number(
            document
                .getElementById("marks")
                .value
        ) || 0;

    const attendance =
        Number(
            document
                .getElementById("attendance")
                .value
        ) || 0;


    /* VALIDATION */

    if (
        !name ||
        !roll ||
        !email ||
        !gender ||
        !department ||
        !year
    ) {

        showToast(
            "Please fill all required fields.",
            "!"
        );

        return;

    }


    if (
        marks < 0 ||
        marks > 100 ||
        attendance < 0 ||
        attendance > 100
    ) {

        showToast(
            "Marks and attendance must be between 0 and 100.",
            "!"
        );

        return;

    }


    /* DUPLICATE ROLL NUMBER */

    const duplicate =
        students.some(
            student =>
                student.roll.toLowerCase() ===
                roll.toLowerCase()
        );


    if (duplicate) {

        showToast(
            "Roll number already exists.",
            "!"
        );

        return;

    }


    /* CREATE STUDENT */

    const newStudent = {

        id: Date.now(),

        name,

        roll,

        email,

        phone,

        gender,

        dob,

        department,

        year,

        marks,

        attendance

    };


    students.unshift(
        newStudent
    );


    saveStudents();

    renderAll();

    studentForm.reset();


    showToast(
        "Student added successfully!",
        "✓"
    );


    showSection("students");

}


/* =========================================
   EDIT STUDENT
========================================= */

function openEditModal(id) {

    const student =
        students.find(
            item =>
                item.id === id
        );


    if (!student) return;


    editingStudentId = id;


    document
        .getElementById("editId")
        .value = student.id;


    document
        .getElementById("editName")
        .value = student.name;


    document
        .getElementById("editRoll")
        .value = student.roll;


    document
        .getElementById("editEmail")
        .value = student.email;


    document
        .getElementById("editPhone")
        .value = student.phone;


    document
        .getElementById("editDepartment")
        .value = student.department;


    document
        .getElementById("editYear")
        .value = student.year;


    document
        .getElementById("editMarks")
        .value = student.marks;


    document
        .getElementById("editAttendance")
        .value = student.attendance;


    editModal.classList.add("show");

}


function handleEditStudent(event) {

    event.preventDefault();


    const student =
        students.find(
            item =>
                item.id ===
                editingStudentId
        );


    if (!student) return;


    const newName =
        document
            .getElementById("editName")
            .value
            .trim();

    const newRoll =
        document
            .getElementById("editRoll")
            .value
            .trim();

    const newEmail =
        document
            .getElementById("editEmail")
            .value
            .trim();

    const newPhone =
        document
            .getElementById("editPhone")
            .value
            .trim();

    const newDepartment =
        document
            .getElementById("editDepartment")
            .value;

    const newYear =
        document
            .getElementById("editYear")
            .value;

    const newMarks =
        Number(
            document
                .getElementById("editMarks")
                .value
        ) || 0;

    const newAttendance =
        Number(
            document
                .getElementById("editAttendance")
                .value
        ) || 0;


    if (
        !newName ||
        !newRoll ||
        !newEmail
    ) {

        showToast(
            "Please fill all required fields.",
            "!"
        );

        return;

    }


    if (
        newMarks < 0 ||
        newMarks > 100 ||
        newAttendance < 0 ||
        newAttendance > 100
    ) {

        showToast(
            "Invalid marks or attendance.",
            "!"
        );

        return;

    }


    const duplicate =
        students.some(
            item =>
                item.id !==
                editingStudentId &&
                item.roll.toLowerCase() ===
                newRoll.toLowerCase()
        );


    if (duplicate) {

        showToast(
            "Another student already uses this roll number.",
            "!"
        );

        return;

    }


    student.name =
        newName;

    student.roll =
        newRoll;

    student.email =
        newEmail;

    student.phone =
        newPhone;

    student.department =
        newDepartment;

    student.year =
        newYear;

    student.marks =
        newMarks;

    student.attendance =
        newAttendance;


    saveStudents();

    renderAll();

    closeEditModal();


    showToast(
        "Student updated successfully!",
        "✓"
    );

}


function closeEditModal() {

    editModal.classList.remove(
        "show"
    );

    editingStudentId = null;

}


/* =========================================
   DELETE STUDENT
========================================= */

function deleteStudent(id) {

    const student =
        students.find(
            item =>
                item.id === id
        );


    if (!student) return;


    const confirmed =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmed) return;


    students =
        students.filter(
            item =>
                item.id !== id
        );


    saveStudents();

    renderAll();


    showToast(
        "Student deleted successfully.",
        "✓"
    );

}


/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    searchInput.addEventListener(
        "input",
        renderStudents
    );


    departmentFilter.addEventListener(
        "change",
        renderStudents
    );

}


function getFilteredStudents() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const department =
        departmentFilter.value;


    return students.filter(
        student => {

            const matchesSearch =
                !search ||
                student.name
                    .toLowerCase()
                    .includes(search) ||
                student.roll
                    .toLowerCase()
                    .includes(search) ||
                student.email
                    .toLowerCase()
                    .includes(search);


            const matchesDepartment =
                department === "all" ||
                student.department ===
                department;


            return (
                matchesSearch &&
                matchesDepartment
            );

        }
    );

}


/* =========================================
   RENDER STUDENTS
========================================= */

function renderStudents() {

    const filteredStudents =
        getFilteredStudents();


    studentTableBody.innerHTML = "";


    if (
        filteredStudents.length === 0
    ) {

        emptyState.classList.add(
            "show"
        );

        return;

    }


    emptyState.classList.remove(
        "show"
    );


    filteredStudents.forEach(
        student => {

            const row =
                document.createElement(
                    "tr"
                );


            const attendanceClass =
                student.attendance >= 75
                    ? "good"
                    : "low";


            row.innerHTML = `

                <td>

                    <div class="student-info">

                        <div class="student-avatar">
                            ${getInitials(student.name)}
                        </div>

                        <div>

                            <div class="student-name">
                                ${escapeHTML(student.name)}
                            </div>

                            <span class="student-email">
                                ${escapeHTML(student.email)}
                            </span>

                        </div>

                    </div>

                </td>


                <td>
                    ${escapeHTML(student.roll)}
                </td>


                <td>

                    <span class="department-badge">
                        ${escapeHTML(student.department)}
                    </span>

                </td>


                <td>
                    ${escapeHTML(student.year)}
                </td>


                <td>

                    <span class="marks">
                        ${student.marks}%
                    </span>

                </td>


                <td>

                    <span class="attendance ${attendanceClass}">
                        ${student.attendance}%
                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            class="action-button"
                            onclick="openEditModal(${student.id})"
                            title="Edit"
                        >
                            ✏️
                        </button>


                        <button
                            class="action-button delete"
                            onclick="deleteStudent(${student.id})"
                            title="Delete"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            studentTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {

    const total =
        students.length;


    const male =
        students.filter(
            student =>
                student.gender === "Male"
        ).length;


    const female =
        students.filter(
            student =>
                student.gender === "Female"
        ).length;


    const average =
        total === 0
            ? 0
            : students.reduce(
                (sum, student) =>
                    sum + Number(student.marks),
                0
            ) / total;


    document
        .getElementById("totalStudents")
        .textContent = total;


    document
        .getElementById("maleStudents")
        .textContent = male;


    document
        .getElementById("femaleStudents")
        .textContent = female;


    document
        .getElementById("averageMarks")
        .textContent =
        `${average.toFixed(1)}%`;


    renderRecentStudents();

}


function renderRecentStudents() {

    const container =
        document.getElementById(
            "recentStudents"
        );


    container.innerHTML = "";


    const recent =
        students.slice(0, 3);


    if (recent.length === 0) {

        container.innerHTML = `
            <div class="empty-state show">
                <div>🎓</div>
                <h3>No students yet</h3>
                <p>Add a student to see records here.</p>
            </div>
        `;

        return;

    }


    recent.forEach(
        student => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "recent-card";


            card.innerHTML = `

                <div class="recent-card-top">

                    <div class="student-avatar">
                        ${getInitials(student.name)}
                    </div>

                    <div>

                        <h3>
                            ${escapeHTML(student.name)}
                        </h3>

                        <p>
                            ${escapeHTML(student.roll)}
                        </p>

                    </div>

                </div>


                <div class="recent-card-bottom">

                    <span>
                        ${escapeHTML(student.department)}
                    </span>

                    <strong>
                        ${student.marks}%
                    </strong>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );
}


/* =========================================
   RENDER ALL
========================================= */

function renderAll() {

    renderStudents();

    renderDashboard();

}


/* =========================================
   THEME
========================================= */

function setupTheme() {

    const themeButton =
        document.getElementById("themeToggle");

    if (!themeButton) return;


    const savedTheme =
        localStorage.getItem(
            "eduManageTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }


    updateThemeIcon();


    themeButton.addEventListener(
        "click",
        toggleTheme
    );

}


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const theme =
        document.body.classList.contains("dark")
            ? "dark"
            : "light";


    localStorage.setItem(
        "eduManageTheme",
        theme
    );


    updateThemeIcon();

}


function updateThemeIcon() {

    const themeButton =
        document.getElementById(
            "themeToggle"
        );


    if (!themeButton) return;


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    themeButton.textContent =
        isDark ? "☀️" : "🌙";

}


/* =========================================
   MOBILE MENU
========================================= */

function setupMobileMenu() {

    const menuButton =
        document.getElementById(
            "menuButton"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (!menuButton || !sidebar) return;


    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================================
   TOAST
========================================= */

function showToast(
    message,
    icon = "✓"
) {

    if (
        !toast ||
        !toastMessage ||
        !toastIcon
    ) {
        return;
    }


    toastMessage.textContent =
        message;


    toastIcon.textContent =
        icon;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================
   HELPERS
========================================= */

function getInitials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0).toUpperCase()
        )
        .join("");

}


function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

} 
const backButton = document.getElementById("backButton");

if (backButton) {
    backButton.addEventListener("click", () => {
        showSection("dashboard");
    });
}