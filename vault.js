/* =====================================================
   KLOZ - VAULT.JS
   ZONA PROTEGIDA: LOGICA DE LA BOVEDA
   No modificar sin autorizacion explicita.
   ===================================================== */

const sndEng = document.getElementById('audio-engranaje');
const sndWoo = document.getElementById('audio-woosh');
const sndCla = document.getElementById('audio-clank');
let panelActual = 0;

/* --- APERTURA: clic en el logo central --- */
function iniciarApertura() {
    const boveda = document.getElementById('contenedor-boveda');
    if (!boveda) return;

    boveda.style.pointerEvents = 'none';
    boveda.classList.add('girando');
    try { sndEng.currentTime = 5; sndEng.play().catch(e => {}); } catch(e) {}

    setTimeout(() => {
        try { sndEng.pause(); sndEng.currentTime = 0; } catch(e) {}
        try { sndWoo.play().catch(e => {}); } catch(e) {}
        boveda.classList.add('zoom-salida');

        setTimeout(() => {
            boveda.style.display = 'none';
            const sel = document.getElementById('selector-rol');
            sel.style.display = 'flex';
            sel.style.transform = 'translateX(0%)';
            panelActual = 0;
            actualizarFlechas();
        }, 800);
    }, 2800);
}

/* --- CIERRE: volver a la boveda desde el selector --- */
function iniciarCierre() {
    localStorage.removeItem('k_user_profile');
    localStorage.removeItem('k_examen_ok');
    localStorage.removeItem('k_cierres');
    
    regData = {};
    
    const boveda = document.getElementById('contenedor-boveda');
    const sel    = document.getElementById('selector-rol');
    const dash   = document.getElementById('dashboard-closer');

    if (dash) {
        dash.style.transform = 'translateX(0%)';
        setTimeout(() => { dash.style.display = 'none'; }, 850);
    }

    document.querySelectorAll('.nav-arrow').forEach(a => a.style.display = 'none');
    sel.style.display = 'none';

    boveda.style.display = 'flex';
    boveda.style.pointerEvents = 'none';
    boveda.classList.remove('girando');
    boveda.classList.remove('girando-cierre');
    boveda.classList.add('zoom-salida');

    setTimeout(() => {
        boveda.classList.remove('zoom-salida');
        boveda.classList.add('girando-cierre');
        try { sndCla.currentTime = 0; sndCla.play().catch(e => {}); } catch(e) {}

        setTimeout(() => {
            boveda.classList.remove('girando-cierre');
            boveda.style.pointerEvents = 'auto';
            try { sndEng.pause(); sndEng.currentTime = 0; } catch(e) {}
        }, 2800);
    }, 80);
}

/* --- Navegacion entre paneles del selector --- */
function navegarRol(r) {
    const sel = document.getElementById('selector-rol');
    if      (r === 'empresa') panelActual = 0;
    else if (r === 'closer')  panelActual = 1;
    else if (r === 'cerrar')  panelActual = 2;
    sel.style.transform = `translateX(-${panelActual * 33.333}%)`;
    actualizarFlechas();
}

function actualizarFlechas() {
    const l = document.getElementById('btn-nav-left');
    const r = document.getElementById('btn-nav-right');
    if (panelActual === 0) {
        l.style.display = 'none';
        r.style.display = 'flex'; r.onclick = () => navegarRol('closer');
    } else if (panelActual === 1) {
        l.style.display = 'flex'; l.onclick = () => navegarRol('empresa');
        r.style.display = 'flex'; r.onclick = () => navegarRol('cerrar');
    } else if (panelActual === 2) {
        l.style.display = 'flex'; l.onclick = () => navegarRol('closer');
        r.style.display = 'none';
    }
}

/* --- Elegir rol y entrar al dashboard --- */
function elegirRol(role) {
    if (role === 'closer') {
        abrirDashboardCloser();
    } else if (role === 'empresa') {
        if (typeof abrirDashboardEmpresa === 'function') {
            abrirDashboardEmpresa();
        } else {
            alert('Perfil Empresa en construcción');
        }
    }
}

