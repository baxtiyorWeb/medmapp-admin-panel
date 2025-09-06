document.addEventListener("DOMContentLoaded", () => {
  // --- INITIAL DATA (DATABASE SIMULATION) ---
  const currentUserId = 1; // Aziza Orifova
  const users = {
    1: {
      name: "Aziza Orifova",
      shortName: "Aziza O.",
      avatar: "https://placehold.co/24x24/ffc107/000000?text=A",
    },
    2: {
      name: "Botir Zokirov",
      shortName: "Botir Z.",
      avatar: "https://placehold.co/24x24/198754/ffffff?text=B",
    },
  };

  const stages = {
    "col-new": {
      title: "Yangi",
      headerClass: "bg-info-subtle",
      nextStep: "Hujjatlarni so'rash",
    },
    "col-docs": {
      title: "Hujjatlar",
      headerClass: "bg-warning-subtle",
      nextStep: "Klinika tanlash",
    },
    "col-payment": {
      title: "To'lov",
      headerClass: "bg-primary-subtle",
      nextStep: "To'lovni qabul qilish",
    },
    "col-trip": {
      title: "Safar",
      headerClass: "bg-success-subtle",
      nextStep: "Safar yakunini kutish",
    },
    "col-archive": {
      title: "Arxiv",
      headerClass: "bg-secondary-subtle",
      nextStep: "Yopilgan",
    },
  };

  // Ma'lumotlarga turli sanalarni qo'shish
  const now = new Date();
  const today = now.toISOString();
  const yesterday = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toISOString();
  const lastWeek = new Date(
    new Date().setDate(new Date().getDate() - 7)
  ).toISOString();
  const lastMonth = new Date(
    new Date().setMonth(new Date().getMonth() - 1)
  ).toISOString();
  const lastYear = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  ).toISOString();

  const masterPatientList = [
    {
      id: 1,
      name: "Ali Valiyev",
      department: "Kardiologiya",
      country: "uz",
      source: "Facebook",
      tag: "Shoshilinch",
      coordinatorId: 1,
      stage: "col-new",
      phone: "+998901234567",
      tasks: [],
      documents: [],
      finances: {
        items: [{ name: "Boshlang'ich to'lov", price: 1500000 }],
        paid: 0,
      },
      tasksGeneratedForStage: {},
      createdAt: today,
      lastUpdatedAt: today,
      activityLog: [
        { text: "Bemor profili yaratildi", time: today, user: "Aziza O." },
      ],
      status: "Klinika javobi kutilmoqda",
    },
    {
      id: 2,
      name: "Sarvinoz Karimova",
      department: "Nevrologiya",
      country: "kz",
      source: "Sayt",
      tag: "VIP",
      coordinatorId: 2,
      stage: "col-new",
      phone: "+77012345678",
      tasks: [],
      documents: [],
      finances: { items: [], paid: 0 },
      tasksGeneratedForStage: {},
      createdAt: yesterday,
      lastUpdatedAt: yesterday,
      activityLog: [
        { text: "Bemor profili yaratildi", time: yesterday, user: "Botir Z." },
      ],
      status: "Bemor bilan aloqa o'rnatilmoqda",
    },
    {
      id: 3,
      name: "John Doe",
      department: "Onkologiya",
      country: "us",
      source: "Tavsiya",
      tag: "Normal",
      coordinatorId: 1,
      stage: "col-docs",
      phone: "+12025550187",
      tasks: [
        {
          id: 101,
          description: "Viza anketasini to'ldirish",
          status: "Jarayonda",
          dueDate: "2025-08-04",
        },
      ],
      documents: [
        {
          name: "passport_scan.pdf",
          date: "01.08.2025",
          status: "Tasdiqlangan",
        },
      ],
      finances: {
        items: [
          { name: "Konsultatsiya", price: 500000 },
          { name: "Viza xizmati", price: 1200000 },
        ],
        paid: 500000,
      },
      tasksGeneratedForStage: { "col-docs": true },
      createdAt: lastWeek,
      lastUpdatedAt: lastWeek,
      activityLog: [
        { text: "Bemor profili yaratildi", time: lastWeek, user: "Aziza O." },
      ],
      status: "Hujjatlar Germaniyadagi klinikaga yuborildi",
    },
    {
      id: 4,
      name: "Gulnora Saidova",
      department: "Endokrinologiya",
      country: "uz",
      source: "Instagram",
      tag: "Normal",
      coordinatorId: 1,
      stage: "col-payment",
      phone: "+998931234567",
      tasks: [],
      documents: [],
      finances: {
        items: [{ name: "Davolash kursi", price: 25000000 }],
        paid: 0,
      },
      tasksGeneratedForStage: {},
      createdAt: lastMonth,
      lastUpdatedAt: lastMonth,
      activityLog: [
        { text: "Bemor profili yaratildi", time: lastMonth, user: "Aziza O." },
      ],
      status: "To'lov kutilmoqda",
    },
    {
      id: 5,
      name: "Timur Ismoilov",
      department: "Travmatologiya",
      country: "tj",
      source: "Sayt",
      tag: "Shoshilinch",
      coordinatorId: 2,
      stage: "col-archive",
      phone: "+992921234567",
      tasks: [],
      documents: [],
      finances: {
        items: [{ name: "Operatsiya", price: 45000000 }],
        paid: 45000000,
      },
      tasksGeneratedForStage: {},
      createdAt: lastYear,
      lastUpdatedAt: lastYear,
      activityLog: [
        { text: "Bemor profili yaratildi", time: lastYear, user: "Botir Z." },
      ],
      status: "Davolash yakunlandi",
    },
  ];

  // --- GLOBAL STATE ---
  const activeFilters = {
    period: "all",
    searchTerm: "",
  };

  // --- GLOBAL ELEMENTS ---
  const kanbanBoard = document.getElementById("kanban-board");
  const detailsPanel = document.getElementById("patient-details-panel");
  const closeDetailsBtn = document.getElementById("close-details-panel");
  const detailsOverlay = document.getElementById("details-overlay");
  const myTasksTableBody = document.getElementById("my-tasks-table-body");
  const newTasksCountEl = document.getElementById("new-tasks-count");
  const searchInput = document.getElementById("search-patient-input");
  const newPatientModalEl = document.getElementById("newPatientModal");
  const newPatientModal = new bootstrap.Modal(newPatientModalEl);
  const newPatientForm = document.getElementById("new-patient-form");
  const notificationContainer = document.getElementById(
    "notification-container"
  );
  const updateStatusModalEl = document.getElementById("updateStatusModal");
  const updateStatusModal = new bootstrap.Modal(updateStatusModalEl);
  const timeFilterGroup = document.getElementById("time-filter-group");

  // --- HELPER FUNCTIONS ---
  const findPatient = (id) =>
    masterPatientList.find((p) => p.id === Number.parseInt(id));
  const showToast = (message, type = "info") => {
    const toast = document.createElement("div");
    toast.className = `custom-toast p-3 d-flex align-items-center`;
    const icon =
      type === "success"
        ? "bi-check-circle-fill text-success"
        : "bi-info-circle-fill text-primary";
    toast.innerHTML = `<i class="bi ${icon} fs-4 me-3"></i> <div>${message}</div>`;
    notificationContainer.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.add("fade-out");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 4000);
  };
  const logActivity = (patientId, text) => {
    const patient = findPatient(patientId);
    if (patient) {
      patient.activityLog.unshift({
        text: text,
        time: new Date().toISOString(),
        user: users[currentUserId].shortName,
      });
    }
  };
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";

  // --- RENDER FUNCTIONS ---
  const renderStats = (patientList) => {
    const totalDeals = patientList.length;
    const newPatients = patientList.filter((p) => p.stage === "col-new").length;
    const activePatients = patientList.filter(
      (p) => p.stage !== "col-archive"
    ).length;
    const expectedRevenue = patientList
      .filter((p) => p.stage !== "col-archive")
      .reduce(
        (sum, p) =>
          sum +
          p.finances.items.reduce((itemSum, item) => itemSum + item.price, 0),
        0
      );

    document.getElementById("stat-total-deals").textContent = totalDeals;
    document.getElementById("stat-new-patients").textContent = newPatients;
    document.getElementById("stat-active-patients").textContent =
      activePatients;
    document.getElementById("stat-expected-revenue").textContent =
      formatCurrency(expectedRevenue);
  };

  const renderKanbanCard = (patient) => {
    const coordinator = users[patient.coordinatorId];
    const sourceText =
      patient.source === "Manual"
        ? `Yaratdi: ${
            users[patient.createdBy || patient.coordinatorId].shortName
          }`
        : `Manba: ${patient.source}`;
    const tagColor =
      patient.tag === "Shoshilinch"
        ? "bg-danger-subtle text-danger-emphasis"
        : patient.tag === "VIP"
        ? "bg-primary-subtle text-primary-emphasis"
        : "bg-success-subtle text-success-emphasis";
    const nextStepText =
      stages[patient.stage]?.nextStep || "Jarayonni yakunlash";

    return `
            <div class="kanban-card" data-patient-id="${
              patient.id
            }" draggable="true">
                <div class="d-flex justify-content-between">
                    <h3 class="card-title mb-1">${patient.name}</h3>
                    <div class="d-flex align-items-center gap-2">
                        <small class="text-muted">ID: ${patient.id}</small>
                        <div class="dropdown">
                            <img src="${
                              coordinator.avatar
                            }" class="rounded-circle coordinator-avatar" data-bs-toggle="dropdown" title="Koordinator: ${
      coordinator.name
    }">
                            <ul class="dropdown-menu">
                                ${Object.entries(users)
                                  .map(
                                    ([id, user]) =>
                                      `<li><a class="dropdown-item change-coordinator-btn" href="#" data-user-id="${id}">${user.name}</a></li>`
                                  )
                                  .join("")}
                            </ul>
                        </div>
                    </div>
                </div>
                <p class="small text-muted mb-2">${patient.department}</p>
                <p class="small p-2 rounded" style="background-color: var(--primary-light);"><i class="bi bi-info-circle-fill me-1 text-primary"></i> ${
                  patient.status
                }</p>
                <div class="d-flex flex-column gap-1 small text-muted">
                    <span><i class="bi bi-box-arrow-in-down me-1"></i> ${sourceText}</span>
                    ${
                      patient.stage !== "col-archive"
                        ? `<span class="text-danger"><i class="bi bi-hourglass-split me-1"></i> Keyingi qadam: ${nextStepText}</span>`
                        : ""
                    }
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <div class="dropdown">
                        <span class="badge ${tagColor} rounded-pill tag-badge" data-bs-toggle="dropdown" aria-expanded="false">${
      patient.tag
    }</span>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item change-tag-btn" href="#" data-value="Normal">Normal</a></li>
                            <li><a class="dropdown-item change-tag-btn" href="#" data-value="VIP">VIP</a></li>
                            <li><a class="dropdown-item change-tag-btn" href="#" data-value="Shoshilinch">Shoshilinch</a></li>
                        </ul>
                    </div>
                    <small class="text-muted">${new Date(
                      patient.lastUpdatedAt
                    ).toLocaleString("uz-UZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</small>
                </div>
            </div>
        `;
  };

  const renderKanbanBoard = (patientsToRender) => {
    kanbanBoard.innerHTML = "";
    for (const stageId in stages) {
      const stage = stages[stageId];
      const column = document.createElement("div");
      column.className = "kanban-column";
      const patientsInStage = patientsToRender.filter(
        (p) => p.stage === stageId
      );

      let cardsHTML = "";
      if (patientsInStage.length > 0) {
        cardsHTML = patientsInStage.map(renderKanbanCard).join("");
      } else {
        cardsHTML = `
                    <div class="kanban-empty-state">
                        <i class="bi bi-moon-stars"></i>
                        <span>Bemorlar yo'q</span>
                    </div>
                `;
      }

      column.innerHTML = `
                <div class="kanban-column-header ${stage.headerClass}">${stage.title} (${patientsInStage.length})</div>
                <div class="kanban-cards" id="${stageId}">
                    ${cardsHTML}
                </div>
            `;
      kanbanBoard.appendChild(column);
    }
    initializeSortable();
    initializeCardClickListeners();
    initializeTooltips();
  };

  const renderMyTasks = () => {
    myTasksTableBody.innerHTML = "";
    let newTasksCount = 0;
    masterPatientList.forEach((patient) => {
      patient.tasks.forEach((task) => {
        if (patient.coordinatorId === currentUserId) {
          const isNew = task.status === "Yangi";
          if (isNew) newTasksCount++;
          const row = document.createElement("tr");
          row.dataset.taskId = task.id;
          row.innerHTML = `
                        <td>${task.description}</td>
                        <td>${patient.name}</td>
                        <td>${new Date(task.dueDate).toLocaleDateString(
                          "uz-UZ"
                        )}</td>
                        <td><span class="badge ${
                          isNew
                            ? "bg-info-subtle text-info-emphasis"
                            : "bg-warning-subtle text-warning-emphasis"
                        }">${task.status}</span></td>
                        <td>
                            ${
                              isNew
                                ? `<button class="btn btn-sm btn-success accept-task-btn">Qabul qilish</button>`
                                : `<button class="btn btn-sm btn-primary complete-task-btn">Bajarildi</button>`
                            }
                        </td>
                    `;
          myTasksTableBody.appendChild(row);
        }
      });
    });
    newTasksCountEl.textContent = newTasksCount;
    newTasksCountEl.style.display = newTasksCount > 0 ? "inline-block" : "none";
  };

  const renderDetailsPanel = (patient) => {
    const detailsBody = document.getElementById("details-body");
    detailsBody.dataset.patientId = patient.id;
    document.getElementById("details-patient-name").textContent = patient.name;

    const infoTab = `<div class="tab-pane fade show active" id="tab-info"><p><strong>Telefon:</strong> ${
      patient.phone
    }</p><p><strong>Koordinator:</strong> ${
      users[patient.coordinatorId].name
    }</p></div>`;
    const historyTab = `<div class="tab-pane fade" id="tab-history"><ul class="list-unstyled">${patient.activityLog
      .map(
        (log) =>
          `<li class="mb-2"><small class="text-muted d-block">${new Date(
            log.time
          ).toLocaleString("uz-UZ")}</small><strong>${log.user}</strong>: ${
            log.text
          }</li>`
      )
      .join("")}</ul></div>`;

    detailsBody.innerHTML = `
            <ul class="nav nav-tabs nav-fill p-2">
              <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#tab-info">Umumiy</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#tab-history">Tarix</a></li>
            </ul>
            <div class="tab-content p-3">${infoTab}${historyTab}</div>
        `;

    detailsPanel.classList.add("show");
    detailsOverlay.classList.add("show");
  };

  // --- FILTERING LOGIC ---
  const applyAllFilters = () => {
    let filteredList = [...masterPatientList];

    // Time Period Filter
    if (activeFilters.period !== "all") {
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      let startDate;
      switch (activeFilters.period) {
        case "today":
          startDate = todayStart;
          break;
        case "week":
          startDate = new Date(
            todayStart.setDate(todayStart.getDate() - todayStart.getDay())
          );
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      if (startDate) {
        filteredList = filteredList.filter(
          (p) => new Date(p.createdAt) >= startDate
        );
      }
    }

    // Search Term Filter
    if (activeFilters.searchTerm) {
      filteredList = filteredList.filter((p) =>
        p.name.toLowerCase().includes(activeFilters.searchTerm)
      );
    }

    // Render all components with the filtered data
    renderStats(filteredList);
    renderKanbanBoard(filteredList);
  };

  // --- EVENT LISTENERS & INITIALIZATION ---
  function initializeSortable() {
    document.querySelectorAll(".kanban-cards").forEach((col) => {
      new Sortable(col, {
        group: "kanban",
        animation: 150,
        ghostClass: "sortable-ghost",
        onEnd: (evt) => {
          // Show modal to add comment
          document.getElementById("status-update-patient-id").value =
            evt.item.dataset.patientId;
          document.getElementById("status-update-new-stage-id").value =
            evt.to.id;
          document.getElementById("status-update-comment").value = "";
          updateStatusModal.show();

          // Revert the card to its original position until status is confirmed
          evt.from.appendChild(evt.item);
        },
      });
    });
  }

  document
    .getElementById("save-status-update-btn")
    .addEventListener("click", () => {
      const patientId = document.getElementById(
        "status-update-patient-id"
      ).value;
      const newStageId = document.getElementById(
        "status-update-new-stage-id"
      ).value;
      const comment = document.getElementById("status-update-comment").value;

      if (comment.trim() === "") {
        showToast("Iltimos, izoh qoldiring.", "danger");
        return;
      }

      const patient = findPatient(patientId);
      const oldStageTitle = stages[patient.stage].title;
      const newStageTitle = stages[newStageId].title;

      patient.stage = newStageId;
      patient.status = comment;
      patient.lastUpdatedAt = new Date().toISOString();
      logActivity(
        patient.id,
        `Bosqich "${oldStageTitle}" dan "${newStageTitle}" ga o'zgartirildi. Izoh: ${comment}`
      );

      if (
        !patient.tasksGeneratedForStage[newStageId] &&
        newStageId !== "col-archive"
      ) {
        let taskDescription = "";
        switch (newStageId) {
          case "col-docs":
            taskDescription = `Hujjatlarni tekshirish`;
            break;
          case "col-payment":
            taskDescription = `To'lov fakturasini yaratish`;
            break;
          case "col-trip":
            taskDescription = `Safar detallarini tashkillashtirish`;
            break;
        }
        if (taskDescription) {
          patient.tasks.push({
            id: Date.now(),
            description: taskDescription,
            status: "Yangi",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          });
          patient.tasksGeneratedForStage[newStageId] = true;
          showToast(`'${patient.name}' uchun yangi vazifa yaratildi.`);
          renderMyTasks();
        }
      }
      applyAllFilters();
      updateStatusModal.hide();
    });

  function initializeCardClickListeners() {
    kanbanBoard.addEventListener("click", (e) => {
      const card = e.target.closest(".kanban-card");
      if (!card) return;

      const patient = findPatient(card.dataset.patientId);
      if (!patient) return;

      // Handle tag change
      if (e.target.classList.contains("change-tag-btn")) {
        e.preventDefault();
        const newTag = e.target.dataset.value;
        logActivity(
          patient.id,
          `Tegi "${patient.tag}" dan "${newTag}" ga o'zgartirildi.`
        );
        patient.tag = newTag;
        applyAllFilters();
        return;
      }
      // Handle coordinator change
      if (e.target.classList.contains("change-coordinator-btn")) {
        e.preventDefault();
        const newCoordinatorId = Number.parseInt(e.target.dataset.userId);
        logActivity(
          patient.id,
          `Koordinator "${users[patient.coordinatorId].name}" dan "${
            users[newCoordinatorId].name
          }" ga o'zgartirildi.`
        );
        patient.coordinatorId = newCoordinatorId;
        applyAllFilters();
        renderMyTasks();
        return;
      }

      // Open details panel if not clicking on an interactive element
      if (!e.target.closest(".dropdown")) {
        renderDetailsPanel(patient);
      }
    });
  }

  function initializeTooltips() {
    [...document.querySelectorAll('[data-bs-toggle="tooltip"]')].map(
      (el) => new bootstrap.Tooltip(el)
    );
  }

  function closeDetailsPanel() {
    detailsPanel.classList.remove("show");
    detailsOverlay.classList.remove("show");
  }

  closeDetailsBtn.addEventListener("click", closeDetailsPanel);
  detailsOverlay.addEventListener("click", closeDetailsPanel);

  searchInput.addEventListener("input", (e) => {
    activeFilters.searchTerm = e.target.value.toLowerCase();
    applyAllFilters();
  });

  timeFilterGroup.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      timeFilterGroup.querySelector(".active")?.classList.remove("active");
      e.target.classList.add("active");
      activeFilters.period = e.target.dataset.period;
      applyAllFilters();
    }
  });

  // New Patient Modal Stepper Logic
  const steps = [...newPatientForm.querySelectorAll(".step")];
  const prevBtn = document.getElementById("form-step-prev");
  const nextBtn = document.getElementById("form-step-next");
  const finishBtn = document.getElementById("save-new-patient-btn");
  let currentStep = 0;

  const updateStepButtons = () => {
    prevBtn.disabled = currentStep === 0;
    nextBtn.classList.toggle("d-none", currentStep === steps.length - 1);
    finishBtn.classList.toggle("d-none", currentStep !== steps.length - 1);
    steps.forEach((step, index) =>
      step.classList.toggle("active", index === currentStep)
    );
  };

  nextBtn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateStepButtons();
    }
  });
  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateStepButtons();
    }
  });

  finishBtn.addEventListener("click", () => {
    const name =
      document.getElementById("new-patient-firstname").value +
      " " +
      document.getElementById("new-patient-lastname").value;
    const department = document.getElementById("new-patient-department").value;
    if (name.trim() && department) {
      const newPatient = {
        id: Math.max(...masterPatientList.map((p) => p.id), 0) + 1,
        name: name,
        department: department,
        country: "uz",
        source: "Manual",
        createdBy: currentUserId,
        tag: "Normal",
        coordinatorId: currentUserId,
        stage: "col-new",
        phone: document.getElementById("new-patient-phone").value,
        tasks: [],
        documents: [],
        finances: { items: [], paid: 0 },
        tasksGeneratedForStage: {},
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        activityLog: [
          {
            text: "Bemor profili yaratildi",
            time: new Date().toISOString(),
            user: users[currentUserId].shortName,
          },
        ],
        status: "Yangi bemor, ma'lumotlar kiritilmoqda",
      };
      masterPatientList.unshift(newPatient);
      applyAllFilters();
      newPatientModal.hide();
      showToast("Yangi bemor profili muvaffaqiyatli yaratildi!", "success");
    } else {
      showToast(
        "Iltimos, Ism, Familiya va Tibbiy yo'nalish maydonlarini to'ldiring.",
        "danger"
      );
    }
  });

  newPatientModalEl.addEventListener("hidden.bs.modal", () => {
    newPatientForm.reset();
    currentStep = 0;
    updateStepButtons();
  });

  // --- Stage Settings Logic ---
  const stageList = document.getElementById("stage-list");
  const addNewStageBtn = document.getElementById("add-new-stage-btn");

  const renderStageSettings = () => {
    stageList.innerHTML = "";
    for (const stageId in stages) {
      const stage = stages[stageId];
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
                <span>${stage.title}</span>
                <div>
                    <button class="btn btn-sm btn-outline-danger delete-stage-btn" data-stage-id="${stageId}"><i class="bi bi-trash"></i></button>
                </div>
            `;
      stageList.appendChild(li);
    }
  };

  addNewStageBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("new-stage-name");
    const colorSelect = document.getElementById("new-stage-color");
    const newName = nameInput.value.trim();
    if (newName) {
      const newId = "col-" + newName.toLowerCase().replace(/\s/g, "-");
      if (stages[newId]) {
        showToast("Bunday nomli bosqich mavjud.", "danger");
        return;
      }
      stages[newId] = { title: newName, headerClass: colorSelect.value };
      nameInput.value = "";
      renderStageSettings();
      applyAllFilters();
    }
  });

  stageList.addEventListener("click", (e) => {
    const target = e.target.closest("button.delete-stage-btn");
    if (!target) return;
    const stageId = target.dataset.stageId;
    if (
      confirm(
        `'${stages[stageId].title}' bosqichini o'chirishga ishonchingiz komilmi? Bu bosqichdagi barcha bemorlar arxivlanadi.`
      )
    ) {
      masterPatientList.forEach((p) => {
        if (p.stage === stageId) {
          p.stage = "col-archive";
        }
      });
      delete stages[stageId];
      renderStageSettings();
      applyAllFilters();
    }
  });

  document
    .getElementById("stageSettingsModal")
    .addEventListener("show.bs.modal", renderStageSettings);

  // --- Theme Toggle ---
  const themeToggle = document.getElementById("theme-toggle");
  const htmlEl = document.documentElement;
  const currentTheme = localStorage.getItem("theme") || "light";
  htmlEl.setAttribute("data-bs-theme", currentTheme);
  themeToggle.checked = currentTheme === "dark";
  themeToggle.addEventListener("change", () => {
    const theme = themeToggle.checked ? "dark" : "light";
    htmlEl.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  });

  // --- INITIAL RENDER ---
  document.getElementById("current-user-name").textContent =
    users[currentUserId].name;
  applyAllFilters();
  renderMyTasks();
});
