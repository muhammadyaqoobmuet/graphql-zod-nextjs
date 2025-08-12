"use client";
import { useUser } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  FolderOpen,
  Bug,
  LogOut,
  Plus,
  Search,
  Bell,
  Calendar,
  BarChart3,
  Users,
  Clock,
  Star,
} from "lucide-react";

const Dashboard = () => {
  const { user, loadUserFromToken, logout } = useUser() || {};
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("_productivity-track-token");
      if (!token) {
        router.push("/register");
        return;
      }
      if (loadUserFromToken) {
        await loadUserFromToken();
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const handleLogout = () => {
    logout?.();
    router.push("/register");
  };

  // Dummy project data
  const projects = [
    {
      id: 1,
      name: "E-Commerce Platform",
      description: "Next.js based modern e-commerce solution",
      status: "Active",
      progress: 75,
      members: 5,
      dueDate: "2025-08-15",
      priority: "High",
    },
    {
      id: 2,
      name: "Mobile App Design",
      description: "UI/UX design for fitness tracking app",
      status: "In Progress",
      progress: 45,
      members: 3,
      dueDate: "2025-08-20",
      priority: "Medium",
    },
    {
      id: 3,
      name: "API Documentation",
      description: "Complete REST API documentation",
      status: "Planning",
      progress: 10,
      members: 2,
      dueDate: "2025-08-25",
      priority: "Low",
    },
    {
      id: 4,
      name: "Database Migration",
      description: "Migrate from MySQL to PostgreSQL",
      status: "Completed",
      progress: 100,
      members: 4,
      dueDate: "2025-07-30",
      priority: "High",
    },
    {
      id: 5,
      name: "Security Audit",
      description: "Complete security review and fixes",
      status: "Active",
      progress: 60,
      members: 2,
      dueDate: "2025-09-01",
      priority: "Critical",
    },
    {
      id: 6,
      name: "Performance Optimization",
      description: "Optimize application performance",
      status: "Planning",
      progress: 5,
      members: 3,
      dueDate: "2025-09-10",
      priority: "Medium",
    },
  ];

  const sidebarItems = [
    {
      id: "projects",
      icon: FolderOpen,
      label: "Projects",
      count: projects.length,
    },
    { id: "issues", icon: Bug, label: "Issues", count: 12 },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Please log in to access dashboard</p>
            <Button onClick={() => router.push("/register")} className="mt-4">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Planning":
        return "bg-yellow-500";
      case "Completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive";
      case "High":
        return "default";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">
                ProductivePro
              </span>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.jpg" alt={user.email} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">Premium User</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab}
              </h1>
              <Badge variant="outline" className="text-xs">
                {projects.length} Total Projects
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* Create Project Button */}
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Active Projects</p>
                        <p className="text-2xl font-bold">
                          {projects.filter((p) => p.status === "Active").length}
                        </p>
                      </div>
                      <FolderOpen className="w-8 h-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Completed</p>
                        <p className="text-2xl font-bold">
                          {
                            projects.filter((p) => p.status === "Completed")
                              .length
                          }
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Team Members</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Avg Progress</p>
                        <p className="text-2xl font-bold">
                          {Math.round(
                            projects.reduce((acc, p) => acc + p.progress, 0) /
                              projects.length
                          )}
                          %
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {project.description}
                          </CardDescription>
                        </div>
                        <Star className="w-5 h-5 text-gray-400 hover:text-yellow-500 cursor-pointer" />
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-4">
                       

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{project.members} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(project.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <Separator />

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            Edit Project
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "issues" && (
            <div className="text-center py-12">
              <Bug className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Issues Coming Soon
              </h3>
              <p className="text-gray-500">
                Issue tracking functionality will be available soon.
              </p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Settings
              </h3>
              <p className="text-gray-500">
                Settings panel will be available soon.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
