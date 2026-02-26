import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  vi.mock("../supabase", () => {
    return {
      getLearningRecords: vi.fn().mockResolvedValue([
        { id: "1", content: "初期データ", time: 2 },
        { id: "2", content: "初期データ2", time: 3 },
      ]),
      saveLearningRecord: vi
        .fn()
        .mockResolvedValue({ id: "3", content: "テスト", time: 1 }),
    };
  });

  test("タイトルが表示されている", async () => {
    render(<App />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "学習記録アプリ" }),
      ).toBeInTheDocument(),
    );
  });

  test("学習を記録できる", async () => {
    render(<App />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "学習記録アプリ" }),
      ).toBeInTheDocument(),
    );

    const learningContentInput = screen.getByRole("textbox", {
      name: "学習内容",
    });
    const learningTimeInput = screen.getByRole("spinbutton", {
      name: "学習時間",
    });

    fireEvent.change(learningContentInput, { target: { value: "テスト" } });
    fireEvent.change(learningTimeInput, { target: { value: "1" } });

    const saveButton = screen.getByRole("button", { name: "学習記録を保存" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      const items = screen.getAllByRole("listitem");
      const lastItem = items[items.length - 1];
      expect(lastItem).toHaveTextContent("テスト - 1時間");
    });
  });
});
