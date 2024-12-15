document.getElementById('image-upload').addEventListener('change', handleImageUpload);
document.getElementById('compress-button').addEventListener('click', compressImage);
document.getElementById('download-button').addEventListener('click', downloadImage);

let originalImage = null;
let compressedImage = null;

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = function() {
                document.getElementById('original-image').src = originalImage.src;
                document.getElementById('original-size').textContent = `原始大小: ${Math.round(file.size / 1024)} KB`;
            };
        };
        reader.readAsDataURL(file);
    }
}

function compressImage() {
    if (!originalImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const compressionRate = document.getElementById('compression-rate').value / 100;

    canvas.width = originalImage.width * compressionRate;
    canvas.height = originalImage.height * compressionRate;
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob) {
        compressedImage = blob;
        const compressedImageUrl = URL.createObjectURL(blob);
        document.getElementById('compressed-image').src = compressedImageUrl;
        document.getElementById('compressed-size').textContent = `压缩大小: ${Math.round(blob.size / 1024)} KB`;
    }, 'image/jpeg', compressionRate);
}

function downloadImage() {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedImage);
    link.download = 'compressed-image.jpg';
    link.click();
} 