/* =====================================================
   KLOZ - APP.JS  v2.0
   ZONA MODIFICABLE: LOGICA DEL DASHBOARD / CLOSER
   ===================================================== */

let regData = {};

/* Carga datos guardados al arrancar */
(function init() {
    const saved = localStorage.getItem('k_user_profile');
    if (saved) { try { regData = JSON.parse(saved); } catch(e) { regData = {}; } }
})();

/* ---------- utilidades ---------- */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function mostrarToast(msg, ok = true) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `position:fixed;bottom:40px;left:50%;transform:translateX(-50%);
        padding:16px 32px;background:${ok ? '#000' : '#cc0000'};color:#fff;
        font-family:Inter;font-weight:800;letter-spacing:2px;font-size:0.9rem;
        border:1px solid ${ok ? '#000' : '#ff0000'};border-radius:4px;z-index:9999;
        box-shadow:0 0 30px rgba(0,0,0,0.3);`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

/* ---------- dropdown ---------- */
function toggleDropdown() {
    const d = document.getElementById('dropdown-perfil');
    d.style.display = (d.style.display === 'flex') ? 'none' : 'flex';
}
document.addEventListener('click', e => {
    const d = document.getElementById('dropdown-perfil');
    if (d && !e.target.closest('#dropdown-perfil') && !e.target.closest('.icon-btn')) {
        d.style.display = 'none';
    }
});

/* ===================================================
   INICIO CLOSER — tarjetas de estado
   =================================================== */
function mostrarInicioCloser() {
    document.getElementById('dropdown-perfil').style.display = 'none';
    const examenOk  = localStorage.getItem('k_examen_ok') === '1';
    const perfilOk  = !!regData.nombre;
    const cvOk      = !!regData.cvNombre;

    const badge = (ok, label) => `
        <div style="display:flex;align-items:center;gap:12px;padding:18px 24px;
            background:${ok ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)'};
            border:1px solid ${ok ? '#000' : '#999'};border-radius:8px;margin-bottom:12px;">
            <span style="font-size:1.4rem;">${ok ? '?' : '?'}</span>
            <span style="font-weight:700;color:#000;letter-spacing:1px;">${label}</span>
            <span style="margin-left:auto;font-size:0.75rem;font-weight:800;letter-spacing:2px;
                color:#000;">${ok ? 'COMPLETO' : 'PENDIENTE'}</span>
        </div>`;

    document.getElementById('spa-main-content').innerHTML = `
        <div class="card-pro">
            <h1 style="font-size:2.2rem;color:#000;">Bienvenido a la Boveda</h1>
            <p style="color:#000;font-weight:600;margin-bottom:40px;">Tu estado actual como Closer de Elite.</p>

            <div style="max-width:560px;margin:0 auto 40px;text-align:left;">
                ${badge(examenOk,  'Prueba de Aptitud')}
                ${badge(perfilOk,  'Registro de Identidad')}
                ${badge(cvOk,      'Portafolio / CV')}
            </div>

            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
                ${!examenOk  ? `<button class="btn-kloz" onclick="abrirExamen()">Rendir Examen</button>` : ''}
                ${!perfilOk  ? `<button class="btn-kloz" onclick="mostrarRegistro(1)">Completar Registro</button>` : ''}
                <button class="btn-kloz" onclick="abrirEmpresasDisponibles()">Empresas Disponibles</button>
                <button class="btn-kloz" onclick="abrirChat()">Chat de Ventas</button>
            </div>
        </div>`;
    document.querySelector('.spa-view').scrollTop = 0;
}

/* ===================================================
   EXAMEN DE APTITUD
   =================================================== */
const qBank = [
    { q: "Un prospecto dice: 'Me encanta, pero tengo que pensarlo'.",   o: ["Agendar otra llamada","Aislar la objecion exacta","Presionar con oferta"],         a: "Aislar la objecion exacta" },
    { q: "El prospecto NO tiene dolor urgente.",                         o: ["Cerrar igual","Bajar el precio","Descalificar o escarbar el dolor"],                a: "Descalificar o escarbar el dolor" },
    { q: "Que significa aislar una objecion?",                           o: ["Preguntar si es la unica barrera","Ignorar y explicar beneficios","Cambiar tema"], a: "Preguntar si es la unica barrera" },
    { q: "El prospecto pide el precio a los 10 minutos.",                o: ["Dar el precio","Primero ver si puedo ayudarte","Es caro pero vale"],                a: "Primero ver si puedo ayudarte" },
    { q: "Momento ideal para revelar el precio.",                        o: ["Al inicio","Tras establecer dolor y conectar solucion","Al final con testimonios"],a: "Tras establecer dolor y conectar solucion" }
];

