import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";

interface Concern {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "resolved" | "closed";
  dateSubmitted: string;
  lastUpdated: string;
  responses: Response[];
}

interface Response {
  id: string;
  message: string;
  from: string;
  date: string;
}

const ConcernTracker = ({ isStaff = false }) => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null);
  const [responseText, setResponseText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock data for concerns
  const mockConcerns: Concern[] = [
    {
      id: "1",
      title: "Financial Aid Application Issue",
      description:
        "I submitted my financial aid application two weeks ago but haven't received any updates.",
      category: "Financial",
      priority: "high",
      status: "in-progress",
      dateSubmitted: "2023-05-10T10:30:00",
      lastUpdated: "2023-05-15T14:20:00",
      responses: [
        {
          id: "r1",
          message:
            "We are reviewing your application and will update you soon.",
          from: "Financial Aid Officer",
          date: "2023-05-15T14:20:00",
        },
      ],
    },
    {
      id: "2",
      title: "Dormitory Maintenance Request",
      description:
        "The heating system in my dorm room (B-204) is not working properly.",
      category: "Housing",
      priority: "medium",
      status: "pending",
      dateSubmitted: "2023-05-12T09:15:00",
      lastUpdated: "2023-05-12T09:15:00",
      responses: [],
    },
    {
      id: "3",
      title: "Course Registration Problem",
      description:
        "I cannot register for COMP-301 even though I have completed all prerequisites.",
      category: "Academic",
      priority: "urgent",
      status: "resolved",
      dateSubmitted: "2023-05-08T11:45:00",
      lastUpdated: "2023-05-09T16:30:00",
      responses: [
        {
          id: "r2",
          message:
            "We have verified your prerequisites and fixed the registration issue.",
          from: "Academic Advisor",
          date: "2023-05-09T13:20:00",
        },
        {
          id: "r3",
          message: "Thank you for resolving this so quickly!",
          from: "Student",
          date: "2023-05-09T16:30:00",
        },
      ],
    },
  ];

  // Filter concerns based on search query and filters
  const filteredConcerns = mockConcerns.filter((concern) => {
    // Filter by tab
    if (selectedTab !== "all" && concern.status !== selectedTab) return false;

    // Filter by search query
    if (
      searchQuery &&
      !concern.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Filter by category
    if (
      categoryFilter &&
      categoryFilter !== "all-categories" &&
      concern.category !== categoryFilter
    )
      return false;

    // Filter by priority
    if (
      priorityFilter &&
      priorityFilter !== "all-priorities" &&
      concern.priority !== priorityFilter
    )
      return false;

    // Filter by status
    if (
      statusFilter &&
      statusFilter !== "all-statuses" &&
      concern.status !== statusFilter
    )
      return false;

    return true;
  });

  const handleConcernClick = (concern: Concern) => {
    setSelectedConcern(concern);
    setDialogOpen(true);
  };

  const handleResponseSubmit = () => {
    // In a real application, this would send the response to the backend
    console.log("Submitting response:", responseText);
    setResponseText("");
    setDialogOpen(false);
  };

  const handleStatusChange = (status: string) => {
    // In a real application, this would update the concern status in the backend
    console.log("Updating status to:", status);
    setDialogOpen(false);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Low
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Medium
          </Badge>
        );
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200"
          >
            High
          </Badge>
        );
      case "urgent":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Urgent
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" /> In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" /> Resolved
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" /> Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Concern Tracker</CardTitle>
              <CardDescription>
                {isStaff
                  ? "Manage and respond to student concerns"
                  : "Track the status of your submitted concerns"}
              </CardDescription>
            </div>
            {isStaff && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  Generate Report
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search concerns..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter:</span>
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">
                      All Categories
                    </SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-priorities">
                      All Priorities
                    </SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-statuses">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs
              defaultValue="all"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList className="grid grid-cols-4 w-full md:w-1/2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <ConcernTable
                  concerns={filteredConcerns}
                  onConcernClick={handleConcernClick}
                  getPriorityBadge={getPriorityBadge}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                <ConcernTable
                  concerns={filteredConcerns}
                  onConcernClick={handleConcernClick}
                  getPriorityBadge={getPriorityBadge}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </TabsContent>
              <TabsContent value="in-progress" className="mt-4">
                <ConcernTable
                  concerns={filteredConcerns}
                  onConcernClick={handleConcernClick}
                  getPriorityBadge={getPriorityBadge}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </TabsContent>
              <TabsContent value="resolved" className="mt-4">
                <ConcernTable
                  concerns={filteredConcerns}
                  onConcernClick={handleConcernClick}
                  getPriorityBadge={getPriorityBadge}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredConcerns.length} of {mockConcerns.length} concerns
          </div>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedConcern && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedConcern.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <span>ID: {selectedConcern.id}</span>
                <span>•</span>
                <span>
                  Submitted on {formatDate(selectedConcern.dateSubmitted)}
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Category</h4>
                  <Badge variant="outline">{selectedConcern.category}</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Priority</h4>
                  {getPriorityBadge(selectedConcern.priority)}
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  {getStatusBadge(selectedConcern.status)}
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Last Updated</h4>
                  <span className="text-sm">
                    {formatDate(selectedConcern.lastUpdated)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm bg-gray-50 p-3 rounded-md">
                  {selectedConcern.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Response History</h4>
                <div className="space-y-3">
                  {selectedConcern.responses.length > 0 ? (
                    selectedConcern.responses.map((response) => (
                      <div
                        key={response.id}
                        className="bg-gray-50 p-3 rounded-md"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">
                            {response.from}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(response.date)}
                          </span>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No responses yet.
                    </p>
                  )}
                </div>
              </div>

              {isStaff && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Add Response</h4>
                  <Textarea
                    placeholder="Type your response here..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              )}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              {isStaff && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleResponseSubmit}
                    disabled={!responseText.trim()}
                  >
                    Send Response
                  </Button>
                </div>
              )}
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

interface ConcernTableProps {
  concerns: Concern[];
  onConcernClick: (concern: Concern) => void;
  getPriorityBadge: (priority: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

const ConcernTable = ({
  concerns,
  onConcernClick,
  getPriorityBadge,
  getStatusBadge,
  formatDate,
}: ConcernTableProps) => {
  if (concerns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No concerns found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date Submitted</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {concerns.map((concern) => (
          <TableRow
            key={concern.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onConcernClick(concern)}
          >
            <TableCell className="font-medium">{concern.title}</TableCell>
            <TableCell>{concern.category}</TableCell>
            <TableCell>{getPriorityBadge(concern.priority)}</TableCell>
            <TableCell>{getStatusBadge(concern.status)}</TableCell>
            <TableCell>{formatDate(concern.dateSubmitted)}</TableCell>
            <TableCell>{formatDate(concern.lastUpdated)}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ConcernTracker;
