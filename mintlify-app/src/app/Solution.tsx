"use client";

import React, { useEffect, useState } from 'react';

const Solution: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchImage = async () => {
      // Fetch the base64-encoded image from the URL
      const response = await fetch('https://mintlify-assets.b-cdn.net/interview/base64.txt');
      const base64 = await response.text();

      // Create an Image object and set its source to the fetched base64 string
      const img = new Image();
      img.src = `data:image/png;base64,${base64}`;
      img.onload = () => {
        // Create a canvas element to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Get the image data from the canvas
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          // Decode the hidden message from the image data
          const binaryString = decodeImage(imageData);
          // Convert the binary string to a readable ASCII string
          const decodedMessage = binaryToString(binaryString);

          // Set the image source and the decoded message in the state
          setImageSrc(`data:image/png;base64,${base64}`);
          setMessage(decodedMessage);
        }
      };
    };

    fetchImage();
  }, []);

  // Function to decode the hidden message from the image data
  const decodeImage = (imageData: ImageData): string => {
    const { data } = imageData;
    let binaryString = '';
    // Iterate over each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Sum the RGB values of the pixel
      const sum = r + g + b;
      // Calculate the remainder when the sum is divided by 4
      const remainder = sum % 4;

      // The first four pixels are used to verify the order
      if (i / 4 < 4) {
        console.log(remainder); // Should output 0, 1, 2, 3 in order
      } else {
        // Decode the two bits based on the remainder value
        switch (remainder) {
          case 0:
            binaryString += '00';
            break;
          case 1:
            binaryString += '01';
            break;
          case 2:
            binaryString += '10';
            break;
          case 3:
            binaryString += '11';
            break;
        }
      }
    }
    return binaryString;
  };

  // Function to convert a binary string to an ASCII string
  const binaryToString = (binary: string): string => {
    let text = '';
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.slice(i, i + 8);
      text += String.fromCharCode(parseInt(byte, 2));
    }
    return text;
  };

  return (
    <div>
      {imageSrc && <img src={imageSrc} alt="Decoded" />}
      {message && (
        <div style={{ whiteSpace: 'pre-wrap', maxHeight: '80vh', overflowY: 'auto' }}>
          {message.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Solution;
