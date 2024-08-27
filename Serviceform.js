
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Submit the form
  this.submit();
       
// Reset the form after submission
this.reset();
//   });
});



function showMachineCodeInput() {
var selectedMachineType = document.getElementById("MachineType").value; // machine types select here
var machineCodeInput = document.getElementById("machineCodeInput");

if (selectedMachineType !== "") {
machineCodeInput.style.display = "block";
} else {
machineCodeInput.style.display = "none";
}
}


function showServiceCodeInput() {
var selectedServiceType = document.getElementById("ServiceType").value; // Service types select here
var ServiceCodeInput = document.getElementById("ServiceCodeInput");

if (selectedServiceType !== "") {
ServiceCodeInput.style.display = "block";
} else {
ServiceCodeInput.style.display = "none";
}
}


// Get references to the input elements
var startDateInput = document.getElementById('Start-Date');
var endDateInput = document.getElementById('End-Date');
var totalWorkingDaysInput = document.getElementById('Total-Working-Days');
var workingDaysDiv = document.getElementById('workingDays');

// Add event listeners to handle date validation and calculate working days
startDateInput.addEventListener('input', handleDateChange);
endDateInput.addEventListener('input', handleDateChange);
totalWorkingDaysInput.addEventListener('input', handleTotalDaysChange);

function handleDateChange() {
    var startDate = new Date(startDateInput.value);
    var endDate = new Date(endDateInput.value);

    // Check if the start date or end date is invalid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        totalWorkingDaysInput.value = ''; // Clear the input value
        workingDaysDiv.textContent = 'Total Number of days: 0';
        return;
    }

    // Check if the selected end date is less than the start date
    if (endDate < startDate) {
        alert('End date cannot be less than the start date.');
        endDateInput.value = ''; // Clear the input value
    } else {
        var totalDays = calculateTotalDays(startDate, endDate);
        totalWorkingDaysInput.value = totalDays; // Update total number of days
        var workingDays = calculateWorkingDays(startDate, endDate);
        workingDaysDiv.textContent = 'Total Number of days: ' + workingDays;
    }
}

function handleTotalDaysChange() {
    var totalDays = parseInt(totalWorkingDaysInput.value, 10);
    var startDate = new Date(startDateInput.value);
    var endDate = new Date(endDateInput.value);
    var workingDays = calculateWorkingDays(startDate, endDate);

    if (isNaN(totalDays) || totalDays < 1) {
        alert('Total days must be at least 1.');
        totalWorkingDaysInput.value = ''; // Clear the input value
    } else if (totalDays > workingDays) {
        alert('Total days cannot be greater than total working days.');
        totalWorkingDaysInput.value = workingDays; // Set the value to the maximum allowed
    }
}

function calculateTotalDays(startDate, endDate) {
    // Calculate the difference in milliseconds between the two dates
    var difference = Math.abs(endDate - startDate);

    // Convert the difference to days
    var daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return daysDifference + 1; // Add 1 to include both start and end dates
}

function calculateWorkingDays(startDate, endDate) {
    // Calculate the difference in milliseconds between the two dates
    var difference = Math.abs(endDate - startDate);

    // Convert the difference to days
    var daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return daysDifference + 1; // Add 1 to include both start and end dates as working days
}

let selectedAreaProblems = {};

