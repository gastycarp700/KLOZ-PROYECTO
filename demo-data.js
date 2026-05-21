/* =====================================================
   KLOZ - DEMO-DATA.JS
   Datos ficticios compartidos: empresas y closers
   Usado por app.js (closer) y empresa.js (empresa)
   ===================================================== */
const SUPABASE_URL = 'https://wzuhqobvhfkrkohduqxe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LKR2OXliZWZsqY-nbTrXng_ir8eupgn';

const KLOZ_EMPRESAS = [
    {
        id: "emp001",
        nombre: "TechSales Pro",
        industria: "Software / SaaS",
        descripcion: "Plataforma de gestion empresarial para PyMEs. Buscamos closers con experiencia en tecnologia.",
        pais: "Argentina",
        ciudad: "Buenos Aires",
        comision: 12,
        ticketPromedio: 2400,
        rangoRequerido: "Senior",
        especialidad: "Software",
        logoLetra: "T",
        color: "#2c3e50",
        activa: true
    },
    {
        id: "emp002",
        nombre: "Inmobiliaria Horizonte",
        industria: "Inmobiliaria",
        descripcion: "Proyectos residenciales premium en toda Latinoamerica. Alto ticket, comision generosa.",
        pais: "Mexico",
        ciudad: "Ciudad de Mexico",
        comision: 8,
        ticketPromedio: 85000,
        rangoRequerido: "Junior",
        especialidad: "Inmobiliaria",
        logoLetra: "H",
        color: "#8e44ad",
        activa: true
    },
    {
        id: "emp003",
        nombre: "HealthCoach Elite",
        industria: "Salud y Bienestar",
        descripcion: "Programas de coaching de salud de alto impacto. Clientes con poder adquisitivo alto.",
        pais: "Espana",
        ciudad: "Madrid",
        comision: 15,
        ticketPromedio: 3800,
        rangoRequerido: "Master",
        especialidad: "Salud",
        logoLetra: "H",
        color: "#16a085",
        activa: true
    },
    {
        id: "emp004",
        nombre: "EduFinance Academy",
        industria: "Educacion Financiera",
        descripcion: "Cursos y mentoria financiera. Ticket medio, gran volumen de leads calificados.",
        pais: "Colombia",
        ciudad: "Bogota",
        comision: 5,
        ticketPromedio: 900,
        rangoRequerido: "Rookie",
        especialidad: "Educacion",
        logoLetra: "E",
        color: "#d35400",
        activa: true
    },
    {
        id: "emp005",
        nombre: "LogisticMax",
        industria: "Logistica y Supply Chain",
        descripcion: "Solucion B2B de logistica. Buscamos closers con perfil corporativo y experiencia en empresas.",
        pais: "Chile",
        ciudad: "Santiago",
        comision: 10,
        ticketPromedio: 15000,
        rangoRequerido: "Senior",
        especialidad: "Corporativo",
        logoLetra: "L",
        color: "#2980b9",
        activa: true
    }
];

