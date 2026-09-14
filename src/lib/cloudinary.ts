export async function uploadImage(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (cloudName && uploadPreset) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    )
    const data = await res.json()
    if (data.secure_url) {
      return data.secure_url as string
    }
  }

  // Fallback: Convert to Base64 Data URL for local presentation if Cloudinary is unconfigured
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

export async function uploadVideo(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (cloudName && uploadPreset) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      { method: 'POST', body: formData }
    )
    const data = await res.json()
    if (data.secure_url) {
      return data.secure_url as string
    }
  }

  // Fallback: Data URL / Object URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}
