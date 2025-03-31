import { useState } from "react";

const usedCodesStore = {};

function generateCodes(amount) {
  const codes = [];
  const letters = "abcdefghjkmnpqrstuvwxyz";
  for (let i = 0; i < amount; i++) {
    const letter = letters.charAt(Math.floor(Math.random() * letters.length));
    const number = Math.floor(100 + Math.random() * 900);
    const code = `Tx${letter}${number}`;
    usedCodesStore[code.toLowerCase()] = { used: false, activatedAt: null };
    codes.push(code);
  }
  return codes;
}

function isCodeUsable(code) {
  const record = usedCodesStore[code.toLowerCase()];
  if (!record) return false;
  if (!record.used) return true;
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  return Date.now() - record.activatedAt > threeDays;
}

function activateCode(code) {
  const lower = code.toLowerCase();
  if (usedCodesStore[lower]) {
    usedCodesStore[lower].used = true;
    usedCodesStore[lower].activatedAt = Date.now();
  }
}

export default function App() {
  const [manualCode, setManualCode] = useState("");
  const [codeStatus, setCodeStatus] = useState(null);
  const [tourUnlocked, setTourUnlocked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [extraCodes, setExtraCodes] = useState([]);
  const [userCode, setUserCode] = useState("");

  const pricingOptions = [
    { quantity: 1, price: 5 },
    { quantity: 2, price: 8 },
    { quantity: 3, price: 10 },
    { quantity: 4, price: 11 },
    { quantity: 5, price: 13.75 },
    { quantity: 6, price: 16.5 },
    { quantity: 7, price: 19.25 },
    { quantity: 8, price: 22 },
  ];

  const handleCodeSubmit = (code) => {
    if (isCodeUsable(code.trim())) {
      activateCode(code.trim());
      setCodeStatus("✅ Code geaccepteerd. Je hebt toegang tot de tour!");
      setTourUnlocked(true);
    } else {
      setCodeStatus("❌ Ongeldige of verlopen code.");
    }
  };

  const handleSelect = (quantity) => {
    setSelectedOption(quantity);
    const codes = generateCodes(quantity);
    setGeneratedCodes(codes);
    setUserCode(codes[0]);
    setExtraCodes(codes.slice(1));
    handleCodeSubmit(codes[0]);
  };

  const tourTexts = [
    "Welkom op de kaasboerderij! We nemen je mee langs het erf, de dieren en natuurlijk… de kaas.",
    "Deze schapen zorgen voor een bijzondere melksoort. Proef je straks verschil tussen koe en schaap?",
    "In deze stal verblijven onze dieren ‘s winters. Ze krijgen hooi, kuilgras en veel rust.",
    "Zodra het kan, gaan onze dieren de wei in. Frisse lucht en gras maken gezonde melk.",
    "Elke ochtend wordt de melk vers verwerkt. Binnen een uur zit het al in de kaaspan.",
    "Hier roeren we de melk langzaam warm. Daarna wordt de wrongel gesneden en geperst.",
    "Kaas zwemt 24 uur in pekelwater. Dit zorgt voor de korst én de smaak.",
    "In de opslag liggen kazen wel 12 maanden te rijpen. Hoe ouder, hoe pittiger.",
    "Je kunt straks kazen proeven in de winkel. Vraag naar de jongste én de oudste variant!",
    "Bedankt voor je bezoek. Laat gerust een berichtje achter, of neem een stukje Texel mee naar huis."
  ];

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        🎧 Luustertocht – Wezenspyk
      </h1>

      <p style={{ marginBottom: "1rem" }}>
        Voer je toegangscode in of koop een tour voor jezelf of je groep.
      </p>

      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Bijv. Txk382"
          style={{ padding: "0.5rem", width: "200px", marginRight: "1rem" }}
        />
        <button onClick={() => handleCodeSubmit(manualCode)}>Start tour</button>
        {codeStatus && <p style={{ marginTop: "0.5rem" }}>{codeStatus}</p>}
      </div>

      <h2>Toegang kopen</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
        {pricingOptions.map((option, i) => (
          <button
            key={i}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid gray",
              backgroundColor: selectedOption === option.quantity ? "#d0f0c0" : "white"
            }}
            onClick={() => handleSelect(option.quantity)}
          >
            {option.quantity} persoon{option.quantity > 1 ? "s" : ""} – €{option.price}
          </button>
        ))}
      </div>

      {userCode && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Jouw toegangscode:</strong> <code>{userCode}</code>
        </div>
      )}

      {extraCodes.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <strong>Deelcodes:</strong>
          {extraCodes.map((code, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", maxWidth: "300px", marginTop: "0.5rem" }}>
              <span>{code}</span>
              <button onClick={() => navigator.clipboard.writeText(code)}>📋 Kopieer</button>
            </div>
          ))}
        </div>
      )}

      {tourUnlocked && (
        <div>
          <h2>🎧 Tourpunten</h2>
          {tourTexts.map((text, i) => (
            <div key={i} style={{ marginBottom: "1.5rem", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
              <h3>Punt {i + 1}</h3>
              <p>{text}</p>
              <audio controls>
                <source src={`luisterpunt_${i + 1}.mp3`} type="audio/mpeg" />
                Je browser ondersteunt geen audio.
              </audio>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

