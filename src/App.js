import axios from "axios";
import "./App.css";
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [processedData, setProcessedData] = useState([]);

  const refactorData = (docs) => {
    const refactoredData = docs.map((doc) => {
      const title = doc.CIVIX_DOCUMENT_TITLE[0];
      const content = doc.frag.map((f) => {
        if (f._) {
          return f._;
        }
        return "";
      });
      return { title, content, summary: "" };
    });
    return refactoredData;
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://search-tool-api.vercel.app/api/search",
        {
          params: {
            q: query,
          },
        }
      );
      const refactoredData = refactorData(response.data.results.doc);
      setProcessedData(refactoredData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleSummary = async (content, index) => {
    try {
      const formattedContent = content.join(" ").replace(/\.\.\./g, "");
      const response = await axios.post(
        "https://search-tool-api.vercel.app/api/generate",
        { formattedContent }
      );
      const updatedData = [...processedData];
      updatedData[index].summary = response.data;
      setProcessedData(updatedData);
    } catch (error) {
      console.error("Error summarizing document", error);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h3>BC Laws Search Tool</h3>
      </header>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search BC Laws"
        />
        <button onClick={handleSearch}>Search</button>
        <ul>
          {processedData.map((data, index) => (
            <li key={data.title}>
              <strong>Title:</strong> {data.title} <br />
              <strong>Content:</strong> {data.content} <br />
              <strong>Summary:</strong> {data.summary || "No summary yet."}
              <br />
              <button onClick={() => handleSummary(data.content, index)}>
                Generate AI Content
              </button>
              <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
