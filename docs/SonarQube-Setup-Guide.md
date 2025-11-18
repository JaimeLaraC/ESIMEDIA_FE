#  Guía: Configurar SonarQube Scanner en Windows

##  Problema Inicial
El comando `sonar-scanner` no era reconocido por PowerShell:
```
sonar-scanner : El término '\''sonar-scanner'\'' no se reconoce como nombre de un cmdlet, función, archivo de script o programa ejecutable.
```

##  Pasos de Diagnóstico

### 1. Verificar si está en PATH
```powershell
where.exe sonar-scanner
```
**Resultado:** `INFO: no se pudo encontrar ningún archivo para los patrones dados.`

### 2. Buscar instalación de SonarQube Scanner
```powershell
Get-ChildItem -Path "C:\Program Files" -Recurse -Directory | Where-Object { $_.Name -like "*sonar*" }
```
**Resultado:** Encontrado en `C:\Program Files\sonar-scanner-7.2.0.5079-windows-x64`

### 3. Verificar archivos ejecutables
```powershell
Get-ChildItem -Path "C:\Program Files\sonar-scanner-7.2.0.5079-windows-x64\bin"
```
**Resultado:**
- `sonar-scanner.bat`
- `sonar-scanner-debug.bat`

##  Solución Implementada

### 4. Agregar al PATH del sistema
```powershell
setx PATH "%PATH%;C:\Program Files\sonar-scanner-7.2.0.5079-windows-x64\bin"
```
**Resultado:** `CORRECTO: se guardó el valor especificado.`

### 5. Recargar PATH en la sesión actual (opcional)
Si quieres usar `sonar-scanner` inmediatamente sin reiniciar la terminal:
```powershell
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
```

Para verificar si ya está disponible:
```powershell
try { sonar-scanner -v } catch { Write-Host "Aún no está en PATH. Reinicia la terminal." }
```

### 6. Verificar funcionamiento con ruta completa
```powershell
& "C:\Program Files\sonar-scanner-7.2.0.5079-windows-x64\bin\sonar-scanner.bat" -v
```
**Resultado exitoso:**
```
22:08:09.669 INFO  Scanner configuration file: C:\Program Files\sonar-scanner-7.2.0.5079-windows-x64\bin\..\conf\sonar-scanner.properties
22:08:09.674 INFO  Project root configuration file: C:\Users\erome\Documents\GitHub\ESIMedia_FE\sonar-project.properties
22:08:09.686 INFO  SonarScanner CLI 7.2.0.5079
22:08:09.689 INFO  Windows 11 10.0 amd64
```

### 7. Verificar funcionamiento directo
```powershell
sonar-scanner -v
```
**Resultado exitoso:** Misma salida que el paso anterior.

##  Comandos Disponibles Ahora

```powershell
# Ver versión
sonar-scanner -v

# Ejecutar análisis completo
sonar-scanner

# Análisis con opciones específicas
sonar-scanner -Dsonar.host.url=http://tu-servidor:puerto
```

##  Notas Importantes

- **Ubicación de instalación:** `C:\Program Files\sonar-scanner-7.2.0.5079-windows-x64`
- **Directorio bin:** `C:\Program Files\sonar-scanner-7.2.0.5079-windows-x64\bin`
- **Archivo de configuración detectado:** `sonar-project.properties` en la raíz del proyecto
- **Servidor configurado:** `http://seralu4.esi.uclm.es:1521/`
- **Recarga de PATH:** No es necesario reiniciar la terminal, puedes recargar el PATH en la sesión actual

##  Configurar Execution Policy para Usuario Actual

Si `sonar-scanner` sigue sin estar disponible en nuevas sesiones, configura la execution policy específicamente para el usuario actual:

### Verificar Execution Policy Actual
```powershell
Get-ExecutionPolicy -Scope CurrentUser
```

### Configurar Execution Policy para Usuario Actual
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Resultado esperado:**
```
Execution Policy Change
The execution policy helps protect you from scripts that you do not trust. Changing the execution policy might expose
you to the security risks described in the about_Execution_Policies help topic at
https://go.microsoft.com/fwlink/?LinkID=135170. Do you want to change the execution policy?
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"):
```

Responde `Y` para confirmar el cambio.

### Verificar que se Aplicó Correctamente
```powershell
Get-ExecutionPolicy -Scope CurrentUser
```
**Resultado esperado:** `RemoteSigned`

##  Próximos Pasos

1. **Recargar PATH** (opcional): `$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")`
2. **Reiniciar terminal** si es necesario en nuevas sesiones
3. **Ejecutar análisis:** `sonar-scanner`
4. **Ver resultados** en el servidor SonarQube configurado

---

*Fecha de creación: Octubre 2025*
*Proyecto: ESIMedia_FE*
*Versión de SonarQube Scanner: 7.2.0.5079*
