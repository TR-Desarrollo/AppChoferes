# Manual de Usuario – App Control Choferes (Remisero)

Bienvenido a la app **Control Choferes**. Esta guía te ayudará a aprovechar todas las funciones de la aplicación.

---

## Índice
1. [¿Qué es la app Control Choferes?](#que-es)
2. [Primeros pasos](#primeros-pasos)
3. [Iniciar sesión y registrarse](#login)
4. [Dashboard principal](#dashboard)
5. [Iniciar y finalizar turno](#turno)
6. [Agregar importes](#agregar-importes)
7. [Editar o eliminar importes](#editar-importes)
8. [Tipo de importe](#tipo-importe)
9. [Consultar viajes y turnos](#consultas)
10. [Ver detalle de turnos](#detalle-turnos)
11. [Generar PDFs](#pdfs)
12. [Backup y restaurar datos](#backup)
13. [Modo oscuro y accesibilidad](#oscuro)
14. [Navegación y menú](#navegacion)
15. [Cerrar sesión](#logout)
16. [Preguntas frecuentes](#faq)

---

<a name="que-es"></a>
## 1. ¿Qué es la app Control Choferes?
Es una aplicación para remiseros que permite llevar el control de los importes de cada viaje, agrupados por turnos personalizados (no por día calendario). Funciona en el móvil, incluso sin conexión, y puede instalarse como app. Incluye un dashboard moderno con estadísticas mensuales y herramientas avanzadas de consulta.

<a name="primeros-pasos"></a>
## 2. Primeros pasos
- Instala la app desde el navegador (busca la opción "Instalar app" o "Agregar a pantalla de inicio").
- Asegúrate de tener conexión a internet la primera vez para poder iniciar sesión o registrarte.
- La app se adapta automáticamente a tu dispositivo y orientación de pantalla.

<a name="login"></a>
## 3. Iniciar sesión y registrarse
- Al abrir la app, verás el formulario de **Iniciar sesión**.
- Si no tienes cuenta, haz clic en "¿No tienes cuenta? Regístrate" y completa tus datos.
- Espera la aprobación del administrador para poder ingresar.
- Una vez aprobado, inicia sesión con tu email y clave.

<a name="dashboard"></a>
## 4. Dashboard principal
Después de iniciar sesión, verás un **dashboard moderno** que incluye:

### **Estadísticas del Mes Actual:**
- **Total Facturado**: Suma de todos los importes del mes
- **Cantidad de Viajes**: Total de viajes realizados
- **Cantidad de Turnos**: Número de turnos completados
- **Promedio por Viaje**: Importe promedio por viaje

### **Botón Iniciar Turno:**
- Botón grande y prominente para comenzar un nuevo turno
- Solo visible cuando no hay un turno activo

### **Últimos Turnos:**
- Vista general de la actividad reciente
- Información condensada para toma rápida de decisiones

<a name="turno"></a>
## 5. Iniciar y finalizar turno
- Pulsa el botón **Iniciar Turno** desde el dashboard para comenzar a cargar importes.
- El turno permanece abierto hasta que pulses **Finalizar Turno**.
- Solo puedes cargar importes si hay un turno activo.
- La pantalla del turno activo muestra claramente el estado y los controles necesarios.

<a name="agregar-importes"></a>
## 6. Agregar importes
- Ingresa el importe del viaje en el campo correspondiente y pulsa **Agregar**.
- Cada importe se guarda con la hora y el tipo (por defecto: Efectivo).
- El total y la cantidad de importes se actualizan automáticamente.
- Los importes se muestran en una lista con scroll independiente.

<a name="editar-importes"></a>
## 7. Editar o eliminar importes
- **Toca cualquier importe** en la lista para editarlo.
- Puedes cambiar el valor y el tipo (Efectivo, Transferencia, Vale).
- Si dejas el campo vacío y guardas, el importe se elimina.
- Botones de confirmación (✔ Guardar) y cancelación (✖ Cancelar) para mayor seguridad.

<a name="tipo-importe"></a>
## 8. Tipo de importe
- Cada importe puede ser de tipo **Efectivo**, **Transferencia** o **Vale**.
- Puedes cambiar el tipo al editar el importe.
- Los tipos se muestran claramente en las consultas y reportes.

<a name="consultas"></a>
## 9. Consultar viajes y turnos
Abre el menú lateral (icono ☰) para acceder a las consultas:

### **Ver Turnos:**
- Muestra todos los turnos históricos en una tabla moderna
- Columnas: Fecha, Horario, Viajes, Total
- Encabezados fijos (sticky) para mejor navegación
- Diseño responsive con colores alternados

### **Consulta por Día:**
- Selecciona una fecha específica para ver los viajes
- Filtrado preciso por fecha (sin problemas de zona horaria)

### **Consulta por Rango:**
- Define un período desde/hasta para consultas más amplias
- Útil para reportes mensuales o semanales

### **Resultados de Consulta:**
- **Tarjetas de estadísticas**: Total Viajes, Turnos, Total Facturado, Promedio por Viaje
- **Tabla detallada**: Lista completa de viajes con encabezados fijos
- **Resumen final**: Consolidado de la consulta
- **Descarga en PDF**: Genera reportes con nombre "Historial" + fecha

<a name="detalle-turnos"></a>
## 10. Ver detalle de turnos
- **Desde "Ver Turnos"**: Haz clic en cualquier turno para ver su detalle completo
- **Información del turno**: Fecha, horario, cantidad de viajes, total facturado
- **Lista de viajes**: Tabla con hora, importe y tipo de cada viaje
- **Encabezados fijos**: Los nombres de las columnas permanecen visibles al hacer scroll
- **Botones de acción**: Volver a turnos, Descargar PDF del turno específico

<a name="pdfs"></a>
## 11. Generar PDFs

### **PDF de Consulta General:**
- Disponible en todas las consultas de viajes
- Nombre automático: "Historial" + fecha de descarga
- Incluye estadísticas y tabla completa de viajes
- Cálculos precisos de totales

### **PDF de Turno Específico:**
- Desde el detalle de cualquier turno
- Nombre: "Turno_DD-MM-AAAA_HH-MM.pdf"
- Incluye información del turno y lista de viajes
- Formato profesional y legible

<a name="backup"></a>
## 12. Backup y restaurar datos

### **Descargar Backup:**
- Guarda todos tus datos en un archivo JSON
- Nombre descriptivo: "Backup_Turnos_DD-MM-AAAA_HH-MM.json"
- Incluye metadatos: usuario, fecha, versión, total de turnos
- Útil para cambiar de dispositivo o respaldo de seguridad

### **Restaurar Backup:**
- Carga datos desde un archivo de backup
- Compatible con formatos antiguos y nuevos
- Validación automática de datos
- Confirmación antes de sobrescribir datos existentes

<a name="oscuro"></a>
## 13. Modo oscuro y accesibilidad
- **Toggle de modo oscuro** en el header principal (🌙/☀️)
- **Transición instantánea** entre modos (sin retrasos)
- **Colores optimizados** para ambos temas:
  - Modo claro: Fondos blancos, texto oscuro
  - Modo oscuro: Fondos oscuros, texto claro, gradientes azules
- **Encabezados de tabla fijos** en ambos modos
- **Responsive design** que se adapta a todos los dispositivos

<a name="navegacion"></a>
## 14. Navegación y menú

### **Header Fijo:**
- Logo y título "Control Choferes" siempre visibles
- Toggle de modo oscuro
- Botón de menú (☰)

### **Sidebar del Menú:**
- **Ver Turnos**: Acceso directo al historial
- **Consultas por día/rango**: Filtros avanzados
- **Backup/Restore**: Gestión de datos
- **Cerrar sesión**: Salida segura

### **Navegación Inteligente:**
- **Botón "Volver" inteligente**: 
  - Si hay turno activo → Vuelve al turno
  - Si no hay turno → Vuelve al dashboard
- **Menú se cierra automáticamente** al navegar
- **Footer se oculta** en pantallas donde no es necesario

<a name="logout"></a>
## 15. Cerrar sesión
- Pulsa **Cerrar sesión** en el menú lateral.
- **No podrás cerrar sesión** si tienes un turno activo (debes finalizarlo primero).
- La app vuelve automáticamente a la pantalla de login.

<a name="faq"></a>
## 16. Preguntas frecuentes

**¿Puedo usar la app sin internet?**
Sí, la app funciona offline. Solo necesitas internet para iniciar sesión, registrarte o restaurar backup.

**¿Mis datos están seguros?**
Tus datos se guardan en tu dispositivo. Puedes hacer backup y restaurar cuando lo necesites.

**¿Qué pasa si cambio de teléfono?**
Haz un backup en tu dispositivo viejo y restaura en el nuevo. Todos tus datos se transferirán.

**¿Puedo ver los datos de otros usuarios?**
No, cada usuario solo ve sus propios turnos e importes.

**¿Por qué no veo las estadísticas del mes?**
Las estadísticas se calculan automáticamente para el mes actual. Si restauraste un backup, verás las estadísticas del mes en que se generó.

**¿Cómo funcionan los encabezados fijos en las tablas?**
Los nombres de las columnas permanecen visibles al hacer scroll, facilitando la identificación de datos.

**¿Puedo generar PDFs de turnos específicos?**
Sí, desde el detalle de cualquier turno puedes descargar un PDF con toda la información de ese turno.

**¿El modo oscuro afecta el rendimiento?**
No, el cambio entre modos es instantáneo y no afecta el funcionamiento de la app.

---

## **Características Técnicas**

- **PWA (Progressive Web App)**: Instalable como app nativa
- **Offline First**: Funciona sin conexión
- **Responsive Design**: Se adapta a todos los dispositivos
- **Local Storage**: Datos guardados localmente
- **PDF Generation**: Reportes profesionales con jsPDF
- **Backup System**: Sistema robusto de respaldo y restauración
- **Dark/Light Mode**: Temas personalizables
- **Touch Optimized**: Optimizada para dispositivos táctiles

---

*Desarrollada por Federico Rizzo - Versión 2.0*

