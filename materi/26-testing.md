# Bab 26: Testing (Unit & E2E)

## 1️⃣ Setup Vitest

```bash
npm install -D vitest @vue/test-utils jsdom
```

```js
// vite.config.js — tambahkan test config
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

---

## 2️⃣ Unit Test Component

```js
// src/components/__tests__/Counter.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '../Counter.vue'

describe('Counter', () => {
  it('renders initial count', () => {
    const wrapper = mount(Counter)
    expect(wrapper.text()).toContain('0')
  })

  it('increments when button clicked', async () => {
    const wrapper = mount(Counter)
    await wrapper.find('button.increment').trigger('click')
    expect(wrapper.text()).toContain('1')
  })

  it('accepts initial prop', () => {
    const wrapper = mount(Counter, {
      props: { initial: 10 }
    })
    expect(wrapper.text()).toContain('10')
  })
})
```

---

## 3️⃣ Test Composable

```js
// src/composables/__tests__/useCounter.test.js
import { describe, it, expect } from 'vitest'
import { useCounter } from '../useCounter'

describe('useCounter', () => {
  it('starts at default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('increments', () => {
    const { count, increment } = useCounter(5)
    increment()
    expect(count.value).toBe(6)
  })

  it('computes doubled', () => {
    const { doubled } = useCounter(4)
    expect(doubled.value).toBe(8)
  })
})
```

---

## 4️⃣ Test Store (Pinia)

```js
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useTodoStore } from '../todo'

describe('Todo Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts empty', () => {
    const store = useTodoStore()
    expect(store.todos).toEqual([])
  })

  it('adds a todo', () => {
    const store = useTodoStore()
    store.addTodo('Test todo')
    expect(store.todos).toHaveLength(1)
    expect(store.todos[0].teks).toBe('Test todo')
  })
})
```

---

## 5️⃣ Menjalankan Test

```bash
# Jalankan semua test
npx vitest

# Watch mode
npx vitest --watch

# Dengan coverage
npx vitest --coverage
```

---

**Sebelumnya:** [← Bab 25 — Performance](./25-performance.md)
**Selanjutnya:** [Bab 27 — Deployment →](./27-deployment.md)
