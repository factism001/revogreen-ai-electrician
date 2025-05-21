
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, XCircle, CalculatorIcon, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
}

type Period = 'day' | 'week' | 'month' | 'year';

const periodMultipliers: Record<Period, number> = {
  day: 1,
  week: 7,
  month: 30, // Approximation
  year: 365,
};

const periodLabels: Record<Period, string> = {
  day: 'Per Day',
  week: 'Per Week',
  month: 'Per Month',
  year: 'Per Year',
};

export default function EnergyConsumptionCalculator() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [currentApplianceName, setCurrentApplianceName] = useState('');
  const [currentApplianceWatts, setCurrentApplianceWatts] = useState('');
  const [currentApplianceHours, setCurrentApplianceHours] = useState('');
  const [electricityTariff, setElectricityTariff] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [totalConsumptionKWh, setTotalConsumptionKWh] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddAppliance = () => {
    const watts = parseFloat(currentApplianceWatts);
    const hours = parseFloat(currentApplianceHours);

    if (!currentApplianceName.trim()) {
      setError("Appliance name cannot be empty.");
      return;
    }
    if (isNaN(watts) || watts <= 0) {
      setError("Please enter a valid positive number for watts.");
      return;
    }
    if (isNaN(hours) || hours < 0 || hours > 24) {
      setError("Please enter a valid number of hours per day (0-24).");
      return;
    }
    setError(null);

    const newAppliance: Appliance = {
      id: Date.now().toString(),
      name: currentApplianceName,
      watts: watts,
      hoursPerDay: hours,
    };
    setAppliances([...appliances, newAppliance]);
    setCurrentApplianceName('');
    setCurrentApplianceWatts('');
    setCurrentApplianceHours('');
  };

  const handleRemoveAppliance = (id: string) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const calculateConsumption = () => {
    if (appliances.length === 0) {
      setTotalConsumptionKWh(0);
      setTotalCost(null);
      return;
    }

    let dailyKWh = 0;
    appliances.forEach(app => {
      dailyKWh += (app.watts * app.hoursPerDay) / 1000;
    });

    const consumptionForPeriod = dailyKWh * periodMultipliers[selectedPeriod];
    setTotalConsumptionKWh(consumptionForPeriod);

    const tariffValue = parseFloat(electricityTariff);
    if (!isNaN(tariffValue) && tariffValue > 0) {
      setTotalCost(consumptionForPeriod * tariffValue);
    } else {
      setTotalCost(null);
    }
  };
  
  useEffect(() => {
    // Recalculate when appliances, period, or tariff change
    if (appliances.length > 0) {
        calculateConsumption();
    } else {
        setTotalConsumptionKWh(null);
        setTotalCost(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliances, selectedPeriod, electricityTariff]);


  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl flex items-center">
          <CalculatorIcon className="mr-3 h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          Energy Consumption Calculator
        </CardTitle>
        <CardDescription>
          Add your appliances, their power rating (Watts), daily usage (Hours/Day), and optionally your electricity tariff (NGN per kWh) to estimate consumption and cost.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="flex items-center p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/50">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        <Card className="p-4 bg-muted/30">
          <CardTitle className="text-lg mb-3">Add Appliance</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <Input
              type="text"
              placeholder="Appliance Name (e.g., TV)"
              value={currentApplianceName}
              onChange={(e) => setCurrentApplianceName(e.target.value)}
              className="bg-background"
            />
            <Input
              type="number"
              placeholder="Power (Watts)"
              value={currentApplianceWatts}
              onChange={(e) => setCurrentApplianceWatts(e.target.value)}
              min="0"
              className="bg-background"
            />
            <Input
              type="number"
              placeholder="Hours Used Per Day"
              value={currentApplianceHours}
              onChange={(e) => setCurrentApplianceHours(e.target.value)}
              min="0"
              max="24"
              step="0.1"
              className="bg-background"
            />
          </div>
          <Button onClick={handleAddAppliance} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Appliance
          </Button>
        </Card>

        {appliances.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Appliances:</h3>
            <ScrollArea className="h-[150px] p-1 border rounded-md">
              <div className="space-y-2 p-3">
              {appliances.map(app => (
                <Card key={app.id} className="p-3 flex justify-between items-center bg-card">
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {app.watts}W, {app.hoursPerDay} hrs/day
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveAppliance(app.id)} aria-label="Remove appliance">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </Button>
                </Card>
              ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        <div className="space-y-2">
            <Label htmlFor="tariff-input">Electricity Tariff (NGN per kWh, Optional)</Label>
            <Input
                id="tariff-input"
                type="number"
                placeholder="e.g., 50.5"
                value={electricityTariff}
                onChange={(e) => setElectricityTariff(e.target.value)}
                min="0"
                step="0.01"
                className="bg-background"
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
                <Label htmlFor="period-select" className="block text-sm font-medium text-muted-foreground mb-1">Calculation Period:</Label>
                <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as Period)} name="period-select">
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="day">{periodLabels.day}</SelectItem>
                    <SelectItem value="week">{periodLabels.week}</SelectItem>
                    <SelectItem value="month">{periodLabels.month}</SelectItem>
                    <SelectItem value="year">{periodLabels.year}</SelectItem>
                </SelectContent>
                </Select>
            </div>
             <Button onClick={calculateConsumption} disabled={appliances.length === 0} className="w-full sm:w-auto">
                <CalculatorIcon className="mr-2 h-5 w-5" /> Calculate Total
            </Button>
        </div>
      </CardContent>

      {totalConsumptionKWh !== null && (
        <CardFooter className="mt-4">
          <Card className="w-full p-4 bg-primary/10 border-primary/30">
            <CardTitle className="text-lg text-primary mb-1">Total Estimated Consumption:</CardTitle>
            <p className="text-2xl font-bold text-primary">
              {totalConsumptionKWh.toFixed(2)} kWh 
              <span className="text-base font-normal text-primary/80"> {periodLabels[selectedPeriod]}</span>
            </p>
            {totalCost !== null && totalCost > 0 && (
                 <p className="text-xl font-bold text-primary mt-2">
                    Estimated Cost: NGN {totalCost.toFixed(2)}
                    <span className="text-sm font-normal text-primary/80"> {periodLabels[selectedPeriod]}</span>
                </p>
            )}
          </Card>
        </CardFooter>
      )}
       {appliances.length === 0 && totalConsumptionKWh === null && (
          <CardFooter className="mt-2">
             <p className="text-sm text-muted-foreground text-center w-full">
                Add some appliances to see your estimated energy consumption.
            </p>
          </CardFooter>
        )}
    </Card>
  );
}

