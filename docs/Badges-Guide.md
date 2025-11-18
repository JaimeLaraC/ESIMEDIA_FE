# 🏷️ Guía Completa de Badges - ESIMedia

Esta guía documenta exhaustivamente el sistema unificado de badges implementado en `Badges.css`, proporcionando una referencia completa para desarrolladores y diseñadores.

## 📋 Índice

- [Sistema de Diseño](#-sistema-de-diseño)
- [Clases Base](#-clases-base)
- [Modificadores de Tamaño](#-modificadores-de-tamaño)
- [Modificadores de Color/Rol](#-modificadores-de-colorrol)
- [Badges Específicos](#-badges-específicos)
- [Comportamiento Responsive](#-comportamiento-responsive)
- [Guía de Implementación](#-guía-de-implementación)

---

## 🎨 Sistema de Diseño

### Tokens de Diseño
- **Colores**: Gradientes dorados para premium, colores sólidos para roles
- **Dimensiones**: Tres tamaños (sm/md/lg) con clamp() responsive
- **Tipografía**: Font-weight 600, tamaños escalables
- **Efectos**: Sombras, animaciones shimmer para premium

### Comportamiento Responsive
- **Móvil**: Reducción automática de padding y font-size
- **Desktop**: Tamaños completos con clamp()
- **Badges circulares**: Mantenimiento de proporciones

---

## 🔸 Clases Base

### Badge Base (`badge`)
Clase base requerida para todos los badges.

```css
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  /* ... más propiedades base */
}
```

---

## 📏 Modificadores de Tamaño

### 1. Badge Pequeño (`badge-sm`)
Para badges compactos y secundarios.

**Uso típico:**
- Badges de "Recomendado" en tarjetas de planes
- Indicadores premium pequeños en headers
- Etiquetas secundarias

```html
<div class="badge badge-sm badge-recommended">Recomendado</div>
```

### 2. Badge Mediano (`badge-md`) - *Predeterminado*
Tamaño estándar para la mayoría de los casos.

**Uso típico:**
- Badges de rol en perfiles de usuario
- Etiquetas principales

```html
<span class="badge badge-md badge-premium">Premium</span>
```

### 3. Badge Grande (`badge-lg`)
Para badges destacados y CTA.

**Uso típico:**
- Badges de énfasis especial
- Anuncios importantes

```html
<div class="badge badge-lg badge-premium">¡Nuevo!</div>
```

### 4. Badge Circular (`badge-circle`)
Para badges de rol en avatares.

**Uso típico:**
- Indicadores de rol en fotos de perfil
- Badges de creator/admin

```html
<div class="badge badge-circle badge-creator">C</div>
```

---

## 🎨 Modificadores de Color/Rol

### 1. Badge Usuario (`badge-user`)
Color gris para usuarios estándar.

```html
<span class="badge badge-md badge-user">Usuario</span>
```

### 2. Badge Creator (`badge-creator`)
Color púrpura para creadores de contenido.

```html
<span class="badge badge-md badge-creator">Creator</span>
```

### 3. Badge Admin (`badge-admin`)
Color rojo para administradores.

```html
<span class="badge badge-md badge-admin">Admin</span>
```

### 4. Badge Premium (`badge-premium`)
Degradado dorado con animación shimmer.

```html
<span class="badge badge-md badge-premium">Premium</span>
```

### 5. Badge Recomendado (`badge-recommended`)
Degradado dorado-naranja para destacar elementos.

```html
<div class="badge badge-sm badge-recommended">Recomendado</div>
```

---

## 🏷️ Badges Específicos

### Profile Badge
Badge para mostrar roles en páginas de perfil.

```html
<span class="badge badge-md profile-badge badge-premium">Premium</span>
```

### Plan Badge
Badge para destacar planes recomendados.

```html
<div class="badge badge-sm badge-recommended plan-badge">Recomendado</div>
```

### Premium Badge
Badge pequeño para headers de usuarios premium.

```html
<div class="badge badge-sm badge-premium premium-badge">✨ Premium</div>
```

### Creator/Admin Badge
Badges circulares para avatares.

```html
<div class="badge badge-circle creator-badge">C</div>
<div class="badge badge-circle admin-badge">A</div>
```

---

## 📱 Comportamiento Responsive

### Variables CSS Responsive
```css
--badge-padding-sm: clamp(4px, 0.8vw, 6px) clamp(8px, 1.5vw, 12px);
--badge-padding-md: clamp(6px, 1vw, 8px) clamp(12px, 2vw, 16px);
--badge-padding-lg: clamp(8px, 1.2vw, 12px) clamp(16px, 2.5vw, 20px);
--badge-radius-sm: clamp(8px, 1.5vw, 12px);
--badge-radius-md: clamp(12px, 2vw, 16px);
--badge-radius-lg: clamp(16px, 2.5vw, 20px);
```

### Breakpoints
- **Móvil (< 768px)**: Tamaños mínimos aplicados
- **Desktop (≥ 768px)**: Tamaños completos
- **Badges circulares**: Aumento de 16px → 18px en desktop

---

## 🚀 Guía de Implementación

### Importación
Asegúrate de importar `Badges.css` en tus componentes:

```css
/* En archivos CSS específicos */
@import '../components/Badges.css';
```

### Estructura de Clases
```html
<!-- Estructura básica -->
<div class="badge badge-{size} badge-{color} {optional-class}">
  Contenido
</div>

<!-- Ejemplos -->
<span class="badge badge-md badge-premium">Premium</span>
<div class="badge badge-sm badge-recommended plan-badge">Recomendado</div>
<div class="badge badge-circle badge-creator">C</div>
```

### Mejores Prácticas
1. **Siempre usa la clase base**: `badge` es requerida
2. **Elige un tamaño**: `badge-sm`, `badge-md`, o `badge-lg`
3. **Aplica color/rol**: Usa modificadores de color apropiados
4. **Responsive**: Las variables CSS manejan automáticamente el responsive
5. **Accesibilidad**: Los badges son decorativos, asegúrate de que la info esté disponible de otras formas

### Colores por Rol
- **Usuario**: Gris (#6b7280)
- **Creator**: Púrpura (#8b5cf6)
- **Admin**: Rojo (#ef4444)
- **Premium**: Degradado dorado (linear-gradient(135deg, #ffd700, #ffed4e))

---

## 🎯 Ejemplos Completos

### Perfil de Usuario
```tsx
<span className={`badge badge-md profile-badge ${getBadgeClass(profileData.role)}`}>
  {t(`profile.badges.${profileData.role}`)}
</span>
```

### Tarjeta de Plan
```tsx
<div className="plan-card premium">
  <div className="badge badge-sm badge-recommended plan-badge">
    {t('plans.badge.recommended')}
  </div>
  {/* ... contenido del plan ... */}
</div>
```

### Header Premium
```tsx
<div className="badge badge-sm badge-premium premium-badge">
  ✨ Premium
</div>
```

### Avatar con Badge
```tsx
<div className="profile-button">
  <img src={avatar} alt="Profile" />
  <div className="badge badge-circle badge-creator">C</div>
</div>
```</content>
<filePath>d:\GitHub\ESIMedia_FE\docs\Badges-Guide.md