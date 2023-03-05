<template>
  <div class="app-container-e">
    <!--工具条-->
    <el-form :inline="true" label-width="75x">
      <el-form-item label="选择班级">
        <el-select v-model.number="classId" style="width: 100px;" size="mini" placeholder="选择班级" @change="getStudentList">
          <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="健康码">
        <el-select v-model.number="searchForm.health_code" clearable style="width: 100px;" :disabled="!classId" size="mini" placeholder="健康码" @change="getStudentList">
          <el-option v-for="item in healthCodeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="行程码">
        <el-select v-model.number="searchForm.stroke_code" clearable style="width: 100px;" :disabled="!classId" size="mini" placeholder="行程码" @change="getStudentList">
          <el-option v-for="item in travelCodeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="核酸情况">
        <el-select v-model.number="searchForm.is_detection" clearable style="width: 100px;" :disabled="!classId" size="mini" placeholder="做核酸" @change="getStudentList">
          <el-option v-for="item in isNucleicAcidList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="核酸结果">
        <el-select v-model.number="searchForm.detection_result" clearable style="width: 100px;" :disabled="!classId" size="mini" placeholder="核酸结果" @change="getStudentList">
          <el-option v-for="item in nucleicAcidResultList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否在校">
        <el-select v-model.number="searchForm.at_school" clearable style="width: 100px;" :disabled="!classId" size="mini" placeholder="是否在校" @change="getStudentList">
          <el-option v-for="item in isAtSchoolList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" size="mini" @click="resetData">初始化数据</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="warning" size="mini" @click="exportData">导出数据</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button :type="isChange ? 'danger' : 'success'" size="mini" @click="saveData">保存数据</el-button>
      </el-form-item>
    </el-form>
    <!--数据表格-->
    <el-table
      v-loading="loading"
      element-loading-text="数据过多,请耐心等待..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :max-height="screenHeight"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column type="index" fixed width="40" label="#" />
      <el-table-column prop="name" fixed width="70" label="姓名" />
      <el-table-column prop="father_tel" width="110" label="手机号" />
      <el-table-column width="60" label="年级">
        <template v-slot="{row}">
          <span>{{ className(row.class) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="95" label="健康码">
        <template #header>
          <span>健康码</span>
          <el-popover
            placement="bottom"
            width="60"
            trigger="click"
          >
            <!--一键选择-->
            <el-select v-model="isHealthCode" size="mini">
              <el-option
                v-for="item in healthCodeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :class="showColor(item.value)"
              />
            </el-select>
            <i slot="reference" class="el-icon-edit pointer" />
          </el-popover>
        </template>
        <template v-slot="{row}">
          <!--选择器显示文字的颜色-->
          <el-select v-model.number="row.health_code" :class="showStyle(row.health_code)" size="mini">
            <el-option
              v-for="item in healthCodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :class="showColor(item.value)"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="95" label="行程码">
        <template #header>
          <span>行程码</span>
          <el-popover
            placement="bottom"
            width="60"
            trigger="click"
          >
            <!--一键选择-->
            <el-select v-model="isTravelCode" size="mini">
              <el-option
                v-for="item in travelCodeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :class="showColor(item.value)"
              />
            </el-select>
            <i slot="reference" class="el-icon-edit pointer" />
          </el-popover>
        </template>
        <template v-slot="{row}">
          <el-select v-model.number="row.stroke_code" :class="showStyle(row.stroke_code)" size="mini" placeholder="请选择">
            <el-option
              v-for="item in travelCodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :class="showColor(item.value)"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="近七日核酸检测情况">
        <el-table-column width="105">
          <template #header>
            <span>是否做核酸</span>
            <el-popover
              placement="bottom"
              width="60"
              trigger="click"
            >
              <!--一键选择-->
              <el-select v-model="isNucleicAcid" size="mini">
                <el-option
                  v-for="item in isNucleicAcidList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <i slot="reference" class="el-icon-edit pointer" />
            </el-popover>
          </template>
          <template v-slot="{row}">
            <el-select v-model.number="row.is_detection" size="mini" placeholder="请选择">
              <el-option
                v-for="item in isNucleicAcidList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="160" prop="detection_time">
          <template #header>
            <span>核酸时间</span>
            <el-popover
              placement="bottom"
              width="160"
              trigger="click"
            >
              <el-date-picker
                v-model="nucleicAcidTime"
                type="date"
                size="mini"
                style="width: 130px"
              />
              <i slot="reference" class="el-icon-edit pointer" />
            </el-popover>
          </template>
          <template v-slot="{row}">
            <el-date-picker
              v-if="row.is_detection"
              v-model="row.detection_time"
              type="date"
              size="mini"
              style="width: 135px"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </template>
        </el-table-column>
        <el-table-column prop="detection_result" width="110" label="核酸结果">
          <template #header>
            <span>核酸结果</span>
            <el-popover
              placement="bottom"
              width="60"
              trigger="click"
            >
              <!--一键选择-->
              <el-select v-model="nucleicAcidResult" size="mini">
                <el-option
                  v-for="item in nucleicAcidResultList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <i slot="reference" class="el-icon-edit pointer" />
            </el-popover>
          </template>
          <template v-slot="{row}">
            <el-select v-if="row.is_detection" v-model.number="row.detection_result" :class="showStyleResult(row.detection_result)" size="mini" placeholder="请选择">
              <el-option
                v-for="item in nucleicAcidResultList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :class="showColor(item.value)"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="是否在校">
        <el-table-column prop="at_school" width="80" label="是否在校">
          <template v-slot="{row}">
            <el-select v-model.number="row.at_school" size="mini" placeholder="请选择">
              <el-option
                v-for="item in isAtSchoolList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="reason" width="110" label="未在校事由">
          <template v-slot="{row}">
            <el-select v-if="!row.at_school" v-model.number="row.reason" size="mini" placeholder="请选择">
              <el-option
                v-for="item in notAtSchoolReasonList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="未在校去向">
        <el-table-column label="省市区">
          <template v-slot="{row}">
            <!--地区选择器-->
            <el-cascader
              v-if="!row.at_school"
              v-model="row.selectedOptions"
              size="mini"
              style="width: 100%"
              placeholder="请选择省市区"
              :options="options"
              @change="handleChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column width="150" label="详细地址">
          <template v-slot="{row}">
            <el-input
              v-if="!row.at_school"
              v-model="row.tempAddress"
              size="mini"
              placeholder="请输入详细地址"
              @change="handleChange(row)"
            />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as epidemicApi from '@/api/epidemic'
import _ from 'lodash'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
// 引入Excel导出工具
import { createWs, openDownloadDialog, sheet2blob } from '@/utils/excel'

export default {
  name: 'Epidemic',
  data() {
    return {
      // 搜索条件 - 健康码 行程码 是否做核酸 核酸结果 是否在校
      searchForm: {
        health_code: null,
        stroke_code: null,
        is_detection: null,
        detection_result: null,
        at_school: null
      },
      // loading
      loading: false,
      // 选择的班级id
      classId: null,
      // 表格数据
      tableData: [],
      // 屏幕高度
      screenHeight: 0,
      // 健康码列表
      healthCodeList: [
        { label: '绿码', value: 2 },
        { label: '黄码', value: 1 },
        { label: '红码', value: 0 }
      ],
      // 行程码列表
      travelCodeList: [
        { label: '绿码', value: 2 },
        { label: '黄码', value: 1 },
        { label: '红码', value: 0 }
      ],
      // 是否做核酸
      isNucleicAcidList: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      // 核酸结果
      nucleicAcidResultList: [
        { label: '阴性', value: 1 },
        { label: '阳性', value: 0 },
        { label: '已采样', value: 2 }
      ],
      // 是否在校
      isAtSchoolList: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      // 未在校事由
      notAtSchoolReasonList: [
        { label: '病假 ', value: 0 },
        { label: '事假 ', value: 1 },
        { label: '其他', value: 2 }
      ],
      options: regionData,
      // 数据是否改变
      isChange: false,
      // 一键核酸
      isNucleicAcid: null,
      // 一键核酸时间
      nucleicAcidTime: '',
      // 一键核酸结果
      nucleicAcidResult: null,
      // 一键健康码
      isHealthCode: null,
      // 一键行程码
      isTravelCode: null
    }
  },
  computed: {
    ...mapState('classL', ['classList']),
    // 获取班级名字
    className() {
      return (classId) => {
        const classItem = this.classList.find(item => item.id === classId)
        return classItem ? classItem.name : ''
      }
    },
    // 各种码的颜色的样式计算
    showColor() {
      return (code) => {
        return code === 2 ? 'green' : code === 1 ? 'yellow' : 'red'
      }
    },
    // 计算健康码和行程码名字
    healthAndStrokeCodeName() {
      return (code) => {
        return code === 2 ? '绿码' : code === 1 ? '黄码' : '红码'
      }
    },
    // 离校原因
    leaveSchoolReason() {
      return (code) => {
        // 0 病假 1 事假 2 其他 -1 在校
        return code === 0 ? '病假' : code === 1 ? '事假' : code === 2 ? '其他' : '在校'
      }
    },
    // 核酸结果
    nucleicAcidResultName() {
      return (is_detection, code) => {
        // 0 阳性 1 阴性 2 已采样 -1 未做核酸
        return is_detection === 0 ? ' ' : code === 0 ? '阳性！' : code === 1 ? '阴性' : '已采样'
      }
    },
    // 样式计算
    showStyle() {
      return (code) => {
        return code === 2 ? 'green-select' : code === 1 ? 'yellow-select' : 'red-select'
      }
    },
    // 核酸结果样式计算
    showStyleResult() {
      return (code) => {
        return code === 2 ? 'green-select' : code === 1 ? 'green-select' : 'red-select'
      }
    }
  },
  watch: {
    // 监听表格数据变化
    tableData: {
      handler() {
        this.isChange = true
      },
      deep: true
    },
    // 监听一键核酸变化
    isNucleicAcid: {
      handler() {
        // 判断表格数据是否有数据
        if (this.tableData.length > 0) {
          // 如果有数据，就把表格数据的核酸结果都改成一键核酸的结果
          this.tableData.forEach(item => {
            item.is_detection = this.isNucleicAcid
          })
        } else {
          this.$message.error('请先获取数据')
          this.isNucleicAcid = null
        }
      }
    },
    // 监听一键核酸时间变化
    nucleicAcidTime: {
      handler() {
        // 判断表格数据是否有数据
        if (this.tableData.length > 0) {
          // 如果有数据，就把表格数据的核酸时间都改成一键核酸的时间
          this.tableData.forEach(item => {
            if (item.is_detection === 1) {
              item.detection_time = this.nucleicAcidTime
            }
          })
        } else {
          this.$message.error('请先获取数据')
          this.nucleicAcidTime = ''
        }
      }
    },
    // 监听一键核酸结果变化
    nucleicAcidResult: {
      handler() {
        // 判断表格数据是否有数据
        if (this.tableData.length > 0) {
          // 如果有数据，就把表格数据的核酸结果都改成一键核酸的结果
          this.tableData.forEach(item => {
            if (item.is_detection === 1) {
              item.detection_result = this.nucleicAcidResult
            }
          })
        } else {
          this.$message.error('请先获取数据')
          this.nucleicAcidResult = ''
        }
      }
    },
    // 监听一键健康码变化
    isHealthCode: {
      handler() {
        // 判断表格数据是否有数据
        if (this.tableData.length > 0) {
          // 如果有数据，就把表格数据的健康码都改成一键健康码的结果
          this.tableData.forEach(item => {
            item.health_code = this.isHealthCode
          })
        } else {
          this.$message.error('请先获取数据')
          this.isHealthCode = null
        }
      }
    },
    // 监听一键行程码变化
    isTravelCode: {
      handler() {
        // 判断表格数据是否有数据
        if (this.tableData.length > 0) {
          // 如果有数据，就把表格数据的行程码都改成一键行程码的结果
          this.tableData.forEach(item => {
            item.stroke_code = this.isTravelCode
          })
        } else {
          this.$message.error('请先获取数据')
          this.isTravelCode = null
        }
      }
    }
  },
  beforeMount() {
    this.$store.dispatch('classL/getClassList')
    // 获取屏幕高度
    this.screenHeight = document.documentElement.clientHeight * 0.78
  },
  methods: {
    // 获取表格数据
    getStudentList() {
      // this.$refs['selectClass'].$el.children[0].children[0].style.color = 'red'
      this.loading = true
      epidemicApi.getEpidemicInfo(this.classId, this.searchForm).then(res => {
        this.tableData = res.data
        this.loading = false
        this.$nextTick(() => {
          // 如果数据中有地址，就把地址拆分成省市区和详细地址 以'-'分割 省市区数据用于地区选择器，详细地址用于输入框
          this.tableData.forEach(item => {
            if (item.address?.length > 0) {
              // 判断有没有selectedOptions，没有就初始化一个空数组
              if (!item.selectedOptions) {
                this.$set(item, 'selectedOptions', [])
              }
              const addressArr = item.address.split('-')
              // 把省市区的文字转换成对应的code
              const addressCodeArr = addressArr[0].trim().split(' ')
              if (addressCodeArr.length === 3) {
                const provinceCodeObj = TextToCode[addressCodeArr[0]]
                item.selectedOptions.push(provinceCodeObj.code)
                item.selectedOptions.push(provinceCodeObj[addressCodeArr[1]].code)
                item.selectedOptions.push(provinceCodeObj[addressCodeArr[1]][addressCodeArr[2]].code)
                this.$set(item, 'tempAddress', addressArr[1] || '')
              }
            } else {
              item.selectedOptions = []
              this.$set(item, 'tempAddress', '')
            }
          })
        })
      })
    },
    // 初始化数据
    resetData() {
      if (this.tableData.length === 0) {
        this.$message.error('请先获取数据')
        return
      }
      this.$confirm('此操作将初始化所有学生的健康码、行程码、近七日核酸检测情况、是否在校、未在校去向等信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        epidemicApi.initEpidemicInfo(this.classId).then(res => {
          if (res.code === 20000) {
            this.$message({
              type: 'success',
              message: '初始化成功!'
            })
          }
          this.getStudentList()
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消初始化'
          })
        })
    },
    // 保存数据
    saveData() {
      if (this.classId === null) {
        this.$message({
          type: 'warning',
          message: '请选择班级!'
        })
        return
      }
      this.$confirm('请检查数据确保无误, 继续保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 整理数据 只返回数据库中有的字段
        const tempData = this.tableData.map(item => {
          return {
            id: item.id,
            student_id: item.student_id,
            health_code: item.health_code,
            stroke_code: item.stroke_code,
            is_detection: item.is_detection,
            detection_time: item.detection_time,
            detection_result: item.detection_result,
            at_school: item.at_school,
            reason: item.reason,
            address: item.address
          }
        })
        // 当没有做核酸时，把核酸检测时间和结果置空
        tempData.forEach(item => {
          if (item.is_detection === 0) {
            item.detection_time = null
            item.detection_result = null
          }
        })
        // 当没有在校时，把未在校去向置空
        tempData.forEach(item => {
          if (item.at_school === 1) {
            item.reason = null
          }
        })

        epidemicApi.updateEpidemicInfo(tempData).then(res => {
          if (res.code === 20000) {
            this.isChange = false
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          }
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          })
        })
    },
    // 地区选择器回调
    handleChange(row) {
      let loc = ''
      for (let i = 0; i < row.selectedOptions?.length; i++) {
        loc += CodeToText[row.selectedOptions[i]] + ' '
      }
      row.address = loc + '- ' + row.tempAddress
    },
    // 导出数据
    exportData() {
      if (this.tableData.length <= 0) {
        this.$message({
          type: 'warning',
          message: '没有数据可导出!'
        })
        return
      }
      const dataDeep = _.cloneDeep(this.tableData)
      const tHeader = {
        index: '序号',
        name: '姓名',
        class: '班级',
        father_tel: '电话',
        health_code: '健康码',
        stroke_code: '行程码',
        is_detection: '近七日核酸检测',
        detection_time: '检测时间',
        detection_result: '检测结果',
        at_school: '是否在校',
        reason: '未在校去向',
        address: '去向'
      }
      const filterVal = ['index', 'name', 'class', 'father_tel', 'health_code', 'stroke_code', 'is_detection', 'detection_time', 'detection_result', 'at_school', 'reason', 'address']
      // 整理数据
      const data = dataDeep.map((item, index) => {
        return {
          index: index,
          name: item.name,
          class: this.className(item.class),
          father_tel: item.father_tel,
          health_code: this.healthAndStrokeCodeName(item.health_code),
          stroke_code: this.healthAndStrokeCodeName(item.stroke_code),
          is_detection: item.is_detection === 0 ? '否' : '是',
          detection_time: item.detection_time || '未检测',
          detection_result: this.nucleicAcidResultName(item.is_detection, item.detection_result),
          at_school: item.at_school === 0 ? '否' : '是',
          reason: this.leaveSchoolReason(item.reason),
          address: item.address || ''
        }
      })
      const ws = createWs(data, filterVal, tHeader, 3)
      openDownloadDialog(sheet2blob(ws), this.className(this.classId) + ' - 健康情况表.xlsx')
    }
  },
  // 路由守卫 未保存数据时提示
  beforeRouteLeave(to, from, next) {
    if (this.isChange) {
      this.$confirm('数据未保存，是否离开？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      })
        .catch(() => {
          next(false)
        })
    } else {
      next()
    }
  }
}
</script>

<style scoped>
.app-container-e {
  padding: 20px;
  position: relative;
}
/*
  el-table样式穿透 表格居中
*/
/deep/ .el-table th > .cell {
  text-align: center;
}

/deep/ .el-table .cell {
  text-align: center;
}

.green {
  color: #67c23a;
}

.yellow {
  color: #e6a23c;
}

.red {
  color: #f56c6c;
}

.pointer {
  cursor: pointer;
}

.pointer:hover {
  color: #409eff;
}

/deep/ .red-select .el-input__inner{
  font-weight: bold;    /* 修改文字粗细*/
  color: red;    /* 修改文字颜色 在el-select上添加 class="red.select" 即可生效*/
}
/deep/ .green-select .el-input__inner{
  font-weight: bold;    /* 修改文字粗细*/
  color: green;    /* 修改文字颜色*/
}
/deep/ .yellow-select .el-input__inner{
  font-weight: bold;    /* 修改文字粗细*/
  color: yellowgreen;    /* 修改文字颜色*/
}
</style>
