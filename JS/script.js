let submit = $(".submit-btn");
const form = $("#user-form");
let eduBody = $(".tb");
var selectedRow = null;
let allUserData = [];

$(".form-control[required]").on("input change blur", validate);

function onFormSubmit() {
  if (validate()) {
    var formData = readFormData();
    if (selectedRow == null && validate())
      insertNewRecord(formData);
    else {
      if (validate()) {
        updateRecord(formData);
      }
    }
    resetForm();
  }
}

function validate() {
  isValid = true;
  const fname = $("#fname").val();
  const dob = $("#dob").val();
  const email = $("#email").val();
  const address = $("#address").val();
  const graduation = $("#graduationYear").val();

  const currentDate = new Date();
  const dobFormat = new Date(dob);
  const dobYear = dobFormat.getFullYear();
  const currentYear = currentDate.getFullYear();
  const gradYear = parseInt(graduation.slice(0, 4));
  const yearDiff = currentYear - dobYear;
  const gradDiff = currentYear - gradYear;
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if ($.trim(fname) === "") {
    $("#fname").addClass("border-danger");
    $("#fnameError").removeClass("error");
    $("#fnameError").html("First Name can notbe empty!");
    isValid = false;
  }
  else {
    $("#fname").removeClass("border-danger");
    $("#fnameError").addClass("error");

  }

  if ($.trim(dob) === "") {
    $("#dobError").html("date of birth Email can't be empty!");
    $("#dobError").removeClass("error");
    $("#dob").addClass("border-danger");
    isValid = false;
  }
  else if (yearDiff < 18) {
    $("#dobError").html("Min age should be 18!");
    $("#dobError").removeClass("error");
    $("#dob").addClass("border-danger");
    isValid = false;
  }
  else {
    $("#dobError").addClass("error");
    $("#dob").removeClass("border-danger");
  }

  if ($.trim(email) == "") {
    $("#email").addClass("border-danger");
    $("#emailError").removeClass("error");
    $("#emailError").html("Email can not be empty!");
    isValid = false;
  }
  else if (!emailRegex.test(email)) {
    $("#emailError").html("Email format is wrong!");
    $("#emailError").removeClass("error");
    $("#email").addClass("border-danger");
    isValid = false;
  }
  else {
    $("#emailError").addClass("error");
    $("#email").removeClass("border-danger");
  }

  if ($.trim(address) === "") {
    $("#address").addClass("border-danger");
    $("#addressError").removeClass("error");
    $("#addressError").html("Address can not be empty!");
    isValid = false;
  }
  else {
    $("#addressError").addClass("error");
    $("#address").removeClass("border-danger");
  }

  if (graduation == "") {
    $("#graduationYear").addClass("border-danger");
    $("#gyearError").removeClass("error");
    $("#gyearError").html("Graduation can not be empty!");
    isValid = false;
  }
  else if (gradDiff < 1) {
    $("#gyearError").removeClass("error");
    $("#gyearError").html("Graduation Year must be before current Year!");
    $("#graduationYear").addClass("border-danger");
    isValid = false;
  }
  else {
    $("#gyearError").addClass("error");
    $("#graduationYear").removeClass("border-danger");
  }

  //validation for educational data
  $(".tb tr").each(function () {
    const inputs = $(this).find("input");
    let startDate = $(this).find("#startDate").val();
    let passYear = $(this).find("#passYear").val();

    if (startDate && passYear && new Date(startDate) > new Date(passYear)) {
      $(this).find("#startDate").addClass("border-danger");
      $(this).find("#passYear").addClass("border-danger");

      isValid = false;
    } else {
      $(this).find("#startDate").removeClass("border-danger");
      $(this).find("#passYear").removeClass("border-danger");
    }
  });

  return isValid;
}

function readFormData() {
  // Fetch personal data
  let personalData = {
    firstName: $("#fname").val(),
    lastName: $("#lname").val(),
    dob: $("#dob").val(),
    email: $("#email").val(),
    address: $("#address").val(),
    graduationYear: $("#graduationYear").val(),
  };

  // Fetch educational data
  const educationalData = [];

  $(".tb tr").each(function () {
    const inputs = $(this).find("input");
    let rowData = {};

    inputs.each(function () {
      if (this.id) {
        rowData[this.id] = $(this).val();
      }
    });

    educationalData.push(rowData);
  });

  // Combine personal and educational data
  let formData = {
    personal: personalData,
    educational: educationalData,
  };

  allUserData.push(formData);
  return formData;
}

function insertNewRecord(data) {
  let table = $('#form-table').DataTable();
  let newRowData = [ 
    table.rows().count() + 1,
    data.personal.firstName,
    data.personal.lastName,
    data.personal.dob,
    data.personal.email,
    data.personal.address,
    data.personal.graduationYear,
    `<a data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick="onEdit(this)" style="cursor: pointer";><i class="fas fa-edit"></i></a>`,
    `<a onClick="onDelete(this)" class="deleteDataRecord, bg-transparent, fw-bold" style="cursor: pointer";>&times</a>`
  ];

  // Add the new row data to DataTable
  table.row.add(newRowData).draw();

  alert("Data successfully Added");

  let modal = $("#staticBackdrop");
  let closeBtn = modal.find('[data-bs-dismiss="modal"]');
  closeBtn.click();
  submit.innerHTML = "submit";
  // setInterval(insertNewRecord, 1000)
}

function resetForm() {
  form[0].reset();
  selectedRow = null;
}

