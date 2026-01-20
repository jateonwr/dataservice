// Core Application Logic

// Global State
let currentPage = 'home'; // Start at home (Public)
let isLoggedIn = false;
let cart = [];
let redirectAfterLogin = null; // Store intended page

// DOM Elements
const mainContent = document.getElementById('main-content');
const pageTitle = document.getElementById('page-title'); // If we have one
const navLinks = document.querySelectorAll('.nav-link');
const sidebar = document.getElementById('main-sidebar');

// --- Initialization ---
function initApp() {
    setupNavigation();
    
    // Check session manually (simple mock)
    // if(localStorage.getItem('isLoggedIn')) isLoggedIn = true; 
    
    renderPage(currentPage);
    updateAuthUI();
}

// --- User UI Updates ---
function updateAuthUI() {
    const sidebarFooter = document.querySelector('.border-t.border-slate-200 .flex');
    const headerLoginBtn = document.getElementById('header-login-btn');
    const navUserSection = document.getElementById('nav-user-section');
    
    if (isLoggedIn) {
        // 1. Sidebar Footer: Show User Profile
        const user = MOCK_DB.USER;
        sidebarFooter.innerHTML = `
            <div onclick="switchPage('profile')" class="flex items-center gap-3 flex-1 cursor-pointer hover:bg-slate-50 p-2 -ml-2 rounded-lg transition group">
                <img src="${user.avatar}" class="w-10 h-10 rounded-full user-avatar group-hover:ring-2 group-hover:ring-primary transition">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-900 truncate user-name">${user.name}</p>
                    <p class="text-xs text-slate-500 truncate user-dept">${user.group}</p>
                </div>
            </div>
            <button onclick="handleLogout()" class="text-slate-400 hover:text-red-500 transition p-2" title="ออกจากระบบ">
                <i class="fa-solid fa-right-from-bracket"></i>
            </button>
        `;

        // 2. Header: Hide Login Button
        if(headerLoginBtn) headerLoginBtn.classList.add('hidden');
        
        // 3. Show User Section
        if(navUserSection) navUserSection.classList.remove('hidden');

    } else {
        // 1. Sidebar Footer: Show Login Button (Updated Style)
        sidebarFooter.innerHTML = `
            <button onclick="switchPage('login')" class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition shadow-sm">
                <i class="fa-solid fa-right-to-bracket"></i> เข้าสู่ระบบ
            </button>
        `;

        // 2. Header: Show Login Button
        if(headerLoginBtn) headerLoginBtn.classList.remove('hidden');

        // 3. Hide User Section
        if(navUserSection) navUserSection.classList.add('hidden');
    }
    
    // Update Cart Visibility based on new Auth State
    updateCartVisibility();
}

function toggleSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    if (!sidebar) return;
    
    // Mobile: Toggle visibility by adding/removing 'hidden'
    // The sidebar has class "flex hidden md:flex" initially
    // On mobile (< 768px): md:flex doesn't apply, so 'hidden' hides it
    // We simply toggle 'hidden' to show/hide
    
    if (sidebar.classList.contains('hidden')) {
        // Show sidebar
        sidebar.classList.remove('hidden');
        // Add overlay for mobile
        if (window.innerWidth < 768) {
            let overlay = document.getElementById('sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'sidebar-overlay';
                overlay.className = 'fixed inset-0 bg-black/50 z-[5] md:hidden';
                overlay.onclick = toggleSidebar;
                document.body.appendChild(overlay);
            }
            overlay.classList.remove('hidden');
        }
    } else {
        // Hide sidebar
        sidebar.classList.add('hidden');
        // Remove overlay
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.add('hidden');
    }
}

function updateCartVisibility() {
    const cartBtn = document.getElementById('header-cart-btn');
    if (!cartBtn) return;

    // Show ONLY if Logged In AND on Catalog Page
    if (isLoggedIn && currentPage === 'catalog') {
        cartBtn.classList.remove('hidden');
    } else {
        cartBtn.classList.add('hidden');
    }
}

// --- Navigation ---
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            switchPage(targetPage);
        });
    });
}

function switchPage(page) {
    // Update Active State
    navLinks.forEach(l => {
        l.classList.remove('bg-blue-50', 'text-primary');
        l.classList.add('text-slate-600', 'hover:bg-slate-50');
    });

    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if(activeLink) {
        activeLink.classList.remove('text-slate-600', 'hover:bg-slate-50');
        activeLink.classList.add('bg-blue-50', 'text-primary');
    }

    currentPage = page;
    renderPage(currentPage);
    updateAuthUI(); // This now calls updateCartVisibility()
    updateCartVisibility(); // Extra call to ensure it updates for page change even if auth didn't change
}
function renderPage(page) {
    // Auth Guard
    // Allow 'home' and 'login' without auth
    if (!isLoggedIn && page !== 'login' && page !== 'home') {
        // Save target page to redirect after login
        redirectAfterLogin = page;
        renderLogin();
        // Hide sidebar
        if(sidebar) sidebar.classList.add('hidden');
        return;
    }
    
    if (isLoggedIn) {
        // Show sidebar if logged in
        if(sidebar) sidebar.classList.remove('hidden');
        sidebar.classList.add('md:flex');
    } else {
        // Show sidebar for guests too (User Request: "Main Page as First Page")
        if(sidebar) sidebar.classList.remove('hidden');
        sidebar.classList.add('md:flex');
    }

    mainContent.innerHTML = ''; // Clear current content
    
    switch(page) {
        case 'login':
            renderLogin();
            break;
        case 'home':
            renderHome();
            break;
        case 'catalog':
            renderCatalog();
            break;
        case 'map':
            renderMap();
            break;
        case 'history':
            renderHistory();
            break;
        case 'profile':
            renderProfile();
            break;
        case 'survey':
            renderSurvey();
            break;
        case 'dashboard':
            renderDashboard();
            break;
        case 'tracking':
            renderTracking();
            break;
        default:
            renderHome();
    }
}

// ... (Auth functions omitted for brevity) ...

// --- Page Renderers ---