// Define problems for each area
const problemsByArea = {
  TRAINING: ["APPLICATION TRAINING", "OPERATIONAL TRAINING", "SOFTWARE TRAINING", "NESTING TRAINING", "OTHERS"],
  MACHINE: ["DRIVE ALARM", "HARD LIMIT ALARM", "ZIG ZAG CUTTING", "CAPACITANCE SENSOR", "AXIS SENSOR", "OTION NOISE", "GAS PRESSURE ALARM", "AXIS SODT LIMIT", "GAS LEAKAGE", "GAS FLOW", "DIAGONAL", "COMMUNICATION BREAK", "OVALITY / CIRCULARITY", "EPR ISSUE", "OTHERS"],
  PALLET_SYSTEM: ["NO PALLET MOVEMENT", "PALLET A/B LIMIT ALARM", "PALLET SPEED PROBLEM", "PALLET SLOW LIMIT NOT WORKING", "PALLET CRASHING WITH LOCKING SYSTEM/STOPPER", "PALLET MAKING NOISE DURING MOVEMENT", "PPALLET CHAIN BROKEN", "PALLET CLAMPING ISSUE", "CHAIN GUIDE WEAR OUT/DAMAGE", "PALLET MOTOR MAKING NOICE", "VFD SHOWING ERROR", "PALLET RAIL AND WHEELS", "OTHERS"],
  CUTTING_HEAD: ["OPTICAL", "FREQLENT PROTECTION GAS DAMAGE","CERAMIC BRAKING","TRA PLATE DAMAGE","HEAD SENSING","HEAD TIP TOUCH","HEAD TEMPERATURE RISE / FALL","CAPACITANCE CALIBRATION","HEAD TEMPERATURE ALARM","HEAD CALIBRATION ","OTHERS"],
  SOFTWARE: ["SOFTWARE NOT BOOTING UP", "LICENSE EXPIRE","PLC NOT RUNNING", "HMI PARAMETER GOT CHANGED","GHOST INSTALL","HMI MALFUNCTION","HMI GOT STUCK","CUTTING LAYER NOT WORKING","HMI LANGUAGE GOT CHANGED","UNWANTED ALARMS GENERATED","NO LOADING PARAMETERS","CUTTING LAYER NOT WORKING","MATERIAL BURNING","FLIM CUT","OTHERS"],
  LASER: ["CRITICAL ERROR", "FIBER INTERLOCK","PS ALARM","LOW TEMPERATURE ALARM","HIGH TEMPERATUE ALARM","OVERHEAT","BACK REFLECTION","AIMING BEAM ALARM","PS FAILURE","OTHERS"],
  CHILLER: ["LOW TEMPERATURE", "WATER LEAKAGE","WATER PUMP CREATING LOUD NOICE","FAN NOT WORKING","COMPRESSOR NOT WORKING","WATER LEVEL ALARM","COMPRESSOR MAKING LOUD NOICE","BIG TANK WATER PUMP NOT WORKING","SMALL TANK WATER PUMP NOT WORKING","OTHERS"],
  EXHAUST_SUCTION: ["BLOWER / FUME EXTRACTOR MCB TRIPPING", "SMOKE FROM BLOWER MOTOR","PLC NOT TURNING ON (FUME EXTACTOR)","SOLENOID VALVE NOT OPERATING","PURGE STORE CYCLE ISSSUE","AUTP FILTER CLEANING ","NO SUCTION ON UPPER PALLET","NO SUCTION ON BOTH PALLET","FLAPS NOT OPERATING","MULTIPLE FLAPS OPENING SAME TIME","OTHERS"],
  NESTING_SOFTWARE: ["COMMON CUT", "SIGMANEST SOFTWARE INSTALLATION","E-CAT SOFTWARE INSTALLATION","POST ERROR","NC FILE NOT GENETRAING","DXF / DWG FILE IMPORT","REPORT GENERATION","NC FILE WRONG STRUCTURE","OTHERS"],
  CUTTING_APPLICATIONS: ["OTHERS"],
  OTHER_TYPE_ISSUES: ["OTHERS"],
  // Add problems for other areas here
};

// Function to update selected areas
function updateSelectedAreas() {
const selectedAreas = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
let problemsHtml = '';

selectedAreaProblems = {}; // Reset selected problems object

// Join selected areas with commas directly
const selectedAreasString = selectedAreas.join(',');

selectedAreas.forEach(area => {
problemsHtml += `<h3>${area}</h3>`;
problemsHtml += '<div>';
problemsHtml += problemsByArea[area].map((problem, index) => {
  return `<label><input type="checkbox" id="${problem}_${index}" name="${area}" value="${problem}" onchange="updateSelectedAreaProblem('${area}')"> ${problem}</label><br>`;
}).join('');
problemsHtml += '</div>';
});
document.getElementById('problems').innerHTML = problemsHtml;
document.getElementById('problemSelection').style.display = selectedAreas.length > 0 ? 'block' : 'none';

// Set the value of the selected areas as a comma-separated string
document.getElementById('selectArea').value = selectedAreasString;
}


