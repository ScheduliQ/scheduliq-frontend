export async function handleUpload(file, uploadPreset = "profile_pictures") {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const formData = new FormData();
  formData.append("file", file); // Attach the file
  formData.append("upload_preset", uploadPreset); // Cloudinary preset

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dcrhswmzi/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload the file.");
    }

    const data = await response.json();
    return data.secure_url; // Return the uploaded file URL
  } catch (error) {
    console.error("Upload error:", error);
    throw error; // Throw the error for the calling component to handle
  }
}
