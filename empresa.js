/* =====================================================
   KLOZ - EMPRESA.JS
   ZONA MODIFICABLE: LOGICA DEL DASHBOARD DE EMPRESA
   ===================================================== */

let empresaData = {
    nombre: "",
    industria: "",
    descripcion: "",
    pais: "",
    ciudad: "",
    comision: 8,
    ticketPromedio: 5000,
    whatsapp: "",
    email: "",
    contacto: "",
    web: "",
    tokens: 0,
    unlockedClosers: []
};
const TKN_COSTS = { "Master": 5, "Senior": 3, "Junior": 2, "Rookie": 1 };
const MIN_COMMS = { "Master": 15, "Senior": 10, "Junior": 5, "Rookie": 0 };

let paginaClosers = 1;
const closersPorPagina = 4;
let filtroRangoClosers = 'todos';

(function() {
    const saved = localStorage.getItem('k_empresa_profile');
    if (saved) { try { empresaData = JSON.parse(saved); } catch(e) {} }
})();

function abrirDashboardEmpresa() {
    const dashC = document.getElementById('dashboard-closer');
    const dashE = document.getElementById('dashboard-empresa');
    if (!dashE) return;
    
    dashC.style.transform = 'translateX(0%)';
    setTimeout(() => { dashC.style.display = 'none'; }, 850);
    
    dashE.style.display = 'flex';
    setTimeout(() => { dashE.style.transform = 'translateY(-100%)'; }, 50);
    
    actualizarBotonRegistro();
    mostrarVistaEmpresas();
}

function actualizarBotonRegistro() {
    const btn = document.getElementById('btn-registrar-empresa');
    if (!btn) return;
    
    if (empresaData && empresaData.nombre) {
        btn.textContent = 'MI EMPRESA';
    } else {
        btn.textContent = 'REGISTRAR MI EMPRESA';
    }
}

function mostrarMiEmpresa() {
    const v = document.getElementById('spa-empresa-content');
    if (!v) return;
    
    if (!empresaData.nombre) {
        mostrarRegistroEmpresa();
        return;
    }
    
    v.innerHTML = `
        <div style="max-width:700px;width:100%;">
            <button class="empresa-nav-btn" onclick="mostrarVistaEmpresas()" style="margin-bottom:24px;">&larr; VOLVER AL CATALOGO</button>
            
            <div class="closer-card" style="cursor:default;">
                <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:24px;align-items:center;">
                    <div class="empresa-logo-letra" style="width:80px;height:80px;font-size:2.2rem;background:#d4af37;color:#000;">
                        ${empresaData.nombre.charAt(0)}
                    </div>
                    <div>
                        <h2 style="font-size:1.8rem;margin:0 0 8px;">${empresaData.nombre}</h2>
                        <p style="color:#888;margin:0;">${empresaData.industria} â€¢ ${empresaData.ciudad}, ${empresaData.pais}</p>
                    </div>
                </div>
                
                <div style="background:rgba(255,255,255,0.04);padding:20px;border-radius:8px;margin-bottom:24px;">
                    <h4 style="margin:0 0 12px;color:#d4af37;font-size:0.8rem;letter-spacing:2px;">DESCRIPCION</h4>
                    <p style="margin:0;font-size:0.95rem;line-height:1.6;">${empresaData.descripcion}</p>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:24px;">
                    <div class="stat-chip" style="background:rgba(212,175,55,0.1);color:#d4af37;">
                        <strong>${empresaData.comision}%</strong> Comision
                    </div>
                    <div class="stat-chip" style="background:rgba(212,175,55,0.1);color:#d4af37;">
                        <strong>$${empresaData.ticketPromedio}</strong> Ticket Promedio
                    </div>
                </div>
                
                <div style="background:rgba(255,255,255,0.04);padding:20px;border-radius:8px;margin-bottom:24px;">
                    <h4 style="margin:0 0 12px;color:#d4af37;font-size:0.8rem;letter-spacing:2px;">DATOS DE CONTACTO</h4>
                    <p style="margin:0 0 8px;font-size:0.95rem;"><strong>Contacto:</strong> ${empresaData.contacto}</p>
                    <p style="margin:0 0 8px;font-size:0.95rem;"><strong>Email:</strong> ${empresaData.email}</p>
                    <p style="margin:0 0 8px;font-size:0.95rem;"><strong>WhatsApp:</strong> ${empresaData.whatsapp}</p>
                    ${empresaData.web ? `<p style="margin:0;font-size:0.95rem;"><strong>Web:</strong> <a href="${empresaData.web}" target="_blank" style="color:#d4af37;">${empresaData.web}</a></p>` : ''}
                </div>
                
                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                    <button class="btn-empresa btn-empresa-solid" onclick="mostrarRegistroEmpresa()">EDITAR DATOS</button>
                    <button class="btn-empresa" style="border-color:#e67e22; color:#e67e22;" onclick="simularNuevoMes()">SIMULAR NUEVO MES (PAGAR $70)</button>
                </div>
            </div>
        </div>`;
    
    v.scrollTop = 0;
}

