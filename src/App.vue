<script setup lang="ts">

import { ref } from 'vue'
import Reader, { ReaderMode } from '../lib/reader.vue'
import text from './content.txt?raw'

const readerRef = ref<InstanceType<typeof Reader>>()

const menuVisible = ref(false)

const mode = ref<ReaderMode>('scroll')

const content = ref<string>(text)

const curPage = ref(0)

const totalPage = ref(0)

const fontSizeClass = ref('font-size-18')

const lineHeightClass = ref('line-height-30')

const paragraphGapClass = ref('paragraph-gap-20')

const handleChangeMode = () => {
  mode.value = mode.value === 'scroll'
    ? 'pagination'
    : 'scroll'
}

const handleChangeFontSize = () => {
  fontSizeClass.value = fontSizeClass.value === 'font-size-18'
    ? 'font-size-20'
    : 'font-size-18'
}

const handleChangeLineHeight = () => {
  lineHeightClass.value = lineHeightClass.value === 'line-height-30'
    ? 'line-height-32'
    : 'line-height-30'
}

const handleChangeParagraphGap = () => {
  paragraphGapClass.value = paragraphGapClass.value === 'paragraph-gap-20'
    ? 'paragraph-gap-22'
    : 'paragraph-gap-20'
}

const handleMenuVisibleClick = () => {
  menuVisible.value = !menuVisible.value
}

const handlePageChange = (page: number) => {
  curPage.value = page
}

const handleTotalPageChange = (total: number) => {
  totalPage.value = total
}

const handleNextClick = () => {
  readerRef.value?.renderNextPageContent()
}

const handlePrevClick = () => {
  readerRef.value?.renderPreviousPageContent()
}
</script>

<template>
  <div class="preview">
    <div class="action-area" v-show="menuVisible">
      <div class="item">
        <span>Read mode: </span>
        <button @click="handleChangeMode">{{mode}}</button>
      </div>
      <div class="item">
        <button @click="handleChangeFontSize">Change font size</button>
      </div>
      <div class="item">
        <button @click="handleChangeLineHeight">Change line height</button>
      </div>
      <div class="item">
        <button @click="handleChangeParagraphGap">Change paragraph gap</button>
      </div>
      <div v-show="mode === 'pagination'">
        <div class="item">
          <span>Total page: </span>
          <span>{{totalPage}}</span>
        </div>
        <div class="item">
          <span>Page: </span>
          <span>{{curPage}}</span>
        </div>
        <div class="item">
          <button @click="handlePrevClick">prev</button>
          &nbsp;
          <button @click="handleNextClick">next</button>
        </div>
      </div>
    </div>
    <button class="setting" @click="handleMenuVisibleClick"> ... </button>
    <div class="reader">
      <Reader
        ref="readerRef"
        :mode="mode"
        :context="content"
        line-break="\n"
        :font-size-class="fontSizeClass"
        :line-height-class="lineHeightClass"
        :paragraph-gap-class="paragraphGapClass"
        @page-change="handlePageChange"
        @total-page-change="handleTotalPageChange"
      >
        <template v-slot:header>
          <h1>测试内容</h1>
        </template>
      </Reader>
    </div>
  </div>
</template>

<style lang="stylus">
  .font-size-18
    font-size 18px

  .font-size-20
    font-weight bold
    font-size 20px

  .line-height-30
    line-height 30px

  .line-height-32
    line-height 32px

  .paragraph-gap-20
    margin-top 0
    margin-bottom 20px

  .paragraph-gap-22
    margin-top 0
    margin-bottom 22px

  .preview
    padding 10px
    box-sizing border-box

    .action-area
      position fixed
      left 0
      top 0
      padding 10px
      border 1px solid #888888
      background-color #ffffff
      z-index 1

      .item
        padding 10px 0

    .setting
      position fixed
      top 0
      right 0
      z-index 1

    .reader
      position fixed
      left 0
      right 0
      top 0
      bottom 0
      border 1px solid #1a1a1a

      .fiction-reader
        padding 0 20px
        box-sizing border-box
</style>
