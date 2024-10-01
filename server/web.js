const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');

const url = 'https://www.mahindra.com/';

const getDataFromWeb = () => {

  axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Extract all headings
      const headings = [];
      $('h1, h2, h3, h4, h5, h6').each((index, element) => {
        headings.push($(element).text().trim());
      });

      // Extract all numbers
      const bodyText = $('body').text();
      const numbers = bodyText.match(/\d+/g) || [];

      // Extract all image URLs
      const imageUrls = [];
      $('img').each((index, element) => {
        const imgSrc = $(element).attr('src');
        if (imgSrc) {
          imageUrls.push(imgSrc);
        }
      });

      // Create a new workbook for Excel
      const wb = xlsx.utils.book_new();

      // Create detailed data structure
      const detailedData = [['Headings', 'Numbers', 'Image URLs']]; // Header

      const maxLength = Math.max(headings.length, numbers.length, imageUrls.length);
      
      for (let i = 0; i < maxLength; i++) {
        detailedData.push([
          headings[i] || '', // Heading in Column A
          numbers[i] || '',  // Number in Column B
          imageUrls[i] || '' // Image URL in Column C
        ]);
      }

      // Create the detailed sheet
      const ws_detailed = xlsx.utils.aoa_to_sheet(detailedData);
      xlsx.utils.book_append_sheet(wb, ws_detailed, 'Detailed Data');

      // Write the Excel file
      xlsx.writeFile(wb, 'website_data_detailed.xlsx');
      console.log('Excel file "website_data_detailed.xlsx" has been created.');
    })
    .catch(error => {
      console.error('Error fetching the webpage:', error.message);
    });

}

getDataFromWeb();  // get the data from the web


module.exports = {
  getDataFromWeb
}