function cerrarDashboardEmpresa() {
    const dashE = document.getElementById('dashboard-empresa');
    const sel = document.getElementById('selector-rol');
    if (!dashE) return;
    
    dashE.style.transform = 'translateY(0%)';
    setTimeout(() => { dashE.style.display = 'none'; }, 850);
    
    sel.style.display = 'flex';
    setTimeout(() => { sel.style.transform = 'translateX(0%)'; }, 50);
}

function mostrarVistaEmpresas() {
    const v = document.getElementById('spa-empresa-content');
    if (!v) return;
    
    const closersFiltrados = KlozDB.getClosers().filter(c => {
        return filtroRangoClosers === 'todos' || c.rango === filtroRangoClosers;
    });
    
    const totalPaginas = Math.ceil(closersFiltrados.length / closersPorPagina);
    const inicio = (paginaClosers - 1) * closersPorPagina;
    const closersPagina = closersFiltrados.slice(inicio, inicio + closersPorPagina);
    
    v.innerHTML = `
        <div style="max-width:900px;width:100%;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;flex-wrap:wrap;gap:16px;">
                <div style="display:flex; flex-direction:column;">
                    <h1 style="font-size:2rem;margin:0;">CatÃ¡logo de Closers</h1>
                    <div style="background:rgba(212,175,55,0.15); border:1px solid #d4af37; padding:4px 12px; border-radius:4px; display:inline-block; margin-top:8px; align-self:flex-start;">
                        <span style="color:#d4af37; font-weight:900; letter-spacing:1px; font-size:0.8rem;">TOKEN BALANCE: ${empresaData.tokens || 0}</span>
                    </div>
                </div>
                <div class="filtros-bar" style="margin-bottom:0;">
                    <span class="filtro-label">FILTRAR:</span>
                    <select class="filtro-select" onchange="filtrarClosers()">
                        <option value="todos" ${filtroRangoClosers === 'todos' ? 'selected' : ''}>Todos los rangos</option>
                        <option value="Master" ${filtroRangoClosers === 'Master' ? 'selected' : ''}>Master</option>
                        <option value="Senior" ${filtroRangoClosers === 'Senior' ? 'selected' : ''}>Senior</option>
                        <option value="Junior" ${filtroRangoClosers === 'Junior' ? 'selected' : ''}>Junior</option>
                        <option value="Rookie" ${filtroRangoClosers === 'Rookie' ? 'selected' : ''}>Rookie</option>
                    </select>
                </div>
            </div>
            
            <div id="closers-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;">
                ${closersPagina.map(c => renderizarCloserCard(c)).join('')}
            </div>
            
            ${totalPaginas > 1 ? `
            <div style="display:flex;justify-content:center;gap:16px;margin-top:32px;align-items:center;">
                <button class="empresa-nav-btn" onclick="cambiarPaginaClosers(-1)" ${paginaClosers === 1 ? 'disabled style="opacity:0.3"' : ''}>&larr; ANTERIOR</button>
                <span style="font-size:0.85rem;font-weight:700;">${paginaClosers} / ${totalPaginas}</span>
                <button class="empresa-nav-btn" onclick="cambiarPaginaClosers(1)" ${paginaClosers === totalPaginas ? 'disabled style="opacity:0.3"' : ''}>SIGUIENTE &rarr;</button>
            </div>
            ` : ''}
        </div>`;
    
    v.scrollTop = 0;
}

function cambiarPaginaClosers(direccion) {
    const closersFiltrados = KlozDB.getClosers().filter(c => {
        return filtroRangoClosers === 'todos' || c.rango === filtroRangoClosers;
    });
    const totalPaginas = Math.ceil(closersFiltrados.length / closersPorPagina);
    paginaClosers += direccion;
    if (paginaClosers < 1) paginaClosers = 1;
    if (paginaClosers > totalPaginas) paginaClosers = totalPaginas;
    mostrarVistaEmpresas();
}

