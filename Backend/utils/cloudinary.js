const { v2: cloudinary } = require("cloudinary")
const fs = require("fs")
const path = require("path")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath, folder = "sportifycampus/winners") => {
  if (!localFilePath) return null
  const normalizedPath = path.normalize(localFilePath)
  try {
    const res = await cloudinary.uploader.upload(normalizedPath, {
      resource_type: "image",
      folder,
    })
    if (fs.existsSync(normalizedPath)) fs.unlinkSync(normalizedPath)
    return res // includes secure_url and public_id
  } catch (error) {
    if (fs.existsSync(normalizedPath)) fs.unlinkSync(normalizedPath)
    throw error
  }
}

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" })
  } catch (e) {
    // Do not throw to avoid cascading failures on partial deletes
    console.error("Cloudinary delete error:", e.message)
  }
}

module.exports = { cloudinary, uploadOnCloudinary, deleteFromCloudinary }
