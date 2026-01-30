import cloudinary from '../config/cloudinary';
import prisma from '../db';



type AssetKind = "IMAGE" | "VIDEO" | "PDF";

export const mediaService = {

  async create(file: any, userId: string, type: AssetKind) {
    return prisma.mediaAsset.create({
      data: {
        type,
        fileUrl: file.path,
        publicId: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        uploadedBy: userId
      }
    });
  },

  async delete(id: string) {
    const media = await prisma.mediaAsset.findUnique({ where: { id }});
    if (!media) throw new Error("Media not found");

    await cloudinary.uploader.destroy(media.publicId, {
      resource_type:
        media.type === "VIDEO" ? "video" :
        media.type === "PDF" ? "raw" :
        "image"
    });

    await prisma.mediaAsset.delete({ where: { id }});
  },

  async update(id: string, file: any) {
    const media = await prisma.mediaAsset.findUnique({ where: { id }});
    if (!media) throw new Error("Media not found");

    const uploaded = await cloudinary.uploader.upload(file.path, {
      public_id: media.publicId,
      overwrite: true,
      resource_type:
        media.type === "VIDEO" ? "video" :
        media.type === "PDF" ? "raw" :
        "image"
    });

    return prisma.mediaAsset.update({
      where: { id },
      data: {
        fileUrl: uploaded.secure_url,
        size: file.size,
        mimeType: file.mimetype
      }
    });
  }
};

