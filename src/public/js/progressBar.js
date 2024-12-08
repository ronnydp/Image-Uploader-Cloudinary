let progressBar = document.getElementById("progress-bar");
let width = 0;

function updateProgress(){
    if(width >= 100){
        width += 0; // incrementa el ancho en un 10%
    }else{
        width = 0; /* reinicia el progreso */
        progressBar.style.width = width + "%"; // actualiza el ancho de la barra
    }
}

// actualiza el progreso cada 100ms
setInterval(updateProgress, 100);