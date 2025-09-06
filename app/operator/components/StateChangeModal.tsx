interface Patient {
  id: number;
  name: string;
  tagId: number;
  stageId: string;
  history: { date: string; author: string; text: string }[];
}

interface Stage {
  id: string;
  title: string;
}

interface StageChangeModalProps {
  tempMoveData: { patientId: number; newStageId: string } | null;
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  stages: Stage[];
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export default function StageChangeModal({ tempMoveData, patients, setPatients, stages, showToast }: StageChangeModalProps) {
  const handleSave = () => {
    const comment = (document.getElementById('stage-change-comment') as HTMLTextAreaElement).value;
    if (!comment.trim()) {
      showToast("Iltimos, izoh yozing!", 'error');
      return;
    }
    if (tempMoveData) {
      const updatedPatients = patients.map((p) =>
        p.id === tempMoveData.patientId
          ? {
              ...p,
              stageId: tempMoveData.newStageId,
              history: [...p.history, { date: new Date().toISOString(), author: 'Operator #1', text: comment }],
            }
          : p
      );
      setPatients(updatedPatients);
      showToast("Bosqich muvaffaqiyatli o'zgartirildi");
    }
    // Hide modal (handled in parent)
  };

  if (!tempMoveData) return null;

  const patient = patients.find((p) => p.id === tempMoveData.patientId);
  const newStage = stages.find((s) => s.id === tempMoveData.newStageId);

  return (
    <div className="modal fade show" id="stageChangeCommentModal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Bosqichni O'zgartirish</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <p>
              Bemor <strong>{patient?.name}</strong> uchun yangi bosqich: <strong>{newStage?.title}</strong>
            </p>
            <div className="mb-3">
              <label htmlFor="stage-change-comment" className="form-label">Izoh (majburiy)</label>
              <textarea className="form-control" id="stage-change-comment" rows={3} required></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Bekor qilish
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}