function filtrarClosers() {
    paginaClosers = 1;
    filtroRangoClosers = document.querySelector('.filtro-select').value;
    mostrarVistaEmpresas();
}

function renderizarCloserCard(c) {
    const rangoClass = `rango-${c.rango}`;
    return `
        <div class="closer-card" data-rango="${c.rango}" onclick="abrirDetalleCloser('${c.id}')">
            <div style="display:flex;gap:16px;align-items:flex-start;">
                <div class="empresa-logo-letra" style="background:${c.rango === 'Master' ? '#d4af37' : c.rango === 'Senior' ? '#888' : '#555'};color:${c.rango === 'Master' ? '#000' : '#fff'};">
                    ${c.nombre.charAt(0)}
                </div>
                <div style="flex:1;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                        <div>
                            <h3 style="font-size:1.1rem;margin:0 0 4px;">${c.nombre}</h3>
                            <span class="rango-badge ${rangoClass}">${c.rango}</span>
                        </div>
                    </div>
                    <p style="font-size:0.85rem;color:#888;margin:0 0 8px;">${c.especialidad} â€¢ ${c.ciudad}, ${c.pais}</p>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <span class="stat-chip">${c.cierre}% cierre</span>
                        <span class="stat-chip">$${c.ticket} ticket</span>
                    </div>
                </div>
            </div>
        </div>`;
}

function abrirDetalleCloser(id) {
    if (!empresaData.nombre) {
        mostrarToast("Debes registrar tu empresa (Auditoría) para poder contactar y ver detalles confidenciales de los Closers", false);
        setTimeout(() => mostrarRegistroEmpresa(), 1800);
        return;
    }
    const c = KlozDB.getClosers().find(x => x.id === id);
    if (!c) return;
    
    const v = document.getElementById('spa-empresa-content');
    const rangoClass = `rango-${c.rango}`;
    
    v.innerHTML = `
        <div style="max-width:700px;width:100%;">
            <button class="empresa-nav-btn" onclick="mostrarVistaEmpresas()" style="margin-bottom:24px;">&larr; VOLVER AL CATALOGO</button>
            
            <div class="closer-card" style="cursor:default;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <div style="background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.4); border-radius:6px; padding:6px 12px; display:inline-block; font-size:0.75rem; font-weight:800; color:#d4af37; letter-spacing:2px;">&#128142; CLOSER VERIFICADO KLOZ</div>
                <div style="background:#000; border:1px solid #d4af37; padding:6px 12px; border-radius:6px; font-size:0.75rem; font-weight:800; color:#d4af37;">COSTO: ${TKN_COSTS[c.rango] || 1} TOKENS</div>
            </div>
                <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:24px;">
                    <div class="empresa-logo-letra" style="width:80px;height:80px;font-size:2.2rem;background:${c.rango === 'Master' ? '#d4af37' : c.rango === 'Senior' ? '#888' : '#555'};color:${c.rango === 'Master' ? '#000' : '#fff'};">
                        ${c.nombre.charAt(0)}
                    </div>
                    <div>
                        <h2 style="font-size:1.8rem;margin:0 0 8px;">${c.nombre}</h2>
                        <span class="rango-badge ${rangoClass}" style="font-size:0.8rem;padding:6px 16px;">${c.rango}</span>
                        <p style="color:#888;margin:12px 0 0;">${c.especialidad} â€¢ ${c.ciudad}, ${c.pais}</p>
                    </div>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:24px;">
                    <div class="stat-chip" style="background:rgba(212,175,55,0.1);color:#d4af37;">
                        <strong>${c.cierre}%</strong> Tasa de Cierre
                    </div>
                    <div class="stat-chip" style="background:rgba(212,175,55,0.1);color:#d4af37;">
                        <strong>$${c.ticket}</strong> Ticket Promedio
                    </div>
                </div>
                
                <div style="background:rgba(255,255,255,0.04);padding:20px;border-radius:8px;margin-bottom:24px;">
                    <h4 style="margin:0 0 12px;color:#d4af37;font-size:0.8rem;letter-spacing:2px;">LOGROS</h4>
                    <p style="margin:0;font-size:0.95rem;line-height:1.6;">${c.logros}</p>
                </div>
                
                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                    <button class="btn-empresa btn-empresa-solid" onclick="iniciarChatEmpresa('${c.id}')">ENVIAR MENSAJE</button>
                    <button class="btn-empresa" onclick="mostrarToast('Invitacion enviada a ${c.nombre}')">ENVIAR INVITACION</button>
                </div>
            </div>
        </div>`;
    
    v.scrollTop = 0;
}

