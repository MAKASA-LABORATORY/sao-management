import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeSlotSelector from "./TimeSlotSelector";
import { format } from "date-fns";
import { CalendarIcon, Clock, Users } from "lucide-react";

interface AppointmentSchedulerProps {
  userRole?: "student" | "staff";
  onSchedule?: (appointmentData: AppointmentData) => void;
  bookingCount?: number;
  maxBookings?: number;
}

interface AppointmentData {
  date: Date;
  timeSlot: string;
  purpose: string;
  notes: string;
  appointmentType: string;
}

const AppointmentScheduler = ({
  userRole = "student",
  onSchedule,
  bookingCount = 0,
  maxBookings = Infinity,
}: AppointmentSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [appointmentPurpose, setAppointmentPurpose] = useState<string>("");
  const [appointmentNotes, setAppointmentNotes] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<string>("individual");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("calendar");

  const handleScheduleAppointment = () => {
    if (!selectedDate || !selectedTimeSlot || !appointmentPurpose) {
      // Handle validation error
      return;
    }

    const appointmentData: AppointmentData = {
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      purpose: appointmentPurpose,
      notes: appointmentNotes,
      appointmentType: appointmentType,
    };

    if (onSchedule) {
      onSchedule(appointmentData);
    }

    // Reset form
    setSelectedTimeSlot("");
    setAppointmentPurpose("");
    setAppointmentNotes("");
    setDialogOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <Tabs
        defaultValue="calendar"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Appointment Scheduler
            </h2>
            {userRole === "student" && maxBookings !== Infinity && (
              <p className="text-sm text-muted-foreground">
                {bookingCount}/{maxBookings} bookings used
              </p>
            )}
          </div>
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            {userRole === "staff" && (
              <TabsTrigger value="manage">Manage Availability</TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
                <CardDescription>
                  Choose a date for your appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => {
                    // Disable past dates and weekends
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      date < today || date.getDay() === 0 || date.getDay() === 6
                    );
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Available Time Slots
                </CardTitle>
                <CardDescription>
                  {selectedDate
                    ? `For ${format(selectedDate, "EEEE, MMMM d, yyyy")}`
                    : "Please select a date first"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <TimeSlotSelector
                    date={selectedDate}
                    selectedSlot={selectedTimeSlot}
                    onSelectTimeSlot={setSelectedTimeSlot}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    Select a date to view available time slots
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setDialogOpen(true)}
                  disabled={
                    !selectedDate ||
                    !selectedTimeSlot ||
                    (userRole === "student" && bookingCount >= maxBookings)
                  }
                  className="w-full"
                >
                  {userRole === "student" && bookingCount >= maxBookings
                    ? "Booking Limit Reached"
                    : "Continue to Book Appointment"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                View and manage your scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Placeholder for upcoming appointments */}
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Academic Advising</h3>
                    <p className="text-sm text-gray-500">
                      Monday, June 10, 2024 at 10:00 AM
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="destructive" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Financial Aid Consultation</h3>
                    <p className="text-sm text-gray-500">
                      Wednesday, June 12, 2024 at 2:30 PM
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="destructive" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {userRole === "staff" && (
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Availability</CardTitle>
                <CardDescription>
                  Set your available time slots for appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input id="start-time" type="time" defaultValue="09:00" />
                    </div>
                    <div>
                      <Label htmlFor="end-time">End Time</Label>
                      <Input id="end-time" type="time" defaultValue="17:00" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="slot-duration">Appointment Duration</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="slot-duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-4">
                    <Button>Save Availability Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              {selectedDate && selectedTimeSlot
                ? `Booking for ${format(selectedDate, "EEEE, MMMM d, yyyy")} at ${selectedTimeSlot}`
                : "Complete your appointment details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="appointment-type">Appointment Type</Label>
              <Select
                value={appointmentType}
                onValueChange={setAppointmentType}
              >
                <SelectTrigger id="appointment-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Individual Appointment</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="group">Group Consultation</SelectItem>
                  <SelectItem value="emergency">Emergency Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="appointment-purpose">
                Purpose of Appointment
              </Label>
              <Input
                id="appointment-purpose"
                value={appointmentPurpose}
                onChange={(e) => setAppointmentPurpose(e.target.value)}
                placeholder="Brief description of your appointment purpose"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="appointment-notes">Additional Notes</Label>
              <Textarea
                id="appointment-notes"
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                placeholder="Any additional information that might be helpful"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleScheduleAppointment}
              disabled={userRole === "student" && bookingCount >= maxBookings}
            >
              {userRole === "student" && bookingCount >= maxBookings
                ? "Booking Limit Reached"
                : "Schedule Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentScheduler;
