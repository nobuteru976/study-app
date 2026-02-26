import { useEffect, useState } from "react";
import { getLearningRecords, saveLearningRecord } from "./supabase";
import type { Record } from "./Record";

function App() {
  const [learningContent, setLearningContent] = useState("");
  const [learningTime, setLearningTime] = useState(0);
  const [learningRecords, setLearningRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLearningRecords = async () => {
      const data = await getLearningRecords();

      const records = data.map((record: Record) => ({
        id: record.id,
        content: record.content,
        time: record.time as number,
      }));

      setLearningRecords(records);
      setIsLoading(false);
    };

    fetchLearningRecords();
  }, []);

  const handleSaveLearningRecord = async () => {
    const data = await saveLearningRecord(learningContent, learningTime);

    const newRecord = {
      id: data.id,
      content: data.content,
      time: data.time,
    };

    setLearningRecords([...learningRecords, newRecord]);
    setLearningContent("");
    setLearningTime(0);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>学習記録アプリ</h1>
          <div>
            <label htmlFor="learning-content">学習内容</label>
            <input
              id="learning-content"
              type="text"
              value={learningContent}
              onChange={(e) => setLearningContent(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="learning-time">学習時間</label>
            <input
              id="learning-time"
              type="number"
              value={learningTime}
              onChange={(e) => setLearningTime(Number(e.target.value))}
            />
          </div>
          <button onClick={handleSaveLearningRecord}>学習記録を保存</button>
          <ul>
            {learningRecords.map((record) => (
              <li key={record.id}>
                {record.content} - {record.time}時間
              </li>
            ))}
          </ul>
          <div>
            合計学習時間:{" "}
            {learningRecords.reduce((acc, record) => acc + record.time, 0)}時間
          </div>
        </div>
      )}
    </>
  );
}

export default App;
