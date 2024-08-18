import { Config } from "./config.js";

const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const canvasWrapper = document.getElementById('imgCanvasWrapper');

let img = new Image();

export const imageControls = {
    init: function(){
        // Elementgetter für die Buttons
        const imgUpload = document.getElementById('imgUpload');
        const saveImageBtn = document.getElementById('saveImage');
        const deleteImageBtn = document.getElementById('deleteImage');
        const displayColorHistogramBtn = document.getElementById('displayColorHistogram');
        const resetImageBtn = document.getElementById('resetImage');

        const goBackInHistoryBtn = document.getElementById('goBackInHistory');
        const goForwardInHistoryBtn = document.getElementById('goForwardInHistory');

        // Event-Listener für die Buttons
        imgUpload.addEventListener('change', this.uploadImage);
        saveImageBtn.addEventListener('click', this.saveImage);
        deleteImageBtn.addEventListener('click', this.deleteImage);
        goBackInHistoryBtn.addEventListener('click', Config.goBackInHistory);
        goForwardInHistoryBtn.addEventListener('click', Config.goForwardInHistory);
        displayColorHistogramBtn.addEventListener('click', this.displayColorHistogram);
        resetImageBtn.addEventListener('click', this.resetImage);
    },

    uploadImage: function(event){
        canvasWrapper.style.display = 'block';

        const label = document.getElementById('inputfileLabel');
        label.innerHTML = event.target.files[0].name;
    
        img.onload = function () {
            // Set canvas dimensions to match the image size
            canvas.width = img.width;
            canvas.height = img.height;
    
            // Clear the canvas to draw a new image
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Draw the image with the original dimensions
            ctx.drawImage(img, 0, 0);
    
            // Update configurations based on the drawn image
            Config.setConfigColor(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
            Config.setResetConfig(ctx.getImageData(0, 0, canvas.width, canvas.height), img.width, img.height);
        };
    

        // Lese die Datei ein
        const file = event.target.files[0];

        // lese sie ein
        if(file){
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                img.src = e.target.result;
            };
        }
    },


    saveImage: function(){
        const canvas = document.getElementById('imageCanvas');
        const dataURL = canvas.toDataURL();

        const saveObject = document.createElement('a');
        saveObject.href = dataURL;
        saveObject.download = 'image.png'; 
        document.body.appendChild(saveObject);
        saveObject.click();
        document.body.removeChild(saveObject);
    },

    deleteImage: function(){
        if (!window.confirm('Are you sure you want to delete the image?')) { return; }
        let label = document.getElementById('inputfileLabel');
        label.innerHTML = ' <i class="fa-solid fa-upload"></i>  Upload Image';
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        document.getElementById('imgUpload').value = '';

        // const imgUpload = document.getElementById('imgUpload');
        // imgUpload.value = '';
        Config.resetAllValues();
        Config.clearHistory();
        canvasWrapper.style.display = 'none';
        console.log('Image deleted');
    },

    resetImage: function(){
        if (!window.confirm('Are you sure you want to reset the image?')) { return; }

        let imgDimensions = Config.getConfigImgDimensions();

        canvas.width = imgDimensions[0];
        canvas.height = imgDimensions[1];

        var newImageData = Config.getConfigResetValues();

        ctx.putImageData(newImageData, 0, 0);
        
        Config.resetAllValues();
    },

    displayColorHistogram: function() {


        let context = ctx;
        let canvas = context.canvas;
    
        // Erstelle ein zweites Canvas für das Histogramm
        let histogramCanvasRed = document.getElementById('histogramCanvasRed');
        let histogramCanvasGreen = document.getElementById('histogramCanvasGreen');
        let histogramCanvasBlue = document.getElementById('histogramCanvasBlue');


        let histogramContextRed = histogramCanvasRed.getContext('2d');
        let histogramContextGreen = histogramCanvasGreen.getContext('2d');
        let histogramContextBlue = histogramCanvasBlue.getContext('2d');


    
        // Lokale Funktion zum Zeichnen des Histogramms
        function drawHistogram(data, context) {
            let histogramWidth = context.canvas.width;
            let histogramHeight = context.canvas.height;
        
            // Calculate the width of each bar dynamically based on the number of bins
            let barWidth = (histogramWidth / data.length); // Scale the width by a factor of 2
            for (let i = 0; i < data.length; i++) {
                let barHeight = data[i] * histogramHeight;
                
                context.fillRect(i * barWidth, histogramHeight - barHeight, barWidth, barHeight);
            }
        }
    
        histogramContextRed.clearRect(0, 0, histogramCanvasRed.width, histogramCanvasRed.height);
        histogramContextGreen.clearRect(0, 0, histogramCanvasGreen.width, histogramCanvasGreen.height);
        histogramContextBlue.clearRect(0, 0, histogramCanvasBlue.width, histogramCanvasBlue.height);


        // Erhalte die Pixel-Daten des Originalbildes
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let pixels = imageData.data;
    
        // Arrays für die Zählung der Farbhäufigkeiten in R, G und B
        let redHistogram = new Array(256).fill(0);
        let greenHistogram = new Array(256).fill(0);
        let blueHistogram = new Array(256).fill(0);
    
        // Iteriere durch jedes Pixel des Bildes und zähle die Farbhäufigkeiten
        for (let i = 0; i < pixels.length; i += 4) {
            let red = pixels[i];
            let green = pixels[i + 1];
            let blue = pixels[i + 2];
    
            redHistogram[red]++;
            greenHistogram[green]++;
            blueHistogram[blue]++;
        }
    
        // Normalisiere die Farbhäufigkeiten, um normierte Anzahl von Häufigkeiten zu erhalten
        let maxCount = Math.max(
            Math.max(...redHistogram),
            Math.max(...greenHistogram),
            Math.max(...blueHistogram)
        );
    
        let normalizedRedHistogram = redHistogram.map(count => count / maxCount);
        let normalizedGreenHistogram = greenHistogram.map(count => count / maxCount);
        let normalizedBlueHistogram = blueHistogram.map(count => count / maxCount);
    
        // Zeichne das Farbhistogramm auf das Histogramm-Canvas
        histogramContextRed.fillStyle = 'rgb(255, 0, 0)';
        drawHistogram(normalizedRedHistogram, histogramContextRed);
    
        histogramContextGreen.fillStyle = 'rgb(0, 255, 0)';
        drawHistogram(normalizedGreenHistogram, histogramContextGreen);
    
        histogramContextBlue.fillStyle = 'rgb(0, 0, 255)';
        drawHistogram(normalizedBlueHistogram, histogramContextBlue);
    }
};