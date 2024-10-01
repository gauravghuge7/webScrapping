const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // For scraping
const { create } = require('xmlbuilder2'); // For generating XML

const app = express();

// Route to fetch data, convert it to XML, and serve it on the dashboard
app.get('/data', async (req, res) => {
    try {
        // Example URL for scraping (adjust accordingly)
        const url = 'https://www.mahindra.com/';
        const response = await axios.get(url);

        // Load the HTML into cheerio for parsing
        const $ = cheerio.load(response.data);

        // Example: Extract all h1 tags (customize as needed)
        const data = [];
        $('h1').each((index, element) => {
            data.push($(element).text());
        });

        // Create XML structure using xmlbuilder2
        const root = create({ version: '1.0' })
            .ele('DashboardData');

        data.forEach((item, index) => {
            root.ele('Item')
                .ele('ID').txt(index + 1).up()
                .ele('Content').txt(item).up();
        });

        // Convert the XML tree to a string
        const xmlData = root.end({ prettyPrint: true });

        // Send XML as the response
        res.set('Content-Type', 'text/xml');
        res.send(xmlData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching or processing data');
    }
});

// Simple dashboard route to display the XML content
app.get('/', async (req, res) => {
    const xmlUrl = '/data';
    res.send(`
    <html>
    <head><title>XML Dashboard</title></head>
    <body>
      <h1>Data from XML</h1>
      <div id="xml-content"></div>
      <script>
        // Fetch XML data from the server and display it
        fetch('${xmlUrl}')
          .then(response => response.text())
          .then(xml => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");
            const items = xmlDoc.getElementsByTagName("Item");
            let html = "<ul>";
            for (let i = 0; i < items.length; i++) {
              const content = items[i].getElementsByTagName("Content")[0].textContent;
              html += "<li>" + content + "</li>";
            }
            html += "</ul>";
            document.getElementById("xml-content").innerHTML = html;
          })
          .catch(error => console.error("Error loading XML:", error));
      </script>
    </body>
    </html>
    `);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
