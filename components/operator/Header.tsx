import Link from "next/link";

export default function Header({
  toggleSidebar,
  toggleTheme,
  theme,
}: {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  theme: string;
}) {
  return (
    <header className="header d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <i className="bi bi-list toggle-sidebar-btn me-3 fs-4"></i>
      </div>
      <nav className="header-nav d-flex align-items-center">
        <a
          className="nav-link nav-icon"
          id="dark-mode-toggle"
          href="#"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          aria-label="Tungi/Kunduzgi rejim"
          data-bs-original-title="Tungi/Kunduzgi rejim"
        >
          <i className="bi bi-moon-stars"></i>
        </a>
        <a
          className="nav-link nav-icon"
          href="#"
          data-bs-toggle="modal"
          data-bs-target="#tagManagementModal"
          data-bs-placement="bottom"
          title="Sozlamalar"
        >
          <i className="bi bi-gear-fill"></i>
        </a>
        <a
          className="nav-link nav-icon"
          href="#"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          aria-label="Bildirishnomalar"
          data-bs-original-title="Bildirishnomalar"
        >
          <i className="bi bi-bell"></i>
        </a>
        <div className="vr h-50 d-none d-sm-block mx-2"></div>
        <div className="nav-item dropdown">
          <a
            className="nav-link nav-profile d-flex align-items-center ps-sm-2"
            href="#"
            data-bs-toggle="dropdown"
          >
            <img
              src="https://placehold.co/40x40/012970/ffffff?text=O"
              alt="Profile"
              className="rounded-circle"
            />
            <div className="d-none d-md-flex flex-column align-items-start ms-2">
              <span className="fw-bold" id="operator-name">
                Operator #1
              </span>
              <span className="text-muted small">callcenter@medmap.uz</span>
            </div>
          </a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <li>
              {" "}
              <a className="dropdown-item d-flex align-items-center" href="#">
                {" "}
                <i className="bi bi-person"></i> <span>Profil</span>{" "}
              </a>{" "}
            </li>
            <li>
              {" "}
              <hr className="dropdown-divider" />{" "}
            </li>
            <li>
              {" "}
              <a className="dropdown-item d-flex align-items-center" href="#">
                {" "}
                <i className="bi bi-box-arrow-right"></i> <span>Chiqish</span>{" "}
              </a>{" "}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
