import DailyLogPage from "./DailyLogPage";
import DailyTotals from "./DailyTotals";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DailyTotals />
      <DailyLogPage />
    </div>
  );
}