function updateSelectedAreaProblem(selectedArea) {
const selectedProblems = Array.from(document.querySelectorAll('input[name="' + selectedArea + '"][type="checkbox"]:checked')).map(checkbox => checkbox.value);
selectedAreaProblems[selectedArea] = selectedProblems;

let temp = [];
Object.values(selectedAreaProblems).forEach(problems => {
temp = temp.concat(problems);
});

// Join selected problems with commas directly
document.getElementById('selectedProblems').value = temp.join(',');
}


  // Generate a GUID
  function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to map GUID to employeeId (can use localStorage or sessionStorage)
function setGuidToEmpIdMapping(guid, empId) {
    sessionStorage.setItem(guid, empId);
}

// Function to get employeeId from GUID
function getEmployeeIdFromGuid(guid) {
    return sessionStorage.getItem(guid);
}

// Function to fetch engineer name based on employeeId
function fetchEngineerName(empId) {
    fetch('https://script.google.com/macros/s/AKfycbz22oMHNJRDu-wE3UPTXzyXsyg6WlZJGehuR2fVs5Ub7dpzFEQ9X_f0tNTDgkc5ytuoLA/exec?empId=' + empId)
    .then(response => response.json())
    .then(data => {
        if (data.engineer_Name) {
            document.getElementById('Engineer Name').value = data.engineer_Name;
        } else {
            alert('Engineer name not found for employee ID ' + empId);
            document.getElementById('Engineer Name').value = '';
        }
    })
    .catch(error => console.error('Error:', error));
}

// Initialize and handle GUID to employeeId mapping
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    let empId = urlParams.get('employeeId');
    let guid = urlParams.get('guid');

    if (guid) {
        // Retrieve employeeId from GUID
        empId = getEmployeeIdFromGuid(guid);
    } else if (empId) {
        // Generate a new GUID and set mapping
        guid = generateGuid();
        setGuidToEmpIdMapping(guid, empId);
        // Update URL with GUID
        urlParams.delete('employeeId');
        urlParams.set('guid', guid);
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.replaceState(null, '', newUrl);
    }

    if (empId) {
        document.getElementById('EmpID').value = empId;
        fetchEngineerName(empId);
    }
});

// Fetch engineer name when the employeeId input loses focus (if manually entered)
document.getElementById('EmpID').addEventListener('blur', function() {
    var empId = this.value;
    fetchEngineerName(empId);
});
// image preview
function previewImage(event) {
  var preview = document.getElementById('preview');
  preview.style.display = "block";
  preview.src = URL.createObjectURL(event.target.files[0]);

  var file = event.target.files[0];
  var maxSize = 1024; // Maximum image size in KB
  compressImage(file, maxSize, function (compressedFile) {
    convertImageToBase64(compressedFile, function (base64) {
      document.getElementById('imageBase64').value = base64;
    });
  });
}

function convertImageToBase64(file, callback) {
  var reader = new FileReader();
  reader.onloadend = function () {
    var base64data = reader.result.split(',')[1];
    callback(base64data);
  };
  reader.readAsDataURL(file);
}

function compressImage(file, maxSize, callback) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var img = new Image();
    img.src = event.target.result;
    img.onload = function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var maxWidth = 800;
      var maxHeight = 600;
      var width = img.width;
      var height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(function (blob) {
        callback(new File([blob], file.name));
      }, 'image/jpeg', 0.7); // 0.7 is the image quality
    };
  };
  reader.readAsDataURL(file);
}

// remove white spaces
function toUpperCaseAndRemoveWhitespace(event) {
  // Convert to uppercase and remove whitespace
  event.target.value = event.target.value.toUpperCase().replace(/\s+/g, '');
}

