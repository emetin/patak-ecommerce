import { google } from "googleapis";
import { Readable } from "stream";

const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const PRODUCT_IMAGE_FOLDER_ID =
  process.env.GOOGLE_DRIVE_PRODUCT_IMAGE_FOLDER_ID;

const CAREER_RESUME_FOLDER_ID =
  process.env.GOOGLE_DRIVE_CAREER_RESUME_FOLDER_ID;

const MEDIA_FOLDER_ID = process.env.GOOGLE_DRIVE_MEDIA_FOLDER_ID;

if (!CLIENT_EMAIL) {
  throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL.");
}

if (!PRIVATE_KEY) {
  throw new Error("Missing GOOGLE_PRIVATE_KEY.");
}

function getDriveAuth() {
  return new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
}

function getDriveClient() {
  const auth = getDriveAuth();

  return google.drive({
    version: "v3",
    auth,
  });
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

function bufferToReadable(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function uploadFileToDrive({
  file,
  folderId,
  prefix,
}: {
  file: File;
  folderId: string;
  prefix: string;
}) {
  const drive = getDriveClient();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const safeFileName = sanitizeFileName(file.name || "file");
  const finalFileName = `${prefix}-${Date.now()}-${safeFileName}`;

  const createdFile = await drive.files.create({
    requestBody: {
      name: finalFileName,
      parents: [folderId],
    },
    media: {
      mimeType: file.type || "application/octet-stream",
      body: bufferToReadable(buffer),
    },
    fields: "id,name,webViewLink",
  });

  const fileId = createdFile.data.id;

  if (!fileId) {
    throw new Error("Failed to upload file to Google Drive.");
  }

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return {
    fileId,
    fileName: finalFileName,
    url: `https://drive.google.com/file/d/${fileId}/view`,
  };
}

export async function uploadProductImageToDrive(file: File) {
  if (!PRODUCT_IMAGE_FOLDER_ID) {
    throw new Error("Missing GOOGLE_DRIVE_PRODUCT_IMAGE_FOLDER_ID.");
  }

  const uploaded = await uploadFileToDrive({
    file,
    folderId: PRODUCT_IMAGE_FOLDER_ID,
    prefix: "product-image",
  });

  return {
    fileId: uploaded.fileId,
    fileName: uploaded.fileName,
    url: `https://drive.google.com/uc?export=view&id=${uploaded.fileId}`,
  };
}

export async function uploadCareerResumeToDrive(file: File) {
  if (!CAREER_RESUME_FOLDER_ID) {
    throw new Error("Missing GOOGLE_DRIVE_CAREER_RESUME_FOLDER_ID.");
  }

  return uploadFileToDrive({
    file,
    folderId: CAREER_RESUME_FOLDER_ID,
    prefix: "career-resume",
  });
}

export async function uploadMediaImageToDrive(file: File) {
  if (!MEDIA_FOLDER_ID) {
    throw new Error("Missing GOOGLE_DRIVE_MEDIA_FOLDER_ID.");
  }

  const uploaded = await uploadFileToDrive({
    file,
    folderId: MEDIA_FOLDER_ID,
    prefix: "media",
  });

  return {
    fileId: uploaded.fileId,
    fileName: uploaded.fileName,
    url: `https://drive.google.com/uc?export=view&id=${uploaded.fileId}`,
  };
}

export async function deleteDriveFile(fileId: string) {
  if (!fileId) {
    throw new Error("Google Drive file ID is required.");
  }

  const drive = getDriveClient();

  await drive.files.delete({
    fileId,
  });

  return { ok: true };
}