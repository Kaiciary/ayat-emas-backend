const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const cors = require('cors');
let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'mysql-ayatemas-ayat-emas.l.aivencloud.com',
    port: 20829,
    user: 'avnadmin',
    password: 'AVNS_bfXGEmHApXm9Xzk5RtC',
    database: 'db_ayatemas',
  });

  // Attempt to connect
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      setTimeout(handleDisconnect, 2000); // Reattempt connection after 2 seconds
    } else {
      console.log('Database connected successfully');
    }
  });

  // Handle connection errors
  connection.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Reconnecting to database...');
      handleDisconnect(); // Reconnect if connection was lost
    } else {
      throw err; // Throw other errors
    }
  });
}

// Initialize connection
handleDisconnect();

app.use(cors());

app.use(bodyParser.json());
/* Middleware */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});


/* Start server */
app.listen(process.env.PORT || 3000, function () {
  console.log(
    'Express server listening on port %d in %s mode',
    this.address().port,
    app.settings.env
  );
});

/* API endpoint */
app.get('/getAyatEmas', (req, res) => {
  const sql = 'SELECT * FROM tbl_ayat';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

app.post('/download-ayat', (req, res) => {
  const { title, content, resolution } = req.body;
  // Register the Gotham font
  registerFont(__dirname + '/assets/fonts/Gotham-Book.otf', { family: 'Gotham' });
  if (resolution == 'mobile') {

    const width = 1242;
    const height = 2680;
    const padding = 60;
    const lineHeight = 70;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Load the background image
    loadImage('assets/images/background_magelang_potrait_1242x2688.jpg')  // You can also use a URL instead of a file path
      .then((image) => {
        // Draw the image as the background
        ctx.drawImage(image, 0, 0, width, height);  // Adjust size as needed

        // Set the text properties
        const titles = title;
        ctx.font = 'bold 72px Sans';  // Use the Gotham font
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';   // Adjust text color for better visibility
        ctx.textBaseline = 'middle';
        ctx.fillText(titles, width / 2, height * 0.30);

        // Function to wrap and draw text with padding
        function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
          const words = text.split(' ');
          let line = '';
          let yOffset = y;

          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const testWidth = ctx.measureText(testLine).width;

            if (testWidth > maxWidth && i > 0) {
              ctx.fillText(line, x, yOffset); // Draw the current line
              line = words[i] + ' '; // Start a new line with the current word
              yOffset += lineHeight; // Move to the next line
            } else {
              line = testLine;
            }
          }
          // Draw the last line
          if (line) {
            ctx.fillText(line, x, yOffset);
          }
        }
        // Draw the content
        const contents = content;
        ctx.font = '48px Sans';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left'; // Left-align the content text
        const contentStartX = padding; // Start with padding from the left
        const contentStartY = height * 0.34; // Vertical start position
        const contentMaxWidth = width - padding * 2; // Width within padded area
        wrapText(ctx, contents, contentStartX, contentStartY, contentMaxWidth, lineHeight);

        // Send the image buffer as the response (if in an Express route)
        const buffer = canvas.toBuffer('image/png');

        // If in an Express route, send the buffer directly
        res.set('Content-Type', 'image/png');
        res.set('Content-Disposition', 'attachment; filename="Ayat_Emas_Mobile.png"');
        res.send(buffer);
      })
      .catch((error) => {
        console.error('Error loading image:', error);
      });
  } else if (resolution == "tablet") {
    const width = 2304;
    const height = 3072;
    const padding = 120;
    const lineHeight = 120;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    // Load the background image
    loadImage('assets/images/background_magelang_potrait_2304x3072.jpg')  // You can also use a URL instead of a file path
      .then((image) => {

        // Draw the image as the background
        ctx.drawImage(image, 0, 0, width, height);  // Adjust size as needed

        // Set the text properties
        const titles = title;
        ctx.font = 'bold 96px Sans';  // Use the Gotham font
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';   // Adjust text color for better visibility
        ctx.textBaseline = 'middle';
        ctx.fillText(titles, width / 2, height * 0.34);

        // Function to wrap and draw text with padding
        function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
          const words = text.split(' ');
          let line = '';
          let yOffset = y;

          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const testWidth = ctx.measureText(testLine).width;

            if (testWidth > maxWidth && i > 0) {
              ctx.fillText(line, x, yOffset); // Draw the current line
              line = words[i] + ' '; // Start a new line with the current word
              yOffset += lineHeight; // Move to the next line
            } else {
              line = testLine;
            }
          }
          // Draw the last line
          if (line) {
            ctx.fillText(line, x, yOffset);
          }
        }
        // Draw the content
        const contents = content;
        ctx.font = '72px Sans';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left'; // Left-align the content text
        const contentStartX = padding; // Start with padding from the left
        const contentStartY = height * 0.40; // Vertical start position
        const contentMaxWidth = width - padding * 2; // Width within padded area
        wrapText(ctx, contents, contentStartX, contentStartY, contentMaxWidth, lineHeight);

        // Send the image buffer as the response (if in an Express route)
        const buffer = canvas.toBuffer('image/png');

        // If in an Express route, send the buffer directly
        res.set('Content-Type', 'image/png');
        res.set('Content-Disposition', 'attachment; filename="Ayat_Emas_Tablet.png"');
        res.send(buffer);
      })
      .catch((error) => {
        console.error('Error loading image:', error);
      });
  }

  else if (resolution == "dekstop") {
    const width = 3840;
    const height = 2160;
    const padding = 120;
    const lineHeight = 120;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    // Load the background image
    loadImage('assets/images/background ayat emas landscape.png')  // You can also use a URL instead of a file path
      .then((image) => {

        // Draw the image as the background
        ctx.drawImage(image, 0, 0, width, height);  // Adjust size as needed

        // Set the text properties
        const titles = title;
        ctx.font = 'bold 96px Sans';  // Use the Gotham font
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';   // Adjust text color for better visibility
        ctx.textBaseline = 'middle';
        ctx.fillText(titles, width / 2, height * 0.34);

        // Function to wrap and draw text with padding
        function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
          const words = text.split(' ');
          let line = '';
          let yOffset = y;

          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const testWidth = ctx.measureText(testLine).width;

            if (testWidth > maxWidth && i > 0) {
              ctx.fillText(line, x, yOffset); // Draw the current line
              line = words[i] + ' '; // Start a new line with the current word
              yOffset += lineHeight; // Move to the next line
            } else {
              line = testLine;
            }
          }
          // Draw the last line
          if (line) {
            ctx.fillText(line, x, yOffset);
          }
        }
        // Draw the content
        const contents = content;
        ctx.font = '72px Sans';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left'; // Left-align the content text
        const contentStartX = padding; // Start with padding from the left
        const contentStartY = height * 0.40; // Vertical start position
        const contentMaxWidth = width - padding * 2; // Width within padded area
        wrapText(ctx, contents, contentStartX, contentStartY, contentMaxWidth, lineHeight);

        // Send the image buffer as the response (if in an Express route)
        const buffer = canvas.toBuffer('image/png');

        // If in an Express route, send the buffer directly
        res.set('Content-Type', 'image/png');
        res.set('Content-Disposition', 'attachment; filename="Ayat_Emas_Desktop.png"');
        res.send(buffer);
      })
      .catch((error) => {
        console.error('Error loading image:', error);
      });
  }
});