function mostrarLoginCloser() {
    const sel = document.getElementById('selector-rol');
    sel.innerHTML = `
        <div class="pantalla-rol" style="background: linear-gradient(to left, #b8b8b8, #dcdcdc); width: 100%;">
            <div style="font-size:0.9rem; letter-spacing:5px; margin-bottom:20px; color:#000;">SECCION PROFESIONAL</div>
            
            <div style="background:rgba(255,255,255,0.5);padding:20px;border-radius:10px;border:1px solid #000;max-width:280px;">
                <input type="text" id="login-email" class="input-elite" placeholder="Email" style="margin-bottom:10px;">
                <input type="password" id="login-password" class="input-elite" placeholder="Contraseña" style="margin-bottom:10px;">
                <button class="btn-rol" onclick="verificarLoginCloser()" style="background:#000;color:#fff;border-color:#000;padding:15px;font-size:0.9rem;width:100%;">INGRESAR</button>
                <div style="margin-top:12px; text-align:center;">
                    <span onclick="solicitarRecupero()" style="font-family:Arial, sans-serif; font-style:italic; font-size:0.8rem; color:#444; cursor:pointer; text-decoration:underline;">Olvidé mi contraseña</span>
                </div>
            </div>
            
            <button class="btn-rol" onclick="alert('Registro nuevo')" style="margin-top:15px;background:transparent;border:1px solid #000;color:#000;padding:10px;font-size:0.8rem;">NUEVO REGISTRO</button>
            <button class="btn-rol" onclick="sel.style.display='none';iniciarCierre()" style="margin-top:10px;background:transparent;border:none;color:#000;font-size:0.7rem;">VOLVER</button>
        </div>`;
    sel.style.display = 'flex';
    sel.style.transform = 'translateX(0%)';
    sel.style.width = '100%';
    document.querySelectorAll('.nav-arrow').forEach(a => a.style.display = 'none');
    setTimeout(() => document.getElementById('login-email')?.focus(), 300);
}

function verificarLoginCloser() {
    const email = document.getElementById('login-email')?.value?.trim();
    const pass = document.getElementById('login-password')?.value;
    
    if (!email || !pass) {
        alert('Completa email y contraseña');
        return;
    }
    
    const saved = localStorage.getItem('k_user_profile');
    if (!saved) {
        alert('Usuario no encontrado. Regístrate primero.');
        return;
    }
    
    try {
        const perfil = JSON.parse(saved);
        if (perfil.email !== email || perfil.password !== pass) {
            alert('Credenciales incorrectas');
            return;
        }
        
        regData = perfil;
        localStorage.setItem('k_examen_ok', '1');
        abrirDashboardCloser();
    } catch(e) {
        alert('Error al iniciar sesión');
    }
}

function abrirDashboardCloser() {
    const dash = document.getElementById('dashboard-closer');
    dash.style.display = 'flex';
    document.querySelectorAll('.nav-arrow').forEach(a => a.style.display = 'none');
    setTimeout(() => { 
        dash.style.transform = 'translateX(-100%)'; 
        setTimeout(() => {
            const saved = localStorage.getItem('k_user_profile');
            if (saved) {
                try {
                    regData = JSON.parse(saved);
                    mostrarInicioCloser();
                } catch(e) {
                    mostrarLoginDashboard();
                }
            } else {
                mostrarLoginDashboard();
            }
        }, 800);
    }, 50);
}

function mostrarLoginDashboard() {
    document.getElementById('spa-main-content').innerHTML = `
        <div class="card-pro">
            <h1 style="color:#000;">Acceso a la Bóveda</h1>
            
            <div style="background:rgba(255,255,255,0.3);padding:25px;border-radius:10px;border:1px solid #000;max-width:320px;margin:20px auto;">
                <label style="display:block;text-align:left;font-weight:800;color:#000;margin-bottom:5px;">EMAIL</label>
                <input type="email" id="dash-email" class="input-elite" placeholder="tu@email.com" style="margin-bottom:15px;">
                
                <label style="display:block;text-align:left;font-weight:800;color:#000;margin-bottom:5px;">CONTRASEÑA</label>
                <input type="password" id="dash-password" class="input-elite" placeholder="Mínimo 6 caracteres" style="margin-bottom:15px;">
                
                <button class="btn-kloz" onclick="verificarLoginDashboard()" style="width:100%;">INGRESAR</button>
                <div style="margin-top:12px; text-align:center;">
                    <span onclick="solicitarRecupero()" style="font-family:Arial, sans-serif; font-style:italic; font-size:0.8rem; color:#444; cursor:pointer; text-decoration:underline;">Olvidé mi contraseña</span>
                </div>
            </div>
            
            <button class="btn-kloz" onclick="mostrarRegistroDashboard()" style="background:transparent;border:1px solid #000;color:#000;">NUEVO REGISTRO</button>
        </div>`;
}

function verificarLoginDashboard() {
    const email = document.getElementById('dash-email')?.value?.trim();
    const pass = document.getElementById('dash-password')?.value;
    
    if (!email || !pass) {
        alert('Completa email y contraseña');
        return;
    }
    
    const saved = localStorage.getItem('k_user_profile');
    if (!saved) {
        alert('Usuario no encontrado. Regístrate primero.');
        return;
    }
    
    try {
        const perfil = JSON.parse(saved);
        if (perfil.email !== email || perfil.password !== pass) {
            alert('Credenciales incorrectas');
            return;
        }
        
        regData = perfil;
        localStorage.setItem('k_examen_ok', '1');
        setTimeout(() => mostrarInicioCloser(), 800);
    } catch(e) {
        alert('Error al iniciar sesión');
    }
}

