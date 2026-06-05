// Welcome.jsx
import "../assets/css/Welcome.css";
import data from "../data/multisiteData.json";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  
  function handlePreview(item) {
    console.log('Navigating to preview with:', item);
    navigate('/preview', { state: { templateId: item.templateId } });
  }
  
  return (
    <div className="welcome-container">
      <h1>Website Templates</h1>

      <div className="card-grid">
        {data.map((item) => (
          <div key={item.templateId} className="preview-card">
            <img src={item.image} alt={item.title} />
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <div className="card-actions">
                <button className="preview-btn" onClick={() => handlePreview(item)}>Preview</button>
                <button className="edit-btn" onClick={() => navigate('/customize', { state: { templateId: item.templateId } })}>
                  Customize
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}