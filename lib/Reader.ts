import { computed, defineComponent, nextTick, onMounted, PropType, ref, watch } from 'vue'

export type ReaderMode = 'scroll' | 'pagination'

export interface IReaderVM {
  renderNextPageContent: () => void
  renderPreviousPageContent: () => void
}

const EmptyDivElement = document.createElement('div')

export default defineComponent({
  props: {
    mode: {
      type: String as PropType<ReaderMode>,
      default: 'scroll'
    },
    context: {
      type: String,
      default: ''
    },
    lineBreak: {
      type: String,
      default: '\n'
    },
    defaultPage: {
      type: Number,
      default: 1
    },
    fontSizeClass: {
      type: String,
      default: 'font-size-default'
    },
    lineHeightClass: {
      type: String,
      default: 'line-height-default'
    },
    paragraphGapClass: {
      type: String,
      default: 'paragraph-gap'
    }
  },
  emits: ['total-page-change', 'page-change'],
  setup (
    props,
    { emit, expose }
  ) {
    const containerRef = ref<HTMLDivElement>(EmptyDivElement)

    const contentRef = ref<HTMLDivElement>(EmptyDivElement)

    const timer = ref<NodeJS.Timer>()

    const curPage = ref(1)

    const totalPage = ref(0)

    const paragraphs = ref<string[]>([])

    const curScrollTop = ref(0)

    const whRatio = ref(0)

    const isEmpty = computed(() => paragraphs.value.length === 0)

    const contentOffset = computed(() => {
      return containerRef.value.clientWidth
    })

    const contentClass = computed(() => [props.fontSizeClass, props.lineHeightClass])

    const paragraphClass = computed(() => ['paragraph', props.paragraphGapClass])

    const curMode = computed(() => props.mode)

    const curContext = computed(() => props.context)

    watch(curMode, () => setReadMode())

    watch(curContext, () => loadContext())

    watch([contentClass, paragraphClass], () => setReadMode())

    const loadContext = () => {
      clearCache()

      const splitReg = new RegExp(props.lineBreak)
      paragraphs.value = props.context.split(splitReg)

      return setReadMode()
    }

    const setReadMode = async () => {
      setReaderStyle()

      await nextTick()

      if (props.mode === 'pagination') {
        await setPaginationTotalPage()
        whRatio.value = await getPaginationWidth() / getScrollHeight()
        renderTargetPageContent(getTargetPageFromScrollTop())
      } else {
        containerRef.value.scrollTo({
          top: curScrollTop.value
        })
      }
    }

    const getPaddingOffset = () => {
      const left = getOffsetFromStyle(containerRef.value, 'padding-left')
      const right = getOffsetFromStyle(containerRef.value, 'padding-right')
      return left + right || 10
    }

    const getOffsetFromStyle = (ele: HTMLElement, style: string) => {
      const value = window
        .getComputedStyle(ele, null)
        .getPropertyValue(style)
        .replace(/[^0-9]/ig, '')
      return Number(value)
    }

    const setReaderStyle = () => {
      if (props.mode === 'pagination') {
        containerRef.value.style.overflow = 'hidden'

        contentRef.value.style.columnWidth = `${containerRef.value.clientWidth}px`
        contentRef.value.style.columnGap = `${getPaddingOffset()}px`
        contentRef.value.style.height = `${containerRef.value.clientHeight}px`
      } else {
        containerRef.value.style.overflow = 'auto'

        contentRef.value.style.columnWidth = ''
        contentRef.value.style.columnGap = ''
        contentRef.value.style.transform = ''
        contentRef.value.style.height = ''
      }
    }

    const setPaginationTotalPage = async () => {
      const cw = containerRef.value.clientWidth
      const width = await getPaginationWidth()
      totalPage.value = Math.ceil(width / cw)
      emit('total-page-change', totalPage.value)
    }

    const getPaginationWidth = async () => {
      await nextTick()
      const len = contentRef.value.children.length
      const lastChild = contentRef.value.children[len - 1] as HTMLParagraphElement
      return lastChild ? lastChild.offsetLeft + getPaddingOffset() : 0
    }

    const getScrollHeight = () => {
      let h = 0
      const children = contentRef.value.children || []
      for (let i = 0; i < children.length; i++) {
        h += children[i].clientHeight
      }
      return h
    }

    const getTargetPageFromScrollTop = () => {
      const cw = containerRef.value.clientWidth
      const ch = containerRef.value.clientHeight
      const t2w = (curScrollTop.value + ch) * whRatio.value
      const page = Math.floor(t2w / cw)
      return page || 1
    }

    const renderTargetPageContent = (page: number) => {
      const offset = contentOffset.value * (page - 1)
      contentRef.value.style.transform = `translateX(${-offset}px)`
      curScrollTop.value = Math.floor(offset / whRatio.value)
      emit('page-change', page)
    }

    const renderNextPageContent = () => {
      if (curPage.value === totalPage.value) {
        return
      }
      curPage.value++
      renderTargetPageContent(curPage.value)
    }

    const renderPreviousPageContent = () => {
      if (curPage.value === 1) {
        return
      }
      curPage.value--
      renderTargetPageContent(curPage.value)
    }

    const handleScroll = (e: Event) => {
      e.stopPropagation()
      e.preventDefault()
      if (props.mode === 'pagination') {
        return
      }
      const target = e.target as HTMLDivElement
      timer.value && clearTimeout(timer.value)
      timer.value = setTimeout(() => {
        curScrollTop.value = target.scrollTop
      }, 300)
    }

    const clearCache = () => {
      curPage.value = 1
      paragraphs.value = []
      curScrollTop.value = 0
    }

    onMounted(() => {
      curPage.value = props.defaultPage
      return loadContext()
    })

    expose({
      renderNextPageContent,
      renderPreviousPageContent
    })

    return {
      containerRef,
      handleScroll,
      contentRef,
      contentClass,
      isEmpty,
      paragraphs,
      paragraphClass
    }
  }
})
