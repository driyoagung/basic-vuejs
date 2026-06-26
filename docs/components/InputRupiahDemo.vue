<script setup>
import { ref, computed } from 'vue'

const rawValue = ref(0)

const formattedRupiah = computed({
  get() {
    // Tampilkan dengan format Rp saat dibaca
    if (!rawValue.value) return ''
    return 'Rp ' + rawValue.value.toLocaleString('id-ID')
  },
  set(newValue) {
    // Bersihkan semua karakter non-digit saat user mengetik
    const numericString = newValue.replace(/[^\d]/g, '')
    rawValue.value = numericString ? parseInt(numericString, 10) : 0
  }
})
</script>

<template>
  <div class="demo-box">
    <label style="display: block; margin-bottom: 8px; font-weight: bold;">
      Harga Produk (Input Masking):
    </label>
    <input 
      v-model="formattedRupiah" 
      type="text" 
      class="demo-input"
      placeholder="Ketik angka..." 
    />
    <p style="margin-top: 12px; color: #475569;">
      Data Asli (Integer) yang disimpan di State: 
      <strong style="color: #3b82f6; font-size: 1.2em;">{{ rawValue }}</strong>
    </p>
  </div>
</template>

<style scoped>
.demo-box {
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  margin: 20px 0;
}
.demo-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
}
.demo-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
</style>
