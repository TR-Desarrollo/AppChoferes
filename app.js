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
  location.reload();
}
function mostrarApp() {
  const mainApp = document.getElementById('main-app');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  if (mainApp) mainApp.style.display = '';
  if (sidebar) sidebar.style.display = '';
  if (menuToggle) menuToggle.style.display = '';
}
function ocultarApp() {
  const mainApp = document.getElementById('main-app');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  if (mainApp) mainApp.style.display = 'none';
  if (sidebar) sidebar.style.display = 'none';
  if (menuToggle) menuToggle.style.display = 'none';
}
// --- Eventos de login/registro ---
window.addEventListener('DOMContentLoaded', function() {
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
  const btnLogout = document.getElementById('btn-logout');
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
}

function agregarImporteATurno(valor, tipo = 'Efectivo') {
  const turnos = getTurnos();
  const idx = turnos.findIndex(t => !t.fin);
  if (idx !== -1) {
    const ahora = new Date();
    turnos[idx].importes.push({ valor, hora: ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), tipo });
    saveTurnos(turnos);
  }
}

function renderEstadoTurno() {
  const estadoDiv = document.getElementById('estado-turno');
  const turno = getTurnoActivo();
  if (turno) {
    const inicio = new Date(turno.inicio);
    estadoDiv.innerHTML = `<b>Turno en curso:</b> ${inicio.toLocaleString('es-AR')}`;
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
    form.style.display = '';
    resumen.style.display = '';
    lista.style.display = '';
    btnFinalizar.style.display = 'block';
    tablaTurnos.innerHTML = '';
    if (btnIniciar) btnIniciar.style.display = 'none';
    // Render importes
    lista.innerHTML = '';
    let total = 0;
    let importes = turno.importes;
    importes.slice().reverse().forEach((imp, idx) => {
      total += (typeof imp === 'object' ? imp.valor : imp);
      const li = document.createElement('li');
      if (typeof imp === 'object') {
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
    form.style.display = 'none';
    resumen.style.display = 'none';
    lista.style.display = 'none';
    btnFinalizar.style.display = 'none';
    if (btnIniciar) btnIniciar.style.display = 'block';
    // Mover la tabla justo debajo del botón Iniciar Turno
    headerFijo.appendChild(tablaTurnos);
    renderTablaTurnosRecientes();
  }
  // Si hay turno activo, la tabla vuelve a su lugar original
  if (turno) {
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
  li.innerHTML = `<input type='number' id='edit-importe' value='${valorOriginal}' style='width:100%;height:2.5rem;font-size:1.15rem;text-align:right;margin-bottom:0.5rem;'>
    <select id='edit-tipo' style='width:100%;height:2.5rem;font-size:1.15rem;margin-bottom:0.5rem;'>
      <option value='Efectivo' ${tipoOriginal==='Efectivo'?'selected':''}>Efectivo</option>
      <option value='Transferencia' ${tipoOriginal==='Transferencia'?'selected':''}>Transferencia</option>
      <option value='Vale' ${tipoOriginal==='Vale'?'selected':''}>Vale</option>
    </select>
    <button id='guardar-edit' style='width:100%;background:#43a047;color:#fff;border:none;border-radius:6px;padding:0.7rem 0;font-size:1.15rem;margin-bottom:0.3rem;'>✔ Guardar</button>
    <button id='cancelar-edit' style='width:100%;background:#ff5252;color:#fff;border:none;border-radius:6px;padding:0.7rem 0;font-size:1.15rem;'>✖ Cancelar</button>`;
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
      <td data-label="Inicio">${inicioDate.toLocaleString('es-AR')}</td>
      <td data-label="Fin">${finDate ? finDate.toLocaleString('es-AR') : '-'}</td>
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
  return Number.isInteger(valor)
    ? valor.toLocaleString('es-AR')
    : valor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

// Mostrar viajes históricos en una sola tabla continua
function mostrarViajesHistoricos(turnos) {
  let viajes = [];
  turnos.forEach((t, idx) => {
    t.importes.forEach((imp, i) => {
      viajes.push({
        valor: typeof imp === 'object' ? imp.valor : imp,
        turno: new Date(t.inicio).toLocaleString('es-AR'),
        idxTurno: idx + 1
      });
    });
  });
  // Ordenar por turno
  viajes.sort((a, b) => a.turno.localeCompare(b.turno));
  let totalImportes = viajes.reduce((acc, v) => acc + v.valor, 0);
  let totalViajes = viajes.length;
  let html = `<div id='consulta-tabla-scroll' style='max-height:440px;overflow-y:auto;box-sizing:border-box;'>
    <table style="width:100%;border-collapse:collapse;text-align:center;">
      <thead>
        <tr style="background:#f0f8ff;">
          <th style='padding:6px 2px;border:1px solid #ccc;'>N°</th>
          <th style='padding:6px 2px;border:1px solid #ccc;'>Importe</th>
          <th style='padding:6px 2px;border:1px solid #ccc;'>Turno</th>
        </tr>
      </thead>
      <tbody>`;
  viajes.forEach((v, i) => {
    html += `<tr>
      <td style='padding:6px 2px;border:1px solid #ccc;'>${i + 1}</td>
      <td style='padding:6px 2px;border:1px solid #ccc;text-align:right;'>$${formatearImporte(v.valor)}</td>
      <td style='padding:6px 2px;border:1px solid #ccc;'>${v.turno}</td>
    </tr>`;
  });
  html += `</tbody></table></div>
    <div style='margin-top:1.2rem;font-size:1.15rem;font-weight:bold;text-align:right;'>
      Total de viajes: <span style='color:#43a047;'>${totalViajes}</span> &nbsp; | &nbsp; Total importes: <span style='color:#007bff;'>$${formatearImporte(totalImportes)}</span>
    </div>`;
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
    if (!fecha) {
      mostrarResultadoConsulta('Selecciona una fecha.');
      return;
    }
    const turnos = getTurnos().filter(t => t.inicio.startsWith(fecha));
    if (turnos.length === 0) {
      mostrarResultadoConsulta('No hay turnos para ese día.');
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
      mostrarResultadoConsulta('Selecciona un rango válido.');
      return;
    }
    const turnos = getTurnos().filter(t => t.inicio.slice(0, 10) >= desde && t.inicio.slice(0, 10) <= hasta);
    if (turnos.length === 0) {
      mostrarResultadoConsulta('No hay turnos en ese rango.');
      return;
    }
    const tabla = mostrarViajesHistoricos(turnos);
    mostrarResultadoConsulta(tabla);
  });
}

function mostrarResultadoConsulta(html) {
  // Cerrar el sidebar si está abierto
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('sidebar-visible');
    sidebar.classList.add('sidebar-oculto');
    overlay.classList.remove('sidebar-overlay-visible');
    overlay.classList.add('sidebar-overlay-oculto');
    document.body.style.overflow = '';
  }
  // Mostrar resultado en la pantalla principal
  const consultaDiv = document.getElementById('consulta-principal');
  const mainHeader = document.getElementById('main-header-fijo');
  const tablaTurnos = document.getElementById('tabla-turnos-recientes-container');
  const finalizarBtn = document.getElementById('finalizar-dia');
  if (consultaDiv) {
    consultaDiv.innerHTML = `
      <div id='consulta-resultado-contenido' style='background:#f9f9f9;padding:1.2rem 0.7rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);'>
        <h2 style='text-align:center;color:#007bff;margin-top:0;'>Resultado de la consulta</h2>
        <div style='margin-top:1.2rem;'>${html}</div>
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
    // Botón volver
    const volverBtn = document.getElementById('volver-principal');
    if (volverBtn) {
      volverBtn.addEventListener('click', function() {
        consultaDiv.style.display = 'none';
        if (mainHeader) mainHeader.style.display = '';
        if (tablaTurnos) tablaTurnos.style.display = '';
        // Solo mostrar el botón finalizar si hay turno activo
        const turno = getTurnoActivo();
        if (finalizarBtn) finalizarBtn.style.display = turno ? '' : 'none';
      });
    }
    // Botón descargar PDF
    const pdfBtn = document.getElementById('descargar-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', function() {
        generarPDFConsulta();
      });
    }
  }
}

// PDF: tabla histórica igual que en pantalla
function generarPDFConsulta() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const contenido = document.getElementById('consulta-resultado-contenido');
  const fechaGen = new Date().toLocaleString('es-AR');
  // Título y encabezado
  doc.setFontSize(18);
  doc.text('ControlChoferes - Consulta', 105, 15, { align: 'center' });
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
    const body = Array.from(tabla.querySelectorAll('tbody tr')).map(tr => {
      const celdas = Array.from(tr.querySelectorAll('td'));
      if (celdas[1]) {
        let valor = celdas[1].innerText.replace(/[^\d,\.]/g, '').replace(',', '.');
        totalImportes += parseFloat(valor) || 0;
      }
      totalViajes++;
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
    doc.setFontSize(12);
    doc.setTextColor(67, 160, 71);
    doc.text(`Total de viajes: ${totalViajes}`, 120, y);
    doc.setTextColor(33, 150, 243);
    doc.text(`Total importes: $${formatearImporte(totalImportes)}`, 120, y + 8);
    doc.setTextColor(0,0,0);
  } else if (contenido) {
    let text = contenido.innerText.replace(/\n{2,}/g, '\n');
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 15, y + 5);
  }
  doc.save('consulta.pdf');
}

// Mostrar tabla de turnos recientes (para el botón Ver Turnos)
function mostrarTurnosRecientes() {
  const turnos = getTurnos().filter(t => t.fin);
  if (turnos.length === 0) {
    mostrarResultadoConsulta('No hay turnos registrados.');
    return;
  }
  let html = `<div id='consulta-tabla-scroll' style='max-height:440px;overflow-y:auto;box-sizing:border-box;'>
    <table style="width:100%;border-collapse:collapse;text-align:center;">
      <thead>
        <tr style="background:#f0f8ff;">
          <th style='padding:6px 2px;border:1px solid #ccc;'>Inicio</th>
          <th style='padding:6px 2px;border:1px solid #ccc;'>Fin</th>
          <th style='padding:6px 2px;border:1px solid #ccc;'>Viajes</th>
          <th style='padding:6px 2px;border:1px solid #ccc;'>Total</th>
        </tr>
      </thead>
      <tbody>`;
  turnos.reverse().forEach((t) => {
    const inicioDate = new Date(t.inicio);
    const finDate = t.fin ? new Date(t.fin) : null;
    const cantidad = t.importes.length;
    const total = t.importes.reduce((a, b) => a + (typeof b === 'object' ? b.valor : b), 0);
    html += `<tr>
      <td style="padding:6px;border:1px solid #ccc;">${inicioDate.toLocaleString('es-AR')}</td>
      <td style="padding:6px;border:1px solid #ccc;">${finDate ? finDate.toLocaleString('es-AR') : '-'}</td>
      <td style="padding:6px;border:1px solid #ccc;">${cantidad}</td>
      <td style="padding:6px;border:1px solid #ccc;text-align:right;">$${formatearImporte(total)}</td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  mostrarResultadoConsulta(html);
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
  document.body.classList.toggle('dark-mode', dark);
  const switchDark = document.getElementById('switch-dark');
  if (switchDark) switchDark.checked = dark;
}

// Backup y restaurar datos (ajustar para usuario)
function descargarBackup() {
  const turnos = localStorage.getItem(getTurnosKey()) || '[]';
  const blob = new Blob([turnos], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'backup-turnos.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function restaurarBackup(archivo) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data) && data.length > 0 && data[0].inicio && data[0].importes) {
        if (confirm('¿Seguro que quieres reemplazar todos los turnos actuales por este backup?')) {
          localStorage.setItem(getTurnosKey(), JSON.stringify(data));
          render();
          alert('Backup restaurado correctamente.');
        }
      } else {
        alert('El archivo no es un backup válido.');
      }
    } catch (err) {
      alert('El archivo no es un JSON válido.');
    }
  };
  reader.readAsText(archivo);
}

window.addEventListener('DOMContentLoaded', function() {
  // cargarTurnosPrueba(); // <-- Comentado para no borrar ni sobreescribir datos reales
  renderFecha();
  render();
  aplicarModoDark();
  // Switch dark/white
  const switchDark = document.getElementById('switch-dark');
  if (switchDark) {
    switchDark.addEventListener('change', function() {
      localStorage.setItem('modo-dark', switchDark.checked ? '1' : '0');
      aplicarModoDark();
    });
  }

  // Sidebar menú oculto en móvil
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  function abrirSidebar() {
    if (sidebar && overlay) {
      sidebar.classList.remove('sidebar-oculto');
      sidebar.classList.add('sidebar-visible');
      overlay.classList.remove('sidebar-overlay-oculto');
      overlay.classList.add('sidebar-overlay-visible');
      document.body.style.overflow = 'hidden';
    }
  }

  function cerrarSidebar() {
    if (sidebar && overlay) {
      sidebar.classList.remove('sidebar-visible');
      sidebar.classList.add('sidebar-oculto');
      overlay.classList.remove('sidebar-overlay-visible');
      overlay.classList.add('sidebar-overlay-oculto');
      document.body.style.overflow = '';
    }
  }

  if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener('click', abrirSidebar);
    overlay.addEventListener('click', cerrarSidebar);
  }

  // Backup/restore listeners
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
  // Botón cerrar sesión al final del sidebar
  let btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.onclick = cerrarSesion;
  }
});

// PWA: registrar service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js');
  });
}
