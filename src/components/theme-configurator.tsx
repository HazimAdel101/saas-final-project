"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Color picker component
const ColorPicker = ({ color, onChange, label }: { color: string; onChange: (color: string) => void; label: string }) => {
  return (
    <div className="flex items-center gap-2">
      <Label className="w-32 text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="h-6 w-6 rounded-md border"
          style={{ backgroundColor: color }}
        />
        <Input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-24"
        />
        <Input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 p-0"
        />
      </div>
    </div>
  );
};

// Theme configurator component
export function ThemeConfigurator() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("primary");
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize with default values from CSS variables
  const [primaryColors, setPrimaryColors] = useState({
    50: "oklch(0.97 0.03 260)",
    100: "oklch(0.93 0.05 260)",
    200: "oklch(0.88 0.08 260)",
    300: "oklch(0.80 0.12 260)",
    400: "oklch(0.71 0.16 260)",
    500: "oklch(0.62 0.19 260)",
    600: "oklch(0.55 0.22 260)",
    700: "oklch(0.45 0.18 260)",
    800: "oklch(0.35 0.14 260)",
    900: "oklch(0.25 0.10 260)",
    950: "oklch(0.15 0.06 260)",
  });

  const [secondaryColors, setSecondaryColors] = useState({
    50: "oklch(0.97 0.03 220)",
    100: "oklch(0.93 0.05 220)",
    200: "oklch(0.88 0.08 220)",
    300: "oklch(0.80 0.12 220)",
    400: "oklch(0.71 0.16 220)",
    500: "oklch(0.62 0.19 220)",
    600: "oklch(0.55 0.22 220)",
    700: "oklch(0.45 0.18 220)",
    800: "oklch(0.35 0.14 220)",
    900: "oklch(0.25 0.10 220)",
    950: "oklch(0.15 0.06 220)",
  });

  const [accentColors, setAccentColors] = useState({
    50: "oklch(0.97 0.03 120)",
    100: "oklch(0.93 0.05 120)",
    200: "oklch(0.88 0.08 120)",
    300: "oklch(0.80 0.12 120)",
    400: "oklch(0.71 0.16 120)",
    500: "oklch(0.62 0.19 120)",
    600: "oklch(0.55 0.22 120)",
    700: "oklch(0.45 0.18 120)",
    800: "oklch(0.35 0.14 120)",
    900: "oklch(0.25 0.10 120)",
    950: "oklch(0.15 0.06 120)",
  });

  // Load colors from CSS when component mounts
  useEffect(() => {
    setMounted(true);
    
    // Function to get CSS variable value
    const getCssVariable = (name: string) => {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    };

    // Load primary colors
    const loadedPrimary = { ...primaryColors };
    Object.keys(loadedPrimary).forEach((key) => {
      const value = getCssVariable(`--color-primary-${key}`);
      if (value) loadedPrimary[key as keyof typeof loadedPrimary] = value;
    });
    setPrimaryColors(loadedPrimary);

    // Load secondary colors
    const loadedSecondary = { ...secondaryColors };
    Object.keys(loadedSecondary).forEach((key) => {
      const value = getCssVariable(`--color-secondary-${key}`);
      if (value) loadedSecondary[key as keyof typeof loadedSecondary] = value;
    });
    setSecondaryColors(loadedSecondary);

    // Load accent colors
    const loadedAccent = { ...accentColors };
    Object.keys(loadedAccent).forEach((key) => {
      const value = getCssVariable(`--color-accent-${key}`);
      if (value) loadedAccent[key as keyof typeof loadedAccent] = value;
    });
    setAccentColors(loadedAccent);
  }, []);

  // Apply colors to CSS variables
  const applyColors = () => {
    // Apply primary colors
    Object.entries(primaryColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-primary-${key}`, value);
    });

    // Apply secondary colors
    Object.entries(secondaryColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-secondary-${key}`, value);
    });

    // Apply accent colors
    Object.entries(accentColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-accent-${key}`, value);
    });

    // Close the popover
    setIsOpen(false);
  };

  // Reset colors to defaults
  const resetColors = () => {
    document.documentElement.style.cssText = "";
    window.location.reload();
  };

  // Export colors as CSS
  const exportColors = () => {
    let cssText = ":root {\n";
    
    // Add primary colors
    Object.entries(primaryColors).forEach(([key, value]) => {
      cssText += `  --color-primary-${key}: ${value};\n`;
    });
    
    // Add secondary colors
    Object.entries(secondaryColors).forEach(([key, value]) => {
      cssText += `  --color-secondary-${key}: ${value};\n`;
    });
    
    // Add accent colors
    Object.entries(accentColors).forEach(([key, value]) => {
      cssText += `  --color-accent-${key}: ${value};\n`;
    });
    
    cssText += "}";
    
    // Create a downloadable file
    const blob = new Blob([cssText], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "custom-colors.css";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate a color palette from a base color
  const generatePalette = (baseColor: string, targetState: "primary" | "secondary" | "accent") => {
    // This is a simplified algorithm - in a real app, you might want a more sophisticated color generation
    try {
      // Parse the OKLCH color
      const match = baseColor.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/);
      if (!match) return;
      
      const l = parseFloat(match[1]);
      const c = parseFloat(match[2]);
      const h = parseFloat(match[3]);
      
      const newPalette: Record<string, string> = {};
      
      // Generate shades
      newPalette["50"] = `oklch(${Math.min(0.97, l + 0.35)} ${Math.max(0.02, c - 0.16)} ${h})`;
      newPalette["100"] = `oklch(${Math.min(0.93, l + 0.31)} ${Math.max(0.03, c - 0.14)} ${h})`;
      newPalette["200"] = `oklch(${Math.min(0.88, l + 0.26)} ${Math.max(0.04, c - 0.11)} ${h})`;
      newPalette["300"] = `oklch(${Math.min(0.83, l + 0.18)} ${Math.max(0.06, c - 0.07)} ${h})`;
      newPalette["400"] = `oklch(${Math.min(0.75, l + 0.09)} ${Math.max(0.08, c - 0.03)} ${h})`;
      newPalette["500"] = `oklch(${l} ${c} ${h})`;
      newPalette["600"] = `oklch(${Math.max(0.1, l - 0.07)} ${Math.min(0.25, c + 0.03)} ${h})`;
      newPalette["700"] = `oklch(${Math.max(0.1, l - 0.17)} ${Math.min(0.25, c + 0.01)} ${h})`;
      newPalette["800"] = `oklch(${Math.max(0.1, l - 0.27)} ${Math.min(0.25, c - 0.04)} ${h})`;
      newPalette["900"] = `oklch(${Math.max(0.1, l - 0.37)} ${Math.min(0.25, c - 0.09)} ${h})`;
      newPalette["950"] = `oklch(${Math.max(0.1, l - 0.47)} ${Math.min(0.25, c - 0.13)} ${h})`;
      
      // Update the appropriate state
      if (targetState === "primary") {
        setPrimaryColors(newPalette as typeof primaryColors);
      } else if (targetState === "secondary") {
        setSecondaryColors(newPalette as typeof secondaryColors);
      } else if (targetState === "accent") {
        setAccentColors(newPalette as typeof accentColors);
      }
    } catch (error) {
      console.error("Error generating palette:", error);
    }
  };

  if (!mounted) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 z-50">
          <span className="mr-2">🎨</span> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" side="top">
        <Card>
          <CardHeader>
            <CardTitle>Theme Configurator</CardTitle>
            <CardDescription>
              Customize your design system colors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid w-full grid-cols-3">
                <TabsTrigger value="primary">Primary</TabsTrigger>
                <TabsTrigger value="secondary">Secondary</TabsTrigger>
                <TabsTrigger value="accent">Accent</TabsTrigger>
              </TabsList>

              <TabsContent value="primary" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Primary Colors</h3>
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      placeholder="Base color" 
                      className="h-8 w-40" 
                      defaultValue={primaryColors[500]}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => generatePalette(primaryColors[500], "primary")}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <ColorPicker 
                    color={primaryColors[50]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 50: color})} 
                    label="50 (Lightest)" 
                  />
                  <ColorPicker 
                    color={primaryColors[100]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 100: color})} 
                    label="100" 
                  />
                  <ColorPicker 
                    color={primaryColors[200]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 200: color})} 
                    label="200" 
                  />
                  <ColorPicker 
                    color={primaryColors[300]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 300: color})} 
                    label="300" 
                  />
                  <ColorPicker 
                    color={primaryColors[400]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 400: color})} 
                    label="400" 
                  />
                  <ColorPicker 
                    color={primaryColors[500]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 500: color})} 
                    label="500 (Base)" 
                  />
                  <ColorPicker 
                    color={primaryColors[600]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 600: color})} 
                    label="600" 
                  />
                  <ColorPicker 
                    color={primaryColors[700]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 700: color})} 
                    label="700" 
                  />
                  <ColorPicker 
                    color={primaryColors[800]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 800: color})} 
                    label="800" 
                  />
                  <ColorPicker 
                    color={primaryColors[900]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 900: color})} 
                    label="900" 
                  />
                  <ColorPicker 
                    color={primaryColors[950]} 
                    onChange={(color) => setPrimaryColors({...primaryColors, 950: color})} 
                    label="950 (Darkest)" 
                  />
                </div>
              </TabsContent>

              <TabsContent value="secondary" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Secondary Colors</h3>
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      placeholder="Base color" 
                      className="h-8 w-40" 
                      defaultValue={secondaryColors[500]}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => generatePalette(secondaryColors[500], "secondary")}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <ColorPicker 
                    color={secondaryColors[50]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 50: color})} 
                    label="50 (Lightest)" 
                  />
                  <ColorPicker 
                    color={secondaryColors[100]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 100: color})} 
                    label="100" 
                  />
                  <ColorPicker 
                    color={secondaryColors[200]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 200: color})} 
                    label="200" 
                  />
                  <ColorPicker 
                    color={secondaryColors[300]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 300: color})} 
                    label="300" 
                  />
                  <ColorPicker 
                    color={secondaryColors[400]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 400: color})} 
                    label="400" 
                  />
                  <ColorPicker 
                    color={secondaryColors[500]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 500: color})} 
                    label="500 (Base)" 
                  />
                  <ColorPicker 
                    color={secondaryColors[600]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 600: color})} 
                    label="600" 
                  />
                  <ColorPicker 
                    color={secondaryColors[700]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 700: color})} 
                    label="700" 
                  />
                  <ColorPicker 
                    color={secondaryColors[800]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 800: color})} 
                    label="800" 
                  />
                  <ColorPicker 
                    color={secondaryColors[900]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 900: color})} 
                    label="900" 
                  />
                  <ColorPicker 
                    color={secondaryColors[950]} 
                    onChange={(color) => setSecondaryColors({...secondaryColors, 950: color})} 
                    label="950 (Darkest)" 
                  />
                </div>
              </TabsContent>

              <TabsContent value="accent" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Accent Colors</h3>
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      placeholder="Base color" 
                      className="h-8 w-40" 
                      defaultValue={accentColors[500]}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => generatePalette(accentColors[500], "accent")}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <ColorPicker 
                    color={accentColors[50]} 
                    onChange={(color) => setAccentColors({...accentColors, 50: color})} 
                    label="50 (Lightest)" 
                  />
                  <ColorPicker 
                    color={accentColors[100]} 
                    onChange={(color) => setAccentColors({...accentColors, 100: color})} 
                    label="100" 
                  />
                  <ColorPicker 
                    color={accentColors[200]} 
                    onChange={(color) => setAccentColors({...accentColors, 200: color})} 
                    label="200" 
                  />
                  <ColorPicker 
                    color={accentColors[300]} 
                    onChange={(color) => setAccentColors({...accentColors, 300: color})} 
                    label="300" 
                  />
                  <ColorPicker 
                    color={accentColors[400]} 
                    onChange={(color) => setAccentColors({...accentColors, 400: color})} 
                    label="400" 
                  />
                  <ColorPicker 
                    color={accentColors[500]} 
                    onChange={(color) => setAccentColors({...accentColors, 500: color})} 
                    label="500 (Base)" 
                  />
                  <ColorPicker 
                    color={accentColors[600]} 
                    onChange={(color) => setAccentColors({...accentColors, 600: color})} 
                    label="600" 
                  />
                  <ColorPicker 
                    color={accentColors[700]} 
                    onChange={(color) => setAccentColors({...accentColors, 700: color})} 
                    label="700" 
                  />
                  <ColorPicker 
                    color={accentColors[800]} 
                    onChange={(color) => setAccentColors({...accentColors, 800: color})} 
                    label="800" 
                  />
                  <ColorPicker 
                    color={accentColors[900]} 
                    onChange={(color) => setAccentColors({...accentColors, 900: color})} 
                    label="900" 
                  />
                  <ColorPicker 
                    color={accentColors[950]} 
                    onChange={(color) => setAccentColors({...accentColors, 950: color})} 
                    label="950 (Darkest)" 
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetColors}>
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportColors}>
                Export
              </Button>
              <Button onClick={applyColors}>
                Apply
              </Button>
            </div>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeConfigurator;
