import { test, expect } from '@playwright/test'

/**
 * Tests E2E para la funcionalidad de cambio de visibilidad de contenidos (HU-231)
 */
test.describe('Content Visibility Toggle - E2E', () => {
  // Configuración antes de cada test
  test.beforeEach(async ({ page }) => {
    // TODO: Implementar login como creador
    // await page.goto(`${import.meta.env.VITE_FRONTEND_URL}/login`)
    // await page.fill('input[name="email"]', 'creator@test.com')
    // await page.fill('input[name="password"]', 'password123')
    // await page.click('button[type="submit"]')
  })

  test.skip('creador puede cambiar visibilidad de su contenido', async ({ page }) => {
    // Ir al dashboard del creador
    await page.goto(`${import.meta.env.VITE_FRONTEND_URL}/creator/dashboard`)

    // Buscar el toggle del primer contenido
    const toggle = page.locator('.visibility-toggle input').first()
    
    // Verificar estado inicial (VISIBLE)
    await expect(toggle).toBeChecked()

    // Cambiar a OCULTO
    await toggle.click()

    // Verificar toast de éxito
    await expect(page.locator('.Toastify__toast--success')).toBeVisible()

    // Verificar que el toggle cambió de estado
    await expect(toggle).not.toBeChecked()

    // Verificar que se muestra el texto "Oculto"
    await expect(page.locator('text=/Oculto/i')).toBeVisible()
  })

  test.skip('contenido oculto no aparece en búsquedas públicas', async ({ page }) => {
    // Login como creador y ocultar un contenido
    await page.goto(`${import.meta.env.VITE_FRONTEND_URL}/creator/dashboard`)
    const toggle = page.locator('.visibility-toggle input').first()
    await toggle.click()

    // Logout o ir como usuario normal
    await page.goto(`${import.meta.env.VITE_FRONTEND_URL}/explore`)

    // Verificar que el contenido oculto no aparece
    await expect(page.locator('text=Contenido Test Oculto')).not.toBeVisible()
  })

  test.skip('usuario normal no puede ver toggle de visibilidad', async ({ page }) => {
    // Login como usuario normal (no creador)
    await page.goto(`${import.meta.env.VITE_FRONTEND_URL}/login`)
    // ... login as USER

    // Ir a vista de contenido
    await page.goto(`${import.meta.env.VITE_FRONTEND_URL}/content/123`)

    // Verificar que NO hay toggle
    await expect(page.locator('.visibility-toggle')).not.toBeVisible()
  })

  test.skip('error cuando se intenta cambiar visibilidad de contenido de otro', async ({ page }) => {
    // Login como creador A
    // Intentar modificar contenido de creador B
    await page.goto(`${import.meta.env.VITE_FRONTEND_URL}/creator/dashboard`)

    // Simular intento de cambiar contenido de otro (esto debería fallar en el backend)
    const toggle = page.locator('.visibility-toggle input').first()
    await toggle.click()

    // Verificar toast de error
    await expect(page.locator('.Toastify__toast--error')).toBeVisible()
    await expect(page.locator('text=/No tienes permiso/i')).toBeVisible()
  })
})

/**
 * Nota: Estos tests están marcados como skip porque requieren:
 * 1. Backend corriendo (Users Service en puerto 8080, Content Service en puerto 8081)
 * 2. Frontend corriendo (Vite en puerto 5173)
 * 3. Base de datos MongoDB con datos de prueba
 * 4. Sistema de autenticación funcionando
 * 
 * Para ejecutarlos:
 * 1. Iniciar Users Service: cd ESIMedia_BE/users && ./mvnw spring-boot:run -Dserver.port=8080
 * 2. Iniciar Content Service: cd ESIMedia_BE/content && ./mvnw spring-boot:run -Dserver.port=8081
 * 3. Iniciar frontend: cd ESIMedia_FE && npm run dev
 * 4. Quitar .skip de los tests
 * 5. Ejecutar: npx playwright test
 */
