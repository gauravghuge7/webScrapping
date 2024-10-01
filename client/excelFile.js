const excelFile = document.getElementById('excelFile');

excelFile.addEventListener('change', showData);

function showData(e) {
   const file = e.target.files[0];
   if (file) {
       const reader = new FileReader();
       reader.onload = function(e) {
           const data = new Uint8Array(e.target.result);
           const workbook = XLSX.read(data, { type: 'array' });
           
           // Get the first sheet name and data
           const sheetName = workbook.SheetNames[0];
           const worksheet = workbook.Sheets[sheetName];
           
           // Convert the sheet to JSON
           const jsonData = XLSX.utils.sheet_to_json(worksheet);
           
           // Display the data in a table
           const table = document.getElementById('excel-table');
           let tableHTML = '';

           // Generate table header
           if (jsonData.length > 0) {
               tableHTML += '<tr>';
               Object.keys(jsonData[0]).forEach(key => {
                   tableHTML += '<th>' + key + '</th>';
               });
               tableHTML += '</tr>';
           }

           // Generate table rows
           jsonData.forEach(row => {
               tableHTML += '<tr>';
               Object.values(row).forEach(value => {
                   tableHTML += '<td>' + value + '</td>';
               });
               tableHTML += '</tr>';
           });

           table.innerHTML = tableHTML;
       };
       reader.readAsArrayBuffer(file);
   }
}