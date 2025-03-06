import { Button } from "./ui/Button";
import ChartConfigForm from "./ChartConfigForm";
import { useRef } from "react";
import { ChartConfig } from "../types/Chart";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";

type AddChartDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: Partial<ChartConfig>) => void;
  onCancel: () => void;
};

const AddChartDrawer = ({ isOpen, onOpenChange, onSave, onCancel }: AddChartDrawerProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const triggerFormSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Add New Chart</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ChartConfigForm
            formRef={formRef}
            onSave={onSave}
            onCancel={onCancel}
            displayFooterButtons={false}
          />
        </div>

        <SheetFooter className="px-6 py-4 border-t">
          <div className="flex justify-end space-x-2 w-full">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={triggerFormSubmit}>Add Chart</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddChartDrawer;
