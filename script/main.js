import { imageControls } from './imageControls.js';
import { editControls } from './editControls.js';

document.addEventListener('DOMContentLoaded', () => {
    imageControls.init();
    editControls.init();
});


// JavaScript to toggle between light and dark mode
const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
});