
let history = [];
let reverseHistory = [];

let resetColors = [];
let resetScale = [0,0];

let configData = {
    colors : {}
}

export const Config = {
    clearHistory : function() {
        history = [];
        reverseHistory = [];
    },

    getLastChanged : function(){
        return lastChanged;
    },

    getConfigValues : function(){
        return configData.colors;
    },
    
    getConfigResetValues : function(){
        return resetColors;
    },

    getConfigImgDimensions : function(){
        return resetScale;
    },

    setConfigColor : function(data){
        //insert current colors into history
        
        if (!data) {
            const canvas = document.getElementById('imageCanvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        }

        history.push(JSON.stringify(configData.colors));

        for(let i = 0; i < data.length; i += 4){
            configData.colors[i] = data[i];
            configData.colors[i + 1] = data[i + 1];
            configData.colors[i + 2] = data[i + 2];
        }
    },

    goForwardInHistory : function() {
        let oldColors = null;

        if (reverseHistory.length > 0) {
            oldColors = reverseHistory.pop();
            history.push(oldColors);
        } else {
            window.alert("Nothing to Reverse!");
            return
        }
        const canvas = document.getElementById('imageCanvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        configData.colors = JSON.parse(oldColors);

        for(let i = 0; i < data.length; i += 4){
            data[i] = configData.colors[i];
            data[i + 1] = configData.colors[i + 1];
            data[i + 2] = configData.colors[i + 2];
        }

        ctx.putImageData(imageData, 0, 0);
        Config.resetAllValues();
    },

    goBackInHistory : function(){
        let oldColors = null;
        
        if(history.length > 0){
            oldColors = history.pop()
            reverseHistory.push(oldColors);
        } else {
            window.alert("Nothing to Reverse!");
            return
        }
        
        const canvas = document.getElementById('imageCanvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        configData.colors = JSON.parse(oldColors);

        for(let i = 0; i < data.length; i += 4){
            data[i] = configData.colors[i];
            data[i + 1] = configData.colors[i + 1];
            data[i + 2] = configData.colors[i + 2];
        }

        ctx.putImageData(imageData, 0, 0);
        Config.resetAllValues();
    },

    resetAllValues : function(){ 
        // Reset configData applying new Colors
        configData = {
            colors : configData.colors
        }

        // Reset all sliders
        const redSlider = document.getElementById('redSlider');
        const greenSlider = document.getElementById('greenSlider');
        const blueSlider = document.getElementById('blueSlider');
        const contrastSlider = document.getElementById('contrastSlider');
        const blackWhiteSlider = document.getElementById('blackWhiteSlider');
        const rotateCustomValue = document.getElementById('rotateCustomValue');
        const smoothCustomValue = document.getElementById('smoothCustomValue');

        redSlider.value = 0;
        greenSlider.value = 0;
        blueSlider.value = 0;
        rotateCustomValue.value = null;
        smoothCustomValue.value = null;
        contrastSlider.value = 100;
        blackWhiteSlider.value = 50;


    },

    setResetConfig : function(data, imageWidth, imageHeight){
        resetColors = data; 
        resetScale = [imageWidth, imageHeight];
    },

    resetConfig : function(){
        configData = {
            colors : {}
        }
    }
};