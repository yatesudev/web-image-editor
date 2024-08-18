 import {Config} from './config.js';

const canvas = document.getElementById('imageCanvas');
const context = canvas.getContext('2d', { willReadFrequently: true });

export const editControls = {
    init: function(){

        //REGISTER ELEMENTS
        const invertBtn = document.getElementById('invert');
        const imgToGrayscaleBtn = document.getElementById('grayscale');

        const brightenBtn = document.getElementById('brighten');
        const darkenBtn = document.getElementById('darken');

        const applyGaussianFilter3x3Btn = document.getElementById('gaussianBlur3x3');
        const applyGaussianFilter5x5Btn = document.getElementById('gaussianBlur5x5');

        const edgeDetectionWithSobelBtn = document.getElementById('edgeDetection');

        const rotateClockwiseBtn = document.getElementById('rotateClockwise');
        const rotateCounterClockwiseBtn = document.getElementById('rotateCounterClockwise');

        const rotateCustom = document.getElementById('rotateCustom');

        const horizontalMirrorBtn = document.getElementById('horizontalMirror');
        const verticalMirrorBtn = document.getElementById('verticalMirror');

        const blackWhiteSlider = document.getElementById('blackWhiteSlider');
        const contrastSlider = document.getElementById('contrastSlider');

        const redSlider = document.getElementById('redSlider');
        const greenSlider = document.getElementById('greenSlider');
        const blueSlider = document.getElementById('blueSlider');

        const scaleNoSmoothFactor05 = document.getElementById('scaleNoSmoothFactor05');
        const scaleNoSmoothFactor2 = document.getElementById('scaleNoSmoothFactor2');

        const scaleSmoothFactor05 = document.getElementById('scaleSmoothFactor05');
        const scaleSmoothFactor2 = document.getElementById('scaleSmoothFactor2');

        const scaleNormalFactorCustom = document.getElementById('scaleNormalFactorCustom');
        const scaleSmoothFactorCustom = document.getElementById('scaleSmoothFactorCustom');

        //EVENT LISTENERS
        //Sliders 
        blackWhiteSlider.addEventListener('input', this.blackWhite);
        blackWhiteSlider.addEventListener('change', () => {//SAVE to History
            Config.setConfigColor();
        });

        contrastSlider.addEventListener('input', this.contrast);
        contrastSlider.addEventListener('change', () => {//SAVE to History
            Config.setConfigColor();
        });

        redSlider.addEventListener('input', this.adjustRGB);
        redSlider.addEventListener('change', () => {//SAVE to History
            Config.setConfigColor();
        });

        greenSlider.addEventListener('input', this.adjustRGB);
        greenSlider.addEventListener('change', () => {//SAVE to History
            Config.setConfigColor();
        });

        blueSlider.addEventListener('input', this.adjustRGB);
        blueSlider.addEventListener('change', () => { //SAVE to History
            Config.setConfigColor();
        });

        //Buttons 
        imgToGrayscaleBtn.addEventListener('click', this.grayscale);
        invertBtn.addEventListener('click', this.createNegative);

        horizontalMirrorBtn.addEventListener('click', this.horizontalMirror);
        verticalMirrorBtn.addEventListener('click', this.verticalMirror);

        brightenBtn.addEventListener('click', () => this.brightenDarken('brighten'));
        darkenBtn.addEventListener('click', () => this.brightenDarken('darken'));

        rotateClockwiseBtn.addEventListener('click', this.rotate90Clockwise);
        rotateCounterClockwiseBtn.addEventListener('click', this.rotate90CounterClockwise);

        scaleNoSmoothFactor05.addEventListener('click', () => this.scaleNoSmoothByFactor(0.5));
        scaleNoSmoothFactor2.addEventListener('click', () => this.scaleNoSmoothByFactor(2));

        scaleSmoothFactor05.addEventListener('click', () => this.scaleWithSmoothByFactor(0.5));
        scaleSmoothFactor2.addEventListener('click', () => this.scaleWithSmoothByFactor(2));

        scaleNormalFactorCustom.addEventListener('click', () => this.scaleNoSmoothByFactor(document.getElementById('smoothCustomValue').value));
        scaleSmoothFactorCustom.addEventListener('click', () => this.scaleWithSmoothByFactor(document.getElementById('smoothCustomValue').value));

        applyGaussianFilter3x3Btn.addEventListener('click', this.applyGaussianFilter3x3);
        applyGaussianFilter5x5Btn.addEventListener('click', this.applyGaussianFilter5x5);

        edgeDetectionWithSobelBtn.addEventListener('click', this.edgeDetectionWithSobel);
        
        rotateCustom.addEventListener('click', () => this.rotateByCustomAngle(document.getElementById('rotateCustomValue').value));

        const animatedButton = document.getElementById('animatedButton');

    },

    grayscale: function(){
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const configData = Config.getConfigValues();

        for(let i = 0; i < data.length; i += 4){
            const grayscale = configData[i] * 0.299 + configData[i + 1] * 0.587 + configData[i + 2] * 0.114;
            data[i] = grayscale; // rot
            data[i + 1] = grayscale; // grün
            data[i + 2] = grayscale; // blau
        }

        context.putImageData(imageData, 0, 0);
        Config.setConfigColor();

    },

    blackWhite: function(){
        const sliderValue = parseFloat(blackWhiteSlider.value);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const configData = Config.getConfigValues();
    
        for(let i = 0; i < data.length; i += 4){
            const grayscale = configData[i] * 0.299 + configData[i + 1] * 0.587 + configData[i + 2] * 0.114;
            const threshold = sliderValue / 100 * 255; // Wert zwischen 0 und 100 in den Bereich 0 bis 255 umwandeln
    
            const bwValue = grayscale > threshold ? 255 : 0;
    
            data[i] = bwValue; // rot
            data[i + 1] = bwValue; // grün
            data[i + 2] = bwValue; // blau
        }
    
        context.putImageData(imageData, 0, 0);
    },

    brightenDarken: function(direction) {

        let step = 20; // Anpassbarer Schritt für Aufhellung und Abdunkelung
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        if (direction === 'brighten') {
            step = step * 1;
        } else if (direction === 'darken') {
            step = step * -1;
        }
        
        const stepValue = step;
    
        const configData = data; // Config.getConfigValues() nicht, da die Änderungen übernommen werden sollen; Aus Strukturgründen aber wurde der Name beibehalten.

        for (let i = 0; i < data.length; i += 4) {
            if (direction === 'brighten') {
                data[i] = Math.min(255, configData[i] + step); // Rot
                data[i + 1] = Math.min(255, configData[i + 1] + step); // Grün
                data[i + 2] = Math.min(255, configData[i + 2] + step); // Blau
            } else if (direction === 'darken') {
                data[i] = Math.max(0, configData[i] + step); // Rot
                data[i + 1] = Math.max(0, configData[i + 1] + step); // Grün
                data[i + 2] = Math.max(0, configData[i + 2] + step); // Blau    
            }
        }

        context.putImageData(imageData, 0, 0);
        Config.setConfigColor();
    },
    
    contrast: function(){
        const sliderValue = parseFloat(contrastSlider.value);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
    
        const contrastValue = sliderValue;

        const configData = Config.getConfigValues();
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = (configData[i] - 128) * (contrastValue / 100) + 128;
            data[i + 1] = (configData[i + 1] - 128) * (contrastValue / 100) + 128;
            data[i + 2] = (configData[i + 2] - 128) * (contrastValue / 100) + 128;
        }
    
        context.putImageData(imageData, 0, 0);
    },

    adjustRGB: function() {
        const redSliderValue = parseFloat(redSlider.value);
        const greenSliderValue = parseFloat(greenSlider.value);
        const blueSliderValue = parseFloat(blueSlider.value);
    
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const configData = Config.getConfigValues();
    
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, configData[i] + redSliderValue)); // Rot
            data[i + 1] = Math.min(255, Math.max(0, configData[i + 1] + greenSliderValue)); // Grün
            data[i + 2] = Math.min(255, Math.max(0, configData[i + 2] + blueSliderValue)); // Blau
        }
    
        context.putImageData(imageData, 0, 0);
    },

    createNegative: function() {

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
    
        const configData = Config.getConfigValues();
    
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - configData[i]; // Negativwert für Rot
            data[i + 1] = 255 - configData[i + 1]; // Negativwert für Grün
            data[i + 2] = 255 - configData[i + 2]; // Negativwert für Blau
            // Behalte den Alphawert unverändert
        }
    
        context.putImageData(imageData, 0, 0);
        Config.setConfigColor();
    },

    rotate90Clockwise: function() {
        if (!window.confirm("This Element can't be redone. Are you sure?, might Lead to irreversable Bugs! ")) { return; }
    
        
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
    
        // Swap width and height for the newImageData
        var newImageData = context.createImageData(canvas.height, canvas.width);
        var newPixels = newImageData.data;
    
        // Iterate through each pixel and rotate
        for (var y = 0; y < canvas.height; y++) {
            for (var x = 0; x < canvas.width; x++) {
                var sourceIndex = (y * canvas.width + x) * 4;
                var destIndex = ((canvas.width - x - 1) * canvas.height + y) * 4;
    
                // Copy pixel data
                newPixels[destIndex] = pixels[sourceIndex];        // Red
                newPixels[destIndex + 1] = pixels[sourceIndex + 1];  // Green
                newPixels[destIndex + 2] = pixels[sourceIndex + 2];  // Blue
                newPixels[destIndex + 3] = pixels[sourceIndex + 3];  // Alpha
            }
        }
    
        // Swap canvas width and height
        var temp = canvas.width;
        canvas.width = canvas.height;
        canvas.height = temp;
    
        // Put the rotated image data back on the canvas
        context.putImageData(newImageData, 0, 0);
        Config.setConfigColor();
    },
    
    rotate90CounterClockwise: function() {
        if (!window.confirm("This Element can't be redone. Are you sure?, might Lead to irreversable Bugs! ")) { return; }
    
        
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
    
        // Swap width and height for the newImageData
        var newImageData = context.createImageData(canvas.height, canvas.width);
        var newPixels = newImageData.data;
    
        // Iterate through each pixel and rotate counter-clockwise
        for (var y = 0; y < canvas.height; y++) {
            for (var x = 0; x < canvas.width; x++) {
                var sourceIndex = (y * canvas.width + x) * 4;
                var destIndex = (x * canvas.height + (canvas.height - y - 1)) * 4;
    
                // Copy pixel data
                newPixels[destIndex] = pixels[sourceIndex];        // Red
                newPixels[destIndex + 1] = pixels[sourceIndex + 1];  // Green
                newPixels[destIndex + 2] = pixels[sourceIndex + 2];  // Blue
                newPixels[destIndex + 3] = pixels[sourceIndex + 3];  // Alpha
            }
        }
    
        // Swap canvas width and height
        var temp = canvas.width;
        canvas.width = canvas.height;
        canvas.height = temp;
    
        // Put the rotated image data back on the canvas
        context.putImageData(newImageData, 0, 0);
        Config.setConfigColor();
    },
    
    rotateByCustomAngle: function(angleDegrees) {
        if (!window.confirm("This Element can't be redone. Are you sure?, might Lead to irreversable Bugs! ")) { return; }

        
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
    
        // Convert angle to radians
        var angleRadians = (angleDegrees * Math.PI) / 180;
    
        // Calculate new width and height for the rotated image
        var cosVal = Math.abs(Math.cos(angleRadians));
        var sinVal = Math.abs(Math.sin(angleRadians));
    
        // Create a new image data for the rotated image
        var newImageData = context.createImageData(canvas.width, canvas.height);
        var newPixels = newImageData.data;
    
        // Calculate the center of the original image
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
    
        // Iterate through each pixel and rotate
        for (var y = 0; y < canvas.height; y++) {
            for (var x = 0; x < canvas.width; x++) {
                // Calculate the coordinates in the original image
                var originalX = Math.round((x - centerX) * cosVal - (y - centerY) * sinVal + centerX);
                var originalY = Math.round((x - centerX) * sinVal + (y - centerY) * cosVal + centerY);
    
                if (originalX >= 0 && originalX < canvas.width && originalY >= 0 && originalY < canvas.height) {
                    var sourceIndex = (originalY * canvas.width + originalX) * 4;
                    var destIndex = (y * canvas.width + x) * 4;
    
                    // Copy pixel data
                    newPixels[destIndex] = pixels[sourceIndex];        // Red
                    newPixels[destIndex + 1] = pixels[sourceIndex + 1];  // Green
                    newPixels[destIndex + 2] = pixels[sourceIndex + 2];  // Blue
                    newPixels[destIndex + 3] = pixels[sourceIndex + 3];  // Alpha
                }
            }
        }
    
        // Put the rotated image data back on the canvas
        context.putImageData(newImageData, 0, 0);
    },

    horizontalMirror: function() {

        
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
    
        // Create a newImageData for mirrored image
        var newImageData = context.createImageData(canvas.width, canvas.height);
        var newPixels = newImageData.data;
    
        // Iterate through each pixel and perform horizontal mirroring
        for (var y = 0; y < canvas.height; y++) {
            for (var x = 0; x < canvas.width; x++) {
                var sourceIndex = (y * canvas.width + x) * 4;
                var destIndex = (y * canvas.width + (canvas.width - x - 1)) * 4;
    
                // Copy pixel data
                newPixels[destIndex] = pixels[sourceIndex];        // Red
                newPixels[destIndex + 1] = pixels[sourceIndex + 1];  // Green
                newPixels[destIndex + 2] = pixels[sourceIndex + 2];  // Blue
                newPixels[destIndex + 3] = pixels[sourceIndex + 3];  // Alpha
            }
        }
    
        // Put the mirrored image data back on the canvas
        context.putImageData(newImageData, 0, 0);
        Config.setConfigColor();
    },
    
    verticalMirror: function() {
        
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
    
        // Create a newImageData for mirrored image
        var newImageData = context.createImageData(canvas.width, canvas.height);
        var newPixels = newImageData.data;
    
        // Iterate through each pixel and perform vertical mirroring
        for (var y = 0; y < canvas.height; y++) {
            for (var x = 0; x < canvas.width; x++) {
                var sourceIndex = (y * canvas.width + x) * 4;
                var destIndex = ((canvas.height - y - 1) * canvas.width + x) * 4;
    
                // Copy pixel data
                newPixels[destIndex] = pixels[sourceIndex];        // Red
                newPixels[destIndex + 1] = pixels[sourceIndex + 1];  // Green
                newPixels[destIndex + 2] = pixels[sourceIndex + 2];  // Blue
                newPixels[destIndex + 3] = pixels[sourceIndex + 3];  // Alpha
            }
        }
    
        // Put the mirrored image data back on the canvas
        context.putImageData(newImageData, 0, 0);
        Config.setConfigColor();
    },

    scaleNoSmoothByFactor: function(scaleFactor) {
        if (!window.confirm("This Element can't be redone. Are you sure?, might Lead to irreversable Bugs! ")) { return; }

        
        let canvas = context.canvas;
        var originalWidth = canvas.width;
        var originalHeight = canvas.height;
    
        var originalImageData = context.getImageData(0, 0, originalWidth, originalHeight);
        var originalPixels = originalImageData.data;
    
        var scaledWidth = originalWidth * scaleFactor;
        var scaledHeight = originalHeight * scaleFactor;
    
        var scaledImageData = context.createImageData(scaledWidth, scaledHeight);
        var scaledPixels = scaledImageData.data;
    
        for (var y = 0; y < scaledHeight; y++) {
            for (var x = 0; x < scaledWidth; x++) {
                var sourceX = x / scaleFactor;
                var sourceY = y / scaleFactor;
    
                var nearestX = Math.round(sourceX);
                var nearestY = Math.round(sourceY);
    
                var sourceIndex = (nearestY * originalWidth + nearestX) * 4;
                var destIndex = (y * scaledWidth + x) * 4;
    
                scaledPixels[destIndex] = originalPixels[sourceIndex];        // Red
                scaledPixels[destIndex + 1] = originalPixels[sourceIndex + 1];  // Green
                scaledPixels[destIndex + 2] = originalPixels[sourceIndex + 2];  // Blue
                scaledPixels[destIndex + 3] = originalPixels[sourceIndex + 3];  // Alpha
            }
        }
    
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
    
        var scaledImageData = context.createImageData(scaledWidth, scaledHeight);
        scaledImageData.data.set(scaledPixels);
        context.putImageData(scaledImageData, 0, 0);
    
    },

    scaleWithSmoothByFactor: function(scaleFactor) {
        if (!window.confirm("This Element can't be redone. Are you sure?, might Lead to irreversable Bugs! ")) { return; }

        // Helper function to get pixel value at given coordinates
        function getPixel(pixels, width, x, y) {
            var index = (y * width + x) * 4;
            return [
                pixels[index],         // Red
                pixels[index + 1],     // Green
                pixels[index + 2],     // Blue
                pixels[index + 3]      // Alpha
            ];
        }

        // Helper function to interpolate between two values
        function interpolate(a, b, fraction) {
            return [
                a[0] + fraction * (b[0] - a[0]),
                a[1] + fraction * (b[1] - a[1]),
                a[2] + fraction * (b[2] - a[2]),
                a[3] + fraction * (b[3] - a[3])
            ];
        }

        //console.log('scaleWithSmoothByFactor');
        
        
        let canvas = context.canvas;
        var originalWidth = canvas.width;
        var originalHeight = canvas.height;
    
        var originalImageData = context.getImageData(0, 0, originalWidth, originalHeight);
        var originalPixels = originalImageData.data;
    
        var scaledWidth = Math.round(originalWidth * scaleFactor);
        var scaledHeight = Math.round(originalHeight * scaleFactor);
    
        var scaledImageData = context.createImageData(scaledWidth, scaledHeight);
        var scaledPixels = scaledImageData.data;
    
        for (var y = 0; y < scaledHeight; y++) {
            for (var x = 0; x < scaledWidth; x++) {
                var sourceX = x / scaleFactor;
                var sourceY = y / scaleFactor;
    
                var xFloor = Math.floor(sourceX);
                var yFloor = Math.floor(sourceY);
                var xCeil = Math.ceil(sourceX);
                var yCeil = Math.ceil(sourceY);
    
                var topLeft = getPixel(originalPixels, originalWidth, xFloor, yFloor);
                var topRight = getPixel(originalPixels, originalWidth, xCeil, yFloor);
                var bottomLeft = getPixel(originalPixels, originalWidth, xFloor, yCeil);
                var bottomRight = getPixel(originalPixels, originalWidth, xCeil, yCeil);
    
                var xFraction = sourceX - xFloor;
                var yFraction = sourceY - yFloor;
    
                var topInterpolation = interpolate(topLeft, topRight, xFraction);
                var bottomInterpolation = interpolate(bottomLeft, bottomRight, xFraction);
    
                var finalInterpolation = interpolate(topInterpolation, bottomInterpolation, yFraction);
    
                var destIndex = (y * scaledWidth + x) * 4;
    
                scaledPixels[destIndex] = finalInterpolation[0];     // Red
                scaledPixels[destIndex + 1] = finalInterpolation[1]; // Green
                scaledPixels[destIndex + 2] = finalInterpolation[2]; // Blue
                scaledPixels[destIndex + 3] = finalInterpolation[3]; // Alpha
            }
        }
    
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
    
        var scaledImageData = context.createImageData(scaledWidth, scaledHeight);
        scaledImageData.data.set(scaledPixels);
        context.putImageData(scaledImageData, 0, 0);
    },
    
    applyGaussianFilter3x3: function() {
        
        let canvas = context.canvas;
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
    
        // Kopiere die Pixel-Daten für die spätere Verwendung
        var originalPixels = new Uint8ClampedArray(pixels);
    
        // Gauß-Kernel der Größe 3x3
        var kernel = [
            1, 2, 1,
            2, 4, 2,
            1, 2, 1
        ];
    
        var scaleFactor = 16; // Summe der Kernel-Werte für die Normalisierung
    
        // Iteriere durch jedes Pixel des Originalbildes (ausgenommen Randpixel)
        for (var y = 1; y < canvas.height - 1; y++) {
            for (var x = 1; x < canvas.width - 1; x++) {
                var destIndex = (y * canvas.width + x) * 4;
    
                // Gauß-Filterung für jede Farbkomponente
                for (var i = 0; i < 3; i++) { // Ignoriere den Alpha-Kanal
                    var sum = 0;
    
                    // Iteriere durch den Gauß-Kernel und wende ihn auf die umliegenden Pixel an
                    for (var ky = -1; ky <= 1; ky++) {
                        for (var kx = -1; kx <= 1; kx++) {
                            var sourceX = x + kx;
                            var sourceY = y + ky;
                            var sourceIndex = (sourceY * canvas.width + sourceX) * 4;
    
                            sum += originalPixels[sourceIndex + i] * kernel[(ky + 1) * 3 + (kx + 1)];
                        }
                    }
    
                    // Normalisiere den Wert und setze ihn im Bild zurück
                    pixels[destIndex + i] = Math.round(sum / scaleFactor);
                }
            }
        }
    
        // Setze die gefilterten Pixel-Daten zurück auf das Original-Canvas
        context.putImageData(imageData, 0, 0);
    
        Config.setConfigColor(); // Setze die Farbeinstellungen, falls notwendig
    },

    applyGaussianFilter5x5: function() {
        
        let canvas = context.canvas;
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
    
        // Kopiere die Pixel-Daten für die spätere Verwendung
        var originalPixels = new Uint8ClampedArray(pixels);
    
        // Gauß-Kernel der Größe 5x5
        var kernel = [
            1, 4, 6, 4, 1,
            4, 16, 24, 16, 4,
            6, 24, 36, 24, 6,
            4, 16, 24, 16, 4,
            1, 4, 6, 4, 1
        ];
    
        var scaleFactor = 256; // Summe der Kernel-Werte für die Normalisierung
    
        // Iteriere durch jedes Pixel des Originalbildes (ausgenommen Randpixel)
        for (var y = 2; y < canvas.height - 2; y++) {
            for (var x = 2; x < canvas.width - 2; x++) {
                var destIndex = (y * canvas.width + x) * 4;
    
                // Gauß-Filterung für jede Farbkomponente
                for (var i = 0; i < 3; i++) { // Ignoriere den Alpha-Kanal
                    var sum = 0;
    
                    // Iteriere durch den Gauß-Kernel und wende ihn auf die umliegenden Pixel an
                    for (var ky = -2; ky <= 2; ky++) {
                        for (var kx = -2; kx <= 2; kx++) {
                            var sourceX = x + kx;
                            var sourceY = y + ky;
                            var sourceIndex = (sourceY * canvas.width + sourceX) * 4;
    
                            sum += originalPixels[sourceIndex + i] * kernel[(ky + 2) * 5 + (kx + 2)];
                        }
                    }
    
                    // Normalisiere den Wert und setze ihn im Bild zurück
                    pixels[destIndex + i] = Math.round(sum / scaleFactor);
                }
            }
        }
    
        // Setze die gefilterten Pixel-Daten zurück auf das Original-Canvas
        context.putImageData(imageData, 0, 0);
    
        Config.setConfigColor(); // Setze die Farbeinstellungen, falls notwendig    
    },

    edgeDetectionWithSobel: function() {
        
        let canvas = context.canvas;
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
    
        // Kopiere die Pixel-Daten für die spätere Verwendung
        var originalPixels = new Uint8ClampedArray(pixels);
    
        // Sobel-Filter für die horizontale Richtung
        var sobelX = [
            -1, 0, 1,
            -2, 0, 2,
            -1, 0, 1
        ];
    
        // Sobel-Filter für die vertikale Richtung
        var sobelY = [
            -1, -2, -1,
            0, 0, 0,
            1, 2, 1
        ];
    
        // Iteriere durch jedes Pixel des Originalbildes (ausgenommen Randpixel)
        for (var y = 1; y < canvas.height - 1; y++) {
            for (var x = 1; x < canvas.width - 1; x++) {
                var destIndex = (y * canvas.width + x) * 4;
    
                // Berechne die Gradienten in horizontaler und vertikaler Richtung
                var gradientX = 0;
                var gradientY = 0;
    
                // Iteriere durch den Sobel-Filter und wende ihn auf die umliegenden Pixel an
                for (var ky = -1; ky <= 1; ky++) {
                    for (var kx = -1; kx <= 1; kx++) {
                        var sourceX = x + kx;
                        var sourceY = y + ky;
                        var sourceIndex = (sourceY * canvas.width + sourceX) * 4;
    
                        // Anwenden des Sobel-Filters in horizontaler Richtung
                        gradientX += originalPixels[sourceIndex] * sobelX[(ky + 1) * 3 + (kx + 1)];
    
                        // Anwenden des Sobel-Filters in vertikaler Richtung
                        gradientY += originalPixels[sourceIndex] * sobelY[(ky + 1) * 3 + (kx + 1)];
                    }
                }
    
                // Berechne den Gesamtgradienten
                var gradientMagnitude = Math.sqrt(gradientX * gradientX + gradientY * gradientY);
    
                // Setze den berechneten Gradienten im Bild zurück
                pixels[destIndex] = gradientMagnitude;      // R
                pixels[destIndex + 1] = gradientMagnitude;  // G
                pixels[destIndex + 2] = gradientMagnitude;  // B
                pixels[destIndex + 3] = 255;                // Alpha
            }
        }
    
        // Setze die Pixel-Daten zurück auf das Original-Canvas
        context.putImageData(imageData, 0, 0);
    
        Config.setConfigColor(); // Setze die Farbeinstellungen, falls notwendig
    
    },
}