function mostrarRegistroDashboard() {
    document.getElementById('spa-main-content').innerHTML = `
        <div class="card-pro" style="text-align:left;max-width:500px;">
            <h1 style="text-align:center;color:#000;">Nuevo Registro</h1>
            
            <div style="background:rgba(255,255,255,0.3);padding:20px;border-radius:10px;border:1px solid #000;">
                <label style="display:block;text-align:left;font-weight:800;color:#000;margin-bottom:5px;">NOMBRE COMPLETO</label>
                <input type="text" id="reg-nombre" class="input-elite" placeholder="Tu nombre" style="margin-bottom:15px;">
                
                <label style="display:block;text-align:left;font-weight:800;color:#000;margin-bottom:5px;">EMAIL</label>
                <input type="email" id="reg-email" class="input-elite" placeholder="tu@email.com" style="margin-bottom:15px;">
                
                <label style="display:block;text-align:left;font-weight:800;color:#000;margin-bottom:5px;">CONTRASEÑA</label>
                <input type="password" id="reg-pass" class="input-elite" placeholder="Mínimo 6 caracteres" style="margin-bottom:15px;">
                
                <button class="btn-kloz" onclick="guardarNuevoRegistro()" style="width:100%;">REGISTRARME</button>
                <button class="btn-kloz" onclick="mostrarLoginDashboard()" style="width:100%;background:transparent;border:1px solid #000;color:#000;margin-top:10px;">VOLVER</button>
            </div>
        </div>`;
}

