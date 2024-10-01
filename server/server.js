const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const url = 'https://www.mahindra.com/';


app.use(cors({
    origin: 'http://127.0.0.1:5500/client/main.html',
}));


// Endpoint to scrape data and write to Excel
app.get('/scrape-and-export', (req, res) => {
    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            // Extract headings, numbers, and image URLs
            const headings = [];
            const numbers = [];
            const imageUrls = [];

            // Get all headings (h1-h6)
            $('h1, h2, h3, h4, h5, h6').each((index, element) => {
                headings.push($(element).text().trim());
            });

            // Extract all numbers from the body text
            const bodyText = $('body').text();
            const matchedNumbers = bodyText.match(/\d+/g) || [];

            // Extract all image URLs
            $('img').each((index, element) => {
                const imgSrc = $(element).attr('src');
                if (imgSrc) {
                    imageUrls.push(imgSrc);
                }
            });

            // Prepare data for Excel
            const detailedData = [['Headings', 'Numbers', 'Image URLs']]; // Header

            const maxLength = Math.max(headings.length, matchedNumbers.length, imageUrls.length);
            for (let i = 0; i < maxLength; i++) {
                detailedData.push([
                    headings[i] || '',   // Column A: Headings
                    matchedNumbers[i] || '',  // Column B: Numbers
                    imageUrls[i] || ''    // Column C: Image URLs
                ]);
            }

            // Create Excel workbook and worksheet
            const wb = xlsx.utils.book_new();
            const ws_detailed = xlsx.utils.aoa_to_sheet(detailedData);
            xlsx.utils.book_append_sheet(wb, ws_detailed, 'Detailed Data');

            // Save the Excel file to the server
            const excelPath = path.join(__dirname, 'public', 'website_data_detailed.xlsx');
            xlsx.writeFile(wb, excelPath);

            // Send response indicating that the file was created
            res.send({ message: 'Excel file created', filePath: '/website_data_detailed.xlsx' });
        })
        .catch(error => {
            console.error('Error scraping webpage:', error);
            res.status(500).send('Error scraping the webpage');
        });
});

// Serve static files from the public folder
app.use(express.static('public'));

// Endpoint to download Excel file
app.get('/download-excel', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'website_data_detailed.xlsx');
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
