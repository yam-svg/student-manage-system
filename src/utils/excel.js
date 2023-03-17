import * as XLSX from 'xlsx'
import XLSXStyle from 'xlsx-style'

export function createWs(data, fields, titles, type = 2) { // type 2: 成绩导出
  const ws = XLSX.utils.json_to_sheet(data, {
    header: fields
  })
  // 根据表头字段设置列宽
  const wsWidth = []
  if (type === 2) {
    // 成绩 设置列宽
    fields.forEach((item) => {
      if (item === 'index') {
        wsWidth.push({ wpx: 65 })
      } else if (item === 'name') {
        wsWidth.push({ wpx: 100 })
      } else {
        wsWidth.push({ wpx: 65 })
      }
    })
  } else if (type === 3) {
    // 核酸数据 导出设置列宽
    fields.forEach((item) => {
      if (item === 'index') {
        wsWidth.push({ wpx: 40 })
      } else if (item === 'name') {
        wsWidth.push({ wpx: 80 })
      } else if (item === 'class') {
        wsWidth.push({ wpx: 60 })
      } else if (item === 'health_code' || item === 'stroke_code' || item === 'detection_result' || item === 'at_school' || item === 'reason' || item === 'reason') {
        wsWidth.push({ wpx: 70 })
      } else if (item === 'father_tel' || item === 'is_detection' || item === 'detection_time') {
        wsWidth.push({ wpx: 130 })
      } else if (item === 'address') {
        wsWidth.push({ wpx: 280 })
      } else {
        wsWidth.push({ wpx: 120 })
      }
    })
  } else {
    // 学生信息 相同宽度的字段
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
  }

  // 设置表格的宽度
  ws['!cols'] = wsWidth

  const range = XLSX.utils.decode_range(ws['!ref'])

  // 设置表格样式
  for (let i = range.s.c; i < range.e.c + 1; i++) {
    for (let j = range.s.r; j < range.e.r + 1; j++) {
      // 单元格的地址, c是列，r是行, 如A1的地址是{c:0, r:0}
      const cell_address = {
        c: i,
        r: j
      }
      const column = XLSX.utils.encode_cell(cell_address)
      // 获取该单元格的值
      const value = ws[column].v
      // 判断 红码和阳性 为红色, 绿码,阴性,已采样 为绿色, 黄码 为橘黄色
      ws[column].s = {
        // 单元格字体样式
        font: {
          name: '宋体',
          sz: 11,
          color: {
            rgb: value === '红码' || value === '阳性！' ? 'FF0000' : value === '绿码' || value === '阴性' || value === '已采样' ? '008000' : value === '黄码' ? 'FFA500' : '000000'
          },
          // 健康码 行程码 检测结果 字体加粗
          bold: value === '红码' || value === '绿码' || value === '黄码' || value === '阴性' || value === '阳性！' || value === '已采样' || value === '检测结果'
        },
        // 单元格的边框线
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
        // 单元格内容的排列方式
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
