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

  const downFile = (blob, fileName) => {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      }, 50);
    }
  };

export { exportXlsx, constants, userUtils, downFile };
