<template>
  <div
    ref="containerRef"
    class="fiction-reader"
    @scroll="handleScroll"
  >
    <section
      ref="contentRef"
      :class="contentClass"
    >
      <div v-if="isEmpty">
        <slot name="empty"></slot>
      </div>

      <template v-else>
        <slot name="header"></slot>
        <p
          v-for="(item, index) in paragraphs"
          :key="`paragraph-${index}`"
          :class="paragraphClass"
        >
          {{item}}
        </p>
        <slot name="footer"></slot>
      </template>
    </section>
  </div>
</template>

<style lang="stylus">
  .fiction-reader
    height 100%
    text-align justify

    .font-size-default
      font-size 14px

    .line-height-default
      line-height 24px

    .paragraph-gap
      margin-top 0
      margin-bottom 12px

    .paragraph
      text-indent 2em
      padding 0
</style>

<script lang="ts" src="./Reader.ts"></script>
