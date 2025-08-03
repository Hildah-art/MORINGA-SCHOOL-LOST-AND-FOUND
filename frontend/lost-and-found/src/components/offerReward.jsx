import { useState } from 'react';


function OfferReward({ onSubmit }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('M-Pesa');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null);

  const isValidPhone = (phone) => /^07\d{8}$/.test(phone);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount) {
      setStatus('❗ Please enter an amount.');
      return;
    }

    if (method === 'M-Pesa' && !isValidPhone(phone)) {
      setStatus('❗ Enter a valid M-Pesa number (07xxxxxxxx).');
      return;
    }

    const reward = {
      id: Date.now(),
      amount,
      method,
      phone,
      status: 'Pending',
    };

    onSubmit(reward);
    setAmount('');
    setPhone('');
    setStatus('Payment initiated successfully!');
  };

  return (
    <div className="reward-container">
      <h2> Offer a Reward</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount (KES):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <label>
          Payment Method:
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>M-Pesa</option>
            <option>Airtel Money</option>
            <option>Bank Transfer</option>
          </select>
        </label>

        {method === 'M-Pesa' && (
          <label>
            Phone Number:
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        )}

        <button type="submit">Initiate Payment</button>
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}

export default OfferReward;