function renderTracking() {
    let html = `
        <div class="max-w-5xl mx-auto space-y-6 fade-in pb-20">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">ติดตามสถานะคำขอ (Tracking)</h1>
                    <p class="text-slate-500">ตรวจสอบความคืบหน้าของคำขอข้อมูลของคุณอย่างละเอียด</p>
                </div>
                <div class="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold">
                    <i class="fa-solid fa-info-circle"></i> Service Level Agreement: 3 วันทำการ
                </div>
            </div>
    `;

    MOCK_DB.HISTORY.forEach((req, index) => {
        // Mock timeline if not present
        const timeline = req.timeline || [
            { status: "submitted", date: req.date, desc: "ยื่นคำขอเรียบร้อย" },
            { status: "pending", date: "-", desc: "อยู่ระหว่างการพิจารณา" }
        ];

        // Determine active step index
        let activeIndex = 0;
        if (req.status === 'completed' || req.status === 'ready') activeIndex = 3;
        else if (req.status === 'processing') activeIndex = 2;
        else if (req.status === 'approved') activeIndex = 1;

        html += `
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition" onclick="document.getElementById('track-detail-${index}').classList.toggle('hidden'); document.getElementById('arrow-${index}').classList.toggle('rotate-180')">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-${req.status === 'ready' || req.status === 'completed' ? 'green' : 'blue'}-100 text-${req.status === 'ready' || req.status === 'completed' ? 'green' : 'blue'}-600 flex items-center justify-center font-bold">
                            <i class="fa-solid fa-box-open"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-slate-800">${req.id}</h4>
                            <p class="text-xs text-slate-500">${req.items.join(', ')}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="px-3 py-1 rounded-full text-xs font-bold bg-${req.status === 'ready' || req.status === 'completed' ? 'green' : (req.status === 'processing' ? 'blue' : 'gray')}-100 text-${req.status === 'ready' || req.status === 'completed' ? 'green' : (req.status === 'processing' ? 'blue' : 'gray')}-700">
                            ${req.statusLabel}
                        </span>
                        <i id="arrow-${index}" class="fa-solid fa-chevron-down text-slate-400 transition-transform"></i>
                    </div>
                </div>

                <!-- Timeline Details -->
                <div id="track-detail-${index}" class="p-6 hidden bg-white">
                    <div class="relative">
                        <!-- Connecting Line -->
                        <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                        <!-- Steps -->
                        <div class="space-y-6 relative z-10">
                            ${generateTimelineItem('completed', 'ยื่นคำร้อง', timeline[0]?.date || req.date, 'ระบบได้รับคำขอแล้ว')}
                            ${generateTimelineItem(activeIndex >= 1 ? 'completed' : 'pending', 'ตรวจสอบ/อนุมัติ', activeIndex >= 1 ? timeline[1]?.date || 'รออนุมัติ' : '-', 'เจ้าหน้าที่ตรวจสอบความถูกต้อง')}
                            ${generateTimelineItem(activeIndex >= 2 ? 'active' : 'pending', 'กำลังดำเนินการ', activeIndex >= 2 ? timeline[2]?.date || 'กำลังรวบรวม' : '-', 'รวบรวมและจัดเตรียมไฟล์ข้อมูล')}
                            ${generateTimelineItem(activeIndex >= 3 ? 'completed' : 'pending', 'พร้อมส่งมอบ', activeIndex >= 3 ? timeline[3]?.date || '-' : '-', 'ข้อมูลพร้อมให้ดาวน์โหลด')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    mainContent.innerHTML = html;
}

function generateTimelineItem(status, title, date, desc) {
    let icon = 'fa-circle';
    let colorClass = 'bg-slate-200 text-slate-400 border-white';
    
    if (status === 'completed') {
        icon = 'fa-check';
        colorClass = 'bg-green-500 text-white border-green-100';
    } else if (status === 'active') {
        icon = 'fa-spinner fa-spin';
        colorClass = 'bg-blue-500 text-white border-blue-100';
    }

    return `
        <div class="flex gap-4 items-start pl-8 relative">
            <div class="absolute left-2.5 top-1 -translate-x-1/2 w-8 h-8 rounded-full ${colorClass} border-4 flex items-center justify-center shadow-sm">
                <i class="fa-solid ${icon} text-xs"></i>
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-start">
                    <h5 class="font-bold text-slate-800 text-sm">${title}</h5>
                    <span class="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded">${date}</span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">${desc}</p>
            </div>
        </div>
    `;
}

function renderDashboard() {
    const stats = MOCK_DB.KPI_STATS || {
        total_requests: 0,
        completed_requests: 0,
        pending_requests: 0,
        user_satisfaction: 0,
        monthly_trend: [],
        top_datasets: [],
        sla_met: 0
    };
    
    const catalog = MOCK_DB.CATALOG || [];
    const history = MOCK_DB.HISTORY || [];
    const dataRequests = MOCK_DB.DATA_REQUESTS || [];

    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6 fade-in pb-20">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <p class="text-slate-500">รายงานสรุปผลการดำเนินงานและการให้บริการข้อมูล</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live Updates
                    </span>
                    <button class="text-sm text-primary hover:underline"><i class="fa-solid fa-print mr-1"></i> พิมพ์รายงาน</button>
                </div>
            </div>

            <!-- 1. KPI Cards - 6 cards -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md hover:border-blue-200 transition">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                            <i class="fa-solid fa-file-lines"></i>
                        </div>
                        <span class="text-2xl font-bold text-slate-800">${stats.total_requests.toLocaleString()}</span>
                    </div>
                    <p class="text-xs text-slate-500 font-bold">คำขอทั้งหมด</p>
                    <p class="text-[10px] text-green-600 font-bold mt-1"><i class="fa-solid fa-arrow-trend-up"></i> +12% จากเดือนก่อน</p>
                </div>
                <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md hover:border-green-200 transition">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                            <i class="fa-solid fa-check-double"></i>
                        </div>
                        <span class="text-2xl font-bold text-green-600">${stats.completed_requests.toLocaleString()}</span>
                    </div>
                    <p class="text-xs text-slate-500 font-bold">ดำเนินการแล้ว</p>
                    <p class="text-[10px] text-green-600 font-bold mt-1">SLA Met: ${stats.sla_met}%</p>
                </div>
                <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md hover:border-orange-200 transition">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                            <i class="fa-solid fa-clock"></i>
                        </div>
                        <span class="text-2xl font-bold text-orange-600">${stats.pending_requests.toLocaleString()}</span>
                    </div>
                    <p class="text-xs text-slate-500 font-bold">รอดำเนินการ</p>
                    <p class="text-[10px] text-orange-500 font-bold mt-1">อยู่ในเกณฑ์ปกติ</p>
                </div>
                <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md hover:border-yellow-200 transition">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <span class="text-2xl font-bold text-slate-800">${stats.user_satisfaction}</span>
                    </div>
                    <p class="text-xs text-slate-500 font-bold">ความพึงพอใจ</p>
                    <div class="flex text-yellow-400 text-[10px] mt-1">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>
                    </div>
                </div>
                <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md hover:border-purple-200 transition">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                            <i class="fa-solid fa-database"></i>
                        </div>
                        <span class="text-2xl font-bold text-purple-600">${catalog.length}</span>
                    </div>
                    <p class="text-xs text-slate-500 font-bold">ชุดข้อมูลในคลัง</p>
                    <p class="text-[10px] text-purple-500 font-bold mt-1 cursor-pointer hover:underline" onclick="switchPage('catalog')">ดูทั้งหมด →</p>
                </div>
                <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md hover:border-teal-200 transition">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                            <i class="fa-solid fa-award"></i>
                        </div>
                        <span class="text-2xl font-bold text-teal-600">#${stats.open_data_ranking}</span>
                    </div>
                    <p class="text-xs text-slate-500 font-bold">อันดับความโปร่งใส</p>
                    <p class="text-[10px] text-teal-500 font-bold mt-1">Open Data Ranking</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- 2. Chart Section -->
                <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 class="font-bold text-slate-800 mb-6">สถิติการยื่นคำขอรายเดือน (Monthly Requests)</h3>
                    <div class="h-64 flex items-end justify-between gap-2 px-2">
                        ${stats.monthly_trend.map((val, i) => `
                            <div class="w-full bg-blue-50 rounded-t-sm relative group hover:bg-blue-100 transition-colors flex flex-col justify-end items-center">
                                <div class="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm relative transition-all duration-500" style="height: ${val/1.5}%;">
                                    <span class="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">${val}</span>
                                </div>
                                <span class="text-[10px] text-slate-400 mt-2">${['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][i]}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 3. Top Datasets -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-fire text-orange-500"></i> 5 อันดับข้อมูลยอดนิยม
                    </h3>
                    <div class="space-y-4">
                        ${stats.top_datasets.map((d, i) => `
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full ${i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-slate-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-600'} font-bold flex items-center justify-center text-xs">
                                    ${i+1}
                                </div>
                                <div class="flex-1">
                                    <div class="flex justify-between mb-1">
                                        <h4 class="text-xs font-bold text-slate-700 truncate w-40">${d.name}</h4>
                                        <span class="text-xs text-slate-500">${d.count} ครั้ง</span>
                                    </div>
                                    <div class="w-full bg-slate-100 rounded-full h-1.5">
                                        <div class="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full" style="width: ${(d.count / stats.top_datasets[0].count) * 100}%"></div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- 4. Data Quality & Governance Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4 opacity-5">
                        <i class="fa-solid fa-scale-balanced text-9xl"></i>
                    </div>
                    <h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                        <i class="fa-solid fa-gavel text-primary"></i> Data Governance
                    </h3>
                    <div class="flex items-center gap-6 relative z-10">
                        <div class="text-center">
                            <div class="w-24 h-24 rounded-full border-8 border-blue-500 flex items-center justify-center relative bg-blue-50">
                                <span class="text-3xl font-bold text-slate-800">${stats.governance_score}</span>
                            </div>
                            <span class="text-xs text-slate-400 font-bold mt-2 block">SCORE</span>
                        </div>
                        <div class="flex-1 space-y-3">
                            <div class="p-3 bg-green-50 rounded-lg text-xs text-green-700 border border-green-100 flex items-center gap-2">
                                <i class="fa-solid fa-check-circle"></i> ผ่านเกณฑ์มาตรฐาน DGA
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-slate-600">Openness Rank</span>
                                <span class="font-bold text-blue-600">#${stats.open_data_ranking}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-magnifying-glass-chart text-green-500"></i> Quality Assessment
                    </h3>
                    <div class="grid grid-cols-2 gap-3">
                        ${Object.entries(stats.data_quality || {}).map(([key, val]) => `
                            <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-[10px] font-bold text-slate-500 uppercase">${key}</span>
                                    <span class="text-sm font-bold ${val >= 90 ? 'text-green-600' : 'text-yellow-600'}">${val}%</span>
                                </div>
                                <div class="w-full bg-slate-200 rounded-full h-1.5">
                                    <div class="bg-gradient-to-r ${val >= 90 ? 'from-green-400 to-green-600' : 'from-yellow-400 to-yellow-600'} h-1.5 rounded-full" style="width: ${val}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-building text-indigo-500"></i> หน่วยงานขอข้อมูลสูงสุด
                    </h3>
                    <div class="space-y-3">
                        ${(stats.top_agencies || []).map((a, i) => `
                            <div class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition">
                                <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">${i+1}</div>
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-slate-700 truncate">${a.name}</p>
                                </div>
                                <span class="text-xs font-bold text-indigo-600">${a.count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- 5. Recent Activity & Catalog Preview -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-slate-800 flex items-center gap-2">
                            <i class="fa-solid fa-clock-rotate-left text-blue-500"></i> กิจกรรมล่าสุด
                        </h3>
                        <button onclick="switchPage('history')" class="text-xs text-primary font-bold hover:underline">ดูทั้งหมด →</button>
                    </div>
                    <div class="space-y-3 max-h-[200px] overflow-y-auto">
                        ${history.slice(0, 4).map(h => `
                            <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition cursor-pointer">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white ${h.status === 'ready' ? 'bg-green-500' : h.status === 'processing' ? 'bg-blue-500' : 'bg-yellow-500'}">
                                    <i class="fa-solid ${h.status === 'ready' ? 'fa-check' : h.status === 'processing' ? 'fa-spinner fa-spin' : 'fa-clock'}"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-bold text-slate-700 truncate">${h.id}</p>
                                    <p class="text-xs text-slate-500">${h.items.join(', ')}</p>
                                </div>
                                <span class="px-2 py-1 text-[10px] font-bold rounded-full ${h.status === 'ready' ? 'bg-green-100 text-green-700' : h.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}">${h.statusLabel}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-slate-800 flex items-center gap-2">
                            <i class="fa-solid fa-database text-teal-500"></i> ข้อมูลล่าสุดในคลัง
                        </h3>
                        <button onclick="switchPage('catalog')" class="text-xs text-primary font-bold hover:underline">ดูทั้งหมด →</button>
                    </div>
                    <div class="space-y-3 max-h-[200px] overflow-y-auto">
                        ${catalog.slice(0, 4).map(item => `
                            <div onclick="renderCatalogDetail(${item.id})" class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition cursor-pointer">
                                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-blue-600">
                                    <i class="fa-solid ${item.icon || 'fa-layer-group'}"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-bold text-slate-700 truncate">${item.title}</p>
                                    <p class="text-xs text-slate-500">${item.type}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

        </div>
    `;
}

// Initial placeholder/old history function - will be replaced by switchPage calling renderHistory if needed, 
// but we already have a table row renderHistory above? 
// Wait, the original renderHistory was for the user table. 
// We should check if we overwrote it.
// The replace instruction said "Implement renderTracking and renderDashboard... and update renderPage switch".
// Let's verify we didn't delete renderHistory. 
// The diff starts replacing at case 'map', so renderHistory might be safe or replaced. 
// Actually, I need to make sure I don't break existing 'renderHistory'.
// The previous step `replace_file_content` replaced lines 95-108 which contained the switch case.
// It seems I need to be careful.
// Let's check `app.js` content again to be safe.

function renderLogin() {
    if(sidebar) sidebar.classList.add('hidden');
    sidebar.classList.remove('md:flex');

    mainContent.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center bg-slate-50 fade-in relative">
             <button onclick="switchPage('home')" class="absolute top-6 left-6 text-slate-500 hover:text-primary flex items-center gap-2 font-medium">
                <i class="fa-solid fa-arrow-left"></i> กลับหน้าหลัก
            </button>

            <!-- Auth Card -->
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200" id="auth-container">
                
                <!-- Tab Header -->
                <div class="flex text-sm font-bold">
                    <button onclick="toggleAuthTab('user')" id="tab-user" class="flex-1 py-4 text-center bg-primary text-white transition-colors">
                        ผู้ใช้งานทั่วไป (User)
                    </button>
                    <button onclick="toggleAuthTab('staff')" id="tab-staff" class="flex-1 py-4 text-center bg-slate-800 text-slate-400 hover:text-white transition-colors">
                        เจ้าหน้าที่ (Staff)
                    </button>
                </div>

                <div class="p-8">
                    <!-- User Section -->
                    <div id="auth-user-section">
                        <!-- User Login Form -->
                        <div id="login-form">
                            <div class="text-center mb-8">
                                <h1 class="text-2xl font-bold text-slate-800">เข้าสู่ระบบ</h1>
                                <p class="text-slate-500">ระบบบริการข้อมูลภาครัฐ (Data Center)</p>
                            </div>
                            
                            <form onsubmit="handleLogin(event)" class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ใช้งาน</label>
                                    <div class="relative">
                                        <input type="text" name="username" value="user.thai" required class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                                        <i class="fa-solid fa-user absolute left-3 top-2.5 text-slate-400"></i>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
                                    <div class="relative">
                                        <input type="password" name="password" value="123456" required class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                                        <i class="fa-solid fa-lock absolute left-3 top-2.5 text-slate-400"></i>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between text-sm">
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" class="rounded text-primary focus:ring-primary">
                                        <span class="text-slate-600">จำการเข้าสู่ระบบ</span>
                                    </label>
                                    <a href="#" class="text-primary hover:underline">ลืมรหัสผ่าน?</a>
                                </div>
                                
                                <button type="submit" class="w-full bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg flex justify-center items-center gap-2">
                                    เข้าสู่ระบบ <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </form>

                            <div class="mt-6 text-center text-sm">
                                <span class="text-slate-500">ยังไม่มีบัญชีผู้ใช้งาน?</span>
                                <button onclick="toggleLoginMode('register')" class="text-primary font-bold hover:underline ml-1">สมัครสมาชิก</button>
                            </div>
                        </div>

                        <!-- User Register Form (Hidden) -->
                        <div id="register-form" class="hidden">
                            <div class="text-center mb-8">
                                <h1 class="text-2xl font-bold text-slate-800">สมัครสมาชิก</h1>
                                <p class="text-slate-500">สร้างบัญชีผู้ใช้งานใหม่</p>
                            </div>
                            
                            <form onsubmit="handleRegister(event)" class="space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-1">ชื่อ</label>
                                        <input type="text" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-1">นามสกุล</label>
                                        <input type="text" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-1">หน่วยงาน</label>
                                    <input type="text" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                                    <input type="email" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-1">ตั้งรหัสผ่าน</label>
                                    <input type="password" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                                </div>
                                
                                <button type="submit" class="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition shadow-lg mt-2">
                                    ยืนยันการสมัคร
                                </button>
                            </form>

                            <div class="mt-6 text-center text-sm">
                                <span class="text-slate-500">มีบัญชีอยู่แล้ว?</span>
                                <button onclick="toggleLoginMode('login')" class="text-primary font-bold hover:underline ml-1">เข้าสู่ระบบ</button>
                            </div>
                        </div>
                    </div>

                    <!-- Staff Section (Hidden) -->
                    <div id="auth-staff-section" class="hidden">
                        <div class="text-center mb-8">
                             <div class="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                                <i class="fa-solid fa-user-shield"></i>
                            </div>
                            <h1 class="text-2xl font-bold text-slate-800">เจ้าหน้าที่</h1>
                            <p class="text-slate-500">เข้าสู่ระบบจัดการหลังบ้าน (Admin)</p>
                        </div>
                        
                        <form onsubmit="handleStaffLogin(event)" class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Username</label>
                                <div class="relative">
                                    <input type="text" name="username" value="admin" required class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm">
                                    <i class="fa-solid fa-id-card absolute left-3 top-2.5 text-slate-400"></i>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <div class="relative">
                                    <input type="password" name="password" value="123456" required class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm">
                                    <i class="fa-solid fa-key absolute left-3 top-2.5 text-slate-400"></i>
                                </div>
                            </div>
                            
                            <button type="submit" class="w-full bg-slate-800 text-white py-2.5 rounded-lg font-bold hover:bg-slate-900 transition shadow-lg flex justify-center items-center gap-2">
                                เข้าสู่ระบบ Admin <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </form>
                    </div>

                </div>
            </div>
            
            <div class="mt-8 text-center text-xs text-slate-400">
                <p>© 2024 DataRequest Portal. All rights reserved.</p>
            </div>
        </div>
    `;
}

function toggleAuthTab(tab) {
    const userSection = document.getElementById('auth-user-section');
    const staffSection = document.getElementById('auth-staff-section');
    const tabUser = document.getElementById('tab-user');
    const tabStaff = document.getElementById('tab-staff');

    if (tab === 'user') {
        userSection.classList.remove('hidden');
        staffSection.classList.add('hidden');
        
        // Style Active User Tab
        tabUser.className = 'flex-1 py-4 text-center bg-primary text-white transition-colors';
        tabStaff.className = 'flex-1 py-4 text-center bg-slate-800 text-slate-400 hover:text-white transition-colors';
    } else {
        userSection.classList.add('hidden');
        staffSection.classList.remove('hidden');
        
        // Style Active Staff Tab
        tabUser.className = 'flex-1 py-4 text-center bg-primary text-blue-200 hover:text-white transition-colors opacity-80'; // Dim User Tab
        tabUser.className = 'flex-1 py-4 text-center bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors'; // Actually make it inactive style
        
        // Let's stick to the color scheme: Primary(Blue) vs Slate(Dark).
        // If Staff Active: Staff is Slate-900? User is Slate-200?
        // Reuse specific matching styles.
        
        tabUser.className = 'flex-1 py-4 text-center bg-slate-100 text-slate-500 hover:text-primary transition-colors border-b-2 border-slate-200';
        tabStaff.className = 'flex-1 py-4 text-center bg-slate-900 text-white transition-colors border-b-2 border-slate-900';
        
        // Fix User Tab logic to match "Inactive" state better
        // When User Active: User=Primary, Staff=Slate-800
        // When Staff Active: User=Slate-200, Staff=Slate-900
    }
    
    // Better Logic for Clean Styles
    if (tab === 'user') {
        tabUser.className = 'flex-1 py-4 text-center bg-primary text-white font-bold transition-colors';
        tabStaff.className = 'flex-1 py-4 text-center bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors border-l border-slate-200';
    } else {
        tabUser.className = 'flex-1 py-4 text-center bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors border-r border-slate-200';
        tabStaff.className = 'flex-1 py-4 text-center bg-slate-800 text-white font-bold transition-colors';
    }
}

function handleStaffLogin(e) {
    e.preventDefault();
    const username = e.target.username.value;
    // Mock Check
    const user = MOCK_DB.USERS_LIST.find(u => u.username === username);
    
    if (user && (user.role === 'admin' || user.role === 'staff')) {
        // Save to Shared LocalStorage (simulating session)
        localStorage.setItem('adminUser', JSON.stringify(user));
        
        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังเข้าสู่ระบบ...';
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 800);
    } else {
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (สำหรับเจ้าหน้าที่เท่านั้น)');
    }
}

function toggleLoginMode(mode) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (mode === 'register') {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        registerForm.classList.add('fade-in');
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        loginForm.classList.add('fade-in');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึก...';
    
    setTimeout(() => {
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบที่มีบัญชีใหม่');
        btn.innerHTML = originalText;
        toggleLoginMode('login');
    }, 1000);
}

function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังตรวจสอบ...';
    
    // Mock Delay
    setTimeout(() => {
        isLoggedIn = true;
        updateAuthUI(); // Update Sidebar/Header
        
        // Redirect to intended page or home
        if (redirectAfterLogin) {
            switchPage(redirectAfterLogin);
            redirectAfterLogin = null;
        } else {
            switchPage('home'); 
        } 
    }, 800);
}

function handleLogout() {
    if(confirm('ต้องการออกจากระบบใช่หรือไม่?')) {
        isLoggedIn = false;
        updateAuthUI(); // Update Sidebar/Header
        switchPage('home');
    }
}

// Export functions to global scope
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.switchPage = switchPage;
window.renderSurvey = renderSurvey;

// --- Page Renderers ---

function renderHome() {
    // If not logged in, show a generic welcome or login prompt
    // For now, we reuse the same dashboard but maybe add a top "Login" button if sidebar is hidden
    
    const user = isLoggedIn ? MOCK_DB.USER : { name: 'ผู้เยี่ยมชม (Guest)' };
    
    // Login button moved to Header (index.html) as per request

    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto fade-in h-full flex flex-col pb-4 relative">
            <div class="flex-1 flex flex-col justify-center w-full">
                <div class="text-center mb-12">
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">ยินดีต้อนรับ, คุณ${user.name}</h1>
                    <p class="text-slate-500">ระบบบริการข้อมูลภาครัฐ (Data Center) พร้อมให้บริการ</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
                    <!-- Option 1: Catalog -->
                    <div onclick="switchPage('catalog')" class="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition group relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 transition group-hover:bg-blue-100"></div>
                        <div class="relative z-10">
                            <div class="w-14 h-14 bg-blue-100 text-primary rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                                <i class="fa-solid fa-layer-group"></i>
                            </div>
                            <h2 class="text-xl font-bold text-slate-800 mb-1 group-hover:text-primary transition">คลังข้อมูล</h2>
                            <h3 class="text-sm font-medium text-slate-500 mb-3">(Data Catalog)</h3>
                            <p class="text-sm text-slate-600 mb-4 line-clamp-2">ค้นหาชุดข้อมูลสาธารณะต่างๆ</p>
                            <span class="text-primary text-sm font-bold flex items-center gap-2">เข้าใช้งาน <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i></span>
                        </div>
                    </div>

                    <!-- Option 2: Map (NEW) -->
                    <div onclick="switchPage('map')" class="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition group relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-6 -mt-6 transition group-hover:bg-indigo-100"></div>
                        <div class="relative z-10">
                            <div class="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                                <i class="fa-solid fa-map-location-dot"></i>
                            </div>
                            <h2 class="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition">แผนที่สารสนเทศ</h2>
                            <h3 class="text-sm font-medium text-slate-500 mb-3">(GIS Map)</h3>
                            <p class="text-sm text-slate-600 mb-4 line-clamp-2">ดูข้อมูลเชิงพื้นที่และแผนที่</p>
                            <span class="text-indigo-600 text-sm font-bold flex items-center gap-2">ดูแผนที่ <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i></span>
                        </div>
                    </div>

                    <!-- Option 3: Request Survey -->
                    <div onclick="switchPage('survey')" class="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition group relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-6 -mt-6 transition group-hover:bg-teal-100"></div>
                        <div class="relative z-10">
                            <div class="w-14 h-14 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                                <i class="fa-solid fa-clipboard-question"></i>
                            </div>
                            <h2 class="text-xl font-bold text-slate-800 mb-1 group-hover:text-teal-600 transition">แบบคำขอข้อมูล</h2>
                            <h3 class="text-sm font-medium text-slate-500 mb-3">(Data Request)</h3>
                            <p class="text-sm text-slate-600 mb-4 line-clamp-2">ยื่นคำร้องขอชุดข้อมูลที่ต้องการ</p>
                            <span class="text-teal-600 text-sm font-bold flex items-center gap-2">ยื่นคำขอ <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition"></i></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 px-4 mt-auto">
                <h3 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <i class="fa-solid fa-address-book text-primary"></i> ติดต่อเรา (Contact Us)
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 class="font-bold text-slate-700 mb-2">กลุ่มสารสนเทศทรัพยากรน้ำ ศูนย์อำนวยการน้ำแห่งชาติ</h4>
                        <p class="text-slate-600 mb-4 leading-relaxed text-sm">
                            อาคารจุฑามาศ เลขที่ 89/168 ถนนวิภาวดีรังสิต <br>
                            แขวงตลาดบางเขน เขตหลักสี่ กรุงเทพมหานคร 10210
                        </p>
                        <div class="flex gap-4">
                             <a href="https://www.onwr.go.th" target="_blank" class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"><i class="fa-solid fa-globe"></i></a>
                             <a href="#" class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition"><i class="fa-brands fa-facebook-f"></i></a>
                             <a href="#" class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition"><i class="fa-brands fa-line"></i></a>
                        </div>
                    </div>
                    <div class="space-y-4 flex flex-col items-end">
                        <div class="flex items-center gap-4 flex-row-reverse text-right">
                            <div class="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                            <div>
                                 <p class="text-xs text-slate-500 font-bold uppercase">โทรศัพท์</p>
                                 <p class="text-slate-700 font-medium">0-2554-1800</p>
                                 <p class="text-slate-500 text-sm">Fax: 0-2521-9140-5</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 flex-row-reverse text-right">
                            <div class="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-envelope"></i>
                            </div>
                            <div>
                                 <p class="text-xs text-slate-500 font-bold uppercase">อีเมล</p>
                                 <p class="text-slate-700 font-medium">saraban@onwr.go.th</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSurvey() {
    mainContent.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden fade-in">
            <div class="p-6 border-b border-slate-200 bg-slate-50">
                <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <i class="fa-solid fa-clipboard-question text-primary"></i> แบบสำรวจความต้องการชุดข้อมูล
                </h2>
                <p class="text-sm text-slate-500 mt-1">
                    หากท่านไม่พบชุดข้อมูลที่ต้องการในคลังข้อมูล โปรดระบุรายละเอียดความต้องการของท่านเพื่อการจัดทำข้อมูลในอนาคต
                </p>
            </div>
            
            <div class="p-8">
                <form onsubmit="handleSurveySubmit(event)" class="space-y-6">
                    <!-- Section 1: User Info (Auto-filled) -->
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-4 items-start">
                        <i class="fa-solid fa-circle-info text-blue-500 mt-1"></i>
                        <div class="text-sm">
                            <h4 class="font-bold text-slate-700">ข้อมูลผู้ขอ (อ้างอิงจากบัญชีผู้ใช้)</h4>
                            <p class="text-slate-600">คุณ${MOCK_DB.USER.name} (${MOCK_DB.USER.position})</p>
                            <p class="text-slate-600">${MOCK_DB.USER.department}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label class="block text-sm font-medium text-slate-700">ชื่อชุดข้อมูลที่ต้องการ <span class="text-red-500">*</span></label>
                            <input type="text" required placeholder="ระบุชื่อข้อมูล..." class="w-full border-slate-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary">
                        </div>
                        <div class="space-y-1">
                            <label class="block text-sm font-medium text-slate-700">พื้นที่ที่ต้องการข้อมูล <span class="text-red-500">*</span></label>
                            <input type="text" required placeholder="เช่น ลุ่มน้ำเจ้าพระยา, จ.เชียงใหม่..." class="w-full border-slate-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary">
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-slate-700">รายละเอียดคำอธิบาย <span class="text-red-500">*</span></label>
                        <textarea required rows="4" placeholder="อธิบายลักษณะข้อมูลที่ต้องการ หรือตัวแปรที่สำคัญ..." class="w-full border-slate-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"></textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <label class="block text-sm font-medium text-slate-700">รูปแบบข้อมูล (Format)</label>
                            <select class="w-full border-slate-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary">
                                <option>Shapefile (.shp)</option>
                                <option>Excel / CSV</option>
                                <option>API / Web Service</option>
                                <option>PDF / Report</option>
                                <option>อื่นๆ</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="block text-sm font-medium text-slate-700">วัตถุประสงค์การนำไปใช้</label>
                            <select class="w-full border-slate-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary">
                                <option>เพื่อการศึกษา / วิจัย</option>
                                <option>เพื่อการวางแผนโครงการ</option>
                                <option>เพื่อประกอบการตัดสินใจเชิงนโยบาย</option>
                                <option>อื่นๆ</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-slate-700">ช่วงเวลาที่ต้องการข้อมูล (ความเร่งด่วน)</label>
                        <div class="flex gap-4 mt-2">
                             <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="urgency" class="text-primary focus:ring-primary" checked>
                                <span class="text-sm text-slate-600">ปกติ (ภายใน 1-2 สัปดาห์)</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="urgency" class="text-primary focus:ring-primary">
                                <span class="text-sm text-slate-600">เร่งด่วน (ภายใน 3 วัน)</span>
                            </label>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-200 flex justify-end gap-3">
                        <button type="button" class="px-6 py-2.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition" onclick="renderSurvey()">ล้างค่า</button>
                        <button type="submit" class="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
                            <i class="fa-regular fa-paper-plane"></i> ส่งแบบสำรวจ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function handleSurveySubmit(e) {
    e.preventDefault();
    // In a real app, this would assign the values to variables and send to backend
    // For mockup, just show success and redirect
    
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> ส่งเรียบร้อย';
    btn.classList.add('bg-green-600');
    
    setTimeout(() => {
        alert("บันทึกความต้องการข้อมูลเรียบร้อยแล้ว\nเจ้าหน้าที่จะพิจารณาและดำเนินการต่อไป");
        renderCatalog(); // Go back home
        // Reset Nav
        document.querySelectorAll('.nav-link').forEach(l => {
             l.classList.remove('bg-blue-50', 'text-primary');
             l.classList.add('text-slate-600', 'hover:bg-slate-50');
        });
        document.querySelector('[data-page="catalog"]').classList.add('bg-blue-50', 'text-primary');
    }, 500);
}

// Make handler global
window.handleSurveySubmit = handleSurveySubmit;

function renderCatalog() {
    // 1. Dynamic Filter Bar
    // Extract unique values
    const allAgencies = [...new Set(MOCK_DB.CATALOG.map(i => i.metadata?.owner).filter(Boolean))];
    const allTypes = [...new Set(MOCK_DB.CATALOG.map(i => i.type))];
    const allTags = [...new Set(MOCK_DB.CATALOG.flatMap(i => i.tags || []))];

    const filterHTML = `
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
            <div class="flex items-center gap-2 text-slate-600 font-bold mr-2">
                <i class="fa-solid fa-filter"></i> ตัวกรอง:
            </div>
            
            <select id="filter-agency" onchange="filterCatalog()" class="border-slate-300 rounded-lg text-sm p-2 focus:ring-primary focus:border-primary">
                <option value="">ทุกหน่วยงาน (Agency)</option>
                ${allAgencies.map(a => `<option value="${a}">${a}</option>`).join('')}
            </select>

            <select id="filter-type" onchange="filterCatalog()" class="border-slate-300 rounded-lg text-sm p-2 focus:ring-primary focus:border-primary">
                <option value="">ทุกประเภทข้อมูล (Type)</option>
                ${allTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>

            <select id="filter-tag" onchange="filterCatalog()" class="border-slate-300 rounded-lg text-sm p-2 focus:ring-primary focus:border-primary">
                <option value="">ทุกป้ายกำกับ (Tag)</option>
                ${allTags.map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>

            <button onclick="resetCatalogFilter()" class="text-sm text-slate-500 hover:text-red-500 ml-auto flex items-center gap-1">
                <i class="fa-solid fa-rotate-left"></i> ล้างค่า
            </button>
        </div>
    `;

    // 3. Grid Items Container (Initially all)
    mainContent.innerHTML = filterHTML + `<div id="catalog-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20"></div>`;
    
    // Initial Render
    filterCatalog(); 
}

function filterCatalog() {
    const agency = document.getElementById('filter-agency')?.value || '';
    const type = document.getElementById('filter-type')?.value || '';
    const tag = document.getElementById('filter-tag')?.value || '';

    const filtered = MOCK_DB.CATALOG.filter(item => {
        const matchAgency = !agency || (item.metadata?.owner === agency);
        const matchType = !type || (item.type === type);
        const matchTag = !tag || (item.tags && item.tags.includes(tag));
        return matchAgency && matchType && matchTag;
    });

    const grid = document.getElementById('catalog-grid');
    if(!grid) return;

    if(filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-400">
                <i class="fa-regular fa-folder-open text-4xl mb-3"></i>
                <p>ไม่พบข้อมูลตามเงื่อนไขที่ระบุ</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <div onclick="renderCatalogDetail(${item.id})" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition group h-full flex flex-col cursor-pointer fade-in">
            <div class="h-32 bg-${item.bg} rounded-lg flex items-center justify-center mb-4 relative overflow-hidden shrink-0">
                <i class="fa-solid ${item.icon} text-4xl text-${item.iconColor}-200 group-hover:scale-110 transition"></i>
                <span class="absolute top-2 right-2 bg-${item.typeColor}-100 text-${item.typeColor}-700 text-xs font-bold px-2 py-1 rounded">${item.type}</span>
            </div>
            
            <h3 class="font-bold text-slate-800 mb-1 leading-tight">${item.title}</h3>
            <p class="text-xs text-slate-500 mb-2">${item.metadata?.owner || 'ไม่ระบุหน่วยงาน'}</p>
            <p class="text-sm text-slate-600 line-clamp-2 mb-3 h-10 flex-grow">${item.description}</p>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-1 mb-4 h-6 overflow-hidden">
                ${(item.tags || []).slice(0, 3).map(t => `<span class="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full">${t}</span>`).join('')}
                ${(item.tags?.length > 3) ? `<span class="text-[10px] text-slate-400">+${item.tags.length - 3}</span>` : ''}
            </div>

            <button onclick="event.stopPropagation(); addToCartJS(${item.id}, this)" class="w-full py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 font-medium transition flex items-center justify-center gap-2 mt-auto">
                <i class="fa-solid fa-cart-plus"></i> เพิ่มในตะกร้า
            </button>
        </div>
    `).join('');
    // 2. Grid Items Container (Initially all)
    // Removed duplicate mainContent setter that caused infinite loop/empty page
}

// --- Notification Logic ---
function toggleNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    const list = document.getElementById('notification-list');
    
    if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        
        // Render List
        if (MOCK_DB.HISTORY.length === 0) {
            list.innerHTML = `<div class="p-4 text-center text-slate-400 text-sm">ไม่มีการแจ้งเตือน</div>`;
        } else {
            list.innerHTML = MOCK_DB.HISTORY.slice(0, 5).map(req => { // Show max 5
                let iconClass = 'bg-blue-100 text-blue-600';
                let icon = 'fa-clock';
                if(req.status === 'completed' || req.status === 'ready') {
                    iconClass = 'bg-green-100 text-green-600';
                    icon = 'fa-check';
                }
                
                return `
                    <div onclick="switchPage('history')" class="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3 transition">
                        <div class="w-8 h-8 rounded-full ${iconClass} flex items-center justify-center text-xs shrink-0">
                            <i class="fa-solid ${icon}"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold text-slate-800 truncate">คำขอ #${req.id}</p>
                            <p class="text-xs text-slate-500 truncate">${req.items.length} รายการ - ${req.status}</p>
                            <p class="text-[10px] text-slate-400 mt-1">${req.date}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
    } else {
        dropdown.classList.add('hidden');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notification-dropdown');
    const btn = e.target.closest('button[onclick="toggleNotifications()"]');
    if (!btn && dropdown && !dropdown.contains(e.target) && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
    }
});

function resetCatalogFilter() {
    document.getElementById('filter-agency').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-tag').value = '';
    filterCatalog();
}

function renderCatalogDetail(id) {
    const item = MOCK_DB.CATALOG.find(i => i.id === id);
    if (!item) return;

    // Use default metadata if missing
    const meta = item.metadata || {
        owner: "ไม่ระบุหน่วยงาน",
        frequency: "ไม่ระบุ",
        license: "ไม่ระบุ",
        source: "ไม่ระบุ",
        contact: "ไม่ระบุ",
        last_updated: "-"
    };

    // Use default sample data if missing
    const sample = item.sample_data || {
        columns: ["ID", "Column 2", "Column 3", "Column 4", "Column 5", "Column 6", "Column 7", "Column 8", "Column 9", "Column 10"],
        rows: [
            ["1", "Sample", "Data", "Test", "Value", "123", "456", "789", "000", "-"],
            ["2", "Sample", "Data", "Test", "Value", "123", "456", "789", "000", "-"],
            ["3", "Sample", "Data", "Test", "Value", "123", "456", "789", "000", "-"]
        ]
    };

    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6 fade-in pb-20">
            <!-- Header -->
            <button onclick="renderCatalog()" class="text-slate-500 hover:text-primary flex items-center gap-2 font-medium mb-4">
                <i class="fa-solid fa-arrow-left"></i> กลับหน้ารวม (Catalog)
            </button>
            
            <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div class="flex flex-col md:flex-row gap-8">
                    <!-- Icon/Image -->
                    <div class="w-full md:w-64 h-48 bg-${item.bg} rounded-xl flex items-center justify-center shrink-0">
                         <i class="fa-solid ${item.icon} text-6xl text-${item.iconColor}-200"></i>
                    </div>
                    
                    <!-- Info -->
                    <div class="flex-1">
                         <div class="flex items-start justify-between mb-4">
                             <div>
                                <span class="bg-${item.typeColor}-100 text-${item.typeColor}-700 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">${item.type}</span>
                                <h1 class="text-2xl font-bold text-slate-800">${item.title}</h1>
                                <p class="text-slate-500 mt-2">${item.description}</p>
                             </div>
                             <button onclick="addToCartJS(${item.id}, this)" class="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center gap-2 font-medium whitespace-nowrap">
                                <i class="fa-solid fa-cart-plus"></i> เพิ่มในตะกร้า
                            </button>
                         </div>

                         <!-- Metadata Grid -->
                         <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <p class="text-xs text-slate-400 uppercase font-bold mb-1">หน่วยงานเจ้าของ</p>
                                <p class="text-sm font-semibold text-slate-700">${meta.owner}</p>
                            </div>
                            <div>
                                <p class="text-xs text-slate-400 uppercase font-bold mb-1">ความถี่การปรับปรุง</p>
                                <p class="text-sm font-semibold text-slate-700">${meta.frequency}</p>
                            </div>
                             <div>
                                <p class="text-xs text-slate-400 uppercase font-bold mb-1">สัญญาอนุญาต</p>
                                <p class="text-sm font-semibold text-slate-700">${meta.license}</p>
                            </div>
                            <div>
                                <p class="text-xs text-slate-400 uppercase font-bold mb-1">ปรับปรุงล่าสุด</p>
                                <p class="text-sm font-semibold text-slate-700">${meta.last_updated}</p>
                            </div>
                            <div>
                                <p class="text-xs text-slate-400 uppercase font-bold mb-1">ขอบเขตพื้นที่</p>
                                <p class="text-sm font-semibold text-slate-700">${meta.coverage || '-'}</p>
                            </div>
                            <div>
                                <p class="text-xs text-slate-400 uppercase font-bold mb-1">แหล่งที่มา</p>
                                <p class="text-sm font-semibold text-slate-700">${meta.source || '-'}</p>
                            </div>
                             <div class="col-span-2">
                                <p class="text-xs text-slate-400 uppercase font-bold mb-1">ติดต่อสอบถาม</p>
                                <p class="text-sm font-semibold text-slate-700">${meta.contact || '-'}</p>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            <!-- Sample Data -->
            <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-table text-slate-400"></i> ตัวอย่างข้อมูล (Sample Data)
                    </h3>
                    <div class="flex gap-2">
                        <button class="px-3 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50">JSON</button>
                        <button class="px-3 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50">CSV</button>
                    </div>
                </div>

                <div class="overflow-x-auto border border-slate-200 rounded-lg">
                    <table class="w-full text-sm text-left text-slate-600 whitespace-nowrap">
                        <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                                ${sample.columns.map(col => `<th class="px-4 py-3 border-r border-slate-200 last:border-0">${col}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${sample.rows.map(row => `
                                <tr class="hover:bg-slate-50 transition">
                                    ${row.map(cell => `<td class="px-4 py-3 border-r border-slate-100 last:border-0">${cell}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <p class="text-xs text-slate-400 mt-4 text-center">แสดงตัวอย่างเพียง 5 แถวจากข้อมูลทั้งหมด</p>
            </div>
        </div>
    `;
}

function renderMap() {
    mainContent.innerHTML = `
        <div class="h-full flex flex-col md:flex-row gap-4 overflow-hidden relative fade-in p-2">
            <!-- Left Panel: Request Form -->
            <div class="w-full md:w-1/3 bg-white border border-slate-200 shadow-sm rounded-xl overflow-y-auto flex flex-col">
                <div class="p-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
                    <h2 class="font-bold text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-pen-to-square text-primary"></i> คำขอจัดทำข้อมูล/แผนที่
                    </h2>
                    <p class="text-xs text-slate-500">กรอกรายละเอียดเพื่อขอข้อมูลเฉพาะพื้นที่</p>
                </div>
                
                <form class="p-5 space-y-6 flex-1">
                    <!-- 1. Details -->
                    <div class="space-y-2">
                        <label class="block text-sm font-bold text-slate-700">1. รายละเอียดความต้องการ</label>
                        <textarea rows="4" class="w-full border-slate-300 rounded-lg p-3 text-sm focus:ring-primary focus:border-primary" placeholder="ระบุประเภทข้อมูล พื้นที่ที่ต้องการ หรือรายละเอียดอื่นๆ อย่างคร่าวๆ..."></textarea>
                    </div>

                    <!-- 2. Attachments -->
                    <div class="space-y-4">
                        <label class="block text-sm font-bold text-slate-700">2. เอกสารแนบ (ถ้ามี)</label>
                        
                        <!-- 2.1 Example Image -->
                        <div class="border border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition relative group">
                            <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" onchange="handleFileMock(this, 'img-preview')">
                            <div id="img-preview" class="space-y-2">
                                <i class="fa-regular fa-image text-2xl text-slate-400"></i>
                                <p class="text-xs text-slate-500">2.1 อัพโหลดภาพตัวอย่าง<br>(คลิกเพื่อเลือกไฟล์)</p>
                            </div>
                        </div>

                        <!-- 2.2 Shapefile -->
                        <div class="border border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-blue-50 transition relative group border-blue-200 bg-blue-50/30">
                            <input type="file" accept=".zip,.shp,.kml,.json" class="absolute inset-0 opacity-0 cursor-pointer" onchange="handleShapefileMock(this)">
                            <div id="shp-preview" class="space-y-2">
                                <i class="fa-solid fa-layer-group text-2xl text-blue-400"></i>
                                <p class="text-xs text-slate-500">2.2 อัพโหลด Shapefile/KML<br>เพื่อแสดงขอบเขตบนแผนที่</p>
                            </div>
                        </div>

                        <!-- 2.3 Secondary Data -->
                        <div class="border border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition relative group">
                            <input type="file" accept=".csv,.xlsx" class="absolute inset-0 opacity-0 cursor-pointer" onchange="handleFileMock(this, 'csv-preview')">
                            <div id="csv-preview" class="space-y-2">
                                <i class="fa-solid fa-file-csv text-2xl text-slate-400"></i>
                                <p class="text-xs text-slate-500">2.3 ไฟล์ข้อมูลทุติยภูมิ (CSV, Excel)<br>สำหรับรายละเอียดเพิ่มเติม</p>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4">
                        <button type="button" class="w-full bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2" onclick="alert('บันทึกคำขอเรียบร้อย')">
                            <i class="fa-regular fa-paper-plane"></i> ส่งคำขอ
                        </button>
                    </div>
                </form>
            </div>

            <!-- Right Panel: Map -->
            <div class="flex-1 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm relative flex flex-col">
                <!-- Map Container -->
                <div id="map-container" class="flex-1 z-0 relative"></div>
                
                <!-- Advanced Layer Control (Absolute Floating Right) -->
                <div class="absolute top-4 right-4 z-[400] bg-white rounded-lg shadow-lg flex flex-col max-w-[280px] max-h-[calc(100%-2rem)] transition-all duration-300" id="layer-panel">
                    <div class="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-lg cursor-pointer" onclick="toggleLayerPanel()">
                        <h4 class="font-bold text-slate-700 text-sm flex items-center gap-2">
                            <i class="fa-solid fa-layer-group text-primary"></i> ชั้นข้อมูล (Layers)
                        </h4>
                        <i class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform" id="layer-panel-arrow"></i>
                    </div>
                    
                    <div class="overflow-y-auto p-2 space-y-3 custom-scrollbar" id="layer-content">
                        <!-- Basemap Switcher -->
                        <div class="mb-3">
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">BASEMAP GALLERY</p>
                            <div class="grid grid-cols-3 gap-2">
                                <!-- 1. Imagery -->
                                <button onclick="setBasemap('satellite')" class="basemap-btn group relative h-16 w-full rounded overflow-hidden border border-slate-200 hover:border-primary transition" data-type="satellite">
                                    <div class="absolute inset-0 bg-[url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0')] bg-cover opacity-80 group-hover:opacity-100 transition"></div>
                                    <span class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-0.5 text-center truncate">Imagery</span>
                                </button>
                                <!-- 2. Imagery with Labels -->
                                <button onclick="setBasemap('hybrid')" class="basemap-btn group relative h-16 w-full rounded overflow-hidden border border-slate-200 hover:border-primary transition" data-type="hybrid">
                                    <div class="absolute inset-0 bg-[url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0')] bg-cover opacity-80 group-hover:opacity-100 transition"></div>
                                    <div class="absolute inset-0 flex items-center justify-center"><i class="fa-solid fa-font text-white/80 text-lg drop-shadow-md"></i></div>
                                    <span class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-0.5 text-center truncate">Hybrid</span>
                                </button>
                                <!-- 3. Streets -->
                                <button onclick="setBasemap('streets')" class="basemap-btn group relative h-16 w-full rounded overflow-hidden border border-slate-200 hover:border-primary transition" data-type="streets">
                                    <div class="absolute inset-0 bg-orange-100 opacity-80 group-hover:opacity-100 transition flex items-center justify-center">
                                        <i class="fa-solid fa-road text-orange-400 text-xl"></i>
                                    </div>
                                    <span class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-0.5 text-center truncate">Streets</span>
                                </button>
                                <!-- 4. Topographic -->
                                <button onclick="setBasemap('topo')" class="basemap-btn group relative h-16 w-full rounded overflow-hidden border border-slate-200 hover:border-primary transition" data-type="topo">
                                    <div class="absolute inset-0 bg-green-100 opacity-80 group-hover:opacity-100 transition flex items-center justify-center">
                                        <i class="fa-solid fa-mountain text-green-600 text-xl"></i>
                                    </div>
                                    <span class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-0.5 text-center truncate">Topographic</span>
                                </button>
                                <!-- 5. Terrain -->
                                <button onclick="setBasemap('terrain')" class="basemap-btn group relative h-16 w-full rounded overflow-hidden border border-slate-200 hover:border-primary transition" data-type="terrain">
                                    <div class="absolute inset-0 bg-stone-200 opacity-80 group-hover:opacity-100 transition flex items-center justify-center">
                                        <i class="fa-solid fa-mountain-sun text-stone-600 text-xl"></i>
                                    </div>
                                    <span class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-0.5 text-center truncate">Terrain</span>
                                </button>
                                <!-- 6. Light Gray -->
                                <button onclick="setBasemap('gray')" class="basemap-btn group relative h-16 w-full rounded overflow-hidden border border-slate-200 hover:border-primary transition" data-type="gray">
                                    <div class="absolute inset-0 bg-gray-200 opacity-80 group-hover:opacity-100 transition flex items-center justify-center">
                                        <i class="fa-solid fa-map text-gray-400 text-xl"></i>
                                    </div>
                                    <span class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-0.5 text-center truncate">Gray</span>
                                </button>
                                <!-- 7. National Geographic -->
                                <button onclick="setBasemap('natgeo')" class="basemap-btn group relative h-16 w-full rounded overflow-hidden border border-slate-200 hover:border-primary transition" data-type="natgeo">
                                    <div class="absolute inset-0 bg-yellow-100 opacity-80 group-hover:opacity-100 transition flex items-center justify-center">
                                        <i class="fa-solid fa-earth-americas text-yellow-600 text-xl"></i>
                                    </div>
                                    <span class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-0.5 text-center truncate">NatGeo</span>
                                </button>
                                <!-- 8. Oceans -->
                                <button onclick="setBasemap('oceans')" class="basemap-btn group relative h-16 w-full rounded overflow-hidden border border-slate-200 hover:border-primary transition" data-type="oceans">
                                    <div class="absolute inset-0 bg-cyan-100 opacity-80 group-hover:opacity-100 transition flex items-center justify-center">
                                        <i class="fa-solid fa-water text-cyan-500 text-xl"></i>
                                    </div>
                                    <span class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-0.5 text-center truncate">Oceans</span>
                                </button>
                                <!-- 9. OSM -->
                                <button onclick="setBasemap('osm')" class="basemap-btn group relative h-16 w-full rounded overflow-hidden border border-slate-200 hover:border-primary transition" data-type="osm">
                                    <div class="absolute inset-0 bg-white opacity-80 group-hover:opacity-100 transition flex items-center justify-center">
                                        <span class="font-bold text-slate-600 text-xs">OSM</span>
                                    </div>
                                    <span class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] p-0.5 text-center truncate">OpenStreet</span>
                                </button>
                            </div>
                        </div>

                        <!-- Dynamic Layers -->
                        <div id="layer-tree" class="space-y-3">
                            <!-- Injected by JS -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize Map after DOM is updated
    setTimeout(() => {
        initLeafletMap();
    }, 100);
}

// Map Global State
let map;
let activeLayers = {};
let currentBasemapLayer;
let currentBasemapLabels; // For Hybrid

function initLeafletMap() {
    // Default center: Thailand
    map = L.map('map-container').setView([13.7563, 100.5018], 6);

    // Initial Basemap (OSM)
    setBasemap('osm');

    // Generate Layer Controls
    const layerTree = document.getElementById('layer-tree');
    const categories = {
        'BOUNDARIES': 'ขอบเขตการปกครอง',
        'BASINS': 'ขอบเขตลุ่มน้ำ',
        'WATER_WAYS': 'เส้นลำน้ำ',
        'WATER_SOURCES': 'แหล่งน้ำ',
        'STATIONS': 'สถานีตรวจวัด',
        'DISASTERS': 'พื้นที่ภัยพิบัติ',
        'LAND_USE': 'การใช้ประโยชน์ที่ดิน',
        'INFRASTRUCTURE': 'โครงสร้างพื้นฐาน'
    };

    for (const [key, label] of Object.entries(categories)) {
        if (MOCK_DB.GIS_LAYERS[key]) {
            let itemsHTML = '';
            MOCK_DB.GIS_LAYERS[key].forEach(layer => {
                itemsHTML += `
                    <label class="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:bg-slate-50 p-1.5 rounded ml-2">
                        <input type="checkbox" onchange="toggleGISLayer(this, '${layer.id}', '${layer.type}', '${layer.color}', '${layer.icon}')" class="rounded text-primary focus:ring-primary w-3.5 h-3.5 border-slate-300">
                        <span class="truncate flex-1">${layer.name}</span>
                        ${getLayerIcon(layer.type, layer.color)}
                    </label>
                `;
            });

            const groupHTML = `
                <div class="layer-group mb-3">
                    <h5 class="text-xs font-bold text-slate-700 mb-1 flex items-center gap-2 border-b border-slate-100 pb-1">
                        ${label}
                    </h5>
                    <div class="space-y-1 pl-1">
                        ${itemsHTML}
                    </div>
                </div>
            `;
            layerTree.insertAdjacentHTML('beforeend', groupHTML);
        }
    }
}

function getLayerIcon(type, color) {
    if (type === 'polygon') return `<span class="w-3 h-3 border border-slate-300 rounded-sm" style="background:${color}40; border-color:${color}"></span>`;
    if (type === 'polyline') return `<span class="w-4 h-0.5" style="background:${color}"></span>`;
    if (type === 'circle') return `<span class="w-3 h-3 rounded-full border" style="background:${color}40; border-color:${color}"></span>`;
    return `<i class="fa-solid fa-location-dot" style="color:${color}"></i>`;
}

function setBasemap(type) {
    if (currentBasemapLayer) map.removeLayer(currentBasemapLayer);
    if (currentBasemapLabels) map.removeLayer(currentBasemapLabels);

    const buttons = document.querySelectorAll('.basemap-btn');
    buttons.forEach(b => {
        if(b.dataset.type === type) {
            b.classList.add('border-primary', 'ring-2', 'ring-primary/50');
            b.classList.remove('border-slate-200');
        } else {
            b.classList.remove('border-primary', 'ring-2', 'ring-primary/50');
            b.classList.add('border-slate-200');
        }
    });

    let url = '';
    let attrib = 'Tiles &copy; Esri';

    switch(type) {
        case 'satellite':
        case 'hybrid':
            url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
            break;
        case 'streets':
            url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
            break;
        case 'topo':
            url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
            break;
        case 'terrain':
            url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}';
            break;
        case 'gray':
            url = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
            break;
        case 'natgeo':
            url = 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}';
            break;
        case 'oceans':
             url = 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';
            break;
        case 'osm':
            url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            attrib = '&copy; OpenStreetMap';
            break;
        default:
             url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
    }

    currentBasemapLayer = L.tileLayer(url, { attribution: attrib });
    currentBasemapLayer.addTo(map);

    // Add Labels for Hybrid/Terrain/Oceans
    if(type === 'hybrid') {
        currentBasemapLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}');
        currentBasemapLabels.addTo(map);
    } else if (type === 'terrain') {
        currentBasemapLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}');
        currentBasemapLabels.addTo(map);
    } else if (type === 'oceans') {
         currentBasemapLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}');
         currentBasemapLabels.addTo(map);
    } else if (type === 'gray') {
         currentBasemapLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}');
         currentBasemapLabels.addTo(map);
    }
}

function toggleGISLayer(checkbox, id, type, color, icon) {
    if (checkbox.checked) {
        
        // 1. Check if we have Mock GeoJSON for this layer
        if (MOCK_DB.GEOJSON && MOCK_DB.GEOJSON[id]) {
            const layer = L.geoJSON(MOCK_DB.GEOJSON[id], {
                style: function(feature) {
                    return {
                        color: feature.properties.color || color,
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.3
                    };
                },
                onEachFeature: function(feature, layer) {
                     if (feature.properties && feature.properties.name) {
                        layer.bindPopup(feature.properties.name);
                        
                        // Simple hover effect
                        layer.on('mouseover', function () {
                            this.setStyle({ fillOpacity: 0.6, weight: 3 });
                        });
                        layer.on('mouseout', function () {
                             this.setStyle({ fillOpacity: 0.3, weight: 2 });
                        });
                    }
                }
            });
            
            layer.addTo(map);
            activeLayers[id] = layer;
            
            // Zoom to the data
            map.fitBounds(layer.getBounds());

        } else {
            // 2. Fallback: Generate generic shapes for other layers
            const layerGroup = L.layerGroup();
            
            // Deterministic mock generation
            const seed = id.length; 
            const count = 5;
            
            for(let i=0; i<count; i++) {
                const lat = 13 + (Math.sin(seed * (i+1)) * 5);
                const lng = 100 + (Math.cos(seed * (i+1)) * 5);
                
                if(type === 'polygon') {
                     L.polygon([
                        [lat, lng],
                        [lat + 0.5, lng + 0.2],
                        [lat + 0.3, lng - 0.2]
                    ], { color: color, fillColor: color, fillOpacity: 0.2 }).bindPopup(id).addTo(layerGroup);
                } else if (type === 'polyline') {
                     L.polyline([
                        [lat, lng],
                        [lat + 1, lng + 1]
                    ], { color: color }).bindPopup(id).addTo(layerGroup);
                } else if (type === 'circle') {
                    L.circle([lat, lng], {
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.5,
                        radius: 20000
                    }).bindPopup(id).addTo(layerGroup);
                } else {
                    L.marker([lat, lng]).bindPopup(id).addTo(layerGroup);
                }
            }

            layerGroup.addTo(map);
            activeLayers[id] = layerGroup;
        }

    } else {
        if(activeLayers[id]) {
            map.removeLayer(activeLayers[id]);
            delete activeLayers[id];
        }
    }
}

function handleFileMock(input, previewId) {
    if(input.files && input.files[0]) {
        const file = input.files[0];
        const preview = document.getElementById(previewId);
        preview.innerHTML = `
            <div class="text-green-600 font-bold flex flex-col items-center animate-bounce-short">
                <i class="fa-solid fa-check-circle text-2xl mb-1"></i>
                <span class="text-xs truncate max-w-full px-2">${file.name}</span>
            </div>
        `;
    }
}

function handleShapefileMock(input) {
    if(input.files && input.files[0]) {
        const file = input.files[0];
        const preview = document.getElementById('shp-preview');
        preview.innerHTML = `
            <div class="text-blue-600 font-bold flex flex-col items-center animate-bounce-short">
                <i class="fa-solid fa-map-location-dot text-2xl mb-1"></i>
                <span class="text-xs truncate max-w-full px-2">${file.name}</span>
            </div>
        `;
        
        // Simulate plotting on map
        setTimeout(() => {
            alert("ระบบจำลอง: อ่านไฟล์ Shapefile เรียบร้อย\nแสดงผลขอบเขตบนแผนที่สีส้ม");
            
            // Draw a mock orange rectangle to represent the uploaded shape
            const mockUploadLayer = L.rectangle([[14, 100], [15, 101]], {color: "#ff8800", weight: 2}).bindPopup("Uploaded Shapefile: " + file.name);
            mockUploadLayer.addTo(map);
            map.fitBounds(mockUploadLayer.getBounds());
            
        }, 500);
    }
}

function toggleLayerPanel() {
    const arrow = document.getElementById('layer-panel-arrow');
    const content = document.getElementById('layer-content');
    
    // Simple toggle height logic or class based
    if(content.style.maxHeight === '0px') {
        content.style.maxHeight = '500px';
        content.style.opacity = '1';
        arrow.classList.remove('rotate-180');
    } else {
        // content.style.maxHeight = '0px';
        // content.style.opacity = '0';
        // arrow.classList.add('rotate-180');
        // Actually for this UI, let's just not collapse completely for now, maybe just minimize
    }
}

// Global Exports
window.toggleGISLayer = toggleGISLayer;
window.handleFileMock = handleFileMock;
window.handleShapefileMock = handleShapefileMock;
window.setBasemap = setBasemap;
window.toggleLayerPanel = toggleLayerPanel;

function renderHistory() {
    let historyHTML = `
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-200">
                <h2 class="text-xl font-bold text-slate-800">ประวัติคำขอข้อมูล</h2>
                <p class="text-sm text-slate-500">รายการคำขอทั้งหมดของคุณ</p>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                        <tr>
                            <th class="px-6 py-4">เลขที่คำขอ</th>
                            <th class="px-6 py-4">วันที่</th>
                            <th class="px-6 py-4">รายการข้อมูล</th>
                            <th class="px-6 py-4">วัตถุประสงค์</th>
                            <th class="px-6 py-4">สถานะ</th>
                            <th class="px-6 py-4 text-right">ดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
    `;

    MOCK_DB.HISTORY.forEach((req, index) => {
        let statusClass = "bg-slate-100 text-slate-600";
        if(req.status === 'ready' || req.status === 'completed') statusClass = "bg-green-100 text-green-700";
        if(req.status === 'processing') statusClass = "bg-blue-100 text-blue-700";

        const itemsStr = req.items.join("<br><span class='text-xs text-slate-400'>+ </span>");

        // Prepare timeline data
        const timeline = req.timeline || [
            { status: "submitted", date: req.date, desc: "ยื่นคำขอเรียบร้อย" },
            { status: "pending", date: "-", desc: "อยู่ระหว่างการพิจารณา" }
        ];
        let activeIndex = 0;
        if (req.status === 'completed' || req.status === 'ready') activeIndex = 3;
        else if (req.status === 'processing') activeIndex = 2;
        else if (req.status === 'approved') activeIndex = 1;

        historyHTML += `
            <tr class="hover:bg-slate-50 transition border-b border-slate-100">
                <td class="px-6 py-4 font-medium text-primary align-top">${req.id}</td>
                <td class="px-6 py-4 align-top">${req.date}</td>
                <td class="px-6 py-4 align-top">${itemsStr}</td>
                <td class="px-6 py-4 align-top">${req.reason}</td>
                <td class="px-6 py-4 align-top">
                    <span class="px-3 py-1 rounded-full text-xs font-bold ${statusClass}">
                        ${req.statusLabel}
                    </span>
                </td>
                <td class="px-6 py-4 text-right align-top">
                    <button onclick="document.getElementById('history-track-${index}').classList.toggle('hidden')" class="bg-slate-100 text-slate-600 hover:text-primary hover:bg-blue-50 px-3 py-1.5 rounded transition text-xs font-bold">
                        <i class="fa-solid fa-bars-progress mr-1"></i> ติดตาม
                    </button>
                    ${req.status === 'ready' || req.status === 'completed' ? '<button class="ml-2 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded transition text-xs font-bold"><i class="fa-solid fa-download mr-1"></i> โหลด</button>' : ''}
                </td>
            </tr>
            <!-- Expandable Tracking Row -->
            <tr id="history-track-${index}" class="hidden bg-slate-50/50">
                <td colspan="6" class="px-6 py-6 border-b border-slate-200">
                    <div class="max-w-3xl mx-auto">
                        <h5 class="font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <i class="fa-solid fa-circle-dot text-primary text-xs"></i> 
                            ไทม์ไลน์สถานะการดำเนินการ
                        </h5>
                        <div class="relative pl-4">
                            <!-- Connecting Line -->
                            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                            <!-- Steps (Reusing generateTimelineItem logic) -->
                            <div class="space-y-6 relative z-10">
                                ${generateTimelineItem('completed', 'ยื่นคำร้อง', timeline[0]?.date || req.date, 'ระบบได้รับคำขอแล้ว')}
                                ${generateTimelineItem(activeIndex >= 1 ? 'completed' : 'pending', 'ตรวจสอบ/อนุมัติ', activeIndex >= 1 ? timeline[1]?.date || 'รออนุมัติ' : '-', 'เจ้าหน้าที่ตรวจสอบความถูกต้อง')}
                                ${generateTimelineItem(activeIndex >= 2 ? 'active' : 'pending', 'กำลังดำเนินการ', activeIndex >= 2 ? timeline[2]?.date || 'กำลังรวบรวม' : '-', 'รวบรวมและจัดเตรียมไฟล์ข้อมูล')}
                                ${generateTimelineItem(activeIndex >= 3 ? 'completed' : 'pending', 'พร้อมส่งมอบ', activeIndex >= 3 ? timeline[3]?.date || '-' : '-', 'ข้อมูลพร้อมให้ดาวน์โหลด')}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });

    historyHTML += `
                    </tbody>
                </table>
            </div>
            <div class="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-400">
                Showing ${MOCK_DB.HISTORY.length} items
            </div>
        </div>
    `;

    mainContent.innerHTML = historyHTML;
}

function renderProfile() {
    const u = MOCK_DB.USER;
    mainContent.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div class="px-8 pb-8">
                <div class="relative flex justify-between items-end -mt-12 mb-6">
                    <img src="${u.avatar}" class="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white">
                    <button class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">แก้ไขข้อมูล</button>
                </div>
                
                <h2 class="text-2xl font-bold text-slate-800">${u.name}</h2>
                <p class="text-slate-500 mb-6">${u.position} | ${u.agency}</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">อีเมล</label>
                        <p class="text-slate-700 font-medium">user.thai@onwr.go.th</p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">เบอร์โทรศัพท์</label>
                        <p class="text-slate-700 font-medium">02-241-0020 ต่อ 1234</p>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">หน่วยงานสังกัด</label>
                        <p class="text-slate-700 font-medium">${u.group} ${u.division}</p>
                    </div>
                </div>

                <div class="mt-8 border-t border-slate-200 pt-6">
                    <h3 class="text-lg font-bold text-slate-800 mb-4">สถิติการใช้งาน</h3>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg text-center">
                            <span class="block text-2xl font-bold text-primary">12</span>
                            <span class="text-xs text-blue-600">คำขอทั้งหมด</span>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center">
                            <span class="block text-2xl font-bold text-green-600">98%</span>
                            <span class="text-xs text-green-700">อนุมัติสำเร็จ</span>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg text-center">
                            <span class="block text-2xl font-bold text-purple-600">3.4GB</span>
                            <span class="text-xs text-purple-700">ปริมาณข้อมูล</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- Specific Helper Functions ---
function addToCartJS(id, btn) {
    // UI Animation
    addToCart(btn); // Use simple legacy animation function from index (or we can move it here)

    // Logical Add
    const item = MOCK_DB.CATALOG.find(i => i.id === id);
    if(item && !cart.some(c => c.id === id)) {
        cart.push(item);
        renderCartItems();
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    const totalLabel = document.getElementById('cart-total-items');
    const emptyMsg = document.getElementById('empty-cart');

    // Update Counts
    badge.innerText = cart.length;
    totalLabel.innerText = cart.length + " รายการ";
    
    // Toggle Empty State
    if(cart.length === 0) {
        emptyMsg.style.display = 'block';
        // Remove other items but keep empty msg
        Array.from(container.children).forEach(child => {
            if(child.id !== 'empty-cart') child.remove();
        });
    } else {
        emptyMsg.style.display = 'none';
        
        // Re-render list (Simple approach: clear non-empty-msg and rebuild)
        Array.from(container.children).forEach(child => {
            if(child.id !== 'empty-cart') child.remove();
        });

        cart.forEach(item => {
            const html = `
                <div class="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex gap-3 animate-pulse-once">
                    <div class="w-12 h-12 bg-${item.bg} rounded flex items-center justify-center text-${item.iconColor}-500">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-bold text-slate-800 truncate">${item.title}</h4>
                        <p class="text-xs text-slate-500">${item.type}</p>
                    </div>
                    <button onclick="removeFromCartJS(${item.id})" class="text-slate-300 hover:text-red-500 transition"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            container.insertAdjacentHTML('afterbegin', html);
        });
    }
}

function removeFromCartJS(id) {
    cart = cart.filter(i => i.id !== id);
    renderCartItems();
}

// Expose necessary functions to global window for inline onclick handlers
window.addToCartJS = addToCartJS;
window.removeFromCartJS = removeFromCartJS;
window.switchPage = switchPage;
window.initApp = initApp;
window.renderCatalogDetail = renderCatalogDetail;
window.filterCatalog = filterCatalog;
window.resetCatalogFilter = resetCatalogFilter;
window.toggleNotifications = toggleNotifications;
window.toggleNotifications = toggleNotifications;

function renderProfile() {
    const user = MOCK_DB.USER;
    mainContent.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden fade-in pb-10">
             <div class="p-6 border-b border-slate-200 bg-slate-50 relative overflow-hidden">
                <div class="relative z-10 flex items-center gap-6">
                    <img src="${user.avatar}" class="w-24 h-24 rounded-full border-4 border-white shadow-md">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">${user.name}</h1>
                        <p class="text-slate-600">${user.position} | ${user.department}</p>
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mt-2">
                            <i class="fa-solid fa-user-check"></i> ยืนยันตัวตนแล้ว
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="p-8 space-y-8">
                <!-- Personal Info -->
                <section>
                    <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i class="fa-regular fa-id-card text-primary"></i> ข้อมูลส่วนตัว
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-500 mb-1">ชื่อ-นามสกุล</label>
                            <input type="text" value="${user.name}" class="w-full border-slate-300 rounded-lg bg-slate-50 text-slate-600 px-4 py-2" disabled>
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-slate-500 mb-1">ตำแหน่ง</label>
                            <input type="text" value="${user.position}" class="w-full border-slate-300 rounded-lg bg-slate-50 text-slate-600 px-4 py-2" disabled>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-500 mb-1">หน่วยงาน</label>
                            <input type="text" value="${user.department}" class="w-full border-slate-300 rounded-lg bg-slate-50 text-slate-600 px-4 py-2" disabled>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-500 mb-1">สังกัด (กอง/ฝ่าย)</label>
                            <input type="text" value="${user.group}" class="w-full border-slate-300 rounded-lg bg-slate-50 text-slate-600 px-4 py-2" disabled>
                        </div>
                    </div>
                </section>

                <hr class="border-slate-100">

                <!-- Contact Info -->
                 <section>
                    <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-phone text-primary"></i> ข้อมูลติดต่อ
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                            <input type="email" value="${user.email}" class="w-full border-slate-300 rounded-lg focus:ring-primary focus:border-primary px-4 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                            <input type="text" value="${user.phone}" class="w-full border-slate-300 rounded-lg focus:ring-primary focus:border-primary px-4 py-2">
                        </div>
                         <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-slate-700 mb-1">ที่อยู่จัดส่งเอกสาร</label>
                            <textarea rows="3" class="w-full border-slate-300 rounded-lg focus:ring-primary focus:border-primary px-4 py-2">123 ถ.แจ้งวัฒนะ เขตหลักสี่ กรุงเทพฯ 10210</textarea>
                        </div>
                    </div>
                </section>

                <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button type="button" class="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-bold transition">ยกเลิก</button>
                    <button type="button" onclick="alert('บันทึกข้อมูลสำเร็จ!')" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm transition">บันทึกการเปลี่ยนแปลง</button>
                </div>
            </div>
        </div>
    `;
}

