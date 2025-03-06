import { useState } from "react";
import { useChartStore } from "../store/chartStore";
import ChartWrapper from "./ChartWrapper";
import { Button } from "./ui/Button";
import { ChartConfig } from "../types/Chart";
import AddChartDrawer from "./AddChartDrawer";

const Dashboard = () => {
  const [isAddingChart, setIsAddingChart] = useState(false);
  const charts = useChartStore((state) => state.charts);
  const addChart = useChartStore((state) => state.addChart);

  const handleSaveNewChart = (config: Partial<ChartConfig>) => {
    addChart(config as Omit<ChartConfig, "id">);
    setIsAddingChart(false);
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Chart Management Dashboard</h1>
        <p className="text-gray-600">
          Add, configure and manage economic data charts from FRED
        </p>
      </header>

      <div className="mb-6">
        <Button onClick={() => setIsAddingChart(true)}>Add New Chart</Button>
      </div>

      <AddChartDrawer
        isOpen={isAddingChart}
        onOpenChange={setIsAddingChart}
        onSave={handleSaveNewChart}
        onCancel={() => setIsAddingChart(false)}
      />

      {charts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No charts yet</h3>
          <p className="text-gray-600 mb-4">
            Add your first chart to start visualizing economic data
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charts.map((chart) => (
            <ChartWrapper key={chart.id} config={chart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