function guardarNuevoRegistro() {
    const nombre = document.getElementById('reg-nombre')?.value?.trim();
    const email = document.getElementById('reg-email')?.value?.trim();
    const pass = document.getElementById('reg-pass')?.value;
    
    if (!nombre || !email || !pass) {
        alert('Completa todos los campos');
        return;
    }
    
    if (pass.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (typeof KlozDB === 'undefined') { console.log('Error DB'); return; }
    const isFounder = KlozDB.getClosers().length < 30;
    const fee = isFounder ? 10 : 50;

    regData = {
        nombre: nombre,
        email: email,
        password: pass,
        rango: 'Rookie',
        verificado: false,
        cuota: fee,
        founder: isFounder
    };
    
    localStorage.setItem('k_user_profile', JSON.stringify(regData));
    
    const showModal = (title, subtitle) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:999999; display:flex; justify-content:center; align-items:center; opacity:0; transition:0.3s;';
        
        const modal = document.createElement('div');
        modal.style.cssText = 'background: #e5e5e5; width:90%; max-width:450px; padding:40px; border-radius:10px; text-align:center; box-shadow:0 20px 50px rgba(0,0,0,0.7); transform:scale(0.9); transition:0.3s; color:#000; font-family:"Inter", sans-serif;';
        
        modal.innerHTML = `
            ${title.includes('Founder') ? '<div style="font-size:3.5rem; margin-bottom:15px; text-shadow: 0 4px 10px rgba(212,175,55,0.5);">👑</div>' : '<div style="font-size:3.5rem; margin-bottom:15px;">✔️</div>'}
            <h2 style="font-size:1.6rem; font-weight:900; margin:0 0 15px; color:#000; letter-spacing:1px; text-transform:uppercase;">${title}</h2>
            <p style="font-size:1rem; color:#333; margin:0 0 30px; line-height:1.6; font-weight:600;">${subtitle}</p>
            <button id="modal-ok-btn" style="background:#0a0a0a; color:#fff; border:2px solid #000; padding:16px 24px; font-weight:800; font-size:1rem; border-radius:6px; cursor:pointer; width:100%; transition:0.2s; letter-spacing:2px;">INGRESAR A LA BÓVEDA</button>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Anim out y OK
        document.getElementById('modal-ok-btn').onmouseover = function() { this.style.background = '#333'; }
        document.getElementById('modal-ok-btn').onmouseout = function() { this.style.background = '#0a0a0a'; }
        
        setTimeout(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);
        
        document.getElementById('modal-ok-btn').onclick = () => {
            overlay.style.opacity = '0';
            modal.style.transform = 'scale(0.8)';
            setTimeout(() => {
                overlay.remove();
                mostrarInicioCloser();
            }, 300);
        };
    };

    if (isFounder) {
        showModal("¡Miembro Founder!", "¡Felicidades " + nombre + "! Fuiste seleccionado como uno de los 30 primeros usuarios élite dentro de la aplicación. Tu cuota de acceso mensual especial queda asegurada en <strong>$10 USD / mes</strong>.");
    } else {
        showModal("Registro Exitoso", "Felicidades " + nombre + ", tu perfil ha sido creado exitosamente.");
    }
}

function mostrarPanelCloser() {
    document.getElementById('spa-main-content').innerHTML = `
        <div class="card-pro">
            <h1 style="color:#000;">Bienvenido, ${regData.nombre}</h1>
            <p style="color:#000;font-weight:600;">Tu panel de Closer</p>
            
            <div style="display:flex;gap:20px;justify-content:center;margin-top:40px;flex-wrap:wrap;">
                <button class="btn-kloz" onclick="abrirEmpresasDisponibles()">Empresas</button>
                <button class="btn-kloz" onclick="abrirChat()">Chat Ventas</button>
                <button class="btn-kloz" onclick="abrirPerfil()">Mi Perfil</button>
            </div>
        </div>`;
}

/* --- Volver al selector desde el dashboard --- */
function volverAlSelector() {
    const dash = document.getElementById('dashboard-closer');
    dash.style.transform = 'translateX(0%)';
    setTimeout(() => {
        dash.style.display = 'none';
        panelActual = 1;
        navegarRol('closer');
    }, 850);
}

function solicitarRecupero() {
    if (document.getElementById('ticket-bubble')) return; // already open

    const bubble = document.createElement('div');
    bubble.id = 'ticket-bubble';
    bubble.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        background: linear-gradient(135deg, #1a1a1a, #050505);
        border: 1px solid #444;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.8);
        z-index: 99999;
        font-family: 'Inter', sans-serif;
        color: #ddd;
        animation: slideInRight 0.3s ease-out;
    `;

    // Animación de entrada
    if (!document.getElementById('ticket-anim-style')) {
        const style = document.createElement('style');
        style.id = 'ticket-anim-style';
        style.innerHTML = `
            @keyframes slideInRight { from { transform: translateX(120%); opacity:0; } to { transform: translateX(0); opacity:1; } }
            @keyframes fadeOutRight { from { transform: translateX(0); opacity:1; } to { transform: translateX(120%); opacity:0; } }
        `;
        document.head.appendChild(style);
    }

    bubble.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 1rem; color: #fff; font-weight: 600; letter-spacing: 1px;">Soporte KLOZ</h3>
            <span id="close-ticket" style="cursor:pointer; color: #888; font-size: 1.2rem;">&times;</span>
        </div>
        <p style="font-size: 0.8rem; color: #999; margin-bottom: 15px;">Ingresa tus datos para recuperar el acceso a la bóveda.</p>
        
        <input type="email" id="ticket-email" placeholder="Email registrado" style="width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.05); border: 1px solid #333; color: #fff; padding: 10px; border-radius: 4px; margin-bottom: 12px; font-family: 'Inter', sans-serif; font-size: 0.9rem;" outline="none">
        
        <textarea id="ticket-msg" placeholder="Describe tu problema con el acceso..." rows="4" style="width: 100%; box-sizing: border-box; background: rgba(255,255,255,0.05); border: 1px solid #333; color: #fff; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-family: 'Inter', sans-serif; font-size: 0.9rem; resize: none;" outline="none"></textarea>
        
        <button id="send-ticket" style="width: 100%; background: #333; color: #fff; border: 1px solid #555; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: 600; font-family: 'Inter', sans-serif; transition: 0.2s;">ENVIAR TICKET</button>
    `;

    document.body.appendChild(bubble);

    // Lógica para cerrar
    function closeBubble() {
        bubble.style.animation = 'fadeOutRight 0.3s ease-in forwards';
        setTimeout(() => bubble.remove(), 300);
    }

    document.getElementById('close-ticket').onclick = closeBubble;

    // Lógica para enviar
    document.getElementById('send-ticket').onclick = function() {
        const email = document.getElementById('ticket-email').value.trim();
        const msg = document.getElementById('ticket-msg').value.trim();

        if (!email || !msg) {
            const btn = document.getElementById('send-ticket');
            const originalText = btn.innerText;
            btn.innerText = "COMPLETA TODOS LOS CAMPOS";
            btn.style.background = "#550000";
            btn.style.borderColor = "#990000";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "#333";
                btn.style.borderColor = "#555";
            }, 2000);
            return;
        }

        if (typeof KlozDB === 'undefined') { 
            console.log('Error DB'); 
            return; 
        }

        const tickets = KlozDB.getTickets();
        tickets.push({
            id: 'tkt_' + new Date().getTime(),
            fecha: new Date().toLocaleDateString('es-AR'),
            email: email,
            mensaje: msg
        });
        KlozDB.saveTickets(tickets);

        bubble.innerHTML = `
            <div style="text-align:center; padding: 20px 0;">
                <h3 style="margin: 0; font-size: 1.1rem; color: #fff;">Ticket Enviado</h3>
                <p style="font-size: 0.85rem; color: #aaa; margin-top: 10px;">Revisaremos tu caso a la brevedad.</p>
            </div>
        `;
        setTimeout(closeBubble, 2500);
    };
}