function abrirExamen() {
    document.getElementById('dropdown-perfil').style.display = 'none';
    const view = document.getElementById('spa-main-content');
    view.innerHTML = `<div class='card-pro'>
        <h1 style='font-size:2.2rem;color:#000;'>Prueba de Aptitud</h1>
        <p style='color:#000;font-weight:600;'>5 preguntas. Sin trampa. Solo la verdad.</p>
        <div id='q-box' style='margin-top:30px;'></div></div>`;

    const pool = shuffle([...qBank]);
    let cur = 0, userAns = [];

    const render = () => {
        const q  = pool[cur];
        const sO = shuffle([...q.o]);
        document.getElementById('q-box').innerHTML =
            `<p style="font-size:0.8rem;letter-spacing:3px;color:#000;font-weight:800;">PREGUNTA ${cur+1} DE 5</p>
             <h3 style="font-size:1.3rem;margin:15px 0 25px;color:#000;">${q.q}</h3>
             <div id="opts"></div>`;
        sO.forEach(opt => {
            const b = document.createElement('button');
            b.className = 'btn-kloz'; b.style.cssText = 'width:100%;margin-bottom:10px;text-align:left;';
            b.innerText = opt;
            b.onclick = () => {
                userAns.push({ q: q.q, s: opt });
                if (cur < 4) { cur++; render(); }
                else {
                    const win = userAns.every(a => qBank.find(x => x.q === a.q).a === a.s);
                    win ? celebrarExitoso() : mostrarFracaso();
                }
            };
            document.getElementById('opts').appendChild(b);
        });
    };
    render();
}

