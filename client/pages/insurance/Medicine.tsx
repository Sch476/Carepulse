import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pill, Info, Star, ChevronRight, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Medicine {
  id: string;
  name: string;
  composition: string;
  rating: number;
  manufacturer: string;
  price: string;
  similarity: number;
}

const mockMedicines: Medicine[] = [
  {
    id: "1",
    name: "Amoxicillin Plus",
    composition: "Amoxicillin 500mg, Clavulanic Acid 125mg",
    rating: 4.8,
    manufacturer: "PharmaCorp",
    price: "$24.50",
    similarity: 98,
  },
  {
    id: "2",
    name: "Bio-Cillin",
    composition: "Amoxicillin 500mg",
    rating: 4.5,
    manufacturer: "BioMed Labs",
    price: "$18.20",
    similarity: 92,
  },
  {
    id: "3",
    name: "Amoxen 500",
    composition: "Amoxicillin 500mg",
    rating: 4.2,
    manufacturer: "Global Health",
    price: "$15.00",
    similarity: 89,
  },
  {
    id: "4",
    name: "Clavu-Amox",
    composition: "Amoxicillin 500mg, Clavulanic Acid 125mg",
    rating: 4.7,
    manufacturer: "Veda Pharma",
    price: "$22.00",
    similarity: 95,
  },
];

export default function MedicineFinder() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Medicine[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!search) return;
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setResults(mockMedicines);
      setIsSearching(false);
      toast.success(`Found ${mockMedicines.length} similar medicines`);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Medicine Similarity Finder
          </h1>
          <p className="text-muted-foreground">
            Find therapeutic alternatives and generic equivalents instantly.
          </p>
        </div>
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search medicine name (e.g. Amoxicillin)"
            className="pl-10 h-12 bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            className="absolute right-1 top-1 h-10 px-6 rounded-lg font-bold"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {results.length > 0 ? (
          results.map((med) => (
            <Card
              key={med.id}
              className="group border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-transparent hover:border-primary/20"
            >
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="w-full md:w-48 bg-slate-50 flex items-center justify-center p-8">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Pill className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-slate-900">
                          {med.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none"
                        >
                          {med.similarity}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">
                        {med.manufacturer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary">
                        {med.price}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Estimated Retail
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {med.composition.split(", ").map((comp) => (
                      <Badge
                        key={comp}
                        variant="outline"
                        className="bg-slate-50/50 border-slate-100 font-normal"
                      >
                        {comp}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-slate-900">
                          {med.rating}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          (120 Reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          Bio-equivalent
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="gap-2 group-hover:text-primary transition-colors"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Ready to Search
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Enter a medicine name above to find similar alternatives, generic
              versions, and composition analysis.
            </p>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <Card className="border-none shadow-sm bg-primary/5 border border-primary/10 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Expert Insights</p>
              <p className="text-sm text-slate-600">
                Therapeutic substitution can save up to{" "}
                <span className="font-bold text-primary">40%</span> on claim
                costs for this category.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
