import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [searchCity, setSearchCity] = useState("");

  const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

  const fetchDonors = () => {
    setLoading(true);

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        const mappedDonors = data.map((user, index) => ({
          id: user.id,
          name: user.name,
          city: user.address.city,
          bloodGroup: bloodGroups[index % bloodGroups.length],
          available: Math.random() > 0.3,
          requested: false,
        }));

        setDonors(mappedDonors);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleRequest = (id) => {
    const updated = donors.map((d) =>
      d.id === id ? { ...d, requested: true } : d
    );
    setDonors(updated);
  };

  const filteredDonors = donors.filter((d) => {
    const groupMatch =
      selectedGroup === "All" || d.bloodGroup === selectedGroup;
    const cityMatch =
      d.city.toLowerCase().includes(searchCity.toLowerCase());
    return groupMatch && cityMatch;
  });

  const availableCount = donors.filter((d) => d.available).length;

  return (
    <div className="container">
      <h1>🩸 Community Blood Donor Finder</h1>

      <div className="top-bar">
        <p>Total Available Donors: <b>{availableCount}</b></p>
        <button className="refresh-btn" onClick={fetchDonors}>
          Refresh
        </button>
      </div>

      <div className="controls">
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="All">All Groups</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
      </div>

      {loading ? (
         <div className="spinner"></div>
      ) : filteredDonors.length === 0 ? (
        <p className="no-data">No donors found.</p>
      ) : (
        <div className="cards">
          {filteredDonors.map((donor) => (
            <div key={donor.id} className="card">
              <h3>{donor.name}</h3>
              <p><b>Blood Group:</b> {donor.bloodGroup}</p>
              <p><b>City:</b> {donor.city}</p>

              <span
                className={
                  donor.available ? "badge available" : "badge unavailable"
                }
              >
                {donor.available ? "Available" : "Not Available"}
              </span>

              <br /><br />

              {!donor.available ? (
                <button disabled>Not Available</button>
              ) : donor.requested ? (
                  <button disabled>Request Sent ✅</button>
              ) : (
                  <button onClick={() => handleRequest(donor.id)}>
                    Request Help
                  </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;