import { useState } from 'react';
import axios from 'axios';

function ClaimVerification({ itemId, userId }) {
  const [answers, setAnswers] = useState({
    item: '',
    whenLost: '',
    proofFile: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("item_id", itemId);
    formData.append("claimant_id", userId);
    formData.append("questionnaire_answers", `Item: ${answers.item}, Lost: ${answers.whenLost}`);
    if (answers.proofFile) {
      formData.append("proof_document", answers.proofFile);
    }

    try {
      await axios.post("http://localhost:5000/claims", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("Claim submission failed.");
    }
  };

  return (
    <div className="claim-verification">
      <h2>Claim Verification</h2>
      <form onSubmit={handleSubmit}>
        <label>
          What item are you claiming?
          <input
            type="text"
            name="item"
            value={answers.item}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          When did you lose it?
          <input
            type="text"
            name="whenLost"
            value={answers.whenLost}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Upload proof (e.g. photo, receipt):
          <input
            type="file"
            name="proofFile"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={submitted}>
          {submitted ? "Submitted" : "Submit Claim"}
        </button>
      </form>

      {submitted && (
        <div className="confirmation">
          Claim submitted. Await verification.
        </div>
      )}
    </div>
  );
}

export default ClaimVerification;
