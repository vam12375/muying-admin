<template>
  <div class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  emits: ['pagination', 'update:page', 'update:limit'],
  setup(props, { emit }) {
    const currentPage = ref(props.page)
    const pageSize = ref(props.limit)

    const handleSizeChange = (val) => {
      pageSize.value = val
      emit('update:limit', val)
      emit('pagination', { page: currentPage.value, limit: val })
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      emit('update:page', val)
      emit('pagination', { page: val, limit: pageSize.value })
      
      if (props.autoScroll) {
        scrollToTop()
      }
    }

    // 滚动到顶部
    const scrollToTop = () => {
      const main = document.querySelector('.app-main')
      if (main) {
        main.scrollTop = 0
      }
    }

    watch(() => props.page, (val) => {
      currentPage.value = val
    })

    watch(() => props.limit, (val) => {
      pageSize.value = val
    })

    return {
      currentPage,
      pageSize,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.pagination-container {
  padding: 20px 0;
  text-align: center;
}
</style> 