function compressImage(file, options = { maxWidth: 1000, maxHeight: 1000, quality: 0.6 }) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided."));
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ({ target: { result } }) => {
        const img = new Image();
        img.src = result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
  
          if (width > height && width > options.maxWidth) {
            height *= options.maxWidth / width;
            width = options.maxWidth;
          } else if (height > options.maxHeight) {
            width *= options.maxHeight / height;
            height = options.maxHeight;
          }
  
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve({ file: compressedFile, previewUrl: URL.createObjectURL(compressedFile) });
          }, 'image/jpeg', options.quality);
        };
      };
      reader.onerror = error => reject(error);
    });
  }
  
export default compressImage;
  