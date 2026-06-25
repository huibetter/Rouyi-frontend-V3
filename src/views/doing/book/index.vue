<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="书籍编号" prop="isbn">
        <el-input
          v-model="queryParams.isbn"
          placeholder="请输入书籍编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="书名" prop="bookName">
        <el-input
          v-model="queryParams.bookName"
          placeholder="请输入书名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作者" prop="bookAuthor">
        <el-input
          v-model="queryParams.bookAuthor"
          placeholder="请输入作者"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="书价" prop="bookPrice">
        <el-input
          v-model="queryParams.bookPrice"
          placeholder="请输入书价"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="库存数量" prop="bookNum">
        <el-input
          v-model="queryParams.bookNum"
          placeholder="请输入库存数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:control:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:control:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:control:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:control:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="controlList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自增主键" align="center" prop="id" />
      <el-table-column label="书籍编号" align="center" prop="isbn" />
      <el-table-column label="书名" align="center" prop="bookName" />
      <el-table-column label="作者" align="center" prop="bookAuthor" />
      <el-table-column label="书价" align="center" prop="bookPrice" />
      <el-table-column label="库存数量" align="center" prop="bookNum" />
      <el-table-column label="书籍上架状态(0-下架，1-上架)" align="center" prop="bookStatus" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:control:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:control:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改书籍控制对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="controlRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="书籍编号" prop="isbn">
              <el-input v-model="form.isbn" placeholder="请输入书籍编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="书名" prop="bookName">
              <el-input v-model="form.bookName" placeholder="请输入书名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="作者" prop="bookAuthor">
              <el-input v-model="form.bookAuthor" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="书价" prop="bookPrice">
              <el-input v-model="form.bookPrice" placeholder="请输入书价" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="库存数量" prop="bookNum">
              <el-input v-model="form.bookNum" placeholder="请输入库存数量" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Control">
import { listControl, getControl, delControl, addControl, updateControl } from "@/api/system/control/book.js"

const { proxy } = getCurrentInstance()
const controlList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    isbn: undefined,
    bookName: undefined,
    bookAuthor: undefined,
    bookPrice: undefined,
    bookNum: undefined,
    bookStatus: undefined
  },
  rules: {
    isbn: [
      { required: true, message: "书籍编号不能为空", trigger: "blur" }
    ],
    bookName: [
      { required: true, message: "书名不能为空", trigger: "blur" }
    ],
    bookAuthor: [
      { required: true, message: "作者不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询书籍控制列表 */
function getList() {
  loading.value = true
  listControl(queryParams.value).then(response => {
    controlList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    id: null,
    isbn: null,
    bookName: null,
    bookAuthor: null,
    bookPrice: null,
    bookNum: null,
    bookStatus: null
  }
  proxy.resetForm("controlRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加书籍控制"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getControl(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改书籍控制"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["controlRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateControl(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addControl(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除书籍控制编号为"' + _ids + '"的数据项？').then(function() {
    return delControl(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/control/export', {
    ...queryParams.value
  }, `control_${new Date().getTime()}.xlsx`)
}

getList()
</script>
