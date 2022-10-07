import * as XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style'

export function createWs(data, fields, titles) {
  const ws = XLSX.utils.json_to_sheet(data, {
    header: fields
  })
  // 根据表头字段设置列宽
  const wsWidth = []
  // 相同宽度的字段
  const sampleWidth1 = ['index', 'sex', 'age', 'class'] // 65
  const sampleWidth2 = ['name', 'father_name', 'remark'] // 100
  const sampleWidth3 = ['father_tel', 'create_time'] // 120
  const sampleWidth4 = ['address'] // 280
  const sampleWidth5 = ['id_number'] // 150
  // 设置列宽
  fields.forEach((item) => {
    if (sampleWidth1.includes(item)) {
      wsWidth.push({ wpx: 65 })
    } else if (sampleWidth2.includes(item)) {
      wsWidth.push({ wpx: 100 })
    } else if (sampleWidth3.includes(item)) {
      wsWidth.push({ wpx: 120 })
    } else if (sampleWidth4.includes(item)) {
      wsWidth.push({ wpx: 280 })
    } else if (sampleWidth5.includes(item)) {
      wsWidth.push({ wpx: 150 })
    }
  })

  // 设置表格的宽度
  ws['!cols'] = wsWidth

  const range = XLSX.utils.decode_range(ws['!ref'])

  // 设置表格样式
  for (let i = range.s.c; i < range.e.c + 1; i++) {
    for (let j = range.s.r; j < range.e.r + 1; j++) {
      const cell_address = {
        c: i,
        r: j
      }
      const column = XLSX.utils.encode_cell(cell_address)
      ws[column].s = {
        font: {
          name: '宋体',
          sz: 11,
          color: {
            auto: 1
          }
        },
        border: {
          color: {
            auto: 1
          },
          top: {
            style: 'thin'
          },
          bottom: {
            style: 'thin'
          },
          left: {
            style: 'thin'
          },
          right: {
            style: 'thin'
          }
        },
        alignment: {
          // 自动换行
          wrapText: 1,
          // 居中
          horizontal: 'center',
          vertical: 'center',
          indent: 0
        }
      }
    }
  }
  // 设置中文标题 因为后台返回的数据中属性只能以英文返回 所以需要转化为中文
  for (let c = range.s.c; c <= range.e.c; c++) {
    const header = XLSX.utils.encode_col(c) + '1'
    ws[header].v = titles[ws[header].v]
  }
  return ws
}

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
export function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1'
  const workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  }
  workbook.Sheets[sheetName] = sheet // 生成excel的配置项

  // 下载这里一定要用 xlsx-style 的write() 方法才可以使导出excel表格带样式
  const wbout = XLSXStyle.write(workbook, { type: 'buffer' })
  // 字符串转ArrayBuffer
  return new Blob([wbout], {
    type: 'application/octet-stream'
  })
}

export function openDownloadDialog(url, saveName) {
  if (typeof url === 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url) // 创建blob地址
  }
  const aLink = document.createElement('a')
  aLink.href = url
  aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  let event
  if (window.MouseEvent) event = new MouseEvent('click')
  else {
    event = document.createEvent('MouseEvents')
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
  }
  aLink.dispatchEvent(event)
}
