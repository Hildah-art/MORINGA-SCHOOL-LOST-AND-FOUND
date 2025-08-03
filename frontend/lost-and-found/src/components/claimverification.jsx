import { useState } from 'react';


function ClaimVerification() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="claim-verification">
      <h2> Claim Verification</h2>
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
        <button type="submit">Submit Claim</button>
      </form>

      {submitted && (
        <div className="confirmation">
          ✅ Claim submitted. Await verification.
        </div>
      )}
    </div>
  );
}

export default ClaimVerification;
