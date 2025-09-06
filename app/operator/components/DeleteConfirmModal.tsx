interface Patient {
  id: number;
  name: string;
}

interface DeleteConfirmModalProps {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  selectedPatientId: number | null;
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export default function DeleteConfirmModal({ patients, setPatients, selectedPatientId, showToast }: DeleteConfirmModalProps) {
  const patient = patients.find((p) => p.id === selectedPatientId);

  const handleDelete = () => {
    if (selectedPatientId) {
      setPatients(patients.filter((p) => p.id !== selectedPatientId));
      showToast("Bemor muvaffaqiyatli o'chirildi.", 'warning');
    }
  };

  if (!patient) return null;

  return (
    <div className="modal fade" id="deleteConfirmModal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tasdiqlash</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <p>Rostdan ham <strong>{patient.name}</strong> ismli bemorni o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Yo'q</button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Ha, o'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}