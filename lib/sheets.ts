import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!SHEET_ID) {
  throw new Error("GOOGLE_SHEET_ID eksik.");
}

if (!CLIENT_EMAIL) {
  throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL eksik.");
}

if (!PRIVATE_KEY) {
  throw new Error("GOOGLE_PRIVATE_KEY eksik.");
}

function getAuth() {
  return new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient() {
  const auth = getAuth();

  return google.sheets({
    version: "v4",
    auth,
  });
}

export async function getSheetRows(sheetName: string) {
  const sheets = getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:Z`,
  });

  return response.data.values || [];
}

export function rowsToObjects(rows: string[][]) {
  if (!rows.length) return [];

  const headers = rows[0].map((header) => String(header).trim());

  return rows.slice(1).map((row) => {
    const item: Record<string, string> = {};

    headers.forEach((header, index) => {
      item[header] = row[index] ? String(row[index]) : "";
    });

    return item;
  });
}

export async function getSheetData(sheetName: string) {
  const rows = await getSheetRows(sheetName);
  return rowsToObjects(rows);
}

export async function appendSheetRow(sheetName: string, row: string[]) {
  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });

  return { ok: true };
}

function columnNumberToLetter(columnNumber: number) {
  let temp = columnNumber;
  let letter = "";

  while (temp > 0) {
    const remainder = (temp - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    temp = Math.floor((temp - 1) / 26);
  }

  return letter;
}

export async function getSheetHeaders(sheetName: string) {
  const rows = await getSheetRows(sheetName);
  return rows[0]?.map((item) => String(item).trim()) || [];
}

export async function findRowNumberByField(
  sheetName: string,
  fieldName: string,
  fieldValue: string
) {
  const rows = await getSheetRows(sheetName);

  if (!rows.length) {
    return null;
  }

  const headers = rows[0].map((header) => String(header).trim());
  const fieldIndex = headers.findIndex((header) => header === fieldName);

  if (fieldIndex === -1) {
    throw new Error(`${sheetName} içinde ${fieldName} alanı bulunamadı.`);
  }

  const normalizedValue = String(fieldValue).trim().toLowerCase();

  for (let i = 1; i < rows.length; i += 1) {
    const rowValue = String(rows[i]?.[fieldIndex] || "")
      .trim()
      .toLowerCase();

    if (rowValue === normalizedValue) {
      return i + 1;
    }
  }

  return null;
}

export async function updateSheetRowByRowNumber(
  sheetName: string,
  rowNumber: number,
  rowValues: string[]
) {
  const sheets = getSheetsClient();
  const lastColumnLetter = columnNumberToLetter(rowValues.length);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A${rowNumber}:${lastColumnLetter}${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [rowValues],
    },
  });

  return { ok: true };
}

export async function updateSheetRowBySlug(
  sheetName: string,
  slug: string,
  rowValues: string[]
) {
  const rowNumber = await findRowNumberByField(sheetName, "slug", slug);

  if (!rowNumber) {
    throw new Error(`${sheetName} içinde bu slug ile kayıt bulunamadı.`);
  }

  return updateSheetRowByRowNumber(sheetName, rowNumber, rowValues);
}

export async function getSheetMetaByTitle(sheetName: string) {
  const sheets = getSheetsClient();

  const response = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  const sheet = response.data.sheets?.find(
    (item) => item.properties?.title === sheetName
  );

  if (!sheet?.properties?.sheetId) {
    throw new Error(`${sheetName} sheet bilgisi bulunamadı.`);
  }

  return {
    sheetId: sheet.properties.sheetId,
    title: sheet.properties.title || sheetName,
  };
}

export async function deleteSheetRowBySlug(sheetName: string, slug: string) {
  const rowNumber = await findRowNumberByField(sheetName, "slug", slug);

  if (!rowNumber) {
    throw new Error(`${sheetName} içinde bu slug ile kayıt bulunamadı.`);
  }

  const sheets = getSheetsClient();
  const meta = await getSheetMetaByTitle(sheetName);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: meta.sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });

  return { ok: true };
}