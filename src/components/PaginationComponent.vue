<script setup>
import { ref, computed, watch } from 'vue'
import { UI_CONSTANTS } from '@/constants/pokemon.js'

// Props定義
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 20,
  },
  maxPagesShown: {
    type: Number,
    default: 5,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// Emits定義
const emit = defineEmits(['page-change', 'page-size-change'])

// ローカル状態
const selectedPageSize = ref(props.itemsPerPage)

// ページサイズオプション
const pageSizeOptions = UI_CONSTANTS.DEFAULT_ITEMS_PER_PAGE

// 表示するページ番号の計算
const visiblePages = computed(() => {
  const pages = []
  const maxPages = props.maxPagesShown
  const current = props.currentPage
  const total = props.totalPages

  if (total <= maxPages) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, current - Math.floor(maxPages / 2))
    let end = Math.min(total, start + maxPages - 1)

    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

// 表示範囲の計算
const displayRange = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage + 1
  const end = Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
  return { start, end }
})

// メソッド
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const changePageSize = () => {
  emit('page-size-change', selectedPageSize.value)
}

// ページサイズが変更された時の監視
watch(
  () => props.itemsPerPage,
  (newSize) => {
    selectedPageSize.value = newSize
  },
)
</script>

<template>
  <div class="pagination-wrapper">
    <!-- ページ情報表示 -->
    <div class="pagination-info">
      <span class="items-info">
        {{ displayRange.start }}-{{ displayRange.end }} / {{ totalItems }}件
      </span>
    </div>

    <!-- メインページネーション -->
    <div class="pagination-container">
      <!-- 最初のページ -->
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1 || loading"
        class="paginate-button first-page"
        title="最初のページ"
      >
        ⟪
      </button>

      <!-- 前のページ -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1 || loading"
        class="paginate-button prev-page"
        title="前のページ"
      >
        ⟨
      </button>

      <!-- ページ番号ボタン -->
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :disabled="loading"
        class="paginate-button page-number"
        :class="{ 'active-page': page === currentPage }"
      >
        {{ page }}
      </button>

      <!-- 次のページ -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages || loading"
        class="paginate-button next-page"
        title="次のページ"
      >
        ⟩
      </button>

      <!-- 最後のページ -->
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages || loading"
        class="paginate-button last-page"
        title="最後のページ"
      >
        ⟫
      </button>
    </div>

    <!-- ページサイズ選択 -->
    <div class="page-size-selector">
      <label for="page-size">表示件数:</label>
      <select
        id="page-size"
        v-model="selectedPageSize"
        @change="changePageSize"
        :disabled="loading"
        class="page-size-select"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}件</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.pagination-info {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.pagination-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.paginate-button {
  height: 40px;
  min-width: 40px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: var(--bg-card);
  color: var(--text-color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.paginate-button:hover:not(:disabled) {
  background: var(--pokemon-secondary);
  border-color: var(--pokemon-primary);
  color: var(--color-white);
}

.paginate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.active-page {
  background: var(--pokemon-primary) !important;
  border-color: var(--pokemon-primary) !important;
  color: var(--color-white) !important;
}

.active-page:hover {
  background: var(--pokemon-secondary) !important;
}

.first-page,
.last-page {
  font-weight: bold;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.page-size-select {
  height: 32px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: var(--bg-card);
  color: var(--text-color-primary);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .pagination-wrapper {
    gap: 10px;
  }

  .pagination-container {
    flex-wrap: wrap;
    justify-content: center;
  }

  .paginate-button {
    height: 36px;
    min-width: 36px;
    font-size: 0.9rem;
  }

  .page-size-selector {
    flex-direction: column;
    text-align: center;
  }
}
</style>
