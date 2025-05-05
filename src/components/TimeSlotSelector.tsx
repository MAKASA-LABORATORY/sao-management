import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Filter } from "lucide-react";

interface TimeSlot {
  id: string;
  time: string;
  status: "available" | "booked" | "pending";
}

interface TimeSlotSelectorProps {
  date?: Date;
  timeSlots?: TimeSlot[];
  onSelectTimeSlot?: (timeSlot: TimeSlot) => void;
  selectedTimeSlot?: string;
}

const TimeSlotSelector = ({
  date = new Date(),
  timeSlots = [
    { id: "1", time: "09:00 AM", status: "available" },
    { id: "2", time: "10:00 AM", status: "available" },
    { id: "3", time: "11:00 AM", status: "booked" },
    { id: "4", time: "12:00 PM", status: "pending" },
    { id: "5", time: "01:00 PM", status: "available" },
    { id: "6", time: "02:00 PM", status: "available" },
    { id: "7", time: "03:00 PM", status: "booked" },
    { id: "8", time: "04:00 PM", status: "available" },
  ],
  onSelectTimeSlot = () => {},
  selectedTimeSlot = "",
}: TimeSlotSelectorProps) => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedSlot, setSelectedSlot] = useState<string>(selectedTimeSlot);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    if (timeSlot.status === "available") {
      setSelectedSlot(timeSlot.id);
      onSelectTimeSlot(timeSlot);
    }
  };

  const filteredTimeSlots = timeSlots.filter((slot) => {
    if (filter === "all") return true;
    return slot.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300";
      case "booked":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">
          Select a Time Slot
        </h3>
        <p className="text-sm text-gray-500">{formatDate(date)}</p>
      </div>

      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Filter by:</span>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredTimeSlots.map((slot) => (
            <div
              key={slot.id}
              onClick={() => handleTimeSlotClick(slot)}
              className={`
                p-3 rounded-md border flex flex-col items-center justify-center cursor-pointer transition-all
                ${slot.status === "available" ? "hover:border-primary hover:bg-primary/5" : ""}
                ${selectedSlot === slot.id ? "border-primary bg-primary/10" : "border-gray-200"}
                ${slot.status !== "available" ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              <div className="flex items-center mb-1">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm font-medium">{slot.time}</span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs font-normal capitalize ${getStatusColor(slot.status)}`}
              >
                {slot.status}
              </Badge>
            </div>
          ))}
        </div>

        {filteredTimeSlots.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No time slots match your filter criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelector;