function iniciarChatEmpresa(closerId) {
    const c = KlozDB.getClosers().find(x => x.id === closerId);
    if (!c) return;

    if (!empresaData.unlockedClosers.includes(closerId)) {
        const minComm = MIN_COMMS[c.rango] || 0;
        if (empresaData.comision < minComm) {
            mostrarToast("Tu oferta de comision ("+empresaData.comision+"%) es insuficiente para el rango "+c.rango+". Minimo requerido: "+minComm+"%", false);
            return;
        }
        const cost = TKN_COSTS[c.rango] || 1;
        if (empresaData.tokens < cost) {
            mostrarToast("Tokens insuficientes ("+empresaData.tokens+"). Necesitas "+cost+" para desbloquear a este "+c.rango, false);
            return;
        }
        if (confirm("Desbloquear a "+c.nombre+" por "+cost+" tokens?")) {
            empresaData.tokens -= cost;
            empresaData.unlockedClosers.push(closerId);
            localStorage.setItem("k_empresa_profile", JSON.stringify(empresaData));
            mostrarToast("Closer desbloqueado!");
        } else {
            return;
        }
    }
    
    const v = document.getElementById('spa-empresa-content');
    v.innerHTML = `
        <div class="chat-card-empresa">
            <div class="chat-header-empresa">
                <div class="empresa-logo-letra" style="width:42px;height:42px;font-size:1.2rem;background:${c.rango === 'Master' ? '#d4af37' : '#555'};color:${c.rango === 'Master' ? '#000' : '#fff'};">
                    ${c.nombre.charAt(0)}
                </div>
                <div>
                    <div style="font-weight:800;font-size:1rem;">${c.nombre}</div>
                    <div style="font-size:0.72rem;color:rgba(255,255,255,0.5);letter-spacing:1px;">${c.rango} â€¢ ${c.especialidad}</div>
                </div>
                <button class="empresa-nav-btn" onclick="abrirDetalleCloser('${closerId}')" style="margin-left:auto;">&larr; PERFIL</button>
            </div>
            <div class="chat-body-empresa" id="chat-empresa-body">
                <div class="warning-chat" style="text-align:center;font-size:0.7rem;color:#e74c3c;padding:8px;font-weight:700;background:rgba(231,76,60,0.1);border-radius:6px;margin:0 auto 16px;max-width:80%;">&#9888; PROHIBIDO: Compartir n&uacute;meros personales. Utiliza el bot&oacute;n "MANDAR PROSPECTO" para enviar leads al Closer.</div>
                <div class="chat-msg-empresa-in">
                    <div class="chat-bubble-empresa-in">Hola! Vi tu perfil y me interesa conectar. &iquest;Est&aacute;s disponible para trabajar con nosotros?</div>
                    <div class="chat-time-empresa">${new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}</div>
                </div>
            </div>
            <div class="chat-input-empresa-bar" style="gap:8px;">
                <button class="chat-send-empresa" style="background:#555;color:#fff;font-size:0.7rem;padding:0 12px;font-weight:800;border-radius:6px;letter-spacing:1px;" onclick="abrirModalLead('${closerId}')">+ MANDAR PROSPECTO</button>
                <input type="text" id="chat-empresa-input" class="chat-input-empresa" placeholder="Escribe tu mensaje..." onkeydown="if(event.key==='Enter')enviarMensajeEmpresa()">
                <button class="chat-send-empresa" style="border-radius:6px;" onclick="enviarMensajeEmpresa()">&#10148;</button>
            </div>
        </div>`;
    
    setTimeout(() => document.getElementById('chat-empresa-input')?.focus(), 300);
}

function enviarMensajeEmpresa() {
    const input = document.getElementById('chat-empresa-input');
    const body = document.getElementById('chat-empresa-body');
    if (!input || !body) return;
    
    const texto = input.value.trim();
    if (!texto) return;
    
    input.value = '';
    
    const out = document.createElement('div');
    out.className = 'chat-msg-empresa-out';
    out.innerHTML = `<div class="chat-bubble-empresa-out">${texto}</div>
        <div class="chat-time-empresa">${new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}</div>`;
    body.appendChild(out);
    body.scrollTop = body.scrollHeight;
    enviarMensajeReal(empresaData.email, closerId, texto);
}

