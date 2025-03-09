const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const iconDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
}

// Generate icons for each size
sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#4F46E5'; // Indigo color
    ctx.fillRect(0, 0, size, size);

    // Add text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${size / 4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RX', size / 2, size / 2);

    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(iconDir, `icon-${size}x${size}.png`), buffer);
    console.log(`Generated ${size}x${size} icon`);
}); 