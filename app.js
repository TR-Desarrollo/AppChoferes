// --- AUTENTICACIÓN ---
const API_URL = 'https://sheetdb.io/api/v1/09cpeqv911tr5'; // Reemplaza por tu URL real de SheetDB

function mostrarAuth(showLogin = true) {
  const auth = document.getElementById('auth-container');
  const loginForm = document.getElementById('login-form');
  const registroForm = document.getElementById('registro-form');
  const authTitle = document.getElementById('auth-title');
  const toggleBtn = document.getElementById('toggle-auth');
  const msg = document.getElementById('auth-msg');
  
  if (auth) auth.style.display = 'flex';
  if (loginForm) loginForm.style.display = showLogin ? 'block' : 'none';
  if (registroForm) registroForm.style.display = showLogin ? 'none' : 'block';
  if (authTitle) authTitle.textContent = showLogin ? 'Iniciar sesión' : 'Registrarse';
  if (toggleBtn) toggleBtn.textContent = showLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión';
  if (msg) msg.textContent = '';
  
  // Forzar modo claro en login/registro
  document.body.classList.remove('dark-mode');
  const switchDark = document.getElementById('switch-dark');
  const labelDark = document.getElementById('icon-dark-label');
  if (switchDark) switchDark.checked = false;
  if (labelDark) labelDark.textContent = '🌙';
  
  // Ocultar todos los elementos de la aplicación
  const mainApp = document.getElementById('main-app');
  const mainHeaderFixed = document.getElementById('main-header-fixed');
  const mainScrollContainer = document.getElementById('main-scroll-container');
  const drawer = document.getElementById('drawer-sidebar');
  const overlay = document.getElementById('drawer-overlay');
  
  if (mainApp) mainApp.style.display = 'none';
  if (mainHeaderFixed) mainHeaderFixed.style.display = 'none';
  if (mainScrollContainer) mainScrollContainer.style.display = 'none';
  if (drawer) {
    drawer.classList.remove('drawer-visible');
    drawer.classList.add('drawer-oculto');
    drawer.style.display = 'none';
  }
  if (overlay) {
    overlay.classList.remove('drawer-overlay-visible');
    overlay.classList.add('drawer-overlay-oculto');
    overlay.style.display = 'none';
  }
  
  // Mostrar footer
  const footer = document.getElementById('footer-app');
  if (footer) footer.style.display = '';
}
function ocultarAuth() {
  const auth = document.getElementById('auth-container');
  if (auth) auth.style.display = 'none';
}
function guardarSesion(email, nombre) {
  localStorage.setItem('usuario', JSON.stringify({ email, nombre }));
}
function limpiarSesion() {
  localStorage.removeItem('usuario');
}
function usuarioLogueado() {
  return !!localStorage.getItem('usuario');
}
function cerrarSesion() {
  limpiarSesion();
  ocultarApp();
  mostrarAuth(true);
}
function mostrarApp() {
  const mainApp = document.getElementById('main-app');
  const drawer = document.getElementById('drawer-sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('drawer-overlay');
  const footer = document.getElementById('footer-app');
  const mainHeaderFixed = document.getElementById('main-header-fixed');
  const mainScrollContainer = document.getElementById('main-scroll-container');
  
  if (mainApp) mainApp.style.display = '';
  if (drawer) {
    drawer.style.display = '';
    drawer.classList.remove('drawer-visible');
    drawer.classList.add('drawer-oculto');
  }
  if (menuToggle) menuToggle.style.display = '';
  if (overlay) {
    overlay.classList.remove('drawer-overlay-visible');
    overlay.classList.add('drawer-overlay-oculto');
    overlay.style.display = 'none';
  }
  if (footer) footer.style.display = 'none';
  if (mainHeaderFixed) mainHeaderFixed.style.display = 'flex';
  if (mainScrollContainer) mainScrollContainer.style.display = 'block';
  
  // Restaurar modo dark si estaba activado
  const dark = localStorage.getItem('modo-dark') === '1';
  document.body.classList.toggle('dark-mode', dark);
  const switchDark = document.getElementById('switch-dark');
  const labelDark = document.getElementById('icon-dark-label');
  if (switchDark) switchDark.checked = dark;
  if (labelDark) labelDark.textContent = dark ? '☀️' : '🌙';
  
  // Si no hay turno activo, mostrar pantalla de últimos turnos
  if (!getTurnoActivo()) {
    mostrarPantallaUltimosTurnos();
  } else {
    // Si hay turno activo, render normal
    render();
  }
  
  // Agregar event listeners de backup después del login
  setTimeout(() => {
    const btnBackup = document.getElementById('btn-backup');
    if (btnBackup) {
      btnBackup.addEventListener('click', descargarBackup);
    }
    
    const inputRestore = document.getElementById('input-restore');
    if (inputRestore) {
      inputRestore.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
          restaurarBackup(e.target.files[0]);
          e.target.value = '';
        }
      });
    }
  }, 100);
}
function ocultarApp() {
  const mainApp = document.getElementById('main-app');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('drawer-sidebar');
  const overlay = document.getElementById('drawer-overlay');
  const footer = document.getElementById('footer-app');
  const mainHeaderFixed = document.getElementById('main-header-fixed');
  const mainScrollContainer = document.getElementById('main-scroll-container');
  
  if (mainApp) mainApp.style.display = 'none';
  if (sidebar) sidebar.style.display = 'none';
  if (menuToggle) menuToggle.style.display = 'none';
  if (drawer) {
    drawer.style.display = 'none';
    drawer.classList.remove('drawer-visible');
    drawer.classList.add('drawer-oculto');
  }
  if (overlay) {
    overlay.style.display = 'none';
    overlay.classList.remove('drawer-overlay-visible');
    overlay.classList.add('drawer-overlay-oculto');
  }
  if (footer) footer.style.display = 'none';
  if (mainHeaderFixed) mainHeaderFixed.style.display = 'none';
  if (mainScrollContainer) mainScrollContainer.style.display = 'none';
}
// --- Eventos de login/registro ---
window.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const btnLogout = document.getElementById('btn-logout');
  // Mostrar login si no hay usuario
  if (!usuarioLogueado()) {
    ocultarApp();
    mostrarAuth(true);
  } else {
    mostrarApp();
    ocultarAuth();
  }
  // Alternar login/registro
  const toggleBtn = document.getElementById('toggle-auth');
  let loginVisible = true;
  if (toggleBtn) {
    toggleBtn.onclick = function(e) {
      e.preventDefault();
      loginVisible = !loginVisible;
      mostrarAuth(loginVisible);
    };
  }
  // Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const clave = document.getElementById('login-clave').value.trim();
      const msg = document.getElementById('auth-msg');
      fetch(`${API_URL}/search?email=${encodeURIComponent(email)}&clave=${encodeURIComponent(clave)}`)
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data) || data.length === 0) {
            if (msg) msg.textContent = 'Usuario o clave incorrectos.';
          } else if (data[0].activo !== 'SI') {
            if (msg) msg.textContent = 'Acceso no habilitado. Contacta al administrador.';
          } else {
            guardarSesion(email, data[0].nombre || '');
            ocultarAuth();
            mostrarApp();
            location.reload(); // Fuerza recarga para limpiar estado y mostrar solo los datos del usuario logueado
          }
        })
        .catch(() => { if (msg) msg.textContent = 'Error de conexión.'; });
    };
  }
  // Registro
  const registroForm = document.getElementById('registro-form');
  if (registroForm) {
    registroForm.onsubmit = function(e) {
      e.preventDefault();
      const nombre = document.getElementById('registro-nombre').value.trim();
      const email = document.getElementById('registro-email').value.trim();
      const clave = document.getElementById('registro-clave').value.trim();
      const msg = document.getElementById('auth-msg');
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [{ email, clave, nombre, activo: 'NO' }] })
      })
      .then(res => res.json())
      .then(data => {
        if (data.created) {
          if (msg) msg.style.color = '#43a047';
          if (msg) msg.textContent = 'Registrado correctamente. Espera aprobación.';
        } else {
          if (msg) msg.style.color = '#c62828';
          if (msg) msg.textContent = 'No se pudo registrar. ¿Ya existe ese email?';
        }
      })
      .catch(() => { if (msg) msg.textContent = 'Error de conexión.'; });
    };
  }
  // Botón cerrar sesión en el sidebar
  if (btnLogout) {
    btnLogout.onclick = function() {
      if (getTurnoActivo()) {
        alert('Debes finalizar el turno antes de cerrar sesión.');
        return;
      }
      limpiarSesion();
      ocultarApp();
      mostrarAuth(true);
    };
  }
  
  // Botón manual de usuario en el sidebar
  const btnManual = document.getElementById('btn-manual');
  if (btnManual) {
    btnManual.onclick = function() {
      mostrarManualUsuario();
    };
  }
  // Botón cerrar sesión (puedes agregarlo donde quieras)
  const mainHeader = document.getElementById('main-header-fijo');
  if (mainHeader) {
    let btnLogout = document.getElementById('btn-logout');
    if (!btnLogout) {
      btnLogout = document.createElement('button');
      btnLogout.id = 'btn-logout';
      btnLogout.textContent = 'Cerrar sesión';
      btnLogout.style = 'position:absolute;top:1.2rem;right:1.2rem;background:#ff5252;color:#fff;border:none;border-radius:6px;padding:0.5rem 1.1rem;font-size:1rem;cursor:pointer;z-index:200;';
      btnLogout.onclick = cerrarSesion;
      mainHeader.appendChild(btnLogout);
    }
  }
});


// Utilidades para fechas
function getTodayKey() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getImportesByKey(key) {
  const data = localStorage.getItem('importes_' + key);
  return data ? JSON.parse(data) : [];
}

function getImportes() {
  return getImportesByKey(getTodayKey());
}

function saveImportes(importes) {
  const key = getTodayKey();
  localStorage.setItem('importes_' + key, JSON.stringify(importes));
}

// --- Turnos personalizados ---
function getUsuarioEmail() {
  const usuario = localStorage.getItem('usuario');
  if (!usuario) return null;
  try {
    return JSON.parse(usuario).email;
  } catch {
    return null;
  }
}
function getTurnosKey() {
  const email = getUsuarioEmail();
  return email ? `turnos_${email}` : 'turnos';
}
function getTurnos() {
  const data = localStorage.getItem(getTurnosKey());
  return data ? JSON.parse(data) : [];
}
function saveTurnos(turnos) {
  localStorage.setItem(getTurnosKey(), JSON.stringify(turnos));
}

function getTurnoActivo() {
  const turnos = getTurnos();
  return turnos.find(t => !t.fin);
}

function iniciarTurno() {
  const turnos = getTurnos();
  const ahora = new Date();
  turnos.push({
    inicio: ahora.toISOString(),
    fin: null,
    importes: []
  });
  saveTurnos(turnos);
  // Ocultar pantalla de últimos turnos y footer
  const consultaDiv = document.getElementById('consulta-principal');
  const footer = document.getElementById('footer-app');
  if (consultaDiv) consultaDiv.style.display = 'none';
  if (footer) footer.style.display = 'none';
  // Mostrar pantalla principal
  const mainHeader = document.getElementById('main-header-fijo');
  if (mainHeader) mainHeader.style.display = '';
  render();
}

