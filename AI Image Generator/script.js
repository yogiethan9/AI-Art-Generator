const apiKey = "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";

const maxImages = 4; // Number of images to generate for each prompt
let selectedImageNumber = null;

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min; // Corrected the function name to Math.floor
}

// Function to disable the generate button during processing
function disableGenerateButton() {
    document.getElementById("generate").disabled = true; // Corrected "disable" to "disabled"
}

// Function to enable the generate button after processing
function enableGenerateButton() {
    document.getElementById("generate").disabled = false; // Corrected "disable" to "disabled"
}

// Function to clear image grid
function clearImageGrid(){
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

// Function to generate images
async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for(let i = 0 ; i < maxImages; i++){
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;
        
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST", // Corrected "Method" to "method"
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`, // Corrected the apiKey interpolation
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if(!response.ok){
            alert("Failed to generate image!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`; // Corrected single quotes to backticks
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; // Reset selected image
}

document.getElementById("generate").addEventListener("click", () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`; // Corrected single quotes to backticks
    link.click();
}
