
function RewardStatus({ rewards, onConfirm }) {
  return (
    <div className="reward-container">
      <h2>Reward Management</h2>
      {rewards.length === 0 ? (
        <p>No rewards added yet.</p>
      ) : (
        <ul className="reward-list">
          {rewards.map((reward) => (
            <li key={reward.id}>
              <strong>KES {reward.amount}</strong> via {reward.method}{' '}
              {reward.phone && `to ${reward.phone}`} — <em>{reward.status}</em>
              {reward.status === 'Pending' && (
                <button onClick={() => onConfirm(reward.id)}>Confirm Sent ✅</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RewardStatus;
