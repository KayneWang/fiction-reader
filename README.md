# Fiction Reader (vue3)

This is a basic feature fiction reader designed for easier rendering of text.

## Usage

```shell
git clone git@github.com:KayneWang/fiction-reader.git

npm install

npm run dev
```

or

```shell
npm install @kaynewang/fiction-reader
```

> Note: Remember import the style.css file in your root js/ts file.

```ts
import '@kaynewang/fiction-reader/style.css'
```

## Properties

| Name                | Description         | Default        |
|---------------------|---------------------|----------------|
| mode                | scroll, pagination  | scroll         |
| context             | render text         | ''             |
| line-break          | text line break tag | \n             |
| font-size-class     | -                   | built-in class |
| line-height-class   | -                   | built-in class |
| paragraph-gap-class | -                   | built-in class |

## Events

| Name              | Description                               |
|-------------------|-------------------------------------------|
| page-change       | callback function for page turning        |
| total-page-change | callback function for total page changing |

## Pagination

```html
<Reader
  ref="readerRef"
  mode="pagination"
  context="test context"
/>
```

```vue
const readerRef = ref()

readerRef.value?.renderNextPageContent() // Next page

readerRef.value?.renderPreviousPageContent() // Previous page
```

For more usage, please refer to src/App.vue