function onEdit(td) {
  submit.html("Update");

  // selectedRow = td.parent().parent();
  selectedRow = $(td).closest("tr");
  let id = selectedRow.find('td:eq(0)').html();

  // Populate personal data fields
  $("#fname").val(selectedRow.find('td:eq(1)').html());
  $("#lname").val(selectedRow.find('td:eq(2)').html());
  $("#dob").val(selectedRow.find('td:eq(3)').html());
  $("#email").val(selectedRow.find('td:eq(4)').html());
  $("#address").val(selectedRow.find('td:eq(5)').html());
  $("#graduationYear").val(selectedRow.find('td:eq(6)').html());

  let userData = allUserData[id - 1].educational;
  eduBody.html("");

  // Populate educational data fields
  if (userData) {
    userData.forEach((eduData) => {
      let newRow = $("<tr></tr>").html(
        `
          <td><input type="text" id="degree" class="form-control" value="${eduData.degree}" required></td>
          <td><input type="text" id="school" class="form-control" value="${eduData.school}" required></td>
          <td><input type="date" id="startDate" class="form-control" value="${eduData.startDate}" required></td><span id="startDateError" class="error"></span>
          <td><input type="date" id="passYear" class="form-control" value="${eduData.passYear}" required></td><span id="passYearError" class="error"></span>
          <td><input type="number" id="percentage" class="form-control" value="${eduData.percentage}" required></td>
          <td><input type="number" id="backlog" class="form-control" value="${eduData.backlog}" required></td>
          <td><a class="delete" onclick="removeUpdatedEduRow()">&times</a></td>
        `
      );
      eduBody.append(newRow);
    });
  }
}

function updateRecord(formData) {
  selectedRow.find("td:eq(1)").html(formData.personal.firstName);
  selectedRow.find("td:eq(2)").html(formData.personal.lastName);
  selectedRow.find("td:eq(3)").html(formData.personal.dob);
  selectedRow.find("td:eq(4)").html(formData.personal.email);
  selectedRow.find("td:eq(5)").html(formData.personal.address);
  selectedRow.find("td:eq(6)").html(formData.personal.graduationYear);

  // eduBody.innerHTML = "";
  let id = selectedRow.find("td:eq(0)").html();
  allUserData[id - 1].educational = formData.educational;

  resetForm();

  eduBody.html(`<tr>
  <td><input type="text" class="form-control me-3 my-2" id="degree" value="10th" disabled reqired></td>
  <td><input type="text" class="form-control me-3 my-2" id="school" reqired></td>
  <td><input type="date" class="form-control me-3 my-2" id="startDate" reqired></td><span id="startDateError" class="error d-inline-block text-danger"></span>
  <td><input type="date" class="form-control me-3 my-2" id="passYear" reqired></td>
  <td><input type="number" min="0" max="100" class="form-control me-3 my-2" id="percentage" placeholder="don't use % sign" reqired></td>
  <td><input type="number" min="0" max="10" class="form-control me-3 my-2" id="backlog" placeholder="if any" reqired></td>
  <td class="invisible"></td>
</tr>
<tr>
  <td><input type="text" class="form-control me-3 my-2" id="degree" value="12th" disabled reqired></td>
  <td><input type="text" class="form-control me-3 my-2" id="school" reqired></td>
  <td><input type="date" class="form-control me-3 my-2" id="startDate" reqired></td><span id="startDateError" class="error d-inline-block text-danger"></span>
  <td><input type="date" class="form-control me-3 my-2" id="passYear" reqired></td>
  <td><input type="number" min="0" max="100" class="form-control me-3 my-2" id="percentage" placeholder="don't use % sign" reqired></td>
  <td><input type="number" min="0" max="10" class="form-control me-3 my-2" id="backlog" placeholder="if any" reqired></td>
  <td class="invisible"></td>
</tr>`);

  let modal = $("#staticBackdrop");
  let closeBtn = modal.find('[data-bs-dismiss = "modal"]')
  closeBtn.click();
  submit.innerHTML = "submit";
}

function onDelete(td) {
  if (confirm("Are you sure to delete this record??")) {
    let table = $("#form-table").DataTable();
    let row = $(td).closest('tr');
    let rowData = table.row(row).data();
    let id = rowData[0];

    // Remove the corresponding data from allUserData
    allUserData.splice(id - 1, 1);

    // Delete the row from the DataTable
    table.row(row).remove().draw();
  }
}

function addNewEduRow() { 
  let newEduField = $("<tr></tr>");

  newEduField.html(`
  <td>
    <input type="text" class="form-control" id="degree" required>
    <span id="degreeError" class="error d-inline-block text-danger"></span>
  </td>
  <td>
    <input type="text" class="form-control" id="school" required>
    <span id="schoolError" class="error d-inline-block text-danger"></span>
  </td>
  <td>
    <input type="date" class="form-control" id="startDate" required>
    <span id="startDateError" class="error d-inline-block text-danger"></span>
  </td>
  <td>
    <input type="date" class="form-control" id="passYear" required>
    <span id="passYearError" class="error d-inline-block text-danger"></span>
  </td>
  <td>
    <input type="number" class="form-control" id="percentage"  min="0" max="100" placeholder="Don't use % sign" step="0.01" required>
    <span id="percentageError" class="error d-inline-block text-danger"></span>
  </td>
  <td>
    <input type="number" class="form-control" id="backlog" min="0" placeholder="If Any" required>
    <span id="backlogError" class="error d-inline-block text-danger "></span>
  </td>
  <td>
    <a class="delete" style="cursor: pointer" onclick="removeUpdatedEduRow()">&times</a>
  </td>
    `);
  eduBody.append(newEduField);
}

function removeEduRow() {
  var btn = $(this).parent();
  var grandparent = btn.parent();
  grandparent.remove();
}

function removeUpdatedEduRow() {
  var btn = $(event.target);
  var row = btn.parent().parent();
  row.remove;
}

$(".form-control[required]").on("input change", validate);
