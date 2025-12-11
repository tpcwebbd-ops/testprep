import { logger } from 'better-auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

// --- Simulated auth function (replace with your real one) ---
const auth = async (req: Request) => {
  logger.info(JSON.stringify(req));
  // Replace with your actual auth/session logic
  return { id: 'fakeUserId' };
};

// --- FILE ROUTER DEFINITION ---
export const ourFileRouter = {
  /* =======================
   * 📂 Universal Document Uploader
   * Supports: Image, PDF, DOC, DOCX
   * ======================= */
  documentUploader: f({
    // 1. Images (jpg, jpeg, png, webp, ico)
    image: {
      maxFileSize: '8MB',
      maxFileCount: 1,
    },
    // 2. PDFs
    pdf: {
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
    // 3. Blobs (Catches .doc, .docx, and others)
    blob: {
      maxFileSize: '32MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('📝 Universal upload complete for:', metadata.userId);
      console.log('📂 File:', file.name, '| Type:', file.type, '| URL:', file.ufsUrl);

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileName: file.name,
        fileType: file.type,
      };
    }),

  /* =======================
   * 🎥 Video Uploader (.mp4 / .mov / etc.)
   * Kept separate for specialized video handling
   * ======================= */
  videoUploader: f({
    video: {
      maxFileSize: '256MB', // Increased slightly for videos
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
