// Simulated data for the dashboard
const dashboardData = {
   totalUsers: 1200,
   activeSessions: 230,
   revenue: '$8,400',
   pendingTasks: 12,
};

// Load dashboard data when the page loads
window.onload = function () {
   // Display simulated data in cards
   document.getElementById('totalUsers').innerText = dashboardData.totalUsers;
   document.getElementById('activeSessions').innerText = dashboardData.activeSessions;
   document.getElementById('revenue').innerText = dashboardData.revenue;
   document.getElementById('pendingTasks').innerText = dashboardData.pendingTasks;

   // Simulated data for table (you can replace this with dynamic data)
   const tableData = [
       { heading: 'Heading 1', number: '123', imageUrl: 'image1.jpg' },
       { heading: 'Heading 2', number: '456', imageUrl: 'image2.jpg' },
       { heading: 'Heading 3', number: '789', imageUrl: 'image3.jpg' },
   ];

   // Display the table data
   const tableBody = document.querySelector('#dataTable tbody');
   tableData.forEach((row) => {
       const tr = document.createElement('tr');
       tr.innerHTML = `
           <td>${row.heading}</td>
           <td>${row.number}</td>
           <td>${row.imageUrl}</td>
       `;
       tableBody.appendChild(tr);
   });
};
