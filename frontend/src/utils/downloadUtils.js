export const downloadImage = (imageUrl, fileName) => {
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'download.png';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(err => {
            console.error("Failed to download image:", err);
            // Fallback for cross-origin issues
            const a = document.createElement('a');
            a.href = imageUrl;
            a.target = '_blank';
            a.download = fileName || 'download.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
};