function finalizarTurno() {
  const turnos = getTurnos();
  const idx = turnos.findIndex(t => !t.fin);
  if (idx !== -1) {
    turnos[idx].fin = new Date().toISOString();
    saveTurnos(turnos);
  }
  render();
  mostrarPantallaUltimosTurnos();
}

function agregarImporteATurno(valor, tipo = 'Efectivo') {
  const turnos = getTurnos();
  const idx = turnos.findIndex(t => !t.fin);
  if (idx !== -1) {
    const ahora = new Date();
    // Hora en formato 24hs, HH:mm:ss
    const hora24 = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    turnos[idx].importes.push({ valor, hora: hora24, tipo });
    saveTurnos(turnos);
  }
}

function renderEstadoTurno() {
  const estadoDiv = document.getElementById('estado-turno');
  const turno = getTurnoActivo();
  if (turno) {
    const inicio = new Date(turno.inicio);
    estadoDiv.innerHTML = `<b>Turno en curso:</b> ${inicio.toLocaleString('es-AR', { hour12: false })}`;
  } else {
    estadoDiv.innerHTML = '<b>No hay turno iniciado.</b>';
  }
}

function render() {
  renderEstadoTurno();
  const turno = getTurnoActivo();
  const form = document.getElementById('importe-form');
  const resumen = document.getElementById('resumen');
  const lista = document.getElementById('lista-importes');
  const btnFinalizar = document.getElementById('finalizar-dia');
  const tablaTurnos = document.getElementById('tabla-turnos-recientes-container');
  const headerFijo = document.getElementById('main-header-fijo');
  const btnIniciar = document.getElementById('iniciar-turno');

  if (turno) {
    if (form) form.style.display = '';
    if (resumen) resumen.style.display = '';
    if (lista) lista.style.display = '';
    if (btnFinalizar) btnFinalizar.style.display = 'block';
    if (tablaTurnos) tablaTurnos.innerHTML = '';
    if (btnIniciar) btnIniciar.style.display = 'none';
    // Render importes
    if (lista) lista.innerHTML = '';
    let total = 0;
    let importes = turno.importes;
    importes.slice().reverse().forEach((imp, idx) => {
      total += (typeof imp === 'object' ? imp.valor : imp);
      const li = document.createElement('li');
      if (typeof imp === 'object') {
        let clase = '';
        if ((imp.tipo || '').toLowerCase() === 'vale') clase = 'importe-vale';
        if ((imp.tipo || '').toLowerCase() === 'transferencia') clase = 'importe-transferencia';
        li.className = clase;
        li.innerHTML = `<span class='hora-importe'>${imp.hora}</span><span class='valor-importe'>$${imp.valor.toFixed(2)}</span><span class='tipo-importe'>${imp.tipo || 'Efectivo'}</span>`;
      } else {
        li.textContent = `$${imp.toFixed(2)}`;
      }
      // Hacer editable al tocar
      li.style.cursor = 'pointer';
      li.title = 'Tocar para editar';
      li.addEventListener('click', function() {
        editarImporteInline(importes.length - 1 - idx, imp);
      });
      lista.appendChild(li);
    });
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('cantidad').textContent = importes.length;
    document.getElementById('importe-input').disabled = false;
    document.querySelector('form button[type="submit"]').disabled = false;
  } else {
    if (form) form.style.display = 'none';
    if (resumen) resumen.style.display = 'none';
    if (lista) lista.style.display = 'none';
    if (btnFinalizar) btnFinalizar.style.display = 'none';
    if (btnIniciar) btnIniciar.style.display = 'block';
    // Mover la tabla justo debajo del botón Iniciar Turno
    if (headerFijo && tablaTurnos) headerFijo.appendChild(tablaTurnos);
    renderTablaTurnosRecientes();
  }
  // Si hay turno activo, la tabla vuelve a su lugar original
  if (turno && tablaTurnos) {
    document.querySelector('main').appendChild(tablaTurnos);
  }
}

// Función para editar importe inline
function editarImporteInline(idx, imp) {
  const lista = document.getElementById('lista-importes');
  const li = lista.children[lista.children.length - 1 - idx];
  if (!li) return;
  li.classList.add('editando');
  const valorOriginal = typeof imp === 'object' ? imp.valor : imp;
  const tipoOriginal = (typeof imp === 'object' && imp.tipo) ? imp.tipo : 'Efectivo';
  li.innerHTML = `<input type='number' id='edit-importe' value='${valorOriginal}' style='width:100%;height:2.5rem;font-size:1.08rem;text-align:right;margin-bottom:0.3rem;'>
    <select id='edit-tipo' style='width:100%;height:2.5rem;font-size:1.08rem;margin-bottom:0.3rem;'>
      <option value='Efectivo' ${tipoOriginal==='Efectivo'?'selected':''}>Efectivo</option>
      <option value='Transferencia' ${tipoOriginal==='Transferencia'?'selected':''}>Transferencia</option>
      <option value='Vale' ${tipoOriginal==='Vale'?'selected':''}>Vale</option>
    </select>
    <div class='edit-buttons'>
      <button id='guardar-edit' style='background:#43a047;color:#fff;border:none;border-radius:6px;padding:0.6rem 0.2rem;font-size:1.05rem;'>✔ Guardar</button>
      <button id='cancelar-edit' style='background:#ff5252;color:#fff;border:none;border-radius:6px;padding:0.6rem 0.2rem;font-size:1.05rem;'>✖ Cancelar</button>
    </div>`;
  const input = li.querySelector('#edit-importe');
  const select = li.querySelector('#edit-tipo');
  input.addEventListener('click', function(e) { e.stopPropagation(); });
  select.addEventListener('click', function(e) { e.stopPropagation(); });
  select.addEventListener('touchstart', function(e) { e.stopPropagation(); });
  input.focus();
  input.select();
  li.querySelector('#guardar-edit').onclick = function(e) {
    e.stopPropagation();
    const nuevoValor = parseFloat(input.value);
    const nuevoTipo = select.value;
    const turnos = getTurnos();
    const turno = getTurnoActivo();
    const idxTurno = turnos.findIndex(t => t.inicio === turno.inicio);
    if (idxTurno !== -1) {
      if (input.value === '' || isNaN(nuevoValor)) {
        // Eliminar el importe
        turnos[idxTurno].importes.splice(idx, 1);
      } else {
        if (typeof turnos[idxTurno].importes[idx] === 'object') {
          turnos[idxTurno].importes[idx].valor = nuevoValor;
          turnos[idxTurno].importes[idx].tipo = nuevoTipo;
        } else {
          turnos[idxTurno].importes[idx] = { valor: nuevoValor, hora: imp.hora || '', tipo: nuevoTipo };
        }
      }
      saveTurnos(turnos);
      render();
    }
  };
  li.querySelector('#cancelar-edit').onclick = function(e) {
    e.stopPropagation();
    render();
  };
}