function mostrarRegistroEmpresa() {
    const v = document.getElementById('spa-empresa-content');
    if (!v) return;
    
    v.innerHTML = `
        <div class="form-empresa" style="max-width:600px;">
            <h1 style="text-align:center;font-size:2rem;margin:0 0 30px;">Registrar Mi Empresa</h1>
            
            <label class="label-empresa">Nombre de la Empresa *</label>
            <input type="text" id="emp-nombre" class="input-empresa" value="${empresaData.nombre || ''}" placeholder="Ej: TechSales Pro">
            
            <label class="label-empresa">Industria *</label>
            <select id="emp-industria" class="input-empresa">
                ${['Software / SaaS','Inmobiliaria','Salud y Bienestar','Educacion Financiera','Logistica','Retail','Otro'].map(i => 
                    `<option value="${i}" ${empresaData.industria===i?'selected':''}>${i}</option>`).join('')}
            </select>
            
            <label class="label-empresa">Descripcion *</label>
            <textarea id="emp-descripcion" class="input-empresa" rows="3" placeholder="Describe tu empresa y que buscas...">${empresaData.descripcion || ''}</textarea>
            
            <label class="label-empresa">Pais *</label>
            <select id="emp-pais" class="input-empresa">
                ${['Argentina','Espana','Mexico','Colombia','Chile','Uruguay','Peru','Venezuela','Otro'].map(p => 
                    `<option value="${p}" ${empresaData.pais===p?'selected':''}>${p}</option>`).join('')}
            </select>
            
            <label class="label-empresa">Ciudad *</label>
            <input type="text" id="emp-ciudad" class="input-empresa" value="${empresaData.ciudad || ''}" placeholder="Ej: Buenos Aires">
            
            <label class="label-empresa">% Comision que ofreces *</label>
            <input type="number" id="emp-comision" class="input-empresa" min="1" max="50" value="${empresaData.comision || 8}" placeholder="8">
            
            <label class="label-empresa">Ticket Promedio ($) *</label>
            <input type="number" id="emp-ticket" class="input-empresa" value="${empresaData.ticketPromedio || 5000}" placeholder="5000">
            
            <label class="label-empresa">Nombre del Contacto *</label>
            <input type="text" id="emp-contacto" class="input-empresa" value="${empresaData.contacto || ''}" placeholder="Nombre de la persona de contacto">
            
            <label class="label-empresa">Email Corporativo *</label>
            <input type="email" id="emp-email" class="input-empresa" value="${empresaData.email || ''}" placeholder="contacto@empresa.com">
            
            <label class="label-empresa">WhatsApp Corporativo *</label>
            <input type="tel" id="emp-whatsapp" class="input-empresa" value="${empresaData.whatsapp || ''}" placeholder="+54911...">
            
            <label class="label-empresa">Sitio Web (Opcional)</label>
            <input type="url" id="emp-web" class="input-empresa" value="${empresaData.web || ''}" placeholder="https://www.empresa.com">
            
            <div style="background: rgba(212,175,55,0.05); border: 1px solid rgba(212,175,55,0.3); padding: 18px; border-radius: 8px; margin-top: 30px; text-align: center;">
                <h4 style="color:#d4af37; margin:0 0 8px; font-weight:800; letter-spacing:1px; font-size:1rem;">SUSCRIPCI&Oacute;N CORPORATIVA KLOZ</h4>
                <p style="color:#fff; font-size:0.95rem; font-weight:700; margin:0 0 6px;">Mes de Prueba: <strong>$20 USD</strong></p>
                <p style="color:#aaa; font-size:0.8rem; margin:0 0 20px; line-height:1.5;">Ingresa hoy con menor fricci&oacute;n. Asigna leads, cierra tratos y eval&uacute;a el retorno de nuestros Closers de elite. Al completarse el mes de gracia, la inversi&oacute;n pasa a <strong>$70 USD mensuales</strong> (tarjeta ya guardada).</p>
                <div style="display:flex;gap:12px;justify-content:center;">
                    <button class="btn-empresa" style="margin:0;" onclick="cerrarDashboardEmpresa()">CANCELAR</button>
                    
                    <button class="btn-empresa btn-empresa-solid" style="margin:0;" onclick="guardarRegistroEmpresa()">PAGAR $20 USD Y ENTRAR</button>
                </div>
            </div>
        </div>`;
    
    v.scrollTop = 0;
}

