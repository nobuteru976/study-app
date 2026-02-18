import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type Record = {
  id: string;
  content: string;
  time: number;
};

function App() {
  const [learningContent, setLearningContent] = useState("");
  const [learningTime, setLearningTime] = useState(0);
  const [learningRecords, setLearningRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLearningRecords = async () => {
      const { data, error } = await supabase.from("records").select("*");

      if (error) {
        console.error(error);
        return;
      }

      const records = data.map((record) => ({
        id: record.id,
        content: record.content,
        time: record.time,
      }));

      setLearningRecords(records);
      setIsLoading(false);
    };

    fetchLearningRecords();
  }, []);

  const handleSaveLearningRecord = async () => {
    const { data, error } = await supabase
      .from("records")
      .insert({ content: learningContent, time: learningTime })
      .select();

    if (error) {
      console.error(error);
      return;
    }

    const newRecord = {
      id: data[0].id,
      content: data[0].content,
      time: data[0].time,
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
            <label>学習内容!</label>
            <input
              type="text"
              value={learningContent}
              onChange={(e) => setLearningContent(e.target.value)}
            />
          </div>
          <div>
            <label>学習時間</label>
            <input
              type="number"
              value={learningTime}
              onChange={(e) => setLearningTime(Number(e.target.value))}
            />
          </div>
          <button onClick={handleSaveLearningRecord}>学習記録を保存</button>
          {learningRecords.map((record) => (
            <div key={record.id}>
              {record.content} - {record.time}時間
            </div>
          ))}
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
