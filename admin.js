
// Admin Logic

let adminUser = null;
let currentAdminPage = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
});

function checkAdminAuth() {
    const stored = localStorage.getItem('adminUser');
    if (stored) {
        adminUser = JSON.parse(stored);
        if (adminUser.role !== 'admin' && adminUser.role !== 'staff') {
            // Invalid role
            localStorage.removeItem('adminUser');
            window.location.href = 'index.html'; // Redirect to main login
            return;
        }
        showAdminPanel();
    } else {
        window.location.href = 'index.html'; // Redirect if no session
    }
}

function showAdminPanel() {
    // Update Profile
    document.getElementById('admin-name').innerText = adminUser.name;
    document.getElementById('admin-role').innerText = adminUser.role.toUpperCase();
    document.getElementById('admin-avatar').src = adminUser.avatar;

    // Initialize Sidebar Toggle if not already bound
    const toggleBtn = document.getElementById('sidebar-toggle');
    if(toggleBtn) {
        toggleBtn.onclick = toggleAdminSidebar; 
    }

    // Initialize Notifications
    updateAdminNotifications();

    switchAdminPage('dashboard');
}

function updateAdminNotifications() {
    if (!adminUser) return;
    
    // Filter tasks for current user that are 'urgent' OR 'overdue' OR due within 3 days (mock logic)
    // For MOCK_DB, we'll just check status 'urgent'/'overdue' assigned to this user
    const myUrgentTasks = MOCK_DB.TASKS.filter(t => 
        t.assignee_id === adminUser.id && 
        (t.status === 'urgent' || t.status === 'overdue' || t.status === 'in_progress')
    );
    
    // Sort: Overdue first, then Urgent
    myUrgentTasks.sort((a, b) => {
        if(a.status === 'overdue') return -1;
        if(b.status === 'overdue') return 1;
        return 0;
    });

    const badge = document.getElementById('admin-notification-badge');
    const list = document.getElementById('admin-notification-list');
    
    if (badge) {
        if (myUrgentTasks.length > 0) {
            badge.innerText = myUrgentTasks.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
    
    if (list) {
        if (myUrgentTasks.length === 0) {
            list.innerHTML = `<div class="p-4 text-center text-sm text-slate-500">ไม่มีงานที่ต้องเร่งดำเนินการ</div>`;
        } else {
            list.innerHTML = myUrgentTasks.map(t => `
                <div class="p-3 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer" onclick="switchAdminPage('tasks')">
                    <p class="text-sm font-bold text-slate-800 truncate">${t.title}</p>
                    <div class="flex justify-between items-center mt-1">
                        <span class="text-xs text-slate-500"><i class="fa-regular fa-clock"></i> ${t.due_date}</span>
                        <span class="text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            t.status === 'overdue' ? 'bg-red-100 text-red-600' : 
                            t.status === 'urgent' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                        }">
                           ${t.status === 'overdue' ? 'เกินกำหนด' : t.status === 'urgent' ? 'เร่งด่วน' : 'กำลังดำเนินการ'}
                        </span>
                    </div>
                </div>
            `).join('');
        }
    }
}

function toggleAdminNotifications() {
    const dropdown = document.getElementById('admin-notification-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function toggleAdminSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    if (!sidebar) return;
    
    // Check if desktop
    if (window.innerWidth >= 768) {
        // Desktop: Toggle 'md:flex' to show/hide
        sidebar.classList.toggle('md:flex');
    } else {
        // Mobile: Toggle 'hidden' and overlay
        if (sidebar.classList.contains('hidden')) {
            // Show
            sidebar.classList.remove('hidden');
            
            // Add overlay
            let overlay = document.getElementById('admin-sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'admin-sidebar-overlay';
                overlay.className = 'fixed inset-0 bg-black/50 z-[25] md:hidden';
                overlay.onclick = toggleAdminSidebar;
                document.body.appendChild(overlay);
            }
            overlay.classList.remove('hidden');
        } else {
            // Hide
            sidebar.classList.add('hidden');
            
            // Remove overlay
            const overlay = document.getElementById('admin-sidebar-overlay');
            if (overlay) overlay.classList.add('hidden');
        }
    }
}

function handleAdminLogout() {
    localStorage.removeItem('adminUser');
    window.location.href = 'index.html';
}

function switchAdminPage(page) {
    console.log('Switching to admin page:', page);
    currentAdminPage = page;
    
    // Update Sidebar Active State
    document.querySelectorAll('.admin-nav-link').forEach(l => {
        l.classList.remove('bg-slate-800', 'text-white');
        l.classList.add('text-slate-300');
    });
    const activeBtn = document.querySelector(`.admin-nav-link[data-page="${page}"]`);
    if(activeBtn) {
        activeBtn.classList.remove('text-slate-300');
        activeBtn.classList.add('bg-slate-800', 'text-white');
    }

    const contentDiv = document.getElementById('admin-content');
    const titleEl = document.getElementById('page-title');

    if (page === 'dashboard') {
        titleEl.innerText = 'Dashboard (ภาพรวม)';
        renderDashboard(contentDiv);
    } else if (page === 'users') {
        titleEl.innerText = 'จัดการสมาชิก (User Management)';
        renderUsersPage(contentDiv);
    } else if (page === 'data') {
        console.log('Rendering Data Page...'); 
        titleEl.innerText = 'จัดการคลังข้อมูล (Data Management)';
        renderDataPage(contentDiv);
    } else if (page === 'tasks') {
        titleEl.innerText = 'ติดตามบริการข้อมูล (Data Service Tracking)';
        renderTasksPage(contentDiv);
    } else if (page === 'assessment') {
        titleEl.innerText = 'ประเมินผลการปฏิบัติงาน (Assessment)';
        renderAssessmentPage(contentDiv);
    } else if (page === 'profile') {
        titleEl.innerText = 'ข้อมูลส่วนตัว (My Profile)';
        renderProfilePage(contentDiv);
    } else if (page === 'requests') {
        titleEl.innerText = 'ติดตามแบบสำรวจความต้องการ (Data Requests Tracking)';
        renderDataRequestPage(contentDiv);
    }
}

// --- Renderers ---

function renderDashboard(container) {
    const totalTasks = MOCK_DB.TASKS.length + MOCK_DB.DATA_REQUESTS.length;
    const pendingTasks = MOCK_DB.TASKS.filter(t => t.status === 'pending').length;
    const inProgressTasks = MOCK_DB.TASKS.filter(t => t.status === 'in_progress').length;
    const completedTasks = MOCK_DB.TASKS.filter(t => t.status === 'completed').length;
    const urgentTasks = MOCK_DB.TASKS.filter(t => t.status === 'urgent' || t.status === 'overdue').length;
    
    const totalRequests = MOCK_DB.DATA_REQUESTS.length;
    const pendingRequests = MOCK_DB.DATA_REQUESTS.filter(r => r.status === 'pending').length;
    const approvedRequests = MOCK_DB.DATA_REQUESTS.filter(r => r.status === 'approved').length;
    
    const totalCatalog = MOCK_DB.CATALOG.length;
    const totalStaff = MOCK_DB.USERS_LIST.filter(u => u.role === 'staff' || u.role === 'admin').length;

    container.innerHTML = `
        <!-- Main Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <div onclick="switchAdminPage('tasks')" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition group">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-list-check"></i>
                    </div>
                    <div class="text-2xl font-bold text-slate-800">${totalTasks}</div>
                </div>
                <div class="text-slate-500 text-xs font-bold uppercase group-hover:text-blue-600 transition">งานทั้งหมด</div>
            </div>
            
            <div onclick="switchAdminPage('tasks')" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-yellow-300 transition group">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-clock"></i>
                    </div>
                    <div class="text-2xl font-bold text-yellow-600">${pendingTasks}</div>
                </div>
                <div class="text-slate-500 text-xs font-bold uppercase group-hover:text-yellow-600 transition">รอดำเนินการ</div>
            </div>

            <div onclick="switchAdminPage('tasks')" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-green-300 transition group">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-check-circle"></i>
                    </div>
                    <div class="text-2xl font-bold text-green-600">${completedTasks}</div>
                </div>
                <div class="text-slate-500 text-xs font-bold uppercase group-hover:text-green-600 transition">เสร็จสิ้น</div>
            </div>

            <div onclick="switchAdminPage('requests')" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-purple-300 transition group">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-clipboard-question"></i>
                    </div>
                    <div class="text-2xl font-bold text-purple-600">${pendingRequests}</div>
                </div>
                <div class="text-slate-500 text-xs font-bold uppercase group-hover:text-purple-600 transition">แบบสำรวจรอตรวจสอบ</div>
            </div>

            <div onclick="switchAdminPage('data')" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-teal-300 transition group">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-database"></i>
                    </div>
                    <div class="text-2xl font-bold text-teal-600">${totalCatalog}</div>
                </div>
                <div class="text-slate-500 text-xs font-bold uppercase group-hover:text-teal-600 transition">ข้อมูลในคลัง</div>
            </div>

            <div onclick="switchAdminPage('users')" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-indigo-300 transition group">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <div class="text-2xl font-bold text-indigo-600">${totalStaff}</div>
                </div>
                <div class="text-slate-500 text-xs font-bold uppercase group-hover:text-indigo-600 transition">เจ้าหน้าที่</div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <!-- Urgent Tasks -->
            <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-fire text-red-500"></i> งานที่ต้องเร่งดำเนินการ
                    </h3>
                    <button onclick="switchAdminPage('tasks')" class="text-xs text-blue-600 hover:text-blue-800 font-bold">ดูทั้งหมด →</button>
                </div>
                <div class="p-4 space-y-3 max-h-[280px] overflow-y-auto">
                    ${MOCK_DB.TASKS.filter(t => t.status === 'urgent' || t.status === 'pending' || t.status === 'in_progress').slice(0, 4).map(t => `
                        <div onclick="openTaskDetailModal(${t.id})" class="flex items-start gap-3 p-3 rounded-lg border ${t.status === 'urgent' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'} cursor-pointer hover:shadow-sm transition">
                            <div class="mt-0.5">
                                <i class="fa-solid ${t.status === 'urgent' ? 'fa-circle-exclamation text-red-500' : t.status === 'in_progress' ? 'fa-spinner fa-spin text-blue-500' : 'fa-clock text-yellow-500'}"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="font-bold text-slate-800 text-sm">${t.title}</h4>
                                <p class="text-xs text-slate-500">${t.description}</p>
                                <div class="flex items-center gap-3 mt-2">
                                    <span class="text-xs text-slate-400"><i class="fa-regular fa-user mr-1"></i>${getUserName(t.assignee_id)}</span>
                                    <span class="text-xs text-slate-400"><i class="fa-regular fa-calendar mr-1"></i>${t.deadline}</span>
                                </div>
                            </div>
                            <span class="px-2 py-1 text-[10px] font-bold uppercase rounded-full ${getTaskStatusBadge(t.status)}">${getTaskStatusLabel(t.status)}</span>
                        </div>
                    `).join('')}
                    ${MOCK_DB.TASKS.filter(t => t.status === 'urgent' || t.status === 'pending' || t.status === 'in_progress').length === 0 ? '<p class="text-slate-500 text-sm text-center py-6">🎉 ไม่มีงานค้าง ทุกอย่างเรียบร้อย!</p>' : ''}
                </div>
            </div>

            <!-- Data Request Summary -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-chart-pie text-purple-500"></i> สรุปแบบสำรวจ
                    </h3>
                    <button onclick="switchAdminPage('requests')" class="text-xs text-blue-600 hover:text-blue-800 font-bold">ดูทั้งหมด →</button>
                </div>
                <div class="p-4">
                    <div class="flex justify-center mb-4">
                        <div class="relative w-32 h-32">
                            <svg viewBox="0 0 36 36" class="w-32 h-32">
                                <path class="text-slate-200" stroke="currentColor" stroke-width="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                                <path class="text-green-500" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="${(approvedRequests/totalRequests*100) || 0}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <span class="text-2xl font-bold text-slate-800">${totalRequests}</span>
                                <span class="text-xs text-slate-500">ทั้งหมด</span>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-center">
                        <div class="p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                            <p class="text-lg font-bold text-yellow-600">${pendingRequests}</p>
                            <p class="text-[10px] text-yellow-600 font-bold">รอตรวจสอบ</p>
                        </div>
                        <div class="p-2 bg-green-50 rounded-lg border border-green-100">
                            <p class="text-lg font-bold text-green-600">${approvedRequests}</p>
                            <p class="text-[10px] text-green-600 font-bold">อนุมัติ</p>
                        </div>
                        <div class="p-2 bg-red-50 rounded-lg border border-red-100">
                            <p class="text-lg font-bold text-red-600">${MOCK_DB.DATA_REQUESTS.filter(r => r.status === 'rejected').length}</p>
                            <p class="text-[10px] text-red-600 font-bold">ปฏิเสธ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Staff Activity -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-users text-blue-500"></i> ภาระงานเจ้าหน้าที่
                    </h3>
                    <button onclick="switchAdminPage('assessment')" class="text-xs text-blue-600 hover:text-blue-800 font-bold">ดูรายละเอียด →</button>
                </div>
                <div class="p-4 space-y-3">
                    ${MOCK_DB.USERS_LIST.filter(u => u.role === 'staff' || u.role === 'admin').map(u => {
                        const staffTasks = MOCK_DB.TASKS.filter(t => t.assignee_id === u.id);
                        const completed = staffTasks.filter(t => t.status === 'completed').length;
                        const total = staffTasks.length;
                        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                        return `
                            <div class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition">
                                <img src="${u.avatar}" class="w-10 h-10 rounded-full">
                                <div class="flex-1 min-w-0">
                                    <div class="flex justify-between items-center mb-1">
                                        <p class="text-sm font-bold text-slate-800 truncate">${u.name}</p>
                                        <span class="text-xs text-slate-500">${completed}/${total} งาน</span>
                                    </div>
                                    <div class="w-full bg-slate-200 rounded-full h-1.5">
                                        <div class="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full" style="width: ${percent}%"></div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Recent Data Catalog -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-database text-teal-500"></i> ข้อมูลล่าสุดในคลัง
                    </h3>
                    <button onclick="switchAdminPage('data')" class="text-xs text-blue-600 hover:text-blue-800 font-bold">ดูทั้งหมด →</button>
                </div>
                <div class="divide-y divide-slate-100">
                    ${MOCK_DB.CATALOG.slice(0, 4).map(item => `
                        <div class="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center text-teal-600">
                                <i class="fa-solid ${item.type === 'shapefile' ? 'fa-layer-group' : item.type === 'raster' ? 'fa-map' : 'fa-table'}"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-bold text-slate-800 truncate">${item.name}</p>
                                <p class="text-xs text-slate-500">${item.type.toUpperCase()} | ${item.uploader || 'N/A'}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderUsersPage(container) {
    // Unique Options for Filters
    const divisions = [...new Set(MOCK_DB.USERS_LIST.map(u => u.division))];
    const groups = [...new Set(MOCK_DB.USERS_LIST.map(u => u.group))];
    const roles = [...new Set(MOCK_DB.USERS_LIST.map(u => u.role))];
    // Statistics
    const totalUsers = MOCK_DB.USERS_LIST.length;
    const adminCount = MOCK_DB.USERS_LIST.filter(u => u.role === 'admin').length;
    const staffCount = MOCK_DB.USERS_LIST.filter(u => u.role === 'staff').length;
    const userCount = MOCK_DB.USERS_LIST.filter(u => u.role === 'user').length;

    container.innerHTML = `
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div onclick="applyUserFilter('')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition group">
                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-users"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-blue-600 transition">ผู้ใช้งานทั้งหมด</h4>
                    <p class="text-2xl font-bold text-slate-800">${totalUsers} คน</p>
                </div>
            </div>
             <div onclick="applyUserFilter('admin')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-purple-300 transition group">
                <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-user-shield"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-purple-600 transition">ผู้ดูแลระบบ (Admin)</h4>
                    <p class="text-2xl font-bold text-slate-800">${adminCount} คน</p>
                </div>
            </div>
             <div onclick="applyUserFilter('staff')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-green-300 transition group">
                <div class="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-user-tie"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-green-600 transition">เจ้าหน้าที่ (Staff)</h4>
                    <p class="text-2xl font-bold text-slate-800">${staffCount} คน</p>
                </div>
            </div>
             <div onclick="applyUserFilter('user')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-slate-400 transition group">
                <div class="w-12 h-12 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-user"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-slate-600 transition">ผู้ใช้ทั่วไป (User)</h4>
                    <p class="text-2xl font-bold text-slate-800">${userCount} คน</p>
                </div>
            </div>
        </div>

        <!-- Filters & Actions -->
        <div class="flex flex-col md:flex-row items-end gap-4 mb-6">
            <!-- Filters -->
            <div class="flex-1 w-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-end gap-4">
                <div class="flex-1 min-w-[150px]">
                    <label class="block text-xs font-bold text-slate-500 mb-1">กอง/สำนัก (Division)</label>
                    <select id="filter-division" onchange="filterUsers()" class="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option value="">ทั้งหมด</option>
                        ${divisions.map(d => `<option value="${d}">${d}</option>`).join('')}
                    </select>
                </div>
                <div class="flex-1 min-w-[150px]">
                    <label class="block text-xs font-bold text-slate-500 mb-1">กลุ่ม/ฝ่าย (Group)</label>
                    <select id="filter-group" onchange="filterUsers()" class="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option value="">ทั้งหมด</option>
                            ${groups.map(g => `<option value="${g}">${g}</option>`).join('')}
                    </select>
                </div>
                    <div class="flex-1 min-w-[150px]">
                    <label class="block text-xs font-bold text-slate-500 mb-1">สิทธิ์ (Role)</label>
                    <select id="filter-role" onchange="filterUsers()" class="w-full text-sm border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option value="">ทั้งหมด</option>
                            ${roles.map(r => `<option value="${r}">${r.toUpperCase()}</option>`).join('')}
                    </select>
                </div>
                <div class="flex items-center gap-4">
                        <div class="text-right pl-4 border-l border-slate-200">
                        <span class="text-xs text-slate-400 font-medium uppercase block">จำนวนทั้งหมด</span>
                        <span class="text-xl font-bold text-blue-600 leading-none" id="user-count">${MOCK_DB.USERS_LIST.length}</span>
                    </div>
                </div>
            </div>

            <!-- Action Button -->
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm whitespace-nowrap h-full" onclick="alert('Open Add User Modal')">
                <i class="fa-solid fa-plus"></i> เพิ่มผู้ใช้
            </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr class="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                            <th class="p-4 font-bold">ชื่อ - นามสกุล</th>
                            <th class="p-4 font-bold">Username</th>
                            <th class="p-4 font-bold">Role</th>
                            <th class="p-4 font-bold">สำนัก/กลุ่ม</th>
                            <th class="p-4 font-bold text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100" id="users-table-body">
                        <!-- Rows will be populated by filterUsers() -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Initial Render
    filterUsers();
}

// Helper to apply filter from cards
function applyUserFilter(role) {
    const roleSelect = document.getElementById('filter-role');
    if (roleSelect) {
        roleSelect.value = role;
        filterUsers();
    }
}

function filterUsers() {
    const divFilter = document.getElementById('filter-division')?.value || '';
    const groupFilter = document.getElementById('filter-group')?.value || '';
    const roleFilter = document.getElementById('filter-role')?.value || '';

    const filtered = MOCK_DB.USERS_LIST.filter(u => {
        return (!divFilter || u.division === divFilter) &&
               (!groupFilter || u.group === groupFilter) &&
               (!roleFilter || u.role === roleFilter);
    });

    // Update Count
    const countEl = document.getElementById('user-count');
    if(countEl) countEl.innerText = filtered.length;

    // Render Table
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-400">ไม่พบข้อมูลผู้ใช้งาน</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(u => `
        <tr class="hover:bg-slate-50 transition">
            <td class="p-4 flex items-center gap-3">
                <img src="${u.avatar}" class="w-8 h-8 rounded-full">
                <span class="font-medium text-slate-700">${u.name}</span>
            </td>
            <td class="p-4 text-slate-600 text-sm">${u.username}</td>
            <td class="p-4">
                <span class="px-2 py-1 rounded text-xs font-bold ${getRoleBadgeClass(u.role)} uppercase">${u.role}</span>
            </td>
            <td class="p-4 text-slate-600 text-sm">
                <div class="font-medium text-slate-700">${u.division || '-'}</div>
                <div class="text-xs text-slate-500">${u.group || '-'}</div>
            </td>
            <td class="p-4 text-right space-x-2">
                <button onclick="openEditUserModal(${u.id})" class="text-slate-400 hover:text-blue-600"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="text-slate-400 hover:text-red-600"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        </tr>
    `).join('');
}

function openEditUserModal(id) {
    const user = MOCK_DB.USERS_LIST.find(u => u.id === id);
    if (!user) return;

    // Create Modal HTML
    const modal = document.createElement('div');
    modal.id = 'edit-user-modal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 fade-in';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden font-sans">
             <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-xl text-slate-800">แก้ไขข้อมูลสมาชิก</h3>
                <button onclick="document.getElementById('edit-user-modal').remove()" class="text-slate-400 hover:text-slate-600 transition">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-4">
                <div class="flex items-center gap-4 mb-6">
                    <div class="relative group">
                         <img src="${user.avatar}" class="w-20 h-20 rounded-full border-4 border-slate-100 shadow-sm">
                         <button class="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full text-xs hover:bg-blue-700 shadow-sm"><i class="fa-solid fa-camera"></i></button>
                    </div>
                    <div>
                        <h4 class="font-bold text-lg text-slate-800">${user.name}</h4>
                        <p class="text-sm text-slate-500">@${user.username}</p>
                         <span class="px-2 py-0.5 rounded text-xs font-bold ${getRoleBadgeClass(user.role)} mt-1 inline-block uppercase">${user.role}</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">ชื่อ - นามสกุล</label>
                        <input type="text" value="${user.name}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    </div>
                     <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Username (เข้าสู่ระบบ)</label>
                        <input type="text" value="${user.username}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-slate-50" readonly>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">กอง/สำนัก</label>
                         <select class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                             <option value="${user.division}">${user.division}</option>
                             <option value="ศทส.">ศทส.</option>
                             <option value="กวพ.">กวพ.</option>
                             <option value="สบก.">สบก.</option>
                        </select>
                    </div>
                     <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">กลุ่ม/ฝ่าย</label>
                        <input type="text" value="${user.group}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                 <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">ระดับสิทธิ์ (Role)</label>
                    <select class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrator</option>
                        <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>Staff (เจ้าหน้าที่)</option>
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>User (ผู้ใช้งานทั่วไป)</option>
                    </select>
                </div>
            </div>

             <div class="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                 <button onclick="document.getElementById('edit-user-modal').remove()" class="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition">ยกเลิก</button>
                 <button onclick="alert('บันทึกข้อมูลสมาชิกเรียบร้อย (Mock)'); document.getElementById('edit-user-modal').remove();" class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition shadow-sm">บันทึก</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}



function renderDataPage(container) {
    const totalItems = MOCK_DB.CATALOG.length;
    const shapefiles = MOCK_DB.CATALOG.filter(i => i.type === 'Shapefile').length;
    const apis = MOCK_DB.CATALOG.filter(i => i.type === 'API Service').length;

    container.innerHTML = `
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div onclick="applyDataFilter('')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition group">
                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-layer-group"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-blue-600 transition">ชุดข้อมูลทั้งหมด</h4>
                    <p class="text-2xl font-bold text-slate-800">${totalItems} รายการ</p>
                </div>
            </div>
            <div onclick="applyDataFilter('Shapefile')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-orange-300 transition group">
                 <div class="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-map"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-orange-600 transition">แผนที่ (Shapefile)</h4>
                    <p class="text-2xl font-bold text-slate-800">${shapefiles} รายการ</p>
                </div>
            </div>
             <div onclick="applyDataFilter('API Service')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-purple-300 transition group">
                 <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-cloud"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-purple-600 transition">API Services</h4>
                    <p class="text-2xl font-bold text-slate-800">${apis} รายการ</p>
                </div>
            </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div class="flex items-center gap-3">
                    <h3 class="font-bold text-lg text-slate-800">รายการชุดข้อมูล (Data Catalog)</h3>
                </div>
                <button onclick="mockAddData()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm">
                    <i class="fa-solid fa-plus"></i> นำเข้าข้อมูลใหม่
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr class="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                            <th class="p-4 font-bold">ชื่อชุดข้อมูล</th>
                            <th class="p-4 font-bold">ประเภท</th>
                            <th class="p-4 font-bold">เจ้าของข้อมูล</th>
                            <th class="p-4 font-bold">ปีงบฯ</th>
                            <th class="p-4 font-bold">ผู้ลงข้อมูล</th>
                            <th class="p-4 font-bold">Update ล่าสุด</th>
                            <th class="p-4 font-bold text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100" id="data-table-body">
                        <!-- Populated by filterData -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Store filter state in a closure or global if needed, but for now we'll just use a module-level variable or parameter. 
    // Since admin.js is one big file, we can use a hidden field or just a global variable.
    // Let's use a global variable `currentDataFilter` for simplicity in this context, or attach to window.
    window.currentDataFilter = ''; // Reset on render
    filterData();
}

function applyDataFilter(type) {
    window.currentDataFilter = type;
    filterData();
}

function filterData() {
    const type = window.currentDataFilter || '';
    const filtered = MOCK_DB.CATALOG.filter(item => !type || item.type === type);
    
    const tbody = document.getElementById('data-table-body');
    if(!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-400">ไม่พบข้อมูล</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(item => `
        <tr class="hover:bg-blue-50/30 transition group" id="row-data-${item.id}">
            <td class="p-4">
                <span class="font-bold text-slate-700 block">${item.title}</span>
                <span class="text-xs text-slate-400">ID: ${item.id}</span>
            </td>
            <td class="p-4">
                <span class="px-2 py-1 rounded text-xs font-bold bg-${item.typeColor}-100 text-${item.typeColor}-700 border border-${item.typeColor}-200">
                    <i class="fa-solid ${item.icon} mr-1"></i> ${item.type}
                </span>
            </td>
            <td class="p-4 text-slate-600 text-sm">${item.metadata?.owner || '-'}</td>
            <td class="p-4 text-slate-600 text-sm">${item.year}</td>
            <td class="p-4 text-slate-600 text-sm">
                <span class="flex items-center gap-2">
                    <i class="fa-solid fa-user-pen text-slate-400"></i> ${item.uploader || 'System'}
                </span>
            </td>
            <td class="p-4 text-slate-600 text-sm flex items-center gap-2">
                <i class="fa-regular fa-clock text-slate-400"></i> ${item.metadata?.last_updated || '-'}
            </td>
            <td class="p-4 text-right space-x-2">
                <button onclick="openEditDataModal(${item.id})" class="text-slate-400 hover:text-blue-600 transition p-2 rounded-full hover:bg-blue-100"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="mockDeleteData(${item.id})" class="text-slate-400 hover:text-red-600 transition p-2 rounded-full hover:bg-red-100"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        </tr>
    `).join('');
}

function mockAddData() {
    const newId = MOCK_DB.CATALOG.length + 1;
    alert(`จำลองการเพิ่มข้อมูลใหม่ (New ID: ${newId})\nระบบจะเปิด Form ให้กรอกข้อมูล (ยังไม่ได้ implement form จริง)`);
}

function openEditDataModal(id) {
    const item = MOCK_DB.CATALOG.find(i => i.id === id);
    if (!item) return;

    // Create Modal HTML
    const modal = document.createElement('div');
    modal.id = 'edit-modal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 fade-in';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 class="font-bold text-xl text-slate-800">แก้ไขข้อมูล: ${item.title}</h3>
                <button onclick="document.getElementById('edit-modal').remove()" class="text-slate-400 hover:text-slate-600">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-6">
                <!-- Basic Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">ชื่อชุดข้อมูล</label>
                        <input type="text" value="${item.title}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-slate-50">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">ประเภทข้อมูล</label>
                        <select class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                            <option value="Shapefile" ${item.type === 'Shapefile' ? 'selected' : ''}>Shapefile</option>
                            <option value="API Service" ${item.type === 'API Service' ? 'selected' : ''}>API Service</option>
                            <option value="CSV / Excel" ${item.type === 'CSV / Excel' ? 'selected' : ''}>CSV / Excel</option>
                        </select>
                    </div>
                     <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">ปีงบประมาณ</label>
                        <input type="text" value="${item.year}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    </div>
                     <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">หน่วยงานเจ้าของ</label>
                        <input type="text" value="${item.metadata?.owner || ''}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">รายละเอียด</label>
                    <textarea rows="3" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">${item.description || ''}</textarea>
                </div>

                <!-- Tags -->
                <div>
                     <label class="block text-sm font-bold text-slate-700 mb-1">คำค้นหา (Tags)</label>
                     <div class="flex flex-wrap gap-2 mb-2 p-2 border border-slate-200 rounded-lg bg-slate-50">
                        ${(item.tags || []).map(t => `<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">#${t}</span>`).join('')}
                     </div>
                     <p class="text-xs text-slate-400">ระบบ Tag ยังต้องพัฒนาเพิ่มเติม</p>
                </div>

                 <!-- Contact -->
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">ผู้ติดต่อ</label>
                        <input type="text" value="${item.metadata?.contact || ''}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    </div>
                     <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">วันที่อัปเดตล่าสุด</label>
                        <input type="text" value="${item.metadata?.last_updated || ''}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" readonly>
                    </div>
                 </div>
            </div>

            <div class="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                 <button onclick="document.getElementById('edit-modal').remove()" class="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition">ยกเลิก</button>
                 <button onclick="alert('บันทึกการแก้ไขเรียบร้อย (Mock)'); document.getElementById('edit-modal').remove();" class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition shadow-sm">บันทึกการเปลี่ยนแปลง</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function mockDeleteData(id) {
    if(confirm('คุณต้องการลบข้อมูลนี้ใช่หรือไม่?')) {
        const row = document.getElementById(`row-data-${id}`);
        if(row) {
            row.style.backgroundColor = '#fee2e2'; // Light red
            setTimeout(() => {
                row.remove();
                alert('ลบข้อมูลเรียบร้อย (Mock)');
            }, 500);
        }
    }
}

function renderTasksPage(container) {
    const tasks = MOCK_DB.TASKS || [];
    const inProgress = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const urgent = tasks.filter(t => t.status === 'urgent' || t.status === 'overdue').length;

    container.innerHTML = `
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div onclick="applyTaskFilter('')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition group">
                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-clipboard-list"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-blue-600 transition">งานทั้งหมด</h4>
                    <p class="text-2xl font-bold text-slate-800">${tasks.length} งาน</p>
                </div>
            </div>
            <div onclick="applyTaskFilter('in_progress')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-orange-300 transition group">
                <div class="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-spinner"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-orange-600 transition">กำลังดำเนินการ</h4>
                    <p class="text-2xl font-bold text-slate-800">${inProgress} งาน</p>
                </div>
            </div>
             <div onclick="applyTaskFilter('completed')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-green-300 transition group">
                <div class="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-check-circle"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-green-600 transition">เสร็จสิ้นแล้ว</h4>
                    <p class="text-2xl font-bold text-slate-800">${completed} งาน</p>
                </div>
            </div>
             <div onclick="applyTaskFilter('urgent')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-red-300 transition group">
                <div class="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-fire"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-red-600 transition">เร่งด่วน / เกินกำหนด</h4>
                    <p class="text-2xl font-bold text-slate-800">${urgent} งาน</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 class="font-bold text-lg text-slate-800 mb-4">มอบหมายงาน (Assign Task)</h3>
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <form class="flex flex-col md:flex-row items-end gap-4">
                    <div class="flex-1 w-full">
                        <label class="block text-sm font-medium text-slate-700 mb-1">ชื่องาน (Task Name)</label>
                        <select class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                            <option value="">-- เลือกชื่องาน --</option>
                            <option value="ตรวจสอบชั้นข้อมูล GIS (GIS Layer Verification)">ตรวจสอบชั้นข้อมูล GIS (GIS Layer Verification)</option>
                            <option value="วิเคราะห์ข้อมูลเชิงพื้นที่ (Spatial Analysis)">วิเคราะห์ข้อมูลเชิงพื้นที่ (Spatial Analysis)</option>
                            <option value="จัดทำแผนที่เฉพาะกิจ (Thematic Map Creation)">จัดทำแผนที่เฉพาะกิจ (Thematic Map Creation)</option>
                            <option value="บริการข้อมูลแผนที่ออนไลน์ (Web Map Service Request)">บริการข้อมูลแผนที่ออนไลน์ (Web Map Service Request)</option>
                            <option value="อื่นๆ (Other)">อื่นๆ (Other)</option>
                        </select>
                    </div>
                     <div class="flex-1 w-full">
                        <label class="block text-sm font-medium text-slate-700 mb-1">ผู้รับผิดชอบ (Assignee)</label>
                        <select class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                             <option value="">-- เลือกเจ้าหน้าที่ --</option>
                            ${MOCK_DB.USERS_LIST.filter(u => u.role === 'staff').map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                        </select>
                    </div>
                     <div class="min-w-[180px]">
                        <label class="block text-sm font-medium text-slate-700 mb-1">กำหนดส่ง (Due Date)</label>
                        <input type="date" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                    </div>
                    <button type="button" onclick="alert('จำลองการมอบหมายงานสำเร็จ')" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-sm whitespace-nowrap">
                          <i class="fa-solid fa-user-check mr-1"></i> บันทึก
                    </button>
                </form>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div class="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 class="font-bold text-lg text-slate-800">รายการบริการข้อมูลเชิงพื้นที่ (Spatial Data Services)</h3>
                 <button onclick="applyTaskFilter('')" class="text-xs text-blue-600 hover:text-blue-800 font-bold">แสดงทั้งหมด</button>
            </div>
             <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[900px]">
                <thead>
                    <tr class="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                        <th class="p-4 font-bold">งาน</th>
                        <th class="p-4 font-bold">ผู้รับผิดชอบ</th>
                        <th class="p-4 font-bold">Deadline</th>
                        <th class="p-4 font-bold">สถานะ</th>
                        <th class="p-4 font-bold text-right">จัดการ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100" id="tasks-table-body">
                    <!-- Populated by filterTasks -->
                </tbody>
            </table>
        </div>
    `;

    window.currentTaskFilter = '';
    filterTasks();
}

function applyTaskFilter(status) {
    window.currentTaskFilter = status;
    filterTasks();
}

function filterTasks() {
    const status = window.currentTaskFilter || '';
    const filtered = MOCK_DB.TASKS.filter(t => {
        if (!status) return true;
        if (status === 'in_progress') return t.status === 'pending' || t.status === 'in_progress';
        if (status === 'urgent') return t.status === 'urgent' || t.status === 'overdue';
        return t.status === status;
    });

    const tbody = document.getElementById('tasks-table-body');
    if(!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-400">ไม่พบข้อมูลงาน</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(t => `
            <tr class="hover:bg-slate-50 transition">
            <td class="p-4">
                <p class="font-medium text-slate-700">${t.title}</p>
                <p class="text-xs text-slate-500 truncate max-w-[200px]">${t.description}</p>
            </td>
            <td class="p-4 flex items-center gap-2">
                <img src="${getUserAvatar(t.assignee_id)}" class="w-6 h-6 rounded-full">
                <span class="text-sm text-slate-600">${getUserName(t.assignee_id)}</span>
            </td>
            <td class="p-4 text-sm text-slate-600">${t.deadline}</td>
            <td class="p-4">
                <span class="px-2 py-1 rounded-full text-xs font-bold uppercase ${getTaskStatusBadge(t.status)}">
                    ${getTaskStatusLabel(t.status)}
                </span>
            </td>
            <td class="p-4 text-right">
                <button onclick="openTaskDetailModal(${t.id})" class="text-blue-600 hover:text-blue-800 font-medium text-sm">รายละเอียด</button>
            </td>
            </tr>
    `).join('');
}

function getTaskStatusBadge(status) {
    if(status === 'pending') return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    if(status === 'in_progress') return 'bg-blue-100 text-blue-700 border border-blue-200';
    if(status === 'completed') return 'bg-green-100 text-green-700 border border-green-200';
    if(status === 'urgent') return 'bg-red-100 text-red-700 border border-red-200';
    if(status === 'overdue') return 'bg-orange-100 text-orange-700 border border-orange-200';
    return 'bg-slate-100 text-slate-600';
}

function getTaskStatusLabel(status) {
    if(status === 'pending') return 'รอเริ่มงาน';
    if(status === 'in_progress') return 'กำลังดำเนินการ';
    if(status === 'completed') return 'เสร็จสิ้น';
    if(status === 'urgent') return 'เร่งด่วน';
    if(status === 'overdue') return 'เกินกำหนด';
    return status;
}

function openTaskDetailModal(id) {
    const task = MOCK_DB.TASKS.find(t => t.id === id);
    if (!task) return;

    const assignee = MOCK_DB.USERS_LIST.find(u => u.id === task.assignee_id);

    // Create Modal HTML
    const modal = document.createElement('div');
    modal.id = 'task-detail-modal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 fade-in';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden font-sans">
             <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-xl text-slate-800">รายละเอียดงาน (Task Details)</h3>
                <button onclick="document.getElementById('task-detail-modal').remove()" class="text-slate-400 hover:text-slate-600 transition">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-4">
                <div class="flex items-center gap-3 mb-2">
                     <span class="px-2 py-1 rounded-full text-xs font-bold uppercase ${getTaskStatusBadge(task.status)}">
                        ${getTaskStatusLabel(task.status)}
                    </span>
                    <span class="text-xs text-slate-400">Due: ${task.deadline}</span>
                </div>

                <div>
                     <h4 class="text-lg font-bold text-slate-800 mb-2">${task.title}</h4>
                     <p class="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                        ${task.description}
                     </p>
                </div>

                <div class="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <img src="${assignee?.avatar || ''}" class="w-10 h-10 rounded-full border border-slate-200">
                    <div>
                        <p class="text-sm font-bold text-slate-700">ผู้รับผิดชอบ</p>
                        <p class="text-xs text-slate-500">${assignee?.name || 'Unknown'}</p>
                    </div>
                </div>

                <div class="pt-6 mt-4 border-t border-slate-100">
                    <label class="block text-sm font-bold text-slate-700 mb-2">อัปเดตสถานะงาน</label>
                    <div class="flex gap-2">
                        <button onclick="updateTaskStatus(${task.id}, 'pending')" class="flex-1 py-1.5 text-xs rounded border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-bold transition">รอเริ่มงาน</button>
                        <button onclick="updateTaskStatus(${task.id}, 'in_progress')" class="flex-1 py-1.5 text-xs rounded border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition">ดำเนินการ</button>
                        <button onclick="updateTaskStatus(${task.id}, 'completed')" class="flex-1 py-1.5 text-xs rounded border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 font-bold transition">เสร็จสิ้น</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateTaskStatus(id, newStatus) {
    const task = MOCK_DB.TASKS.find(t => t.id === id);
    if(task) {
        task.status = newStatus;
        document.getElementById('task-detail-modal').remove();
        renderTasksPage(document.getElementById('admin-content'));
        alert(`อัปเดตสถานะเป็น "${getTaskStatusLabel(newStatus)}" เรียบร้อย`);
    }
}

function renderAssessmentPage(container) {
    container.innerHTML = `
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div onclick="applyAssessmentFilter('')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition group">
                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-users"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-blue-600 transition">เจ้าหน้าที่ทั้งหมด</h4>
                    <p class="text-2xl font-bold text-slate-800">${MOCK_DB.USERS_LIST.filter(u => u.role === 'staff' || u.role === 'admin').length} คน</p>
                </div>
            </div>
            <div onclick="applyAssessmentFilter('completed')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-green-300 transition group">
                <div class="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-check-double"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-green-600 transition">งานเสร็จสิ้นรวม</h4>
                    <p class="text-2xl font-bold text-slate-800">${MOCK_DB.TASKS.filter(t => t.status === 'completed').length} งาน</p>
                </div>
            </div>
            <div onclick="applyAssessmentFilter('pending')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-yellow-300 transition group">
                <div class="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-hourglass-half"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-yellow-600 transition">งานค้างอยู่รวม</h4>
                    <p class="text-2xl font-bold text-slate-800">${MOCK_DB.TASKS.filter(t => t.status !== 'completed').length} งาน</p>
                </div>
            </div>
            <div onclick="applyAssessmentFilter('score')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-purple-300 transition group">
                <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-star"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-purple-600 transition">คะแนนเฉลี่ย</h4>
                    <p class="text-2xl font-bold text-slate-800">${Math.round(MOCK_DB.ASSESSMENTS.reduce((sum, a) => sum + a.score, 0) / MOCK_DB.ASSESSMENTS.length)}/100</p>
                </div>
            </div>
        </div>

        <!-- Staff Performance Cards -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <i class="fa-solid fa-user-chart text-primary"></i> ภาพรวมผลงานเจ้าหน้าที่
                </h3>
                 <button onclick="applyAssessmentFilter('')" class="text-xs text-blue-600 hover:text-blue-800 font-bold">แสดงทั้งหมด</button>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="staff-performance-grid">
                    <!-- Populated by filterAssessments -->
                </div>
            </div>
        </div>

        <!-- Assessment History Table -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="p-6 border-b border-slate-200 bg-slate-50">
                <h3 class="font-bold text-lg text-slate-800">ประวัติการประเมินล่าสุด</h3>
            </div>
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                        <th class="p-4 font-bold">เจ้าหน้าที่</th>
                        <th class="p-4 font-bold">หัวข้อประเมิน (KPI)</th>
                        <th class="p-4 font-bold">คะแนน</th>
                        <th class="p-4 font-bold">วันที่</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    ${MOCK_DB.ASSESSMENTS.map(a => `
                        <tr class="hover:bg-slate-50 transition">
                            <td class="p-4">
                                <div class="flex items-center gap-2">
                                    <img src="${getUserAvatar(a.staff_id)}" class="w-8 h-8 rounded-full">
                                    <span class="text-sm font-medium text-slate-700">${getUserName(a.staff_id)}</span>
                                </div>
                            </td>
                            <td class="p-4 text-sm text-slate-600">${a.criteria}</td>
                            <td class="p-4">
                                <div class="w-full bg-slate-200 rounded-full h-2.5 max-w-[100px] inline-block mr-2 align-middle">
                                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${a.score}%"></div>
                                </div>
                                <span class="text-sm font-bold text-slate-700">${a.score}/100</span>
                            </td>
                            <td class="p-4 text-sm text-slate-500">${a.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    window.currentAssessmentFilter = '';
    filterAssessments();
}

function applyAssessmentFilter(type) {
    window.currentAssessmentFilter = type;
    filterAssessments();
}

function filterAssessments() {
    const type = window.currentAssessmentFilter || '';
    const container = document.getElementById('staff-performance-grid');
    if (!container) return;

    let staffList = MOCK_DB.USERS_LIST.filter(u => u.role === 'staff' || u.role === 'admin');

    // Filter Logic
    if (type === 'completed') {
        // Filter staff who have distinct completed tasks
        staffList = staffList.filter(u => {
            return MOCK_DB.TASKS.some(t => t.assignee_id === u.id && t.status === 'completed');
        }).sort((a,b) => {
             const aCount = MOCK_DB.TASKS.filter(t => t.assignee_id === a.id && t.status === 'completed').length;
             const bCount = MOCK_DB.TASKS.filter(t => t.assignee_id === b.id && t.status === 'completed').length;
             return bCount - aCount;
        });
    } else if (type === 'pending') {
        // Filter staff who have pending tasks
         staffList = staffList.filter(u => {
            return MOCK_DB.TASKS.some(t => t.assignee_id === u.id && t.status !== 'completed');
        }).sort((a,b) => {
             const aCount = MOCK_DB.TASKS.filter(t => t.assignee_id === a.id && t.status !== 'completed').length;
             const bCount = MOCK_DB.TASKS.filter(t => t.assignee_id === b.id && t.status !== 'completed').length;
             return bCount - aCount;
        });
    } else if (type === 'score') {
         // Filter staff who have assessments and sort by AVG score
          staffList = staffList.filter(u => {
            return MOCK_DB.ASSESSMENTS.some(a => a.staff_id === u.id);
        }).sort((a,b) => {
             const aScores = MOCK_DB.ASSESSMENTS.filter(x => x.staff_id === a.id);
             const bScores = MOCK_DB.ASSESSMENTS.filter(x => x.staff_id === b.id);
             const aAvg = aScores.length ? aScores.reduce((s, x) => s + x.score, 0) / aScores.length : 0;
             const bAvg = bScores.length ? bScores.reduce((s, x) => s + x.score, 0) / bScores.length : 0;
             return bAvg - aAvg;
        });
    }

    if (staffList.length === 0) {
        container.innerHTML = `<div class="col-span-1 md:col-span-2 text-center p-8 text-slate-400">ไม่พบเจ้าหน้าที่ตามเงื่อนไข</div>`;
        return;
    }

    container.innerHTML = staffList.map(staff => {
        const staffTasks = MOCK_DB.TASKS.filter(t => t.assignee_id === staff.id);
        const totalTasks = staffTasks.length;
        const completedTasks = staffTasks.filter(t => t.status === 'completed').length;
        const pendingTasks = totalTasks - completedTasks;
        const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const staffAssessments = MOCK_DB.ASSESSMENTS.filter(a => a.staff_id === staff.id);
        const avgScore = staffAssessments.length > 0 ? Math.round(staffAssessments.reduce((sum, a) => sum + a.score, 0) / staffAssessments.length) : 0;
        const starCount = Math.round(avgScore / 20);
        
        return `
            <div class="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
                <div class="flex items-start gap-4 mb-4">
                    <img src="${staff.avatar}" class="w-16 h-16 rounded-full border-4 border-white shadow-sm">
                    <div class="flex-1">
                        <h4 class="font-bold text-slate-800 text-lg">${staff.name}</h4>
                        <p class="text-sm text-slate-500">${staff.division} | ${staff.group}</p>
                        <div class="flex items-center gap-1 mt-1">
                            ${[1,2,3,4,5].map(i => `<i class="fa-${i <= starCount ? 'solid' : 'regular'} fa-star text-yellow-400 text-sm"></i>`).join('')}
                            <span class="text-xs text-slate-400 ml-2">(${avgScore}/100)</span>
                        </div>
                    </div>
                    <span class="px-2 py-1 rounded-full text-xs font-bold ${staff.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">
                        ${staff.role === 'admin' ? 'Admin' : 'Staff'}
                    </span>
                </div>

                <div class="grid grid-cols-3 gap-3 mb-4">
                    <div class="bg-white p-3 rounded-lg border border-slate-100 text-center">
                        <p class="text-xl font-bold text-slate-800">${totalTasks}</p>
                        <p class="text-[10px] text-slate-500 uppercase font-bold">งานทั้งหมด</p>
                    </div>
                    <div class="bg-white p-3 rounded-lg border border-green-100 text-center">
                        <p class="text-xl font-bold text-green-600">${completedTasks}</p>
                        <p class="text-[10px] text-green-600 uppercase font-bold">เสร็จแล้ว</p>
                    </div>
                    <div class="bg-white p-3 rounded-lg border border-yellow-100 text-center">
                        <p class="text-xl font-bold text-yellow-600">${pendingTasks}</p>
                        <p class="text-[10px] text-yellow-600 uppercase font-bold">ค้างอยู่</p>
                    </div>
                </div>

                <div class="mb-3">
                    <div class="flex justify-between text-xs mb-1">
                        <span class="text-slate-500">ความคืบหน้างาน</span>
                        <span class="font-bold text-slate-700">${progressPercent}%</span>
                    </div>
                    <div class="w-full bg-slate-200 rounded-full h-2">
                        <div class="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all" style="width: ${progressPercent}%"></div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button onclick="openStaffPerformanceModal(${staff.id})" class="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                        <i class="fa-solid fa-chart-line mr-1"></i> ดูผลงาน
                    </button>
                    <button onclick="openAddAssessmentModal(${staff.id})" class="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition">
                        <i class="fa-solid fa-plus mr-1"></i> ประเมิน
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Helpers
function getRoleBadgeClass(role) {
    if (role === 'admin') return 'bg-red-100 text-red-700';
    if (role === 'staff') return 'bg-blue-100 text-blue-700';
    return 'bg-slate-100 text-slate-700';
}

function getStatusBadge(status) {
    const map = {
        'pending': 'bg-orange-100 text-orange-700',
        'in_progress': 'bg-blue-100 text-blue-700',
        'completed': 'bg-green-100 text-green-700',
        'overdue': 'bg-red-100 text-red-700'
    };
    const label = {
        'pending': 'รอดำเนินการ',
        'in_progress': 'กำลังทำ',
        'completed': 'เสร็จสิ้น',
        'overdue': 'เกินกำหนด'
    };
    return `<span class="px-2 py-1 rounded-full text-xs font-bold ${map[status]}">${label[status]}</span>`;
}

function getUserName(id) {
    const u = MOCK_DB.USERS_LIST.find(x => x.id === id);
    return u ? u.name : 'Unknown';
}
function getUserAvatar(id) {
     const u = MOCK_DB.USERS_LIST.find(x => x.id === id);
    return u ? u.avatar : '';
}
function getTaskCount(userId) {
    return MOCK_DB.TASKS.filter(t => t.assignee_id === userId).length;
}

function renderProfilePage(container) {
    // Get Current Admin User (from localStorage or mock default)
    const adminUser = JSON.parse(localStorage.getItem('adminUser')) || {
        name: 'Administrator',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=ef4444&color=fff',
        division: 'ศทส.',
        group: 'ส่วนพัฒนาระบบ'
    };

    container.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <!-- Profile Header -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 flex items-center gap-6">
                <div class="relative group cursor-pointer">
                    <img src="${adminUser.avatar}" class="w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm">
                    <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                         <i class="fa-solid fa-camera text-white"></i>
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">${adminUser.name}</h2>
                    <p class="text-slate-500 font-medium">@${adminUser.role === 'admin' ? 'admin' : 'staff'}</p>
                    <div class="flex gap-2 mt-2">
                        <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">${adminUser.role}</span>
                        <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">${adminUser.division} / ${adminUser.group}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Main Info Form -->
                <div class="md:col-span-2 space-y-6">
                    <!-- General Info -->
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 class="font-bold text-lg text-slate-800 mb-4 pb-2 border-b border-slate-100">ข้อมูลติดต่อ (Contact Info)</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">ชื่อ - นามสกุล</label>
                                <input type="text" value="${adminUser.name}" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                            </div>
                             <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                                <input type="text" value="02-123-4567" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                            </div>
                             <div class="md:col-span-2">
                                <label class="block text-sm font-bold text-slate-700 mb-1">อีเมล</label>
                                <input type="email" value="admin@onwr.go.th" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                            </div>
                             <div class="md:col-span-2">
                                <label class="block text-sm font-bold text-slate-700 mb-1">ที่อยู่</label>
                                <textarea rows="2" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">89/168 ถนนวิภาวดีรังสิต แขวงตลาดบางเขน เขตหลักสี่ กรุงเทพมหานคร 10210</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Security -->
                     <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 class="font-bold text-lg text-slate-800 mb-4 pb-2 border-b border-slate-100">ความปลอดภัย (Security)</h3>
                        <div class="space-y-4">
                             <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1">รหัสผ่านปัจจุบัน</label>
                                <input type="password" placeholder="••••••••" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                            </div>
                             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">รหัสผ่านใหม่</label>
                                    <input type="password" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                                </div>
                                 <div>
                                    <label class="block text-sm font-bold text-slate-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
                                    <input type="password" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>
                            <div class="flex justify-end pt-2">
                                <button onclick="alert('จำลองการเปลี่ยนรหัสผ่านสำเร็จ')" class="text-blue-600 text-sm font-bold hover:underline">เปลี่ยนรหัสผ่าน</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Settings -->
                <div class="space-y-6">
                     <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 class="font-bold text-lg text-slate-800 mb-4">การแจ้งเตือน</h3>
                        <div class="space-y-3">
                            <label class="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked class="w-4 h-4 text-blue-600 rounded">
                                <span class="text-sm text-slate-600">อีเมลแจ้งเตือนงานใหม่</span>
                            </label>
                             <label class="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked class="w-4 h-4 text-blue-600 rounded">
                                <span class="text-sm text-slate-600">แจ้งเตือนเมื่อครบกำหนด</span>
                            </label>
                             <label class="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" class="w-4 h-4 text-blue-600 rounded">
                                <span class="text-sm text-slate-600">ข่าวสารประชาสัมพันธ์</span>
                            </label>
                        </div>
                    </div>

                     <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 class="font-bold text-lg text-slate-800 mb-4">การแสดงผล</h3>
                        <div class="space-y-3">
                            <label class="flex items-center gap-3 cursor-pointer">
                                <input type="radio" name="theme" checked class="w-4 h-4 text-blue-600">
                                <span class="text-sm text-slate-600">Light Mode (ค่าเริ่มต้น)</span>
                            </label>
                             <label class="flex items-center gap-3 cursor-pointer">
                                <input type="radio" name="theme" class="w-4 h-4 text-blue-600">
                                <span class="text-sm text-slate-600">Dark Mode</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-3">
                <button onclick="switchAdminPage('dashboard')" class="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold hover:bg-slate-50 transition">ยกเลิก</button>
                <button onclick="alert('บันทึกข้อมูลส่วนตัวเรียบร้อย (Mock)')" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm">บันทึกการเปลี่ยนแปลง</button>
            </div>
        </div>
    `;
}

function renderDataRequestPage(container) {
    const requests = MOCK_DB.DATA_REQUESTS || [];
    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div onclick="applyRequestFilter('')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition group">
                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-folder-open"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-blue-600 transition">คำขอทั้งหมด</h4>
                    <p class="text-2xl font-bold text-slate-800">${requests.length} รายการ</p>
                </div>
            </div>
            <div onclick="applyRequestFilter('pending')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-yellow-300 transition group">
                <div class="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-clock"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-yellow-600 transition">รอการตรวจสอบ</h4>
                    <p class="text-2xl font-bold text-slate-800">${pending} รายการ</p>
                </div>
            </div>
             <div onclick="applyRequestFilter('approved')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-green-300 transition group">
                <div class="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-check-circle"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-green-600 transition">อนุมัติแล้ว</h4>
                    <p class="text-2xl font-bold text-slate-800">${approved} รายการ</p>
                </div>
            </div>
             <div onclick="applyRequestFilter('rejected')" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-red-300 transition group">
                <div class="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xl">
                    <i class="fa-solid fa-times-circle"></i>
                </div>
                <div>
                    <h4 class="text-slate-500 text-sm font-bold uppercase group-hover:text-red-600 transition">ปฏิเสธแล้ว</h4>
                    <p class="text-2xl font-bold text-slate-800">${rejected} รายการ</p>
                </div>
            </div>
        </div>

        <!-- Assign Staff Section -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 class="font-bold text-lg text-slate-800 mb-4">มอบหมายเจ้าหน้าที่รับผิดชอบ (Assign Staff)</h3>
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <form class="flex flex-col md:flex-row items-end gap-4">
                    <div class="flex-1 w-full">
                        <label class="block text-sm font-medium text-slate-700 mb-1">เลือกคำขอ (Select Request)</label>
                        <select class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                            <option value="">-- เลือกรายการ --</option>
                            ${requests.filter(r => r.status === 'pending').map(r => `<option value="${r.id}">[${r.date}] ${r.topic} - ${r.userName}</option>`).join('')}
                        </select>
                    </div>
                    <div class="flex-1 w-full">
                        <label class="block text-sm font-medium text-slate-700 mb-1">เลือกเจ้าหน้าที่ (Select Staff)</label>
                        <select class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                             <option value="">-- เลือกเจ้าหน้าที่ --</option>
                             ${MOCK_DB.USERS_LIST.filter(u => u.role === 'staff').map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                        </select>
                    </div>
                     <div class="flex-1 w-full">
                        <label class="block text-sm font-medium text-slate-700 mb-1">กำหนดส่ง (Due Date)</label>
                        <input type="date" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
                    </div>
                    <button type="button" onclick="alert('มอบหมายงานเรียบร้อยแล้ว')" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-sm whitespace-nowrap">
                        <i class="fa-solid fa-user-check mr-1"></i> บันทึก
                    </button>
                </form>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div class="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 class="font-bold text-lg text-slate-800">รายการคำขอข้อมูล (Data Requests)</h3>
                <button onclick="applyRequestFilter('')" class="text-xs text-blue-600 hover:text-blue-800 font-bold">แสดงทั้งหมด</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr class="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                            <th class="p-4 font-bold">วันที่ขอ</th>
                            <th class="p-4 font-bold">ผู้ขอข้อมูล</th>
                            <th class="p-4 font-bold">หัวข้อ request</th>
                            <th class="p-4 font-bold">ผู้รับผิดชอบ</th>
                            <th class="p-4 font-bold">สถานะ</th>
                            <th class="p-4 font-bold text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100" id="requests-table-body">
                    <!-- Populated by filterRequests -->
                </tbody>
            </table>
        </div>
    `;

    window.currentRequestFilter = '';
    filterRequests();
}

function applyRequestFilter(status) {
    window.currentRequestFilter = status;
    filterRequests();
}

function filterRequests() {
    const status = window.currentRequestFilter || '';
    const filtered = MOCK_DB.DATA_REQUESTS.filter(r => !status || r.status === status);

    const tbody = document.getElementById('requests-table-body');
    if(!tbody) return;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-8 text-center text-slate-400">ไม่พบคำขอข้อมูล</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(r => `
        <tr class="hover:bg-slate-50 transition">
            <td class="p-4 text-slate-600 text-sm">${r.date}</td>
            <td class="p-4">
                <span class="font-bold text-slate-700 block">${r.userName}</span>
                <span class="text-xs text-slate-400">ID: ${r.userId}</span>
            </td>
            <td class="p-4 text-slate-700 font-medium">${r.topic}</td>
            <td class="p-4">
                ${r.assignee_id ? `
                    <div class="flex items-center gap-2">
                        <img src="${getUserAvatar(r.assignee_id)}" class="w-6 h-6 rounded-full">
                        <span class="text-sm text-slate-600">${getUserName(r.assignee_id)}</span>
                    </div>
                ` : '<span class="text-xs text-slate-400">ยังไม่มอบหมาย</span>'}
            </td>
            <td class="p-4">
                <span class="px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(r.status)}">
                    ${getStatusLabel(r.status)}
                </span>
            </td>
            <td class="p-4 text-right">
                <button onclick="openRequestModal(${r.id})" class="text-blue-600 hover:text-blue-800 font-medium text-sm">รายละเอียด</button>
            </td>
        </tr>
    `).join('');
}

function getStatusBadge(status) {
    if(status === 'pending') return 'bg-yellow-100 text-yellow-700';
    if(status === 'approved') return 'bg-green-100 text-green-700';
    if(status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-slate-600';
}

function getStatusLabel(status) {
    if(status === 'pending') return 'รอตรวจสอบ';
    if(status === 'approved') return 'อนุมัติ';
    if(status === 'rejected') return 'ปฏิเสธ';
    return status;
}

function openRequestModal(id) {
    const request = MOCK_DB.DATA_REQUESTS.find(r => r.id === id);
    if (!request) return;

    // Create Modal HTML
    const modal = document.createElement('div');
    modal.id = 'request-modal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 fade-in';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden font-sans">
             <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-xl text-slate-800">รายละเอียดคำขอ ID: ${request.id}</h3>
                <button onclick="document.getElementById('request-modal').remove()" class="text-slate-400 hover:text-slate-600 transition">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-4">
                <div>
                     <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">หัวข้อ</label>
                     <p class="text-lg font-bold text-slate-800">${request.topic}</p>
                </div>
                 <div class="grid grid-cols-2 gap-4">
                     <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">ผู้ขอ</label>
                        <p class="text-sm text-slate-700 font-medium">${request.userName}</p>
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">วันที่</label>
                        <p class="text-sm text-slate-700 font-medium">${request.date}</p>
                    </div>
                </div>
                 <div>
                     <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">วัตถุประสงค์</label>
                     <span class="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">${request.type}</span>
                </div>
                 <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
                     <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">รายละเอียดความต้องการ</label>
                     <p class="text-sm text-slate-700 leading-relaxed">${request.details}</p>
                </div>

                ${request.status === 'pending' ? `
                    <div class="pt-4 border-t border-slate-100 flex gap-3">
                        <button onclick="updateRequestStatus(${request.id}, 'rejected')" class="flex-1 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-bold transition">ปฏิเสธคำขอ</button>
                        <button onclick="updateRequestStatus(${request.id}, 'approved')" class="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition shadow-sm">อนุมัติคำขอ</button>
                    </div>
                ` : `
                    <div class="pt-4 border-t border-slate-100 text-center">
                        <span class="text-slate-500 text-sm font-medium">คำขอนี้ดำเนินการแล้ว:</span>
                        <span class="ml-2 px-2 py-1 rounded text-xs font-bold uppercase ${getStatusBadge(request.status)}">${getStatusLabel(request.status)}</span>
                    </div>
                `}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateRequestStatus(id, newStatus) {
    if(confirm(`ยืนยันการเปลี่ยนสถานะเป็น "${getStatusLabel(newStatus)}" ใช่หรือไม่?`)) {
        const item = MOCK_DB.DATA_REQUESTS.find(r => r.id === id);
        if(item) {
            item.status = newStatus;
            document.getElementById('request-modal').remove();
            renderDataRequestPage(document.getElementById('admin-content'));
            alert('บันทึกสถานะเรียบร้อย');
        }
    }
}

function openStaffPerformanceModal(staffId) {
    const staff = MOCK_DB.USERS_LIST.find(u => u.id === staffId);
    if (!staff) return;

    const staffTasks = MOCK_DB.TASKS.filter(t => t.assignee_id === staffId);
    const totalTasks = staffTasks.length;
    const completedTasks = staffTasks.filter(t => t.status === 'completed').length;
    const pendingTasks = staffTasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = staffTasks.filter(t => t.status === 'in_progress').length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const staffAssessments = MOCK_DB.ASSESSMENTS.filter(a => a.staff_id === staffId);
    const avgScore = staffAssessments.length > 0 ? Math.round(staffAssessments.reduce((sum, a) => sum + a.score, 0) / staffAssessments.length) : 0;
    const starCount = Math.round(avgScore / 20);

    const modal = document.createElement('div');
    modal.id = 'performance-modal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 fade-in';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden font-sans max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <h3 class="font-bold text-xl">รายละเอียดผลงาน</h3>
                <button onclick="document.getElementById('performance-modal').remove()" class="text-white/80 hover:text-white transition">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
            
            <div class="p-6">
                <!-- Staff Info -->
                <div class="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <img src="${staff.avatar}" class="w-20 h-20 rounded-full border-4 border-white shadow-lg">
                    <div class="flex-1">
                        <h4 class="font-bold text-xl text-slate-800">${staff.name}</h4>
                        <p class="text-slate-500">${staff.division} | ${staff.group}</p>
                        <div class="flex items-center gap-1 mt-2">
                            ${[1,2,3,4,5].map(i => `<i class="fa-${i <= starCount ? 'solid' : 'regular'} fa-star text-yellow-400"></i>`).join('')}
                            <span class="text-sm text-slate-500 ml-2">คะแนนเฉลี่ย: ${avgScore}/100</span>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-4 gap-4 mb-6">
                    <div class="bg-slate-50 p-4 rounded-lg text-center border border-slate-100">
                        <p class="text-2xl font-bold text-slate-800">${totalTasks}</p>
                        <p class="text-xs text-slate-500 font-bold uppercase">งานทั้งหมด</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                        <p class="text-2xl font-bold text-green-600">${completedTasks}</p>
                        <p class="text-xs text-green-600 font-bold uppercase">เสร็จสิ้น</p>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                        <p class="text-2xl font-bold text-blue-600">${inProgressTasks}</p>
                        <p class="text-xs text-blue-600 font-bold uppercase">กำลังทำ</p>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-100">
                        <p class="text-2xl font-bold text-yellow-600">${pendingTasks}</p>
                        <p class="text-xs text-yellow-600 font-bold uppercase">รอดำเนินการ</p>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="mb-6">
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-slate-600 font-bold">ความคืบหน้างาน</span>
                        <span class="font-bold text-blue-600">${progressPercent}%</span>
                    </div>
                    <div class="w-full bg-slate-200 rounded-full h-3">
                        <div class="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all" style="width: ${progressPercent}%"></div>
                    </div>
                </div>

                <!-- Tasks List -->
                <div class="mb-6">
                    <h5 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-blue-500"></i> งานที่รับผิดชอบ
                    </h5>
                    <div class="space-y-2 max-h-[200px] overflow-y-auto">
                        ${staffTasks.length > 0 ? staffTasks.map(t => `
                            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div class="flex-1">
                                    <p class="font-medium text-slate-700 text-sm">${t.title}</p>
                                    <p class="text-xs text-slate-400">กำหนด: ${t.deadline}</p>
                                </div>
                                <span class="px-2 py-1 text-[10px] font-bold uppercase rounded-full ${getTaskStatusBadge(t.status)}">${getTaskStatusLabel(t.status)}</span>
                            </div>
                        `).join('') : '<p class="text-slate-400 text-sm text-center py-4">ยังไม่มีงานที่ได้รับมอบหมาย</p>'}
                    </div>
                </div>

                <!-- Assessment History -->
                <div>
                    <h5 class="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-star text-yellow-400"></i> ประวัติการประเมิน
                    </h5>
                    <div class="space-y-2 max-h-[150px] overflow-y-auto">
                        ${staffAssessments.length > 0 ? staffAssessments.map(a => `
                            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div class="flex-1">
                                    <p class="font-medium text-slate-700 text-sm">${a.criteria}</p>
                                    <p class="text-xs text-slate-400">${a.date}</p>
                                </div>
                                <div class="text-right">
                                    <span class="font-bold text-blue-600">${a.score}/100</span>
                                </div>
                            </div>
                        `).join('') : '<p class="text-slate-400 text-sm text-center py-4">ยังไม่มีประวัติการประเมิน</p>'}
                    </div>
                </div>
            </div>

            <div class="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                <button onclick="document.getElementById('performance-modal').remove()" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition">ปิด</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function openAddAssessmentModal(staffId) {
    const staff = MOCK_DB.USERS_LIST.find(u => u.id === staffId);
    if (!staff) return;

    const modal = document.createElement('div');
    modal.id = 'add-assessment-modal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 fade-in';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden font-sans">
            <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 class="font-bold text-xl text-slate-800">เพิ่มการประเมิน</h3>
                <button onclick="document.getElementById('add-assessment-modal').remove()" class="text-slate-400 hover:text-slate-600 transition">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-4">
                <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <img src="${staff.avatar}" class="w-12 h-12 rounded-full">
                    <div>
                        <p class="font-bold text-slate-800">${staff.name}</p>
                        <p class="text-xs text-slate-500">${staff.division}</p>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">หัวข้อประเมิน (KPI)</label>
                    <select class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                        <option>ความถูกต้องของงาน</option>
                        <option>ความตรงต่อเวลา</option>
                        <option>การทำงานเป็นทีม</option>
                        <option>ความคิดสร้างสรรค์</option>
                        <option>การสื่อสาร</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">คะแนน (0-100)</label>
                    <input type="number" min="0" max="100" value="80" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">หมายเหตุ</label>
                    <textarea rows="3" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="ข้อเสนอแนะเพิ่มเติม..."></textarea>
                </div>
            </div>

            <div class="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button onclick="document.getElementById('add-assessment-modal').remove()" class="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition">ยกเลิก</button>
                <button onclick="alert('บันทึกการประเมินเรียบร้อย (Mock)'); document.getElementById('add-assessment-modal').remove();" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">บันทึก</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}
