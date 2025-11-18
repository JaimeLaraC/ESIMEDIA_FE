# 🃏 Guía del Sistema Unificado de Cards

## 🎯 Resumen

El sistema unificado de cards proporciona una base consistente y flexible para todos los tipos de tarjetas en la aplicación. Incluye clases base, modificadores de tamaño, estilos temáticos y elementos internos comunes.

## 🏗️ Arquitectura del Sistema

### Clases Base
- `.card` - Clase base para todas las tarjetas

### Modificadores de Tamaño
- `.card-sm` - Tarjeta pequeña
- `.card-md` - Tarjeta mediana (default)
- `.card-lg` - Tarjeta grande
- `.card-xl` - Tarjeta extra grande

### Modificadores de Estilo
- `.card-interactive` - Tarjeta clickeable con efectos hover
- `.card-premium` - Tarjeta destacada con gradiente premium
- `.card-danger` - Tarjeta para acciones destructivas
- `.card-media` - Tarjeta para contenido multimedia

### Variaciones Específicas
- `.card-plan` - Para tarjetas de planes de suscripción
- `.card-profile` - Para tarjetas de información de perfil
- `.card-content` - Para tarjetas de contenido multimedia

### Elementos Internos
- `.card-header` - Encabezado de la tarjeta
- `.card-title` - Título de la tarjeta
- `.card-body` - Cuerpo/contenido de la tarjeta
- `.card-actions` - Área de acciones/botones

## 📝 Ejemplos de Uso

### Tarjeta Básica
```tsx
<div className="card card-md">
  <div className="card-header">
    <h3 className="card-title">Título de la Tarjeta</h3>
  </div>
  <div className="card-body">
    Contenido de la tarjeta
  </div>
  <div className="card-actions">
    <button>Acción</button>
  </div>
</div>
```

### Tarjeta Interactiva (Clickeable)
```tsx
<div className="card card-lg card-interactive">
  <div className="card-body">
    <h3 className="card-title">Plan Premium</h3>
    <p>Contenido clickeable</p>
  </div>
</div>
```

### Tarjeta Premium
```tsx
<div className="card card-xl card-premium">
  <div className="card-body">
    <h3 className="card-title">Contenido Destacado</h3>
  </div>
</div>
```

### Tarjeta de Plan
```tsx
<div className="card card-lg card-interactive card-plan">
  <div className="card-header">
    <h3 className="card-title">Plan Básico</h3>
  </div>
  <div className="card-body">
    Características del plan
  </div>
</div>
```

### Tarjeta de Media
```tsx
<div className="card card-media">
  <img src="thumbnail.jpg" alt="Media" />
  <div className="card-body">
    <h4 className="card-title">Título del Contenido</h4>
    <div className="meta">★★★★☆ 4.5</div>
  </div>
</div>
```

## 🎨 Variables CSS Personalizables

### Dimensiones
- `--card-padding-sm/md/lg/xl` - Padding de diferentes tamaños
- `--card-radius-sm/md/lg` - Radio de borde para diferentes tamaños

### Sombras
- `--card-shadow-sm/md/lg/xl` - Sombras de diferentes intensidades

### Colores Temáticos
- `--card-bg-default/media/premium/danger` - Fondos temáticos
- `--card-border-default/media/premium/danger` - Bordes temáticos

### Efectos Hover
- `--card-hover-lift/lift-lg` - Elevación en hover
- `--card-hover-scale` - Escalado táctil
- `--card-hover-shadow/shadow-lg` - Sombras en hover

## 📱 Diseño Responsive

El sistema incluye breakpoints automáticos:
- **Desktop**: Tamaños completos
- **Tablet** (≤1024px): Reducción de padding en cards grandes
- **Mobile** (≤768px): Optimización para pantallas pequeñas, headers verticales

## 🔄 Migración desde el Sistema Anterior

### Profile Cards
```tsx
// Antes
<div className="profile-card">

// Después
<div className="card card-md">
```

### Plan Cards
```tsx
// Antes
<div className="plan-card">

// Después
<div className="card card-lg card-interactive card-plan">
```

### Media Cards
```tsx
// Antes
<div className="card">

// Después
<div className="card card-media">
```

## ✅ Beneficios del Sistema Unificado

1. **Consistencia Visual** - Todas las tarjetas siguen el mismo lenguaje visual
2. **Mantenibilidad** - Cambios en un solo archivo afectan todas las tarjetas
3. **Flexibilidad** - Combinación de modificadores para diferentes necesidades
4. **Responsive** - Diseño adaptativo automático
5. **Accesibilidad** - Efectos táctiles para dispositivos touch
6. **Performance** - Variables CSS optimizadas para el navegador

## 🚀 Próximos Pasos

Después de migrar todos los componentes, considera:
- Crear componentes React reutilizables (`Card`, `CardHeader`, etc.)
- Agregar más variaciones temáticas según necesidades
- Implementar animaciones de entrada/salida
- Añadir soporte para diferentes layouts (horizontal, compacto, etc.)