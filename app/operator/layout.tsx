// app/layout.js
import "./layout.css";
import Script from "next/script";

export const metadata = {
  title: "Takomillashtirilgan Boshqaruv Paneli - MedMap.uz",
  description:
    "Bemorlar murojaatlarini qabul qilish, klinikalarga yo'naltirish va jarayonni boshqarish",
  keywords:
    "medmap, operator, call center, admin, dashboard, requests, kanban, crm",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="uz">
      <head>
        <link
          rel="icon"
          href="https://placehold.co/32x32/012970/ffffff?text=M"
        />
        <link
          rel="apple-touch-icon"
          href="https://placehold.co/180x180/012970/ffffff?text=M"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </head>

      <body>
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
        <Script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js" />
        {/* <Script>

   
    document.addEventListener("DOMContentLoaded", () => {
      "use strict";

      const body = document.body;
      const htmlEl = document.documentElement;
      const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');
      const mobileOverlay = document.querySelector('.mobile-overlay');
      const darkModeToggle = document.querySelector('#dark-mode-toggle');

      // --- Sidebar Toggle Logic ---
      if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.innerWidth < 1200) {
            body.classList.toggle('sidebar-toggled');
          } else {
            body.classList.toggle('sidebar-collapsed');
          }
        });
      }
      
      if (mobileOverlay) {
          mobileOverlay.addEventListener('click', () => {
              if(body.classList.contains('sidebar-toggled')) {
                body.classList.remove('sidebar-toggled');
              }
          });
      }
      
      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      });

      // --- Dark Mode Logic ---
      const applyTheme = (theme) => {
          if (theme === 'dark') {
              htmlEl.classList.add('dark-mode');
              if(darkModeToggle) darkModeToggle.querySelector('i').classList.replace('bi-moon-stars', 'bi-sun');
          } else {
              htmlEl.classList.remove('dark-mode');
              if(darkModeToggle) darkModeToggle.querySelector('i').classList.replace('bi-sun', 'bi-moon-stars');
          }
      };

      if(darkModeToggle) {
          const savedTheme = localStorage.getItem('theme') || 'light';
          applyTheme(savedTheme);

          darkModeToggle.addEventListener('click', (e) => {
              e.preventDefault();
              const newTheme = htmlEl.classList.contains('dark-mode') ? 'light' : 'dark';
              localStorage.setItem('theme', newTheme);
              applyTheme(newTheme);
          });
      }

      // --- Filter buttons active state logic ---
      const filterButtons = document.querySelectorAll('.filter-btn-group .btn');
      filterButtons.forEach(button => {
          button.addEventListener('click', function() {
              filterButtons.forEach(btn => btn.classList.remove('active'));
              this.classList.add('active');
          });
      });

      // ===============================================================
      // ============ BEMORLAR OQIMI (KANBAN) JAVASCRIPT LOGIC ===========
      // ===============================================================

      let stages = [
          { id: 'stage1', title: 'Yangi', colorClass: 'kanban-column-new' },
          { id: 'stage2', title: 'Hujjatlar', colorClass: 'kanban-column-docs' },
          { id: 'stage3', title: "To'lov", colorClass: 'kanban-column-payment' },
          { id: 'stage4', title: 'Safar', colorClass: 'kanban-column-trip' },
          { id: 'stage5', title: 'Arxiv', colorClass: 'kanban-column-archive' }
      ];

      let tags = [
          { id: 1, text: 'Normal', color: 'success' },
          { id: 2, text: 'VIP', color: 'warning' },
          { id: 3, text: 'Shoshilinch', color: 'danger' },
      ];

      let patients = [
          { 
            id: 1, name: 'Shohjahon Mirakov', tagId: 3, stageId: 'stage1',
            source: 'Facebook', createdBy: 'Operator #2',
            history: [
                { date: '2025-08-11T11:35:00', author: 'Tizim', text: 'Bemor profili yaratildi.' }
            ],
            details: { 
                passport: 'AA1234567', dob: '1985-05-15', gender: 'Erkak', phone: '+998 90 123 45 67', email: 'shohjahon.m@gmail.com',
                complaints: 'Yurak sohasidagi og\'riq, hansirash.', previousDiagnosis: 'Gipertoniya',
                documents: [ {name: 'Pasport nusxasi.pdf', url: '#'}, {name: 'EKG natijasi.jpg', url: '#'} ]
            }
          },
          { 
            id: 2, name: 'Sarvinoz Karimova', tagId: 2, stageId: 'stage1',
            source: 'Sayt', createdBy: 'Admin',
            history: [
                { date: '2025-08-10T11:35:00', author: 'Tizim', text: 'Bemor profili yaratildi.' }
            ],
            details: { 
                passport: 'AB7654321', dob: '1992-11-20', gender: 'Ayol', phone: '+998 91 234 56 78', email: 'sarvinoz.k@mail.com',
                complaints: 'Bosh og\'rig\'i, uyqusizlik.', previousDiagnosis: 'Migren',
                documents: []
            }
          },
          { 
            id: 3, name: 'John Doe', tagId: 1, stageId: 'stage2',
            source: 'Tavsiya', createdBy: 'Operator #1',
            history: [
                { date: '2025-08-02T10:00:00', author: 'Tizim', text: 'Bemor profili yaratildi.' },
                { date: '2025-08-04T11:35:00', author: 'Operator #1', text: 'Hujjatlar to\'liq yig\'ildi va klinikaga yuborishga tayyor.' }
            ],
            details: { 
                passport: 'US12345678', dob: '1978-01-30', gender: 'Erkak', phone: '+1-202-555-0149', email: 'j.doe@example.com',
                complaints: 'Umumiy holsizlik, vazn yo\'qotish.', previousDiagnosis: 'Kiritilmagan',
                documents: [ {name: 'Biopsy_results.pdf', url: '#'}, {name: 'PET-CT_scan.zip', url: '#'} ]
            }
          },
      ];

      const kanbanBoard = document.getElementById('kanban-board');
      const searchInput = document.getElementById('search-patient-input');
      const patientDetailsOffcanvasEl = document.getElementById('patientDetailsOffcanvas');
      const patientDetailsOffcanvas = new bootstrap.Offcanvas(patientDetailsOffcanvasEl);
      const stageChangeCommentModal = new bootstrap.Modal(document.getElementById('stageChangeCommentModal'));
      const tagManagementModal = new bootstrap.Modal(document.getElementById('tagManagementModal'));
      const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
      let tempMoveData = null;

      // Helper Functions
      const getNextStepText = (stageId) => {
          const nextSteps = {
              'stage1': 'Hujjatlarni so\'rash', 'stage2': 'Klinika tanlash',
              'stage3': 'To\'lovni qabul qilish', 'stage4': 'Safar sanasini belgilash',
              'stage5': 'Yopilgan'
          };
          return nextSteps[stageId] || 'Noma\'lum';
      };

      const formatDate = (isoString) => {
          const date = new Date(isoString);
          const time = date.toTimeString().slice(0,5);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${time} | ${day}.${month}.${year}`;
      };

      const showToast = (message, type = 'success') => {
        const toastContainer = document.querySelector('.toast-container');
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-bg-${type} border-0`;
        toastEl.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
        toastContainer.appendChild(toastEl);
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
      };

      const createPatientCard = (patient) => {
          const card = document.createElement('div');
          card.className = 'kanban-card';
          card.dataset.id = patient.id;
          const tag = tags.find(t => t.id === patient.tagId) || { text: 'Noma\'lum', color: 'secondary' };
          const lastHistory = patient.history[patient.history.length - 1];
          card.innerHTML = `
            <div class="kanban-card-header">
                <div><div class="title">${patient.name}</div><div class="text-muted small">${patient.details.phone}</div></div>
                <span class="id-badge">ID: ${patient.id}</span>
            </div>
            <div class="kanban-card-body">
                <div class="info-line"><i class="bi bi-info-circle-fill"></i><span>${lastHistory.text}</span></div>
                <div class="info-line"><i class="bi bi-bookmark-star-fill"></i><span>Manba: ${patient.source}</span></div>
                <div class="info-line"><i class="bi bi-exclamation-diamond-fill"></i><span>Keyingi qadam: ${getNextStepText(patient.stageId)}</span></div>
            </div>
            <div class="kanban-card-footer">
                <span class="badge text-bg-${tag.color}">${tag.text}</span>
                <span class="date">${formatDate(lastHistory.date)}</span>
            </div>`;
          card.addEventListener('click', () => openPatientDetails(patient.id));
          return card;
      };

      const renderBoard = (filteredPatients = patients) => {
          if (!kanbanBoard) return;
          kanbanBoard.innerHTML = '';
          stages.forEach(stage => {
              const column = document.createElement('div');
              column.className = `kanban-column ${stage.colorClass}`;
              const patientsInStage = filteredPatients.filter(p => p.stageId === stage.id);
              column.innerHTML = `<div class="kanban-column-header"><span>${stage.title} (${patientsInStage.length})</span></div><div class="kanban-cards" data-stage-id="${stage.id}"></div>`;
              const cardsContainer = column.querySelector('.kanban-cards');
              if (patientsInStage.length > 0) {
                  patientsInStage.forEach(patient => cardsContainer.appendChild(createPatientCard(patient)));
              } else {
                  cardsContainer.innerHTML = `<div class="text-center text-muted p-5"><i class="bi bi-moon-stars fs-2"></i><p class="mt-2">Bemorlar yo'q</p></div>`;
              }
              kanbanBoard.appendChild(column);
          });
          initializeSortable();
      };

      const initializeSortable = () => {
          document.querySelectorAll('.kanban-cards').forEach(container => {
              new Sortable(container, {
                  group: 'kanban', animation: 150, ghostClass: 'sortable-ghost',
                  onEnd: (evt) => {
                      evt.from.insertBefore(evt.item, evt.from.children[evt.oldIndex]);
                      if (evt.from === evt.to) return;
                      const patientId = parseInt(evt.item.dataset.id);
                      const newStageId = evt.to.dataset.stageId;
                      tempMoveData = { patientId, newStageId };
                      const patient = patients.find(p => p.id === patientId);
                      const newStage = stages.find(s => s.id === newStageId);
                      document.getElementById('comment-patient-name').textContent = patient.name;
                      document.getElementById('comment-new-stage').textContent = newStage.title;
                      document.getElementById('stage-change-comment').value = '';
                      stageChangeCommentModal.show();
                  }
              });
          });
      };
      
      document.getElementById('save-stage-change-btn').addEventListener('click', () => {
          const comment = document.getElementById('stage-change-comment').value;
          if (!comment.trim()) { showToast("Iltimos, izoh yozing!", "danger"); return; }
          if (tempMoveData) {
              const { patientId, newStageId } = tempMoveData;
              const patient = patients.find(p => p.id === patientId);
              if(patient) {
                  patient.stageId = newStageId;
                  patient.history.push({ date: new Date().toISOString(), author: 'Operator #1', text: comment });
                  renderBoard(getFilteredPatients());
                  showToast("Bosqich muvaffaqiyatli o'zgartirildi");
              }
          }
          stageChangeCommentModal.hide();
          tempMoveData = null;
      });

      const openPatientDetails = (patientId) => {
          const patient = patients.find(p => p.id === patientId);
          if (!patient) return;

          const currentOperator = document.getElementById('operator-name').textContent;
          const canEdit = (patient.createdBy === currentOperator || currentOperator === 'Admin'); // Admin can edit anyone

          document.getElementById('patientDetailsName').textContent = patient.name;
          const detailsBody = document.getElementById('patientDetailsBody');
          const historyHTML = patient.history.slice().reverse().map(item => `<div class="timeline-item"><div class="fw-bold">${item.text}</div><div class="small text-muted">${item.author} - ${formatDate(item.date)}</div></div>`).join('');
          const tagsOptionsHTML = tags.map(tag => `<option value="${tag.id}" ${patient.tagId === tag.id ? 'selected' : ''}>${tag.text}</option>`).join('');
          
          let documentsHTML = '<p class="text-muted">Hujjatlar yuklanmagan.</p>';
          if (patient.details.documents && patient.details.documents.length > 0) {
              documentsHTML = patient.details.documents.map(doc => `
                <div class="document-list-item">
                    <a href="${doc.url}" target="_blank"><i class="bi bi-file-earmark-text me-2"></i>${doc.name}</a>
                    <button class="btn btn-sm btn-outline-danger border-0" ${canEdit ? '' : 'disabled'}><i class="bi bi-trash"></i></button>
                </div>
              `).join('');
          }

          detailsBody.innerHTML = `
            <div class="details-card">
                <div class="details-card-header">
                    <h6><i class="bi bi-person-badge me-2"></i>Shaxsiy ma'lumotlar</h6>
                    <div id="personal-edit-controls">
                        <button class="btn btn-sm btn-outline-primary border-0 edit-details-btn" data-card="personal" ${canEdit ? '' : 'disabled'}><i class="bi bi-pencil"></i> Tahrirlash</button>
                    </div>
                </div>
                <div class="details-card-body" id="personal-details-body">
                    <div class="details-info-item"><span class="label">Pasport</span><span class="value">${patient.details.passport}</span></div>
                    <div class="details-info-item"><span class="label">Tug'ilgan sana</span><span class="value">${patient.details.dob}</span></div>
                    <div class="details-info-item"><span class="label">Jins</span><span class="value">${patient.details.gender}</span></div>
                    <div class="details-info-item"><span class="label">Telefon</span><span class="value">${patient.details.phone}</span></div>
                    <div class="details-info-item"><span class="label">Pochta</span><span class="value">${patient.details.email}</span></div>
                </div>
            </div>
            <div class="details-card">
                <div class="details-card-header">
                    <h6><i class="bi bi-heart-pulse me-2"></i>Tibbiy ma'lumotlar</h6>
                     <div id="medical-edit-controls">
                        <button class="btn btn-sm btn-outline-primary border-0 edit-details-btn" data-card="medical" ${canEdit ? '' : 'disabled'}><i class="bi bi-pencil"></i> Tahrirlash</button>
                    </div>
                </div>
                <div class="details-card-body" id="medical-details-body">
                    <div class="details-info-item"><span class="label">Shikoyatlar</span><span class="value">${patient.details.complaints}</span></div>
                    <div class="details-info-item"><span class="label">Avvalgi tashxis</span><span class="value">${patient.details.previousDiagnosis}</span></div>
                </div>
            </div>
            <div class="details-card">
                <div class="details-card-header"><h6><i class="bi bi-file-earmark-arrow-up me-2"></i>Yuklangan hujjatlar</h6></div>
                <div class="details-card-body">${documentsHTML}</div>
            </div>
            <div class="details-card">
                <div class="details-card-header"><h6><i class="bi bi-tag me-2"></i>Holat</h6></div>
                <div class="details-card-body">
                    <select class="form-select" id="details-patient-tag" data-patient-id="${patient.id}" ${canEdit ? '' : 'disabled'}>${tagsOptionsHTML}</select>
                </div>
            </div>
            <div class="details-card">
                <div class="details-card-header"><h6><i class="bi bi-clock-history me-2"></i>Tarix va Izohlar</h6></div>
                <div class="details-card-body">${historyHTML}</div>
            </div>
            <div class="mt-4">
                <button class="btn btn-outline-danger w-100" id="delete-patient-btn" data-patient-id="${patient.id}" ${canEdit ? '' : 'disabled'}><i class="bi bi-trash me-2"></i>Bemorni o'chirish</button>
            </div>
            `;
          
          document.getElementById('details-patient-tag').addEventListener('change', function() {
              const p = patients.find(p => p.id === parseInt(this.dataset.patientId));
              if (p) {
                  p.tagId = parseInt(this.value);
                  renderBoard(getFilteredPatients());
                  showToast("Holat o'zgartirildi");
              }
          });

          detailsBody.querySelectorAll('.edit-details-btn').forEach(btn => {
              btn.addEventListener('click', (e) => toggleEditMode(patient.id, e.currentTarget.dataset.card, true));
          });
          
          document.getElementById('delete-patient-btn').addEventListener('click', (e) => {
              const patientIdToDelete = e.currentTarget.dataset.patientId;
              const patientToDelete = patients.find(p => p.id === parseInt(patientIdToDelete));
              document.getElementById('delete-patient-name').textContent = patientToDelete.name;
              document.getElementById('confirm-delete-btn').dataset.patientId = patientIdToDelete;
              deleteConfirmModal.show();
          });

          patientDetailsOffcanvas.show();
      };
      
      document.getElementById('confirm-delete-btn').addEventListener('click', (e) => {
          const patientIdToDelete = parseInt(e.currentTarget.dataset.patientId);
          const patientIndex = patients.findIndex(p => p.id === patientIdToDelete);
          if (patientIndex > -1) {
              patients.splice(patientIndex, 1);
              renderBoard(getFilteredPatients());
              patientDetailsOffcanvas.hide();
              showToast("Bemor muvaffaqiyatli o'chirildi.", "warning");
          }
          deleteConfirmModal.hide();
      });

      const toggleEditMode = (patientId, cardType, isEditing) => {
          const patient = patients.find(p => p.id === patientId);
          const bodyEl = document.getElementById(`${cardType}-details-body`);
          const controlsEl = document.getElementById(`${cardType}-edit-controls`);

          if (isEditing) {
              let editHTML = '';
              if (cardType === 'personal') {
                  editHTML = `
                    <div class="details-info-item"><span class="label">Pasport</span><input type="text" class="form-control form-control-sm" id="edit-passport" value="${patient.details.passport}"></div>
                    <div class="details-info-item"><span class="label">Tug'ilgan sana</span><input type="date" class="form-control form-control-sm" id="edit-dob" value="${patient.details.dob}"></div>
                    <div class="details-info-item"><span class="label">Jins</span>
                        <select class="form-select form-select-sm" id="edit-gender">
                            <option value="Erkak" ${patient.details.gender === 'Erkak' ? 'selected' : ''}>Erkak</option>
                            <option value="Ayol" ${patient.details.gender === 'Ayol' ? 'selected' : ''}>Ayol</option>
                        </select>
                    </div>
                    <div class="details-info-item"><span class="label">Telefon</span><input type="tel" class="form-control form-control-sm" id="edit-phone" value="${patient.details.phone}"></div>
                    <div class="details-info-item"><span class="label">Pochta</span><input type="email" class="form-control form-control-sm" id="edit-email" value="${patient.details.email}"></div>
                  `;
              } else if (cardType === 'medical') {
                  editHTML = `
                    <div class="details-info-item"><span class="label">Shikoyatlar</span><input type="text" class="form-control form-control-sm" id="edit-complaints" value="${patient.details.complaints}"></div>
                    <div class="details-info-item"><span class="label">Avvalgi tashxis</span><input type="text" class="form-control form-control-sm" id="edit-diagnosis" value="${patient.details.previousDiagnosis}"></div>
                  `;
              }
              bodyEl.innerHTML = editHTML;
              controlsEl.innerHTML = `
                <button class="btn btn-sm btn-success border-0 save-details-btn" data-card="${cardType}"><i class="bi bi-check-lg"></i> Saqlash</button>
                <button class="btn btn-sm btn-light border-0 cancel-edit-btn" data-card="${cardType}"><i class="bi bi-x-lg"></i></button>
              `;
          } else {
              // This part will be handled by re-rendering the whole offcanvas
              openPatientDetails(patientId);
          }
          
          controlsEl.querySelector('.save-details-btn').addEventListener('click', () => savePatientDetails(patientId, cardType));
          controlsEl.querySelector('.cancel-edit-btn').addEventListener('click', () => openPatientDetails(patientId));
      };

      const savePatientDetails = (patientId, cardType) => {
          const patient = patients.find(p => p.id === patientId);
          if (cardType === 'personal') {
              patient.details.passport = document.getElementById('edit-passport').value;
              patient.details.dob = document.getElementById('edit-dob').value;
              patient.details.gender = document.getElementById('edit-gender').value;
              patient.details.phone = document.getElementById('edit-phone').value;
              patient.details.email = document.getElementById('edit-email').value;
          } else if (cardType === 'medical') {
              patient.details.complaints = document.getElementById('edit-complaints').value;
              patient.details.previousDiagnosis = document.getElementById('edit-diagnosis').value;
          }
          showToast("Ma'lumotlar saqlandi");
          openPatientDetails(patientId); // Re-render to show static view
          renderBoard(getFilteredPatients()); // Update kanban card if name/phone changed
      };
      
      // --- New Patient Modal Wizard Logic ---
      const newPatientModalEl = document.getElementById('newPatientModal');
      const newPatientModal = new bootstrap.Modal(newPatientModalEl);
      const wizardSteps = newPatientModalEl.querySelectorAll('.wizard-step');
      const progressSteps = newPatientModalEl.querySelectorAll('.wizard-progress-step');
      const progressBar = newPatientModalEl.querySelector('.wizard-progress-bar');
      const backBtn = newPatientModalEl.querySelector('#wizard-back-btn');
      const nextBtn = newPatientModalEl.querySelector('#wizard-next-btn');
      const form = newPatientModalEl.querySelector('#new-patient-form');
      const fileInput = newPatientModalEl.querySelector('#new-patient-files');
      const fileListContainer = newPatientModalEl.querySelector('#new-patient-file-list');
      let currentStep = 1;
      const totalSteps = wizardSteps.length;

      const updateWizardControls = () => {
          const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
          progressBar.style.width = `${progressPercent}%`;
          progressSteps.forEach((step, index) => {
              step.classList.toggle('active', index + 1 === currentStep);
          });
          backBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
          nextBtn.textContent = currentStep === totalSteps ? "Tasdiqlash va Yuborish" : "Keyingisi";
      };

      const goToStep = (step) => {
          wizardSteps.forEach(s => s.classList.remove('active'));
          newPatientModalEl.querySelector(`#step-${step}`).classList.add('active');
          currentStep = step;
          updateWizardControls();
      };

      nextBtn.addEventListener('click', () => {
          if (currentStep < totalSteps) {
              goToStep(currentStep + 1);
          } else {
              const name = document.getElementById('new-patient-name').value;
              const phone = document.getElementById('new-patient-phone').value;
              if (!name || !phone) {
                  showToast("Iltimos, Ism va Telefon raqamini to'ldiring.", 'danger');
                  goToStep(1);
                  return;
              }
              if (!document.getElementById('form-agreement').checked) {
                  showToast("Iltimos, shartlarga roziligingizni bildiring.", 'danger');
                  return;
              }
              
              const operatorName = document.getElementById('operator-name').textContent || 'Platforma';
              const newPatient = {
                  id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
                  name, tagId: 1, stageId: 'stage1', source: operatorName, createdBy: operatorName,
                  history: [ { date: new Date().toISOString(), author: operatorName, text: 'Bemor profili anketa orqali yaratildi.' } ],
                  details: { 
                      passport: document.getElementById('new-patient-passport').value || '-',
                      dob: document.getElementById('new-patient-dob').value || '-',
                      gender: document.getElementById('new-patient-gender').value || '-',
                      phone, email: document.getElementById('new-patient-email').value || '-',
                      complaints: document.getElementById('new-patient-complaints').value || 'Kiritilmagan',
                      previousDiagnosis: document.getElementById('new-patient-diagnosis').value || 'Kiritilmagan',
                      documents: Array.from(fileInput.files).map(f => ({ name: f.name, url: '#' }))
                  }
              };
              patients.unshift(newPatient);
              renderBoard(getFilteredPatients());
              populateFilterOptions();
              form.reset();
              fileListContainer.innerHTML = '';
              newPatientModal.hide();
              showToast("Yangi bemor muvaffaqiyatli qo'shildi");
          }
      });

      backBtn.addEventListener('click', () => {
          if (currentStep > 1) {
              goToStep(currentStep - 1);
          }
      });
      
      fileInput.addEventListener('change', (e) => {
          fileListContainer.innerHTML = '';
          if (e.target.files.length > 0) {
              Array.from(e.target.files).forEach(file => {
                  fileListContainer.innerHTML += `<div class="file-item"><span>${file.name}</span> <span>(${(file.size / 1024).toFixed(1)} KB)</span></div>`;
              });
          }
      });
      
      newPatientModalEl.addEventListener('hidden.bs.modal', () => {
          form.reset();
          fileListContainer.innerHTML = '';
          goToStep(1);
      });


      // --- Other Logic ---
      const populateFilterOptions = () => {
          const stageSelect = document.getElementById('filter-stage');
          stageSelect.innerHTML = '<option value="">Barchasi</option>';
          stages.forEach(stage => stageSelect.innerHTML += `<option value="${stage.id}">${stage.title}</option>`);
          const filterTagsContainer = document.getElementById('filter-tags-container');
          filterTagsContainer.innerHTML = '';
          tags.forEach(tag => filterTagsContainer.innerHTML += `<div class="form-check"><input class="form-check-input filter-checkbox" type="checkbox" value="${tag.id}" id="filter-tag-${tag.id}"><label class="form-check-label" for="filter-tag-${tag.id}">${tag.text}</label></div>`);
      };

      const getFilteredPatients = () => {
          const searchTerm = searchInput.value.toLowerCase();
          const selectedTagIds = [...document.querySelectorAll('.filter-checkbox:checked')].map(el => parseInt(el.value));
          const selectedStage = document.getElementById('filter-stage')?.value;
          return patients.filter(p => p.name.toLowerCase().includes(searchTerm) && (selectedTagIds.length === 0 || selectedTagIds.includes(p.tagId)) && (!selectedStage || p.stageId === selectedStage));
      };
      
      const applyFilters = () => renderBoard(getFilteredPatients());

      document.getElementById('apply-filters-btn')?.addEventListener('click', applyFilters);
      document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
          document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
          document.getElementById('filter-stage').value = '';
          searchInput.value = '';
          applyFilters();
      });
      searchInput.addEventListener('input', applyFilters);

      const renderTagsList = () => {
          const tagsList = document.getElementById('tags-list');
          tagsList.innerHTML = '';
          tags.forEach(tag => {
              const li = document.createElement('li');
              li.className = 'list-group-item d-flex justify-content-between align-items-center';
              li.innerHTML = `<span class="badge text-bg-${tag.color}">${tag.text}</span><button class="btn btn-sm btn-outline-danger border-0 delete-tag-btn" data-tag-id="${tag.id}">&times;</button>`;
              tagsList.appendChild(li);
          });
      };

      document.getElementById('add-new-tag-btn')?.addEventListener('click', () => {
          const nameInput = document.getElementById('new-tag-name');
          const colorSelect = document.getElementById('new-tag-color');
          if (nameInput.value.trim()) {
              tags.push({ id: tags.length > 0 ? Math.max(...tags.map(t => t.id)) + 1 : 1, text: nameInput.value.trim(), color: colorSelect.value });
              renderTagsList();
              populateFilterOptions();
              nameInput.value = '';
              showToast("Yangi holat qo'shildi");
          }
      });
      
      document.getElementById('tags-list').addEventListener('click', (e) => {
          if (e.target.classList.contains('delete-tag-btn')) {
              const tagId = parseInt(e.target.dataset.tagId);
              tags = tags.filter(t => t.id !== tagId);
              renderTagsList();
              populateFilterOptions();
              showToast("Holat o'chirildi", "warning");
          }
      });
      
      document.getElementById('tagManagementModal').addEventListener('show.bs.modal', renderTagsList);

      populateFilterOptions();
      renderBoard();
    });
        </Script> */}
      </body>
    </html>
  );
}
