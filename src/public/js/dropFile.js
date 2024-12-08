const dropArea = document.getElementById("drop-area");
const form = document.querySelector("form");
const inputFile = document.querySelector(".input-file");
const browse = document.querySelector(".select");
const cardLoad = document.querySelector(".card-load");
const cardImg = document.querySelector(".card-img");
const buttons = document.querySelector(".container-buttons");
const shareButton = document.getElementById("shareButton");
const downloadLink = document.getElementById("downloadLink");

let lastSelectedFileName = "";

// Para el boton Browse files
browse.addEventListener("click", function () {
  inputFile.addEventListener("change", uploadImage);
  inputFile.click();
});

// Arrastrar y soltar la imagen
form.addEventListener("dragover", (e) => {
  e.preventDefault();

  form.classList.add("dragover");
});

form.addEventListener("dragleave", (e) => {
  e.preventDefault();

  form.classList.remove("dragover");
});

form.addEventListener("drop", (e) => {
  e.preventDefault();
  form.classList.remove("dragover");
  inputFile.files = e.dataTransfer.files;
  uploadImage();
});

// Mostrar o cargar la imagen en pantalla
async function uploadImage() {
  const image = inputFile.files[0];

  //Validar si hay archivos o no
  if (!image) {
    return;
  }

  // Validacion imagen o no
  const acceptedImageTypes = ["image/jpeg", "image/png", "image/gif"];

  if (!acceptedImageTypes.includes(image.type)) {
    alert("JPG, PNG or GIF");
    return false;
  }

  // Si la imagen excede los 2MB
  if (image.size > 2_000_000) {
    alert("Maximum upload size is 2MB!");
    return;
  }

  // Validar cantidad de imagenes
  if (lastSelectedFileName && lastSelectedFileName !== image.name) {
    lastSelectedFileName = " ";

    alert("Only upload an image at a time");
    return;
  }

  lastSelectedFileName = image.name;

  cardLoad.style.display = "flex";
  cardImg.style.display = "none";

  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch("/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const imageUrl = data.url;

    setTimeout(async () => {
      cardLoad.style.display = "none";
      cardImg.style.display = "flex";
      buttons.style.display = "flex";

      showImage(imageUrl);
      shareButton.addEventListener("click", () => shareLink(imageUrl)); //funcion anonima o de flecha
      downloadImage(imageUrl); // Obtiene la URL de la imagen y lo envía al elemento html
    }, 2000);
  } catch (error) {
    console.log("Error uploading image", error);
  }
}

function showImage(imageUrl) {
  dropArea.style.backgroundImage = `url(${imageUrl})`;
  dropArea.textContent = " ";
  dropArea.style.border = 0;
}

// Compartir el link de la imagen subida
function shareLink(imageUrl) {
  const Url = `${imageUrl}`; // obtiene la url de la imagen

  // usa la API del portapapeles para copiar la url con promesas
  navigator.clipboard
    .writeText(Url)
    .then(() => {
      // maneja el caso exitoso
      alert("URL copied to clipboard: " + Url);
    })
    .catch((err) => {
      // maneja el caso si hay error
      console.error("Error al copiar la URL: ", err);
      alert("Error al copiar la URL");
    });
}

async function downloadImage(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  downloadLink.href = url;
}
