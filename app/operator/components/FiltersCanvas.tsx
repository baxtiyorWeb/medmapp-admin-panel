interface Stage {
  id: string;
  title: string;
}

interface Tag {
  id: number;
  text: string;
}

interface FiltersOffcanvasProps {
  stages: Stage[];
  tags: Tag[];
  setSelectedStage: (stage: string) => void;
  setSelectedTags: (tags: number[]) => void;
}

export default function FiltersOffcanvas({ stages, tags, setSelectedStage, setSelectedTags }: FiltersOffcanvasProps) {
  return (
    <div className="offcanvas offcanvas-end" id="filtersOffcanvas">
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">Filtrlar</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div className="offcanvas-body">
        <div className="mb-3">
          <label className="form-label">Tegi bo'yicha</label>
          <div id="filter-tags-container">
            {tags.map((tag) => (
              <div key={tag.id} className="form-check">
                <input
                  className="form-check-input filter-checkbox"
                  type="checkbox"
                  value={tag.id}
                  id={`filter-tag-${tag.id}`}
                  onChange={(e) => {
                    setSelectedTags(
                      e.target.checked
                        ? [...selectedTags, tag.id]
                        : selectedTags.filter((id) => id !== tag.id)
                    );
                  }}
                />
                <label className="form-check-label" htmlFor={`filter-tag-${tag.id}`}>
                  {tag.text}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="filter-stage" className="form-label">Bosqich bo'yicha</label>
          <select
            className="form-select"
            id="filter-stage"
            onChange={(e) => setSelectedStage(e.target.value)}
          >
            <option value="">Barchasi</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>{stage.title}</option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <button className="btn btn-primary w-full" onClick={() => { /* Apply filters (handled in parent) */ }}>
            Qo'llash
          </button>
          <button
            className="btn btn-light w-full mt-2"
            onClick={() => {
              setSelectedTags([]);
              setSelectedStage('');
            }}
          >
            Tozalash
          </button>
        </div>
      </div>
    </div>
  );
}