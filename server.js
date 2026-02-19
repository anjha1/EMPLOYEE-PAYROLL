const express = require("express");
const path = require("path");
const { readFile, writeFile } = require("./modules/fileHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// ================= EDIT PAGE =================
app.get("/edit/:id", async (req, res) => {
  const employees = await readFile();
  const employee = employees.find(emp => emp.id == req.params.id);
  if (!employee) {
    return res.status(404).send("Employee not found");
  }
  res.render("edit", { employee });
});

// ================= EDIT EMPLOYEE =================
app.post("/edit/:id", async (req, res) => {
  const employees = await readFile();
  const idx = employees.findIndex(emp => emp.id == req.params.id);
  if (idx === -1) {
    return res.status(404).send("Employee not found");
  }
  const {
    name,
    gender,
    department,
    salary,
    day,
    month,
    year,
    image,
    notes
  } = req.body;

  employees[idx] = {
    ...employees[idx],
    name,
    gender: gender || employees[idx].gender,
    department: Array.isArray(department) ? department : [department],
    salary: Number(salary),
    startDate: day && month && year ? `${day} ${month} ${year}` : employees[idx].startDate,
    image: image || employees[idx].image,
    notes: notes || employees[idx].notes
  };
  await writeFile(employees);
  res.redirect("/");
});

// ================= DASHBOARD =================
app.get("/", async (req, res) => {
  const employees = await readFile();
  res.render("index", { employees });
});

// ================= ADD PAGE =================
app.get("/add", (req, res) => {
  res.render("add");
});

// ================= ADD EMPLOYEE =================
app.post("/add", async (req, res) => {
  const {
    name,
    gender,
    department,
    salary,
    day,
    month,
    year,
    image,
    notes
  } = req.body;

  if (!name || salary <= 0) {
    return res.send("Invalid Input");
  }

  const employees = await readFile();

  const newEmployee = {
    id: Date.now(),
    name,
    gender,
    department: Array.isArray(department) ? department : [department],
    salary: Number(salary),
    startDate: `${day} ${month} ${year}`,
    image,
    notes
  };

  employees.push(newEmployee);
  await writeFile(employees);

  res.redirect("/");
});

// ================= DELETE =================
app.get("/delete/:id", async (req, res) => {
  const employees = await readFile();
  const updated = employees.filter(emp => emp.id != req.params.id);
  await writeFile(updated);
  res.redirect("/");
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});