function renderTablaTurnosRecientes() {
  const tablaTurnos = document.getElementById('tabla-turnos-recientes-container');
  let turnos = getTurnos().filter(t => t.fin);
  if (turnos.length === 0) {
    tablaTurnos.innerHTML = '';
    return;
  }
  // Mostrar solo los dos turnos más recientes
  turnos = turnos.slice(-2);
  let html = `<div style='max-height:336px;overflow-y:auto;box-sizing:border-box;'>
    <table style="width:100%;border-collapse:collapse;text-align:center;">
      <thead>
        <tr style="background:#f0f8ff;">
          <th style="padding:6px;border:1px solid #ccc;">Inicio</th>
          <th style="padding:6px;border:1px solid #ccc;">Fin</th>
          <th style="padding:6px;border:1px solid #ccc;">Viajes</th>
          <th style="padding:6px;border:1px solid #ccc;">Total</th>
        </tr>
      </thead>
      <tbody>`;
  turnos.reverse().forEach((t) => {
    const inicioDate = new Date(t.inicio);
    const finDate = t.fin ? new Date(t.fin) : null;
    const cantidad = t.importes.length;
    const total = t.importes.reduce((a, b) => a + (typeof b === 'object' ? b.valor : b), 0);
    html += `<tr>
      <td data-label="Inicio">${inicioDate.toLocaleString('es-AR', { hour12: false })}</td>
      <td data-label="Fin">${finDate ? finDate.toLocaleString('es-AR', { hour12: false }) : '-'}</td>
      <td data-label="Viajes">${cantidad}</td>
      <td data-label="Total" class="importe-turno">$${formatearImporte(total)}</td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  tablaTurnos.innerHTML = html;
}

document.getElementById('importe-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('importe-input');
  const valor = parseFloat(input.value);
  if (!isNaN(valor) && valor > 0) {
    agregarImporteATurno(valor);
    input.value = '';
    render();
  }
  // Prevenir que Enter dispare otro submit o acción
  return false;
});

// Botón iniciar turno (solo uno, insertado en el header fijo)
let btnIniciar = document.getElementById('iniciar-turno');
if (!btnIniciar) {
  btnIniciar = document.createElement('button');
  btnIniciar.id = 'iniciar-turno';
  btnIniciar.textContent = 'Iniciar Turno';
  btnIniciar.style.margin = '2rem auto 0 auto';
  btnIniciar.style.padding = '0.7rem 1.5rem';
  btnIniciar.style.background = '#43a047';
  btnIniciar.style.color = '#fff';
  btnIniciar.style.border = 'none';
  btnIniciar.style.borderRadius = '4px';
  btnIniciar.style.fontSize = '1.1rem';
  btnIniciar.style.fontWeight = 'bold';
  btnIniciar.style.cursor = 'pointer';
  btnIniciar.style.display = 'block';
  btnIniciar.addEventListener('click', iniciarTurno);
  document.getElementById('main-header-fijo').appendChild(btnIniciar);
}

// Botón finalizar turno (ya existe como 'finalizar-dia')
const btnFinalizar = document.getElementById('finalizar-dia');
if (btnFinalizar) {
  btnFinalizar.textContent = 'Finalizar Turno';
  btnFinalizar.addEventListener('click', finalizarTurno);
}

// Estado del turno
const estadoDiv = document.createElement('div');
estadoDiv.id = 'estado-turno';
estadoDiv.style.textAlign = 'center';
estadoDiv.style.marginBottom = '1rem';
const main = document.querySelector('main');
const ref = document.getElementById('fecha-actual');
if (main && ref && ref.parentNode === main) {
  main.insertBefore(estadoDiv, ref);
} else if (main) {
  main.appendChild(estadoDiv);
}

// Fecha actual
function renderFecha() {
  const fecha = new Date();
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('fecha-actual').textContent = fecha.toLocaleDateString('es-AR', opciones);
}

// Utilidad para formatear importes
function formatearImporte(valor) {
  // Asegurar que el valor sea un número válido
  const numero = parseFloat(valor);
  if (isNaN(numero)) {
    console.warn('Valor no numérico para formatearImporte:', valor);
    return '0,00';
  }
  
  // Formatear según si es entero o decimal
  return Number.isInteger(numero)
    ? numero.toLocaleString('es-AR')
    : numero.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Mostrar viajes en tabla agrupada por turnos
function mostrarViajesTabla(turnos) {
  let html = `<table style="width:100%;border-collapse:collapse;text-align:center;">
    <thead>
      <tr style="background:#f0f8ff;">
        <th style='padding:6px 2px;border:1px solid #ccc;'>N°</th>
        <th style='padding:6px 2px;border:1px solid #ccc;'>Importe</th>
        <th style='padding:6px 2px;border:1px solid #ccc;'>Hora</th>
      </tr>
    </thead>
    <tbody>`;
  let contador = 1;
  turnos.forEach((t, idx) => {
    const inicio = new Date(t.inicio);
    const fin = t.fin ? new Date(t.fin) : null;
    html += `<tr style='background:#e3f2fd;font-weight:bold;'>
      <td colspan='3' style='text-align:left;padding:6px 2px;border:1px solid #ccc;'>
        Turno: ${inicio.toLocaleString('es-AR')} ${fin ? ' - ' + fin.toLocaleString('es-AR') : ''}
      </td>
    </tr>`;
    t.importes.forEach((imp, i) => {
      const valor = typeof imp === 'object' ? imp.valor : imp;
      const hora = typeof imp === 'object' ? imp.hora : '';
      html += `<tr>
        <td style='padding:6px 2px;border:1px solid #ccc;'>${contador++}</td>
        <td style='padding:6px 2px;border:1px solid #ccc;text-align:right;'>$${formatearImporte(valor)}</td>
        <td style='padding:6px 2px;border:1px solid #ccc;'>${hora}</td>
      </tr>`;
    });
  });
  html += '</tbody></table>';
  return html;
}

// Mostrar viajes históricos en una sola tabla continua con diseño moderno
function mostrarViajesHistoricos(turnos) {
  let viajes = [];
  turnos.forEach((t, idx) => {
    t.importes.forEach((imp, i) => {
      // Extraer el valor correctamente
      let valorImporte;
      if (typeof imp === 'object' && imp.valor !== undefined) {
        valorImporte = imp.valor;
      } else if (typeof imp === 'number') {
        valorImporte = imp;
      } else {
        // Si no se puede determinar el valor, usar 0
        valorImporte = 0;
        console.warn('Importe no válido encontrado:', imp);
      }
      
      viajes.push({
        valor: valorImporte,
        turno: new Date(t.inicio).toLocaleString('es-AR'),
        idxTurno: idx + 1,
        fecha: new Date(t.inicio).toLocaleDateString('es-AR', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        hora: typeof imp === 'object' && imp.hora ? imp.hora : new Date(t.inicio).toLocaleTimeString('es-AR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      });
    });
  });
  
  // Ordenar por turno
  viajes.sort((a, b) => a.turno.localeCompare(b.turno));
  
  // Debug: mostrar los valores que se están procesando
  console.log('Viajes procesados:', viajes.map(v => ({ valor: v.valor, tipo: typeof v.valor })));
  
  let totalImportes = viajes.reduce((acc, v) => {
    const valor = parseFloat(v.valor) || 0;
    console.log(`Sumando: ${v.valor} (${typeof v.valor}) -> ${valor}`);
    return acc + valor;
  }, 0);
  let totalViajes = viajes.length;
  
  // Calcular estadísticas adicionales
  const turnosUnicos = new Set(viajes.map(v => v.idxTurno)).size;
  const promedioPorViaje = totalImportes / totalViajes;
  
  let html = `
    <!-- Header con título y estadísticas -->
    <div style='margin-bottom:2rem;'>
      <h2 style='text-align:center;color:#007bff;margin:0 0 1rem 0;font-size:1.8rem;'>📊 Consulta de Viajes</h2>
      <p style='text-align:center;color:#666;margin:0;font-size:1rem;'>Resultados de la consulta</p>
    </div>
    
    <!-- Tarjetas de estadísticas -->
    <div style='display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1.5rem;margin-bottom:2rem;'>
      <div style='text-align:center;padding:1.5rem;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;border-radius:15px;box-shadow:0 4px 20px rgba(102,126,234,0.3);'>
        <div style='font-size:2.5rem;font-weight:bold;margin-bottom:0.5rem;'>${totalViajes}</div>
        <div style='font-size:1rem;opacity:0.9;'>Total de Viajes</div>
      </div>
      
      <div style='text-align:center;padding:1.5rem;background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);color:#fff;border-radius:15px;box-shadow:0 4px 20px rgba(240,147,251,0.3);'>
        <div style='font-size:2.5rem;font-weight:bold;margin-bottom:0.5rem;'>${turnosUnicos}</div>
        <div style='font-size:1rem;opacity:0.9;'>Turnos</div>
      </div>
      
      <div style='text-align:center;padding:1.5rem;background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);color:#fff;border-radius:15px;box-shadow:0 4px 20px rgba(79,172,254,0.3);'>
        <div style='font-size:2.5rem;font-weight:bold;margin-bottom:0.5rem;'>$${formatearImporte(totalImportes)}</div>
        <div style='font-size:1rem;opacity:0.9;'>Total Facturado</div>
      </div>
      
      <div style='text-align:center;padding:1.5rem;background:linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);color:#fff;border-radius:15px;box-shadow:0 4px 20px rgba(67,233,123,0.3);'>
        <div style='font-size:2.5rem;font-weight:bold;margin-bottom:0.5rem;'>$${formatearImporte(promedioPorViaje)}</div>
        <div style='font-size:1rem;opacity:0.9;'>Promedio por Viaje</div>
      </div>
    </div>
    
    <!-- Tabla de viajes con diseño moderno -->
    <div id='tabla-consulta-container' style='background:#fff;border-radius:15px;box-shadow:0 4px 20px rgba(0,0,0,0.08);overflow:hidden;margin-bottom:2rem;'>
      <div style='background:linear-gradient(135deg, #007bff 0%, #0056b3 100%);color:#fff;padding:1.2rem;text-align:center;'>
        <h3 style='margin:0;font-size:1.4rem;font-weight:600;'>🚕 Lista Detallada de Viajes</h3>
      </div>
      
      <div id='consulta-tabla-scroll' style='max-height:400px;overflow-y:auto;overflow-x:hidden;'>
        <table style='width:100%;border-collapse:separate;border-spacing:0;text-align:center;table-layout:fixed;'>
          <thead>
            <tr style='background:#f8f9ff;position:sticky;top:0;z-index:10;'>
              <th style='padding:1rem 0.5rem;font-weight:600;color:#333;border-bottom:2px solid #e0e0e0;width:20%;'>N°</th>
              <th style='padding:1rem 0.5rem;font-weight:600;color:#333;border-bottom:2px solid #e0e0e0;width:30%;'>Fecha</th>
              <th style='padding:1rem 0.5rem;font-weight:600;color:#333;border-bottom:2px solid #e0e0e0;width:25%;'>Hora</th>
              <th style='padding:1rem 0.5rem;font-weight:600;color:#333;border-bottom:2px solid #e0e0e0;width:25%;'>Importe</th>
            </tr>
          </thead>
          <tbody>`;
  
  viajes.forEach((v, i) => {
    const esPar = i % 2 === 0;
    html += `<tr style='background:${esPar ? '#fff' : '#f8f9ff'};transition:background 0.2s ease;'>
      <td style='padding:1rem 0.5rem;color:#007bff;font-weight:600;font-size:1.1rem;'>${i + 1}</td>
      <td style='padding:1rem 0.5rem;color:#666;font-size:0.95rem;'>${v.fecha}</td>
      <td style='padding:1rem 0.5rem;color:#666;font-size:0.95rem;'>${v.hora}</td>
      <td style='padding:1rem 0.5rem;color:#43a047;font-weight:700;font-size:1.2rem;text-align:right;'>$${formatearImporte(v.valor)}</td>
    </tr>`;
  });
  
  html += `
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Resumen final con diseño mejorado -->
    <div style='background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;padding:1.5rem;border-radius:15px;box-shadow:0 4px 20px rgba(102,126,234,0.3);text-align:center;'>
      <div style='font-size:1.3rem;font-weight:600;margin-bottom:0.5rem;'>📈 Resumen Final</div>
      <div style='display:flex;justify-content:space-around;align-items:center;flex-wrap:wrap;gap:1rem;'>
        <div>
          <div style='font-size:1.1rem;opacity:0.9;'>Total Viajes</div>
          <div style='font-size:1.5rem;font-weight:bold;'>${totalViajes}</div>
        </div>
        <div style='width:1px;height:40px;background:rgba(255,255,255,0.3);'></div>
        <div>
          <div style='font-size:1.1rem;opacity:0.9;'>Total Facturado</div>
          <div style='font-size:1.5rem;font-weight:bold;'>$${formatearImporte(totalImportes)}</div>
        </div>
        <div style='width:1px;height:40px;background:rgba(255,255,255,0.3);'></div>
        <div>
          <div style='font-size:1.1rem;opacity:0.9;'>Promedio</div>
          <div style='font-size:1.5rem;font-weight:bold;'>$${formatearImporte(promedioPorViaje)}</div>
        </div>
      </div>
    </div>
    
    <style>
      /* Estilos para la tabla de consulta */
      #consulta-tabla-scroll {
        overflow-x: hidden !important;
      }
      
      #consulta-tabla-scroll table {
        width: 100% !important;
        table-layout: fixed !important;
        word-wrap: break-word !important;
      }
      
      #consulta-tabla-scroll th,
      #consulta-tabla-scroll td {
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        hyphens: auto !important;
      }
      
      /* Hover effects para las filas */
      #consulta-tabla-scroll tbody tr:hover {
        background: #e3f2fd !important;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(33,150,243,0.1);
      }
      
      /* Modo dark para la consulta */
      body.dark-mode #consulta-tabla-scroll {
        background: #23272f !important;
        box-shadow: 0 4px 20px rgba(144,202,249,0.15) !important;
      }
      
      body.dark-mode #consulta-tabla-scroll table {
        background: #23272f !important;
      }
      
      body.dark-mode #consulta-tabla-scroll thead tr {
        background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%) !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 10 !important;
      }
      
      body.dark-mode #consulta-tabla-scroll thead th {
        color: #ffffff !important;
        border-bottom-color: #4a90e2 !important;
      }
      
      body.dark-mode #consulta-tabla-scroll tbody tr:nth-child(even) {
        background: #2c3e50 !important;
      }
      
      body.dark-mode #consulta-tabla-scroll tbody tr:nth-child(odd) {
        background: #34495e !important;
      }
      
      body.dark-mode #consulta-tabla-scroll tbody tr:hover {
        background: #3d5a80 !important;
        box-shadow: 0 2px 8px rgba(144,202,249,0.3) !important;
      }
      
      body.dark-mode #consulta-tabla-scroll td {
        color: #e0e0e0 !important;
        border-bottom: 1px solid #4a5568 !important;
      }
      
      body.dark-mode #consulta-tabla-scroll td:first-child {
        color: #90caf9 !important;
        font-weight: 600 !important;
      }
      
      body.dark-mode #consulta-tabla-scroll td:last-child {
        color: #81c784 !important;
        font-weight: 700 !important;
      }
      
      /* Estilos para el contenedor principal en modo oscuro */
      body.dark-mode #tabla-consulta-container {
        background: #23272f !important;
        box-shadow: 0 4px 20px rgba(144,202,249,0.2) !important;
        border: 1px solid #4a5568 !important;
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .estadisticas-grid {
          grid-template-columns: 1fr !important;
          gap: 1rem !important;
        }
        
        #consulta-tabla-scroll {
          max-height: 350px;
        }
        
        #consulta-tabla-scroll table {
          font-size: 0.9rem;
        }
        
        #consulta-tabla-scroll th,
        #consulta-tabla-scroll td {
          padding: 0.8rem 0.4rem !important;
        }
      }
      
      @media (max-width: 480px) {
        #consulta-tabla-scroll {
          max-height: 300px;
        }
        
        #consulta-tabla-scroll table {
          font-size: 0.8rem;
          min-width: 100% !important;
        }
        
        #consulta-tabla-scroll th,
        #consulta-tabla-scroll td {
          padding: 0.6rem 0.3rem !important;
        }
      }
    </style>
  `;
  
  return html;
}

// Consultas: mostrar importes por turno
function mostrarConsultaTurnos() {
  const turnos = getTurnos();
  let html = '';
  if (turnos.length === 0) {
    html = 'No hay turnos registrados.';
  } else {
    turnos.forEach((t, idx) => {
      const inicio = new Date(t.inicio);
      const fin = t.fin ? new Date(t.fin) : null;
      const total = t.importes.reduce((a, b) => a + (typeof b === 'object' ? b.valor : b), 0);
      html += `<div style='margin-bottom:0.7rem;'><b>Turno ${idx+1}:</b><br>Inicio: ${inicio.toLocaleString('es-AR')}<br>`;
      if (fin) html += `Fin: ${fin.toLocaleString('es-AR')}<br>`;
      html += `Importes: ${t.importes.length}<br>Total: $${total.toLocaleString('es-AR')}</div>`;
    });
  }
  mostrarResultadoConsulta(html);
}

// Consulta por día único (histórica)
const btnConsultaDiaUnica = document.getElementById('btn-consulta-dia-unica');
if (btnConsultaDiaUnica) {
  btnConsultaDiaUnica.addEventListener('click', function() {
    const fecha = document.getElementById('consulta-dia').value;
    console.log('Fecha seleccionada para consulta:', fecha);
    if (!fecha) {
      mostrarResultadoConsulta(`
        <div style='text-align:center;padding:3rem 1rem;color:#666;'>
          <div style='font-size:4rem;margin-bottom:1rem;'>📅</div>
          <h3 style='margin:0 0 0.5rem 0;color:#333;font-size:1.4rem;'>Fecha no seleccionada</h3>
          <p style='margin:0;font-size:1.1rem;'>Por favor, selecciona una fecha para consultar</p>
        </div>
      `);
      return;
    }
    // Filtrar turnos por fecha exacta, considerando zonas horarias
    const turnos = getTurnos().filter(t => {
      const fechaTurno = new Date(t.inicio);
      const fechaSeleccionada = new Date(fecha + 'T00:00:00');
      const fechaTurnoLocal = fechaTurno.toISOString().split('T')[0];
      const fechaSeleccionadaLocal = fechaSeleccionada.toISOString().split('T')[0];
      
      console.log(`Comparando: ${fechaTurnoLocal} con ${fechaSeleccionadaLocal}`);
      return fechaTurnoLocal === fechaSeleccionadaLocal;
    });
    if (turnos.length === 0) {
      mostrarResultadoConsulta(`
        <div style='text-align:center;padding:3rem 1rem;color:#666;'>
          <div style='font-size:4rem;margin-bottom:1rem;'>🔍</div>
          <h3 style='margin:0 0 0.5rem 0;color:#333;font-size:1.4rem;'>No hay turnos para esa fecha</h3>
          <p style='margin:0;font-size:1.1rem;'>No se encontraron turnos registrados para el ${new Date(fecha).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      `);
      return;
    }
    const tabla = mostrarViajesHistoricos(turnos);
    mostrarResultadoConsulta(tabla);
  });
}

// Consulta por rango de fechas (histórica)
const btnConsultaRango = document.getElementById('btn-consulta-rango');
if (btnConsultaRango) {
  btnConsultaRango.addEventListener('click', function() {
    const desde = document.getElementById('consulta-desde').value;
    const hasta = document.getElementById('consulta-hasta').value;
    if (!desde || !hasta || desde > hasta) {
      mostrarResultadoConsulta(`
        <div style='text-align:center;padding:3rem 1rem;color:#666;'>
          <div style='font-size:4rem;margin-bottom:1rem;'>⚠️</div>
          <h3 style='margin:0 0 0.5rem 0;color:#333;font-size:1.4rem;'>Rango de fechas inválido</h3>
          <p style='margin:0;font-size:1.1rem;'>Por favor, selecciona un rango de fechas válido (desde ≤ hasta)</p>
        </div>
      `);
      return;
    }
    // Filtrar turnos por rango de fechas, considerando zonas horarias
    const turnos = getTurnos().filter(t => {
      const fechaTurno = new Date(t.inicio);
      const fechaDesde = new Date(desde + 'T00:00:00');
      const fechaHasta = new Date(hasta + 'T23:59:59');
      
      const fechaTurnoLocal = fechaTurno.toISOString().split('T')[0];
      const fechaDesdeLocal = fechaDesde.toISOString().split('T')[0];
      const fechaHastaLocal = fechaHasta.toISOString().split('T')[0];
      
      console.log(`Rango: ${fechaTurnoLocal} entre ${fechaDesdeLocal} y ${fechaHastaLocal}`);
      return fechaTurnoLocal >= fechaDesdeLocal && fechaTurnoLocal <= fechaHastaLocal;
    });
    if (turnos.length === 0) {
      mostrarResultadoConsulta(`
        <div style='text-align:center;padding:3rem 1rem;color:#666;'>
          <div style='font-size:4rem;margin-bottom:1rem;'>🔍</div>
          <h3 style='margin:0 0 0.5rem 0;color:#333;font-size:1.4rem;'>No hay turnos en ese rango</h3>
          <p style='margin:0;font-size:1.1rem;'>No se encontraron turnos entre el ${new Date(desde).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })} y el ${new Date(hasta).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      `);
      return;
    }
    const tabla = mostrarViajesHistoricos(turnos);
    mostrarResultadoConsulta(tabla);
  });
}

function mostrarResultadoConsulta(html) {
  // Cerrar el menú si está abierto
  cerrarMenu();
  // Mostrar resultado en la pantalla principal
  const consultaDiv = document.getElementById('consulta-principal');
  const mainHeader = document.getElementById('main-header-fijo');
  const tablaTurnos = document.getElementById('tabla-turnos-recientes-container');
  const finalizarBtn = document.getElementById('finalizar-dia');
  if (consultaDiv) {
    consultaDiv.innerHTML = `
      <div id='consulta-resultado-contenido' style='background:#f9f9f9;padding:1.2rem 0.7rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);'>
        <div style='margin-top:0;'>${html}</div>
      </div>
      <div style='display:flex;justify-content:center;gap:1.5rem;margin:2.5rem 0 0.7rem 0;'>
        <button id='volver-principal' style='padding:0.7rem 1.5rem;background:#007bff;color:#fff;border:none;border-radius:4px;font-size:1.1rem;cursor:pointer;'>Volver</button>
        <button id='descargar-pdf' style='padding:0.7rem 1.5rem;background:#43a047;color:#fff;border:none;border-radius:4px;font-size:1.1rem;cursor:pointer;'>Descargar PDF</button>
      </div>
    `;
    consultaDiv.style.display = '';
    if (mainHeader) mainHeader.style.display = 'none';
    if (tablaTurnos) tablaTurnos.style.display = 'none';
    if (finalizarBtn) finalizarBtn.style.display = 'none';
    // Botón volver con lógica inteligente
    const volverBtn = document.getElementById('volver-principal');
    if (volverBtn) {
      volverBtn.addEventListener('click', function() {
        consultaDiv.style.display = 'none';
        if (mainHeader) mainHeader.style.display = '';
        if (tablaTurnos) tablaTurnos.style.display = '';
        
        // Lógica inteligente para el botón volver
        const turnoActivo = getTurnoActivo();
        if (turnoActivo) {
          // Si hay turno activo, volver al turno en curso
          if (finalizarBtn) finalizarBtn.style.display = '';
          // Mostrar la pantalla del turno activo
          mostrarTurnoActivo();
        } else {
          // Si no hay turno activo, volver al dashboard
          if (finalizarBtn) finalizarBtn.style.display = 'none';
          mostrarDashboard();
        }
      });
    }
    // Botón descargar PDF
    const pdfBtn = document.getElementById('descargar-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', function() {
        generarPDFConsulta();
      });
    }
    const footer = document.getElementById('footer-app');
    if (footer) footer.style.display = '';
  }
}

// PDF: tabla histórica igual que en pantalla
function generarPDFConsulta() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const contenido = document.getElementById('consulta-resultado-contenido');
  const fechaGen = new Date().toLocaleString('es-AR');
  
  // Generar nombre de archivo con fecha
  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const nombreArchivo = `Historial_${dia}-${mes}-${año}.pdf`;
  
  // Título y encabezado
  doc.setFontSize(18);
  doc.text('ControlChoferes - Historial', 105, 15, { align: 'center' });
  doc.setFontSize(11);
  doc.text('Generado: ' + fechaGen, 105, 22, { align: 'center' });
  let y = 30;
  
  // Buscar la tabla visible
  const tabla = contenido ? contenido.querySelector('table') : null;
      // Buscar totales
    let totalImportes = 0;
    let totalViajes = 0;
    if (tabla && doc.autoTable) {
      // Extraer encabezados y filas
      const head = [Array.from(tabla.querySelectorAll('thead th')).map(th => th.innerText)];
      console.log('Encabezados de la tabla:', head);
      
      const body = Array.from(tabla.querySelectorAll('tbody tr')).map(tr => {
        const celdas = Array.from(tr.querySelectorAll('td'));
        console.log('Fila completa:', celdas.map(td => td.innerText));
        
        // La columna del total es la cuarta (índice 3) - "Total"
        if (celdas[3]) {
          let valorTexto = celdas[3].innerText;
          console.log('Valor original de la celda:', valorTexto);
          
          // Remover el símbolo $ y cualquier caracter no numérico excepto punto y coma
          let valor = valorTexto.replace(/[^\d,\.]/g, '').replace(',', '.');
          console.log('Valor después de limpiar:', valor);
          
          // Manejar números con separadores de miles
          let numero;
          if (valor.includes('.')) {
            // Si hay punto, verificar si es separador de miles o decimal
            let partes = valor.split('.');
            if (partes.length === 2 && partes[1].length <= 2) {
              // Es un decimal (ej: 123.45)
              numero = parseFloat(valor);
            } else {
              // Es separador de miles (ej: 123.456.789)
              numero = parseFloat(valor.replace(/\./g, ''));
            }
          } else {
            // No hay punto, parsear directamente
            numero = parseFloat(valor);
          }
          
          console.log('Número parseado:', numero);
          
          if (!isNaN(numero)) {
            totalImportes += numero;
            console.log('Total acumulado:', totalImportes);
          } else {
            console.log('Error: No se pudo parsear el número');
          }
        }
        
        // Contar viajes desde la tercera columna (índice 2) - "Viajes"
        if (celdas[2]) {
          let viajesTexto = celdas[2].innerText;
          console.log('Viajes de la celda:', viajesTexto);
          
          let viajes = parseInt(viajesTexto);
          console.log('Viajes parseados:', viajes);
          
          if (!isNaN(viajes)) {
            totalViajes += viajes;
            console.log('Total viajes acumulado:', totalViajes);
          } else {
            console.log('Error: No se pudieron parsear los viajes');
          }
        }
        
        return celdas.map(td => td.innerText);
      });
    doc.autoTable({
      head: head,
      body: body,
      startY: y,
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243], textColor: 255, fontStyle: 'bold', halign: 'center' },
      bodyStyles: { halign: 'center', fontSize: 10 },
      styles: { cellPadding: 2, font: 'helvetica', fontSize: 10 },
      margin: { left: 10, right: 10 },
      tableWidth: 'auto',
    });
    y = doc.lastAutoTable.finalY + 10;
    
    // Agregar línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y - 5, 190, y - 5);
    y += 5;
    
    // Mostrar totales con mejor formato
    doc.setFontSize(12);
    doc.setTextColor(67, 160, 71);
    doc.text(`Total de viajes: ${totalViajes}`, 20, y);
    doc.setTextColor(33, 150, 243);
    doc.text(`Total importes: $${formatearImporte(totalImportes)}`, 20, y + 8);
    
    // Agregar información adicional
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(`Archivo generado el: ${fechaGen}`, 20, y + 20);
    
    doc.setTextColor(0,0,0);
    
    // Log para debugging
    console.log('PDF - Total viajes:', totalViajes);
    console.log('PDF - Total importes (número):', totalImportes);
    console.log('PDF - Total importes (tipo):', typeof totalImportes);
    console.log('PDF - Total importes formateado:', formatearImporte(totalImportes));
  } else if (contenido) {
    let text = contenido.innerText.replace(/\n{2,}/g, '\n');
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 15, y + 5);
  }
  
  // Guardar con el nuevo nombre de archivo
  doc.save(nombreArchivo);
}

// Generar PDF de un turno específico
function generarPDFTurno(turno) {
  if (!turno) return;
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Generar nombre de archivo con fecha del turno
  const fechaTurno = new Date(turno.inicio);
  const dia = fechaTurno.getDate().toString().padStart(2, '0');
  const mes = (fechaTurno.getMonth() + 1).toString().padStart(2, '0');
  const año = fechaTurno.getFullYear();
  const hora = fechaTurno.getHours().toString().padStart(2, '0');
  const minuto = fechaTurno.getMinutes().toString().padStart(2, '0');
  const nombreArchivo = `Turno_${dia}-${mes}-${año}_${hora}-${minuto}.pdf`;
  
  // Título y encabezado
  doc.setFontSize(18);
  doc.text('ControlChoferes - Detalle del Turno', 105, 15, { align: 'center' });
  
  // Información del turno
  doc.setFontSize(12);
  doc.setTextColor(33, 150, 243);
  doc.text('Información del Turno:', 20, 35);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Fecha: ${fechaTurno.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 50);
  doc.text(`Hora de inicio: ${fechaTurno.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`, 20, 60);
  
  if (turno.fin) {
    const fechaFin = new Date(turno.fin);
    doc.text(`Hora de fin: ${fechaFin.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`, 20, 70);
    
    // Calcular duración
    const duracion = fechaFin - fechaTurno;
    const horas = Math.floor(duracion / (1000 * 60 * 60));
    const minutos = Math.floor((duracion % (1000 * 60 * 60)) / (1000 * 60));
    doc.text(`Duración: ${horas}h ${minutos}m`, 20, 80);
  }
  
  doc.text(`Total de viajes: ${turno.importes.length}`, 20, 90);
  
  // Calcular total del turno
  const totalTurno = turno.importes.reduce((a, b) => a + (typeof b === 'object' ? b.valor : b), 0);
  doc.setTextColor(67, 160, 71);
  doc.setFontSize(12);
  doc.text(`Total del turno: $${formatearImporte(totalTurno)}`, 20, 105);
  
  // Línea separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 115, 190, 115);
  
  // Tabla de viajes
  let y = 130;
  doc.setTextColor(33, 150, 243);
  doc.setFontSize(14);
  doc.text('Lista de Viajes:', 20, y);
  y += 10;
  
  if (turno.importes.length > 0 && doc.autoTable) {
    // Preparar datos para la tabla
    const head = [['N°', 'Hora', 'Importe', 'Tipo']];
    const body = turno.importes.map((imp, index) => [
      (index + 1).toString(),
      imp.hora || '-',
      `$${formatearImporte(imp.valor)}`,
      imp.tipo || 'Efectivo'
    ]);
    
    doc.autoTable({
      head: head,
      body: body,
      startY: y,
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243], textColor: 255, fontStyle: 'bold', halign: 'center' },
      bodyStyles: { halign: 'center', fontSize: 10 },
      styles: { cellPadding: 3, font: 'helvetica', fontSize: 10 },
      margin: { left: 20, right: 20 },
      tableWidth: 'auto',
    });
    
    y = doc.lastAutoTable.finalY + 10;
  }
  
  // Resumen final
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, 190, y);
  y += 10;
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text(`Archivo generado el: ${new Date().toLocaleString('es-AR')}`, 20, y);
  
  // Guardar PDF
  doc.save(nombreArchivo);
}

// Función helper para cerrar el menú
function cerrarMenu() {
  const drawer = document.getElementById('drawer-sidebar');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('drawer-visible');
    drawer.classList.add('drawer-oculto');
    overlay.classList.remove('drawer-overlay-visible');
    overlay.classList.add('drawer-overlay-oculto');
    document.body.style.overflow = '';
  }
}

// Mostrar tabla de turnos recientes (para el botón Ver Turnos)
function mostrarTurnosRecientes() {
  // Cerrar el menú automáticamente
  cerrarMenu();
  
  const turnos = getTurnos().filter(t => t.fin);
  if (turnos.length === 0) {
    mostrarResultadoConsulta(`
      <div style='text-align:center;padding:3rem 1rem;color:#666;'>
        <div style='font-size:3rem;margin-bottom:1rem;'>📋</div>
        <h3 style='margin:0 0 0.5rem 0;color:#333;'>No hay turnos registrados</h3>
        <p style='margin:0;font-size:1.1rem;'>Comienza un turno para ver el historial aquí</p>
      </div>
    `);
    return;
  }
  
  let html = `
    <div style='margin-bottom:2rem;'>
      <h2 style='text-align:center;color:#007bff;margin:0 0 1rem 0;font-size:1.8rem;'>📊 Historial de Turnos</h2>
      <p style='text-align:center;color:#666;margin:0;font-size:1rem;'>Total: ${turnos.length} turnos completados</p>
    </div>
    
    <div id='consulta-tabla-scroll' style='max-height:500px;overflow-y:auto;overflow-x:hidden;box-sizing:border-box;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);'>
      <table style="width:100%;border-collapse:separate;border-spacing:0;text-align:center;table-layout:fixed;min-width:100%;">
        <thead>
          <tr style="background:linear-gradient(135deg, #007bff 0%, #0056b3 100%);color:#fff;position:sticky;top:0;z-index:10;">
            <th style='padding:1rem 0.5rem;font-weight:600;font-size:1.1rem;border:none;width:22%;'>Fecha</th>
            <th style='padding:1rem 0.5rem;font-weight:600;font-size:1.1rem;border:none;width:28%;'>Horario</th>
            <th style='padding:1rem 0.5rem;font-weight:600;font-size:1.1rem;border:none;width:18%;'>Viajes</th>
            <th style='padding:1rem 0.5rem;font-weight:600;font-size:1.1rem;border:none;width:32%;'>Total</th>
          </tr>
        </thead>
        <tbody>`;
  
  turnos.slice().reverse().forEach((t, idx) => {
    const inicioDate = new Date(t.inicio);
    const finDate = t.fin ? new Date(t.fin) : null;
    const cantidad = t.importes.length;
    const total = t.importes.reduce((a, b) => a + (typeof b === 'object' ? b.valor : b), 0);
    
    // Formatear fecha de manera más legible
    const fecha = inicioDate.toLocaleDateString('es-AR', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    // Formatear horario de manera más clara
    const horaInicio = inicioDate.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const horaFin = finDate ? finDate.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : '-';
    const horario = `${horaInicio} - ${horaFin}`;
    
    html += `<tr class="turno-row" data-turno-idx="${turnos.length - 1 - idx}" style="cursor:pointer;transition:all 0.2s ease;border-bottom:1px solid #f0f0f0;">
      <td style='padding:1rem 0.8rem;font-weight:500;color:#333;word-wrap:break-word;'>${fecha}</td>
      <td style='padding:1rem 0.8rem;color:#666;font-size:0.95rem;word-wrap:break-word;'>${horario}</td>
      <td style='padding:1rem 0.8rem;color:#007bff;font-weight:600;font-size:1.1rem;'>${cantidad}</td>
      <td style='padding:1rem 0.8rem;color:#43a047;font-weight:700;font-size:1.2rem;text-align:right;'>$${formatearImporte(total)}</td>
    </tr>`;
  });
  
  html += '</tbody></table></div>';
  
  // Agregar estilos CSS inline para hover, responsive y modo dark
  html += `
    <style>
      /* Prevenir scroll horizontal */
      #consulta-tabla-scroll {
        overflow-x: hidden !important;
      }
      
      #consulta-tabla-scroll table {
        width: 100% !important;
        table-layout: fixed !important;
        word-wrap: break-word !important;
      }
      
      #consulta-tabla-scroll th,
      #consulta-tabla-scroll td {
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        hyphens: auto !important;
      }
      
      /* Asegurar que la columna del total tenga suficiente espacio */
      #consulta-tabla-scroll th:nth-child(4),
      #consulta-tabla-scroll td:nth-child(4) {
        min-width: 120px !important;
        text-align: right !important;
        padding-right: 1rem !important;
      }
      
      /* Ajustar el ancho mínimo de la tabla */
      #consulta-tabla-scroll table {
        min-width: 600px !important;
      }
      
      .turno-row:hover {
        background: #f8f9ff !important;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0,123,255,0.1);
      }
      
      /* Modo dark para la tabla */
      body.dark-mode #consulta-tabla-scroll {
        background: #23272f !important;
        box-shadow: 0 4px 20px rgba(144,202,249,0.15) !important;
      }
      
      body.dark-mode #consulta-tabla-scroll thead tr {
        background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%) !important;
      }
      
      body.dark-mode .turno-row:hover {
        background: #2c3e50 !important;
        box-shadow: 0 2px 8px rgba(144,202,249,0.2) !important;
      }
      
      body.dark-mode .turno-row td {
        color: #e0e0e0 !important;
      }
      
      body.dark-mode .turno-row td:nth-child(3) {
        color: #90caf9 !important;
      }
      
      body.dark-mode .turno-row td:nth-child(4) {
        color: #66bb6a !important;
      }
      
      @media (max-width: 768px) {
        #consulta-tabla-scroll {
          max-height: 400px;
        }
        
        #consulta-tabla-scroll table {
          font-size: 0.9rem;
        }
        
        #consulta-tabla-scroll th,
        #consulta-tabla-scroll td {
          padding: 0.8rem 0.5rem !important;
        }
      }
      
      @media (max-width: 480px) {
        #consulta-tabla-scroll {
          max-height: 350px;
        }
        
        #consulta-tabla-scroll table {
          font-size: 0.8rem;
          min-width: 100% !important;
        }
        
        #consulta-tabla-scroll th,
        #consulta-tabla-scroll td {
          padding: 0.6rem 0.4rem !important;
        }
        
        /* En móviles, ajustar el ancho mínimo */
        #consulta-tabla-scroll th:nth-child(4),
        #consulta-tabla-scroll td:nth-child(4) {
          min-width: 100px !important;
        }
      }
    </style>
  `;
  
  mostrarResultadoConsulta(html);

  // Agrego listeners a las filas para mostrar detalle
  setTimeout(() => {
    document.querySelectorAll('.turno-row').forEach(row => {
      row.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-turno-idx'));
        mostrarDetalleTurno(turnos[idx]);
      });
    });
  }, 0);
}

function mostrarDetalleTurno(turno) {
  if (!turno) return;
  
  // Cerrar el menú automáticamente si está abierto
  cerrarMenu();
  
  const inicioDate = new Date(turno.inicio);
  const finDate = turno.fin ? new Date(turno.fin) : null;
  const total = turno.importes.reduce((a, b) => a + (typeof b === 'object' ? b.valor : b), 0);
  
  // Formatear fechas de manera más legible
  const fecha = inicioDate.toLocaleDateString('es-AR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const horaInicio = inicioDate.toLocaleTimeString('es-AR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const horaFin = finDate ? finDate.toLocaleTimeString('es-AR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : 'En curso';
  
  let html = `
    <div style='margin-bottom:2rem;'>
      <h2 style='text-align:center;color:#007bff;margin:0 0 1rem 0;font-size:1.8rem;'>📋 Detalle del Turno</h2>
    </div>
    
    <div style='background:#fff;padding:1.5rem;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);margin-bottom:2rem;'>
      <div style='display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1.5rem;margin-bottom:1.5rem;'>
        <div style='text-align:center;padding:1rem;background:#f8f9ff;border-radius:8px;border-left:4px solid #007bff;'>
          <div style='font-size:1.5rem;margin-bottom:0.5rem;'>📅</div>
          <div style='font-weight:600;color:#333;font-size:1.1rem;'>Fecha</div>
          <div style='color:#666;font-size:0.95rem;'>${fecha}</div>
        </div>
        <div style='text-align:center;padding:1rem;background:#f8f9ff;border-radius:8px;border-left:4px solid #43a047;'>
          <div style='font-size:1.5rem;margin-bottom:0.5rem;'>⏰</div>
          <div style='font-weight:600;color:#333;font-size:1.1rem;'>Horario</div>
          <div style='color:#666;font-size:0.95rem;'>${horaInicio} - ${horaFin}</div>
        </div>
        <div style='text-align:center;padding:1rem;background:#f8f9ff;border-radius:8px;border-left:4px solid #ff9800;'>
          <div style='font-size:1.5rem;margin-bottom:0.5rem;'>🚗</div>
          <div style='font-weight:600;color:#333;font-size:1.1rem;'>Viajes</div>
          <div style='color:#666;font-size:0.95rem;'>${turno.importes.length}</div>
        </div>
        <div style='text-align:center;padding:1rem;background:#fff;border-radius:8px;border-left:4px solid #e91e63;'>
          <div style='font-size:1.5rem;margin-bottom:0.5rem;'>💰</div>
          <div style='font-weight:600;color:#333;font-size:1.1rem;'>Total</div>
          <div style='color:#43a047;font-weight:700;font-size:1.2rem;'>$${formatearImporte(total)}</div>
        </div>
      </div>
    </div>
    
    <div style='background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);overflow:hidden;'>
      <div style='background:linear-gradient(135deg, #007bff 0%, #0056b3 100%);color:#fff;padding:1rem;text-align:center;'>
        <h3 style='margin:0;font-size:1.3rem;font-weight:600;'>🚕 Lista de Viajes</h3>
      </div>
      <div style='max-height:400px;overflow-y:auto;overflow-x:hidden;'>
        <table style='width:100%;border-collapse:separate;border-spacing:0;text-align:center;table-layout:fixed;'>
          <thead>
            <tr style='background:#f8f9ff;position:sticky;top:0;z-index:10;'>
              <th style='padding:1rem 0.5rem;font-weight:600;color:#333;border-bottom:1px solid #e0e0e0;width:30%;'>Hora</th>
              <th style='padding:1rem 0.5rem;font-weight:600;color:#333;border-bottom:1px solid #e0e0e0;width:40%;'>Importe</th>
              <th style='padding:1rem 0.5rem;font-weight:600;color:#333;border-bottom:1px solid #e0e0e0;width:30%;'>Tipo</th>
            </tr>
          </thead>
          <tbody>`;
  
  turno.importes.forEach((imp, index) => {
    const esPar = index % 2 === 0;
    html += `<tr style='background:${esPar ? '#fff' : '#f8f9ff'};transition:background 0.2s ease;'>
      <td style='padding:1rem 0.5rem;color:#666;font-size:0.95rem;word-wrap:break-word;'>${imp.hora || '-'}</td>
      <td style='padding:1rem 0.5rem;color:#43a047;font-weight:700;font-size:1.1rem;text-align:right;word-wrap:break-word;'>$${formatearImporte(imp.valor)}</td>
      <td style='padding:1rem 0.5rem;color:#007bff;font-weight:600;font-size:0.95rem;word-wrap:break-word;'>${imp.tipo || 'Efectivo'}</td>
    </tr>`;
  });
  
  html += `
          </tbody>
        </table>
      </div>
    </div>
    
    <div style='margin-top:2rem;text-align:center;display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;'>
      <button id='volver-turnos' style='padding:1rem 2rem;background:linear-gradient(135deg, #007bff 0%, #0056b3 100%);color:#fff;border:none;border-radius:8px;font-size:1.1rem;font-weight:600;cursor:pointer;box-shadow:0 4px 15px rgba(0,123,255,0.3);transition:all 0.3s ease;'>
        ← Volver a turnos
      </button>
      <button id='descargar-pdf-turno' style='padding:1rem 2rem;background:linear-gradient(135deg, #43a047 0%, #388e3c 100%);color:#fff;border:none;border-radius:8px;font-size:1.1rem;font-weight:600;cursor:pointer;box-shadow:0 4px 15px rgba(67,160,71,0.3);transition:all 0.3s ease;'>
        📄 Descargar PDF
      </button>
    </div>
    
    <style>
      #volver-turnos:hover,
      #descargar-pdf-turno:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,123,255,0.4);
      }
      
      #volver-turnos:active,
      #descargar-pdf-turno:active {
        transform: translateY(0);
      }
      
      #descargar-pdf-turno:hover {
        box-shadow: 0 6px 20px rgba(67,160,71,0.4) !important;
      }
      
      @media (max-width: 768px) {
        .estadisticas-grid {
          grid-template-columns: 1fr !important;
          gap: 1rem !important;
        }
        
        .estadisticas-grid > div {
          padding: 0.8rem !important;
        }
        
        /* Botones en móviles */
        #volver-turnos,
        #descargar-pdf-turno {
          padding: 0.8rem 1.5rem !important;
          font-size: 1rem !important;
          min-width: 140px !important;
        }
      }
      
      /* Modo dark para el detalle del turno */
      body.dark-mode .estadisticas-grid > div {
        background: #2c3e50 !important;
        color: #e0e0e0 !important;
      }
      
      /* Estilos para encabezado sticky en modo oscuro */
      body.dark-mode thead tr {
        background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%) !important;
      }
      
      body.dark-mode thead th {
        color: #ffffff !important;
        border-bottom-color: #4a90e2 !important;
      }
      
      body.dark-mode .estadisticas-grid > div > div:first-child {
        color: #90caf9 !important;
      }
      
      body.dark-mode .estadisticas-grid > div > div:last-child {
        color: #bdbdbd !important;
      }
      
      body.dark-mode .estadisticas-grid > div:nth-child(4) > div:last-child {
        color: #66bb6a !important;
      }
      
      body.dark-mode #consulta-resultado-contenido {
        background: #23272f !important;
        color: #e0e0e0 !important;
      }
      
      body.dark-mode #consulta-resultado-contenido h2 {
        color: #90caf9 !important;
      }
      
      body.dark-mode #consulta-resultado-contenido h3 {
        color: #90caf9 !important;
      }
      
      @media (max-width: 768px) {
        .estadisticas-grid {
          grid-template-columns: 1fr !important;
          gap: 1rem !important;
        }
        
        .estadisticas-grid > div {
          padding: 0.8rem !important;
        }
      }
      
      @media (max-width: 480px) {
        .estadisticas-grid {
          grid-template-columns: 1fr !important;
          gap: 0.8rem !important;
        }
        
        .estadisticas-grid > div {
          padding: 0.6rem !important;
          font-size: 0.9rem !important;
        }
      }
    </style>
  `;
  
  // Mostrar directamente el detalle del turno sin usar mostrarResultadoConsulta
  const consultaDiv = document.getElementById('consulta-principal');
  const mainHeader = document.getElementById('main-header-fijo');
  const tablaTurnos = document.getElementById('tabla-turnos-recientes-container');
  const finalizarBtn = document.getElementById('finalizar-dia');
  
  if (consultaDiv) {
    consultaDiv.innerHTML = `
      <div id='consulta-resultado-contenido' style='background:#f9f9f9;padding:1.2rem 0.7rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);'>
        <div style='margin-top:0;'>${html}</div>
      </div>
    `;
    consultaDiv.style.display = '';
    if (mainHeader) mainHeader.style.display = 'none';
    if (tablaTurnos) tablaTurnos.style.display = 'none';
    if (finalizarBtn) finalizarBtn.style.display = 'none';
    
    const footer = document.getElementById('footer-app');
    if (footer) footer.style.display = '';
    
    // Agregar event listeners a los botones del detalle
    setTimeout(() => {
      const volverBtn = document.getElementById('volver-turnos');
      if (volverBtn) volverBtn.onclick = function() {
        // Lógica inteligente para volver desde el detalle del turno
        const turnoActivo = getTurnoActivo();
        if (turnoActivo) {
          // Si hay turno activo, volver al turno en curso
          mostrarTurnoActivo();
        } else {
          // Si no hay turno activo, volver al dashboard
          mostrarDashboard();
        }
      };
      
      const descargarPdfBtn = document.getElementById('descargar-pdf-turno');
      if (descargarPdfBtn) descargarPdfBtn.onclick = () => generarPDFTurno(turno);
    }, 0);
  }
}

// Botón Ver Turnos en el sidebar
const btnConsultaTurnos = document.getElementById('btn-consulta-dia');
if (btnConsultaTurnos) {
  btnConsultaTurnos.addEventListener('click', mostrarTurnosRecientes);
}

// Utilidad para cargar SIEMPRE los datos de prueba
async function cargarTurnosPrueba() {
  localStorage.removeItem('turnos');
  try {
    const resp = await fetch('turnos-prueba.json');
    if (resp.ok) {
      const data = await resp.json();
      localStorage.setItem('turnos', JSON.stringify(data));
      render();
    }
  } catch (e) {
    // No hacer nada si falla
  }
}

// Modo dark/white
function aplicarModoDark() {
  const dark = localStorage.getItem('modo-dark') === '1';
  // Usar requestAnimationFrame para evitar bloqueos del DOM
  requestAnimationFrame(() => {
    document.body.classList.toggle('dark-mode', dark);
    const switchDark = document.getElementById('switch-dark');
    if (switchDark) switchDark.checked = dark;
  });
}

function actualizarLabelModoDark() {
  const label = document.querySelector('label[for="switch-dark"]');
  const dark = localStorage.getItem('modo-dark') === '1';
  if (label) label.textContent = dark ? '☀️ Modo claro' : '🌙 Modo oscuro';
}

// Backup y restaurar datos (ajustar para usuario)
function descargarBackup() {
  try {
    const turnos = getTurnos();
    const usuario = usuarioLogueado();
    
    // Crear objeto de backup con metadatos
    const backupData = {
      usuario: usuario,
      fechaBackup: new Date().toISOString(),
      version: '1.0',
      totalTurnos: turnos.length,
      turnos: turnos
    };
    
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Generar nombre de archivo con fecha
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minuto = fecha.getMinutes().toString().padStart(2, '0');
    const nombreArchivo = `Backup_Turnos_${dia}-${mes}-${año}_${hora}-${minuto}.json`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    // Mostrar confirmación
    alert(`✅ Backup descargado exitosamente:\n${nombreArchivo}\n\nTotal de turnos: ${turnos.length}`);
    
  } catch (error) {
    console.error('Error al crear backup:', error);
    alert('❌ Error al crear el backup. Revisa la consola para más detalles.');
  }
}

function restaurarBackup(archivo) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      
      // Verificar si es el nuevo formato con metadatos
      let turnos;
      if (data.turnos && Array.isArray(data.turnos)) {
        // Nuevo formato con metadatos
        turnos = data.turnos;
        console.log('Backup detectado:', {
          usuario: data.usuario,
          fechaBackup: data.fechaBackup,
          version: data.version,
          totalTurnos: data.totalTurnos
        });
      } else if (Array.isArray(data)) {
        // Formato antiguo (solo array de turnos)
        turnos = data;
        console.log('Backup en formato antiguo detectado');
      } else {
        throw new Error('Formato de backup no reconocido');
      }
      
      // Validar que los turnos tengan la estructura correcta
      if (turnos.length > 0 && turnos[0].inicio && turnos[0].importes) {
        const turnosActuales = getTurnos().length;
        const mensaje = `¿Seguro que quieres restaurar este backup?\n\n` +
                       `📊 Información del backup:\n` +
                       `• Turnos a restaurar: ${turnos.length}\n` +
                       `• Turnos actuales: ${turnosActuales}\n\n` +
                       `⚠️ Esta acción reemplazará todos los turnos actuales.`;
        
        if (confirm(mensaje)) {
          localStorage.setItem(getTurnosKey(), JSON.stringify(turnos));
          render();
          
          // Mostrar confirmación detallada
          const fechaRestauracion = new Date().toLocaleString('es-AR');
          alert(`✅ Backup restaurado exitosamente!\n\n` +
                `📅 Restaurado el: ${fechaRestauracion}\n` +
                `📊 Turnos restaurados: ${turnos.length}\n` +
                `🔄 La aplicación se ha actualizado.`);
        }
      } else {
        alert('❌ El archivo no contiene turnos válidos.\n\n' +
              'Asegúrate de que sea un backup de Control Choferes.');
      }
    } catch (err) {
      console.error('Error al restaurar backup:', err);
      alert('❌ Error al restaurar el backup:\n\n' +
            '• Verifica que el archivo sea un JSON válido\n' +
            '• Asegúrate de que sea un backup de Control Choferes\n' +
            '• Revisa la consola para más detalles');
    }
  };
  
  reader.onerror = function() {
    alert('❌ Error al leer el archivo. Inténtalo de nuevo.');
  };
  
  reader.readAsText(archivo);
}

window.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('drawer-sidebar');
  const overlay = document.getElementById('drawer-overlay');
  const switchDark = document.getElementById('switch-dark');
  const labelDark = document.getElementById('icon-dark-label');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('drawer-oculto');
      drawer.classList.add('drawer-visible');
      overlay.classList.remove('drawer-overlay-oculto');
      overlay.classList.add('drawer-overlay-visible');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('drawer-visible');
      drawer.classList.add('drawer-oculto');
      overlay.classList.remove('drawer-overlay-visible');
      overlay.classList.add('drawer-overlay-oculto');
      document.body.style.overflow = '';
    }
  }
  function setDarkMode(dark) {
    // Usar requestAnimationFrame para evitar bloqueos del DOM
    requestAnimationFrame(() => {
      document.body.classList.toggle('dark-mode', dark);
      if (switchDark) switchDark.checked = dark;
      if (labelDark) labelDark.textContent = dark ? '☀️' : '🌙';
    });
  }
  function getDarkMode() {
    return localStorage.getItem('modo-dark') === '1';
  }
  // Inicializar modo
  setDarkMode(getDarkMode());
  // Cambiar modo al usar el switch
  if (switchDark) {
    switchDark.addEventListener('change', function() {
      localStorage.setItem('modo-dark', switchDark.checked ? '1' : '0');
      setDarkMode(switchDark.checked);
    });
  }
  
  // Cambiar modo al tocar el icono - Optimizado para móviles
  if (labelDark) {
    // Usar múltiples eventos para mejor compatibilidad móvil
    labelDark.addEventListener('click', handleIconClick);
    labelDark.addEventListener('touchstart', handleIconClick, { passive: true });
    labelDark.addEventListener('pointerdown', handleIconClick);
    
    function handleIconClick(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Feedback visual inmediato
      if (labelDark) {
        labelDark.style.transform = 'scale(0.9)';
        setTimeout(() => {
          labelDark.style.transform = '';
        }, 150);
      }
      
      const newMode = !getDarkMode();
      localStorage.setItem('modo-dark', newMode ? '1' : '0');
      setDarkMode(newMode);
      
      if (switchDark) {
        switchDark.checked = newMode;
        // No disparar el evento change para evitar duplicación
      }
    }
  }
  if (menuToggle && drawer && overlay) {
    menuToggle.onclick = function(e) {
      e.stopPropagation();
      if (drawer.classList.contains('drawer-visible')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };
    overlay.onclick = function() {
      closeDrawer();
    };
    document.addEventListener('pointerdown', function(e) {
      if (
        drawer &&
        drawer.classList.contains('drawer-visible') &&
        !drawer.contains(e.target) &&
        e.target !== menuToggle
      ) {
        closeDrawer();
      }
    });
  }
  // Listener cerrar sesión (siempre activo)
  if (btnLogout) {
    btnLogout.onclick = function() {
      cerrarSesion();
      closeDrawer();
    };
    btnLogout.style.zIndex = 4000;
  }
  // Los event listeners de backup se moverán a mostrarApp() para que funcionen después del login
  // Refuerzo: sidebar y overlay ocultos al cargar
  if (drawer) {
    drawer.classList.remove('drawer-visible');
    drawer.classList.add('drawer-oculto');
  }
  if (overlay) {
    overlay.classList.remove('drawer-overlay-visible');
    overlay.classList.add('drawer-overlay-oculto');
  }
});

// PWA: registrar service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js');
  });
}

function mostrarPantallaUltimosTurnos() {
  const mainHeader = document.getElementById('main-header-fijo');
  const mainApp = document.getElementById('main-app');
  const consultaDiv = document.getElementById('consulta-principal');
  const btnFinalizar = document.getElementById('finalizar-dia');
  const tablaTurnos = document.getElementById('tabla-turnos-recientes-container');
  const footer = document.getElementById('footer-app');
  
  // Oculto todo lo que no corresponde
  if (mainHeader) mainHeader.style.display = 'none';
  if (mainApp) mainApp.style.display = '';
  if (btnFinalizar) btnFinalizar.style.display = 'none';
  if (tablaTurnos) tablaTurnos.style.display = 'none';
  if (footer) footer.style.display = '';
  
  // Crear dashboard atractivo
  let html = `
    <div id='dashboard-container' style='max-width:600px;margin:2rem auto 2rem auto;padding:0 1rem;position:relative;z-index:2100;'>

      
      <!-- Botón Iniciar Turno -->
      <div style='text-align:center;margin-bottom:3rem;'>
        <button id='btn-iniciar-turno-dashboard' style='padding:1.8rem 4rem;background:linear-gradient(135deg, #4CAF50 0%, #45a049 100%);color:#fff;border:none;border-radius:20px;font-size:1.6rem;font-weight:bold;cursor:pointer;box-shadow:0 8px 25px rgba(76,175,80,0.4);transition:all 0.3s ease;transform:translateY(0);min-width:280px;'>
          🚗 Iniciar Turno
        </button>
      </div>
      
      <!-- Estadísticas del Mes -->
      <div class='estadisticas-grid' style='display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:1.5rem;margin-bottom:2rem;'>
        ${generarEstadisticasMes()}
      </div>
      
      <!-- Resumen Rápido -->
      <div class='resumen-rapido' style='background:#fff;padding:1.5rem;border-radius:15px;box-shadow:0 4px 20px rgba(0,0,0,0.08);'>
        <h3 style='margin:0 0 1rem 0;color:#333;font-size:1.2rem;'>Últimos Turnos</h3>
        <div class='resumen-grid' style='display:grid;grid-template-columns:repeat(auto-fit, minmax(120px, 1fr));gap:1rem;text-align:center;'>
          ${generarResumenRapido()}
        </div>
      </div>
    </div>
  `;
  
  if (consultaDiv) {
    consultaDiv.innerHTML = html;
    consultaDiv.style.display = '';
  }
  
  setTimeout(() => {
    const btnIniciar = document.getElementById('btn-iniciar-turno-dashboard');
    if (btnIniciar) btnIniciar.onclick = iniciarTurno;
  }, 0);
}

// Función para generar estadísticas del mes actual
function generarEstadisticasMes() {
  const turnos = getTurnos().filter(t => t.fin);
  const mesActual = new Date().getMonth();
  const añoActual = new Date().getFullYear();
  
  const turnosMes = turnos.filter(t => {
    const fechaTurno = new Date(t.inicio);
    return fechaTurno.getMonth() === mesActual && fechaTurno.getFullYear() === añoActual;
  });
  
  const totalMes = turnosMes.reduce((sum, t) => {
    return sum + t.importes.reduce((a, b) => a + (typeof b === 'object' ? b.valor : b), 0);
  }, 0);
  
  const viajesMes = turnosMes.reduce((sum, t) => sum + t.importes.length, 0);
  const turnosMesCount = turnosMes.length;
  
  return `
    <div style='background:linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);padding:1.5rem;border-radius:15px;color:#fff;text-align:center;box-shadow:0 4px 20px rgba(255,154,158,0.3);'>
      <div style='font-size:2.5rem;font-weight:bold;margin-bottom:0.5rem;'>$${formatearImporte(totalMes)}</div>
      <div style='font-size:1rem;opacity:0.9;'>Facturación del Mes</div>
    </div>
    
    <div style='background:linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);padding:1.5rem;border-radius:15px;color:#333;text-align:center;box-shadow:0 4px 20px rgba(168,237,234,0.3);'>
      <div style='font-size:2.5rem;font-weight:bold;margin-bottom:0.5rem;color:#2c3e50;'>${viajesMes}</div>
      <div style='font-size:1rem;opacity:0.8;color:#34495e;'>Viajes del Mes</div>
    </div>
    
    <div style='background:linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);padding:1.5rem;border-radius:15px;color:#333;text-align:center;box-shadow:0 4px 20px rgba(255,236,210,0.3);'>
      <div style='font-size:2.5rem;font-weight:bold;margin-bottom:0.5rem;color:#e67e22;'>${turnosMesCount}</div>
      <div style='font-size:1rem;opacity:0.8;color:#d35400;'>Turnos del Mes</div>
    </div>
  `;
}

// Función para mostrar el manual de usuario
function mostrarManualUsuario() {
  // Cerrar el menú automáticamente
  cerrarMenu();
  
  const consultaDiv = document.getElementById('consulta-principal');
  if (!consultaDiv) return;
  
  let html = `
    <div style='max-width:800px;margin:0 auto;padding:2rem 1rem;'>
      <div style='text-align:center;margin-bottom:2rem;'>
        <h1 style='color:#007bff;margin:0 0 1rem 0;font-size:2.2rem;'>📖 Manual de Usuario</h1>
        <p style='color:#666;margin:0;font-size:1.1rem;'>Guía completa de la aplicación Control Choferes</p>
      </div>
      
      <div style='background:#fff;border-radius:15px;box-shadow:0 4px 20px rgba(0,0,0,0.08);overflow:hidden;'>
        <div style='background:linear-gradient(135deg, #007bff 0%, #0056b3 100%);color:#fff;padding:1.5rem;text-align:center;'>
          <h2 style='margin:0;font-size:1.5rem;font-weight:600;'>🚗 Control Choferes - Versión 2.0</h2>
        </div>
        
        <div style='padding:2rem;max-height:70vh;overflow-y:auto;'>
          <div style='margin-bottom:2rem;'>
            <h3 style='color:#007bff;font-size:1.3rem;margin-bottom:1rem;'>🎯 ¿Qué es la app?</h3>
            <p style='color:#333;line-height:1.6;margin-bottom:1rem;'>Es una aplicación para remiseros que permite llevar el control de los importes de cada viaje, agrupados por turnos personalizados. Funciona offline y puede instalarse como app nativa.</p>
          </div>
          
          <div style='margin-bottom:2rem;'>
            <h3 style='color:#007bff;font-size:1.3rem;margin-bottom:1rem;'>📱 Funcionalidades Principales</h3>
            <ul style='color:#333;line-height:1.6;padding-left:1.5rem;'>
              <li style='margin-bottom:0.5rem;'><strong>Dashboard:</strong> Estadísticas mensuales y botón para iniciar turnos</li>
              <li style='margin-bottom:0.5rem;'><strong>Gestión de Turnos:</strong> Iniciar, agregar importes y finalizar turnos</li>
              <li style='margin-bottom:0.5rem;'><strong>Consultas:</strong> Ver historial, filtrar por fecha o rango</li>
              <li style='margin-bottom:0.5rem;'><strong>PDFs:</strong> Generar reportes de consultas y turnos específicos</li>
              <li style='margin-bottom:0.5rem;'><strong>Backup:</strong> Respaldo y restauración de datos</li>
              <li style='margin-bottom:0.5rem;'><strong>Modo Oscuro:</strong> Tema personalizable para mejor visualización</li>
            </ul>
          </div>
          
          <div style='margin-bottom:2rem;'>
            <h3 style='color:#007bff;font-size:1.3rem;margin-bottom:1rem;'>⚡ Uso Rápido</h3>
            <div style='background:#f8f9ff;padding:1.5rem;border-radius:10px;border-left:4px solid #007bff;'>
              <ol style='color:#333;line-height:1.6;padding-left:1.5rem;margin:0;'>
                <li style='margin-bottom:0.5rem;'>Inicia sesión o regístrate</li>
                <li style='margin-bottom:0.5rem;'>Desde el dashboard, pulsa "Iniciar Turno"</li>
                <li style='margin-bottom:0.5rem;'>Agrega importes de cada viaje</li>
                <li style='margin-bottom:0.5rem;'>Finaliza el turno cuando termines</li>
                <li style='margin-bottom:0.5rem;'>Consulta tu historial desde el menú</li>
              </ol>
            </div>
          </div>
          
          <div style='margin-bottom:2rem;'>
            <h3 style='color:#007bff;font-size:1.3rem;margin-bottom:1rem;'>🔧 Características Técnicas</h3>
            <div style='display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;'>
              <div style='background:#e3f2fd;padding:1rem;border-radius:8px;text-align:center;'>
                <div style='font-size:1.5rem;margin-bottom:0.5rem;'>📱</div>
                <div style='font-weight:600;color:#1565c0;'>PWA</div>
                <div style='font-size:0.9rem;color:#666;'>Instalable como app</div>
              </div>
              <div style='background:#e8f5e8;padding:1rem;border-radius:8px;text-align:center;'>
                <div style='font-size:1.5rem;margin-bottom:0.5rem;'>🌐</div>
                <div style='font-weight:600;color:#2e7d32;'>Offline</div>
                <div style='font-size:0.9rem;color:#666;'>Funciona sin internet</div>
              </div>
              <div style='background:#fff3e0;padding:1rem;border-radius:8px;text-align:center;'>
                <div style='font-size:1.5rem;margin-bottom:0.5rem;'>📊</div>
                <div style='font-weight:600;color:#f57c00;'>PDFs</div>
                <div style='font-size:0.9rem;color:#666;'>Reportes profesionales</div>
              </div>
            </div>
          </div>
          
          <div style='margin-bottom:2rem;'>
            <h3 style='color:#007bff;font-size:1.3rem;margin-bottom:1rem;'>❓ ¿Necesitas Ayuda?</h3>
            <p style='color:#333;line-height:1.6;'>Para soporte técnico o sugerencias, contacta al desarrollador desde el pie de la aplicación.</p>
          </div>
        </div>
      </div>
      
      <div style='text-align:center;margin-top:2rem;'>
        <button id='btn-cerrar-manual' style='padding:1rem 2rem;background:linear-gradient(135deg, #6c757d 0%, #5a6268 100%);color:#fff;border:none;border-radius:8px;font-size:1.1rem;font-weight:600;cursor:pointer;box-shadow:0 4px 15px rgba(108,117,125,0.3);transition:all 0.3s ease;'>
          ✖ Cerrar Manual
        </button>
        </div>
      </div>
    </div>
    
    <style>
      /* Estilos para el modal del manual */
      #consulta-principal {
        background: #f4f8f9;
      }
      
      /* Modo dark para el manual */
      body.dark-mode #consulta-principal {
        background: #181c22;
      }
      
      body.dark-mode .manual-container {
        background: #23272f !important;
        color: #e0e0e0 !important;
      }
      
      body.dark-mode .manual-container h3 {
        color: #90caf9 !important;
      }
      
      body.dark-mode .manual-container p,
      body.dark-mode .manual-container li {
        color: #e0e0e0 !important;
      }
      
      body.dark-mode .manual-container .feature-card {
        background: #2c3e50 !important;
        color: #e0e0e0 !important;
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .manual-container {
          padding: 1rem !important;
        }
        
        .manual-container h1 {
          font-size: 1.8rem !important;
        }
        
        .manual-container h2 {
          font-size: 1.3rem !important;
        }
      }
    </style>
  `;
  
  consultaDiv.innerHTML = html;
  consultaDiv.style.display = '';
  
  // Event listener para cerrar el manual
  setTimeout(() => {
    const btnCerrar = document.getElementById('btn-cerrar-manual');
    if (btnCerrar) {
      btnCerrar.onclick = function() {
        consultaDiv.style.display = 'none';
        // Volver al dashboard o pantalla anterior
        const turnoActivo = getTurnoActivo();
        if (turnoActivo) {
          mostrarTurnoActivo();
        } else {
          mostrarDashboard();
        }
      };
    }
  }, 0);
}

// Función para mostrar el turno activo
function mostrarTurnoActivo() {
  // Ocultar la consulta y mostrar la pantalla principal
  const consultaDiv = document.getElementById('consulta-principal');
  if (consultaDiv) consultaDiv.style.display = 'none';
  
  // Ocultar el footer ya que el turno activo se muestra en main-app
  const footer = document.getElementById('footer-app');
  if (footer) footer.style.display = 'none';
  
  // Llamar a render para mostrar el turno activo
  render();
}

// Función para mostrar el dashboard
function mostrarDashboard() {
  // Ocultar la consulta y mostrar el dashboard
  const consultaDiv = document.getElementById('consulta-principal');
  if (consultaDiv) consultaDiv.style.display = 'none';
  
  // Llamar a la función del dashboard
  mostrarPantallaUltimosTurnos();
}

// Función para generar resumen rápido
function generarResumenRapido() {
  const turnos = getTurnos().filter(t => t.fin);
  const turnosRecientes = turnos.slice(-3).reverse();
  
  if (turnosRecientes.length === 0) {
    return '<div style="grid-column:1/-1;text-align:center;color:#888;padding:1rem;">No hay turnos recientes</div>';
  }
  
  return turnosRecientes.map(t => {
    const inicioDate = new Date(t.inicio);
    const cantidad = t.importes.length;
    const total = t.importes.reduce((a, b) => a + (typeof b === 'object' ? b.valor : b), 0);
    
    return `
      <div class='resumen-item' style='background:#f8f9fa;padding:1rem;border-radius:10px;border-left:4px solid #007bff;'>
        <div class='fecha' style='font-weight:bold;color:#007bff;font-size:0.9rem;'>${inicioDate.toLocaleDateString('es-AR')}</div>
        <div class='viajes' style='color:#666;font-size:0.8rem;margin-top:0.3rem;'>${cantidad} viajes</div>
        <div class='total' style='color:#28a745;font-weight:bold;font-size:0.9rem;margin-top:0.3rem;'>$${formatearImporte(total)}</div>
      </div>
    `;
  }).join('');
}
