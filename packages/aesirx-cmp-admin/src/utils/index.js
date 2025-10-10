import * as ExcelJS from 'exceljs';

const downloadExcel = async (data, nameFile) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);

  data.forEach((row) => {
    const rowData = Object.values(row);
    worksheet.addRow(rowData);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${nameFile}.xlsx`;
  link.click();
};
const languages = {
  'en-US': 'en-US',
  'ar-SA': 'ar-SA',
  'cs-CZ': 'cs-CZ',
  'el-GR': 'el-GR',
  'es-ES': 'es-ES',
  'de-DE': 'de-DE',
  'da-DK': 'da-DK',
  'fr-FR': 'fr-FR',
  'fi-FI': 'fi-FI',
  'he-IL': 'he-IL',
  'hu-HU': 'hu-HU',
  'id-ID': 'id-ID',
  'it-IT': 'it-IT',
  'ja-JP': 'ja-JP',
  'ko-KR': 'ko-KR',
  'nl-NL': 'nl-NL',
  'no-NO': 'no-NO',
  'pl-PL': 'pl-PL',
  'pt-PT': 'pt-PT',
  'ms-MY': 'ms-MY',
  'ro-RO': 'ro-RO',
  'sv-SE': 'sv-SE',
  'th-TH': 'th-TH',
  'tr-TR': 'tr-TR',
  'vi-VN': 'vi-VN',
};

const timezones = {
  'america/new_york': 'America/New_York',
  'asia/riyadh': 'Asia/Riyadh',
  'europe/prague': 'Europe/Prague',
  'europe/athens': 'Europe/Athens',
  'europe/madrid': 'Europe/Madrid',
  'europe/berlin': 'Europe/Berlin',
  'europe/copenhagen': 'Europe/Copenhagen',
  'europe/paris': 'Europe/Paris',
  'europe/helsinki': 'Europe/Helsinki',
  'asia/jerusalem': 'Asia/Jerusalem',
  'europe/budapest': 'Europe/Budapest',
  'asia/jakarta': 'Asia/Jakarta',
  'europe/rome': 'Europe/Rome',
  'asia/tokyo': 'Asia/Tokyo',
  'asia/seoul': 'Asia/Seoul',
  'europe/amsterdam': 'Europe/Amsterdam',
  'europe/oslo': 'Europe/Oslo',
  'europe/warsaw': 'Europe/Warsaw',
  'europe/lisbon': 'Europe/Lisbon',
  'asia/kuala_lumpur': 'Asia/Kuala_Lumpur',
  'europe/bucharest': 'Europe/Bucharest',
  'europe/stockholm': 'Europe/Stockholm',
  'asia/bangkok': 'Asia/Bangkok',
  'europe/istanbul': 'Europe/Istanbul',
  'asia/ho_chi_minh': 'Asia/Ho_Chi_Minh',
  'asia/saigon': 'Asia/Saigon',
};

export { downloadExcel, languages, timezones };
