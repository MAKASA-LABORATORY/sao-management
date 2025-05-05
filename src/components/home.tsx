import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Calendar as CalendarIcon,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import ConcernForm from "./ConcernForm";
import AppointmentScheduler from "./AppointmentScheduler";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showConcernForm, setShowConcernForm] = useState(false);
  const [showAppointmentScheduler, setShowAppointmentScheduler] =
    useState(false);
  const [userRole, setUserRole] = useState("student"); // 'student' or 'staff'
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Limits for student submissions
  const [concernSubmissionCount, setConcernSubmissionCount] = useState(0);
  const [appointmentBookingCount, setAppointmentBookingCount] = useState(0);
  const MAX_CONCERNS = 5;
  const MAX_APPOINTMENTS = 2;

  // Mock data for dashboard
  const pendingConcerns = [
    {
      id: 1,
      title: "Financial Aid Question",
      category: "Financial",
      priority: "High",
      status: "Pending",
      date: "2023-06-15",
    },
    {
      id: 2,
      title: "Course Registration Issue",
      category: "Academic",
      priority: "Medium",
      status: "In Progress",
      date: "2023-06-14",
    },
    {
      id: 3,
      title: "Dormitory Maintenance",
      category: "Housing",
      priority: "Low",
      status: "Pending",
      date: "2023-06-13",
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      title: "Financial Aid Consultation",
      date: "2023-06-20",
      time: "10:00 AM",
      staff: "Dr. Johnson",
    },
    {
      id: 2,
      title: "Academic Advising",
      date: "2023-06-22",
      time: "2:30 PM",
      staff: "Prof. Smith",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "default";
      case "in progress":
        return "secondary";
      case "resolved":
        return "outline";
      default:
        return "default";
    }
  };

  const handleNewConcern = () => {
    setShowConcernForm(true);
    setShowAppointmentScheduler(false);
  };

  const handleNewAppointment = () => {
    setShowAppointmentScheduler(true);
    setShowConcernForm(false);
  };

  const handleConcernSubmit = (data: any) => {
    // Handle the concern submission
    setConcernSubmissionCount((prev) => prev + 1);
    // Here you would typically send the data to your backend
    console.log("Concern submitted:", data);
    setShowConcernForm(false); // Return to dashboard after submission
  };

  const handleAppointmentSchedule = (data: any) => {
    // Handle the appointment booking
    setAppointmentBookingCount((prev) => prev + 1);
    // Here you would typically send the data to your backend
    console.log("Appointment scheduled:", data);
    setShowAppointmentScheduler(false); // Return to dashboard after booking
  };

  const handleBackToDashboard = () => {
    setShowConcernForm(false);
    setShowAppointmentScheduler(false);
  };

  // Placeholder component for ConcernTracker until it's implemented
  const ConcernTracker = () => (
    <div className="bg-background p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">Concern Tracking</h3>
      <p className="text-muted-foreground mb-4">
        View and manage your submitted concerns
      </p>

      <div className="space-y-4">
        {pendingConcerns.map((concern) => (
          <div key={concern.id} className="p-4 border rounded-lg bg-card">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{concern.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Category: {concern.category}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getPriorityColor(concern.priority) as any}>
                  {concern.priority}
                </Badge>
                <Badge variant={getStatusColor(concern.status) as any}>
                  {concern.status}
                </Badge>
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Submitted on {concern.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col fixed top-0 bottom-0 left-0 z-10">
        <div className="flex items-center mb-8">
          <h1 className="text-xl font-bold">Student Affairs</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant={activeTab === "concerns" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("concerns")}
          >
            <FileText className="mr-2 h-4 w-4" />
            My Concerns
          </Button>

          <Button
            variant={activeTab === "appointments" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("appointments")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Appointments
          </Button>

          <Button
            variant={activeTab === "profile" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>

          {userRole === "staff" && (
            <Button
              variant={activeTab === "admin" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("admin")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin Panel
            </Button>
          )}
        </nav>

        <div className="mt-auto pt-4">
          <Separator className="my-4" />
          <div className="flex items-center gap-2 mb-4">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">
                {userRole === "student" ? "Student" : "Staff"}
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="border-b p-4 bg-card flex justify-between items-center fixed top-0 right-0 left-64 z-10">
          <h2 className="text-lg font-semibold">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "concerns" && "My Concerns"}
            {activeTab === "appointments" && "Appointments"}
            {activeTab === "profile" && "Profile"}
            {activeTab === "admin" && "Admin Panel"}
          </h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setUserRole(userRole === "student" ? "staff" : "student")
              }
            >
              Switch to {userRole === "student" ? "Staff" : "Student"} View
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto mt-16">
          {showConcernForm ? (
            <div>
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="mb-4"
              >
                Back to Dashboard
              </Button>
              <ConcernForm
                onSubmit={handleConcernSubmit}
                isSubmitting={false}
                submissionCount={concernSubmissionCount}
                maxSubmissions={MAX_CONCERNS}
              />
            </div>
          ) : showAppointmentScheduler ? (
            <div>
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="mb-4"
              >
                Back to Dashboard
              </Button>
              <AppointmentScheduler />
            </div>
          ) : activeTab === "dashboard" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Pending Concerns</CardTitle>
                    <CardDescription>
                      You have {pendingConcerns.length} pending concerns
                      {userRole === "student" && (
                        <span className="block text-xs mt-1">
                          {concernSubmissionCount}/{MAX_CONCERNS} submissions
                          used
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleNewConcern}
                      className="w-full"
                      disabled={
                        userRole === "student" &&
                        concernSubmissionCount >= MAX_CONCERNS
                      }
                    >
                      Submit New Concern
                      {userRole === "student" &&
                        concernSubmissionCount >= MAX_CONCERNS && (
                          <span className="ml-2 text-xs">(Limit reached)</span>
                        )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>
                      You have {upcomingAppointments.length} upcoming
                      appointments
                      {userRole === "student" && (
                        <span className="block text-xs mt-1">
                          {appointmentBookingCount}/{MAX_APPOINTMENTS} bookings
                          used
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleNewAppointment}
                      className="w-full"
                      disabled={
                        userRole === "student" &&
                        appointmentBookingCount >= MAX_APPOINTMENTS
                      }
                    >
                      Schedule Appointment
                      {userRole === "student" &&
                        appointmentBookingCount >= MAX_APPOINTMENTS && (
                          <span className="ml-2 text-xs">(Limit reached)</span>
                        )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Calendar</CardTitle>
                    <CardDescription>View your schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border w-full"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Concerns</CardTitle>
                    <CardDescription>
                      Your recently submitted concerns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingConcerns.map((concern) => (
                        <div
                          key={concern.id}
                          className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium">{concern.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={
                                  getPriorityColor(concern.priority) as any
                                }
                              >
                                {concern.priority}
                              </Badge>
                              <Badge
                                variant={getStatusColor(concern.status) as any}
                              >
                                {concern.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {concern.date}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>
                      Your scheduled appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium">{appointment.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs">
                                {appointment.date} at {appointment.time}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                with {appointment.staff}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : activeTab === "concerns" ? (
            <ConcernTracker />
          ) : activeTab === "appointments" ? (
            <AppointmentScheduler />
          ) : activeTab === "profile" ? (
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">John Doe</h3>
                    <p className="text-muted-foreground">
                      Student ID: 12345678
                    </p>
                    <p className="text-muted-foreground">
                      john.doe@university.edu
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Department
                        </p>
                        <p>Computer Science</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Year Level
                        </p>
                        <p>Junior</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>+1 (555) 123-4567</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>123 Campus Drive, University City</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : activeTab === "admin" && userRole === "staff" ? (
            <Tabs defaultValue="concerns">
              <TabsList className="mb-4">
                <TabsTrigger value="concerns">Manage Concerns</TabsTrigger>
                <TabsTrigger value="appointments">
                  Manage Appointments
                </TabsTrigger>
                <TabsTrigger value="users">Manage Users</TabsTrigger>
              </TabsList>
              <TabsContent value="concerns">
                <Card>
                  <CardHeader>
                    <CardTitle>All Student Concerns</CardTitle>
                    <CardDescription>
                      Review and manage student concerns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ConcernTracker />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Calendar</CardTitle>
                    <CardDescription>
                      Manage student appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AppointmentScheduler />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage student and staff accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>User management interface would go here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
