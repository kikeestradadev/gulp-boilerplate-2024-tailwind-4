# Style guide

This is a Gulp Boilerplate developed by me tu create project fron scratch and in this case i have a style guide with many UI components created by me

for this i use:

- `HTML (pug)`
- `CSS (sass)`
- `JS (ES6)`
- `CSS (tailwind 3)`

Instructions:

- `gulp dev` for develop environment
- `gulp build` before deployment
- `npm run deploy` to publish the site in gh pages

## gh-pages link: https://kikeestrada.github.io/gulp-boilerplate-2024-tailwind/

# Optimizaciones para Proyectos Grandes

## 🚀 Mejoras Implementadas

### 1. **Debouncing Inteligente**
- **Problema**: Múltiples cambios rápidos causaban builds innecesarios
- **Solución**: Debouncing de 300ms para Pug/Sass y 500ms para datos
- **Beneficio**: Reduce la carga del sistema y mejora la respuesta

### 2. **Sistema de Cache Avanzado**
- **Cache de JSON**: Los datos JSON se cachean por 5 segundos
- **Cache de archivos**: Solo procesa archivos modificados
- **Beneficio**: Builds más rápidos en proyectos grandes

### 3. **Watch Optimizado**
- **Eventos específicos**: Solo escucha `add`, `change`, `unlink`
- **Ignorar archivos**: Excluye `node_modules`, `.git`, `public`
- **Streaming directo**: BrowserSync se actualiza sin reload completo

### 4. **Manejo de Errores Robusto**
- **Plumber mejorado**: Errores específicos por tipo de archivo
- **Recuperación automática**: El proceso continúa después de errores
- **Logging detallado**: Mensajes claros para debugging

### 5. **Optimizaciones de Browserify**
- **Cache habilitado**: Reutiliza builds previos
- **Source maps**: Mejor debugging en desarrollo
- **Babel optimizado**: Configuración específica para rendimiento

## 📊 Configuración de Rendimiento

### BrowserSync Optimizado
```javascript
{
  reloadDelay: 100,        // Delay antes del reload
  reloadDebounce: 250,     // Debounce para múltiples cambios
  reloadThrottle: 0,       // Sin throttling
  watchOptions: {
    ignored: ['node_modules', '.git', 'public']
  }
}
```

### Debouncing por Tipo
- **Pug/Sass**: 300ms
- **Scripts**: 300ms  
- **Datos**: 500ms (más tiempo por complejidad)

## 🔧 Comandos Útiles

### Desarrollo
```bash
npm run dev          # Desarrollo con watch optimizado
npm run build        # Build de producción
npm run monitor      # Monitorear rendimiento
```

### Limpieza
```bash
npm run clean        # Limpiar cache y archivos
npm run clear-cache  # Solo limpiar cache
```

## 📈 Monitoreo de Rendimiento

### Script de Monitoreo
```bash
node scripts/monitor.js
```

**Características:**
- ⏱️ Medición de tiempo de build
- 📁 Conteo de archivos procesados
- ⚠️ Detección de archivos grandes
- ❌ Reporte de errores
- 🔍 Verificación de estructura

### Métricas Importantes
- **Tiempo de build**: < 2 segundos para cambios pequeños
- **Tiempo de watch**: < 500ms para detección
- **Uso de memoria**: Monitoreado automáticamente
- **Archivos grandes**: Alertas para archivos > 1MB

## 🛠️ Solución de Problemas

### Watch No Funciona
1. Verificar que no hay procesos gulp corriendo
2. Ejecutar `npm run clear-cache`
3. Reiniciar el servidor de desarrollo

### Builds Lentos
1. Verificar archivos grandes con `npm run monitor`
2. Optimizar imágenes y assets
3. Revisar dependencias innecesarias

### Errores de Memoria
1. Aumentar límite de Node.js: `node --max-old-space-size=4096`
2. Limpiar cache: `npm run clear-cache`
3. Reiniciar el proceso

## 🎯 Mejores Prácticas

### Para Proyectos Grandes
1. **Estructura modular**: Dividir en componentes pequeños
2. **Assets optimizados**: Comprimir imágenes y archivos
3. **Dependencias mínimas**: Solo lo necesario
4. **Cache inteligente**: Usar las herramientas de cache

### Para Desarrollo Rápido
1. **Cambios incrementales**: Modificar archivos específicos
2. **Watch selectivo**: Solo archivos relevantes
3. **Debugging eficiente**: Source maps habilitados
4. **Feedback inmediato**: BrowserSync optimizado

## 🔄 Actualizaciones Automáticas

### Archivos que Trigger Rebuild
- **Pug**: Cualquier archivo `.pug` en `src/pug/`
- **Sass**: Cualquier archivo `.scss` en `src/scss/`
- **JS**: Cualquier archivo `.js` en `src/js/`
- **Datos**: Archivos `.json` y `.md` en `src/data/` y `src/md/`
- **Assets**: Cualquier archivo en `src/assets/`

### Comportamiento del Watch
- **Cambios únicos**: Rebuild inmediato
- **Cambios múltiples**: Debouncing automático
- **Errores**: Continuación automática
- **Recuperación**: Reinicio automático del watch

## 📝 Notas de Desarrollo

### Configuración Personalizable
- Editar `gulp.config.js` para ajustar tiempos
- Modificar `scripts/monitor.js` para métricas específicas
- Ajustar debouncing según necesidades del proyecto

### Compatibilidad
- **Node.js**: 16+ recomendado
- **Gulp**: 4.x
- **BrowserSync**: 2.x
- **Sass**: Dart Sass

### Rendimiento Esperado
- **Proyecto pequeño** (< 100 archivos): < 1s build
- **Proyecto mediano** (100-500 archivos): < 2s build  
- **Proyecto grande** (500+ archivos): < 5s build
- **Watch response**: < 500ms para cualquier cambio 