//convert UpperCase
function toUpperCaseInput(event) {
  event.target.value = event.target.value.toUpperCase();
}
function toUpperCaseInput(event) {
  event.target.value = event.target.value.toUpperCase();
  fetchCompanies(event.target.value);
}

  // function fetchCompanies(searchTerm) {
  //   var xhr = new XMLHttpRequest();
  //   xhr.open('GET', 'https://script.google.com/macros/s/AKfycbyZrjBVBl7LS23H0yXDMhX-miDxtweqtfQ05ewKEUvBKcUVVcxdu-ufpMlyXqD7oa6dCA/exec?searchTerm=' + encodeURIComponent(searchTerm), true);
  //   xhr.onload = function() {
  //     if (xhr.status === 200) {
  //       var companies = JSON.parse(xhr.responseText);
  //       companies.push('OTHERS'); // Add "OTHERS" option
  //       updateDropdown(companies, 'companyDropdown', 'CompanyName');
  //     }
  //   };
  //   xhr.send();
  // }
  
  // function updateDropdown(items, dropdownId, inputId) {
  //   var dropdown = document.getElementById(dropdownId);
  //   var errorDiv = document.getElementById('companyError');
  //   dropdown.innerHTML = '';
  
  //   if (items.length > 0) {
  //     dropdown.style.display = 'block';
  //     errorDiv.style.display = 'none';
  
  //     items.forEach(function(item) {
  //       var displayText = (typeof item === 'object') ? item.serialNumber : item;
  
  //       var div = document.createElement('div');
  //       div.classList.add('dropdown-item');
  //       div.textContent = displayText;
  //       div.onclick = function() {
  //         document.getElementById(inputId).value = displayText;
  //         dropdown.style.display = 'none';
  //         if (inputId === 'CompanyName') {
  //           if (displayText === 'OTHERS') {
  //             enableEditing();
  //           } else {
  //             disableEditing();
  //             fetchMachineDetails(displayText);
  //           }
  //         } else if (inputId === 'MachineSerialNumber') {
  //           fetchAddress(displayText);
  //         }
  //       };
  //       dropdown.appendChild(div);
  //     });
  //   } else {
  //     dropdown.style.display = 'none';
  //     errorDiv.style.display = 'block';
  //   }
  // }
  
  // function enableEditing() {
  //   document.getElementById('OtherCompanyNameGroup').style.display = 'block';
  //   document.getElementById('MachineSerialNumber').removeAttribute('readonly');
  //   document.getElementById('CompanyAddress').removeAttribute('readonly');
  //   document.getElementById('LaserPower').removeAttribute('readonly'); // Make LaserPower editable
  //   document.getElementById('MachineSerialNumber').value = '';
  //   document.getElementById('CompanyAddress').value = '';
  //   document.getElementById('LaserPower').value = ''; // Clear LaserPower field
  // }
  
  // function disableEditing() {
  //   document.getElementById('OtherCompanyNameGroup').style.display = 'none';
  //   document.getElementById('MachineSerialNumber').setAttribute('readonly', true);
  //   document.getElementById('CompanyAddress').setAttribute('readonly', true);
  //   // document.getElementById('LaserPower').setAttribute('readonly', true); // Make LaserPower read-only
  // }
  
  // function fetchMachineDetails(companyName) {
  //   var xhr = new XMLHttpRequest();
  //   xhr.open('GET', 'https://script.google.com/macros/s/AKfycbyZrjBVBl7LS23H0yXDMhX-miDxtweqtfQ05ewKEUvBKcUVVcxdu-ufpMlyXqD7oa6dCA/exec?companyName=' + encodeURIComponent(companyName), true);
  //   xhr.onload = function() {
  //     if (xhr.status === 200) {
  //       var machineDetails = JSON.parse(xhr.responseText);
  //       if (machineDetails.length === 1) {
  //         // Auto-select if only one machine serial number is available
  //         document.getElementById('MachineSerialNumber').value = machineDetails[0].serialNumber;
  //         fetchAddress(machineDetails[0].serialNumber);
  //         document.getElementById('machineDropdown').style.display = 'none';
  //       } else {
  //         updateDropdown(machineDetails, 'machineDropdown', 'MachineSerialNumber');
  //       }
  //     } else {
  //       console.error('Failed to fetch machine details:', xhr.statusText);
  //     }
  //   };
  //   xhr.onerror = function() {
  //     console.error('Request failed');
  //   };
  //   xhr.send();
  // }
  
  // function fetchAddress(machineSerialNumber) {
  //   var xhr = new XMLHttpRequest();
  //   xhr.open('GET', 'https://script.google.com/macros/s/AKfycbyZrjBVBl7LS23H0yXDMhX-miDxtweqtfQ05ewKEUvBKcUVVcxdu-ufpMlyXqD7oa6dCA/exec?machineSerialNumber=' + encodeURIComponent(machineSerialNumber), true);
  //   xhr.onload = function() {
  //     if (xhr.status === 200) {
  //       var addressDetails = JSON.parse(xhr.responseText);
  //       document.getElementById('CompanyAddress').value = addressDetails.address;
  //       document.getElementById('LaserPower').value = addressDetails.laserPower; // Populate the Laser Power field
  //        document.getElementById('LaserPower').removeAttribute('readonly'); // Ensure LaserPower remains editable
    
  //     } else {
  //       console.error('Failed to fetch address:', xhr.statusText);
  //     }
  //   };
  //   xhr.onerror = function() {
  //     console.error('Request failed');
  //   };
  //   xhr.send();
  // }
  
  // document.addEventListener('click', function(event) {
  //   var companyDropdown = document.getElementById('companyDropdown');
  //   var machineDropdown = document.getElementById('machineDropdown');
    
  //   if (!companyDropdown.contains(event.target) && event.target.id !== 'CompanyName') {
  //     companyDropdown.style.display = 'none';
  //   }
    
  //   if (!machineDropdown.contains(event.target) && event.target.id !== 'MachineSerialNumber') {
  //     machineDropdown.style.display = 'none';
  //   }
  // });
  
  // document.getElementById('CompanyName').addEventListener('focus', function() {
  //   var dropdown = document.getElementById('companyDropdown');
  //   if (dropdown.children.length > 0) {
  //     dropdown.style.display = 'block';
  //   }
  // });
  
  // document.getElementById('MachineSerialNumber').addEventListener('focus', function() {
  //   var dropdown = document.getElementById('machineDropdown');
  //   if (dropdown.children.length > 0) {
  //     dropdown.style.display = 'block';
  //   }
  // });
  function fetchCompanies(searchTerm) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://script.google.com/macros/s/AKfycbyZrjBVBl7LS23H0yXDMhX-miDxtweqtfQ05ewKEUvBKcUVVcxdu-ufpMlyXqD7oa6dCA/exec?searchTerm=' + encodeURIComponent(searchTerm), true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var companies = JSON.parse(xhr.responseText);
            companies.push('OTHERS'); // Add "OTHERS" option
            updateDropdown(companies, 'companyDropdown', 'CompanyName');
        }
    };
    xhr.send();
}