function guardarRegistroEmpresa() {
    const nombre = document.getElementById('emp-nombre')?.value.trim();
    const industria = document.getElementById('emp-industria')?.value;
    const descripcion = document.getElementById('emp-descripcion')?.value.trim();
    const pais = document.getElementById('emp-pais')?.value;
    const ciudad = document.getElementById('emp-ciudad')?.value.trim();
    const comision = document.getElementById('emp-comision')?.value;
    const ticket = document.getElementById('emp-ticket')?.value;
    const contacto = document.getElementById('emp-contacto')?.value.trim();
    const email = document.getElementById('emp-email')?.value.trim();
    const whatsapp = document.getElementById('emp-whatsapp')?.value.trim();
    const web = document.getElementById('emp-web')?.value.trim();
    
    if (!nombre || !industria || !descripcion || !pais || !ciudad || !comision || !ticket || !contacto || !email || !whatsapp) {
        mostrarToast('Completa todos los campos obligatorios', false);
        return;
    }
    
    empresaData = {
        nombre, industria, descripcion, pais, ciudad,
        comision: parseInt(comision),
        ticketPromedio: parseInt(ticket),
        contacto, email, whatsapp, web,
        tokens: 15,
        unlockedClosers: []
    };
    
    localStorage.setItem('k_empresa_profile', JSON.stringify(empresaData));
    guardarEmpresaEnSupabase(empresaData);
    
    // Guardar/Actualizar en base compartida
    const empresasShare = KlozDB.getEmpresas();
    const existing = empresasShare.findIndex(e => e.email === empresaData.email);
    const empresaDataShare = {
        id: 'emp_user_' + new Date().getTime(),
        nombre: empresaData.nombre,
        industria: empresaData.industria,
        descripcion: empresaData.descripcion,
        pais: empresaData.pais,
        ciudad: empresaData.ciudad,
        comision: empresaData.comision,
        ticketPromedio: empresaData.ticketPromedio,
        rangoRequerido: 'Cualquiera',
        especialidad: empresaData.industria,
        logoLetra: empresaData.nombre.charAt(0).toUpperCase(),
        color: '#d4af37',
        activa: true,
        cuota: 20, /* Pasa a 70 al segundo mes */
        tokens: 15
    };
    if (existing !== -1) { empresasShare[existing] = empresaDataShare; }
    else { empresasShare.unshift(empresaDataShare); }
    KlozDB.saveEmpresas(empresasShare);
    mostrarToast('Empresa registrada con exito');
    actualizarBotonRegistro();
    setTimeout(() => mostrarMiEmpresa(), 1200);
}

async function enviarMensajeReal(empresaEmail, closerEmail, mensaje) {
    try {
        const { error } = await supabase.from('mensajes').insert({
            empresa_email: empresaEmail,
            closer_email: closerEmail,
            remitente: 'empresa',
            mensaje: mensaje
        });
        if (error) console.error('Error enviando mensaje:', error);
        else console.log('Mensaje enviado a Supabase');
    } catch(e) { console.error(e); }
}

async function cargarMensajes(empresaEmail, closerEmail) {
    try {
        const { data, error } = await supabase
            .from('mensajes')
            .select('*')
            .or(`empresa_email.eq.${empresaEmail},closer_email.eq.${closerEmail}`)
            .order('created_at', { ascending: true });
        if (error) console.error('Error cargando mensajes:', error);
        return data || [];
    } catch(e) { return []; }
}

async function guardarEmpresaEnSupabase(datos) {
    try {
        const { error } = await supabase.from('empresas').upsert({
            nombre: datos.nombre,
            industria: datos.industria,
            descripcion: datos.descripcion,
            pais: datos.pais,
            ciudad: datos.ciudad,
            comision: datos.comision,
            ticket_promedio: datos.ticketPromedio,
            contacto: datos.contacto,
            email: datos.email,
            whatsapp: datos.whatsapp,
            web: datos.web || '',
            tokens: datos.tokens || 15
        }, { onConflict: 'email' });
        if (error) console.error('Error guardando empresa:', error);
        else console.log('Empresa guardada en Supabase');
    } catch(e) { console.error(e); }
}












