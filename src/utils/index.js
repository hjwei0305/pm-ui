import constants from './constants';
import * as userUtils from './user';
import * as XLSX from 'xlsx';

const exportXlsx = (fileTitle, cols, data , merges) => {
    let header = [];
    // merges 合并单元格，合并设置
    if(merges){
      header = cols
    }else{
      header.push(cols)
    }
    let originCol = 'A' + (header.length + 1)

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(header);
    if(merges){
      ws['!merges'] = merges
    }
    XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: originCol });
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