function updateDropdown(items, dropdownId, inputId) {
    var dropdown = document.getElementById(dropdownId);
    var errorDiv = document.getElementById('companyError');
    dropdown.innerHTML = '';

    if (items.length > 0) {
        dropdown.style.display = 'block';
        errorDiv.style.display = 'none';

        items.forEach(function(item) {
            var displayText = (typeof item === 'object') ? item.serialNumber : item;

            var div = document.createElement('div');
            div.classList.add('dropdown-item');
            div.textContent = displayText;
            div.onclick = function() {
                document.getElementById(inputId).value = displayText;
                dropdown.style.display = 'none';
                if (inputId === 'CompanyName') {
                    if (displayText === 'OTHERS') {
                        enableEditing();
                    } else {
                        disableEditing();
                        fetchMachineDetails(displayText);
                    }
                } else if (inputId === 'MachineSerialNumber') {
                    fetchAddress(displayText);
                }
            };
            dropdown.appendChild(div);
        });
    } else {
        dropdown.style.display = 'none';
        errorDiv.style.display = 'block';
    }
}
function enableEditing() {
  document.getElementById('OtherCompanyNameGroup').style.display = 'block';
  document.getElementById('MachineSerialNumber').removeAttribute('readonly');
  document.getElementById('CompanyAddress').removeAttribute('readonly');
  document.getElementById('LaserPower').removeAttribute('readonly'); // Make LaserPower editable
  document.getElementById('MachineSerialNumber').value = '';
  document.getElementById('CompanyAddress').value = '';
  document.getElementById('LaserPower').value = ''; // Clear LaserPower field

  // Add event listeners to convert to uppercase
  var fields = ['CompanyName', 'MachineSerialNumber', 'LaserPower', 'CompanyAddress', 'OtherCompanyName'];
  fields.forEach(function(fieldId) {
      var field = document.getElementById(fieldId);
      field.addEventListener('input', convertToUppercase);
      // Convert existing value to uppercase
      field.value = field.value.toUpperCase();
  });
}