function celebrarExitoso() {
    localStorage.setItem('k_examen_ok', '1');
    const v = document.getElementById('spa-main-content');
    v.innerHTML = `<div class="card-pro">
        <h1 style="font-size:3rem;color:#000;text-transform:uppercase;">Felicitaciones</h1>
        <p style="font-size:1.3rem;font-weight:600;margin-bottom:30px;color:#000;">Examen aprobado. Acceso desbloqueado.</p>
        <button class="btn-kloz" onclick="mostrarRegistro(1)">Completar Mi Registro</button>
    </div>`;
    try { sndCla.play(); } catch(e) {}
    for (let i = 0; i < 80; i++) {
        let c = document.createElement('div');
        c.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:-10px;width:8px;height:8px;
            background:${['#000','#fff','#888'][Math.floor(Math.random()*3)]};
            z-index:9999;border-radius:50%;pointer-events:none;`;
        document.body.appendChild(c);
        c.animate([{top:'-10px',opacity:1},{top:'100vh',opacity:0}],
            {duration: Math.random()*2500+1500, fill:'forwards'});
        setTimeout(() => c.remove(), 4500);
    }
}

function mostrarFracaso() {
    document.getElementById('spa-main-content').innerHTML =
        `<div class="card-pro">
            <h1 style="color:#cc0000;font-size:2.5rem;">ACCESO DENEGADO</h1>
            <p style="font-size:1.1rem;font-weight:600;color:#000;">Faltas tecnicas detectadas. Estudia y vuelve.</p>
            <button class="btn-kloz" onclick="abrirExamen()" style="margin-top:20px;">Reintentar</button>
            <button class="btn-kloz" onclick="mostrarInicioCloser()">Volver al Inicio</button>
        </div>`;
}

/* ===================================================
   REGISTRO — 3 bloques
   =================================================== */
function mostrarRegistro(step) {
    const v = document.getElementById('spa-main-content');
    const saved = localStorage.getItem('k_user_profile');
    if (saved) { try { regData = { ...JSON.parse(saved), ...regData }; } catch(e){} }

    const pasos = `
        <div style="display:flex;gap:0;margin-bottom:32px;max-width:560px;margin-left:auto;margin-right:auto;">
            ${['Identidad','Ubicacion','Profesional'].map((s,i) => `
                <div style="flex:1;text-align:center;padding:10px 4px;
                    border-bottom:3px solid ${step===i+1 ? '#000' : '#ccc'};
                    font-size:0.72rem;font-weight:800;letter-spacing:2px;
                    color:${step===i+1 ? '#000' : '#aaa'};">${i+1}. ${s}</div>`).join('')}
        </div>`;

    let form = '';
    if (step === 1) {
        form = `
            <div class="photo-preview" id="foto-circulo" onclick="document.getElementById('inp-foto').click()"
                style="${regData.fotoBase64 ? 'background-image:url('+regData.fotoBase64+');' : ''}">
                ${regData.fotoBase64 ? '' : '&#128100;'}
            </div>
            <input type="file" id="inp-foto" style="display:none" onchange="previewFoto(this)" accept="image/*">
            <label class="label-elite">Nombre y Apellido *</label>
            <input type="text" id="reg-nombre" class="input-elite" value="${regData.nombre || ''}" placeholder="Ej: Juan Perez">
            <label class="label-elite">DNI / Fiscal ID / Pasaporte *</label>
            <input type="text" id="reg-dni" class="input-elite" value="${regData.dni || ''}">
            <label class="label-elite">Fecha de Nacimiento *</label>
            <input type="date" id="reg-fecha" class="input-elite" value="${regData.fecha || ''}">
            <label class="label-elite">Email *</label>
            <input type="email" id="reg-email" class="input-elite" value="${regData.email || ''}" placeholder="tu@email.com">
            <label class="label-elite">Contraseña *</label>
            <input type="password" id="reg-password" class="input-elite" value="${regData.password || ''}" placeholder="Mínimo 6 caracteres">
            <label class="label-elite">WhatsApp *</label>
            <input type="tel" id="reg-whatsapp" class="input-elite" value="${regData.whatsapp || ''}" placeholder="+54911...">
            <div style="display:flex;justify-content:flex-end;margin-top:30px;">
                <button class="btn-kloz" onclick="guardarPaso(1)">SIGUIENTE &rarr;</button>
            </div>`;
    } else if (step === 2) {
        form = `
            <label class="label-elite">Pais *</label>
            <select id="reg-pais" class="input-elite">
                ${['Argentina','Espana','Mexico','Colombia','Chile','Uruguay','Peru','Venezuela','Otro'].map(p =>
                    `<option value="${p}" ${regData.pais===p?'selected':''}>${p}</option>`).join('')}
            </select>
            <label class="label-elite">Estado / Provincia *</label>
            <input type="text" id="reg-provincia" class="input-elite" value="${regData.provincia || ''}">
            <label class="label-elite">Ciudad / Localidad *</label>
            <input type="text" id="reg-ciudad" class="input-elite" value="${regData.ciudad || ''}">
            <label class="label-elite">Codigo Postal</label>
            <input type="number" id="reg-cp" class="input-elite" value="${regData.cp || ''}">
            <label class="label-elite">Direccion (Calle y Altura)</label>
            <input type="text" id="reg-calle" class="input-elite" value="${regData.calle || ''}">
            <div style="display:flex;justify-content:space-between;margin-top:30px;">
                <button class="btn-kloz" onclick="mostrarRegistro(1)">&larr; ATRAS</button>
                <button class="btn-kloz" onclick="guardarPaso(2)">SIGUIENTE &rarr;</button>
            </div>`;
    } else if (step === 3) {
        form = `
            <label class="label-elite">Rango Actual *</label>
            <select id="reg-rango" class="input-elite">
                ${[['Rookie','Rookie (Empezando)'],['Junior','Junior (6-12 meses)'],['Senior','Senior (+2 anos)'],['Master','Master (Elite)']].map(([v,l]) =>
                    `<option value="${v}" ${regData.rango===v?'selected':''}>${l}</option>`).join('')}
            </select>
            <label class="label-elite">Especialidad *</label>
            <input type="text" id="reg-especialidad" class="input-elite" value="${regData.especialidad || ''}" placeholder="Ej: Inmobiliaria, Salud, Educacion...">
            <label class="label-elite">Porcentaje de Cierre promedio (%) — Opcional</label>
            <input type="number" id="reg-cierre" class="input-elite" min="0" max="100" value="${regData.cierre || ''}">
            <label class="label-elite">Ticket Promedio ($) — Opcional</label>
            <input type="number" id="reg-ticket" class="input-elite" value="${regData.ticket || ''}">
            <label class="label-elite">Cargar CV (PDF, DOC) — Opcional</label>
            <input type="file" id="inp-cv" class="input-elite" accept=".pdf,.doc,.docx" onchange="registrarCV(this)">
            ${regData.cvNombre ? `<p style="font-size:0.8rem;color:#555;margin-top:4px;">&#128196; Archivo actual: <strong>${regData.cvNombre}</strong></p>` : ''}
            <label class="label-elite">Referencia (Nombre del Jefe / Mentor)</label>
            <input type="text" id="reg-ref" class="input-elite" value="${regData.ref || ''}" placeholder="Nombre y telefono">
            <div style="display:flex;justify-content:space-between;margin-top:30px;">
                <div style="background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1); padding: 18px; border-radius: 8px; margin-top: 30px; text-align: center; color: #000;">
                <h4 style="margin:0 0 8px; font-weight:800; letter-spacing:1px; font-size:1rem; color: #d4af37;">SUSCRIPCI&Oacute;N PROFESIONAL KLOZ</h4>
                <p style="font-size:0.95rem; font-weight:700; margin:0 0 6px;">Plan Founder: <strong>$10 USD / mes</strong></p>
                <p style="font-size:0.8rem; margin:0 0 20px; line-height:1.5; color: #444;">Forma parte de los primeros 30 miembros fundadores y mant&eacute;n este precio para siempre. Acceso total a ofertas corporativas y comunidad elite. (Plan regular: $50 USD).</p>
                <div style="display:flex;gap:12px;justify-content:center;">
                    <button class="btn-kloz" style="background:#555; color:#fff;" onclick="mostrarRegistro(2)">ATRAS</button>
                    
                    <button class="btn-kloz btn-gold" onclick="guardarFinal()">PAGAR $10 Y ACTIVAR</button>
                </div>
            </div>
            </div>`;
    }

    v.innerHTML = `
        <div class="card-pro" style="text-align:left;max-width:600px;">
            <h1 style="text-align:center;font-size:2rem;">
                ${['','Bloque 1: Identidad','Bloque 2: Ubicacion','Bloque 3: Profesional'][step]}
            </h1>
            ${pasos}
            <div class="form-block">${form}</div>
        </div>`;
    document.querySelector('.spa-view').scrollTop = 0;
}

function previewFoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            const c = document.getElementById('foto-circulo');
            if (c) { c.style.backgroundImage = "url(" + e.target.result + ")"; c.innerHTML = ''; }
            regData.fotoBase64 = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function registrarCV(input) {
    if (input.files && input.files[0]) {
        regData.cvNombre = input.files[0].name;
        mostrarToast('CV cargado: ' + regData.cvNombre);
    }
}

function guardarPaso(n) {
    const req = (id, label) => {
        const v = document.getElementById(id)?.value?.trim();
        if (!v) { mostrarToast('Completa el campo: ' + label, false); return null; }
        return v;
    };
    if (n === 1) {
        const nombre = req('reg-nombre','Nombre'); if (!nombre) return;
        const email  = req('reg-email','Email');   if (!email) return;
        const pass   = req('reg-password','Contraseña'); if (!pass) return;
        if (pass.length < 6) { mostrarToast('La contraseña debe tener al menos 6 caracteres', false); return; }
        const wa     = req('reg-whatsapp','WhatsApp'); if (!wa) return;
        regData.nombre   = nombre;
        regData.dni      = document.getElementById('reg-dni').value;
        regData.fecha    = document.getElementById('reg-fecha').value;
        regData.email    = email;
        regData.password = pass;
        regData.whatsapp = wa;
        mostrarRegistro(2);
    } else if (n === 2) {
        const ciudad = req('reg-ciudad','Ciudad'); if (!ciudad) return;
        regData.pais      = document.getElementById('reg-pais').value;
        regData.provincia = document.getElementById('reg-provincia').value;
        regData.ciudad    = ciudad;
        regData.cp        = document.getElementById('reg-cp').value;
        regData.calle     = document.getElementById('reg-calle').value;
        mostrarRegistro(3);
    }
}

function guardarFinal() {
    const esp = document.getElementById('reg-especialidad').value.trim();
    if (!esp) { mostrarToast('Completa el campo: Especialidad', false); return; }
    regData.rango        = document.getElementById('reg-rango').value;
    regData.especialidad = esp;
    regData.cierre       = document.getElementById('reg-cierre').value;
    regData.ticket       = document.getElementById('reg-ticket').value;
    regData.ref          = document.getElementById('reg-ref').value;
    regData.verificado   = true;
    localStorage.setItem('k_user_profile', JSON.stringify(regData));
    guardarCloserEnSupabase(regData);
    
    // Guardar/Actualizar closer en base compartida
    const closersShare = KlozDB.getClosers();
    const existing = closersShare.findIndex(c => c.email === regData.email);
    const closerDataShare = {
        id: 'cls_user_' + new Date().getTime(),
        nombre: regData.nombre,
        rango: regData.rango,
        especialidad: regData.especialidad,
        pais: regData.pais,
        ciudad: regData.ciudad,
        cierre: parseInt(regData.cierre) || 0,
        ticket: parseInt(regData.ticket) || 0,
        email: regData.email,
        whatsapp: regData.whatsapp,
        logros: regData.logros || '',
        verificado: true,
        cuota: regData.cuota || 50,
        founder: regData.founder || false
    };
    if (existing !== -1) { closersShare[existing] = closerDataShare; } 
    else { closersShare.unshift(closerDataShare); }
    KlozDB.saveClosers(closersShare);
    mostrarToast('Perfil de Elite activado con exito');
    setTimeout(() => abrirPerfil(), 1200);
}

/* ===================================================
   MI PERFIL
   =================================================== */
function abrirPerfil() {
    document.getElementById('dropdown-perfil').style.display = 'none';
    if (!regData.nombre) {
        document.getElementById('spa-main-content').innerHTML = `
            <div class="card-pro">
                <h1 style="font-size:2rem;">Sin Perfil Registrado</h1>
                <p style="color:#555;font-weight:600;">Primero debes completar el examen y el registro.</p>
                <button class="btn-kloz" style="margin-top:20px;" onclick="abrirExamen()">Ir al Examen</button>
            </div>`;
        return;
    }
    const p = regData;
    document.getElementById('spa-main-content').innerHTML = `
        <div class="card-pro">
            <div class="v-badge">&#128142; Closer de Elite Verificado</div>
            <div style="display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;margin-bottom:30px;">
                <div class="photo-preview" style="${p.fotoBase64 ? 'background-image:url('+p.fotoBase64+');' : ''}margin:0;">
                    ${p.fotoBase64 ? '' : '&#128100;'}
                </div>
                <div>
                    <h1 style="font-size:2.4rem;margin:0;color:#000;">${p.nombre}</h1>
                    <p style="color:#000;font-weight:800;letter-spacing:3px;font-size:1rem;">
                        ${(p.rango || 'ROOKIE').toUpperCase()} &bull; ${p.especialidad || ''}
                    </p>
                    <p style="color:#000;font-size:0.85rem;">${p.pais || ''} &bull; ${p.ciudad || ''}</p>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
                <div class="profile-data-card" style="border-color:#e74c3c;">
                    <h3 style="color:#e74c3c;">DATOS RESERVADOS</h3>
                    <p style="color:#e74c3c;font-weight:800;font-size:0.85rem;">&#128274; EMAIL: Oculto por seguridad</p>
                    <p style="color:#e74c3c;font-weight:800;font-size:0.85rem;">&#128274; WHATSAPP: Oculto por seguridad</p>
                    <p style="font-size:0.75rem;color:#555;margin-top:8px;"><b>Pol&iacute;tica KLOZ:</b> Toda negociaci&oacute;n con clientes se realiza v&iacute;a el Hub de Mensajes en base a los terminos y condiciones.</p>
                </div>
                <div class="profile-data-card">
                    <h3>NUMEROS</h3>
                    <p><strong>% CIERRE:</strong> ${p.cierre ? p.cierre+'%' : 'No indicado'}</p>
                    <p><strong>TICKET PROM.:</strong> ${p.ticket ? '$'+p.ticket : 'No indicado'}</p>
                    <p><strong>REFERENCIA:</strong> ${p.ref || 'No indicada'}</p>
                </div>
            </div>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:30px;flex-wrap:wrap;">
                <button class="btn-kloz" onclick="mostrarRegistro(1)">Editar Perfil</button>
                <button class="btn-kloz" onclick="mostrarInicioCloser()">Volver al Inicio</button>
            </div>
        </div>`;
    document.querySelector('.spa-view').scrollTop = 0;
}

/* ===================================================
   MI PORTAFOLIO
   =================================================== */
function abrirPortafolio() {
    document.getElementById('dropdown-perfil').style.display = 'none';
    const cierres = JSON.parse(localStorage.getItem('k_cierres') || '[]');

    document.getElementById('spa-main-content').innerHTML = `
        <div class="card-pro" style="text-align:left;max-width:720px;">
            <h1 style="text-align:center;font-size:2rem;color:#000;">Mi Portafolio</h1>

            <div class="profile-data-card" style="margin-bottom:20px;">
                <h3 style="margin-bottom:16px;color:#000;">&#128196; CURRICULUM VITAE</h3>
                ${regData.cvNombre
                    ? `<p style="color:#000;font-weight:700;">&#9989; Archivo cargado: <em>${regData.cvNombre}</em></p>
                       <button class="btn-kloz" style="margin-top:10px;" onclick="mostrarRegistro(3)">Reemplazar CV</button>`
                    : `<p style="color:#000;">Aun no cargaste tu CV.</p>
                       <button class="btn-kloz" style="margin-top:10px;" onclick="mostrarRegistro(3)">Cargar CV ahora</button>`
                }
            </div>

            <div class="profile-data-card" style="margin-bottom:20px;">
                <h3 style="margin-bottom:16px;color:#000;">&#127942; LOGROS PERSONALES</h3>
                <textarea id="txt-logros" style="width:100%;min-height:100px;padding:12px;
                    font-family:Inter;font-size:0.95rem;border:1px solid #000;border-radius:6px;
                    background:rgba(255,255,255,0.7);resize:vertical;color:#000;"
                    placeholder="Ej: Cerre 3 tratos en una semana, gane el ranking mensual..."
                >${regData.logros || ''}</textarea>
                <button class="btn-kloz" style="margin-top:10px;width:100%;" onclick="guardarLogros()">Guardar Logros</button>
            </div>

            <div class="profile-data-card" style="margin-bottom:20px;">
                <h3 style="margin-bottom:16px;color:#000;">&#128200; HISTORIAL DE CIERRES</h3>
                <div id="tabla-cierres">
                ${cierres.length === 0
                    ? `<p style="color:#000;font-size:0.9rem;">Aun no registraste ningun cierre.</p>`
                    : `<table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
                        <thead><tr style="border-bottom:2px solid #000;">
                            <th style="padding:8px 4px;text-align:left;color:#000;">Fecha</th>
                            <th style="padding:8px 4px;text-align:left;color:#000;">Empresa</th>
                            <th style="padding:8px 4px;text-align:right;color:#000;">Monto</th>
                            <th style="padding:8px 4px;text-align:center;color:#000;">Resultado</th>
                        </tr></thead>
                        <tbody>${cierres.map(c => `
                            <tr style="border-bottom:1px solid #ccc;">
                                <td style="padding:8px 4px;color:#000;">${c.fecha}</td>
                                <td style="padding:8px 4px;color:#000;">${c.empresa}</td>
                                <td style="padding:8px 4px;text-align:right;color:#000;">$${c.monto}</td>
                                <td style="padding:8px 4px;text-align:center;">
                                    <span style="padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:800;
                                        background:${c.resultado==='Cerrado' ? '#000' : '#ccc'};
                                        color:${c.resultado==='Cerrado' ? '#fff' : '#000'};">${c.resultado}</span>
                                </td>
                            </tr>`).join('')}
                        </tbody></table>`
                }
                </div>
                <button class="btn-kloz" style="margin-top:16px;width:100%;" onclick="abrirFormCierre()">+ Agregar Cierre</button>
                <div id="form-cierre-rapido" style="display:none;margin-top:16px;" class="form-block">
                    <label class="label-elite">Empresa / Producto</label>
                    <input type="text" id="c-empresa" class="input-elite" placeholder="Ej: Inmobiliaria Norte">
                    <label class="label-elite">Fecha del Cierre</label>
                    <input type="date" id="c-fecha" class="input-elite" value="${new Date().toISOString().split('T')[0]}">
                    <label class="label-elite">Monto ($)</label>
                    <input type="number" id="c-monto" class="input-elite" placeholder="0">
                    <label class="label-elite">Resultado</label>
                    <select id="c-resultado" class="input-elite">
                        <option>Cerrado</option>
                        <option>Pendiente</option>
                        <option>No cerrado</option>
                    </select>
                    <button class="btn-kloz" style="width:100%;margin-top:16px;background:#000;color:#fff;" onclick="guardarCierre()">GUARDAR CIERRE</button>
                </div>
            </div>

            <div style="text-align:center;margin-top:10px;">
                <button class="btn-kloz" onclick="mostrarInicioCloser()">Volver al Inicio</button>
            </div>
        </div>`;
    document.querySelector('.spa-view').scrollTop = 0;
}

function guardarLogros() {
    regData.logros = document.getElementById('txt-logros').value;
    localStorage.setItem('k_user_profile', JSON.stringify(regData));
    
    // Guardar/Actualizar closer en base compartida
    const closersShare = KlozDB.getClosers();
    const existing = closersShare.findIndex(c => c.email === regData.email);
    const closerDataShare = {
        id: 'cls_user_' + new Date().getTime(),
        nombre: regData.nombre,
        rango: regData.rango,
        especialidad: regData.especialidad,
        pais: regData.pais,
        ciudad: regData.ciudad,
        cierre: parseInt(regData.cierre) || 0,
        ticket: parseInt(regData.ticket) || 0,
        email: regData.email,
        whatsapp: regData.whatsapp,
        logros: regData.logros || '',
        verificado: true,
        cuota: regData.cuota || 50,
        founder: regData.founder || false
    };
    if (existing !== -1) { closersShare[existing] = closerDataShare; } 
    else { closersShare.unshift(closerDataShare); }
    KlozDB.saveClosers(closersShare);
    mostrarToast('Logros guardados');
}

function abrirFormCierre() {
    const f = document.getElementById('form-cierre-rapido');
    f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

function guardarCierre() {
    const empresa   = document.getElementById('c-empresa').value.trim();
    const fecha     = document.getElementById('c-fecha').value;
    const monto     = document.getElementById('c-monto').value;
    const resultado = document.getElementById('c-resultado').value;
    if (!empresa || !fecha) { mostrarToast('Completa empresa y fecha', false); return; }
    const cierres = JSON.parse(localStorage.getItem('k_cierres') || '[]');
    cierres.unshift({ empresa, fecha, monto: monto || '0', resultado });
    localStorage.setItem('k_cierres', JSON.stringify(cierres));
    mostrarToast('Cierre registrado');
    setTimeout(() => abrirPortafolio(), 800);
}

let paginaEmpresas = 1;
const empresasPorPagina = 4;
let filtroRangoEmpresas = 'todos';

function abrirEmpresasDisponibles() {
    document.getElementById('dropdown-perfil').style.display = 'none';
    const v = document.getElementById('spa-main-content');
    
    const empresasFiltradas = KlozDB.getEmpresas().filter(e => {
        return filtroRangoEmpresas === 'todos' || e.rangoRequerido === filtroRangoEmpresas;
    });
    
    const totalPaginas = Math.ceil(empresasFiltradas.length / empresasPorPagina);
    const inicio = (paginaEmpresas - 1) * empresasPorPagina;
    const empresasPagina = empresasFiltradas.slice(inicio, inicio + empresasPorPagina);
    
    v.innerHTML = `
        <div class="card-pro" style="text-align:left;max-width:720px;">
            <h1 style="text-align:center;font-size:2rem;color:#000;">Empresas Disponibles</h1>
            <p style="color:#000;font-weight:600;margin-bottom:30px;text-align:center;">Empresas que buscan closers como vos.</p>
            
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;align-items:center;">
                <span class="filtro-label">FILTRAR:</span>
                <select class="filtro-select" onchange="filtrarEmpresas()" style="background:#fff;">
                    <option value="todos" ${filtroRangoEmpresas === 'todos' ? 'selected' : ''}>Todos los rangos</option>
                    <option value="Master" ${filtroRangoEmpresas === 'Master' ? 'selected' : ''}>Master</option>
                    <option value="Senior" ${filtroRangoEmpresas === 'Senior' ? 'selected' : ''}>Senior</option>
                    <option value="Junior" ${filtroRangoEmpresas === 'Junior' ? 'selected' : ''}>Junior</option>
                    <option value="Rookie" ${filtroRangoEmpresas === 'Rookie' ? 'selected' : ''}>Rookie</option>
                </select>
            </div>
            
            <div style="display:grid;gap:16px;" id="empresas-grid">${empresasPagina.map(e => `
                <div class="empresa-card" data-rango="${e.rangoRequerido}" style="background:rgba(255,255,255,0.2);border:1px solid #000;border-radius:10px;padding:20px;cursor:pointer;transition:0.2s;"
                     onmouseover="this.style.borderColor='#333'" onmouseout="this.style.borderColor='#000'"
                     onclick="if(!regData.verificado){mostrarToast('Debes verificar tu identidad en KLOZ para poder contactar y ver detalles de las Empresas', false);} else {mostrarToast('Empresa '+'${e.nombre}'+' - Bloqueada en Demo Activa')}">
                    <div style="display:flex;gap:16px;align-items:center;">
                        <div style="width:50px;height:50px;background:${e.color};border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.3rem;color:#fff;">${e.logoLetra}</div>
                        <div style="flex:1;">
                            <h3 style="margin:0 0 6px;font-size:1.1rem;color:#000;">${e.nombre}</h3>
                            <p style="margin:0;font-size:0.85rem;color:#000;">${e.industria} • ${e.ciudad}, ${e.pais}</p>
                            <span class="rango-badge rango-${e.rangoRequerido}" style="margin-top:8px;">${e.rangoRequerido}</span>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-weight:800;color:#000;">${e.comision}%</div>
                            <div style="font-size:0.7rem;color:#000;">Comision</div>
                        </div>
                    </div>
                </div>`).join('')}
            </div>
            
            ${totalPaginas > 1 ? `
            <div style="display:flex;justify-content:center;gap:16px;margin-top:32px;align-items:center;">
                <button class="btn-kloz" onclick="cambiarPaginaEmpresas(-1)" ${paginaEmpresas === 1 ? 'disabled style="opacity:0.5"' : ''}>&larr; ANTERIOR</button>
                <span style="font-size:0.85rem;font-weight:700;">${paginaEmpresas} / ${totalPaginas}</span>
                <button class="btn-kloz" onclick="cambiarPaginaEmpresas(1)" ${paginaEmpresas === totalPaginas ? 'disabled style="opacity:0.5"' : ''}>SIGUIENTE &rarr;</button>
            </div>
            ` : ''}
            
            <div style="text-align:center;margin-top:30px;">
                <button class="btn-kloz" onclick="mostrarInicioCloser()">Volver al Inicio</button>
            </div>
        </div>`;
    document.querySelector('.spa-view').scrollTop = 0;
}

function cambiarPaginaEmpresas(direccion) {
    const empresasFiltradas = KlozDB.getEmpresas().filter(e => {
        return filtroRangoEmpresas === 'todos' || e.rangoRequerido === filtroRangoEmpresas;
    });
    const totalPaginas = Math.ceil(empresasFiltradas.length / empresasPorPagina);
    paginaEmpresas += direccion;
    if (paginaEmpresas < 1) paginaEmpresas = 1;
    if (paginaEmpresas > totalPaginas) paginaEmpresas = totalPaginas;
    abrirEmpresasDisponibles();
}

function filtrarEmpresas() {
    paginaEmpresas = 1;
    filtroRangoEmpresas = document.querySelector('.filtro-select').value;
    abrirEmpresasDisponibles();
}

let chatIdx = 0;
const chatProspecto = [
    "Hola, no tengo mucho tiempo. De que se trata esto?",
    "Ya probe varias cosas y no me funcionaron.",
    "Esta bien... pero cuanto cuesta exactamente?",
    "Tengo que consultarlo. Te aviso.",
    "Mira, me convenciste. Como arrancamos?"
];

function abrirChat() {
    document.getElementById('dropdown-perfil').style.display = 'none';
    document.getElementById('spa-main-content').innerHTML = `
        <div class="card-pro chat-card" style="max-width:680px;padding:0;">
            <div class="chat-header">
                <div style="display:flex;align-items:center;gap:14px;">
                    <div class="chat-avatar">P</div>
                    <div>
                        <div style="font-weight:800;font-size:1rem;letter-spacing:1px;">PROSPECTO SIMULADO</div>
                        <div style="font-size:0.75rem;color:rgba(255,255,255,0.6);letter-spacing:2px;">ENTRENAMIENTO DE CIERRE</div>
                    </div>
                </div>
                <div style="display:flex;gap:10px;">
                    <div class="chat-status-dot"></div>
                    <span style="font-size:0.75rem;color:rgba(255,255,255,0.5);">EN LINEA</span>
                </div>
            </div>
            <div class="chat-body" id="chat-body">
                <div class="chat-info-pill">Simulacion de llamada de ventas. Practica tus tecnicas de cierre.</div>
            </div>
            <div class="chat-input-bar">
                <input type="text" id="chat-input" class="chat-input" placeholder="Escribe tu respuesta al prospecto..." 
                    onkeydown="if(event.key==='Enter') enviarMensaje()">
                <button class="chat-send-btn" onclick="enviarMensaje()">&#10148;</button>
            </div>
            <div style="padding:12px;text-align:center;border-top:1px solid #ddd;">
                <button class="btn-kloz" onclick="mostrarInicioCloser()">&#8592; Volver al Inicio</button>
            </div>
        </div>`;

    chatIdx = 0;
    setTimeout(() => agregarMensaje('prospecto', chatProspecto[chatIdx]), 800);
    document.querySelector('.spa-view').scrollTop = 0;
    setTimeout(() => document.getElementById('chat-input')?.focus(), 900);
}

function agregarMensaje(tipo, texto) {
    const body = document.getElementById('chat-body');
    if (!body) return;
    const div = document.createElement('div');
    div.className = tipo === 'prospecto' ? 'chat-msg-prospecto' : 'chat-msg-closer';
    div.innerHTML = `<div class="chat-bubble">${texto}</div>
        <div class="chat-time">${new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}</div>`;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

function mostrarTyping() {
    const body = document.getElementById('chat-body');
    if (!body) return;
    const t = document.createElement('div');
    t.id = 'typing-indicator'; t.className = 'chat-msg-prospecto';
    t.innerHTML = `<div class="chat-bubble typing"><span></span><span></span><span></span></div>`;
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
}

function enviarMensaje() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    const texto = input.value.trim();
    if (!texto) return;
    input.value = '';
    agregarMensaje('closer', texto);
    chatIdx++;
    if (chatIdx < chatProspecto.length) {
        mostrarTyping();
        setTimeout(() => {
            document.getElementById('typing-indicator')?.remove();
            agregarMensaje('prospecto', chatProspecto[chatIdx]);
        }, 1200 + Math.random() * 800);
    } else {
        setTimeout(() => {
            document.getElementById('chat-body').innerHTML += `
                <div class="chat-info-pill" style="background:rgba(0,0,0,0.1);border-color:#000;color:#000;">
                    &#127942; Simulacion completada. Bien jugado, Closer.
                </div>`;
            document.getElementById('chat-body').scrollTop = 99999;
        }, 1000);
    }
}



/* --- LOGICA NOTIFICACIONES --- */
function toggleNotificaciones() {
    const d = document.getElementById("dropdown-notificaciones");
    const p = document.getElementById("dropdown-perfil");
    if (p) p.style.display = "none";
    if (d) d.style.display = (d.style.display === "flex") ? "none" : "flex";
}
document.addEventListener("click", e => {
    const n = document.getElementById("dropdown-notificaciones");
    if (n && !e.target.closest("#dropdown-notificaciones") && !e.target.closest(".icon-btn")) {
        n.style.display = "none";
    }
});
function marcarNotificacionesLeidas() {
    const b = document.getElementById("badge-notif");
    if (b) b.style.display = "none";
    document.querySelectorAll(".notif-item.unread").forEach(el => el.classList.remove("unread"));
    const d = document.getElementById("dropdown-notificaciones");
    if(d) d.style.display = "none";
}
function abrirNotifEmpresa() {
    marcarNotificacionesLeidas();
    mostrarInicioCloser();
    setTimeout(() => { mostrarToast("Inmobiliaria Horizonte agendo llamada de presentacion"); }, 400);
}
function abrirNotifChat() {
    marcarNotificacionesLeidas();
    abrirChat();
}


/* --- LOGICA MENSAJES --- */
function toggleMensajes() {
    const m = document.getElementById("dropdown-mensajes");
    const n = document.getElementById("dropdown-notificaciones");
    const p = document.getElementById("dropdown-perfil");
    if (p) p.style.display = "none";
    if (n) n.style.display = "none";
    if (m) m.style.display = (m.style.display === "flex") ? "none" : "flex";
}
document.addEventListener("click", e => {
    const m = document.getElementById("dropdown-mensajes");
    if (m && !e.target.closest("#dropdown-mensajes") && !e.target.closest(".icon-btn")) {
        m.style.display = "none";
    }
});
function marcarMensajesLeidos() {
    const b = document.getElementById("badge-msg");
    if (b) b.style.display = "none";
    document.querySelectorAll("#dropdown-mensajes .notif-item.unread").forEach(el => el.classList.remove("unread"));
    const m = document.getElementById("dropdown-mensajes");
    if(m) m.style.display = "none";
}

/* Interceptar toggles para cerrar el otro dropdown */
const oldToggNotif = window.toggleNotificaciones;
window.toggleNotificaciones = function() {
    const m = document.getElementById("dropdown-mensajes");
    if (m) m.style.display = "none";
    if (typeof oldToggNotif === "function") oldToggNotif();
};
const oldToggDrop = window.toggleDropdown;
window.toggleDropdown = function() {
    const m = document.getElementById("dropdown-mensajes");
    if (m) m.style.display = "none";
    const n = document.getElementById("dropdown-notificaciones");
    if (n) n.style.display = "none";
    if (typeof oldToggDrop === "function") oldToggDrop();
};




/* --- BLOQUEO DE NAVEGACION PARA NO VERIFICADOS --- */
const baseToggNotif2 = window.toggleNotificaciones;
window.toggleNotificaciones = function() {
    if(!regData.verificado) { mostrarToast("Verifica tu perfil para desbloquear Notificaciones", false); return; }
    if(typeof baseToggNotif2 === "function") baseToggNotif2();
};

const baseToggMens2 = window.toggleMensajes;
window.toggleMensajes = function() {
    if(!regData.verificado) { mostrarToast("Verifica tu perfil para desbloquear Mensajes", false); return; }
    if(typeof baseToggMens2 === "function") baseToggMens2();
};

const baseToggDrop2 = window.toggleDropdown;
window.toggleDropdown = function() {
    if(!regData.verificado) { mostrarToast("Verifica tu perfil para ver opciones de Perfil", false); return; }
    if(typeof baseToggDrop2 === "function") baseToggDrop2();
};

function checkNavCloser() {
    const isVerified = regData && regData.verificado;
    const icons = document.querySelectorAll("#dashboard-closer .icon-group .icon-btn");
    icons.forEach(icon => {
        if (!isVerified) {
            icon.style.opacity = "0.2";
            icon.style.filter = "grayscale(100%)";
        } else {
            icon.style.opacity = "1";
            icon.style.filter = "none";
        }
    });
}

const oldMostrarInicio = window.mostrarInicioCloser;
window.mostrarInicioCloser = function() {
    checkNavCloser();
    if(typeof oldMostrarInicio === "function") oldMostrarInicio();
};

const oldGuardarFinal = window.guardarFinal;
window.guardarFinal = function() {
    if(typeof oldGuardarFinal === "function") oldGuardarFinal();
    checkNavCloser();
};

// Check quickly on load logic loop
setInterval(checkNavCloser, 1000);

async function guardarCloserEnSupabase(datos) {
    try {
        const { error } = await supabase.from('cerradores').upsert({
            nombre: datos.nombre,
            rango: datos.rango || 'Rookie',
            especialidad: datos.especialidad || '',
            pais: datos.pais || '',
            ciudad: datos.ciudad || '',
            cierre: datos.cierre || 0,
            ticket: datos.ticket || 0,
            email: datos.email,
            whatsapp: datos.whatsapp || '',
            logros: datos.logros || '',
            verificado: datos.verificado || false
        }, { onConflict: 'email' });
        if (error) console.error('Error guardando closer:', error);
        else console.log('Closer guardado en Supabase');
    } catch(e) { console.error(e); }
}