const KLOZ_CLOSERS_DEMO = [
    {
        id: "cls001",
        nombre: "Martina Rojas",
        rango: "Master",
        especialidad: "Software / SaaS",
        pais: "Argentina",
        ciudad: "Rosario",
        cierre: 78,
        ticket: 3200,
        email: "martina@ejemplo.com",
        whatsapp: "+5493413456789",
        logros: "Cerro mas de $500k en ventas en 2024. Top performer por 6 meses consecutivos.",
        verificado: true,
        foto: null
    },
    {
        id: "cls002",
        nombre: "Carlos Mendez",
        rango: "Senior",
        especialidad: "Inmobiliaria",
        pais: "Mexico",
        ciudad: "Monterrey",
        cierre: 62,
        ticket: 75000,
        email: "carlos@ejemplo.com",
        whatsapp: "+5218112345678",
        logros: "Especialista en propiedades de lujo. 8 anos en el rubro.",
        verificado: true,
        foto: null
    },
    {
        id: "cls003",
        nombre: "Sofia Leal",
        rango: "Junior",
        especialidad: "Educacion",
        pais: "Colombia",
        ciudad: "Medellin",
        cierre: 45,
        ticket: 800,
        email: "sofia@ejemplo.com",
        whatsapp: "+573112345678",
        logros: "Manejo de objeciones solido. En crecimiento constante.",
        verificado: true,
        foto: null
    },
    {
        id: "cls004",
        nombre: "Diego Ferreyra",
        rango: "Master",
        especialidad: "Salud y Bienestar",
        pais: "Argentina",
        ciudad: "Cordoba",
        cierre: 81,
        ticket: 4500,
        email: "diego@ejemplo.com",
        whatsapp: "+5493514567890",
        logros: "Mejor closer de la region en 2023. Especializado en programas premium de salud.",
        verificado: true,
        foto: null
    },
    {
        id: "cls005",
        nombre: "Lucia Torres",
        rango: "Rookie",
        especialidad: "Educacion Financiera",
        pais: "Uruguay",
        ciudad: "Montevideo",
        cierre: 30,
        ticket: 500,
        email: "lucia@ejemplo.com",
        whatsapp: "+59891234567",
        logros: "Recien iniciada, con gran actitud y hambre de aprendizaje.",
        verificado: true,
        foto: null
    },
    {
        id: "cls006",
        nombre: "Andres Vega",
        rango: "Senior",
        especialidad: "Software / SaaS",
        pais: "Chile",
        ciudad: "Santiago",
        cierre: 59,
        ticket: 2800,
        email: "andres@ejemplo.com",
        whatsapp: "+56912345678",
        logros: "Ex vendedor corporativo. Especialista en demos tecnicas y cierre B2B.",
        verificado: true,
        foto: null
    }
];

/* Funcion de utilidad: dado el % de comision que ofrece una empresa,
   devuelve el score de relevancia de un closer (mayor = mas relevante) */
function scoreRelevancia(closer, comisionEmpresa) {
    const rangoPts = { Rookie: 1, Junior: 2, Senior: 3, Master: 4 };
    const pts = rangoPts[closer.rango] || 1;

    /* La empresa paga mucho ? busca closers de rango alto */
    const match = comisionEmpresa >= 15 ? (pts === 4 ? 100 : pts * 20) :
                  comisionEmpresa >= 10 ? (pts === 3 ? 100 : pts * 22) :
                  comisionEmpresa >= 5  ? (pts === 2 ? 100 : pts * 18) :
                                          (pts === 1 ? 100 : pts * 12);

    return match + (closer.cierre || 0) * 0.5;
}

/* =====================================================
   KlozDB - GESTOR DE DATOS COMPARTIDO (LOCALSTORAGE)
   ===================================================== */
const KlozDB = {
    init: function() {
        if (!localStorage.getItem('kloz_db_empresas')) {
            const mappedEmpresas = KLOZ_EMPRESAS.map(e => ({...e, cuota: 20, tokens: 15}));
            localStorage.setItem('kloz_db_empresas', JSON.stringify(mappedEmpresas));
        }
        if (!localStorage.getItem('kloz_db_closers')) {
            const mappedClosers = KLOZ_CLOSERS_DEMO.map((c, idx) => ({...c, cuota: 10, founder: true}));
            localStorage.setItem('kloz_db_closers', JSON.stringify(mappedClosers));
        }
    },
    getEmpresas: function() {
        try {
            return JSON.parse(localStorage.getItem('kloz_db_empresas')) || [];
        } catch(e) { return KLOZ_EMPRESAS; }
    },
    saveEmpresas: function(arr) {
        localStorage.setItem('kloz_db_empresas', JSON.stringify(arr));
    },
    getTickets: function() { try { return JSON.parse(localStorage.getItem('kloz_db_tickets')) || []; } catch(e) { return []; } },
    saveTickets: function(arr) { localStorage.setItem('kloz_db_tickets', JSON.stringify(arr)); },
    getClosers: function() {
        try {
            let closers = JSON.parse(localStorage.getItem('kloz_db_closers')) || [];
            let needsPatch = false;
            closers.forEach((c, i) => {
                if (typeof c.founder === 'undefined') {
                    c.cuota = (i < 30) ? 10 : 50;
                    c.founder = (i < 30);
                    needsPatch = true;
                }
            });
            if (needsPatch) localStorage.setItem('kloz_db_closers', JSON.stringify(closers));
            return closers;
        } catch(e) { return KLOZ_CLOSERS_DEMO; }
    },
    saveClosers: function(arr) {
        localStorage.setItem('kloz_db_closers', JSON.stringify(arr));
    }
};

KlozDB.init();

var supabase = null;
if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}







