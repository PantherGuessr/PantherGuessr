export async function prepareImageForUpload(selectedImage: File) {
  const [{ default: imageCompression }, { default: heic2any }] = await Promise.all([
    import("browser-image-compression"),
    import("heic2any"),
  ]);

  let fileToProcess = selectedImage;
  const fileName = selectedImage.name.toLowerCase();
  const isHeicOrHeif =
    selectedImage.type === "image/heic" ||
    selectedImage.type === "image/heif" ||
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif");

  if (isHeicOrHeif) {
    let convertedBlob!: Blob;

    try {
      const result = await heic2any({ blob: selectedImage, toType: "image/jpeg", quality: 0.9 });
      convertedBlob = Array.isArray(result) ? result[0] : result;
    } catch {
      try {
        const bitmap = await createImageBitmap(selectedImage);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.drawImage(bitmap, 0, 0);
        convertedBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
            "image/jpeg",
            0.9
          );
        });
      } catch {
        throw new Error(
          "This HEIC/HEIF image could not be converted automatically. Please convert it to JPEG or PNG first and re-upload, or try another browser."
        );
      }
    }

    fileToProcess = new File([convertedBlob], selectedImage.name.replace(/\.[^/.]+$/, ".jpg"), {
      type: "image/jpeg",
    });
  }

  return await imageCompression(fileToProcess, {
    maxSizeMB: 1.0,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
}
