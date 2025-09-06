interface Tag {
  id: number;
  text: string;
  color: string;
}

interface TagManagementModalProps {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
}

export default function TagManagementModal({ tags, setTags }: TagManagementModalProps) {
  const handleAddTag = () => {
    const name = (document.getElementById('new-tag-name') as HTMLInputElement).value;
    const color = (document.getElementById('new-tag-color') as HTMLSelectElement).value;
    if (name.trim()) {
      setTags([...tags, { id: tags.length > 0 ? Math.max(...tags.map((t) => t.id)) + 1 : 1, text: name, color }]);
      (document.getElementById('new-tag-name') as HTMLInputElement).value = '';
    }
  };

  const handleDeleteTag = (tagId: number) => {
    setTags(tags.filter((t) => t.id !== tagId));
  };

  return (
    <div className="modal fade" id="tagManagementModal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Holatlarni (Teglarni) Boshqarish</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <h6>Mavjud Holatlar</h6>
            <ul className="list-group mb-4" id="tags-list">
              {tags.map((tag) => (
                <li key={tag.id} className="list-group-item flex justify-between items-center">
                  <span className={`badge text-bg-${tag.color}`}>{tag.text}</span>
                  <button
                    className="btn btn-sm btn-outline-danger border-0"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
            <h6>Yangi Holat Qo&apos;shish</h6>
            <div className="input-group">
              <input type="text" id="new-tag-name" className="form-control" placeholder="Yangi holat nomi..." />
              <select id="new-tag-color" className="form-select w-auto">
                <option value="success">Yashil</option>
                <option value="warning">Sariq</option>
                <option value="danger">Qizil</option>
                <option value="primary">Ko&apos;k</option>
                <option value="secondary">Kulrang</option>
              </select>
              <button className="btn btn-primary" onClick={handleAddTag}>Qo&apos;shish</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}