function convertToUppercase(event) {
  event.target.value = event.target.value.toUpperCase();
}


function disableEditing() {
    document.getElementById('OtherCompanyNameGroup').style.display = 'none';
    document.getElementById('MachineSerialNumber').setAttribute('readonly', true);
    document.getElementById('CompanyAddress').setAttribute('readonly', true);
    // document.getElementById('LaserPower').setAttribute('readonly', true); // Make LaserPower read-only

    // Remove the event listeners
    var fields = ['CompanyName', 'MachineSerialNumber', 'LaserPower', 'CompanyAddress'];
    fields.forEach(function(fieldId) {
        var field = document.getElementById(fieldId);
        field.removeEventListener('input', convertToUppercase);
    });
}

function convertToUppercase(event) {
    event.target.value = event.target.value.toUpperCase();
}

function fetchMachineDetails(companyName) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://script.google.com/macros/s/AKfycbyZrjBVBl7LS23H0yXDMhX-miDxtweqtfQ05ewKEUvBKcUVVcxdu-ufpMlyXqD7oa6dCA/exec?companyName=' + encodeURIComponent(companyName), true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var machineDetails = JSON.parse(xhr.responseText);
            if (machineDetails.length === 1) {
                // Auto-select if only one machine serial number is available
                document.getElementById('MachineSerialNumber').value = machineDetails[0].serialNumber;
                fetchAddress(machineDetails[0].serialNumber);
                document.getElementById('machineDropdown').style.display = 'none';
            } else {
                updateDropdown(machineDetails, 'machineDropdown', 'MachineSerialNumber');
            }
        } else {
            console.error('Failed to fetch machine details:', xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send();
}

function fetchAddress(machineSerialNumber) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://script.google.com/macros/s/AKfycbyZrjBVBl7LS23H0yXDMhX-miDxtweqtfQ05ewKEUvBKcUVVcxdu-ufpMlyXqD7oa6dCA/exec?machineSerialNumber=' + encodeURIComponent(machineSerialNumber), true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var addressDetails = JSON.parse(xhr.responseText);
            document.getElementById('CompanyAddress').value = addressDetails.address;
            document.getElementById('LaserPower').value = addressDetails.laserPower; // Populate the Laser Power field
            document.getElementById('LaserPower').removeAttribute('readonly'); // Ensure LaserPower remains editable

        } else {
            console.error('Failed to fetch address:', xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send();
}

document.addEventListener('click', function(event) {
    var companyDropdown = document.getElementById('companyDropdown');
    var machineDropdown = document.getElementById('machineDropdown');

    if (!companyDropdown.contains(event.target) && event.target.id !== 'CompanyName') {
        companyDropdown.style.display = 'none';
    }

    if (!machineDropdown.contains(event.target) && event.target.id !== 'MachineSerialNumber') {
        machineDropdown.style.display = 'none';
    }
});

document.getElementById('CompanyName').addEventListener('focus', function() {
    var dropdown = document.getElementById('companyDropdown');
    if (dropdown.children.length > 0) {
        dropdown.style.display = 'block';
    }
});

document.getElementById('MachineSerialNumber').addEventListener('focus', function() {
    var dropdown = document.getElementById('machineDropdown');
    if (dropdown.children.length > 0) {
        dropdown.style.display = 'block';
    }
});
