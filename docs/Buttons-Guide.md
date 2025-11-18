# 🎨 Guía Completa de Botones - ESIMedia

Esta guía documenta exhaustivamente el sistema unificado de botones implementado en `Buttons.css`, proporcionando una referencia completa para desarrolladores y diseñadores.

## 📋 Índice

- [Sistema de Diseño](#-sistema-de-diseño)
- [Botones Principales](#-botones-principales)
- [Modificadores de Tamaño](#-modificadores-de-tamaño)
- [Botones Específicos por Función](#-botones-específicos-por-función)
- [Botones Especiales](#-botones-especiales)
- [Sistema de Avatares](#-sistema-de-avatares)
- [Comportamiento Responsive](#-comportamiento-responsive)
- [Guía de Implementación](#-guía-de-implementación)

---

## 🎨 Sistema de Diseño

### Tokens de Diseño
- **Colores**: Gradientes azul-cian para primarios, dorados para premium, rojos para cancelar
- **Dimensiones**: Altura fija de 44px, ancho mínimo de 120px (200px para botones específicos)
- **Tipografía**: Font-weight 600, tamaños responsivos con clamp()
- **Efectos**: Sombras, transformaciones hover, transiciones suaves

### Comportamiento Responsive
- **Desktop**: Ancho mínimo consistente
- **Móvil (≤767px)**: Expansión a ancho completo (100%)
- **Excepciones**: Botones circulares y de notificaciones mantienen tamaño fijo

---

## 🔘 Botones Principales

### 1. Botón Primario (`btn-primary`)

**Cuándo usar:**
- Acciones principales de llamada a acción
- Envío de formularios importantes
- Navegación crítica en la aplicación
- Confirmaciones de acciones irreversibles

**Cómo usar:**
```html
<button class="btn btn-primary">Texto de ejemplo</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: linear-gradient(90deg, #00e5ff, #5aa0ff, #b455ff); color: #fff; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; min-width: 120px; height: 44px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; border: none; font-family: system-ui;">Texto de ejemplo</button>
</div>

**CSS correspondiente:**
```css
.btn-primary {
  background: linear-gradient(90deg, #00e5ff, #5aa0ff, #b455ff);
  color: #fff;
  padding: clamp(10px, 1.2vw, 18px) clamp(16px, 2vw, 28px);
  border-radius: clamp(10px, 1.2vw, 16px);
  font-size: clamp(13px, 1.1vw, 16px);
  font-weight: 600;
  min-width: 120px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #00c5e6, #00d4ff, #0ae);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 229, 255, 0.3);
}
```

---

### 2. Botón Secundario (`btn-secondary`)

**Cuándo usar:**
- Acciones secundarias o alternativas
- Navegación opcional
- Cancelar operaciones no críticas
- Acciones que no requieren atención inmediata

**Cómo usar:**
```html
<button class="btn btn-secondary">Texto de ejemplo</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: transparent; border: 1px solid #9ca3af; color: #e5e7eb; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; min-width: 120px; height: 44px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; font-family: system-ui;">Texto de ejemplo</button>
</div>

**CSS correspondiente:**
```css
.btn-secondary {
  background: transparent;
  border: 1px solid #9ca3af;
  color: #e5e7eb;
  padding: clamp(10px, 1.2vw, 18px) clamp(16px, 2vw, 28px);
  border-radius: clamp(10px, 1.2vw, 16px);
  font-size: clamp(13px, 1.1vw, 16px);
  font-weight: 600;
  min-width: 120px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #1f2937;
  border-color: #00e5ff;
  transform: translateY(-1px);
}
```

---

### 3. Botón Cancelar (`btn-cancel`)

**Cuándo usar:**
- Cancelar acciones en curso
- Eliminar elementos o datos
- Cerrar modales o diálogos
- Revertir cambios no guardados

**Cómo usar:**
```html
<button class="btn btn-cancel">Texto de ejemplo</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: system-ui; position: relative; overflow: hidden;">Texto de ejemplo</button>
</div>

**CSS correspondiente:**
```css
.btn-cancel {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: clamp(10px, 1.2vw, 18px) clamp(16px, 2vw, 28px);
  border-radius: calc(clamp(10px, 1.2vw, 16px) * 0.7);
  font-size: clamp(13px, 1.1vw, 16px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn-cancel::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
  transition: left 0.5s ease;
}

.btn-cancel:hover::before {
  left: 100%;
}

.btn-cancel:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}
```

---

### 4. Botón Premium (`btn-premium`)

**Cuándo usar:**
- Acceder a contenido premium o de pago
- Funciones avanzadas o upgrades
- Contenido exclusivo para suscriptores
- Promociones especiales
- **Envío de formularios largos y complejos**
- **Creación de contenido nuevo**
- **Procesos de registro multi-paso**
- **Acciones de guardado importantes**

**Características principales:**
- ✅ **MISMA FORMA que `btn-primary`** (dimensiones, padding, border-radius)
- ✅ **Degradado dorado-naranja** (`linear-gradient(135deg, #FFD700, #FF8F00)`)
- ✅ **Texto negro** para contraste óptimo
- ✅ **Soporta modificador `btn-sm`** manteniendo colores
- ✅ **Estados hover** con inversión del degradado

**Cómo usar:**
```html
<!-- Botón premium estándar (CTA grande) -->
<button class="btn btn-premium">Texto de ejemplo</button>

<!-- Botón premium pequeño (mantiene degradado dorado) -->
<button class="btn btn-premium btn-sm">Texto pequeño</button>

<!-- Toggle premium con modificadores -->
<button class="btn btn-premium btn-sm btn-premium--toggle premium">Premium</button>
<button class="btn btn-premium btn-sm btn-premium--toggle free">Gratuito</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: linear-gradient(135deg, #ffd700, #ff8f00); color: #000; padding: 16px 48px; border-radius: 8px; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; transition: all 0.3s ease; border: none; font-family: system-ui; min-width: 200px; display: inline-flex; align-items: center; justify-content: center;">Texto de ejemplo</button>
</div>

**Modificadores disponibles:**
- `btn-sm`: Versión compacta para toggles y acciones pequeñas
- `btn-premium--toggle`: Estilos específicos para botones toggle premium/free
  - `.premium`: Estado premium activo (dorado)
  - `.free`: Estado gratuito (gris)

**CSS correspondiente:**
```css
/* Botón premium base - MISMA FORMA que btn-primary */
.btn-premium {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--btn-padding-md); /* MISMO padding que btn-primary */
  background: var(--btn-premium-bg);
  color: #000;
  font-weight: 600; /* MISMO font-weight que btn-primary */
  font-size: var(--btn-font-size-md); /* MISMO font-size que btn-primary */
  border: none;
  border-radius: var(--btn-radius-md); /* MISMO border-radius que btn-primary */
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: var(--btn-min-width); /* MISMO min-width que btn-primary */
  height: var(--btn-height); /* MISMA height que btn-primary */
  gap: 8px;
  text-decoration: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Modificador pequeño */
.btn-premium.btn-sm {
  padding: var(--btn-padding-sm);
  border-radius: var(--btn-radius-sm);
  font-size: var(--btn-font-size-sm);
  font-weight: 600;
  min-width: auto;
  height: auto;
  background: var(--btn-premium-bg); /* Mantiene el degradado dorado */
  color: #000; /* Mantiene el color negro del texto */
}

/* Modificador toggle */
.btn-premium--toggle.premium {
  color: #fbbf24;
  border-color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}

.btn-premium--toggle.free {
  color: var(--muted);
  border-color: #334155;
}

.btn-premium:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(255, 215, 0, 0.4);
  background: var(--btn-premium-hover);
}

.btn-premium:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
```

---

## 📏 Modificadores de Tamaño

### 5. Botón Pequeño (`btn-sm`)

**Cuándo usar:**
- Headers y barras de navegación
- Acciones compactas en espacios reducidos
- Listas o tablas con múltiples acciones
- Controles secundarios
- **Toggles premium/free en CreatorPage**

**Cómo usar:**
```html
<!-- Todos los botones principales soportan btn-sm -->
<button class="btn btn-primary btn-sm">Primario pequeño</button>
<button class="btn btn-secondary btn-sm">Secundario pequeño</button>
<button class="btn btn-cancel btn-sm">Cancelar pequeño</button>
<button class="btn btn-premium btn-sm">Premium pequeño</button>

<!-- Toggle premium con modificadores -->
<button class="btn btn-premium btn-sm btn-premium--toggle premium">Premium</button>
<button class="btn btn-premium btn-sm btn-premium--toggle free">Gratuito</button>
```

**Botones que soportan `btn-sm`:**
- ✅ `btn-primary` - Botones primarios pequeños
- ✅ `btn-secondary` - Botones secundarios pequeños
- ✅ `btn-cancel` - Botones de cancelar pequeños
- ✅ `btn-premium` - Botones premium pequeños (incluyendo toggles)

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: linear-gradient(90deg, #00e5ff, #5aa0ff, #b455ff); color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; font-family: system-ui; margin-right: 8px;">Primario</button>
<button style="background: transparent; border: 1px solid #9ca3af; color: #e5e7eb; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: system-ui; margin-right: 8px;">Secundario</button>
<button style="background: linear-gradient(135deg, #ffd700, #ff8f00); color: #000; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; font-family: system-ui;">Premium</button>
</div>

**CSS correspondiente:**
```css
/* Modificador pequeño para todos los botones principales */
.btn-primary.btn-sm,
.btn-secondary.btn-sm,
.btn-cancel.btn-sm,
.btn-premium.btn-sm {
  padding: var(--btn-padding-sm);
  border-radius: var(--btn-radius-sm);
  font-size: var(--btn-font-size-sm);
  font-weight: 600;
  min-width: auto;
  height: auto;
}
```

---

## 🎨 Botones Específicos por Función

### 6. Call to Action (`cta`)

**Cuándo usar:**
- Llamadas a acción destacadas en landings
- Botones principales en banners promocionales
- Acciones de conversión importantes
- Páginas de destino y marketing

**Cómo usar:**
```html
<button class="cta">Texto de ejemplo</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: linear-gradient(90deg, #00e5ff, #5aa0ff, #b455ff); color: white; border: none; padding: 8px 24px; border-radius: 999px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; font-family: system-ui;">Texto de ejemplo</button>
</div>

**CSS correspondiente:**
```css
.cta {
  background: linear-gradient(90deg, #00e5ff, #5aa0ff, #b455ff);
  color: white;
  border: none;
  padding: clamp(8px, 1vw, 14px) clamp(12px, 1.5vw, 24px);
  border-radius: 999px;
  font-weight: 600;
  font-size: clamp(12px, 1vw, 15px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cta:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}
```

---

### 7. Botón de Autenticación (`btn-auth`)

**Cuándo usar:**
- Formularios de login y registro
- Botones de autenticación social (Google, Facebook, etc.)
- Acceso a cuentas de usuario
- Verificación de identidad

**Cómo usar:**
```html
<button class="btn-auth">Texto de ejemplo</button>
<button class="btn-auth">
  <svg width="20" height="20"><!-- Icono --></svg>
  Continuar con Google
</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: linear-gradient(135deg, #00e5ff, #5aa0ff); color: white; border: none; border-radius: 8px; padding: 14px 32px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: system-ui; display: flex; align-items: center; justify-content: center; gap: 8px;">Texto de ejemplo</button>
</div>

**CSS correspondiente:**
```css
.btn-auth {
  background: linear-gradient(135deg, #00e5ff, #5aa0ff);
  color: white;
  border: none;
  border-radius: 8px;
  padding: clamp(14px, 2.8vw, 16px) clamp(24px, 4vw, 32px);
  font-size: clamp(15px, 2.8vw, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: clamp(8px, 2vw, 16px);
}

.btn-auth:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 229, 255, 0.3);
}

.btn-auth:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
```

---

### 8. Botón de Cambio de Modo (`btn-mode-switch`)

**Cuándo usar:**
- Alternar entre modo oscuro y claro
- Cambiar vistas o layouts
- Seleccionar preferencias de usuario
- Configuraciones de interfaz

**Cómo usar:**
```html
<button class="btn-mode-switch">Texto de ejemplo</button>
<button class="btn-mode-switch secondary">Texto de ejemplo</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: linear-gradient(135deg, #00e5ff, #5aa0ff); color: white; border: none; border-radius: 8px; padding: 10px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: system-ui; margin-right: 8px;">Texto de ejemplo</button>
<button style="background: transparent; border: 1px solid #9ca3af; color: #e5e7eb; border-radius: 8px; padding: 10px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: system-ui;">Texto de ejemplo</button>
</div>

**CSS correspondiente:**
```css
.btn-mode-switch {
  background: linear-gradient(135deg, #00e5ff, #5aa0ff);
  color: white;
  border: none;
  border-radius: 8px;
  padding: clamp(10px, 2.2vw, 12px) clamp(20px, 3.5vw, 24px);
  font-size: clamp(13px, 2.3vw, 15px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-mode-switch.secondary {
  background: transparent;
  border: 1px solid #9ca3af;
  color: #e5e7eb;
}

.btn-mode-switch:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 229, 255, 0.2);
}

.btn-mode-switch.secondary:hover {
  background: #1f2937;
  box-shadow: none;
}
```

---

### 9. Botones de Cookies

**Cuándo usar:**
- Gestión de consentimiento de cookies
- Configuración de privacidad
- Preferencias de usuario sobre tracking
- Cumplimiento con regulaciones de privacidad

**Cómo usar:**
```html
<button class="cookie-btn cookie-btn-accept">Texto de ejemplo</button>
<button class="cookie-btn cookie-btn-reject">Texto de ejemplo</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: linear-gradient(135deg, #00e5ff, #5aa0ff); color: #0b0f17; padding: 8px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; font-family: system-ui; margin-right: 8px;">Texto de ejemplo</button>
<button style="background: rgba(156, 163, 175, 0.1); color: #9ca3af; border: 1px solid #9ca3af; padding: 8px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: system-ui;">Texto de ejemplo</button>
</div>

**CSS correspondiente:**
```css
.cookie-btn {
  padding: clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px);
  border-radius: calc(8px * 0.7);
  font-size: clamp(13px, 2.2vw, 15px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  position: relative;
  overflow: hidden;
}

.cookie-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.cookie-btn:hover::before {
  left: 100%;
}

.cookie-btn-accept {
  background: linear-gradient(135deg, #00e5ff, #5aa0ff);
  color: #0b0f17;
  font-weight: 600;
  min-width: clamp(90px, 15vw, 120px);
}

.cookie-btn-accept:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 229, 255, 0.3);
  filter: brightness(1.1);
}

.cookie-btn-reject {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
  border: 1px solid #9ca3af;
}

.cookie-btn-reject:hover {
  background: rgba(156, 163, 175, 0.2);
  color: #e5e7eb;
  transform: translateY(-1px);
}
```

---

## 🎭 Botones Especiales

### 10. Botón Circular (`btn-circle`)

**Cuándo usar:**
- Iconos de acción flotantes
- Controles de navegación compactos
- Acciones rápidas sin texto
- Elementos de interfaz minimalistas

**Cómo usar:**
```html
<button class="btn-circle">⚙️</button>
<button class="btn-circle">✖️</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="width: 40px; height: 40px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; cursor: pointer; transition: all 0.2s ease; border: none; background: linear-gradient(135deg, #00e5ff, #5aa0ff); color: white; margin-right: 8px;">⚙️</button>
<button style="width: 40px; height: 40px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; cursor: pointer; transition: all 0.2s ease; border: none; background: linear-gradient(135deg, #00e5ff, #5aa0ff); color: white;">✖️</button>
</div>

**CSS correspondiente:**
```css
.btn-circle {
  width: clamp(32px, 3vw, 40px);
  height: clamp(32px, 3vw, 40px);
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(16px, 1.4vw, 18px);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: linear-gradient(135deg, #00e5ff, #5aa0ff);
  color: white;
}

.btn-circle:hover {
  transform: scale(1.1);
}
```

---

### 11. Botón de Notificaciones (`btn-notifications`)

**Cuándo usar:**
- Centro de notificaciones
- Alertas y mensajes del sistema
- Contadores de elementos pendientes
- Estados de actividad

**Cómo usar:**
```html
<button class="btn-notifications">
  🔔
  <span class="notification-badge">3</span>
</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="position: relative; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #e5e7eb; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; transition: all 0.2s ease;">
  🔔
  <span style="position: absolute; top: -4px; right: -4px; background: #00e5ff; color: white; font-size: 10px; font-weight: 600; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">3</span>
</button>
</div>

**CSS correspondiente:**
```css
.btn-notifications {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e5e7eb;
  width: clamp(32px, 3vw, 40px);
  height: clamp(32px, 3vw, 40px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(14px, 1.2vw, 16px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-notifications:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.btn-notifications .notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #00e5ff;
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

---

## 👤 Sistema de Avatares

### Avatares de Usuario

**Cuándo usar:**
- Perfiles de usuario
- Iniciales cuando no hay foto
- Elementos de identificación personal
- Áreas de usuario en headers

**Cómo usar:**
```html
<!-- Avatar estándar -->
<div class="user-avatar-btn">
  <div class="user-avatar">JD</div>
</div>

<!-- Avatar grande -->
<div class="user-avatar-large">
  <div class="user-avatar">JD</div>
</div>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #00e5ff, #5aa0ff); display: flex; align-items: center; justify-content: center; margin-right: 10px;">
  <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; font-weight: 600;">JD</div>
</div>
<div style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #00e5ff, #5aa0ff); display: flex; align-items: center; justify-content: center;">
  <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; font-weight: 600;">JD</div>
</div>
</div>

**CSS correspondiente:**
```css
.user-avatar-btn,
.user-avatar,
.user-avatar-large {
  border-radius: 50% !important;
  aspect-ratio: 1/1;
}

.user-avatar-btn {
  min-width: clamp(32px, 3vw, 40px);
  max-width: clamp(32px, 3vw, 40px);
  width: clamp(32px, 3vw, 40px);
  height: clamp(32px, 3vw, 40px);
  overflow: hidden;
  background: linear-gradient(135deg, #00e5ff, #5aa0ff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(16px, 2vw, 20px);
  color: white;
  font-weight: 600;
}

.user-avatar-large {
  width: clamp(48px, 5vw, 64px);
  height: clamp(48px, 5vw, 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00e5ff, #5aa0ff);
}

.user-avatar-large .user-avatar {
  font-size: clamp(24px, 3vw, 32px);
}
```

---

### 12. Botón de Subida de Contenido (`content-upload-card`)

**Cuándo usar:**
- Páginas de creador de contenido
- Áreas de subida de archivos multimedia
- Call-to-action para crear nuevo contenido
- Secciones principales de dashboard de creador

**Cómo usar:**
```html
<button class="content-upload-card" onclick="handleUpload()">
  <div class="upload-header">
    <h2>Subir Contenido</h2>
  </div>
  <div class="upload-icon">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
    </svg>
  </div>
  <p>Arrastra y suelta o haz clic para subir</p>
</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="cursor: pointer; width: 200px; height: 150px; text-align: center; background: linear-gradient(135deg, #00e5ff, #5aa0ff, #b455ff); border-radius: 12px; color: #fff; box-shadow: 0 8px 32px rgba(0, 229, 255, 0.15); border: 2px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px; font-family: system-ui;">
  <div style="font-size: 18px; font-weight: 600;">📤 Subir Contenido</div>
  <div style="font-size: 32px;">📁</div>
  <div style="font-size: 12px; opacity: 0.9;">Arrastra y suelta</div>
</button>
</div>

**CSS correspondiente:**
```css
.content-upload-card {
  cursor: pointer;
  width: 100%;
  text-align: center;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2), var(--accent-3));
  border-radius: var(--radius);
  padding: var(--section-padding);
  color: #fff;
  box-shadow: 0 8px 32px rgba(0, 229, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: clamp(12px, 2vw, 20px);
}

.content-upload-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.content-upload-card:hover::before {
  transform: translateX(100%);
}

.content-upload-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 229, 255, 0.25);
}

.content-upload-card:active {
  transform: translateY(-2px);
}
```

---

### 13. Botón Pequeño con Ícono (`btn-small-icon`)

**Cuándo usar:**
- Acciones de edición en listas de contenido
- Controles compactos en interfaces densas
- Iconos de acción sin texto descriptivo
- Elementos de interfaz minimalistas

**Cómo usar:**
```html
<button class="btn-small-icon" title="Editar">
  ✏️
</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: transparent; border: 1px solid #334155; border-radius: 6px; padding: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; position: relative; color: #64748b; font-size: 16px;">✏️</button>
</div>

**CSS correspondiente:**
```css
.btn-small-icon {
  background: transparent;
  border: 1px solid #334155;
  border-radius: clamp(6px, 0.8vw, 8px);
  padding: clamp(6px, 0.8vw, 8px);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: var(--muted);
}

.btn-small-icon:hover {
  background: rgba(90, 160, 255, 0.1);
  border-color: var(--accent-2);
  color: var(--accent-2);
  transform: translateY(-1px);
}
```

---

### 14. Botón de Visibilidad (`visibility-btn`)

**Cuándo usar:**
- Toggle de visibilidad de contenido público/privado
- Controles de estado visible/oculto
- Gestión de privacidad de elementos
- Estados binarios de activación

**Cómo usar:**
```html
<button class="visibility-btn visible" onclick="toggleVisibility()">
  👁️
</button>
<button class="visibility-btn hidden" onclick="toggleVisibility()">
  🙈
</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: transparent; border: 1px solid #334155; border-radius: 6px; padding: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; position: relative; color: #00e5ff; border-color: #00e5ff; background: rgba(0, 229, 255, 0.1); margin-right: 8px;">👁️</button>
<button style="background: transparent; border: 1px solid #334155; border-radius: 6px; padding: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; position: relative; color: #64748b; border-color: #334155;">🙈</button>
</div>

**CSS correspondiente:**
```css
.visibility-btn {
  background: transparent;
  border: 1px solid #334155;
  border-radius: clamp(6px, 0.8vw, 8px);
  padding: clamp(6px, 0.8vw, 8px);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.visibility-btn.visible {
  color: var(--accent-1);
  border-color: var(--accent-1);
  background: rgba(0, 229, 255, 0.1);
}

.visibility-btn.hidden {
  color: var(--muted);
  border-color: #334155;
}

.visibility-btn:hover {
  background: rgba(90, 160, 255, 0.1);
  border-color: var(--accent-2);
  color: var(--accent-2);
  transform: translateY(-1px);
}
```

---

### 15. Botón Premium (`premium-btn`)

**Cuándo usar:**
- Toggle de contenido premium/free
- Gestión de estados de suscripción
- Controles de monetización
- Estados premium vs gratuito

**Cómo usar:**
```html
<button class="premium-btn premium" onclick="togglePremium()">
  ⭐
</button>
<button class="premium-btn free" onclick="togglePremium()">
  🔒
</button>
```

**Vista previa:**
<div style="padding: 10px; background: #0b0f17; border-radius: 8px; display: inline-block; margin: 10px 0;">
<button style="background: transparent; border: 1px solid #334155; border-radius: 6px; padding: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; position: relative; color: #fbbf24; border-color: #fbbf24; background: rgba(251, 191, 36, 0.1); margin-right: 8px;">⭐</button>
<button style="background: transparent; border: 1px solid #334155; border-radius: 6px; padding: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; position: relative; color: #64748b; border-color: #334155;">🔒</button>
</div>

**CSS correspondiente:**
```css
.premium-btn {
  background: transparent;
  border: 1px solid #334155;
  border-radius: clamp(6px, 0.8vw, 8px);
  padding: clamp(6px, 0.8vw, 8px);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.premium-btn.premium {
  color: #fbbf24;
  border-color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}

.premium-btn.premium::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  border-radius: inherit;
  z-index: -1;
  opacity: 0.3;
}

.premium-btn.free {
  color: var(--muted);
  border-color: #334155;
}

.premium-btn:hover {
  background: rgba(90, 160, 255, 0.1);
  border-color: var(--accent-2);
  color: var(--accent-2);
  transform: translateY(-1px);
}

.premium-btn.premium:hover {
  background: rgba(251, 191, 36, 0.2);
  border-color: #fbbf24;
  color: #fbbf24;
}
```

---

## 📱 Comportamiento Responsive

### Breakpoints
- **767px**: Botones principales se expanden a 100%
- **480px**: Ajustes de avatar
- **425px**: Ajustes finales

### Excepciones
Los siguientes botones mantienen tamaño fijo en móvil:
- `.btn-sm`
- `.btn-circle`
- `.btn-notifications`

**CSS responsive:**
```css
/* Móviles grandes */
@media (max-width: 767px) {
  .btn:not(.btn-sm):not(.btn-circle):not(.btn-notifications) {
    width: 100%;
    text-align: center;
  }
}

/* Móviles medianos */
@media (max-width: 480px) {
  .user-avatar-btn {
    min-width: clamp(28px, 6vw, 32px);
    max-width: clamp(28px, 6vw, 32px);
    width: clamp(28px, 6vw, 32px);
    height: clamp(28px, 6vw, 32px);
  }
}

/* Móviles pequeños */
@media (max-width: 425px) {
  .user-avatar-btn {
    min-width: 30px !important;
    max-width: 30px !important;
    width: 30px !important;
    height: 30px !important;
    flex-shrink: 0;
  }

  .user-avatar {
    width: 30px !important;
    height: 30px !important;
    font-size: 14px !important;
  }

  .user-avatar-large {
    width: 40px !important;
    height: 40px !important;
    font-size: 20px !important;
  }
}
```

---

## 🎯 Guía de Implementación

### Clases Combinables
```html
<!-- Botón primario pequeño -->
<button class="btn btn-primary btn-sm">Acción</button>

<!-- Botón secundario con modificador -->
<button class="btn btn-secondary">Acción</button>
```

### Mejores Prácticas
1. **Jerarquía**: Usa primario para acciones principales, secundario para alternativas
2. **Espaciado**: Los botones incluyen `margin: 4px` por defecto
3. **Accesibilidad**: Incluye `aria-label` cuando sea necesario
4. **Estados**: Maneja estados `:disabled` apropiadamente

### Variables CSS Personalizables
```css
:root {
  --btn-min-width: 120px;
  --btn-height: 44px;
  --btn-primary-bg: linear-gradient(90deg, #00e5ff, #5aa0ff, #b455ff);
}
```

### Ejemplo Completo de Implementación
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejemplo de Botones</title>
    <link rel="stylesheet" href="src/styles/components/Buttons.css">
</head>
<body>
    <!-- Botón primario -->
    <button class="btn btn-primary">Texto de ejemplo</button>

    <!-- Botón secundario -->
    <button class="btn btn-secondary">Texto de ejemplo</button>

    <!-- Botón cancelar -->
    <button class="btn btn-cancel">Texto de ejemplo</button>

    <!-- Botón premium -->
    <button class="btn btn-premium">Texto de ejemplo</button>

    <!-- Botón pequeño -->
    <button class="btn btn-primary btn-sm">Texto de ejemplo</button>

    <!-- Call to action -->
    <button class="cta">Texto de ejemplo</button>

    <!-- Botón de autenticación -->
    <button class="btn-auth">Texto de ejemplo</button>

    <!-- Botón de cambio de modo -->
    <button class="btn-mode-switch">Texto de ejemplo</button>

    <!-- Botones de cookies -->
    <button class="cookie-btn cookie-btn-accept">Texto de ejemplo</button>
    <button class="cookie-btn cookie-btn-reject">Texto de ejemplo</button>

    <!-- Botón circular -->
    <button class="btn-circle">⚙️</button>

    <!-- Botón de notificaciones -->
    <button class="btn-notifications">🔔<span class="notification-badge">3</span></button>

    <!-- Botones especiales -->
    <button class="content-upload-card" style="width: 150px; height: 100px; margin: 10px;">
      <div>📤 Subir</div>
    </button>
    <button class="btn-small-icon" title="Editar">✏️</button>
    <button class="visibility-btn visible" title="Visible">👁️</button>
    <button class="premium-btn premium" title="Premium">⭐</button>

    <!-- Avatares -->
    <div class="user-avatar-btn">
        <div class="user-avatar">JD</div>
    </div>
</body>
</html>
```

---

*Última actualización: Octubre 2025 - Añadidos botones especiales (content-upload-card, btn-small-icon, visibility-btn, premium-btn)*
*Archivo fuente: `src/styles/components/Buttons.css`*