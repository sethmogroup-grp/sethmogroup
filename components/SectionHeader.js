import React from 'react';
import { Save } from 'lucide-react';

const SectionHeader = ({ title, description, saving, onSave, status }) => (
  <>
    <div className="hs-top">
      <div>
        <h2>{title}</h2>
        {description && <p className="hs-sub">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="btn btn-primary"
        style={{ flexShrink: 0 }}
      >
        <Save size={18} /> {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
    {status.message && <div className={`hs-status ${status.type}`}>{status.message}</div>}
  </>
);

export default SectionHeader;
