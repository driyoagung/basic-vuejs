# Bab 22: Upload File & Handling Media

## 1️⃣ Upload File dengan FormData

```vue
<script setup>
import { ref } from 'vue'
import api from '@/lib/axios'

const file = ref(null)
const preview = ref(null)
const progress = ref(0)
const uploading = ref(false)

const onFileChange = (e) => {
  const selected = e.target.files[0]
  file.value = selected
  
  // Preview gambar
  if (selected && selected.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => { preview.value = e.target.result }
    reader.readAsDataURL(selected)
  }
}

const upload = async () => {
  if (!file.value) return
  uploading.value = true
  
  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('nama', 'Dokumen Saya')
  
  try {
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        progress.value = Math.round((e.loaded * 100) / e.total)
      },
    })
    alert('Upload berhasil!')
  } catch (err) {
    alert('Upload gagal: ' + err.message)
  } finally {
    uploading.value = false
    progress.value = 0
  }
}
</script>

<template>
  <div>
    <input type="file" @change="onFileChange" accept="image/*,.pdf" />
    
    <img v-if="preview" :src="preview" width="200" alt="Preview" />
    
    <div v-if="uploading" class="progress-bar">
      <div :style="{ width: progress + '%' }">{{ progress }}%</div>
    </div>
    
    <button @click="upload" :disabled="!file || uploading">
      {{ uploading ? 'Uploading...' : 'Upload' }}
    </button>
  </div>
</template>
```

---

## 2️⃣ Drag & Drop Upload

```vue
<script setup>
import { ref } from 'vue'

const isDragging = ref(false)
const files = ref([])

const onDrop = (e) => {
  isDragging.value = false
  files.value = [...e.dataTransfer.files]
}
</script>

<template>
  <div 
    :class="['dropzone', { dragging: isDragging }]"
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop.prevent="onDrop"
  >
    <p>📁 Drag file ke sini atau <label>pilih file</label></p>
  </div>
  
  <ul>
    <li v-for="f in files" :key="f.name">
      {{ f.name }} ({{ (f.size / 1024).toFixed(1) }} KB)
    </li>
  </ul>
</template>
```

---

## 3️⃣ Laravel: Handle Upload

```php
// Laravel Controller
public function upload(Request $request)
{
    $request->validate(['file' => 'required|file|max:5120']); // max 5MB
    
    $path = $request->file('file')->store('uploads', 'public');
    
    return response()->json([
        'path' => $path,
        'url' => asset('storage/' . $path),
    ]);
}
```

---

**Sebelumnya:** [← Bab 21 — Auth Sanctum](./21-auth-sanctum.md)
**Selanjutnya:** [Bab 23 — Error Handling →](./23-error-handling.md)
