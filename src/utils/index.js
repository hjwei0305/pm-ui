import constants from './constants';
import * as userUtils from './user';
import * as XLSX from 'xlsx';

const exportXlsx = (fileTitle, cols, data) => {
    const header = [];
    cols.forEach(t => {
      header.push(t);
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([header]);
    XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A2' });
    ws['!cols'] = [];
    header.forEach(() => ws['!cols'].push({ wpx: 150 }));
    XLSX.utils.book_append_sheet(wb, ws, fileTitle);
    XLSX.writeFile(wb, `${fileTitle}.xlsx`);
  };

export { exportXlsx, constants, userUtils };
