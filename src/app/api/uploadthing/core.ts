import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

// --- Simulated auth function (replace with your real one) ---
const auth = async (req: Request) => {
  // Replace with your actual auth/session logic
  return { id: 'fakeUserId' };
};

// --- FILE ROUTER DEFINITION ---
export const ourFileRouter = {
  /* =======================
   * 📄 Document Uploader (.doc / .docx)
   * ======================= */
  documentUploader: f({
    blob: {
      maxFileSize: '1GB',
      maxFileCount: 3,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('📝 Document upload complete for:', metadata.userId);
      console.log('📄 File:', file.name, '| URL:', file.ufsUrl);

      // Save to DB (example)
      // await db.upload.create({
      //   data: {
      //     userId: metadata.userId,
      //     category: "document",
      //     fileUrl: file.ufsUrl,
      //     fileKey: file.fileKey,
      //     fileType: file.type,
      //     fileName: file.name,
      //     fileSize: file.size,
      //   },
      // });

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileName: file.name,
        fileType: file.type,
      };
    }),

  /* =======================
   * 🧾 PDF Uploader (.pdf)
   * ======================= */
  pdfUploader: f({
    pdf: {
      maxFileSize: '1GB',
      maxFileCount: 3,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('📚 PDF upload complete for:', metadata.userId);
      console.log('🧾 File URL:', file.ufsUrl);

      // Example DB save
      // await db.upload.create({
      //   data: {
      //     userId: metadata.userId,
      //     category: "pdf",
      //     fileUrl: file.ufsUrl,
      //     fileKey: file.fileKey,
      //     fileType: file.type,
      //     fileName: file.name,
      //     fileSize: file.size,
      //   },
      // });

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileName: file.name,
        fileType: file.type,
      };
    }),

  /* =======================
   * 🎥 Video Uploader (.mp4 / .mov / etc.)
   * ======================= */
  videoUploader: f({
    video: {
      maxFileSize: '1GB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('🎥 Video upload complete for:', metadata.userId);
      console.log('📹 File URL:', file.ufsUrl);

      // Example DB save
      // await db.upload.create({
      //   data: {
      //     userId: metadata.userId,
      //     category: "video",
      //     fileUrl: file.ufsUrl,
      //     fileKey: file.fileKey,
      //     fileType: file.type,
      //     fileName: file.name,
      //     fileSize: file.size,
      //   },
      // });

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileName: file.name,
        fileType: file.type,
      };
    }),
} satisfies FileRouter;

// --- Export router type for client ---
export type OurFileRouter = typeof ourFileRouter;
