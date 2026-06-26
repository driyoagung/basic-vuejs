# Bab 21: Autentikasi dengan Laravel Sanctum

## 📖 Flow Autentikasi SPA

```
1. User submit login form
2. Vue → POST /api/login → Laravel
3. Laravel validate → return token
4. Vue simpan token di localStorage
5. Setiap request selanjutnya: Authorization: Bearer {token}
6. Logout: hapus token
```

---

## 1️⃣ Laravel Setup (Sanctum)

```bash
# Install Sanctum
composer require laravel/sanctum
php artisan install:api
```

```php
// routes/api.php
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
```

```php
// AuthController.php
public function login(Request $request)
{
    $request->validate(['email' => 'required', 'password' => 'required']);
    
    $user = User::where('email', $request->email)->first();
    
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    
    $token = $user->createToken('spa-token')->plainTextToken;
    
    return response()->json(['user' => $user, 'token' => $token]);
}

public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
}
```

---

## 2️⃣ Vue: Auth Store

```js
// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    const { data } = await api.post('/login', { email, password })
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function register(form) {
    const { data } = await api.post('/register', form)
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function fetchUser() {
    try {
      const { data } = await api.get('/user')
      user.value = data
    } catch {
      logout()
    }
  }

  function logout() {
    api.post('/logout').catch(() => {})
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isAuthenticated, login, register, fetchUser, logout }
})
```

---

## 3️⃣ Vue: Login Page

```vue
<!-- src/views/LoginView.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form.value.email, form.value.password)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <h1>🔐 Login</h1>
    <p v-if="error" class="error">{{ error }}</p>
    <form @submit.prevent="handleLogin">
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model="form.password" type="password" placeholder="Password" required />
      <button :disabled="loading" type="submit">
        {{ loading ? 'Loading...' : 'Login' }}
      </button>
    </form>
  </div>
</template>
```

---

## 4️⃣ Route Guard

```js
// src/router/index.js
import { useAuthStore } from '@/stores/auth'

router.beforeEach((to) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  
  if (to.meta.guest && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})
```

---

**Sebelumnya:** [← Bab 20 — CRUD Fullstack](./20-crud-fullstack.md)
**Selanjutnya:** [Bab 22 — Upload File →](./22-upload-file.md)
