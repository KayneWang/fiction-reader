import { defineComponent, ref } from 'vue'
import Reader from '../lib/Reader.vue'
import { ReaderMode, IReaderVM } from '../lib/Reader'
import text from './content.txt?raw'

export default defineComponent({
  components: {
    Reader
  },
  setup () {
    const readerRef = ref<IReaderVM>()

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

    return {
      readerRef,
      menuVisible,
      mode,
      content,
      curPage,
      totalPage,
      fontSizeClass,
      lineHeightClass,
      paragraphGapClass,
      handleChangeMode,
      handleMenuVisibleClick,
      handleTotalPageChange,
      handlePageChange,
      handleNextClick,
      handlePrevClick,
      handleChangeFontSize,
      handleChangeLineHeight,
      handleChangeParagraphGap
    }
  }
})
