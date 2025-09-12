import Link from 'next/link';

export default function Sidebar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <aside id="sidebar" className="sidebar">
      <Link href="#" className="logo">
        <img
          src="https://medmap.uz/images/MedMapp_Logo_shaffof.png"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x66/ffffff/012970?text=MedMap')}
          alt="MedMap Logo"
          className="logo-full"
        />
        <img
          src="https://medmap.uz/images/favicon.png"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/40x40/ffffff/012970?text=M')}
          alt="MedMap Icon"
          className="logo-icon"
        />
      </Link>
      <div className="sidebar-nav nav flex-col mt-4 flex-grow-1">
        <Link href="#" className="nav-link active"><i className="bi bi-grid-1x2-fill"></i><span>Boshqaruv Paneli</span></Link>
        <Link href="#" className="nav-link"><i className="bi bi-telephone-inbound"></i><span>Yangi Murojaatlar</span></Link>
        <Link href="#" className="nav-link"><i className="bi bi-check2-circle"></i><span>Bajarilgan Murojaatlar</span></Link>
        <Link href="#" className="nav-link"><i className="bi bi-building"></i><span>Klinikalar Bazasi</span></Link>
        <Link href="#" className="nav-link"><i className="bi bi-cash-coin"></i><span>Moliya</span></Link>
      </div>
      <div className="logout">
        <Link href="#" className="nav-link"><i className="bi bi-box-arrow-left"></i><span>Chiqish</span></Link>
      </div>
    </aside>
  );
}